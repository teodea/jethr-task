// Censimento delle discontinuita' legittime della funzione RAL -> netto: i "salti"
// previsti dalle norme, derivati dalle costanti (mai hardcodati). E' l'elenco che la
// suite di proprieta' (issue #8) consuma: un salto del netto FUORI da questi punti e'
// un bug del motore. Fonti dei censimenti: docs/ricerca/trattamento-integrativo-...md
// par. 5 e docs/ricerca/addizionali-regionale-comunale.md par. 5.

import { calcolaCascata } from './cascata.js'

// Da un set di costanti al contesto che lo ha prodotto. Serve perche' il censimento delle
// zone ricalcola la cascata a passi di un centesimo: senza il comune, la ricalcolerebbe
// sulle aliquote del luogo predefinito e troverebbe gli estremi di uno scalino diverso da
// quello che l'utente sta guardando. `comune` e' assente sulle costanti curate, che sono
// gia' il luogo predefinito.
function contestoDi(costanti) {
  return { anno: costanti.anno, comune: costanti.comune ?? null }
}

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

  // Gli scalini che dipendono dal LUOGO, non dall'anno: la soglia di esenzione dell'ente
  // impositore e quella del comune. Si derivano dalle costanti come tutti gli altri, quindi
  // lo scalino si sposta da solo quando cambia il comune — mini-grafico compreso. E' il
  // motivo per cui il selettore rende personale l'intuizione migliore del prototipo invece
  // di lasciarla milanese: a Trento lo scalino sta a 30.000 di imponibile, a Milano a
  // 23.000, e in un comune senza esenzione non c'e' proprio.
  const addizionaliDelLuogo = [
    { regola: costanti.addizionaleComunale, quale: 'comunale', chi: costanti.addizionaleComunale.nome },
    {
      regola: costanti.addizionaleRegionale,
      quale: 'regionale',
      chi: costanti.addizionaleRegionale.denominazione,
    },
  ]
  for (const { regola, quale, chi } of addizionaliDelLuogo) {
    if (regola.esenzioneFinoA == null) continue
    salti.push({
      nome: `esenzione addizionale ${quale}`,
      rc: regola.esenzioneFinoA,
      ral: ralDaRedditoComplessivo(regola.esenzioneFinoA, costanti),
      descrizione:
        `sopra ${regola.esenzioneFinoA} di imponibile l'addizionale ${quale} si paga sull'INTERO ` +
        `imponibile (D.Lgs. 360/1998 art. 1 c. 3-bis; ${chi})`,
    })
  }

  return salti.sort((a, b) => a.ral - b.ral)
}

// Ci si scosta di mezzo centesimo dai due lati di una soglia: alla RAL esatta il float puo'
// cadere indifferentemente sopra o sotto il confine in reddito complessivo.
const SCOSTAMENTO = 0.005

// Le zone in cui il netto scende al crescere della RAL (issue #4, decisione di prodotto:
// l'avviso in interfaccia mostra gli estremi espliciti). Per ogni salto in giu' [X, Y]:
// X e' la RAL della soglia, Y la prima RAL alla quale il netto torna al livello di X.
const zonePerCostanti = new WeakMap()

export function zoneNonMonotonia(costanti) {
  if (zonePerCostanti.has(costanti)) return zonePerCostanti.get(costanti)

  const netto = (ral) => calcolaCascata({ ral, ...contestoDi(costanti) }).nettoAnnuo
  const zone = []
  for (const salto of censimentoSalti(costanti)) {
    const prima = netto(salto.ral - SCOSTAMENTO)
    const dopo = netto(salto.ral + SCOSTAMENTO)
    if (dopo >= prima) continue // salto in su o neutro: nessuna zona

    let y = salto.ral + 1
    while (netto(y) < prima) y += 1
    while (netto(y - 0.01) >= prima) y -= 0.01
    // `livello` e' il netto appena sopra la soglia perduta: e' insieme il punto piu' alto
    // da cui si scende e la quota a cui si risale in `a`. Esposto perche' e' l'unica
    // grandezza della zona che non si ricava dalle altre.
    zone.push({ da: salto.ral, a: y, perdita: prima - dopo, livello: prima, salto: salto.nome })
  }
  zonePerCostanti.set(costanti, zone)
  return zone
}

// Quanto la finestra del profilo si allarga oltre la zona, per lato, in frazione della zona
// stessa: abbastanza da mostrare che la curva sale prima del salto e riprende a salire dopo,
// non tanto da schiacciarlo. E' la scala che rende visibile una perdita di poche decine di
// euro: su un grafico da zero alla RAL intera sarebbe meno di un pixel.
const MARGINE_FINESTRA = 0.35
const CAMPIONI_FINESTRA = 60

/**
 * Il profilo del netto attorno allo scalino in cui la RAL e' caduta: la curva a scala
 * ristretta che il mini-grafico dell'avviso disegna. Numeri, non pixel — quale finestra
 * guardare e dove campionare e' dominio; mapparli in coordinate e' della pagina.
 * null fuori dalle zone, come `avvisoNonMonotonia`.
 */
export function profiloScalino(ral, costanti) {
  const zona = zoneNonMonotonia(costanti).find(({ da, a }) => ral > da && ral < a)
  if (!zona) return null

  const netto = (r) => calcolaCascata({ ral: r, ...contestoDi(costanti) }).nettoAnnuo
  const margine = (zona.a - zona.da) * MARGINE_FINESTRA
  const inizio = zona.da - margine
  const passo = (zona.a - zona.da + 2 * margine) / CAMPIONI_FINESTRA

  const ascisse = []
  for (let i = 0; i <= CAMPIONI_FINESTRA; i += 1) ascisse.push(inizio + i * passo)
  // I due bordi del salto, la fine della zona e la RAL dell'utente entrano come punti
  // espliciti: a passo fisso il salto cadrebbe fra due campioni e la spezzata lo
  // disegnerebbe come una discesa obliqua, cioe' come una cosa che il netto non fa.
  ascisse.push(zona.da - SCOSTAMENTO, zona.da + SCOSTAMENTO, zona.a, ral)
  ascisse.sort((x, y) => x - y)

  return {
    zona,
    tuSeiQui: { ral, netto: netto(ral) },
    punti: ascisse.map((r) => ({ ral: r, netto: netto(r) })),
  }
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
