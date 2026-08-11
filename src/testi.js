// Testi in lingua dell'interfaccia: un unico file, cosi' la UI non contiene stringhe e
// il registro del linguaggio si legge tutto insieme.
//
// Tre regole, ognuna con la sua ragione:
//
// 1. Nessun numero scritto a mano dentro un testo. Ogni cifra citata e' interpolata dalle
//    costanti dell'anno della cascata. Con due set attivi (2025 e 2026) un "33%" hardcodato
//    sarebbe falso meta' delle volte e nessun test se ne accorgerebbe: il testo seguirebbe
//    il codice solo per coincidenza. Vale anche per scaglioni, soglie e aliquote locali.
//    La fonte dei valori resta `src/costanti/<anno>.js`, dove ogni riga porta la sua.
//    Presidio: test/testi.test.js confronta gli stessi testi sui due anni.
//
// 2. Le etichette rispettano il glossario (CONTEXT.md), incluse le liste _Avoid_: i
//    contributi non stanno mai sotto "tasse", un'erogazione non e' una "trattenuta", il
//    trattamento integrativo non si chiama "bonus Renzi", le aliquote non compaiono mai
//    senza aggettivo.
//
// 3. Le stringhe rivolte all'utente usano accenti e apostrofi veri (e', piu', perche' si
//    scrivono con l'accento) e l'apostrofo e' sempre quello tipografico U+2019, mai l'apice
//    dritto: nella stessa frase i due si vedono, e la pagina li mette in fila. I commenti
//    restano in ASCII come nel resto del repo: sono due pubblici diversi, e "mensilita'"
//    stampato a schermo e' un difetto visibile.
//
// Le spiegazioni sono in seconda persona e non usano termini di dominio non spiegati: il
// destinatario e' un dipendente, non un sostituto d'imposta. Il termine tecnico vive
// nell'etichetta, la lingua comune nella spiegazione.

import { COSTANTI_PER_ANNO, FONTI_PER_ANNO } from './costanti/index.js'
import { zoneNonMonotonia } from './discontinuita.js'

const EURO = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  // Stessa ragione di EURO_CENTESIMI qui sotto e di formattaImporto (src/formato.js): senza,
  // CLDR scrive "1000 € pieni fra 20.000 € e 32.000 €" nella stessa riga, e il numero non
  // raggruppato in mezzo a due raggruppati si legge come un refuso, non come una regola.
  useGrouping: 'always',
})

const EURO_CENTESIMI = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // CLDR omette il separatore sotto le cinque cifre in italiano ("1801,96"), ma una busta
  // paga lo scrive sempre — e due numeri hero affiancati, uno raggruppato e uno no, si
  // leggono come un difetto invece che come una regola di locale.
  useGrouping: 'always',
})

const PERCENTUALE = new Intl.NumberFormat('it-IT', {
  style: 'percent',
  maximumFractionDigits: 2,
})

// Esposti perche' i numeri mostrati dall'interfaccia si scrivano come quelli citati dentro
// i testi: un netto reso "23.425,48 €" nell'eroe e "23425.48" in una nota sarebbero due
// voci diverse della stessa pagina.
export const formattaEuro = (valore) => EURO_CENTESIMI.format(valore)
export const formattaPercentuale = (quota) => PERCENTUALE.format(quota)

// "23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre" — generata, mai trascritta.
function descriviScaglioni(scaglioni) {
  return scaglioni
    .map(({ fino, aliquota }) =>
      fino === Infinity
        ? `${PERCENTUALE.format(aliquota)} oltre`
        : `${PERCENTUALE.format(aliquota)} fino a ${EURO.format(fino)}`,
    )
    .join(', ')
}

// L'ordine in cui le voci compongono la cascata. La UI non deve ricostruirlo da sola:
// l'ordine e' dominio (ogni passo parte da dove e' arrivato il precedente), non layout.
export const ORDINE_VOCI = [
  'ral',
  'contributiDipendente',
  'imponibileFiscale',
  'irpefLorda',
  'detrazioneLavoroDipendente',
  'ulterioreDetrazione',
  'detrazioniEffettive',
  'irpefNetta',
  'addizionaleRegionale',
  'addizionaleComunale',
  'trattamentoIntegrativo',
  'sommaIntegrativa',
  'nettoAnnuo',
  'nettoMensile',
]

