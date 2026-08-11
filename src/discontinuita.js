// Censimento delle discontinuita' legittime della funzione RAL -> netto: i "salti"
// previsti dalle norme, derivati dalle costanti (mai hardcodati). E' l'elenco che la
// suite di proprieta' (issue #8) consuma: un salto del netto FUORI da questi punti e'
// un bug del motore. Fonti dei censimenti: docs/ricerca/trattamento-integrativo-...md
// par. 5 e docs/ricerca/addizionali-regionale-comunale.md par. 5.
//
// Tutto qui dentro e' parametrato sul periodo di lavoro (issue #22). Le soglie stanno dove
// stanno — sono scritte sul reddito complessivo, che il ragguaglio non tocca — ma la RAL a
// cui si incontrano si sposta: con mezzo anno di rapporto ci vuole il doppio di RAL per
// arrivare allo stesso reddito. Un censimento calcolato sull'anno intero e mostrato a chi
// lavora sei mesi indicherebbe scalini nel posto sbagliato.

import { calcolaCascata } from './cascata.js'

// Il periodo di riferimento quando non se ne passa uno: rapporto per l'anno intero, quota 1,
// date lasciate ai default del motore.
const ANNO_INTERO = { dataInizio: undefined, dataFine: undefined, quota: 1 }

/**
 * L'inversione esatta di `reddito complessivo -> retribuzione effettiva`, cioe' della
 * catena `retribuzione - contributi` di src/cascata.js. E' una spezzata a tre tratti,
 * uno per ciascun regime contributivo (sotto la prima fascia, fra prima fascia e massimale,
 * oltre il massimale): invertirla a mano invece di cercare per tentativi tiene il censimento
 * esatto al centesimo, che e' quello che la suite di proprieta' verifica.
 *
 * Con l'anno intero tutte le soglie censite cadono nel primo tratto (la piu' alta, RC 35.000,
 * vale ~38.542 di retribuzione). Con un rapporto breve no: a RAL alta e periodo corto la
 * stessa soglia puo' cadere oltre la prima fascia, e la formula lineare sbaglierebbe.
 */
function retribuzioneEffettivaDaRedditoComplessivo(rc, costanti) {
  const c = costanti.contributi
  const dopoIvs = 1 - c.aliquotaIvsDipendente
  const dopoIvsEAggiuntivo = dopoIvs - c.aliquotaAggiuntiva
  const correttivoPrimaFascia = c.primaFasciaAnnua * c.aliquotaAggiuntiva

  const rcPrimaFascia = c.primaFasciaAnnua * dopoIvs
  const rcMassimale = c.massimaleAnnuo * dopoIvsEAggiuntivo + correttivoPrimaFascia

  if (rc <= rcPrimaFascia) return rc / dopoIvs
  if (rc <= rcMassimale) return (rc - correttivoPrimaFascia) / dopoIvsEAggiuntivo
  // Oltre il massimale i contributi non crescono piu': la retribuzione torna a salire di un
  // euro per ogni euro di reddito, sopra un gradino costante.
  return (
    rc +
    c.aliquotaIvsDipendente * c.massimaleAnnuo +
    c.aliquotaAggiuntiva * (c.massimaleAnnuo - c.primaFasciaAnnua)
  )
}

// Due soglie che cadono sullo stesso reddito sono un salto solo: se distano meno dello
// scostamento con cui il censimento le sonda, nessuna misura puo' distinguerle, e tenerle
// separate produrrebbe due zone di non-monotonia sovrapposte per lo stesso gradino.
// Sull'anno intero e' il caso della no tax area e del cambio di percentuale della somma
// integrativa, che coincidono entrambi a 8.500: da qui il "triplo punto" del censimento
// annuo. Con un rapporto parziale si separano, e allora sono davvero due salti.
function raggruppaSoglieCoincidenti(salti) {
  const gruppi = []
  for (const salto of [...salti].sort((a, b) => a.rc - b.rc)) {
    const precedente = gruppi.at(-1)
    if (precedente && Math.abs(salto.rc - precedente.rc) < SCOSTAMENTO) {
      precedente.nome += ` / ${salto.nome}`
      precedente.descrizione += `; ${salto.descrizione}`
      continue
    }
    gruppi.push({ ...salto })
  }
  return gruppi
}

