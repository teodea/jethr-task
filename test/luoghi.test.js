// Il luogo come input (issue #21). Tre gruppi di prove, con ragioni diverse:
//
// 1. L'ORACOLO. I dati importati dal MEF sono prodotti da una macchina che parsa testo
//    libero; le costanti di Milano e della Lombardia sono curate a mano con la fonte
//    accanto al valore. Confrontarli e' l'unico modo per accorgersi che il parser ha
//    sbagliato: se le due strade divergono, una delle due e' rotta.
// 2. LA FORMA. Ogni regola importata deve reggere la forma che il motore sa calcolare —
//    scaglioni ordinati, un solo scaglione aperto e in fondo, aliquote plausibili. Sono
//    7.896 comuni: nessuno li guarda uno per uno, quindi li guarda un test.
// 3. I CASI CHE PRIMA NON ERANO ESPRIMIBILI. Esenzione regionale, variante di aliquota,
//    detrazione a rampa, tributo non istituito: quattro forme che il motore vecchio non
//    sapeva rappresentare, e che ora hanno un valore atteso derivato dalla norma.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { calcolaCascata, addizionale } from '../src/cascata.js'
import { registraEnte, costantiPerLuogo, luogoDefault } from '../src/luoghi.js'
import { censimentoSalti } from '../src/discontinuita.js'
import { testiCascata } from '../src/testi.js'
import { COSTANTI_2026 } from '../src/costanti/index.js'

const ANNO = 2026
const CARTELLA = new URL(`../dati/addizionali/${ANNO}/`, import.meta.url)

const leggi = (file) => JSON.parse(readFileSync(new URL(file, CARTELLA), 'utf8'))
const INDICE = leggi('indice.json')

// Registrare tutto in un colpo: la pagina ne carica uno per volta, ma il test deve poter
// guardare l'Italia intera.
const ENTI = INDICE.enti.map(({ slug }) => leggi(`${slug}.json`))
for (const dati of ENTI) registraEnte(dati)

const regolaComunale = (codice) => costantiPerLuogo(ANNO, codice).addizionaleComunale
const regolaRegionale = (codice) => costantiPerLuogo(ANNO, codice).addizionaleRegionale

// ---------------------------------------------------------------------------
// 1. L'oracolo: importato contro curato
// ---------------------------------------------------------------------------

test('i dati importati per Milano coincidono con le costanti curate a mano', () => {
  // Se il MEF pubblicasse per Milano una delibera 2026 diversa dalla proroga, questo test
  // fallirebbe: e' il presidio che tiene allineati il percorso predefinito (costanti) e
  // quello del selettore (JSON), invece di lasciarli divergere in silenzio.
  const importata = regolaComunale('F205')
  const curata = COSTANTI_2026.addizionaleComunale

  assert.deepEqual(importata.scaglioni, curata.scaglioni)
  assert.equal(importata.esenzioneFinoA, curata.esenzioneFinoA)
  assert.equal(importata.nome, curata.nome)
  assert.equal(importata.provincia, curata.provincia)
  assert.equal(importata.nota, curata.nota)
})

test('i dati importati per la Lombardia coincidono con le costanti curate a mano', () => {
  const importata = regolaRegionale('F205')
  const curata = COSTANTI_2026.addizionaleRegionale

  assert.deepEqual(importata.scaglioni, curata.scaglioni)
  assert.equal(importata.esenzioneFinoA, curata.esenzioneFinoA)
  assert.equal(importata.denominazione, curata.denominazione)
  assert.deepEqual(importata.varianti, [])
  assert.deepEqual(importata.detrazioni, [])
})

test('il luogo predefinito produce la stessa cascata sia scelto sia lasciato implicito', () => {
  // `comune: null` (nessun dato caricato) e `comune: 'F205'` (dato importato) devono dare
  // lo stesso netto al centesimo: sono due strade allo stesso luogo.
  const { comune } = luogoDefault(ANNO)
  for (const ral of [9000, 22000, 30000, 80000]) {
    const implicito = calcolaCascata({ ral, anno: ANNO })
    const esplicito = calcolaCascata({ ral, anno: ANNO, comune })
    assert.equal(esplicito.nettoAnnuo, implicito.nettoAnnuo, `netti diversi a RAL ${ral}`)
    assert.equal(esplicito.addizionaleComunale, implicito.addizionaleComunale)
    assert.equal(esplicito.addizionaleRegionale, implicito.addizionaleRegionale)
  }
})

// ---------------------------------------------------------------------------
// 2. La forma dei dati importati
// ---------------------------------------------------------------------------

