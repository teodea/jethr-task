// Suite di proprieta' della cascata (issue #8): griglia fitta di RAL, nessun valore
// atteso con fonte. L'elenco delle discontinuita' legittime NON e' deciso qui: viene
// consumato da src/discontinuita.js, che lo deriva dai censimenti delle issue #3 e #4.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcolaCascata } from '../src/cascata.js'
import {
  censimentoSalti,
  zoneNonMonotonia,
  avvisoNonMonotonia,
  profiloScalino,
} from '../src/discontinuita.js'
import { COSTANTI_PER_ANNO } from '../src/costanti/index.js'

const PASSO = 100
const RAL_MIN = 1000
const RAL_MAX = 200000

function griglia(anno) {
  const punti = []
  for (let ral = RAL_MIN; ral <= RAL_MAX; ral += PASSO) {
    punti.push(calcolaCascata({ ral, anno }))
  }
  return punti
}

for (const anno of [2026, 2025]) {
  const costanti = COSTANTI_PER_ANNO[anno]
  const punti = griglia(anno)
  const salti = censimentoSalti(costanti)

  test(`[${anno}] netto positivo e cascata che non restituisce piu' del lordo al netto delle erogazioni`, () => {
    for (const c of punti) {
      assert.ok(c.nettoAnnuo > 0, `netto non positivo a RAL ${c.ral}`)
      assert.ok(c.nettoAnnuo - c.erogazioni < c.ral, `prelievo negativo a RAL ${c.ral}`)
    }
  })

  test(`[${anno}] imponibile fiscale = retribuzione effettiva - contributi, sempre minore (anche sopra il massimale)`, () => {
    for (const c of punti) {
      assert.equal(c.imponibileFiscale, c.retribuzioneEffettiva - c.contributiDipendente)
      assert.ok(
        c.imponibileFiscale < c.retribuzioneEffettiva,
        `imponibile non inferiore alla retribuzione a ${c.ral}`,
      )
      // ad anno intero le due basi coincidono: e' la definizione del default
      assert.equal(c.retribuzioneEffettiva, c.ral)
    }
  })

  test(`[${anno}] IRPEF netta e addizionali mai negative`, () => {
    for (const c of punti) {
      assert.ok(c.irpefNetta >= 0)
      assert.ok(c.addizionaleRegionale >= 0)
      assert.ok(c.addizionaleComunale >= 0)
    }
  })

  test(`[${anno}] aliquota media (IRPEF netta / imponibile) sempre sotto la marginale`, () => {
    for (const c of punti) {
      assert.ok(c.imponibileFiscale > 0)
      // la definizione e' quella del glossario: IRPEF netta / imponibile fiscale
      assert.equal(c.aliquotaMedia, c.irpefNetta / c.imponibileFiscale)
      assert.ok(
        c.aliquotaMedia < c.aliquotaMarginale,
        `media ${c.aliquotaMedia} >= marginale ${c.aliquotaMarginale} a RAL ${c.ral}`,
      )
    }
  })

  test(`[${anno}] fra due soglie secche censite il netto e' crescente e continuo`, () => {
    for (let i = 1; i < punti.length; i++) {
      const prima = punti[i - 1]
      const dopo = punti[i]
      const contieneSalto = salti.some(({ ral }) => ral > prima.ral && ral <= dopo.ral)
      if (contieneSalto) continue
      const delta = dopo.nettoAnnuo - prima.nettoAnnuo
      assert.ok(delta > 0, `netto decrescente fuori censimento fra ${prima.ral} e ${dopo.ral} (delta ${delta})`)
      // continuita' sulla griglia: il netto non puo' crescere piu' del lordo aggiunto
      assert.ok(delta <= PASSO + 1e-9, `salto fuori censimento fra ${prima.ral} e ${dopo.ral} (delta ${delta})`)
    }
  })

  test(`[${anno}] i salti in giu' censiti esistono davvero sulla griglia`, () => {
    // il censimento non deve essere una lista di comodo: ogni discesa dichiarata
    // (somma integrativa a 8.500, triplo punto a 15.000, fine dei 65, scalino Milano)
    // deve produrre un intervallo di griglia col netto in calo
    const discese = zoneNonMonotonia(costanti)
    assert.equal(discese.length, 4, `attese 4 zone di non-monotonia, trovate ${discese.length}`)
    for (const zona of discese) {
      const i = Math.floor((zona.da - RAL_MIN) / PASSO)
      const delta = punti[i + 1].nettoAnnuo - punti[i].nettoAnnuo
      assert.ok(
        delta < 0,
        `il salto "${zona.salto}" (RAL ${zona.da.toFixed(2)}) non produce una discesa sulla griglia (delta ${delta})`,
      )
    }
  })
}

