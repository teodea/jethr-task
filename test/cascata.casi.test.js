// Casi ancorati alle fonti primarie: ogni valore atteso porta la provenienza.
// Le coppie a cavallo derivate (calcoli dalle formule di legge, non esempi svolti
// di fonte) sono marcate [derivazione]: docs/ricerca/*.md, sezioni "Casi di test".

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  calcolaCascata,
  contributiDipendente,
  irpefLorda,
  aliquotaMarginale,
  detrazioneLavoroDipendente,
  ulterioreDetrazione,
  trattamentoIntegrativo,
  sommaIntegrativa,
  addizionaleRegionale,
  addizionaleComunale,
  troncaQuoziente,
} from '../src/cascata.js'
import { presentaCascata } from '../src/presentazione.js'
import { COSTANTI_2026, COSTANTI_2025 } from '../src/costanti/index.js'

const vicino = (attuale, atteso, tolleranza = 0.005) =>
  assert.ok(
    Math.abs(attuale - atteso) <= tolleranza,
    `atteso ${atteso}, ottenuto ${attuale} (scarto ${Math.abs(attuale - atteso)})`,
  )

test('IRPEF lorda 2026 alle ancore della scheda AE: 6.440 a 28.000 e 13.700 a 50.000', () => {
  // fonte: Agenzia delle Entrate, "Aliquote e calcolo dell'Irpef", anno 2026
  vicino(irpefLorda(28000, COSTANTI_2026), 6440)
  vicino(irpefLorda(50000, COSTANTI_2026), 13700)
  vicino(irpefLorda(60000, COSTANTI_2026), 13700 + 0.43 * 10000)
})

test('IRPEF lorda 2025 a 50.000: 14.140 (35% sul secondo scaglione, davvero in vigore nel 2025)', () => {
  // fonte: scheda AE 2026 ("13.700 invece di 14.140") + art. 11 TUIR vigente 31/12/2025
  vicino(irpefLorda(50000, COSTANTI_2025), 14140)
})

test('il quoziente delle detrazioni si assume nelle prime quattro cifre decimali (troncamento, art. 13 c. 6 TUIR)', () => {
  assert.equal(troncaQuoziente(12999 / 13000), 0.9999) // non arrotonda a 1
  assert.equal(troncaQuoziente(14998 / 22000), 0.6817) // 0,68172727... -> 0,6817
  assert.equal(troncaQuoziente(3770 / 13000), 0.29) // quoziente esatto in decimale: il float non deve mangiarsi l'ultima cifra
})

test('detrazione per lavoro dipendente: coppie a cavallo delle soglie [derivazione, issue #1]', () => {
  const d = (rc) => detrazioneLavoroDipendente(rc, COSTANTI_2026)
  vicino(d(8500), 1955)
  vicino(d(15000), 1955)
  vicino(d(15001), 3099.881) // salto in su della norma: 1.910 + 1.190 x 0,9999
  vicino(d(25000), 2184.533) // niente +65: 25.000 non e' "superiore a 25.000"
  vicino(d(25001), 2249.414) // scatta il +65
  vicino(d(28000), 1975) // 1.910 + 0 + 65: 28.000 sta nella fascia b
  vicino(d(28001), 1974.809) // raccordo quasi continuo b -> c
  vicino(d(35000), 1367.238) // ultimo punto col +65
  vicino(d(35001), 1302.047) // salto in giu' di ~65 (soglia secca in uscita)
  vicino(d(35002), 1302.047) // caso B della ricerca arrotondamenti: 1.910 x 0,6817
  vicino(d(50000), 0)
  vicino(d(50001), 0)
})

test('ulteriore detrazione: soglie e bordi del decalage [derivazione, issue #4]', () => {
  const u = (rc) => ulterioreDetrazione(rc, COSTANTI_2026)
  assert.equal(u(20000), 0)
  assert.equal(u(20001), 1000)
  assert.equal(u(32000), 1000)
  vicino(u(32001), 999.875) // bordo continuo del decalage
  assert.equal(u(40000), 0) // azzeramento continuo
  assert.equal(u(40001), 0)
})

