// Censimento delle discontinuita' legittime della funzione RAL -> netto: i "salti"
// previsti dalle norme, derivati dalle costanti (mai hardcodati). E' l'elenco che la
// suite di proprieta' (issue #8) consuma: un salto del netto FUORI da questi punti e'
// un bug del motore. Fonti dei censimenti: docs/ricerca/trattamento-integrativo-...md
// par. 5 e docs/ricerca/addizionali-regionale-comunale.md par. 5.

import { calcolaCascata } from './cascata.js'

// Sotto la prima fascia contributiva vale imponibileFiscale = ral x (1 - aliquotaIvs):
// tutte le soglie censite cadono li' (la piu' alta, RC 35.000, e' RAL ~38.542 < 56.224).
function ralDaRedditoComplessivo(rc, costanti) {
  return rc / (1 - costanti.contributi.aliquotaIvsDipendente)
}

export function censimentoSalti(costanti) {
  const aliquota1 = costanti.irpef.scaglioni[0].aliquota
  const d = costanti.detrazioneLavoroDipendente
  const t = costanti.trattamentoIntegrativo
  const s = costanti.sommaIntegrativa
  const u = costanti.ulterioreDetrazione
  const detrazioneFascia1 = Math.max(d.importoFascia1, d.minimo)

  // Punto derivato, non scritto in norma: imposta lorda > detrazione art. 13 c. 1 - 75.
  const rcCapienzaTrattamento = (detrazioneFascia1 - t.riduzioneDetrazione) / aliquota1
  // No tax area derivata: imposta lorda = detrazione (1.955 / 0,23 = 8.500). Coincide
  // volutamente con il cambio di percentuale della somma integrativa e col gate delle
  // addizionali (IRPEF netta > 0).
  const rcNoTaxArea = detrazioneFascia1 / aliquota1

  const salti = [
    {
      nome: 'capienza trattamento integrativo',
      rc: rcCapienzaTrattamento,
      descrizione: `sopra, il trattamento integrativo spetta per intero (+${t.importo}); salto in su (DL 3/2020 art. 1 c. 1)`,
    },
    {
      nome: 'no tax area / somma integrativa 7,1% -> 5,3% / gate addizionali',
      rc: rcNoTaxArea,
      descrizione:
        'triplo punto derivato: cambia la percentuale della somma integrativa (L. 207/2024 art. 1 c. 4), ' +
        "l'IRPEF netta diventa positiva e scattano le addizionali per intero (D.Lgs. 446/1997 art. 50 c. 2; D.Lgs. 360/1998 art. 1 c. 4)",
    },
    {
      nome: 'triplo punto a 15.000',
      rc: d.sogliaFascia1,
      descrizione:
        'somma integrativa 5,3% -> 4,8%; fine del trattamento integrativo (nel perimetro); salto in su della detrazione art. 13 lett. a -> b',
    },
    {
      nome: 'spartiacque somma integrativa <-> ulteriore detrazione',
      rc: s.sogliaRedditoComplessivo,
      descrizione: `sopra ${s.sogliaRedditoComplessivo}: la somma si azzera, entra l'ulteriore detrazione da ${u.importo} (L. 207/2024 art. 1 cc. 4 e 6)`,
    },
    {
      nome: 'inizio maggiorazione 65',
      rc: d.maggiorazioneDa,
      descrizione: `sopra, +${d.maggiorazione} di detrazione (art. 13 c. 1.1 TUIR); salto in su`,
    },
    {
      nome: 'fine maggiorazione 65',
      rc: d.maggiorazioneFinoA,
      descrizione: `sopra, la maggiorazione di ${d.maggiorazione} si perde per intero (art. 13 c. 1.1 TUIR)`,
    },
  ].map((salto) => ({ ...salto, ral: ralDaRedditoComplessivo(salto.rc, costanti) }))

  // Scalino comunale: la soglia e' definita sull'imponibile fiscale (= RC nel perimetro).
  const esenzione = costanti.addizionaleComunale.esenzioneFinoA
  salti.push({
    nome: 'esenzione addizionale comunale',
    rc: esenzione,
    ral: ralDaRedditoComplessivo(esenzione, costanti),
    descrizione: `sopra ${esenzione} di imponibile l'addizionale comunale si paga sull'INTERO imponibile (D.Lgs. 360/1998 art. 1 c. 3-bis; delibera C.C. Milano 46/2020)`,
  })

  return salti.sort((a, b) => a.ral - b.ral)
}

// Le zone in cui il netto scende al crescere della RAL (issue #4, decisione di prodotto:
// l'avviso in interfaccia mostra gli estremi espliciti). Per ogni salto in giu' [X, Y]:
// X e' la RAL della soglia, Y la prima RAL alla quale il netto torna al livello di X.
const zonePerCostanti = new WeakMap()

export function zoneNonMonotonia(costanti) {
  const anno = costanti.anno
  if (zonePerCostanti.has(costanti)) return zonePerCostanti.get(costanti)

  const netto = (ral) => calcolaCascata({ ral, anno }).nettoAnnuo
  const zone = []
  for (const salto of censimentoSalti(costanti)) {
    // ci si scosta di mezzo centesimo dai due lati: alla RAL esatta della soglia il
    // float puo' cadere indifferentemente sopra o sotto il confine in RC
    const prima = netto(salto.ral - 0.005)
    const dopo = netto(salto.ral + 0.005)
    if (dopo >= prima) continue // salto in su o neutro: nessuna zona

    let y = salto.ral + 1
    while (netto(y) < prima) y += 1
    while (netto(y - 0.01) >= prima) y -= 0.01
    zone.push({ da: salto.ral, a: y, perdita: prima - dopo, salto: salto.nome })
  }
  zonePerCostanti.set(costanti, zone)
  return zone
}

// L'avviso da mostrare quando la RAL cade in una zona di non-monotonia, con gli estremi
// espliciti come da decisione di prodotto della issue #4. null fuori dalle zone.
export function avvisoNonMonotonia(ral, costanti) {
  const zona = zoneNonMonotonia(costanti).find(({ da, a }) => ral > da && ral < a)
  if (!zona) return null
  return (
    `tra ${zona.da.toFixed(2)} e ${zona.a.toFixed(2)} EUR di RAL il netto annuo e' inferiore ` +
    `a quello che si ottiene a RAL ${zona.da.toFixed(2)} (${zona.salto})`
  )
}
