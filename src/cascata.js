// La cascata RAL -> netto annuo: ogni voce dichiara cosa toglie (o aggiunge) e su quale base.
// Calcolo interno al centesimo pieno, senza arrotondamenti intermedi; unica eccezione
// imposta dalla fonte primaria: il quoziente delle detrazioni si assume nelle prime
// quattro cifre decimali (art. 13 c. 6 TUIR - docs/ricerca/arrotondamenti-e-quadratura.md).
// L'arrotondamento ai centesimi avviene solo in presentazione (src/presentazione.js).

import { COSTANTI_PER_ANNO, ANNO_CORRENTE } from './costanti/index.js'
import { validaInput, MENSILITA_DEFAULT } from './validazione.js'

// art. 13 c. 6 TUIR: "si assume nelle prime quattro cifre decimali" = troncamento.
// L'epsilon compensa i quozienti che in decimale sono esatti ma in binario cadono
// un'ulp sotto (es. 3.770/13.000 = 0,29): senza, il troncamento li sbaglierebbe di 0,0001.
export function troncaQuoziente(quoziente) {
  return Math.trunc(quoziente * 10000 + 1e-7) / 10000
}

function perScaglioni(base, scaglioni) {
  let totale = 0
  let precedente = 0
  for (const { fino, aliquota } of scaglioni) {
    if (base <= precedente) break
    totale += (Math.min(base, fino) - precedente) * aliquota
    precedente = fino
  }
  return totale
}

export function contributiDipendente(ral, costanti) {
  const c = costanti.contributi
  const baseContributiva = Math.min(ral, c.massimaleAnnuo)
  const ivs = c.aliquotaIvsDipendente * baseContributiva
  const aggiuntivo = c.aliquotaAggiuntiva * Math.max(0, baseContributiva - c.primaFasciaAnnua)
  return { baseContributiva, ivs, aggiuntivo, totale: ivs + aggiuntivo }
}

export function irpefLorda(imponibileFiscale, costanti) {
  return perScaglioni(imponibileFiscale, costanti.irpef.scaglioni)
}

export function aliquotaMarginale(imponibileFiscale, costanti) {
  for (const { fino, aliquota } of costanti.irpef.scaglioni) {
    if (imponibileFiscale <= fino) return aliquota
  }
  return costanti.irpef.scaglioni.at(-1).aliquota
}

// art. 13 cc. 1 e 1.1 TUIR, anno intero (365/365). rc = reddito complessivo.
export function detrazioneLavoroDipendente(rc, costanti) {
  const d = costanti.detrazioneLavoroDipendente
  let base
  if (rc <= d.sogliaFascia1) {
    base = Math.max(d.importoFascia1, d.minimo)
  } else if (rc <= d.sogliaFascia2) {
    const quoziente = troncaQuoziente((d.sogliaFascia2 - rc) / d.ampiezzaFascia2)
    base = d.baseFascia2 + d.incrementoFascia2 * quoziente
  } else if (rc <= d.sogliaFascia3) {
    const quoziente = troncaQuoziente((d.sogliaFascia3 - rc) / d.ampiezzaFascia3)
    base = d.baseFascia3 * quoziente
  } else {
    base = 0
  }
  const maggiorazione = rc > d.maggiorazioneDa && rc <= d.maggiorazioneFinoA ? d.maggiorazione : 0
  return base + maggiorazione
}

// L. 207/2024 art. 1 c. 6. Il quoziente resta al centesimo pieno: nessuna fonte
// fissa i decimali di questo rapporto (docs/ASSUNZIONI.md).
export function ulterioreDetrazione(rc, costanti) {
  const u = costanti.ulterioreDetrazione
  if (rc <= u.sogliaInferiore) return 0
  if (rc <= u.inizioDecalage) return u.importo
  if (rc <= u.azzeramento) return (u.importo * (u.azzeramento - rc)) / (u.azzeramento - u.inizioDecalage)
  return 0
}

// DL 3/2020 art. 1: erogazione, non detrazione. La condizione di capienza confronta
// l'imposta lorda con la sola detrazione art. 13 c. 1 (senza la maggiorazione di 65 EUR,
// che e' al c. 1.1), ridotta di 75 EUR. La regola per la fascia 15-28k (somma di
// detrazioni oltre l'imposta lorda) non scatta mai nel perimetro del prototipo, dove
// l'unica detrazione e' l'art. 13 ed e' sempre sotto l'imposta lorda per RC > 15.000.
export function trattamentoIntegrativo(rc, impostaLorda, costanti) {
  const t = costanti.trattamentoIntegrativo
  if (rc > t.sogliaRedditoComplessivo) return 0
  const d = costanti.detrazioneLavoroDipendente
  const detrazioneComma1 = rc <= d.sogliaFascia1 ? Math.max(d.importoFascia1, d.minimo) : 0
  return impostaLorda > detrazioneComma1 - t.riduzioneDetrazione ? t.importo : 0
}

