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

import { FONTI_PER_ANNO } from './costanti/index.js'
import { costantiPerLuogo } from './luoghi.js'
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

// Come si racconta una regola di addizionale, la stessa frase per la regionale e per la
// comunale: aliquota unica, scaglioni, e l'eventuale esenzione. Nasce dalla regola e non da
// costanti fisse, quindi dice il vero per tutti i comuni e i ventuno enti impositori — non
// solo per Milano e la Lombardia.
function descriviAddizionale(regola) {
  const unica = regola.scaglioni.length === 1
  const scala = unica
    ? PERCENTUALE.format(regola.scaglioni[0].aliquota)
    : `a fasce, ${descriviScaglioni(regola.scaglioni)}`

  const variante = (regola.varianti ?? [])[0]
  const parti = [scala]
  if (variante) {
    // Alcuni enti sostituiscono l'intera scala sotto una soglia invece di esentare: senza
    // dirlo, chi ci sta sotto legge un'aliquota che non e' la sua.
    parti.push(
      `ridotta al ${PERCENTUALE.format(variante.scaglioni[0].aliquota)} fino a ` +
        `${EURO.format(variante.seImponibileFinoA)} di imponibile`,
    )
  }
  if (regola.esenzioneFinoA != null) {
    parti.push(`con esenzione fino a ${EURO.format(regola.esenzioneFinoA)} di imponibile`)
  }
  if (regola.scaglioni.every(({ aliquota }) => aliquota === 0)) {
    return 'non istituita: questo Comune non ha deliberato alcuna aliquota'
  }
  return parti.join(', ')
}

// La soglia secca vista dai due lati: sotto si e' esenti, sopra si paga su tutto. E' la cosa
// contro-intuitiva che il prototipo esiste per mostrare, e ora si sposta col comune.
function notaEsenzione(cascata, regola) {
  if (regola.esenzioneFinoA == null) return null
  return cascata.imponibileFiscale <= regola.esenzioneFinoA
    ? `Sei sotto la soglia di esenzione di ${EURO.format(regola.esenzioneFinoA)}: non è dovuta.`
    : `Attenzione: sopra ${EURO.format(regola.esenzioneFinoA)} l’aliquota si applica ` +
        'all’intero imponibile, non solo alla parte eccedente. È una soglia, non una franchigia.'
}

// Centotto comuni prevedono esenzioni non universali, descritte in testo libero per
// categorie di reddito: il motore calcola sulla sola parte strutturata e puo' quindi
// SOVRASTIMARE l'addizionale di chi rientra nella categoria. La degradazione si dichiara
// qui, in pagina, accanto al numero che ne risente — non solo nel registro delle assunzioni.
function notaDescrittiva(regola) {
  if (!regola.nota) return null
  return (
    `Questo Comune prevede anche un’esenzione riservata a certi redditi, che il calcolo non ` +
    `applica: se rientri nel caso descritto, l’importo vero è più basso. Testo della delibera: ` +
    `«${regola.nota}».`
  )
}

// Quando l'elenco del MEF pubblica per un comune fasce che non formano una scala
// progressiva, il numero calcolato non e' affidabile. Non lo aggiustiamo indovinando il
// confine giusto — inventare un dato fiscale e' peggio che dichiararlo incerto — ma non lo
// mostriamo nemmeno come se fosse certo.
function notaAnomalia(regola) {
  if (!regola.anomalia) return null
  return `Attenzione: ${regola.anomalia}. L’importo qui sopra è quindi indicativo: verificalo alla fonte.`
}

