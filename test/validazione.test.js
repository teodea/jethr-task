// Dominio di input della RAL (issue #7): i casi fissati dalla decisione —
// 0, negativo, minimale - 1, massimale + 1, con i valori 2026 della Circolare INPS 6/2026.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validaInput, minimaleContributivoAnnuo, MENSILITA_AMMESSE } from '../src/validazione.js'
import { calcolaCascata } from '../src/cascata.js'
import { COSTANTI_2026, COSTANTI_2025 } from '../src/costanti/index.js'

test('minimale contributivo annuo: 58,13 x 312 giornate = 18.136,56 (2026); 57,32 x 312 = 17.883,84 (2025)', () => {
  assert.ok(Math.abs(minimaleContributivoAnnuo(COSTANTI_2026) - 18136.56) < 0.005)
  assert.ok(Math.abs(minimaleContributivoAnnuo(COSTANTI_2025) - 17883.84) < 0.005)
})

test('RAL zero, negativa o non numerica: errore bloccante', () => {
  for (const ral of [0, -1, -30000]) {
    const esito = validaInput({ ral }, COSTANTI_2026)
    assert.equal(esito.valida, false, `RAL ${ral} doveva essere rifiutata`)
    assert.ok(esito.errori.length > 0)
  }
  for (const ral of ['30000', NaN, Infinity, null, undefined]) {
    const esito = validaInput({ ral }, COSTANTI_2026)
    assert.equal(esito.valida, false, `RAL ${String(ral)} doveva essere rifiutata`)
  }
})

test('la cascata rifiuta gli input fuori dominio', () => {
  assert.throws(() => calcolaCascata({ ral: 0 }), RangeError)
  assert.throws(() => calcolaCascata({ ral: -1 }), RangeError)
  assert.throws(() => calcolaCascata({ ral: '30000' }), RangeError)
})

test('sotto il minimale contributivo annuo: avviso non bloccante, calcolo eseguibile', () => {
  const minimale = minimaleContributivoAnnuo(COSTANTI_2026)
  const esito = validaInput({ ral: minimale - 1 }, COSTANTI_2026)
  assert.equal(esito.valida, true)
  assert.equal(esito.avvisi.length, 1)
  assert.ok(esito.avvisi[0].includes('minimale'))

  const cascata = calcolaCascata({ ral: minimale - 1 })
  assert.ok(cascata.nettoAnnuo > 0)
  assert.equal(cascata.avvisi.length, 1)
})

test('dal minimale in su: nessun avviso', () => {
  const minimale = minimaleContributivoAnnuo(COSTANTI_2026)
  assert.equal(validaInput({ ral: minimale }, COSTANTI_2026).avvisi.length, 0)
  assert.equal(validaInput({ ral: 30000 }, COSTANTI_2026).avvisi.length, 0)
})

test('sopra il massimale contributivo: calcolo regolare, cambia solo la forma dei contributi', () => {
  const massimale = COSTANTI_2026.contributi.massimaleAnnuo
  const esito = validaInput({ ral: massimale + 1 }, COSTANTI_2026)
  assert.equal(esito.valida, true)
  assert.equal(esito.avvisi.length, 0)

  const sotto = calcolaCascata({ ral: massimale })
  const sopra = calcolaCascata({ ral: massimale + 1 })
  assert.equal(sotto.contributiDipendente, sopra.contributiDipendente) // i contributi si fermano al massimale
  assert.ok(sopra.imponibileFiscale > sotto.imponibileFiscale) // l'eccedenza resta imponibile fiscale
})

test('mensilita: ammesse solo 12, 13 e 14', () => {
  for (const mensilita of MENSILITA_AMMESSE) {
    assert.equal(validaInput({ ral: 30000, mensilita }, COSTANTI_2026).valida, true)
  }
  for (const mensilita of [11, 15, 0, 12.5]) {
    assert.equal(validaInput({ ral: 30000, mensilita }, COSTANTI_2026).valida, false)
  }
})
