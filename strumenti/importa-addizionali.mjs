#!/usr/bin/env node
//
// Importa le addizionali regionale e comunale dell'Italia intera e le scrive come JSON,
// uno per ente impositore, sotto dati/addizionali/<anno>/.
//
//   node strumenti/importa-addizionali.mjs                  # anno corrente, scarica dalla rete
//   node strumenti/importa-addizionali.mjs --anno 2025
//   node strumenti/importa-addizionali.mjs --sorgenti ./csv # riusa copie gia' scaricate
//
// Perche' i dati importati stanno in JSON e non fra le costanti curate: sono 7.896 righe
// prodotte da una macchina, non valori scelti uno per uno con la fonte accanto (README,
// «tabelle importate da una macchina... sono dati, non costanti curate»).
//
// Perche' un file per ente e non un file solo: la pagina scarica la sola regione scelta,
// quindi il primo dei tre menu' a cascata e' anche la strategia di caricamento. Il file
// intero varrebbe qualche megabyte per mostrare un comune. Gli altri due gradini — provincia
// e comune — si servono da quel che il file gia' contiene, senza altre richieste.
//
// FONTI (tutte primarie, MEF e ISTAT: vedi COSTANTI qui sotto per gli URL esatti)
//  - elenchi MEF delle aliquote comunali, per anno d'imposta
//  - elenco MEF delle aliquote regionali, per anno d'imposta
//  - ISTAT, elenco dei comuni italiani (anagrafica comune -> provincia -> regione)
// La ricerca che ha stabilito tracciati, conteggi e chiave di join sta in
// docs/ricerca/modello-dati-addizionali-italia.md.
//
// LO SCRIPT FALLISCE INVECE DI INDOVINARE. Se un tracciato cambia, se il join perde
// comuni, se un ente compare o sparisce, o se il testo di un'agevolazione regionale
// curata a mano non e' piu' quello su cui e' stata curata, l'importazione si ferma con un
// messaggio. Un dato fiscale sbagliato in silenzio e' peggio di un dato assente.

import { writeFile, mkdir, readFile, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ANNO_CORRENTE } from '../src/costanti/index.js'

// ---------------------------------------------------------------------------
// Le sorgenti
// ---------------------------------------------------------------------------

// Pagina di provenienza degli elenchi comunali («Elenchi generali aggiornati quotidianamente»):
// https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addirpef_newDF/download/tabella.htm
// Il percorso storico `addirpef_newDF` risponde 301 verso `nuova_addcomirpef`: usiamo il
// nuovo direttamente, ma seguiamo comunque i redirect.
const URL_COMUNALE = (anno) =>
  `https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/download/download.php?anno=${anno}`

// Pagina di provenienza dell'elenco regionale:
// https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/download/tabella.htm
const URL_REGIONALE = (anno) =>
  `https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/download/download.php?tipo=reg&anno=${anno}`

// La scheda MEF di un ente, indicizzata dal codice `reg` del portale. Il codice non e'
// documentato: lo scopriamo interrogando le schede e leggendo il nome che restituiscono
// (vedi `scopriCodiciMef`), invece di trascriverlo a mano.
const URL_SCHEDA_REGIONALE = (reg) =>
  `https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=${reg}`

// La scheda MEF di un comune, per codice catastale: e' la fonte che la pagina mostra
// accanto alla voce dell'addizionale comunale. `anno` e' l'anno della delibera che vale,
// che per un comune in proroga non e' l'anno d'imposta.
const URL_SCHEDA_COMUNALE = (anno, provincia, codiceCatastale) =>
  'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/' +
  `nuova_addcomirpef/risultato.htm?anno=${anno}&pr=${provincia}&cc=${codiceCatastale}&r=1`

// ISTAT, «Codici statistici delle unita' amministrative territoriali» (https://www.istat.it/it/archivio/6789).
// Serve per l'anagrafica comune -> provincia -> regione, che nei dati MEF non c'e'.
const URL_ISTAT = 'https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv'

// Encoding accertati l'11/08/2026: i CSV del MEF sono UTF-8, quello ISTAT ISO-8859-1
// (verifica: nessun U+FFFD leggendo i primi come utf8, 802 leggendo il secondo).
const SORGENTI = {
  comunale: { encoding: 'utf8', separatore: ';' },
  regionale: { encoding: 'utf8', separatore: ';' },
  istat: { encoding: 'latin1', separatore: ';' },
}

// ---------------------------------------------------------------------------
// I dati curati a mano: quel che il CSV non struttura
// ---------------------------------------------------------------------------