// L. 207/2024 art. 1 cc. 4-5: erogazione esente. La percentuale si individua sul reddito
// di lavoro dipendente annuo (= rc nel perimetro del prototipo) e si applica allo stesso.
export function sommaIntegrativa(rc, redditoLavoroDipendente, costanti) {
  const s = costanti.sommaIntegrativa
  if (rc > s.sogliaRedditoComplessivo) return 0
  const fascia = s.fasce.find(({ fino }) => redditoLavoroDipendente <= fino)
  return fascia.percentuale * redditoLavoroDipendente
}

// Scaglioni progressivi come l'IRPEF (D.Lgs. 68/2011 art. 6; art. 72 L.R. Lombardia 10/2003).
export function addizionaleRegionale(imponibileFiscale, costanti) {
  return perScaglioni(imponibileFiscale, costanti.addizionaleRegionale.scaglioni)
}

// Soglia secca (D.Lgs. 360/1998 art. 1 c. 3-bis): sopra l'esenzione si paga sull'INTERO imponibile.
export function addizionaleComunale(imponibileFiscale, costanti) {
  const a = costanti.addizionaleComunale
  return imponibileFiscale > a.esenzioneFinoA ? a.aliquota * imponibileFiscale : 0
}

// La cascata completa. Le addizionali sono calcolate DOPO l'IRPEF netta perche' la loro
// debenza dipende da essa (gate "IRPEF netta > 0", D.Lgs. 446/1997 art. 50 c. 2 e
// D.Lgs. 360/1998 art. 1 c. 4 - scelta registrata in docs/ASSUNZIONI.md).
export function calcolaCascata({ ral, mensilita = MENSILITA_DEFAULT, anno = ANNO_CORRENTE }) {
  const costanti = COSTANTI_PER_ANNO[anno]
  if (!costanti) throw new RangeError(`anno d'imposta non supportato: ${anno}`)

  const validazione = validaInput({ ral, mensilita }, costanti)
  if (!validazione.valida) {
    throw new RangeError(validazione.errori.join('; '))
  }

  const contributi = contributiDipendente(ral, costanti)
  const imponibileFiscale = ral - contributi.totale
  const redditoComplessivo = imponibileFiscale // un solo rapporto, nessun altro reddito (docs/ASSUNZIONI.md)

  const lorda = irpefLorda(imponibileFiscale, costanti)
  const detrazioneLavoro = detrazioneLavoroDipendente(redditoComplessivo, costanti)
  const detrazioneUlteriore = ulterioreDetrazione(redditoComplessivo, costanti)
  const detrazioniSpettanti = detrazioneLavoro + detrazioneUlteriore
  const detrazioniEffettive = Math.min(lorda, detrazioniSpettanti) // capienza
  const irpefNetta = lorda - detrazioniEffettive

  const trattamento = trattamentoIntegrativo(redditoComplessivo, lorda, costanti)
  const somma = sommaIntegrativa(redditoComplessivo, redditoComplessivo, costanti)

  const addizionaliDovute = irpefNetta > 0
  const regionale = addizionaliDovute ? addizionaleRegionale(imponibileFiscale, costanti) : 0
  const comunale = addizionaliDovute ? addizionaleComunale(imponibileFiscale, costanti) : 0

  const erogazioni = trattamento + somma
  const nettoAnnuo = ral - contributi.totale - irpefNetta - regionale - comunale + erogazioni

  return {
    anno,
    ral,
    mensilita,
    baseContributiva: contributi.baseContributiva,
    contributiDipendente: contributi.totale,
    contributiIvs: contributi.ivs,
    contributoAggiuntivo: contributi.aggiuntivo,
    imponibileFiscale,
    redditoComplessivo,
    irpefLorda: lorda,
    detrazioneLavoroDipendente: detrazioneLavoro,
    ulterioreDetrazione: detrazioneUlteriore,
    detrazioniSpettanti,
    detrazioniEffettive,
    irpefNetta,
    aliquotaMarginale: aliquotaMarginale(imponibileFiscale, costanti),
    aliquotaMedia: imponibileFiscale > 0 ? irpefNetta / imponibileFiscale : 0,
    addizionaliDovute,
    addizionaleRegionale: regionale,
    addizionaleComunale: comunale,
    trattamentoIntegrativo: trattamento,
    sommaIntegrativa: somma,
    erogazioni,
    nettoAnnuo,
    nettoMensile: nettoAnnuo / mensilita,
    avvisi: validazione.avvisi,
  }
}
