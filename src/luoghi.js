// Il luogo del calcolo: da codice catastale a costanti d'anno con dentro le due addizionali
// di quel comune e del suo ente impositore.
//
// Perche' esiste questo modulo. Il contesto del calcolo non e' piu' l'anno: e' la coppia
// `{ anno, comune }`. Le costanti d'anno da sole non bastano piu' a rispondere «quanto
// paghi», e ogni pezzo che prima rideriva le costanti dal solo anno — la presentazione
// dello scalino, i testi, l'avviso — deve passare da qui.
//
// Perche' i dati si REGISTRANO invece di essere importati. I comuni italiani sono 7.896:
// caricarli tutti per mostrarne uno sarebbe qualche megabyte a ogni apertura di pagina. I
// JSON sono divisi per ente impositore (dati/addizionali/<anno>/<ente>.json) e la pagina
// scarica solo quello scelto — cosi' il primo dei tre menu' a cascata e' anche la strategia
// di caricamento. `registraEnte` e' sincrona e pura; `caricaEnte` e' la sottile adattatrice
// che va a prendere il file. Il motore resta sincrono.
//
// Perche' esiste la provincia qui dentro. Non e' un'entita' fiscale e non entra in nessuna
// formula (CONTEXT.md): e' il passo intermedio del selettore, che spezza gli elenchi lunghi
// — la Lombardia da sola ha 1.500 comuni — in liste che si scorrono con gli occhi. Il dato
// arriva dall'anagrafica ISTAT insieme al comune, quindi non e' un'invenzione della pagina.
//
// Perche' `costantiPerLuogo` memoizza. `zoneNonMonotonia` (src/discontinuita.js) tiene le
// sue zone in una WeakMap indicizzata per IDENTITA' dell'oggetto costanti: se questo
// modulo restituisse un oggetto nuovo a ogni chiamata, il censimento dei salti — che per
// trovare gli estremi di ogni zona ricalcola la cascata a passi di un centesimo — verrebbe
// rifatto a ogni render invece che una volta per selezione.

import { COSTANTI_PER_ANNO } from './costanti/index.js'

// `${anno}:${codiceCatastale}` -> { ente, comune }, gia' normalizzati
const luoghi = new Map()
// `${anno}:${codiceCatastale}` -> costanti, per l'identita' che serve alla WeakMap
const costantiPerCodice = new Map()
// `${anno}:${slug}` -> l'ente registrato, per non ricaricare due volte la stessa regione
const entiRegistrati = new Map()

// Nel JSON lo scaglione aperto e' `null`, perche' JSON non ha Infinity; il motore lavora
// con Infinity, che e' quello che «oltre» significa. La conversione sta qui, una volta al
// caricamento, e non dentro `perScaglioni`: il motore non deve sapere da dove arriva il dato.
function scaglioniDelMotore(scaglioni) {
  return scaglioni.map(({ fino, aliquota }) => ({ fino: fino ?? Infinity, aliquota }))
}

function regolaDelMotore(regola) {
  return {
    ...regola,
    scaglioni: scaglioniDelMotore(regola.scaglioni),
    varianti: (regola.varianti ?? []).map((variante) => ({
      ...variante,
      scaglioni: scaglioniDelMotore(variante.scaglioni),
    })),
    detrazioni: regola.detrazioni ?? [],
  }
}

/**
 * Registra un ente impositore e tutti i suoi comuni, dal JSON prodotto da
 * `strumenti/importa-addizionali.mjs`. Idempotente: registrare due volte lo stesso ente
 * non ricostruisce niente, cosi' la pagina puo' chiamarlo a ogni cambio di menu'.
 */
export function registraEnte(dati) {
  const chiaveEnte = `${dati.anno}:${dati.ente.slug}`
  if (entiRegistrati.has(chiaveEnte)) return entiRegistrati.get(chiaveEnte)

  const ente = Object.freeze(regolaDelMotore(dati.ente))

  for (const [codice, comune] of Object.entries(dati.comuni)) {
    luoghi.set(
      `${dati.anno}:${codice}`,
      Object.freeze({
        ente,
        comune: Object.freeze(
          regolaDelMotore({
            ...comune,
            codice,
            // Il link alla scheda MEF si costruisce dal codice catastale, che e' la chiave
            // con cui il MEF stesso indicizza i comuni. `annoRegola` non e' sempre l'anno
            // d'imposta: per un comune in proroga la delibera che vale e' quella dell'anno
            // prima, e il link deve portare a QUELLA scheda.
            fonte: {
              citazione: citazioneComunale(comune, codice, dati.anno),
              url: dati.fonteComune
                .replace('{anno}', comune.annoRegola)
                .replace('{provincia}', comune.provincia)
                .replace('{codice}', codice),
            },
          }),
        ),
      }),
    )
  }

  const registrato = Object.freeze({
    ente,
    capoluogo: dati.capoluogo,
    province: Object.freeze({ ...dati.province }),
    scaricatoIl: dati.scaricatoIl,
  })
  entiRegistrati.set(chiaveEnte, registrato)
  return registrato
}

function citazioneComunale(comune, codice, anno) {
  const chi = `MEF, addizionale comunale IRPEF di ${comune.nome} (${comune.provincia}, cod. ${codice})`
  // Un comune che non ha mai istituito il tributo non e' un dato mancante: la scheda MEF
  // esiste e dice proprio quello. La citazione lo scrive invece di fingere una delibera.
  if (!comune.delibera) return `${chi}: nessuna aliquota deliberata per l’anno d’imposta ${anno}`
  const delibera = `delibera n. ${comune.delibera}${comune.dataDelibera ? ` del ${comune.dataDelibera}` : ''}`
  return comune.annoRegola === anno
    ? `${chi}: ${delibera}, anno d’imposta ${anno}`
    : `${chi}: ${delibera}, prorogata dal ${comune.annoRegola} per il ${anno}`
}