test('trattamento integrativo: punto derivato di capienza a RC 8.173,91/8.173,92 [derivazione, issue #4]', () => {
  const t = (rc) => trattamentoIntegrativo(rc, irpefLorda(rc, COSTANTI_2026), COSTANTI_2026)
  assert.equal(t(8173.91), 0) // imposta lorda 1.879,999 NON supera 1.955 - 75 = 1.880
  assert.equal(t(8173.92), 1200) // 1.880,002 > 1.880
  assert.equal(t(15000), 1200)
  assert.equal(t(15001), 0) // sopra 15.000 nel perimetro il trattamento non spetta mai
})

test('somma integrativa: percentuale sul reddito intero, discontinua alle soglie [derivazione, issue #4]', () => {
  const s = (rc) => sommaIntegrativa(rc, rc, COSTANTI_2026)
  vicino(s(8500), 603.5) // 7,1% x 8.500
  vicino(s(8501), 450.553) // 5,3% x 8.501: il netto scende
  vicino(s(15000), 795)
  vicino(s(15001), 720.048) // 4,8%
  vicino(s(20000), 960)
  assert.equal(s(20001), 0) // soglia secca sul reddito complessivo
})

test('addizionale regionale Lombardia per scaglioni progressivi [derivazione, issue #3]', () => {
  const r = (imponibile) => addizionaleRegionale(imponibile, COSTANTI_2026)
  vicino(r(15000), 184.5)
  vicino(r(16000), 200.3) // se fosse sull'intero reddito sarebbe 252,80
  vicino(r(23000), 310.9)
  vicino(r(28000), 389.9)
  vicino(r(50000), 768.3)
})

test('addizionale comunale Milano: esenzione a scalino a 23.000 [derivazione, issue #3]', () => {
  const c = (imponibile) => addizionaleComunale(imponibile, COSTANTI_2026)
  assert.equal(c(23000), 0)
  vicino(c(23000.01), 184.0) // sopra la soglia si paga sull'INTERO imponibile
  vicino(c(28000), 224)
  vicino(c(50000), 400)
})

test('contributi: 1% aggiuntivo oltre la prima fascia e stop al massimale [issue #2, Circolare INPS 6/2026]', () => {
  const c = (ral) => contributiDipendente(ral, COSTANTI_2026)
  assert.equal(c(56224).aggiuntivo, 0)
  vicino(c(56225).aggiuntivo, 0.01)
  vicino(c(80000).aggiuntivo, 237.76) // 1% x (80.000 - 56.224)
  // oltre il massimale i contributi non crescono piu' (iscritto post-1995)
  assert.equal(c(122295).totale, c(122296).totale)
  vicino(c(122295).totale, 0.0919 * 122295 + 0.01 * (122295 - 56224))
})

test('sotto il massimale la deroga ante-1996 non sposta una cifra [issue #23]', () => {
  // E' la premessa della decisione di non chiedere la data di prima iscrizione nel form:
  // sotto il tetto qualunque risposta da' lo stesso identico risultato, quindi la domanda
  // sarebbe un costo per tutti e un'informazione per nessuno. Se questo test cadesse, la
  // domanda andrebbe rimessa nel form — non e' un dettaglio di interfaccia, e' dominio.
  const massimale = COSTANTI_2026.contributi.massimaleAnnuo
  for (const ral of [8500, 30000, 56224, 80000, massimale - 0.01, massimale]) {
    const standard = calcolaCascata({ ral, anno: 2026 })
    const conDeroga = calcolaCascata({ ral, anno: 2026, iscrittoAnte1996: true })
    for (const [voce, valore] of Object.entries(standard)) {
      if (typeof valore !== 'number') continue
      assert.equal(conDeroga[voce], valore, `la deroga sposta ${voce} a RAL ${ral}`)
    }
  }
})

test('sopra il massimale la deroga toglie il tetto: 9,19% e 1% su tutta la RAL [issue #23, Circ. INPS 6/2026 par. 6]', () => {
  // "Per i lavoratori gia' iscritti al 31/12/1995 il massimale non esiste: 9,19% e 1% su
  // tutta la retribuzione" (docs/ricerca/contributi-dipendente-...md, par. 3.3, che cita
  // art. 2 c. 18 L. 335/1995 e la circolare dell'anno).
  const c = COSTANTI_2026.contributi
  const ral = 150000
  const conDeroga = contributiDipendente(ral, COSTANTI_2026, { iscrittoAnte1996: true })

  assert.equal(conDeroga.baseContributiva, ral) // niente tetto sulla base
  vicino(
    conDeroga.totale,
    c.aliquotaIvsDipendente * ral + c.aliquotaAggiuntiva * (ral - c.primaFasciaAnnua),
  )
  // e i contributi continuano a crescere dove per l'iscritto post-1995 si fermavano
  const oltre = contributiDipendente(ral + 1000, COSTANTI_2026, { iscrittoAnte1996: true })
  vicino(oltre.totale - conDeroga.totale, 1000 * (c.aliquotaIvsDipendente + c.aliquotaAggiuntiva))
})

