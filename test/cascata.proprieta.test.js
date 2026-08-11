// Suite di proprieta' della cascata (issue #8): griglia fitta di RAL, nessun valore
// atteso con fonte. L'elenco delle discontinuita' legittime NON e' deciso qui: viene
// consumato da src/discontinuita.js, che lo deriva dai censimenti delle issue #3 e #4.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcolaCascata } from '../src/cascata.js'
import { censimentoSalti, zoneNonMonotonia, avvisoNonMonotonia } from '../src/discontinuita.js'
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

  test(`[${anno}] imponibile fiscale = RAL - contributi, sempre minore della RAL (anche sopra il massimale)`, () => {
    for (const c of punti) {
      assert.equal(c.imponibileFiscale, c.ral - c.contributiDipendente)
      assert.ok(c.imponibileFiscale < c.ral, `imponibile non inferiore alla RAL a ${c.ral}`)
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
  }
})