function unisciNote(...note) {
  const presenti = note.filter(Boolean)
  return presenti.length > 0 ? presenti.join(' ') : null
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

// Le etichette del selettore del luogo. «Dove abiti» raccoglierebbe la risposta sbagliata
// da chiunque abbia traslocato di recente: le addizionali seguono il DOMICILIO FISCALE AL
// 1° GENNAIO dell'anno d'imposta (art. 50 c. 5 D.Lgs. 446/1997; art. 1 c. 4 D.Lgs.
// 360/1998), non la residenza attuale, e un cambio di residenza diventa domicilio fiscale
// solo dopo sessanta giorni (art. 58 d.P.R. 600/1973). Con un'interfaccia perfetta e
// un'etichetta sbagliata il traslocato otterrebbe un netto sbagliato: l'etichetta giusta
// rende l'errore un errore di input, non di calcolo.
//
// La data del trasferimento non e' un campo: non entra in nessuna formula, decide solo
// QUALE comune indicare — e il 730 stesso chiede il comune, non la data, delegando la
// regola dei sessanta giorni a una frase nelle istruzioni. Testi e ragionamento vengono
// dalla ricerca della issue #19, docs/ricerca/luogo-delle-addizionali-domicilio-fiscale.md,
// par. 5. L'anno si interpola come ovunque, che e' anche il motivo per cui sono funzioni.
export const etichettaEnte = () => 'Regione o provincia autonoma'
export const etichettaComune = (anno) => `Comune di domicilio fiscale al 1° gennaio ${anno}`
export const aiutoComune = (anno) =>
  `Di norma è il comune dove risultavi all’anagrafe il 1° gennaio ${anno}. Se hai cambiato ` +
  `residenza dopo il 2 novembre ${anno - 1}, vale ancora il comune precedente.`

// L'etichetta che introduce il link alla fonte. Sta qui e non nella pagina per la stessa
// ragione di tutte le altre: la UI non contiene stringhe (vedi l'intestazione del file).
export const ETICHETTA_FONTE = 'Fonte'

// L'unica scritta dentro il mini-grafico dello scalino: marca il punto della RAL inserita
// sulla curva. Minuscola perche' e' un'annotazione sul disegno, non un titolo.
export const ETICHETTA_TU_SEI_QUI = 'tu sei qui'

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
  // addizionaleRegionale e addizionaleComunale non compaiono qui: la loro fonte non sta in
  // FONTI_PER_ANNO ma dentro la regola del luogo (vedi in fondo a testiCascata).
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
  // Dalla coppia `{ anno, comune }`, non dal solo anno: due voci su quattordici — e i testi
  // che le spiegano — dipendono dal luogo scelto.
  const c = costantiPerLuogo(cascata.anno, cascata.comune)

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
      // L'ente si nomina: con un selettore, «Addizionale regionale» da sola non dice piu'
      // di quale regione si parli, e il numero mostrato dipende proprio da quella. Vale
      // anche per Trento e Bolzano, che nella legge stanno al posto della regione:
      // `denominazione` porta gia' la forma giusta («Provincia autonoma di Trento»).
      etichetta: `Addizionale regionale (${c.addizionaleRegionale.denominazione.replace(/^Regione\s+/, '')})`,
      spiegazione:
        `Imposta della ${c.addizionaleRegionale.denominazione} sullo stesso imponibile dell’IRPEF: ` +
        `${descriviAddizionale(c.addizionaleRegionale)}. Gli sconti IRPEF non la riducono.`,
      nota: gateAddizionali ?? notaEsenzione(cascata, c.addizionaleRegionale),
    },

    addizionaleComunale: {
      // Il comune nel testo della voce: cosi' il luogo si dichiara da solo dentro il
      // risultato, come gia' fa l'anno d'imposta, invece di restare implicito in un menu'
      // sopra la piega.
      etichetta: `Addizionale comunale (${c.addizionaleComunale.nome})`,
      spiegazione:
        `Imposta del Comune di ${c.addizionaleComunale.nome} sullo stesso imponibile: ` +
        `${descriviAddizionale(c.addizionaleComunale)}.`,
      nota:
        gateAddizionali ??
        unisciNote(
          notaEsenzione(cascata, c.addizionaleComunale),
          notaDescrittiva(c.addizionaleComunale),
          notaAnomalia(c.addizionaleComunale),
        ),
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
  // Le due addizionali prendono la fonte dalla REGOLA e non dalla mappa dell'anno: la loro
  // delibera dipende dal luogo, e la scheda MEF e' indicizzata per codice catastale. Cosi'
  // scegliere un comune cambia anche il documento che la riga espansa linka, senza una
  // seconda tabella da tenere allineata a ottomila voci.
  const fonti = FONTI_PER_ANNO[cascata.anno]
  const fontiDelLuogo = {
    addizionaleRegionale: c.addizionaleRegionale.fonte,
    addizionaleComunale: c.addizionaleComunale.fonte,
  }
  for (const [voce, testo] of Object.entries(testi)) {
    testo.fonte = fontiDelLuogo[voce] ?? fonti[FONTE_DELLA_VOCE[voce]] ?? null
  }

  return testi
}

/**
 * L'avviso da mostrare quando la RAL cade in una zona in cui il netto scende al crescere
 * del lordo. Versione in lingua di `avvisoNonMonotonia` (src/discontinuita.js), che resta
 * la formulazione tecnica usata dalla suite di proprieta'. null fuori dalle zone.
 */
export function avvisoScalino(cascata) {
  const c = costantiPerLuogo(cascata.anno, cascata.comune)

  const zona = zoneNonMonotonia(c).find(({ da, a }) => cascata.ral > da && cascata.ral < a)
  if (!zona) return null

  return (
    `Sei appena sopra uno scalino. A ${EURO_CENTESIMI.format(zona.da)} di RAL il netto annuo era più ` +
    `alto di quello attuale, fino a ${EURO_CENTESIMI.format(zona.perdita)} in più. ` +
    'Non è un errore del calcolo: la legge prevede soglie oltre le quali un’agevolazione si ' +
    `perde per intero invece di ridursi. Torni sopra quel livello da ${EURO_CENTESIMI.format(zona.a)} di RAL.`
  )
}
