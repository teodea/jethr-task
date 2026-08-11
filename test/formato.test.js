// Il campo RAL parla italiano (issue #12): i formati che un utente scrive davvero, quelli
// che vanno rifiutati perche' ambigui, e la riformattazione al blur.
//
// I casi non hanno una fonte normativa: non sono numeri di dominio, sono la convenzione
// tipografica italiana (separatore delle migliaia il punto, dei decimali la virgola) e le
// scelte dichiarate in docs/ASSUNZIONI.md sul rifiuto dell'ambiguita'.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { interpretaImporto, formattaImporto } from '../src/formato.js'
import { validaInput } from '../src/validazione.js'
import { COSTANTI_2026 } from '../src/costanti/index.js'

function interpretata(testo) {
  const esito = interpretaImporto(testo)
  assert.equal(esito.valido, true, `«${testo}» doveva essere interpretata: ${esito.errore}`)
  return esito.valore
}

function rifiutata(testo) {
  const esito = interpretaImporto(testo)
  assert.equal(esito.valido, false, `«${testo}» doveva essere rifiutata`)
  assert.ok(esito.errore.length > 0, `«${testo}» rifiutata senza spiegazione`)
  assert.equal(esito.valore, null)
  return esito.errore
}

test('i tre formati del brief: «30000», «30.000», «30.000,50»', () => {
  assert.equal(interpretata('30000'), 30000)
  assert.equal(interpretata('30.000'), 30000)
  assert.equal(interpretata('30.000,50'), 30000.5)
})

test('la virgola separa i decimali, anche senza punto delle migliaia', () => {
  assert.equal(interpretata('30000,50'), 30000.5)
  assert.equal(interpretata('30000,5'), 30000.5)
  assert.equal(interpretata(',50'), 0.5) // parte intera sottintesa: mezzo euro
})

test('il punto separa le migliaia a gruppi di tre, quanti se ne vogliono', () => {
  assert.equal(interpretata('1.234.567'), 1234567)
  assert.equal(interpretata('1.234.567,89'), 1234567.89)
  assert.equal(interpretata('100'), 100)
})

test('il punto decimale del tastierino: una o due cifre dopo, mai tre', () => {
  assert.equal(interpretata('30000.50'), 30000.5)
  assert.equal(interpretata('30.50'), 30.5) // due cifre: non e' un raggruppamento valido
  assert.equal(interpretata('1234.56'), 1234.56) // 1234 non e' un primo gruppo valido
})

test('rumore attorno al numero: spazi e simbolo di valuta', () => {
  assert.equal(interpretata('  30.000 € '), 30000)
  assert.equal(interpretata('30 000'), 30000)
  assert.equal(interpretata(' 30.000,50 €'), 30000.5)
})

test('«30,000» e ambigua: rifiutata con le due letture spiegate', () => {
  const errore = rifiutata('30,000')
  assert.ok(errore.includes('30.000'), 'il messaggio deve mostrare la lettura "migliaia"')
  assert.ok(errore.includes('30,00'), 'il messaggio deve mostrare la lettura "decimali"')
  rifiutata('1,500')
})

test('il formato inglese completo non viene indovinato', () => {
  rifiutata('30,000.50')
  rifiutata('1,234,567.89')
})

test('quello che non e un numero viene rifiutato, non azzerato', () => {
  for (const testo of ['', '   ', 'trentamila', '30k', '3o.ooo', '--30000', '30..000', '€']) {
    rifiutata(testo)
  }
})

test('raggruppamenti malformati: rifiutati invece che interpretati a meta', () => {
  for (const testo of ['30.00,50', '12.34.567', '30.0000', '1234.567', '30.', '30,00,5']) {
    rifiutata(testo)
  }
})

test('il campo vuoto ha il suo messaggio, diverso da quello di forma', () => {
  assert.notEqual(rifiutata(''), rifiutata('trentamila'))
})

test('una RAL negativa viene interpretata qui e rifiutata dalla validazione', () => {
  // Il parsing non conosce il dominio: che la RAL debba essere > 0 lo dice validaInput.
  assert.equal(interpretata('-30.000'), -30000)
  assert.equal(validaInput({ ral: -30000 }, COSTANTI_2026).valida, false)
})

test('formattazione in stile italiano: migliaia col punto, centesimi solo se ci sono', () => {
  assert.equal(formattaImporto(30000), '30.000')
  assert.equal(formattaImporto(30000.5), '30.000,50')
  assert.equal(formattaImporto(1000), '1.000') // it-IT non raggrupperebbe sotto le 5 cifre
  assert.equal(formattaImporto(1234567.89), '1.234.567,89')
  assert.equal(formattaImporto(100), '100')
})

test('scrivere e rileggere non cambia l importo', () => {
  for (const valore of [0.5, 100, 1000, 30000, 30000.5, 1234567.89, 24.99]) {
    assert.equal(interpretata(formattaImporto(valore)), valore)
  }
})