test('quanto vale davvero la deroga: ~1.537,76 EUR di netto in meno su RAL 150.000 [derivazione, issue #23]', () => {
  // La cifra che giustifica l'offerta, e insieme la sua misura: la issue la stimava
  // "~1.500 EUR". Derivazione: 2.823,14 di contributi in piu' (9,19% + 1% sui 27.705 EUR
  // sopra il massimale), di cui il fisco restituisce il 43% di IRPEF marginale, l'1,73%
  // di addizionale regionale (ultimo scaglione Lombardia) e lo 0,8% comunale.
  const standard = calcolaCascata({ ral: 150000, anno: 2026 })
  const conDeroga = calcolaCascata({ ral: 150000, anno: 2026, iscrittoAnte1996: true })

  vicino(conDeroga.contributiDipendente - standard.contributiDipendente, 2823.14, 0.01)
  vicino(conDeroga.nettoAnnuo - standard.nettoAnnuo, -1537.76, 0.01)
})

test('caso end-to-end di incapienza: RAL 8.500 [derivazione, issue #4, par. 6]', () => {
  const c = calcolaCascata({ ral: 8500, anno: 2026 })
  vicino(c.contributiDipendente, 781.15)
  vicino(c.imponibileFiscale, 7718.85)
  vicino(c.irpefLorda, 1775.34)
  assert.equal(c.irpefNetta, 0) // detrazione 1.955 >= imposta lorda: sotto la no tax area
  assert.equal(c.trattamentoIntegrativo, 0) // 1.775,34 NON supera 1.880: la capienza nega proprio ai redditi piu' bassi
  vicino(c.sommaIntegrativa, 548.04) // 7,1% x 7.718,85: l'erogazione arriva intera nonostante l'incapienza
  assert.equal(c.addizionaleRegionale, 0) // gate: IRPEF netta = 0
  assert.equal(c.addizionaleComunale, 0)
  vicino(c.nettoAnnuo, 8266.89)
  assert.equal(presentaCascata(c).nettoAnnuo, 8266.89)
})

test('stessa RAL, anni 2025 vs 2026: divergenza esattamente pari al 2% della fascia 28-50k [issue #6]', () => {
  const r2026 = calcolaCascata({ ral: 40000, anno: 2026 })
  const r2025 = calcolaCascata({ ral: 40000, anno: 2025 })
  // imponibile identico (40.000 < prima fascia in entrambi gli anni); divergono solo
  // le aliquote IRPEF: 35% vs 33% su (36.324 - 28.000)
  assert.equal(r2026.imponibileFiscale, r2025.imponibileFiscale)
  const attesa = 0.02 * (r2026.imponibileFiscale - 28000)
  vicino(r2026.nettoAnnuo - r2025.nettoAnnuo, attesa, 1e-6)
})

test('mondo del centesimo: IRPEF netta a imponibile 35.001,50 con quoziente troncato [issue #5, caso C]', () => {
  // La ricerca arrotondamenti dimostra che la politica dichiarativa (per voce, unita'
  // di euro) darebbe 7.449; il motore lavora al centesimo con il solo troncamento
  // del quoziente: 8.750,495 - 1.302,047 = 7.448,448.
  const lorda = irpefLorda(35001.5, COSTANTI_2026)
  const detrazione = detrazioneLavoroDipendente(35001.5, COSTANTI_2026)
  vicino(lorda, 8750.495)
  vicino(detrazione, 1302.047)
  vicino(lorda - detrazione, 7448.448)
})

test('netto mensile: media sul divisore delle mensilita', () => {
  const c13 = calcolaCascata({ ral: 30000, mensilita: 13 })
  const c14 = calcolaCascata({ ral: 30000, mensilita: 14 })
  assert.equal(c13.nettoAnnuo, c14.nettoAnnuo) // le mensilita' non toccano l'annuo
  vicino(c13.nettoMensile, c13.nettoAnnuo / 13, 1e-9)
  vicino(c14.nettoMensile, c14.nettoAnnuo / 14, 1e-9)
})