// L'etichetta che introduce il link alla fonte. Sta qui e non nella pagina per la stessa
// ragione di tutte le altre: la UI non contiene stringhe (vedi l'intestazione del file).
export const ETICHETTA_FONTE = 'Fonte'

// Quale gruppo di costanti sta dietro ogni voce della cascata, e quindi quale fonte primaria
// le tocca. La tabella vive qui e non nei file delle costanti perche' e' l'associazione fra
// una voce dell'interfaccia e un documento: le costanti non sanno che esiste una cascata.
//
// Due coppie di voci condividono la fonte, e non e' una scorciatoia: detrazioni applicate e
// IRPEF netta sono i due lati della stessa regola di capienza (art. 11 c. 3 TUIR), netto
// annuo e netto mensile lo stesso importo visto su due periodi (art. 23 DPR 600/1973).
const FONTE_DELLA_VOCE = {
  ral: 'redditoLavoroDipendente',
  contributiDipendente: 'contributi',
  imponibileFiscale: 'imponibile',
  irpefLorda: 'irpef',
  detrazioneLavoroDipendente: 'detrazioneLavoroDipendente',
  ulterioreDetrazione: 'ulterioreDetrazione',
  detrazioniEffettive: 'impostaNetta',
  irpefNetta: 'impostaNetta',
  addizionaleRegionale: 'addizionaleRegionale',
  addizionaleComunale: 'addizionaleComunale',
  trattamentoIntegrativo: 'trattamentoIntegrativo',
  sommaIntegrativa: 'sommaIntegrativa',
  nettoAnnuo: 'ritenutaEConguaglio',
  nettoMensile: 'ritenutaEConguaglio',
}

/**
 * I testi di ogni voce per una cascata gia' calcolata.
 * Ogni voce: { etichetta, spiegazione, nota, fonte }. `nota` e' gia' risolta (stringa o
 * null) e `fonte` e' gia' risolta ({ citazione, url } o null): la UI renderizza, non decide.
 *
 * `fonte` e' null sugli aggregati fuori da ORDINE_VOCI (trattenute totali, aliquote): non
 * sono voci di una norma ma somme e rapporti fra voci, e attaccargli un articolo scelto fra
 * quelli che compongono la cascata sarebbe una citazione finta. Ogni voce che sta *dentro*
 * la cascata, invece, la sua fonte ce l'ha - ed e' un test a dirlo (test/testi.test.js).
 */