test('[2026] finestra in cui il netto supera legittimamente la RAL: esattamente i punti griglia 9.100-11.900', () => {
  // Derivazione (issue #4 + #8): la finestra si apre al punto di capienza del
  // trattamento integrativo (RC 8.173,91 -> RAL 9.001,12) e si chiude dove i prelievi
  // tornano a superare le erogazioni: 0,0919·r + 0,1893·0,9081·r = 3.155
  // (contributi + IRPEF netta e regionale - somma 5,3%, con detrazione fissa 1.955 e
  // trattamento 1.200 nella fascia RC 8.500-15.000) -> r = 11.959,68.
  const dentro = []
  for (let ral = RAL_MIN; ral <= RAL_MAX; ral += PASSO) {
    if (calcolaCascata({ ral, anno: 2026 }).nettoAnnuo > ral) dentro.push(ral)
  }
  assert.equal(dentro[0], 9100)
  assert.equal(dentro.at(-1), 11900)
  assert.equal(dentro.length, (11900 - 9100) / PASSO + 1, 'la finestra deve essere un intervallo contiguo')
})

test("[2026] l'avviso di non-monotonia espone gli estremi e tace fuori dalle zone", () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  const zone = zoneNonMonotonia(costanti)
  for (const zona of zone) {
    const avviso = avvisoNonMonotonia((zona.da + zona.a) / 2, costanti)
    assert.ok(avviso, `nessun avviso dentro la zona "${zona.salto}"`)
    assert.ok(avviso.includes(zona.da.toFixed(2)) && avviso.includes(zona.a.toFixed(2)), 'estremi non esposti')
  }
  assert.equal(avvisoNonMonotonia(20000, costanti), null)
  assert.equal(avvisoNonMonotonia(100000, costanti), null)
})

test('[2026] ogni zona di non-monotonia si richiude: il netto recupera il livello di soglia', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  for (const zona of zoneNonMonotonia(costanti)) {
    const nettoSoglia = calcolaCascata({ ral: zona.da - 0.005, anno: 2026 }).nettoAnnuo
    const nettoDentro = calcolaCascata({ ral: (zona.da + zona.a) / 2, anno: 2026 }).nettoAnnuo
    const nettoFine = calcolaCascata({ ral: zona.a, anno: 2026 }).nettoAnnuo
    assert.ok(nettoDentro < nettoSoglia, `dentro la zona "${zona.salto}" il netto non e' sotto il livello di soglia`)
    assert.ok(nettoFine >= nettoSoglia - 0.01, `a fine zona "${zona.salto}" il netto non ha recuperato`)
    assert.equal(zona.livello, nettoSoglia, `il livello esposto dalla zona "${zona.salto}" non e' quello di soglia`)
  }
})

// Il profilo e' quello che il mini-grafico dentro l'avviso disegna (issue #17). Qui si
// verifica che contenga cio' che rende il salto visibile — la finestra stretta attorno alla
// zona, il gradino verticale, il punto della RAL inserita — non come venga disegnato.
test('[2026] il profilo dello scalino guarda una finestra stretta attorno alla zona', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  for (const zona of zoneNonMonotonia(costanti)) {
    const ral = (zona.da + zona.a) / 2
    const { punti } = profiloScalino(ral, costanti)

    const ascisse = punti.map((punto) => punto.ral)
    assert.deepEqual(ascisse, [...ascisse].sort((x, y) => x - y), 'punti non ordinati per RAL')
    assert.ok(ascisse[0] < zona.da, `la finestra della zona "${zona.salto}" non apre prima del salto`)
    assert.ok(ascisse.at(-1) > zona.a, `la finestra della zona "${zona.salto}" non chiude dopo il recupero`)

    // Derivazione, non fonte: margine del 35% della zona per lato (src/discontinuita.js),
    // quindi la finestra vale 1,7 volte la zona. E' la scala il punto del grafico: piu'
    // larga, e la perdita — che qui vale meno di 260 EUR — sparisce nello spessore del tratto.
    const larghezza = ascisse.at(-1) - ascisse[0]
    assert.ok(
      Math.abs(larghezza - (zona.a - zona.da) * 1.7) < 0.01,
      `finestra ${larghezza.toFixed(2)} EUR per una zona di ${(zona.a - zona.da).toFixed(2)} EUR`,
    )
  }
})