export function censimentoSalti(costanti, quota = 1) {
  const aliquota1 = costanti.irpef.scaglioni[0].aliquota
  const d = costanti.detrazioneLavoroDipendente
  const t = costanti.trattamentoIntegrativo
  const s = costanti.sommaIntegrativa
  const u = costanti.ulterioreDetrazione
  // Rapportata al periodo, con il pavimento assoluto dei 690 EUR gia' applicato: e' la
  // stessa espressione di `detrazioneLavoroDipendente` in fascia a (src/cascata.js).
  const detrazioneFascia1 = Math.max(d.importoFascia1 * quota, d.minimo)

  // Punto derivato, non scritto in norma: imposta lorda > detrazione art. 13 c. 1 - 75.
  // Entrambi i termini del confronto si rapportano al periodo, quindi il punto si sposta.
  const rcCapienzaTrattamento = (detrazioneFascia1 - t.riduzioneDetrazione * quota) / aliquota1
  // No tax area derivata: imposta lorda = detrazione (1.955 / 0,23 = 8.500 sull'anno
  // intero). Con un rapporto breve la detrazione scende e la no tax area scende con lei —
  // ma smette di coincidere con il cambio di percentuale della somma integrativa, che si
  // valuta sul reddito ragguagliato ad anno: il triplo punto si scompone.
  const rcNoTaxArea = detrazioneFascia1 / aliquota1

  const salti = [
    {
      nome: 'capienza trattamento integrativo',
      rc: rcCapienzaTrattamento,
      descrizione: `sopra, il trattamento integrativo spetta per intero (+${t.importo}, rapportato al periodo); salto in su (DL 3/2020 art. 1 c. 1)`,
    },
    {
      nome: 'no tax area / gate addizionali',
      rc: rcNoTaxArea,
      descrizione:
        "punto derivato: l'IRPEF netta diventa positiva e scattano le addizionali per intero " +
        '(D.Lgs. 446/1997 art. 50 c. 2; D.Lgs. 360/1998 art. 1 c. 4)',
    },
    {
      nome: 'fine del trattamento integrativo / detrazione lett. a -> b',
      rc: d.sogliaFascia1,
      descrizione:
        'fine del trattamento integrativo (nel perimetro); salto in su della detrazione art. 13 lett. a -> b',
    },
    {
      nome: 'spartiacque somma integrativa <-> ulteriore detrazione',
      rc: s.sogliaRedditoComplessivo,
      descrizione: `sopra ${s.sogliaRedditoComplessivo}: la somma si azzera, entra l'ulteriore detrazione da ${u.importo} rapportata al periodo (L. 207/2024 art. 1 cc. 4 e 6)`,
    },
    {
      nome: 'inizio maggiorazione 65',
      rc: d.maggiorazioneDa,
      descrizione: `sopra, +${d.maggiorazione} di detrazione, per intero e senza ragguaglio (art. 13 c. 1.1 TUIR); salto in su`,
    },
    {
      nome: 'fine maggiorazione 65',
      rc: d.maggiorazioneFinoA,
      descrizione: `sopra, la maggiorazione di ${d.maggiorazione} si perde per intero (art. 13 c. 1.1 TUIR)`,
    },
  ]

  // I cambi di percentuale della somma integrativa non stanno sul reddito effettivo ma su
  // quello ragguagliato ad anno (L. 207/2024 art. 1 c. 5): in reddito effettivo cadono a
  // `soglia x quota`. Sull'anno intero coincidono con la no tax area e con i 15.000, ed e'
  // per questo che il censimento annuo li vedeva come un unico "triplo punto".
  for (const { fino } of s.fasce) {
    if (fino === Infinity) continue
    salti.push({
      nome: `somma integrativa: cambio di percentuale a ${fino}`,
      rc: fino * quota,
      descrizione:
        'sopra, la percentuale della somma integrativa scende (L. 207/2024 art. 1 cc. 4 e 5); ' +
        "la fascia si sceglie sul reddito rapportato all'intero anno, quindi la soglia cade sul reddito effettivo a `soglia x quota`",
    })
  }

  // Scalino comunale: la soglia e' definita sull'imponibile fiscale (= RC nel perimetro).
  salti.push({
    nome: 'esenzione addizionale comunale',
    rc: costanti.addizionaleComunale.esenzioneFinoA,
    descrizione: `sopra ${costanti.addizionaleComunale.esenzioneFinoA} di imponibile l'addizionale comunale si paga sull'INTERO imponibile (D.Lgs. 360/1998 art. 1 c. 3-bis; delibera C.C. Milano 46/2020)`,
  })

  // Gia' ordinati per reddito dal raggruppamento, e il reddito e' monotono nella RAL:
  // l'ordine per RAL viene da se'.
  return raggruppaSoglieCoincidenti(salti).map((salto) => {
    const retribuzioneEffettiva = retribuzioneEffettivaDaRedditoComplessivo(salto.rc, costanti)
    return { ...salto, retribuzioneEffettiva, ral: retribuzioneEffettiva / quota }
  })
}

// Ci si scosta di mezzo centesimo dai due lati di una soglia: alla RAL esatta il float puo'
// cadere indifferentemente sopra o sotto il confine in reddito complessivo. Lo scostamento
// vive in **retribuzione effettiva** e non in RAL, cosi' resta mezzo centesimo di reddito
// qualunque sia la durata del rapporto — in RAL, su un periodo corto, varrebbe molto meno.
const SCOSTAMENTO = 0.005

