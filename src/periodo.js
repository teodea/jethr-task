// Il periodo di lavoro nell'anno: due date e i due numeri che ne discendono — i giorni che
// danno diritto alla detrazione, e la quota d'anno con cui si rapportano gli importi.
//
// Modulo puro: nessuna costante d'anno, nessuna cascata. Le date viaggiano come stringhe
// ISO «AAAA-MM-GG» — la forma che <input type="date"> produce e rilegge — e mai come
// oggetti Date: un Date porta con se' un fuso, e «2026-01-01» interpretato in locale
// diventa il 31 dicembre a ovest di Greenwich. Qui si conta in UTC, dove un giorno dura
// sempre 86.400.000 millisecondi.

const FORMATO_ISO = /^(\d{4})-(\d{2})-(\d{2})$/
const GIORNO_IN_MS = 86400000

// Denominatore fisso e insieme tetto: «la detrazione spettante ai sensi dell'articolo 13
// del TUIR e' calcolata in ragione del periodo di lavoro che, qualora sia riferito
// all'intero anno solare, e' sempre pari a 365 giorni, indipendentemente dalla circostanza
// che l'anno solare sia bisestile» - fonte: Circolare AdE n. 29/E del 14/12/2020, p. 14,
// https://www.agenziaentrate.gov.it/portale/documents/20143/2957155/Circolare+n.+29E+del+14+dicembre+2020.pdf/61cbef4d-5db8-9968-e28d-be33343879f5,
// anno 2020 (stessa regola in C.M. 326/E del 23/12/1997, par. 3.3).
// Ricerca: docs/ricerca/giorni-del-rapporto-e-ragguaglio-al-periodo.md, par. 1.4.
export const GIORNI_ANNO_FISCALE = 365

function bisestile(anno) {
  return (anno % 4 === 0 && anno % 100 !== 0) || anno % 400 === 0
}

// null se la stringa non e' una data reale: il 31 aprile e il 29 febbraio di un anno non
// bisestile passano il formato ma non esistono, e Date li farebbe scivolare al mese dopo
// senza dire niente.
function scomponi(iso) {
  if (typeof iso !== 'string') return null
  const trovato = FORMATO_ISO.exec(iso)
  if (!trovato) return null

  const anno = Number(trovato[1])
  const mese = Number(trovato[2])
  const giorno = Number(trovato[3])
  const istante = Date.UTC(anno, mese - 1, giorno)
  const data = new Date(istante)
  if (
    data.getUTCFullYear() !== anno ||
    data.getUTCMonth() !== mese - 1 ||
    data.getUTCDate() !== giorno
  ) {
    return null
  }
  return { anno, mese, giorno, istante }
}

export function dataValida(iso) {
  return scomponi(iso) !== null
}

export function annoDellaData(iso) {
  return scomponi(iso)?.anno ?? null
}

export function inizioAnno(anno) {
  return `${anno}-01-01`
}

export function fineAnno(anno) {
  return `${anno}-12-31`
}

/**
 * Le due date con cui il motore lavora, applicando i default dell'anno d'imposta a quelle
 * non passate. Solo defaulting: la validita' la decide `validaPeriodo` (src/validazione.js),
 * che resta l'unico posto in cui vive quella regola.
 */
export function periodoRichiesto({ dataInizio, dataFine, anno }) {
  return {
    dataInizio: dataInizio ?? inizioAnno(anno),
    dataFine: dataFine ?? fineAnno(anno),
  }
}

// Il 29 febbraio non conta [derivazione]. E' la regola che riproduce entrambi i numeri della
// Circolare 29/E/2020: l'anno bisestile intero vale 365 (366 - 1) e il semestre 1/1-30/6/2020
// vale «al massimo 181 giorni», non 182 (182 - 1). Un tetto secco a 365 spiegherebbe il primo
// e non il secondo. Irrilevante per gli anni d'imposta del prototipo (2025 e 2026, nessuno
// bisestile): sta qui perche' il primo anno bisestile non trovi il conteggio sbagliato in
// silenzio.
function ventinoveFebbraioCompresi(inizio, fine) {
  let quanti = 0
  for (let anno = inizio.anno; anno <= fine.anno; anno += 1) {
    if (!bisestile(anno)) continue
    const istante = Date.UTC(anno, 1, 29)
    if (istante >= inizio.istante && istante <= fine.istante) quanti += 1
  }
  return quanti
}

/**
 * I giorni del rapporto: giorni di **calendario** compresi fra le due date, estremi inclusi
 * — sabati, domeniche, festivi e ferie dentro, perche' la prassi sottrae i soli giorni senza
 * diritto ad alcuna retribuzione, neppure differita (istruzioni 730/2026, rigo C5; istruzioni
 * CU 2026, punto 6 — docs/ricerca/giorni-del-rapporto-e-ragguaglio-al-periodo.md, par. 1.2).
 * Non giorni lavorati: e' la cosa contro-intuitiva del conteggio, ed e' il motivo per cui la
 * pagina non disegna un calendario (un sabato colorato di grigio insegnerebbe il contrario).
 *
 * null se le date non sono leggibili o se la fine precede l'inizio: quel numero non esiste, e
 * restituirne uno qualsiasi lo farebbe finire dentro un calcolo.
 */
export function giorniDelRapporto(dataInizio, dataFine) {
  const inizio = scomponi(dataInizio)
  const fine = scomponi(dataFine)
  if (!inizio || !fine || fine.istante < inizio.istante) return null

  const compresi = (fine.istante - inizio.istante) / GIORNO_IN_MS + 1
  return compresi - ventinoveFebbraioCompresi(inizio, fine)
}

/**
 * La quota d'anno del rapporto: il `giorni / 365` con cui si rapportano al periodo gli
 * importi che la norma vuole rapportati — detrazione art. 13, trattamento integrativo,
 * ulteriore detrazione — e, nel prototipo, la retribuzione stessa (docs/ASSUNZIONI.md).
 */
export function quotaPeriodo(giorni) {
  return giorni / GIORNI_ANNO_FISCALE
}

/**
 * Il periodo come lo consuma il motore. `annoIntero` e' la condizione che accende il banner
 * e la nota sulla retribuzione effettiva: un rapporto che copre tutto l'anno vale 365 giorni
 * su 365, la quota vale 1 e la cascata torna esattamente quella di prima.
 */
export function periodoDelRapporto({ dataInizio, dataFine, anno }) {
  const estremi = periodoRichiesto({ dataInizio, dataFine, anno })
  const giorni = giorniDelRapporto(estremi.dataInizio, estremi.dataFine)
  return {
    ...estremi,
    giorni,
    quota: quotaPeriodo(giorni),
    annoIntero: giorni === GIORNI_ANNO_FISCALE,
  }
}

/**
 * Le mensilita' maturate nel periodo: il divisore del netto mensile. Dividere il netto di
 * mezzo anno per 13 darebbe la media su 13 mesi di cui se ne sono lavorati 6 — un numero che
 * nessuna busta ha mai visto. Rapportate alla stessa quota di tutto il resto, cosi' il netto
 * mensile resta «quanto prendi in un mese in cui lavori».
 */
export function mensilitaMaturate(mensilita, quota) {
  return mensilita * quota
}