test('[2026] il profilo dello scalino contiene il gradino verticale e il punto «tu sei qui»', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  for (const zona of zoneNonMonotonia(costanti)) {
    const ral = zona.da + (zona.a - zona.da) / 3
    const { punti, tuSeiQui, zona: zonaEsposta } = profiloScalino(ral, costanti)

    assert.equal(zonaEsposta, zona, 'il profilo non espone la zona in cui la RAL e\' caduta')
    assert.equal(tuSeiQui.ral, ral)
    assert.equal(tuSeiQui.netto, calcolaCascata({ ral, anno: 2026 }).nettoAnnuo)
    assert.ok(
      punti.some((punto) => punto.ral === ral && punto.netto === tuSeiQui.netto),
      'il punto della RAL inserita non sta sulla curva disegnata',
    )

    // Due campioni a cavallo della soglia, distanti un centesimo, che scendono di tutta la
    // perdita: senza, la spezzata renderebbe il salto come una discesa obliqua, cioe' come
    // una cosa che il netto non fa.
    const gradino = punti.findIndex(
      (punto, i) => i > 0 && punti[i - 1].netto - punto.netto > zona.perdita - 0.01,
    )
    assert.ok(gradino > 0, `nessun gradino nel profilo della zona "${zona.salto}"`)
    assert.ok(
      punti[gradino - 1].ral < zona.da && punti[gradino].ral > zona.da,
      `il gradino della zona "${zona.salto}" non e' a cavallo della soglia`,
    )
    assert.ok(
      punti[gradino].ral - punti[gradino - 1].ral < 0.02,
      `il gradino della zona "${zona.salto}" e' spalmato su piu' di un centesimo di RAL`,
    )
  }
})

test("[2026] nessun profilo fuori dalle zone: dove non c'e' uno scalino non c'e' niente da disegnare", () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  assert.equal(profiloScalino(20000, costanti), null)
  assert.equal(profiloScalino(100000, costanti), null)
})

// ————— Le stesse proprieta' su un rapporto parziale (issue #22) —————
// Le soglie restano dove sono — sono scritte sul reddito complessivo — ma la RAL a cui si
// incontrano si sposta. Se `censimentoSalti` non seguisse il periodo, la griglia troverebbe
// discese fuori censimento: e' il presidio che la issue chiede esplicitamente.

const SEMESTRE = { dataInizio: '2026-07-01', dataFine: '2026-12-31', quota: 184 / 365 }

test('[2026, mezzo anno] nessuna discesa del netto fuori dalle soglie censite', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  const salti = censimentoSalti(costanti, SEMESTRE.quota)
  const punti = []
  for (let ral = RAL_MIN; ral <= RAL_MAX; ral += PASSO) {
    punti.push(calcolaCascata({ ral, anno: 2026, dataInizio: SEMESTRE.dataInizio, dataFine: SEMESTRE.dataFine }))
  }

  for (const c of punti) assert.ok(c.nettoAnnuo > 0, `netto non positivo a RAL ${c.ral}`)

  for (let i = 1; i < punti.length; i++) {
    const prima = punti[i - 1]
    const dopo = punti[i]
    if (salti.some(({ ral }) => ral > prima.ral && ral <= dopo.ral)) continue
    assert.ok(
      dopo.nettoAnnuo - prima.nettoAnnuo > 0,
      `netto decrescente fuori censimento fra ${prima.ral} e ${dopo.ral}`,
    )
  }
})

