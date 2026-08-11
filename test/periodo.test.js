// I giorni del rapporto e la quota d'anno (issue #22). Il conteggio e' la parte
// contro-intuitiva del dominio — giorni di calendario, non lavorati, e 365 anche negli anni
// bisestili — quindi e' anche la parte che vale la pena inchiodare per prima.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  GIORNI_ANNO_FISCALE,
  giorniDelRapporto,
  quotaPeriodo,
  mensilitaMaturate,
  periodoDelRapporto,
  dataValida,
  annoDellaData,
  inizioAnno,
  fineAnno,
} from '../src/periodo.js'

test('i giorni sono quelli di calendario, estremi inclusi, festivi e riposi compresi', () => {
  // Istruzioni 730/2026, rigo C5: «365 per l'intero anno», e «vanno in ogni caso compresi le
  // festivita', i riposi settimanali e gli altri giorni non lavorativi»
  assert.equal(giorniDelRapporto('2026-01-01', '2026-12-31'), 365)
  // il semestre della issue: 31+31+30+31+30+31
  assert.equal(giorniDelRapporto('2026-07-01', '2026-12-31'), 184)
  // un solo giorno di rapporto e' un giorno, non zero: gli estremi sono inclusi
  assert.equal(giorniDelRapporto('2026-03-14', '2026-03-14'), 1)
  // agosto intero: 31 giorni di calendario, di cui 10 fra sabati e domeniche
  assert.equal(giorniDelRapporto('2026-08-01', '2026-08-31'), 31)
})

test('anche un anno bisestile vale 365 giorni, e il semestre 181 [Circ. AdE 29/E/2020]', () => {
  // «sempre pari a 365 giorni, indipendentemente dalla circostanza che l'anno solare sia
  // bisestile»; e per il 2020 «fino ad un massimo di 181 giorni» sul semestre 1/1-30/6.
  assert.equal(giorniDelRapporto('2028-01-01', '2028-12-31'), 365)
  assert.equal(giorniDelRapporto('2028-01-01', '2028-06-30'), 181)
  // un periodo che non attraversa il 29 febbraio non perde niente
  assert.equal(giorniDelRapporto('2028-03-01', '2028-12-31'), 306)
  // il 29 febbraio esiste come data valida: non si conta, ma non e' un errore di input
  assert.ok(dataValida('2028-02-29'))
})

test('date impossibili, illeggibili o in ordine invertito: nessun numero di giorni', () => {
  assert.equal(giorniDelRapporto('2026-02-29', '2026-12-31'), null) // il 2026 non e' bisestile
  assert.equal(giorniDelRapporto('2026-04-31', '2026-12-31'), null)
  assert.equal(giorniDelRapporto('01/07/2026', '2026-12-31'), null)
  assert.equal(giorniDelRapporto('', '2026-12-31'), null)
  assert.equal(giorniDelRapporto(undefined, '2026-12-31'), null)
  assert.equal(giorniDelRapporto('2026-12-31', '2026-07-01'), null) // la fine prima dell'inizio
  assert.equal(dataValida('2026-02-29'), false)
})

test('la quota d’anno e le mensilita’ maturate discendono dai giorni', () => {
  assert.equal(quotaPeriodo(GIORNI_ANNO_FISCALE), 1)
  assert.equal(quotaPeriodo(184), 184 / 365)
  assert.equal(mensilitaMaturate(13, 1), 13)
  // mezzo anno di rapporto matura poco piu' di sei mensilita' e mezza su tredici
  assert.ok(Math.abs(mensilitaMaturate(13, quotaPeriodo(184)) - 6.5534) < 0.0001)
})

test('senza date il periodo e’ l’anno intero: e’ il default, non un caso speciale', () => {
  const senzaDate = periodoDelRapporto({ anno: 2026 })
  assert.equal(senzaDate.dataInizio, inizioAnno(2026))
  assert.equal(senzaDate.dataFine, fineAnno(2026))
  assert.equal(senzaDate.giorni, GIORNI_ANNO_FISCALE)
  assert.equal(senzaDate.quota, 1)
  assert.equal(senzaDate.annoIntero, true)

  const semestre = periodoDelRapporto({
    dataInizio: '2026-07-01',
    dataFine: '2026-12-31',
    anno: 2026,
  })
  assert.equal(semestre.giorni, 184)
  assert.equal(semestre.annoIntero, false)

  // un giorno in meno agli estremi e l'anno non e' piu' intero: `annoIntero` e' una
  // proprieta' del conteggio, non delle date scritte nei campi
  assert.equal(periodoDelRapporto({ dataInizio: '2026-01-02', anno: 2026 }).annoIntero, false)
})

test('l’anno di una data si legge dalla data, non dal contesto', () => {
  assert.equal(annoDellaData('2026-07-01'), 2026)
  assert.equal(annoDellaData('2025-12-31'), 2025)
  assert.equal(annoDellaData('non una data'), null)
})