// Le agevolazioni regionali universali vivono solo nel testo libero del campo DISPOSIZIONE
// del CSV: non esiste un campo `IMPORTO_ESENTE` regionale. Con 21 enti la cura a mano e'
// sostenibile (a differenza dei 7.896 comuni), e ogni voce porta la norma che la istituisce.
//
// `dispositivo` e' l'impronta del testo su cui la regola e' stata curata: se il MEF cambia
// quel testo, l'importazione si ferma invece di applicare una regola scaduta. Le impronte si
// rigenerano con `--mostra-impronte`.
//
// Restano fuori le agevolazioni legate a figli a carico o disabilita' (Marche, Veneto,
// Piemonte, Puglia, Campania, Sardegna, Trento, Bolzano): sono gia' escluse dall'assunzione
// «nessun familiare a carico» di docs/ASSUNZIONI.md.
// Censimento completo: docs/ricerca/modello-dati-addizionali-italia.md, par. 3 e 4.
const AGEVOLAZIONI = {
  'valle-d-aosta': {
    dispositivo: '6452cd7362b5',
    // «i soggetti con reddito complessivo [...] fino a 15.000 euro, sono esentati [...]
    // Ai soggetti con reddito complessivo oltre 15.000 euro si applica l'aliquota
    // ordinaria sull'intero imponibile» - scalino, non franchigia.
    // Fonte: art. 1 L.R. Valle d'Aosta 23/12/2025 n. 29 (campo NORME del CSV MEF 2026).
    esenzioneFinoA: 15000,
  },

  'friuli-venezia-giulia': {
    dispositivo: '7455387748cd',
    // «in ipotesi di reddito imponibile fino a euro 15.000 l'aliquota e' pari a 0,70 per
    // cento. Per reddito imponibile superiore a euro 15.000 l'aliquota e' pari a 1,23 per
    // cento sull'intero importo»: due aliquote piatte alternative, NON due scaglioni
    // progressivi. Letto come progressivo, a imponibile 20.000 darebbe 166,50 invece di 246.
    // Fonte: art. 1 c. 5 L.R. FVG 25/07/2012 n. 14 (campo NORME del CSV MEF 2026).
    scaglioni: [{ fino: null, aliquota: 0.0123 }],
    varianti: [{ seImponibileFinoA: 15000, scaglioni: [{ fino: null, aliquota: 0.007 }] }],
  },

  trento: {
    dispositivo: '1523e3e9d520',
    // «Ai contribuenti aventi un reddito imponibile non superiore a euro 30.000,00 spetta
    // una deduzione di euro 30.000,00. Tale deduzione non spetta ai contribuenti aventi un
    // reddito imponibile superiore a euro 30.000,00»: una deduzione pari alla soglia che si
    // perde superandola e' esattamente un'esenzione a scalino.
    // Fonte: art. 1 c. 2-quater L.P. Trento 23/12/2019 n. 13 (campo NORME del CSV MEF 2026).
    esenzioneFinoA: 30000,
  },

  bolzano: {
    dispositivo: '5fcc7d006471',
    // Due detrazioni cumulabili, entrambe con pavimento a zero («non generano credito
    // d'imposta»): una fissa sotto i 90.000 e una a rampa sopra i 50.000, con tetto a 125.
    // La detrazione per figli a carico (340 EUR) resta fuori perimetro.
    // Fonte: art. 21-sexiesdecies L.P. Bolzano 11/08/1998 n. 9 (campo NORME del CSV MEF 2026).
    detrazioni: [
      { da: 0, finoA: 90000, importo: 430.5 },
      { da: 50000.01, finoA: null, importo: 125, rampa: { da: 50000, ampiezza: 25000 } },
    ],
  },

  umbria: {
    dispositivo: '61c36188a950',
    // Le maggiorazioni sui primi due scaglioni (+0,50 e +1,79 punti) «non trovano
    // applicazione» fino a 28.000 di imponibile: sotto la soglia resta l'aliquota di base
    // 1,23% (art. 6 D.Lgs. 68/2011). Piu' una detrazione di 150 EUR fra 28.001 e 50.000.
    // Fonte: art. 1 cc. 1-3 L.R. Umbria 11/04/2025 n. 2 (campo NORME del CSV MEF 2026).
    varianti: [{ seImponibileFinoA: 28000, scaglioni: [{ fino: null, aliquota: 0.0123 }] }],
    detrazioni: [{ da: 28000.01, finoA: 50000, importo: 150 }],
  },

  lazio: {
    dispositivo: 'ca7d38f6330f',
    // «Per i soggetti con un reddito imponibile [...] non superiore a euro 28.000,00
    // l'aliquota [...] e' determinata in misura pari all'1,73%»: aliquota piatta sotto la
    // soglia, al posto degli scaglioni fino al 3,33%. Piu' 60 EUR di detrazione fra 28.001
    // e 30.000.
    // Fonte: art. 2 cc. 2-3 L.R. Lazio 31/12/2025 n. 20 (campo NORME del CSV MEF 2026).
    varianti: [{ seImponibileFinoA: 28000, scaglioni: [{ fino: null, aliquota: 0.0173 }] }],
    detrazioni: [{ da: 28000.01, finoA: 30000, importo: 60 }],
  },
}

// Le disposizioni lette, classificate fuori perimetro e quindi NON applicate: sono tutte
// condizionate a figli a carico o disabilita', gia' escluse dall'assunzione «nessun
// familiare a carico» di docs/ASSUNZIONI.md. Stanno qui, con la loro impronta, invece di
// essere ignorate in silenzio: cosi' un ente che domani introducesse un'agevolazione
// universale — che il motore *dovrebbe* applicare — ferma l'importazione invece di
// passare inosservato.
const FUORI_PERIMETRO = {
  marche: 'f2b290cdd6c2', // aliquota 1,23% con figli portatori di handicap a carico
  veneto: 'd7dd10eb77a4', // aliquota 0,9% per disabili e per chi ha un familiare disabile a carico
  puglia: '5f4b52737ccb', // detrazioni per carichi di famiglia (L.R. 40/2015)
  sardegna: 'f9a4e9c8a513', // detrazione di 200 EUR per figlio minorenne a carico
  piemonte: '2ddd78593ad8', // detrazioni per figli a carico e figli con handicap
  campania: 'a466705eeff1', // detrazioni di 30/40 EUR per figlio a carico
}