export function testiCascata(cascata) {
  const c = COSTANTI_PER_ANNO[cascata.anno]
  if (!c) throw new RangeError(`anno d’imposta non supportato: ${cascata.anno}`)

  const noteContributi = []
  if (cascata.contributoAggiuntivo > 0) {
    noteContributi.push(
      `Sulla parte oltre ${EURO.format(c.contributi.primaFasciaAnnua)} scatta ` +
        `un ${PERCENTUALE.format(c.contributi.aliquotaAggiuntiva)} aggiuntivo.`,
    )
  }
  if (cascata.baseContributiva < cascata.ral) {
    noteContributi.push(
      `Oltre ${EURO.format(c.contributi.massimaleAnnuo)} i contributi si fermano: ` +
        'la parte eccedente non ne genera altri.',
    )
  }

  // Incapienza: le detrazioni spettanti superano l'imposta lorda e l'eccedenza si perde.
  // Dirlo esplicitamente e' l'unico modo perche' l'utente capisca perche' due sconti da
  // 1.955 e 1.000 non gli hanno tolto 2.955 di imposta.
  const detrazionePersa = cascata.detrazioniSpettanti - cascata.detrazioniEffettive

  const gateAddizionali = !cascata.addizionaliDovute
    ? 'Non è dovuta: le addizionali si pagano solo se l’IRPEF risulta dovuta, e la tua è zero.'
    : null

  const percentualiSomma = c.sommaIntegrativa.fasce.map(({ percentuale }) => percentuale)
  const d = c.detrazioneLavoroDipendente

  const testi = {
    ral: {
      etichetta: 'Retribuzione annua lorda (RAL)',
      spiegazione:
        'Quello che c’è scritto sul contratto. Comprende già tredicesima ed eventuale ' +
        'quattordicesima: non si sommano a parte.',
      nota: null,
    },

    contributiDipendente: {
      etichetta: 'Contributi a carico del dipendente',
      spiegazione:
        `La tua quota di contributi previdenziali, il ${PERCENTUALE.format(c.contributi.aliquotaIvsDipendente)} ` +
        'della retribuzione. Finanziano la tua pensione futura, non lo Stato: è il motivo per cui non ' +
        'sono tasse. La tua azienda ne versa un’altra quota, più grande della tua, che non entra ' +
        'in questo calcolo.',
      nota: noteContributi.length > 0 ? noteContributi.join(' ') : null,
    },

    imponibileFiscale: {
      etichetta: 'Imponibile fiscale',
      spiegazione:
        'Quello che resta della RAL una volta tolti i contributi. IRPEF e addizionali si calcolano ' +
        'su questo, mai sulla RAL.',
      nota: null,
    },

    irpefLorda: {
      etichetta: 'IRPEF lorda',
      spiegazione:
        'L’imposta prima degli sconti. Ogni fascia di reddito paga la propria aliquota: ' +
        `${descriviScaglioni(c.irpef.scaglioni)}. Salire di fascia non ritassa quello che sta sotto.`,
      nota: null,
    },

    detrazioneLavoroDipendente: {
      etichetta: 'Detrazione per lavoro dipendente',
      spiegazione:
        'Sconto che spetta per il solo fatto di avere un reddito da lavoro dipendente. Non si chiede: ' +
        'viene applicato in automatico. Cala man mano che il reddito sale e sparisce sopra ' +
        `${EURO.format(d.sogliaFascia3)}.`,
      nota:
        cascata.redditoComplessivo > d.maggiorazioneDa &&
        cascata.redditoComplessivo <= d.maggiorazioneFinoA
          ? `Include ${EURO.format(d.maggiorazione)} di maggiorazione, che spetta fra ` +
            `${EURO.format(d.maggiorazioneDa)} e ${EURO.format(d.maggiorazioneFinoA)} di reddito ` +
            'e si perde per intero appena sopra.'
          : null,
    },

    ulterioreDetrazione: {
      etichetta: 'Ulteriore detrazione',
      spiegazione:
        `Sconto aggiuntivo per i redditi medi: ${EURO.format(c.ulterioreDetrazione.importo)} pieni fra ` +
        `${EURO.format(c.ulterioreDetrazione.sogliaInferiore)} e ` +
        `${EURO.format(c.ulterioreDetrazione.inizioDecalage)}, poi cala fino ad azzerarsi a ` +
        `${EURO.format(c.ulterioreDetrazione.azzeramento)}.`,
      // Sotto la soglia inferiore la voce vale zero pur restando in cascata (issue #13). La
      // spiegazione da sola non basta: chi ha 8.500 di reddito legge "1.000 EUR pieni" e una
      // riga a zero, e le due cose si contraddicono finche' nessuno nomina il pavimento.
      nota:
        cascata.redditoComplessivo <= c.ulterioreDetrazione.sogliaInferiore
          ? `Non ti spetta: sotto ${EURO.format(c.ulterioreDetrazione.sogliaInferiore)} di reddito ` +
            'questo sconto non è previsto. A quei redditi intervengono le erogazioni, che si ' +
            'aggiungono al netto invece di ridurre l’imposta.'
          : null,
    },

    detrazioniEffettive: {
      etichetta: 'Detrazioni applicate',
      spiegazione:
        'La somma degli sconti effettivamente sottratti all’imposta. Uno sconto vale solo fino a ' +
        'concorrenza dell’imposta: quello che avanza non diventa un credito.',
      nota:
        detrazionePersa > 0
          ? `Ti spettavano ${EURO_CENTESIMI.format(cascata.detrazioniSpettanti)} di sconti, ma la tua ` +
            `imposta è più bassa: ${EURO_CENTESIMI.format(detrazionePersa)} non vengono ` +
            'utilizzati e non sono rimborsabili.'
          : null,
    },

    irpefNetta: {
      etichetta: 'IRPEF netta',
      spiegazione:
        'L’imposta davvero dovuta: la lorda meno gli sconti. Non scende mai sotto zero.',
      nota:
        cascata.irpefNetta === 0
          ? 'La tua imposta è zero: gli sconti coprono per intero l’imposta lorda.'
          : null,
    },

    addizionaleRegionale: {
      etichetta: 'Addizionale regionale',
      spiegazione:
        'Imposta della Regione sullo stesso imponibile dell’IRPEF, a fasce: ' +
        `${descriviScaglioni(c.addizionaleRegionale.scaglioni)}. Gli sconti IRPEF non la riducono.`,
      nota: gateAddizionali,
    },

    addizionaleComunale: {
      etichetta: 'Addizionale comunale',
      spiegazione:
        `Imposta del Comune sullo stesso imponibile: ${PERCENTUALE.format(c.addizionaleComunale.aliquota)}, ` +
        `con esenzione fino a ${EURO.format(c.addizionaleComunale.esenzioneFinoA)} di imponibile.`,
      nota:
        gateAddizionali ??
        (cascata.imponibileFiscale <= c.addizionaleComunale.esenzioneFinoA
          ? `Sei sotto la soglia di esenzione di ${EURO.format(c.addizionaleComunale.esenzioneFinoA)}: non è dovuta.`
          : `Attenzione: sopra ${EURO.format(c.addizionaleComunale.esenzioneFinoA)} l’aliquota si applica ` +
            'all’intero imponibile, non solo alla parte eccedente. È una soglia, non una franchigia.'),
    },

    trattamentoIntegrativo: {
      etichetta: 'Trattamento integrativo',
      spiegazione:
        'Somma che si aggiunge al tuo netto invece di ridurre l’imposta. Spetta sotto ' +
        `${EURO.format(c.trattamentoIntegrativo.sogliaRedditoComplessivo)} di reddito, ma solo se ` +
        'l’imposta supera la detrazione: così proprio i redditi più bassi restano fuori.',
      nota:
        cascata.trattamentoIntegrativo === 0 &&
        cascata.redditoComplessivo <= c.trattamentoIntegrativo.sogliaRedditoComplessivo
          ? 'Non ti spetta: la tua imposta è troppo bassa per superare la condizione di capienza.'
          : null,
    },

    sommaIntegrativa: {
      etichetta: 'Somma integrativa',
      spiegazione:
        'Somma che si aggiunge al netto per i redditi sotto ' +
        `${EURO.format(c.sommaIntegrativa.sogliaRedditoComplessivo)}: dal ` +
        `${PERCENTUALE.format(Math.min(...percentualiSomma))} al ` +
        `${PERCENTUALE.format(Math.max(...percentualiSomma))} dello stipendio. A differenza di ogni ` +
        'sconto, arriva intera anche a chi non paga imposta.',
      nota: null,
    },

    nettoAnnuo: {
      etichetta: 'Netto annuo',
      spiegazione: 'Quanto incassi in un anno.',
      // Nella cascata voce per voce questa riga chiude la sequenza, e sotto certi redditi
      // chiude su un numero piu' grande della RAL da cui era partita: senza dirlo, la
      // sequenza smette di tornare a occhio proprio sull'ultimo numero. La nota gemella su
      // trattenuteTotali risponde all'altra stranezza visibile — un aggregato negativo.
      nota:
        cascata.nettoAnnuo > cascata.ral
          ? 'Incassi più della tua RAL, e non è un errore: trattamento integrativo e somma ' +
            'integrativa sono esenti da imposta e insieme valgono più di contributi e imposte. ' +
            'Succede solo ai redditi bassi.'
          : null,
    },

    nettoMensile: {
      etichetta: 'Netto mensile',
      spiegazione:
        `Netto annuo diviso ${cascata.mensilita} mensilità. È una media: nessuna busta paga ` +
        'reale coincide con questo numero, perché le trattenute mensili sono provvisorie fino al ' +
        'conguaglio di dicembre.',
      nota: null,
    },

    // Non e' una voce della cascata (non sta in ORDINE_VOCI): e' l'aggregato che la pagina
    // mostra fra i numeri hero. L'etichetta e' "trattenute totali" e mai "tasse": il
    // glossario tiene contributi e imposte sotto etichette diverse perche' hanno
    // destinatario e natura diversi.
    trattenuteTotali: {
      etichetta: 'Trattenute totali',
      spiegazione:
        'La differenza fra la tua RAL e il netto annuo: contributi previdenziali e imposte ' +
        'messi insieme, già al netto di quello che ti viene aggiunto. Non sono tutte tasse — ' +
        'la parte previdenziale finanzia la tua pensione.',
      // Sotto certi redditi le erogazioni esenti superano i prelievi e l'aggregato diventa
      // negativo: senza dirlo, un "-676,18 €" di trattenute si legge come un errore.
      nota:
        cascata.nettoAnnuo > cascata.ral
          ? 'Il numero è negativo, e non è un errore: le erogazioni esenti che ti spettano ' +
            'superano contributi e imposte, quindi in un anno incassi più della tua RAL.'
          : null,
    },

    aliquotaMarginale: {
      etichetta: 'Aliquota marginale',
      spiegazione: 'L’aliquota sull’ultimo euro guadagnato: è il tasso a cui vale un aumento.',
      nota: null,
    },

    aliquotaMedia: {
      etichetta: 'Aliquota media',
      spiegazione:
        'L’imposta rapportata al reddito. È sempre più bassa della marginale: la differenza ' +
        'è quanto ti fanno risparmiare scaglioni e sconti.',
      nota: null,
    },
  }

  // La fonte si attacca qui, in un passaggio solo, invece che riga per riga dentro i testi:
  // cosi' l'associazione voce -> documento si legge tutta insieme in FONTE_DELLA_VOCE, e
  // una voce nuova senza fonte si vede come un buco nella tabella invece che come una
  // proprieta' dimenticata in fondo a un letterale lungo.
  const fonti = FONTI_PER_ANNO[cascata.anno]
  for (const [voce, testo] of Object.entries(testi)) {
    testo.fonte = fonti[FONTE_DELLA_VOCE[voce]] ?? null
  }

  return testi
}

/**
 * L'avviso da mostrare quando la RAL cade in una zona in cui il netto scende al crescere
 * del lordo. Versione in lingua di `avvisoNonMonotonia` (src/discontinuita.js), che resta
 * la formulazione tecnica usata dalla suite di proprieta'. null fuori dalle zone.
 */
export function avvisoScalino(cascata) {
  const c = COSTANTI_PER_ANNO[cascata.anno]
  if (!c) throw new RangeError(`anno d’imposta non supportato: ${cascata.anno}`)

  const zona = zoneNonMonotonia(c).find(({ da, a }) => cascata.ral > da && cascata.ral < a)
  if (!zona) return null

  return (
    `Sei appena sopra uno scalino. A ${EURO_CENTESIMI.format(zona.da)} di RAL il netto annuo era più ` +
    `alto di quello attuale, fino a ${EURO_CENTESIMI.format(zona.perdita)} in più. ` +
    'Non è un errore del calcolo: la legge prevede soglie oltre le quali un’agevolazione si ' +
    `perde per intero invece di ridursi. Torni sopra quel livello da ${EURO_CENTESIMI.format(zona.a)} di RAL.`
  )
}