test('[2026, mezzo anno] il periodo apre due scalini che l’anno intero non ha', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  const intero = zoneNonMonotonia(costanti)
  const mezzo = zoneNonMonotonia(costanti, SEMESTRE)
  assert.equal(intero.length, 4)
  assert.equal(mezzo.length, 6, `attese 6 zone su mezzo anno, trovate ${mezzo.length}`)

  // Il primo dei due nasce dal ragguaglio: sopra i 20.000 di reddito la somma integrativa si
  // perde per intero (non si rapporta) e al suo posto entra l'ulteriore detrazione, che
  // invece si rapporta. Ad anno intero il cambio e' quasi neutro, a mezzo anno e' una
  // perdita netta: 1.000 x 184/365 non copre i 960 di somma perduta.
  const spartiacque = mezzo.find(({ salto }) => salto.includes('spartiacque'))
  assert.ok(spartiacque, 'lo spartiacque somma/ulteriore detrazione non produce una zona')
  assert.equal(
    intero.some(({ salto }) => salto.includes('spartiacque')),
    false,
    'ad anno intero lo spartiacque non e’ una discesa',
  )

  // Il secondo nasce dalla separazione di due soglie che ad anno intero coincidono a 15.000:
  // il cambio di percentuale della somma integrativa sta sul reddito ragguagliato ad anno, la
  // fascia della detrazione sul reddito effettivo. Ad anno intero il censimento le unisce in
  // un salto solo — il "triplo punto" — e con un periodo parziale si staccano.
  const insieme = (quota) =>
    censimentoSalti(COSTANTI_PER_ANNO[2026], quota).some(
      ({ nome }) =>
        nome.includes('fine del trattamento integrativo') &&
        nome.includes('cambio di percentuale a 15000'),
    )
  assert.equal(insieme(1), true, 'ad anno intero le due soglie a 15.000 sono un salto solo')
  assert.equal(insieme(SEMESTRE.quota), false, 'a mezzo anno le due soglie devono separarsi')
})

test('[2026, mezzo anno] ogni zona censita e’ una discesa vera, e si richiude', () => {
  const costanti = COSTANTI_PER_ANNO[2026]
  const netto = (ral) =>
    calcolaCascata({ ral, anno: 2026, dataInizio: SEMESTRE.dataInizio, dataFine: SEMESTRE.dataFine })
      .nettoAnnuo

  for (const zona of zoneNonMonotonia(costanti, SEMESTRE)) {
    const dentro = netto((zona.da + zona.a) / 2)
    assert.ok(dentro < zona.livello, `dentro la zona "${zona.salto}" il netto non scende`)
    assert.ok(netto(zona.a) >= zona.livello - 0.01, `a fine zona "${zona.salto}" il netto non recupera`)
    assert.ok(zona.a > zona.da, `zona "${zona.salto}" degenere`)
  }
})

test('[2026] la RAL a cui cambia la percentuale della somma integrativa non si muove con le date', () => {
  // Conseguenza del ragguaglio ad anno del c. 5: il reddito che sceglie la percentuale e'
  // sempre `RAL x (1 - aliquota IVS)`, qualunque sia la durata. E' l'unica soglia del
  // censimento che sta ferma in RAL mentre tutte le altre si spostano.
  const costanti = COSTANTI_PER_ANNO[2026]
  const perNome = (salti, frammento) => salti.filter(({ nome }) => nome.includes(frammento))

  const interoSomma = perNome(censimentoSalti(costanti, 1), 'cambio di percentuale')
  const mezzoSomma = perNome(censimentoSalti(costanti, SEMESTRE.quota), 'cambio di percentuale')
  for (const ral of mezzoSomma.map(({ ral }) => ral)) {
    assert.ok(
      interoSomma.some((salto) => Math.abs(salto.ral - ral) < 0.01),
      `la soglia a RAL ${ral.toFixed(2)} si e’ spostata con il periodo`,
    )
  }

  // mentre la fine della maggiorazione, che sta sul reddito effettivo, si sposta eccome
  const [interoMagg] = perNome(censimentoSalti(costanti, 1), 'fine maggiorazione')
  const [mezzoMagg] = perNome(censimentoSalti(costanti, SEMESTRE.quota), 'fine maggiorazione')
  assert.ok(mezzoMagg.ral > interoMagg.ral * 1.9)
})