// Il comune su cui gli ultimi due menu' si posizionano quando si sceglie un ente. Non e' un
// valore fiscale — e' il default dell'interfaccia — ma va scritto da qualche parte: i
// capoluoghi di regione non stanno nell'anagrafica ISTAT, che marca i capoluoghi di
// provincia (109) e non quelli di regione (21). Sono i capoluoghi fissati dagli statuti
// regionali; per le due province autonome, il capoluogo provinciale.
// Lo script verifica che ognuno esista fra i comuni del suo ente, quindi un refuso di
// trascrizione ferma l'importazione.
const CAPOLUOGHI = {
  abruzzo: 'A345', // L'Aquila
  basilicata: 'G942', // Potenza
  bolzano: 'A952', // Bolzano
  calabria: 'C352', // Catanzaro
  campania: 'F839', // Napoli
  'emilia-romagna': 'A944', // Bologna
  'friuli-venezia-giulia': 'L424', // Trieste
  lazio: 'H501', // Roma
  liguria: 'D969', // Genova
  lombardia: 'F205', // Milano
  marche: 'A271', // Ancona
  molise: 'B519', // Campobasso
  piemonte: 'L219', // Torino
  puglia: 'A662', // Bari
  sardegna: 'B354', // Cagliari
  sicilia: 'G273', // Palermo
  toscana: 'D612', // Firenze
  trento: 'L378', // Trento
  umbria: 'G478', // Perugia
  'valle-d-aosta': 'A326', // Aosta
  veneto: 'L736', // Venezia
}

// Come si scrive l'ente dentro una frase: «Imposta della Regione Lombardia», «Imposta
// della Provincia autonoma di Trento». Il glossario (CONTEXT.md) vieta la provincia come
// entita' fiscale del calcolo, e infatti qui non e' una provincia: e' l'ente impositore
// dell'addizionale che la legge continua a chiamare «regionale».
const DENOMINAZIONI = {
  trento: 'Provincia autonoma di Trento',
  bolzano: 'Provincia autonoma di Bolzano',
}

const ENTI_ATTESI = 21 // 19 regioni + 2 province autonome (ricerca issue #18, par. 4)

// Le province italiane censite da ISTAT come «unita' territoriali sovracomunali»: province,
// citta' metropolitane e liberi consorzi siciliani. Il conteggio e' il presidio che dice che
// l'anagrafica e' stata letta tutta — la provincia non e' un'entita' fiscale (CONTEXT.md),
// e' il livello intermedio del selettore.
const PROVINCE_ATTESE = 107

// ---------------------------------------------------------------------------
// Utilita'
// ---------------------------------------------------------------------------

class ErroreDiImportazione extends Error {}

function pretendi(condizione, messaggio) {
  if (!condizione) throw new ErroreDiImportazione(messaggio)
}

function impronta(testo) {
  return createHash('sha256').update(testo.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 12)
}

// Un parser CSV vero, non uno split: l'header ISTAT contiene a-capo dentro le virgolette.
function leggiCsv(testo, separatore) {
  const righe = []
  let campo = ''
  let riga = []
  let dentroVirgolette = false

  for (let i = 0; i < testo.length; i += 1) {
    const carattere = testo[i]
    if (dentroVirgolette) {
      if (carattere !== '"') campo += carattere
      else if (testo[i + 1] === '"') (campo += '"'), (i += 1)
      else dentroVirgolette = false
    } else if (carattere === '"') dentroVirgolette = true
    else if (carattere === separatore) (riga.push(campo), (campo = ''))
    else if (carattere === '\n') (riga.push(campo), righe.push(riga), (riga = []), (campo = ''))
    else if (carattere !== '\r') campo += carattere
  }
  if (campo !== '' || riga.length > 0) (riga.push(campo), righe.push(riga))

  const intestazione = righe[0].map((c) => c.replace(/\s+/g, ' ').trim())
  return righe.slice(1).map((valori) => {
    const record = {}
    intestazione.forEach((nome, i) => {
      record[nome] = (valori[i] ?? '').trim()
    })
    return record
  })
}

function pretendiColonne(record, colonne, chi) {
  for (const colonna of colonne) {
    pretendi(colonna in record, `tracciato ${chi} cambiato: manca la colonna «${colonna}»`)
  }
}

// «23.000,00», «15000.00», «,8», «12.000» -> numero. La convenzione non e' uniforme fra i
// comuni: la virgola, quando c'e', e' sempre il decimale; il punto e' decimale solo se
// separa una coda di una o due cifre.
function numeroItaliano(testo) {
  const pulito = String(testo).replace(/[^\d.,]/g, '')
  if (pulito === '') return null
  let normalizzato
  if (pulito.includes(',')) {
    normalizzato = pulito.replace(/\./g, '').replace(',', '.')
  } else {
    const coda = pulito.match(/\.(\d+)$/)
    normalizzato = coda && coda[1].length <= 2 ? pulito : pulito.replace(/\./g, '')
  }
  const valore = Number(normalizzato)
  return Number.isFinite(valore) ? valore : null
}

// Il MEF scrive le aliquote in punti percentuali, a volte senza lo zero iniziale
// («,8» = 0,8%; «1,014» = 1,014%, Palermo). Qui diventano frazioni.
function aliquotaDaPercentuale(testo) {
  const punti = numeroItaliano(testo)
  // Il troncamento a otto decimali toglie la coda binaria (0,7 / 100 = 0,006999999999999999)
  // senza toccare nessuna aliquota reale: la piu' fine censita ha tre decimali in punti
  // percentuali (1,014%, Palermo), cioe' cinque da frazione.
  return punti === null ? null : Number((punti / 100).toFixed(8))
}