test('i dati coprono i 21 enti impositori, con la data di scarico', () => {
  // Ventuno e non venti: il Trentino-Alto Adige non esiste come ente impositore, esistono
  // le due province autonome con leggi proprie (ricerca issue #18, par. 4).
  assert.equal(INDICE.enti.length, 21)
  assert.match(INDICE.scaricatoIl, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(
    INDICE.enti.some(({ slug }) => slug === 'trento') &&
      INDICE.enti.some(({ slug }) => slug === 'bolzano'),
    'le due province autonome devono essere enti a se',
  )
  assert.equal(
    readdirSync(CARTELLA).filter((f) => f.endsWith('.json')).length,
    22, // 21 enti + l'indice
  )
})

test('ogni ente dichiara un capoluogo che sta davvero fra i suoi comuni', () => {
  // E' il default del secondo menu': un capoluogo che non appartiene all'ente renderebbe
  // esprimibile proprio lo stato che la cascata dei due menu' esiste per impedire.
  for (const dati of ENTI) {
    assert.ok(dati.capoluogo in dati.comuni, `${dati.ente.slug}: capoluogo fuori dall'ente`)
  }
})

test('ogni regola importata ha la forma che il motore sa calcolare', () => {
  let comuni = 0
  for (const dati of ENTI) {
    for (const codice of Object.keys(dati.comuni)) {
      const regola = regolaComunale(codice)
      comuni += 1

      assert.ok(regola.scaglioni.length > 0, `${codice}: nessuno scaglione`)
      assert.equal(regola.scaglioni.at(-1).fino, Infinity, `${codice}: ultimo scaglione non aperto`)
      for (let i = 1; i < regola.scaglioni.length; i += 1) {
        // Non strettamente crescente: l'elenco MEF contiene refusi che ripetono un
        // confine (vedi il test sulle anomalie). L'ordinamento pero' dev'esserci, perche'
        // e' cio' che rende progressivo il calcolo.
        assert.ok(
          regola.scaglioni[i].fino >= regola.scaglioni[i - 1].fino,
          `${codice}: scaglioni non ordinati`,
        )
      }
      for (const { aliquota } of regola.scaglioni) {
        // Il tetto di legge e' 0,8% (D.Lgs. 360/1998 art. 1 c. 3), ma dodici comuni lo
        // superano legittimamente in deroga, fino all'1,2% (L. 234/2021 art. 1 c. 572;
        // D.L. 50/2022 art. 43 c. 2). Il test controlla la plausibilita', non il tetto:
        // troncare a 0,8 falserebbe Torino, Genova e gli altri dieci.
        assert.ok(aliquota >= 0 && aliquota <= 0.02, `${codice}: aliquota implausibile ${aliquota}`)
      }
      if (regola.esenzioneFinoA !== null) {
        assert.ok(regola.esenzioneFinoA > 0, `${codice}: soglia di esenzione non positiva`)
      }
    }
  }
  assert.ok(comuni > 7800, `attesi quasi ottomila comuni, trovati ${comuni}`)
})

test('nessun comune resta senza riga: il tributo non istituito e’ una voce a zero', () => {
  // Un comune assente sarebbe indistinguibile da un bug del parser. Chi non ha mai
  // istituito il tributo c'e', con addizionale zero — caso legittimo, non dato mancante.
  const senzaTributo = ENTI.flatMap((dati) =>
    Object.keys(dati.comuni).filter((codice) =>
      regolaComunale(codice).scaglioni.every(({ aliquota }) => aliquota === 0),
    ),
  )
  assert.ok(senzaTributo.length > 0, 'nessun comune senza tributo: sospetto')
  for (const codice of senzaTributo.slice(0, 50)) {
    assert.equal(addizionale(30000, regolaComunale(codice)), 0)
  }
})

test('ogni comune porta una fonte primaria sul dominio del MEF, col suo codice catastale', () => {
  for (const dati of ENTI) {
    for (const codice of Object.keys(dati.comuni)) {
      const { fonte } = regolaComunale(codice)
      assert.match(fonte.url, /^https:\/\/www1\.finanze\.gov\.it\//, `${codice}: fonte non primaria`)
      assert.ok(fonte.url.includes(`cc=${codice}`), `${codice}: la fonte non punta a questo comune`)
      assert.ok(fonte.citazione.length > 0, `${codice}: citazione vuota`)
    }
  }
})

// ---------------------------------------------------------------------------
// 3. I casi che il motore vecchio non sapeva rappresentare
// ---------------------------------------------------------------------------

test('esenzione regionale a scalino: la deduzione di Trento vale 30.000 [L.P. 13/2019 art. 1 c. 2-quater]', () => {
  // «Ai contribuenti aventi un reddito imponibile non superiore a euro 30.000,00 spetta una
  // deduzione di euro 30.000,00. Tale deduzione non spetta ai contribuenti aventi un
  // reddito imponibile superiore»: una deduzione pari alla soglia che la fa perdere e'
  // un'esenzione a scalino. Fonte: campo DISPOSIZIONE del CSV regionale MEF 2026.
  const trento = regolaRegionale('L378')
  assert.equal(trento.esenzioneFinoA, 30000)
  assert.equal(addizionale(30000, trento), 0)
  // sopra la soglia si paga sull'intero imponibile: 1,23% x 30.000,01
  assert.ok(Math.abs(addizionale(30000.01, trento) - 369.0) < 0.01)
})

test('variante di aliquota del FVG: 1,23% sull’intero, non 0,70% come primo scaglione', () => {
  // «in ipotesi di reddito imponibile fino a euro 15.000 l'aliquota e' pari a 0,70 per
  // cento. Per reddito imponibile superiore a euro 15.000 l'aliquota e' pari a 1,23 per
  // cento sull'intero importo» (art. 1 c. 5 L.R. FVG 14/2012, campo DISPOSIZIONE MEF 2026).
  // E' il test che distingue una variante da uno scaglione: letta come progressiva, a
  // 20.000 darebbe 166,50 invece di 246,00.
  const fvg = regolaRegionale('L424')
  assert.equal(addizionale(15000, fvg), 105) // 0,70% x 15.000
  assert.equal(addizionale(20000, fvg), 246) // 1,23% x 20.000, NON 105 + 1,23% x 5.000
})

test('detrazione regionale a rampa di Bolzano, cumulabile e senza credito d’imposta', () => {
  // 430,50 fino a 90.000; piu' 125 x (imponibile - 50.000) / 25.000, max 125, sopra i
  // 50.000; «le detrazioni sono cumulabili ma non generano credito d'imposta»
  // (art. 21-sexiesdecies L.P. 9/1998, campo DISPOSIZIONE MEF 2026).
  const bolzano = regolaRegionale('A952')

  // 20.000: lorda 1,23% x 20.000 = 246, sotto la detrazione fissa -> pavimento a zero
  assert.equal(addizionale(20000, bolzano), 0)
  // 60.000: 1,23% x 50.000 + 1,73% x 10.000 = 788; detrazioni 430,50 + 125 x 10.000/25.000 = 480,50
  assert.ok(Math.abs(addizionale(60000, bolzano) - 307.5) < 0.01)
  // 80.000: 615 + 519 = 1.134; detrazioni 430,50 + 125 (tetto raggiunto) = 555,50
  assert.ok(Math.abs(addizionale(80000, bolzano) - 578.5) < 0.01)
  // 95.000: oltre 90.000 la detrazione fissa non spetta piu'; resta la sola rampa al tetto
  assert.ok(Math.abs(addizionale(95000, bolzano) - 1268.5) < 0.01)
})

test('lo scalino si sposta col comune: il censimento dei salti e’ derivato, non milanese', () => {
  // E' il motivo per cui questa estensione rende personale l'intuizione migliore del
  // prototipo. La soglia comunale entra nel censimento dei salti derivandola dalle
  // costanti del luogo: a Milano sta a 23.000 di imponibile, a Trento c'e' quella
  // regionale a 30.000, e dove non c'e' esenzione non c'e' salto.
  // `includes` e non `startsWith`: due soglie che cadono sullo stesso reddito sono un
  // gradino solo, e il censimento le fonde in una voce con i due nomi accodati (issue #22).
  // Ad Aosta e' proprio il caso — l'esenzione regionale sta a 15.000, dove gia' finisce il
  // trattamento integrativo — e fonderle e' la lettura giusta: l'utente vede un salto, non
  // due sovrapposti.
  const soglie = (codice) =>
    censimentoSalti(costantiPerLuogo(ANNO, codice))
      .filter(({ nome }) => nome.includes('esenzione addizionale'))
      .map(({ rc }) => rc)

  assert.deepEqual(soglie('F205'), [23000]) // Milano: comunale
  assert.ok(soglie('L378').includes(30000), 'Trento: manca lo scalino regionale a 30.000')
  assert.ok(soglie('A326').includes(15000), 'Aosta: manca lo scalino regionale a 15.000')
})

test('il testo della voce comunale nomina il comune, e quello regionale il suo ente', () => {
  // Il luogo si dichiara da solo dentro il risultato, come gia' fa l'anno d'imposta,
  // invece di restare implicito in un menu' sopra la piega.
  const milano = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: 'F205' }))
  assert.match(milano.addizionaleComunale.etichetta, /Milano/)
  assert.match(milano.addizionaleComunale.spiegazione, /Comune di Milano/)
  assert.match(milano.addizionaleRegionale.spiegazione, /Regione Lombardia/)

  const roma = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: 'H501' }))
  assert.match(roma.addizionaleComunale.spiegazione, /Comune di Roma/)
  assert.match(roma.addizionaleRegionale.spiegazione, /Regione Lazio/)
  assert.doesNotMatch(roma.addizionaleComunale.spiegazione, /Milano/)

  // Le due province autonome stanno nella legge al posto della regione: il testo deve
  // dirlo con la loro denominazione, non chiamarle «Regione».
  const trento = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: 'L378' }))
  assert.match(trento.addizionaleRegionale.spiegazione, /Provincia autonoma di Trento/)
  assert.doesNotMatch(trento.addizionaleRegionale.etichetta, /Regione/)
})

