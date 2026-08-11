// I testi dell'interfaccia sono codice come il resto: se citano un numero, quel numero
// deve venire dalle costanti dell'anno. Il test centrale e' quello anti-hardcoding —
// stesso testo, due anni, cifre diverse. Le asserzioni sulle cifre usano regex tolleranti
// agli spazi perche' Intl inserisce spazi unificatori che non si vedono a occhio.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcolaCascata } from '../src/cascata.js'
import { zoneNonMonotonia } from '../src/discontinuita.js'
import { COSTANTI_2026 } from '../src/costanti/index.js'
import { testiCascata, avvisoScalino, ORDINE_VOCI } from '../src/testi.js'

const cascata2026 = (ral) => calcolaCascata({ ral, anno: 2026 })

test('ogni voce della cascata ha etichetta e spiegazione non vuote', () => {
  const testi = testiCascata(cascata2026(30000))
  for (const voce of ORDINE_VOCI) {
    assert.ok(testi[voce], `voce senza testo: ${voce}`)
    assert.ok(testi[voce].etichetta.length > 0, `etichetta vuota: ${voce}`)
    assert.ok(testi[voce].spiegazione.length > 0, `spiegazione vuota: ${voce}`)
  }
})

test('le aliquote citate nei testi seguono l’anno: 33% nel 2026, 35% nel 2025', () => {
  // Il test che rende falsificabile la regola "nessun numero scritto a mano nei testi":
  // un "33%" hardcodato passerebbe la riga 2026 e fallirebbe questa.
  const testo2026 = testiCascata(calcolaCascata({ ral: 40000, anno: 2026 })).irpefLorda.spiegazione
  const testo2025 = testiCascata(calcolaCascata({ ral: 40000, anno: 2025 })).irpefLorda.spiegazione

  assert.match(testo2026, /33\s*%/, 'il testo 2026 deve citare il secondo scaglione al 33%')
  assert.doesNotMatch(testo2026, /35\s*%/, 'il testo 2026 non deve citare il 35%')

  assert.match(testo2025, /35\s*%/, 'il testo 2025 deve citare il secondo scaglione al 35%')
  assert.doesNotMatch(testo2025, /33\s*%/, 'il testo 2025 non deve citare il 33%')
})

test('anche le soglie contributive seguono l’anno: prima fascia 56.224 nel 2026, 55.448 nel 2025', () => {
  // fonte dei due valori: Circolare INPS 6/2026 par. 5 e Circolare INPS 26/2025 par. 5
  // (docs/ricerca/contributi-dipendente-...md e costanti-2025-e-protocollo-cu.md)
  const nota2026 = testiCascata(calcolaCascata({ ral: 80000, anno: 2026 })).contributiDipendente.nota
  const nota2025 = testiCascata(calcolaCascata({ ral: 80000, anno: 2025 })).contributiDipendente.nota

  assert.match(nota2026, /56\.224/)
  assert.match(nota2025, /55\.448/)
})

test('sopra la soglia comunale il testo avverte che non e’ una franchigia', () => {
  // imponibile 27.243 su RAL 30.000: sopra i 23.000 di Milano
  const testi = testiCascata(cascata2026(30000))
  assert.match(testi.addizionaleComunale.nota, /intero imponibile/)
  assert.match(testi.addizionaleComunale.nota, /non una franchigia/)
})

test('in incapienza il testo dice quanto sconto va perso', () => {
  // RAL 9.000: IRPEF netta zero, la detrazione art. 13 eccede l'imposta lorda
  const cascata = cascata2026(9000)
  assert.equal(cascata.irpefNetta, 0)

  const testi = testiCascata(cascata)
  assert.match(testi.detrazioniEffettive.nota, /non vengono utilizzati/)
  // le addizionali non sono dovute: il gate deve essere spiegato su entrambe
  assert.match(testi.addizionaleRegionale.nota, /IRPEF risulta dovuta/)
  assert.match(testi.addizionaleComunale.nota, /IRPEF risulta dovuta/)
})

test('sotto la soglia comunale, con IRPEF dovuta, il testo dice che si e’ esenti', () => {
  // RAL 22.000: imponibile ~19.978, sotto i 23.000 ma con IRPEF netta positiva
  const cascata = cascata2026(22000)
  assert.ok(cascata.irpefNetta > 0)
  assert.equal(cascata.addizionaleComunale, 0)

  assert.match(testiCascata(cascata).addizionaleComunale.nota, /esenzione/)
})

test('la maggiorazione di 65 euro e’ segnalata solo dentro la sua finestra', () => {
  // RC fra 25.000 e 35.000 (art. 13 c. 1.1): RAL 30.000 => RC 27.243
  assert.match(testiCascata(cascata2026(30000)).detrazioneLavoroDipendente.nota, /maggiorazione/)
  // RAL 60.000 => RC ben oltre 35.000
  assert.equal(testiCascata(cascata2026(60000)).detrazioneLavoroDipendente.nota, null)
})

test('l’aggregato dei prelievi si chiama «trattenute totali», mai «tasse» [glossario]', () => {
  // Il glossario tiene contributi e imposte sotto etichette diverse: un'etichetta "tasse"
  // sull'aggregato le rifonderebbe proprio nel punto piu' visibile della pagina.
  const { etichetta, spiegazione } = testiCascata(cascata2026(30000)).trattenuteTotali
  assert.equal(etichetta, 'Trattenute totali')
  assert.doesNotMatch(etichetta, /tass/i)
  assert.ok(spiegazione.length > 0)
})

test('trattenute totali negative: il testo spiega che le erogazioni superano i prelievi', () => {
  // RAL 9.396,46: trattamento integrativo (1.200) e somma integrativa superano contributi
  // e IRPEF netta, quindi il netto annuo supera la RAL (caso verificato in cascata.casi).
  const dentroLaFinestra = cascata2026(9396.46)
  assert.ok(dentroLaFinestra.nettoAnnuo > dentroLaFinestra.ral)
  assert.match(testiCascata(dentroLaFinestra).trattenuteTotali.nota, /non è un errore/)

  // fuori dalla finestra la nota non deve comparire
  assert.equal(testiCascata(cascata2026(30000)).trattenuteTotali.nota, null)
})

test('l’avviso sullo scalino compare dentro una zona di non-monotonia e non fuori', () => {
  // La zona esiste per costruzione (censimento in src/discontinuita.js); qui si verifica
  // che il testo la intercetti e che citi entrambi gli estremi.
  const zone = zoneNonMonotonia(COSTANTI_2026)
  assert.ok(zone.length > 0, 'nessuna zona di non-monotonia censita per il 2026')

  const dentroLaZona = zone[0].da + 0.5
  const avviso = avvisoScalino(cascata2026(dentroLaZona))
  assert.match(avviso, /scalino/)
  assert.match(avviso, /Torni sopra quel livello/)

  // una RAL lontana da ogni soglia non deve produrre avvisi
  assert.equal(avvisoScalino(cascata2026(100000)), null)
})