// Un accento in meno e uno slash in piu' separano «Friuli-Venezia Giulia» (ISTAT) da
// «FRIULI VENEZIA GIULIA» (MEF): normalizzando, i due nomi coincidono.
function slug(nome) {
  return nome
    .split('/')[0]
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/^(regione|provincia autonoma di)\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ---------------------------------------------------------------------------
// Scaricamento
// ---------------------------------------------------------------------------

async function scarica(url, { encoding }, cartellaSorgenti, nomeLocale) {
  if (cartellaSorgenti) {
    const contenuto = await readFile(join(cartellaSorgenti, nomeLocale))
    return new TextDecoder(encoding === 'latin1' ? 'latin1' : 'utf-8').decode(contenuto)
  }
  const risposta = await fetch(url, { redirect: 'follow' })
  pretendi(risposta.ok, `scaricamento fallito (${risposta.status}): ${url}`)
  const byte = Buffer.from(await risposta.arrayBuffer())
  pretendi(byte.length > 1000, `risposta troppo corta da ${url}: ${byte.length} byte`)
  return new TextDecoder(encoding === 'latin1' ? 'latin1' : 'utf-8').decode(byte)
}

// I codici `reg` del portale MEF non sono documentati e non coincidono con quelli ISTAT:
// li scopriamo leggendo il nome che ogni scheda dichiara. Cosi' il link alla fonte che
// finisce in pagina e' verificato, non indovinato.
async function scopriCodiciMef(slugAttesi) {
  const codici = {}
  for (let reg = 1; reg <= 30 && Object.keys(codici).length < slugAttesi.size; reg += 1) {
    const risposta = await fetch(URL_SCHEDA_REGIONALE(reg))
    if (!risposta.ok) continue
    const html = await risposta.text()
    const nome = html.match(/(REGIONE|PROVINCIA AUTONOMA DI)[ A-ZÀ-Ù'’-]+/i)?.[0]
    if (!nome) continue
    const chiave = slug(nome.replace(/\s+codice.*/i, ''))
    if (slugAttesi.has(chiave) && !(chiave in codici)) codici[chiave] = reg
  }
  return codici
}

// ---------------------------------------------------------------------------
// L'anagrafica ISTAT
// ---------------------------------------------------------------------------

// Il nome per esteso della provincia sta in una colonna sola, ma non si chiama «provincia»:
// dal 2015 ISTAT le raccoglie sotto «unita' territoriale sovracomunale», che tiene insieme
// province, citta' metropolitane e liberi consorzi siciliani.
const COLONNA_PROVINCIA =
  "Denominazione dell'Unità territoriale sovracomunale (valida a fini statistici)"

function leggiAnagrafica(testo) {
  const record = leggiCsv(testo, SORGENTI.istat.separatore)
  pretendiColonne(
    record[0],
    [
      'Codice Catastale del comune',
      'Denominazione in italiano',
      'Denominazione Regione',
      COLONNA_PROVINCIA,
      'Sigla automobilistica',
    ],
    'ISTAT',
  )

  const comuni = new Map()
  const denominazioni = new Map()
  // ente -> { sigla -> nome per esteso }: quel che riempie il menu' delle province, che e'
  // il secondo dei tre passi del selettore. Sta dentro il file dell'ente e non in un file a
  // parte perche' e' esattamente l'insieme che serve a chi ha gia' scelto quell'ente.
  const province = new Map()
  for (const riga of record) {
    const codice = riga['Codice Catastale del comune']
    if (!codice) continue
    const sigla = riga['Sigla automobilistica']
    // L'ente impositore, non la regione: il Trentino-Alto Adige non esiste come ente
    // (ricerca issue #18, par. 4). La sigla provinciale serve a derivarlo e a restringere il
    // menu' dei comuni: nel calcolo la provincia non entra mai.
    const ente = sigla === 'TN' ? 'trento' : sigla === 'BZ' ? 'bolzano' : slug(riga['Denominazione Regione'])
    comuni.set(codice, { nome: riga['Denominazione in italiano'], provincia: sigla, ente })
    // Il nome della regione si prende da qui e non dal CSV MEF, che lo scrive tutto
    // maiuscolo: rimetterlo in minuscolo a macchina produce «Valle D'Aosta» e perde il
    // trattino di «Friuli-Venezia Giulia». La parte prima dello slash toglie il secondo
    // nome delle regioni bilingui.
    if (!denominazioni.has(ente)) denominazioni.set(ente, riga['Denominazione Regione'].split('/')[0].trim())
    if (!province.has(ente)) province.set(ente, new Map())
    // Stesso taglio allo slash, per la stessa ragione: «Bolzano/Bozen» e «Valle
    // d'Aosta/Vallée d'Aoste» sono le due province bilingui.
    if (!province.get(ente).has(sigla)) {
      province.get(ente).set(sigla, riga[COLONNA_PROVINCIA].split('/')[0].trim())
    }
  }
  pretendi(comuni.size > 7000, `anagrafica ISTAT troppo corta: ${comuni.size} comuni`)
  const sigle = [...province.values()].reduce((totale, perEnte) => totale + perEnte.size, 0)
  pretendi(
    sigle === PROVINCE_ATTESE,
    `attese ${PROVINCE_ATTESE} province nell'anagrafica ISTAT, trovate ${sigle}`,
  )
  return { comuni, denominazioni, province }
}

// ---------------------------------------------------------------------------
// L'elenco regionale
// ---------------------------------------------------------------------------

function leggiRegoleRegionali(testo, anno) {
  const record = leggiCsv(testo, SORGENTI.regionale.separatore)
  pretendiColonne(record[0], ['ANNO', 'REGIONE', 'NUMERO', 'DATA PUBBLICAZIONE', 'DISPOSIZIONE', 'ALIQUOTA', 'FASCIA'], 'MEF regionale')

  const perEnte = new Map()
  for (const riga of record) {
    if (!riga.REGIONE) continue
    pretendi(riga.ANNO === String(anno), `riga regionale di un altro anno: ${riga.ANNO}`)
    const chiave = slug(riga.REGIONE)
    if (!perEnte.has(chiave)) perEnte.set(chiave, [])
    perEnte.get(chiave).push(riga)
  }
  pretendi(
    perEnte.size === ENTI_ATTESI,
    `attesi ${ENTI_ATTESI} enti impositori nell'elenco regionale, trovati ${perEnte.size}`,
  )

  const regole = new Map()
  for (const [chiave, righe] of perEnte) {
    // Molise e Puglia compaiono due volte nel 2026 (rideterminazione per disavanzo
    // sanitario, art. 1 c. 174 L. 311/2004): vale l'ultima delibera pubblicata. Il numero
    // del MEF e' un progressivo di pubblicazione, quindi il piu' alto e' il piu' recente —
    // criterio piu' solido dell'ordine delle righe nel file.
    const ultima = Math.max(...righe.map((r) => Number(r.NUMERO)))
    pretendi(Number.isFinite(ultima), `numero di delibera illeggibile per l'ente ${chiave}`)
    const vigenti = righe.filter((r) => Number(r.NUMERO) === ultima)

    const scaglioni = scaglioniDaFasce(
      vigenti.map((r) => ({ aliquota: r.ALIQUOTA, fascia: r.FASCIA })),
      `ente ${chiave}`,
    )
    pretendi(scaglioni.length > 0, `nessuno scaglione leggibile per l'ente ${chiave}`)

    regole.set(chiave, {
      scaglioni,
      dispositivo: vigenti[0].DISPOSIZIONE ?? '',
      delibera: String(ultima),
      pubblicata: vigenti[0]['DATA PUBBLICAZIONE'],
      nomeMef: vigenti[0].REGIONE,
    })
  }
  return regole
}

// ---------------------------------------------------------------------------
// Le fasce: da testo libero a scaglioni progressivi
// ---------------------------------------------------------------------------

// I confini delle fasce NON si validano contro gli scaglioni statali. L'invariante vale
// nel 2025 ma non nel 2026 (Marnate, VA: quarta fascia oltre 55.000, confine che non
// appartiene a nessuno dei due insiemi statali). Si parsano come numeri arbitrari e una
// divergenza si segnala, mai si rifiuta.
function limiteSuperiore(fascia) {
  const testo = fascia.toLowerCase()
  if (/aliquota\s*unica/.test(testo)) return Infinity

  const numeri = [...testo.matchAll(/\d[\d.,]*/g)]
    .map((m) => numeroItaliano(m[0]))
    .filter((n) => n !== null)
  if (numeri.length === 0) return null

  // «oltre 50.000» senza secondo numero e' lo scaglione aperto; «oltre 28.000 fino a
  // 55.000» ha il suo confine nel secondo. In ogni altra forma il limite e' il numero piu'
  // alto: «da euro 15.000 fino a euro 28.000», «fino a euro 15.000», «tra 15.000 e 28.000».
  if (numeri.length === 1 && /oltre|superiore|sopra|maggiore/.test(testo)) return Infinity
  return Math.max(...numeri)
}

function scaglioniDaFasce(coppie, chi) {
  const scaglioni = []
  for (const { aliquota, fascia } of coppie) {
    const valore = aliquotaDaPercentuale(aliquota)
    if (valore === null) continue
    const fino = limiteSuperiore(fascia)
    pretendi(fino !== null, `fascia illeggibile per ${chi}: «${fascia}»`)
    scaglioni.push({ fino, aliquota: valore })
  }
  scaglioni.sort((a, b) => a.fino - b.fino)

  // Un solo scaglione aperto, e in fondo: e' cosi' che `perScaglioni` (src/cascata.js)
  // legge la progressivita'.
  const aperti = scaglioni.filter((s) => s.fino === Infinity)
  pretendi(aperti.length <= 1, `${chi}: piu' di uno scaglione aperto`)
  if (scaglioni.length > 0 && scaglioni.at(-1).fino !== Infinity) {
    // Il MEF elenca solo le fasce deliberate: se l'ultima e' chiusa, sopra di essa la
    // delibera non dispone nulla e l'aliquota resta quella dell'ultimo scaglione.
    scaglioni.push({ fino: Infinity, aliquota: scaglioni.at(-1).aliquota })
  }
  return scaglioni.map(({ fino, aliquota }) => ({ fino: fino === Infinity ? null : fino, aliquota }))
}

// Due fasce con lo STESSO limite superiore: la delibera come il MEF la pubblica non
// descrive una scala progressiva valida. Al 12/08/2026 i casi sono due — Airuno (LC) e
// Bentivoglio (BO) — con lo stesso identico refuso: la terza fascia ripete «da 15.000,01
// fino a 28.000,00» dove nei rispettivi file 2025 diceva «da 28.000,01 a 50.000,00».
// E' un errore della fonte, non del parser.
//
// Non lo correggiamo indovinando il confine giusto: inventare un dato fiscale e' peggio
// che dichiararne uno incerto. Lo segnaliamo, e la pagina lo dice accanto al numero.
function anomaliaDegliScaglioni(scaglioni) {
  const confini = scaglioni.map(({ fino }) => fino ?? Infinity)
  const ripetuti = confini.filter((fino, i) => i > 0 && fino <= confini[i - 1])
  if (ripetuti.length === 0) return null
  return (
    'l’elenco del MEF riporta per questo comune due fasce con lo stesso limite superiore: ' +
    'la scala degli scaglioni non e’ progressiva come la norma richiede'
  )
}

// ---------------------------------------------------------------------------
// L'elenco comunale
// ---------------------------------------------------------------------------

const COLONNE_COMUNALI = [
  'CODICE_CATASTALE',
  'COMUNE',
  'PR',
  'NUMERO_DELIBERA',
  'DATA_DELIBERA',
  'DATA_PUBBLICAZIONE',
  'NOTE',
  'FLAG_NUOVA',
  'IMPORTO_ESENTE',
]

// «0*» significa che alla data dell'interrogazione il comune non ha (ancora) deliberato
// per l'anno in corso: non distingue chi non ha mai istituito il tributo da chi e' in
// proroga. La distinzione si fa incrociando con l'anno precedente.
const SENZA_DELIBERA = '0*'

function leggiElencoComunale(testo, anno) {
  const record = leggiCsv(testo, SORGENTI.comunale.separatore)
  pretendiColonne(record[0], COLONNE_COMUNALI, `MEF comunale ${anno}`)
  pretendiColonne(record[0], ['ALIQUOTA', 'FASCIA', 'ALIQUOTA_12', 'FASCIA_12'], `MEF comunale ${anno}`)

  const perCodice = new Map()
  for (const riga of record) {
    if (riga.CODICE_CATASTALE) perCodice.set(riga.CODICE_CATASTALE, riga)
  }
  pretendi(perCodice.size > 7000, `elenco comunale ${anno} troppo corto: ${perCodice.size} righe`)
  return perCodice
}

function coppieAliquotaFascia(riga) {
  const coppie = []
  for (let n = 1; n <= 12; n += 1) {
    const suffisso = n === 1 ? '' : `_${n}`
    const aliquota = riga[`ALIQUOTA${suffisso}`]
    const fascia = riga[`FASCIA${suffisso}`]
    if (aliquota || fascia) coppie.push({ aliquota, fascia })
  }
  return coppie
}

// L'esenzione universale e' una pseudo-aliquota: una coppia con aliquota 0 e fascia
// «Esenzione per redditi imponibili fino a euro N». Il campo strutturato IMPORTO_ESENTE
// non basta — per i comuni fuori formato (FLAG_NUOVA = 0) resta a zero anche quando
// l'esenzione c'e'.
const ESENZIONE_UNIVERSALE = /^esenzione per redditi imponibili fino a euro/i
const ESENZIONE_QUALSIASI = /^esenzione\b/i

function regolaComunale(riga, chi) {
  const coppie = coppieAliquotaFascia(riga)
  if (coppie.some(({ aliquota }) => aliquota === SENZA_DELIBERA)) return null

  let esenzioneFinoA = null
  let nota = null
  const scaglioni = []

  for (const coppia of coppie) {
    const fascia = (coppia.fascia ?? '').trim()
    if (ESENZIONE_UNIVERSALE.test(fascia)) {
      esenzioneFinoA = numeroItaliano(fascia.replace(ESENZIONE_UNIVERSALE, ''))
      pretendi(esenzioneFinoA !== null, `soglia di esenzione illeggibile per ${chi}: «${fascia}»`)
    } else if (ESENZIONE_QUALSIASI.test(fascia)) {
      // Esenzione non universale, descritta in testo libero per categorie di reddito: la
      // parte strutturata si calcola comunque e la nota viene mostrata accanto alla voce
      // (raccomandazione della ricerca issue #18, par. 5). Il prototipo puo' sovrastimare
      // l'addizionale di chi rientra nella categoria descritta: e' una degradazione
      // dichiarata, non un errore silenzioso.
      nota = nota === null ? fascia : `${nota} ${fascia}`
    } else {
      scaglioni.push(coppia)
    }
  }

  const importoEsente = numeroItaliano(riga.IMPORTO_ESENTE)
  if (esenzioneFinoA === null && importoEsente) esenzioneFinoA = importoEsente

  const scaglioniLetti = scaglioniDaFasce(scaglioni, chi)

  return {
    scaglioni: scaglioniLetti,
    esenzioneFinoA,
    nota,
    anomalia: anomaliaDegliScaglioni(scaglioniLetti),
    delibera: riga.NUMERO_DELIBERA || null,
    dataDelibera: riga.DATA_DELIBERA || null,
    pubblicata: riga.DATA_PUBBLICAZIONE || null,
  }
}

// Il tributo non istituito non e' un dato mancante: e' addizionale zero, voce a zero in
// cascata. Mai una riga assente — un comune senza riga sarebbe indistinguibile da un bug.
const TRIBUTO_NON_ISTITUITO = {
  scaglioni: [{ fino: null, aliquota: 0 }],
  esenzioneFinoA: null,
  nota: null,
  anomalia: null,
}

// ---------------------------------------------------------------------------
// Composizione
// ---------------------------------------------------------------------------

function componiEnte(chiave, regolaCsv, codiceMef, denominazioneIstat) {
  const curato = AGEVOLAZIONI[chiave]
  const attesa = curato?.dispositivo ?? FUORI_PERIMETRO[chiave] ?? null
  const trovata = impronta(regolaCsv.dispositivo)

  // Ogni disposizione regionale non vuota dev'essere stata letta da una persona e
  // classificata: applicata (AGEVOLAZIONI) o esclusa con la sua ragione (FUORI_PERIMETRO).
  // Una disposizione nuova, o cambiata, ferma l'importazione — e' l'unico punto in cui il
  // testo libero puo' introdurre una regola che il motore dovrebbe applicare e non applica.
  pretendi(
    attesa !== null || regolaCsv.dispositivo.trim() === '',
    `l'ente «${chiave}» ha una disposizione che nessuno ha ancora letto (impronta ${trovata}). ` +
      'Leggerla alla fonte e classificarla in AGEVOLAZIONI (si applica) o in FUORI_PERIMETRO ' +
      '(non si applica, con la ragione).',
  )
  pretendi(
    attesa === null || attesa === trovata,
    `il testo della disposizione di «${chiave}» non e' piu' quello su cui la classificazione ` +
      `e' stata fatta (impronta attesa ${attesa}, trovata ${trovata}). Rileggere il campo ` +
      'DISPOSIZIONE alla fonte e ricurare la voce.',
  )

  const denominazione = DENOMINAZIONI[chiave] ?? `Regione ${denominazioneIstat}`
  pretendi(denominazioneIstat || DENOMINAZIONI[chiave], `nessuna denominazione per l'ente «${chiave}»`)

  return {
    slug: chiave,
    denominazione,
    nome: denominazione.replace(/^(Regione|Provincia autonoma di)\s+/, ''),
    scaglioni: curato?.scaglioni ?? regolaCsv.scaglioni,
    esenzioneFinoA: curato?.esenzioneFinoA ?? null,
    varianti: curato?.varianti ?? [],
    detrazioni: curato?.detrazioni ?? [],
    fonte: {
      citazione:
        `MEF, addizionale regionale IRPEF — ${denominazione}, anno d’imposta ${regolaCsv.anno} ` +
        `(delibera ${regolaCsv.delibera} del ${regolaCsv.pubblicata})`,
      url: URL_SCHEDA_REGIONALE(codiceMef),
    },
  }
}

async function importa({ anno, sorgenti, cartellaSorgenti }) {
  const { comuni: anagrafica, denominazioni, province } = leggiAnagrafica(sorgenti.istat)
  const regoleRegionali = leggiRegoleRegionali(sorgenti.regionale, anno)
  const comunaleCorrente = leggiElencoComunale(sorgenti.comunaleCorrente, anno)
  const comunalePrecedente = leggiElencoComunale(sorgenti.comunalePrecedente, anno - 1)

  const codiciMef = cartellaSorgenti
    ? Object.fromEntries([...regoleRegionali.keys()].map((k, i) => [k, i + 1]))
    : await scopriCodiciMef(new Set(regoleRegionali.keys()))
  for (const chiave of regoleRegionali.keys()) {
    pretendi(chiave in codiciMef, `nessuna scheda MEF trovata per l'ente «${chiave}»`)
  }

  const enti = new Map()
  for (const [chiave, regolaCsv] of regoleRegionali) {
    enti.set(chiave, {
      ente: componiEnte(chiave, { ...regolaCsv, anno }, codiciMef[chiave], denominazioni.get(chiave)),
      comuni: {},
    })
  }

  const conteggi = {
    delibera: 0,
    proroga: 0,
    nonIstituito: 0,
    senzaAnagrafica: 0,
    conNota: 0,
    conAnomalia: [],
  }

  for (const [codice, riga] of comunaleCorrente) {
    const anagrafe = anagrafica.get(codice)
    if (!anagrafe) {
      // Fusioni gia' nel MEF e non ancora in ISTAT: il comune resta fuori dal menu' invece
      // di finire nell'ente sbagliato. Si conta e si dichiara, non si nasconde.
      conteggi.senzaAnagrafica += 1
      continue
    }
    pretendi(enti.has(anagrafe.ente), `comune ${codice} (${anagrafe.nome}) su un ente ignoto: «${anagrafe.ente}»`)

    let regola = regolaComunale(riga, `comune ${codice}`)
    let annoRegola = anno

    if (regola === null) {
      // Proroga d'ufficio: senza delibera nell'anno valgono aliquote e soglia dell'anno
      // precedente (art. 1 c. 169 L. 296/2006; art. 1 c. 752 L. 207/2024).
      const rigaPrecedente = comunalePrecedente.get(codice)
      regola = rigaPrecedente ? regolaComunale(rigaPrecedente, `comune ${codice} (${anno - 1})`) : null
      annoRegola = anno - 1
      if (regola === null) {
        regola = { ...TRIBUTO_NON_ISTITUITO, delibera: null, dataDelibera: null, pubblicata: null }
        annoRegola = anno
        conteggi.nonIstituito += 1
      } else {
        conteggi.proroga += 1
      }
    } else {
      conteggi.delibera += 1
    }
    if (regola.nota) conteggi.conNota += 1
    if (regola.anomalia) conteggi.conAnomalia.push(`${codice} ${anagrafe.nome}`)

    enti.get(anagrafe.ente).comuni[codice] = {
      nome: anagrafe.nome,
      provincia: anagrafe.provincia,
      scaglioni: regola.scaglioni,
      esenzioneFinoA: regola.esenzioneFinoA,
      nota: regola.nota,
      anomalia: regola.anomalia,
      delibera: regola.delibera,
      dataDelibera: regola.dataDelibera,
      pubblicata: regola.pubblicata,
      annoRegola,
    }
  }

  for (const [chiave, dati] of enti) {
    const capoluogo = CAPOLUOGHI[chiave]
    pretendi(capoluogo, `nessun capoluogo dichiarato per l'ente «${chiave}»`)
    pretendi(
      capoluogo in dati.comuni,
      `il capoluogo ${capoluogo} dichiarato per «${chiave}» non e' fra i suoi comuni`,
    )
    dati.capoluogo = capoluogo
    pretendi(Object.keys(dati.comuni).length > 0, `l'ente «${chiave}» e' rimasto senza comuni`)

    // Solo le province che hanno davvero un comune in questo elenco: una sigla senza comuni
    // sarebbe una voce di menu' che apre su un menu' vuoto. In ordine alfabetico, che e'
    // l'ordine in cui il menu' le mostra.
    const usate = new Set(Object.values(dati.comuni).map(({ provincia }) => provincia))
    dati.province = Object.fromEntries(
      [...province.get(chiave)]
        .filter(([sigla]) => usate.has(sigla))
        .sort(([, a], [, b]) => a.localeCompare(b, 'it')),
    )
    for (const sigla of usate) {
      pretendi(sigla in dati.province, `la sigla «${sigla}» di «${chiave}» non ha un nome ISTAT`)
    }
  }

  return { enti, conteggi }
}

// ---------------------------------------------------------------------------
// Scrittura
// ---------------------------------------------------------------------------

// Un comune per riga: il file resta leggibile in un diff senza gonfiarsi come farebbe con
// l'indentazione piena su ottomila oggetti.
function serializza(dati) {
  const { comuni, ...testa } = dati
  const righeComuni = Object.entries(comuni)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([codice, comune]) => `    ${JSON.stringify(codice)}: ${JSON.stringify(comune)}`)
  const testaSerializzata = JSON.stringify(testa, null, 2).replace(/\n\}$/, '')
  return `${testaSerializzata},\n  "comuni": {\n${righeComuni.join(',\n')}\n  }\n}\n`
}

async function scrivi(cartella, { enti, conteggi }, { anno, scaricatoIl }) {
  await rm(cartella, { recursive: true, force: true })
  await mkdir(cartella, { recursive: true })

  const indice = []
  for (const [chiave, dati] of [...enti].sort(([a], [b]) => a.localeCompare(b))) {
    await writeFile(
      join(cartella, `${chiave}.json`),
      serializza({
        anno,
        scaricatoIl,
        ente: dati.ente,
        capoluogo: dati.capoluogo,
        province: dati.province,
        // Il link alla fonte di ogni comune si costruisce da qui invece di ripetere un URL
        // per riga: il codice catastale parametrizza la scheda MEF, e con lui la fonte.
        fonteComune: URL_SCHEDA_COMUNALE('{anno}', '{provincia}', '{codice}'),
        comuni: dati.comuni,
      }),
    )
    indice.push({
      slug: chiave,
      denominazione: dati.ente.denominazione,
      nome: dati.ente.nome,
      capoluogo: dati.capoluogo,
      comuni: Object.keys(dati.comuni).length,
    })
  }

  await writeFile(
    join(cartella, 'indice.json'),
    `${JSON.stringify({ anno, scaricatoIl, enti: indice }, null, 2)}\n`,
  )

  return { indice, conteggi }
}

// ---------------------------------------------------------------------------
// Ingresso
// ---------------------------------------------------------------------------

function leggiArgomenti(argv) {
  const opzioni = { anno: ANNO_CORRENTE, cartellaSorgenti: null, mostraImpronte: false }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--anno') opzioni.anno = Number(argv[(i += 1)])
    else if (argv[i] === '--sorgenti') opzioni.cartellaSorgenti = argv[(i += 1)]
    else if (argv[i] === '--mostra-impronte') opzioni.mostraImpronte = true
    else throw new ErroreDiImportazione(`argomento non riconosciuto: ${argv[i]}`)
  }
  pretendi(Number.isInteger(opzioni.anno), 'l’anno deve essere un intero')
  return opzioni
}