/**
 * Le costanti dell'anno con dentro le addizionali del comune indicato. Lo stesso oggetto a
 * ogni chiamata con la stessa coppia, per l'identita' che la memoizzazione a valle richiede.
 *
 * `comune` a null e' il luogo predefinito, curato a mano in `src/costanti/<anno>.js` con la
 * fonte accanto al valore: il motore resta usabile senza caricare nessun dato, ed e' quello
 * che fa la suite di test quando il luogo non e' il soggetto della prova.
 */
export function costantiPerLuogo(anno, comune = null) {
  const base = COSTANTI_PER_ANNO[anno]
  if (!base) throw new RangeError(`anno d’imposta non supportato: ${anno}`)
  if (comune === null || comune === undefined) return base

  const chiave = `${anno}:${comune}`
  const memoizzato = costantiPerCodice.get(chiave)
  if (memoizzato) return memoizzato

  const luogo = luoghi.get(chiave)
  if (!luogo) {
    // Il comune predefinito funziona anche a dati non caricati: e' l'unico che vive nelle
    // costanti curate. Per ogni altro l'assenza e' un errore esplicito, non un calcolo
    // silenzioso sulle aliquote di Milano.
    if (comune === base.addizionaleComunale.codice) return base
    throw new RangeError(
      `comune non caricato: ${comune} (anno d’imposta ${anno}). ` +
        'Registrare prima il suo ente impositore con registraEnte().',
    )
  }

  const costanti = Object.freeze({
    ...base,
    comune,
    addizionaleRegionale: luogo.ente,
    addizionaleComunale: luogo.comune,
  })
  costantiPerCodice.set(chiave, costanti)
  return costanti
}

/**
 * Il luogo predefinito dell'anno, letto dalle costanti curate: e' il default con cui la
 * pagina si apre, con lo stesso criterio per cui il campo RAL e' prepopolato a 30.000.
 * Sta qui e non nella pagina perche' quale sia il luogo di partenza e' dominio.
 */
export function luogoDefault(anno) {
  const base = COSTANTI_PER_ANNO[anno]
  if (!base) throw new RangeError(`anno d’imposta non supportato: ${anno}`)
  return { ente: base.addizionaleRegionale.ente, comune: base.addizionaleComunale.codice }
}

/**
 * La provincia di un comune registrato: serve a posizionare il menu' intermedio quando il
 * comune e' scelto da qualcun altro — il capoluogo dopo un cambio di ente, il luogo
 * predefinito all'apertura. `null` se il comune non e' fra quelli caricati.
 */
export function provinciaDelComune(anno, codice) {
  return luoghi.get(`${anno}:${codice}`)?.comune.provincia ?? null
}

// ---------------------------------------------------------------------------
// Caricamento (solo pagina)
// ---------------------------------------------------------------------------

// I JSON stanno accanto al codice, non a un URL assoluto: la pagina funziona identica
// servita da GitHub Pages, da un server statico locale o da una sottocartella.
const cartellaDati = (anno) => new URL(`../dati/addizionali/${anno}/`, import.meta.url)

async function leggiJson(url) {
  const risposta = await fetch(url)
  if (!risposta.ok) throw new Error(`dati non raggiungibili (${risposta.status}): ${url}`)
  return risposta.json()
}

/** L'elenco degli enti impositori dell'anno: quel che riempie il primo menu'. */
export async function caricaIndice(anno) {
  return leggiJson(new URL('indice.json', cartellaDati(anno)))
}

/** Scarica e registra un ente impositore. Alla seconda chiamata non scarica piu' niente. */
export async function caricaEnte(anno, slug) {
  const gia = entiRegistrati.get(`${anno}:${slug}`)
  if (gia) return gia
  return registraEnte(await leggiJson(new URL(`${slug}.json`, cartellaDati(anno))))
}

/**
 * Le province di un ente gia' registrato, in ordine alfabetico: quel che riempie il secondo
 * menu'. Sono solo quelle che hanno davvero un comune nell'elenco — una voce che apre su un
 * menu' vuoto non e' una scelta.
 */
export function provinceDellEnte(anno, slug) {
  const registrato = entiRegistrati.get(`${anno}:${slug}`)
  if (!registrato) throw new RangeError(`ente non caricato: ${slug} (anno d’imposta ${anno})`)
  return Object.entries(registrato.province).map(([sigla, nome]) => ({ sigla, nome }))
}

/**
 * I comuni di una provincia dell'ente indicato, in ordine alfabetico: quel che riempie il
 * terzo menu'. La provincia si chiede insieme all'ente e non da sola perche' e' cosi' che il
 * selettore la usa — restringere una scelta gia' fatta, non aprirne una nuova.
 */
export function comuniDellaProvincia(anno, slug, provincia) {
  const prefisso = `${anno}:`
  const comuni = []
  for (const [chiave, luogo] of luoghi) {
    if (chiave.startsWith(prefisso) && luogo.ente.slug === slug && luogo.comune.provincia === provincia) {
      comuni.push(luogo.comune)
    }
  }
  return comuni.sort((a, b) => a.nome.localeCompare(b.nome, 'it'))
}
