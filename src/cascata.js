// La cascata RAL -> netto annuo: ogni voce dichiara cosa toglie (o aggiunge) e su quale base.
// Calcolo interno al centesimo pieno, senza arrotondamenti intermedi; unica eccezione
// imposta dalla fonte primaria: il quoziente delle detrazioni si assume nelle prime
// quattro cifre decimali (art. 13 c. 6 TUIR - docs/ricerca/arrotondamenti-e-quadratura.md).
// L'arrotondamento ai centesimi avviene solo in presentazione (src/presentazione.js).

import { ANNO_CORRENTE } from './costanti/index.js'
import { costantiPerLuogo } from './luoghi.js'
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

// Una detrazione dell'addizionale, per fascia di imponibile. `rampa` copre l'unico caso non
// tabellare censito in Italia (Bolzano: 125 EUR moltiplicati per il rapporto fra
// l'imponibile diminuito di 50.000 e 25.000, con tetto a 125).
function detrazioneAddizionale(imponibileFiscale, { da, finoA, importo, rampa }) {
  if (imponibileFiscale < da) return 0
  if (finoA != null && imponibileFiscale > finoA) return 0
  if (!rampa) return importo
  return Math.min(importo, (importo * (imponibileFiscale - rampa.da)) / rampa.ampiezza)
}

/**
 * UNA funzione per entrambe le addizionali, applicata due volte. Regionale e comunale hanno
 * destinatario, base normativa e delibere proprie — e restano due voci distinte in cascata,
 * come il glossario impone — ma la FORMA della regola e' la stessa per tutti i 7.896 comuni
 * e i 21 enti impositori censiti (ricerca issue #18, par. 6). Prima erano due funzioni con
 * due forme diverse: una sapeva fare gli scaglioni ma non l'esenzione, l'altra il contrario.
 * Per l'Italia intera servono entrambe le cose a entrambe, e il selettore toglie codice
 * invece di aggiungerne.
 *
 * L'ordine dei quattro passi e' dominio, non implementazione:
 *
 *  1. esenzione a scalino — sotto la soglia non e' dovuta; sopra si paga sull'INTERO
 *     imponibile, mai sulla sola eccedenza (D.Lgs. 360/1998 art. 1 c. 3-bis: «nel caso di
 *     superamento del suddetto limite, la stessa si applica al reddito complessivo»). La
 *     deduzione di Trento, pari alla soglia che la fa perdere, e' esattamente questo.
 *  2. varianti — alcuni enti sostituiscono l'INTERA scala sotto una soglia di reddito
 *     invece di esentare (FVG 0,70% fino a 15.000; Umbria e Lazio fino a 28.000). E' una
 *     scala alternativa, non un primo scaglione: letta come progressiva darebbe un numero
 *     piu' basso e sbagliato.
 *  3. scaglioni progressivi sull'imponibile, sui confini statali (D.L. 138/2011 art. 1
 *     c. 11 per i comuni, D.Lgs. 68/2011 art. 6 per le regioni). L'aliquota unica e' il caso
 *     a un solo scaglione, aperto.
 *  4. detrazioni per fascia, con pavimento a zero: «non sorge alcun credito d'imposta» e' la
 *     formula ricorrente delle delibere regionali.
 */
export function addizionale(imponibileFiscale, regola) {
  if (regola.esenzioneFinoA != null && imponibileFiscale <= regola.esenzioneFinoA) return 0

  const variante = (regola.varianti ?? []).find(
    ({ seImponibileFinoA }) => imponibileFiscale <= seImponibileFinoA,
  )
  const lorda = perScaglioni(imponibileFiscale, variante ? variante.scaglioni : regola.scaglioni)

  const detratto = (regola.detrazioni ?? []).reduce(
    (totale, detrazione) => totale + detrazioneAddizionale(imponibileFiscale, detrazione),
    0,
  )
  return Math.max(0, lorda - detratto)
}

// La cascata completa. Le addizionali sono calcolate DOPO l'IRPEF netta perche' la loro
// debenza dipende da essa (gate "IRPEF netta > 0", D.Lgs. 446/1997 art. 50 c. 2 e
// D.Lgs. 360/1998 art. 1 c. 4 - scelta registrata in docs/ASSUNZIONI.md).
export function calcolaCascata({
  ral,
  mensilita = MENSILITA_DEFAULT,
  anno = ANNO_CORRENTE,
  comune = null,
}) {
  // Il contesto del calcolo non e' piu' il solo anno: e' la coppia `{ anno, comune }`. Due
  // voci su quattordici dipendono dal luogo, e con loro il censimento dei salti — lo
  // scalino dell'esenzione comunale si sposta da comune a comune. `comune` a null e' il
  // luogo predefinito (src/luoghi.js): tiene il motore usabile senza caricare i dati
  // dell'Italia intera.
  const costanti = costantiPerLuogo(anno, comune)

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
  const regionale = addizionaliDovute
    ? addizionale(imponibileFiscale, costanti.addizionaleRegionale)
    : 0
  const comunale = addizionaliDovute
    ? addizionale(imponibileFiscale, costanti.addizionaleComunale)
    : 0

  const erogazioni = trattamento + somma
  const nettoAnnuo = ral - contributi.totale - irpefNetta - regionale - comunale + erogazioni

  return {
    anno,
    // Il comune viaggia col risultato perche' chi lo riceve — presentazione, testi, avviso
    // sullo scalino — deve poter ritrovare le STESSE costanti da cui questo numero e' uscito.
    // Prima bastava l'anno; ora rideriverle dal solo anno darebbe le aliquote di Milano a
    // chiunque, che e' esattamente il difetto che questa issue chiude.
    comune,
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