test('la fonte delle addizionali segue il luogo, non l’anno', () => {
  const milano = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: 'F205' }))
  const roma = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: 'H501' }))

  assert.notEqual(milano.addizionaleComunale.fonte.url, roma.addizionaleComunale.fonte.url)
  assert.ok(milano.addizionaleComunale.fonte.url.includes('cc=F205'))
  assert.ok(roma.addizionaleComunale.fonte.url.includes('cc=H501'))
  assert.notEqual(milano.addizionaleRegionale.fonte.url, roma.addizionaleRegionale.fonte.url)
})

test('l’esenzione descrittiva («NOTA») si dichiara in pagina, non si nasconde', () => {
  // Centotto comuni hanno un'esenzione riservata a certe categorie di reddito, descritta in
  // testo libero. Il motore calcola sulla sola parte strutturata e puo' sovrastimare:
  // la degradazione va detta accanto al numero che ne risente.
  const conNota = ENTI.flatMap((dati) =>
    Object.keys(dati.comuni).filter((codice) => regolaComunale(codice).nota),
  )
  assert.ok(conNota.length > 50, `attesi circa cento comuni con nota, trovati ${conNota.length}`)

  const codice = conNota.find((c) => calcolaCascata({ ral: 30000, anno: ANNO, comune: c }).addizionaliDovute)
  const testi = testiCascata(calcolaCascata({ ral: 30000, anno: ANNO, comune: codice }))
  assert.match(testi.addizionaleComunale.nota, /non applica/)
  assert.match(testi.addizionaleComunale.nota, /più basso/)
})