async function principale() {
  const { anno, cartellaSorgenti, mostraImpronte } = leggiArgomenti(process.argv.slice(2))
  // Data locale, non UTC: a fine giornata `toISOString` scriverebbe la data di ieri, e la
  // data di scarico e' il dato che dice quanto sono vecchie queste aliquote.
  const scaricatoIl = new Date().toLocaleDateString('sv-SE')

  console.log(`Importazione delle addizionali per l'anno d'imposta ${anno}`)
  console.log(cartellaSorgenti ? `  sorgenti locali: ${cartellaSorgenti}` : '  scarico dalle fonti MEF e ISTAT...')

  const sorgenti = {
    istat: await scarica(URL_ISTAT, SORGENTI.istat, cartellaSorgenti, 'istat.csv'),
    regionale: await scarica(URL_REGIONALE(anno), SORGENTI.regionale, cartellaSorgenti, `reg${anno}.csv`),
    comunaleCorrente: await scarica(URL_COMUNALE(anno), SORGENTI.comunale, cartellaSorgenti, `com${anno}.csv`),
    comunalePrecedente: await scarica(
      URL_COMUNALE(anno - 1),
      SORGENTI.comunale,
      cartellaSorgenti,
      `com${anno - 1}.csv`,
    ),
  }

  if (mostraImpronte) {
    for (const [chiave, regola] of leggiRegoleRegionali(sorgenti.regionale, anno)) {
      console.log(`  ${chiave.padEnd(24)} ${impronta(regola.dispositivo)}`)
    }
    return
  }

  const importato = await importa({ anno, sorgenti, cartellaSorgenti })
  // fileURLToPath e non `.pathname`: uno spazio nel percorso del progetto arriverebbe
  // percent-encodato e l'importazione scriverebbe in una cartella accanto a quella giusta.
  const cartella = fileURLToPath(new URL(`../dati/addizionali/${anno}/`, import.meta.url))
  const { indice, conteggi } = await scrivi(cartella, importato, { anno, scaricatoIl })

  const comuni = indice.reduce((totale, e) => totale + e.comuni, 0)
  console.log(`\n  ${indice.length} enti impositori, ${comuni} comuni, scaricati il ${scaricatoIl}`)
  console.log(`  delibera ${anno}: ${conteggi.delibera} | proroga da ${anno - 1}: ${conteggi.proroga} | tributo non istituito: ${conteggi.nonIstituito}`)
  console.log(`  con esenzione descrittiva («NOTA»), calcolata sulla sola parte strutturata: ${conteggi.conNota}`)
  if (conteggi.senzaAnagrafica > 0) {
    console.log(`  ESCLUSI perche' assenti dall'anagrafica ISTAT (fusioni recenti): ${conteggi.senzaAnagrafica}`)
  }
  if (conteggi.conAnomalia.length > 0) {
    // Non si tronca in silenzio e non si indovina: il difetto e' della fonte, si conta e
    // si stampa, e la pagina lo dichiara accanto al numero.
    console.log(`  con fasce non progressive nell'elenco MEF (refuso della fonte): ${conteggi.conAnomalia.length}`)
    for (const chi of conteggi.conAnomalia) console.log(`    - ${chi}`)
  }
  console.log(`  scritti in dati/addizionali/${anno}/`)
}

principale().catch((problema) => {
  console.error(
    problema instanceof ErroreDiImportazione
      ? `\nImportazione interrotta: ${problema.message}\n`
      : problema,
  )
  process.exitCode = 1
})