// Le zone in cui il netto scende al crescere della RAL (issue #4, decisione di prodotto:
// l'avviso in interfaccia mostra gli estremi espliciti). Per ogni salto in giu' [X, Y]:
// X e' la RAL della soglia, Y la prima RAL alla quale il netto torna al livello di X.
//
// Memoizzate per costanti *e* per quota: due periodi diversi hanno zone diverse, e una
// cache sulla sola tabella d'anno restituirebbe a un rapporto di sei mesi gli scalini di
// dodici. La ricerca corre in retribuzione effettiva, dove il passo di un euro resta un
// euro: cercare in RAL su un periodo corto moltiplicherebbe le iterazioni per 1/quota.
const zonePerCostanti = new WeakMap()

export function zoneNonMonotonia(costanti, periodo = ANNO_INTERO) {
  const { dataInizio, dataFine, quota } = periodo
  if (!zonePerCostanti.has(costanti)) zonePerCostanti.set(costanti, new Map())
  const perQuota = zonePerCostanti.get(costanti)
  if (perQuota.has(quota)) return perQuota.get(quota)

  const netto = (retribuzione) =>
    calcolaCascata({ ral: retribuzione / quota, anno: costanti.anno, dataInizio, dataFine })
      .nettoAnnuo

  const zone = []
  for (const salto of censimentoSalti(costanti, quota)) {
    const prima = netto(salto.retribuzioneEffettiva - SCOSTAMENTO)
    const dopo = netto(salto.retribuzioneEffettiva + SCOSTAMENTO)
    if (dopo >= prima) continue // salto in su o neutro: nessuna zona

    let y = salto.retribuzioneEffettiva + 1
    while (netto(y) < prima) y += 1
    while (netto(y - 0.01) >= prima) y -= 0.01
    // `livello` e' il netto appena sopra la soglia perduta: e' insieme il punto piu' alto
    // da cui si scende e la quota a cui si risale in `a`. Esposto perche' e' l'unica
    // grandezza della zona che non si ricava dalle altre.
    zone.push({
      da: salto.ral,
      a: y / quota,
      perdita: prima - dopo,
      livello: prima,
      salto: salto.nome,
    })
  }

  perQuota.set(quota, zone)
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
export function profiloScalino(ral, costanti, periodo = ANNO_INTERO) {
  const { dataInizio, dataFine, quota } = periodo
  const zona = zoneNonMonotonia(costanti, periodo).find(({ da, a }) => ral > da && ral < a)
  if (!zona) return null

  const netto = (r) =>
    calcolaCascata({ ral: r, anno: costanti.anno, dataInizio, dataFine }).nettoAnnuo
  const margine = (zona.a - zona.da) * MARGINE_FINESTRA
  const inizio = zona.da - margine
  const passo = (zona.a - zona.da + 2 * margine) / CAMPIONI_FINESTRA

  const ascisse = []
  for (let i = 0; i <= CAMPIONI_FINESTRA; i += 1) ascisse.push(inizio + i * passo)
  // I due bordi del salto, la fine della zona e la RAL dell'utente entrano come punti
  // espliciti: a passo fisso il salto cadrebbe fra due campioni e la spezzata lo
  // disegnerebbe come una discesa obliqua, cioe' come una cosa che il netto non fa.
  const scostamentoRal = SCOSTAMENTO / quota
  ascisse.push(zona.da - scostamentoRal, zona.da + scostamentoRal, zona.a, ral)
  ascisse.sort((x, y) => x - y)

  return {
    zona,
    tuSeiQui: { ral, netto: netto(ral) },
    punti: ascisse.map((r) => ({ ral: r, netto: netto(r) })),
  }
}

// L'avviso da mostrare quando la RAL cade in una zona di non-monotonia, con gli estremi
// espliciti come da decisione di prodotto della issue #4. null fuori dalle zone.
export function avvisoNonMonotonia(ral, costanti, periodo = ANNO_INTERO) {
  const zona = zoneNonMonotonia(costanti, periodo).find(({ da, a }) => ral > da && ral < a)
  if (!zona) return null
  return (
    `tra ${zona.da.toFixed(2)} e ${zona.a.toFixed(2)} EUR di RAL il netto annuo e' inferiore ` +
    `a quello che si ottiene a RAL ${zona.da.toFixed(2)} (${zona.salto})`
  )
}

/**
 * Il periodo di una cascata gia' calcolata, nella forma che i seam di questo modulo si
 * aspettano. Sta qui perche' e' l'adattatore fra le due strutture, e la pagina non deve
 * ricomporlo a mano ogni volta.
 */
export function periodoDellaCascata(cascata) {
  return {
    dataInizio: cascata.dataInizio,
    dataFine: cascata.dataFine,
    quota: cascata.quotaPeriodo,
  }
}
