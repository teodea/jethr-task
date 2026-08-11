// La cascata RAL -> netto annuo: ogni voce dichiara cosa toglie (o aggiunge) e su quale base.
// Calcolo interno al centesimo pieno, senza arrotondamenti intermedi; unica eccezione
// imposta dalla fonte primaria: il quoziente delle detrazioni si assume nelle prime
// quattro cifre decimali (art. 13 c. 6 TUIR - docs/ricerca/arrotondamenti-e-quadratura.md).
// L'arrotondamento ai centesimi avviene solo in presentazione (src/presentazione.js).
//
// Il rapporto puo' coprire una parte dell'anno (issue #22), e allora entra in gioco `quota`
// = giorni del rapporto / 365 (src/periodo.js). Vale una regola sola, e va tenuta ferma:
// **si rapportano gli importi, mai le soglie**. Le soglie sono tutte scritte sul reddito
// complessivo, che per l'art. 8 TUIR e' una grandezza effettiva; l'unico ragguaglio ad anno
// scritto in tutto il pacchetto e' quello della L. 207/2024 art. 1 c. 5, che si autolimita
// («ai soli fini dell'individuazione della percentuale») e va in direzione opposta.
// Per questo la cascata di un periodo NON e' quella annua moltiplicata per la quota: a
// reddito effettivo piu' basso cambia la fascia, e con la fascia cambiano le voci che si
// accendono. Fonti e tabella riepilogativa:
// docs/ricerca/giorni-del-rapporto-e-ragguaglio-al-periodo.md, parr. 4 e 6.

import { COSTANTI_PER_ANNO, ANNO_CORRENTE } from './costanti/index.js'
import { validaInput, MENSILITA_DEFAULT } from './validazione.js'
import { periodoDelRapporto, mensilitaMaturate } from './periodo.js'

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