test('quadratura per differenza: le voci esposte sommano esattamente al netto mostrato [issue #5]', () => {
  for (const ral of [8500, 9396.46, 13457.89, 23000.01, 34567.12, 87654.32, 150000]) {
    const voci = presentaCascata(calcolaCascata({ ral, anno: 2026 }))
    const cent = (v) => Math.round(v * 100)
    const somma =
      cent(voci.ral) -
      cent(voci.contributiDipendente) -
      cent(voci.irpefNetta) -
      cent(voci.addizionaleRegionale) -
      cent(voci.addizionaleComunale) +
      cent(voci.trattamentoIntegrativo) +
      cent(voci.sommaIntegrativa)
    assert.equal(somma, cent(voci.nettoAnnuo), `quadratura rotta a RAL ${ral}`)
    // anche le identita' intermedie devono tornare con la calcolatrice sui valori esposti
    assert.equal(cent(voci.ral) - cent(voci.contributiDipendente), cent(voci.imponibileFiscale), `RAL - contributi != imponibile a RAL ${ral}`)
    assert.equal(cent(voci.irpefLorda) - cent(voci.detrazioniEffettive), cent(voci.irpefNetta), `lorda - detrazioni != netta a RAL ${ral}`)
  }
})

test('trattenute totali: quadrano con i due numeri esposti e restano al netto delle erogazioni [issue #11]', () => {
  // [derivazione] nessuna fonte definisce questo aggregato: e' RAL - netto annuo. Il test
  // che conta e' che torni con la calcolatrice sui valori ESPOSTI — chi rifa' la
  // sottrazione a mano leggendo la pagina deve ottenere lo stesso centesimo.
  for (const ral of [8500, 9396.46, 13457.89, 23000.01, 34567.12, 87654.32, 150000]) {
    const cascata = calcolaCascata({ ral, anno: 2026 })
    const voci = presentaCascata(cascata)
    const cent = (v) => Math.round(v * 100)

    assert.equal(
      cent(voci.trattenuteTotali),
      cent(voci.ral) - cent(voci.nettoAnnuo),
      `trattenute non quadrate a RAL ${ral}`,
    )
    assert.ok(voci.incidenzaTrattenute < 1, `incidenza fuori scala a RAL ${ral}`)
    // un'erogazione non e' una trattenuta (CONTEXT.md): dove ce ne sono, l'aggregato deve
    // stare sotto la somma dei prelievi esattamente di quanto vale l'erogazione
    const prelievi =
      cent(voci.contributiDipendente) +
      cent(voci.irpefNetta) +
      cent(voci.addizionaleRegionale) +
      cent(voci.addizionaleComunale)
    const erogazioni = cent(voci.trattamentoIntegrativo) + cent(voci.sommaIntegrativa)
    assert.equal(
      cent(voci.trattenuteTotali),
      prelievi - erogazioni,
      `erogazioni contate come trattenute a RAL ${ral}`,
    )
  }
})

test('aliquota marginale ancorata agli scaglioni: 23/33/43 nel 2026, 35% nel 2025 [art. 11 TUIR]', () => {
  const marginale = (ral, anno) => calcolaCascata({ ral, anno }).aliquotaMarginale
  // RAL scelte perche' l'imponibile (RAL x 0,9081) cada nello scaglione voluto
  assert.equal(marginale(20000, 2026), 0.23) // imponibile 18.162
  assert.equal(marginale(35000, 2026), 0.33) // imponibile 31.783,50
  assert.equal(marginale(70000, 2026), 0.43) // imponibile 63.429,24 (aggiuntivo 1% incluso)
  assert.equal(marginale(35000, 2025), 0.35) // stessa RAL, anno 2025: il 35% era in vigore
  // bordi: "fino a" e' inclusivo (art. 11 c. 1: "fino a 28.000", "fino a 50.000")
  assert.equal(aliquotaMarginale(28000, COSTANTI_2026), 0.23)
  assert.equal(aliquotaMarginale(28000.01, COSTANTI_2026), 0.33)
  assert.equal(aliquotaMarginale(50000, COSTANTI_2026), 0.33)
  assert.equal(aliquotaMarginale(50000.01, COSTANTI_2026), 0.43)
})