test('un refuso della fonte si dichiara, non si aggiusta a indovinare', () => {
  // L'elenco MEF pubblica per qualche comune fasce che non formano una scala progressiva
  // (al 12/08/2026: Bentivoglio, BO, la cui terza fascia ripete il confine della seconda).
  // Correggerlo significherebbe inventare un confine che nessuna delibera dichiara: il
  // dato resta come pubblicato e la pagina avverte che l'importo e' indicativo.
  const anomali = ENTI.flatMap((dati) =>
    Object.keys(dati.comuni).filter((codice) => regolaComunale(codice).anomalia),
  )
  assert.ok(anomali.length < 20, `troppe anomalie (${anomali.length}): sospetto un bug del parser`)

  for (const codice of anomali) {
    const confini = regolaComunale(codice).scaglioni.map(({ fino }) => fino)
    assert.ok(
      confini.some((fino, i) => i > 0 && fino <= confini[i - 1]),
      `${codice}: marcato anomalo senza esserlo`,
    )
    const testi = testiCascata(calcolaCascata({ ral: 40000, anno: ANNO, comune: codice }))
    assert.match(testi.addizionaleComunale.nota, /indicativo/)
  }
})

test('un comune non caricato e’ un errore esplicito, non un calcolo sulle aliquote di Milano', () => {
  // Il fallimento silenzioso qui sarebbe il peggiore possibile: un netto plausibile,
  // calcolato sul comune sbagliato, indistinguibile da uno giusto.
  assert.throws(
    () => calcolaCascata({ ral: 30000, anno: ANNO, comune: 'ZZZZ' }),
    /comune non caricato/,
  )
})

test('le costanti di un luogo sono lo stesso oggetto a ogni chiamata [memoizzazione]', () => {
  // Non e' un dettaglio di prestazioni: `zoneNonMonotonia` indicizza le sue zone per
  // IDENTITA' dell'oggetto costanti, e senza questa garanzia il censimento dei salti —
  // che ricalcola la cascata a passi di un centesimo — verrebbe rifatto a ogni render.
  assert.equal(costantiPerLuogo(ANNO, 'F205'), costantiPerLuogo(ANNO, 'F205'))
  assert.notEqual(costantiPerLuogo(ANNO, 'F205'), costantiPerLuogo(ANNO, 'H501'))
})