// La base e' la retribuzione **effettivamente percepita** nel periodo, non la RAL pattuita.
// Prima fascia e massimale restano invece i valori annui, senza ragguaglio: la mensilizzazione
// dell'1% e' un fatto della busta, e in sede di conguaglio di fine anno il confronto torna
// sulla soglia annua (Circ. INPS 6/2026, parr. 5 e 10.1 —
// docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md, par. 3.2). Il prototipo
// calcola a consuntivo annuo: e' esattamente la fotografia del conguaglio.
export function contributiDipendente(retribuzioneEffettiva, costanti) {
  const c = costanti.contributi
  const baseContributiva = Math.min(retribuzioneEffettiva, c.massimaleAnnuo)
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

// art. 13 cc. 1 e 1.1 TUIR. rc = reddito complessivo (effettivo: la fascia si sceglie su
// quello, non su un reddito ragguagliato ad anno).
//
// Tre regole diverse convivono qui dentro, e l'ordine in cui si applicano e' il punto:
//  1. l'importo di fascia si rapporta al periodo — «rapportata al periodo di lavoro
//     nell'anno» (art. 13 c. 1) e, in forma operativa, «1.955 x N. Giorni Lav. Dip / 365»
//     (istruzioni Redditi PF 2026, Fascicolo 1, rigo RN7, p. 141);
//  2. il minimo di 690 EUR e' un pavimento **assoluto** sul risultato gia' rapportato — la
//     norma lo scrive sulla detrazione «effettivamente spettante» e la Circ. AdE 4/E del
//     18/02/2022, par. 1.1, lo conferma: «tali misure minime competono laddove superiori al
//     risultato derivante dal calcolo di ragguaglio al periodo di spettanza nell'anno». Sta
//     nella sola lett. a), quindi non tocca le fasce b) e c);
//  3. la maggiorazione del c. 1.1 **non** si rapporta: «deve essere corrisposto ... per
//     intero ..., senza effettuare alcun ragguaglio al periodo di lavoro nell'anno»
//     (stessa Circ. 4/E/2022), e per questo si somma fuori.
// docs/ricerca/giorni-del-rapporto-e-ragguaglio-al-periodo.md, parr. 1.4 e 2.
export function detrazioneLavoroDipendente(rc, costanti, quota = 1) {
  const d = costanti.detrazioneLavoroDipendente
  let base
  if (rc <= d.sogliaFascia1) {
    base = Math.max(d.importoFascia1 * quota, d.minimo)
  } else if (rc <= d.sogliaFascia2) {
    const quoziente = troncaQuoziente((d.sogliaFascia2 - rc) / d.ampiezzaFascia2)
    base = (d.baseFascia2 + d.incrementoFascia2 * quoziente) * quota
  } else if (rc <= d.sogliaFascia3) {
    const quoziente = troncaQuoziente((d.sogliaFascia3 - rc) / d.ampiezzaFascia3)
    base = d.baseFascia3 * quoziente * quota
  } else {
    base = 0
  }
  const maggiorazione = rc > d.maggiorazioneDa && rc <= d.maggiorazioneFinoA ? d.maggiorazione : 0
  return base + maggiorazione
}

// L. 207/2024 art. 1 c. 6: «spetta un'ulteriore detrazione dall'imposta lorda, **rapportata
// al periodo di lavoro**» — il ragguaglio vale sull'importo pieno come sul decalage, mentre
// le due soglie restano sul reddito complessivo effettivo. Il quoziente del decalage resta
// al centesimo pieno: nessuna fonte fissa i decimali di quel rapporto (docs/ASSUNZIONI.md).
export function ulterioreDetrazione(rc, costanti, quota = 1) {
  const u = costanti.ulterioreDetrazione
  if (rc <= u.sogliaInferiore) return 0
  if (rc <= u.inizioDecalage) return u.importo * quota
  if (rc <= u.azzeramento) {
    return (u.importo * quota * (u.azzeramento - rc)) / (u.azzeramento - u.inizioDecalage)
  }
  return 0
}

// DL 3/2020 art. 1: erogazione, non detrazione. La condizione di capienza confronta
// l'imposta lorda con la sola detrazione art. 13 c. 1 (senza la maggiorazione di 65 EUR,
// che e' al c. 1.1), ridotta di 75 EUR. La regola per la fascia 15-28k (somma di
// detrazioni oltre l'imposta lorda) non scatta mai nel perimetro del prototipo, dove
// l'unica detrazione e' l'art. 13 ed e' sempre sotto l'imposta lorda per RC > 15.000.
// Nel periodo si rapportano tutti e tre i numeri della regola — l'importo («il trattamento
// integrativo di cui al comma 1 e' rapportato al periodo di lavoro», DL 3/2020 art. 1 c. 2),
// la detrazione del confronto e il correttivo di 75 EUR, anch'esso «rapportato al periodo di
// lavoro nell'anno» (art. 1 c. 1, come modificato dalla L. 207/2024 art. 1 c. 3). La soglia
// dei 15.000 no: e' scritta sul reddito complessivo, ed e' proprio quella che fa entrare nel
// trattamento un rapporto breve a RAL piena.
export function trattamentoIntegrativo(rc, impostaLorda, costanti, quota = 1) {
  const t = costanti.trattamentoIntegrativo
  if (rc > t.sogliaRedditoComplessivo) return 0
  const d = costanti.detrazioneLavoroDipendente
  const detrazioneComma1 = rc <= d.sogliaFascia1 ? Math.max(d.importoFascia1 * quota, d.minimo) : 0
  return impostaLorda > detrazioneComma1 - t.riduzioneDetrazione * quota ? t.importo * quota : 0
}

// L. 207/2024 art. 1 cc. 4-5: erogazione esente, e l'unica voce in cui il ragguaglio ad anno
// lavora **contro** il rapporto breve. L'importo non si rapporta — e' una percentuale del
// reddito effettivo, che scala gia' da se': rapportarla lo ridurrebbe due volte. Si rapporta
// invece il reddito che sceglie la **percentuale**: «ai soli fini dell'individuazione della
// percentuale applicabile ai sensi del comma 4 il reddito di lavoro dipendente e' rapportato
// all'intero anno» (c. 5), cioe' effettivo / quota. Un mezzo anno da 13.600 ha teorico
// ~27.000 e prende il 4,8%, non il 5,3%. Procedimento in tre passi ed esempio svolto:
// Circ. AdE 4/E del 16/05/2025, p. 10 (docs/ricerca/giorni-del-rapporto-...md, par. 3.2).
export function sommaIntegrativa(rc, redditoLavoroDipendente, costanti, quota = 1) {
  const s = costanti.sommaIntegrativa
  if (rc > s.sogliaRedditoComplessivo) return 0
  const redditoRagguagliatoAdAnno = redditoLavoroDipendente / quota
  const fascia = s.fasce.find(({ fino }) => redditoRagguagliatoAdAnno <= fino)
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
export function calcolaCascata({
  ral,
  mensilita = MENSILITA_DEFAULT,
  anno = ANNO_CORRENTE,
  dataInizio,
  dataFine,
}) {
  const costanti = COSTANTI_PER_ANNO[anno]
  if (!costanti) throw new RangeError(`anno d'imposta non supportato: ${anno}`)

  const periodo = periodoDelRapporto({ dataInizio, dataFine, anno })
  const validazione = validaInput(
    { ral, mensilita, dataInizio: periodo.dataInizio, dataFine: periodo.dataFine },
    costanti,
  )
  if (!validazione.valida) {
    throw new RangeError(validazione.errori.join('; '))
  }

  // La prima voce della cascata, e la sola che la RAL non sia gia': la RAL resta quella
  // pattuita in contratto (CONTEXT.md), il motore ne deriva quanto se ne percepisce nel
  // periodo. Da qui in poi tutto poggia su questo numero, mai piu' sulla RAL.
  const retribuzioneEffettiva = ral * periodo.quota

  const contributi = contributiDipendente(retribuzioneEffettiva, costanti)
  const imponibileFiscale = retribuzioneEffettiva - contributi.totale
  const redditoComplessivo = imponibileFiscale // un solo rapporto, nessun altro reddito (docs/ASSUNZIONI.md)

  const lorda = irpefLorda(imponibileFiscale, costanti)
  const detrazioneLavoro = detrazioneLavoroDipendente(redditoComplessivo, costanti, periodo.quota)
  const detrazioneUlteriore = ulterioreDetrazione(redditoComplessivo, costanti, periodo.quota)
  const detrazioniSpettanti = detrazioneLavoro + detrazioneUlteriore
  const detrazioniEffettive = Math.min(lorda, detrazioniSpettanti) // capienza
  const irpefNetta = lorda - detrazioniEffettive

  const trattamento = trattamentoIntegrativo(redditoComplessivo, lorda, costanti, periodo.quota)
  const somma = sommaIntegrativa(redditoComplessivo, redditoComplessivo, costanti, periodo.quota)

  const addizionaliDovute = irpefNetta > 0
  const regionale = addizionaliDovute ? addizionaleRegionale(imponibileFiscale, costanti) : 0
  const comunale = addizionaliDovute ? addizionaleComunale(imponibileFiscale, costanti) : 0

  const erogazioni = trattamento + somma
  const nettoAnnuo =
    retribuzioneEffettiva - contributi.totale - irpefNetta - regionale - comunale + erogazioni

  return {
    anno,
    ral,
    mensilita,
    dataInizio: periodo.dataInizio,
    dataFine: periodo.dataFine,
    giorniRapporto: periodo.giorni,
    quotaPeriodo: periodo.quota,
    annoIntero: periodo.annoIntero,
    retribuzioneEffettiva,
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
    mensilitaMaturate: mensilitaMaturate(mensilita, periodo.quota),
    nettoMensile: nettoAnnuo / mensilitaMaturate(mensilita, periodo.quota),
    avvisi: validazione.avvisi,
  }
}

// Le voci che possono passare da zero a positive, o viceversa, per il solo effetto delle
// date. Sono tutte e sole quelle governate da una soglia sul reddito complessivo: le altre
// (contributi, IRPEF, imponibile) cambiano di importo e non di stato.
const VOCI_CON_SOGLIA = [
  'ulterioreDetrazione',
  'trattamentoIntegrativo',
  'sommaIntegrativa',
  'addizionaleRegionale',
  'addizionaleComunale',
]

/**
 * Cosa cambia **di stato** rispetto alla stessa RAL su tutto l'anno: le voci che il periodo
 * accende e quelle che spegne. E' la differenza fra il rapportare importi e lo spostare
 * fasce, ed e' l'unica cosa che una percentuale a mente non riesce a prevedere — a RAL
 * 30.000 su mezzo anno trattamento e somma integrativa passano da zero a positivi.
 *
 * Sta qui e non nei testi perche' e' dominio: il confronto e' fra due cascate, e a deciderlo
 * sono le soglie di legge. La lingua che ne esce e' di src/testi.js.
 */
export function cambiDiStatoDelPeriodo(cascata) {
  if (cascata.annoIntero) return { accese: [], spente: [] }

  const annoIntero = calcolaCascata({
    ral: cascata.ral,
    mensilita: cascata.mensilita,
    anno: cascata.anno,
  })

  const accese = VOCI_CON_SOGLIA.filter((voce) => cascata[voce] > 0 && annoIntero[voce] === 0)
  const spente = VOCI_CON_SOGLIA.filter((voce) => cascata[voce] === 0 && annoIntero[voce] > 0)
  return { accese, spente }
}
