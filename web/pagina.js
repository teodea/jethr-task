// Lo strato di pagina: legge gli input, chiama i seam del motore, renderizza. Qui non vive
// nessuna decisione di dominio — mensilita' ammesse, anno d'imposta, testi, formati e
// regole di validazione arrivano tutti da src/. Se in questo file compare una soglia, un
// ordine o una stringa di dominio, e' nel posto sbagliato.

import { calcolaCascata } from '../src/cascata.js'
import { presentaCascata, presentaScalino } from '../src/presentazione.js'
import {
  testiCascata,
  avvisoScalino,
  avvisoPeriodo,
  descriviGiorniDelRapporto,
  formattaEuro,
  formattaPercentuale,
  ORDINE_VOCI,
  ETICHETTA_FONTE,
  ETICHETTA_TU_SEI_QUI,
  ETICHETTA_APRI_TUTTE,
  ETICHETTA_CHIUDI_TUTTE,
  etichettaEnte,
  etichettaProvincia,
  etichettaComune,
  voceEnte,
  aiutoComune,
} from '../src/testi.js'
import { MENSILITA_AMMESSE, MENSILITA_DEFAULT, validaPeriodo } from '../src/validazione.js'
import { interpretaImporto, formattaImporto } from '../src/formato.js'
import { inizioAnno, fineAnno, giorniDelRapporto } from '../src/periodo.js'
import { ANNO_CORRENTE, COSTANTI_PER_ANNO } from '../src/costanti/index.js'
import {
  caricaIndice,
  caricaEnte,
  provinceDellEnte,
  comuniDellaProvincia,
  provinciaDelComune,
  luogoDefault,
} from '../src/luoghi.js'

const form = document.querySelector('#calcolatore')
const campoRal = document.querySelector('#ral')
const gruppoMensilita = document.querySelector('#mensilita')
const campoInizio = document.querySelector('#data-inizio')
const campoFine = document.querySelector('#data-fine')
const periodoGiorni = document.querySelector('#periodo-giorni')
const errorePeriodo = document.querySelector('#errore-periodo')
const periodoAvviso = document.querySelector('#periodo-avviso')
const periodoAvvisoTesto = document.querySelector('#periodo-avviso-testo')
const errore = document.querySelector('#errore')
const avvisi = document.querySelector('#avvisi')
const risultato = document.querySelector('#risultato')
const scalino = document.querySelector('#scalino')
const scalinoTesto = document.querySelector('#scalino-testo')
const scalinoGrafico = document.querySelector('#scalino-grafico')
const eroi = document.querySelector('#eroi')
const elencoVoci = document.querySelector('#voci')
const comandoTutte = document.querySelector('#tutte')
const attesa = document.querySelector('#attesa')
const attesaEroi = document.querySelector('#attesa-eroi')
const attesaVoci = document.querySelector('#attesa-voci')
const menuEnte = document.querySelector('#ente')
const menuProvincia = document.querySelector('#provincia')
const menuComune = document.querySelector('#comune')
const aiutoDelComune = document.querySelector('#aiuto-comune')

// I tre numeri hero, nell'ordine in cui rispondono alle domande dell'utente: quanto prendo
// in un anno, quanto al mese, quanto non mi arriva.
const EROI = ['nettoAnnuo', 'nettoMensile', 'trattenuteTotali']

// L'unico pezzo di input che non sta nel form (issue #23): la data di prima iscrizione a
// forme pensionistiche non si chiede, si assume — e la deroga si offre solo dentro il
// risultato, a chi ha una RAL sopra il massimale, che e' l'unico caso in cui la risposta
// cambia una cifra. Vive qui e non nel form perche' un campo che spunta mentre l'utente
// scrive gli farebbe muovere il layout sotto le dita.
//
// Sopravvive ai calcoli successivi: e' un fatto della persona, non di questa RAL. Chi
// scende sotto il massimale smette di vedere l'offerta ma non cambia risposta, e infatti
// il netto e' lo stesso in entrambi i casi.
let iscrittoAnte1996 = false

// L'anno d'imposta e' dichiarato, non chiesto (docs/ASSUNZIONI.md): la pagina lo scrive
// leggendolo dalle costanti, cosi' non puo' divergere dai numeri che mostra.
for (const nodo of document.querySelectorAll('[data-anno]')) {
  nodo.textContent = String(ANNO_CORRENTE)
}

// Il segmented control nasce dal dominio: gli unici valori rappresentabili sono quelli
// ammessi dalla validazione, quindi una mensilita' fuori dominio non e' esprimibile
// dall'interfaccia. La validazione del motore resta come cintura di sicurezza.
for (const mensilita of MENSILITA_AMMESSE) {
  const segmento = document.createElement('label')
  segmento.className = 'segmento'

  const scelta = document.createElement('input')
  scelta.type = 'radio'
  scelta.name = 'mensilita'
  scelta.value = String(mensilita)
  scelta.checked = mensilita === MENSILITA_DEFAULT

  segmento.append(scelta, document.createTextNode(String(mensilita)))
  gruppoMensilita.append(segmento)
}

function leggiMensilita() {
  return Number(new FormData(form).get('mensilita'))
}

// I due campi data nascono sul perimetro dell'anno d'imposta: default agli estremi (il
// rapporto in essere per tutto l'anno resta il caso normale, e chi non ha date da inserire
// non deve fare niente) e min/max che rendono difficile uscirne. La validazione del motore
// resta come cintura di sicurezza — `min` e `max` un browser puo' non applicarli, e le date
// si possono anche scrivere a mano.
campoInizio.value = inizioAnno(ANNO_CORRENTE)
campoFine.value = fineAnno(ANNO_CORRENTE)
for (const campo of [campoInizio, campoFine]) {
  campo.min = inizioAnno(ANNO_CORRENTE)
  campo.max = fineAnno(ANNO_CORRENTE)
}

function leggiPeriodo() {
  return { dataInizio: campoInizio.value, dataFine: campoFine.value }
}

// ---------------------------------------------------------------------------
// Il selettore del luogo
// ---------------------------------------------------------------------------

// I tre menu' a cascata. Il primo elenca i ventuno enti impositori — diciannove regioni piu'
// le due province autonome, che hanno leggi proprie e nella norma stanno al posto della
// regione: elencarne venti lascerebbe fuori Trento o Bolzano. Il secondo elenca le province
// del solo ente scelto, il terzo i comuni della sola provincia scelta.
//
// Il passo intermedio non serve al calcolo — la provincia non e' un'entita' fiscale
// (CONTEXT.md) — serve a chi guarda: senza, il menu' dei comuni della Lombardia e' una lista
// di millecinquecento voci, e sceglierci dentro vuol dire gia' sapere come si scrive il nome.
// Con la provincia in mezzo il piu' lungo scende a 312 (Torino). Il primo menu' resta anche
// la strategia di caricamento: e' lui a decidere quale file la pagina scarica.
//
// Il luogo predefinito resta la coppia `{ ente, comune }`: la provincia su cui il menu' di
// mezzo si posiziona si DERIVA dal comune, qui come a ogni cambio di ente. E' la stessa
// regola che il glossario da' per l'ente impositore, ed e' il motivo per cui l'aggiunta di un
// gradino non aggiunge un input al dominio.
const { ente: ENTE_DEFAULT, comune: COMUNE_DEFAULT } = luogoDefault(ANNO_CORRENTE)

// Finche' i dati non sono arrivati il calcolo usa il luogo predefinito, curato nelle
// costanti: `null` e' esattamente questo, e tiene la pagina utile anche se il caricamento
// fallisce del tutto.
let luogoScelto = null

document.querySelector('label[for="ente"]').textContent = etichettaEnte()
document.querySelector('label[for="provincia"]').textContent = etichettaProvincia()
document.querySelector('label[for="comune"]').textContent = etichettaComune()
aiutoDelComune.textContent = aiutoComune(ANNO_CORRENTE)

function riempiMenu(menu, voci, selezionato) {
  menu.replaceChildren(
    ...voci.map(({ valore, testo }) => {
      const opzione = document.createElement('option')
      opzione.value = valore
      opzione.textContent = testo
      opzione.selected = valore === selezionato
      return opzione
    }),
  )
}

// L'ultimo gradino: i comuni di una provincia. Il nome e basta, senza la sigla che il menu'
// sopra dichiara gia' — ripeterla su ogni riga sarebbe il rumore che questo passo esiste per
// togliere. Gli omonimi che la sigla distingueva stanno in province diverse, quindi qui non
// si incontrano piu'.
function mostraComuniDi(slug, provincia, comuneDaSelezionare) {
  const comuni = comuniDellaProvincia(ANNO_CORRENTE, slug, provincia)
  riempiMenu(
    menuComune,
    comuni.map(({ codice, nome }) => ({ valore: codice, testo: nome })),
    // Il comune chiesto se c'e', altrimenti il primo in ordine alfabetico: cambiando
    // provincia non esiste un comune «giusto» su cui atterrare, ed e' l'unico gradino in cui
    // manca un default di dominio.
    comuneDaSelezionare ?? comuni[0].codice,
  )
  menuComune.disabled = false
  luogoScelto = menuComune.value
  // Due etichette della cascata portano il nome della regione e del comune: cambiando
  // luogo cambiano anche prima che ci sia un calcolo.
  mostraAttesa()
}

// Il gradino di mezzo, e con lui quello sotto. Il comune a `null` vuol dire «scegli tu»: e'
// il caso del cambio di ente, in cui si atterra sul capoluogo e sulla sua provincia.
async function mostraProvinceDi(slug, comuneDaSelezionare) {
  const { capoluogo } = await caricaEnte(ANNO_CORRENTE, slug)
  const comune = comuneDaSelezionare ?? capoluogo
  riempiMenu(
    menuProvincia,
    provinceDellEnte(ANNO_CORRENTE, slug).map(({ sigla, nome }) => ({ valore: sigla, testo: nome })),
    provinciaDelComune(ANNO_CORRENTE, comune),
  )
  menuProvincia.disabled = false
  mostraComuniDi(slug, menuProvincia.value, comune)
}

async function preparaSelettore() {
  const { enti } = await caricaIndice(ANNO_CORRENTE)
  riempiMenu(
    menuEnte,
    enti.map((ente) => ({ valore: ente.slug, testo: voceEnte(ente) })),
    ENTE_DEFAULT,
  )
  menuEnte.disabled = false
  await mostraProvinceDi(ENTE_DEFAULT, COMUNE_DEFAULT)
}

// Ogni menu' rifa' quelli sotto di se'. E' il modo piu' solido di impedire gli stati
// incoerenti — «Lombardia + provincia di Roma», «Milano + comune bergamasco»: non li si
// scopre validando dopo, non sono proprio esprimibili. Cambiando ente si atterra sul suo
// capoluogo, che e' anche la ragione per cui il dato del capoluogo esiste.
menuEnte.addEventListener('change', async () => {
  menuProvincia.disabled = true
  menuComune.disabled = true
  await mostraProvinceDi(menuEnte.value, null)
})

menuProvincia.addEventListener('change', () => {
  menuComune.disabled = true
  mostraComuniDi(menuEnte.value, menuProvincia.value, null)
})

menuComune.addEventListener('change', () => {
  luogoScelto = menuComune.value
  mostraAttesa()
})

preparaSelettore().catch(() => {
  // I dati delle addizionali non sono arrivati. Il calcolo resta corretto sul luogo
  // predefinito, quindi la pagina non si blocca: si dice che il selettore non e'
  // disponibile e si va avanti, invece di negare un numero che sappiamo dare.
  menuEnte.disabled = true
  menuProvincia.disabled = true
  menuComune.disabled = true
  aiutoDelComune.textContent =
    'Non riesco a caricare l’elenco dei comuni: il calcolo usa il comune predefinito.'
  // Il selettore non c'e', ma la pagina calcola lo stesso sul luogo predefinito: l'attesa
  // va riempita comunque, altrimenti resterebbe un riquadro vuoto dove sta l'invito.
  mostraAttesa()
})

// Un solo stile per tutti i messaggi bloccanti — quelli di forma (src/formato.js, «non
// riesco a leggere questo importo») e quelli di dominio (src/validazione.js, «la RAL deve
// essere maggiore di zero») arrivano da moduli diversi ma rispondono alla stessa domanda
// dell'utente: perche' non vedo un numero. Due posti pero', uno per gruppo di campi: un
// messaggio sulle date scritto sotto la RAL manderebbe a correggere il campo sbagliato.
// Ne' le mensilita' ne' i tre menu' del luogo hanno uno slot: non hanno errori possibili,
// perche' un valore fuori dominio non e' rappresentabile da un segmented control ne' da
// una tendina.
const SLOT_RAL = { messaggio: errore, campi: [campoRal] }
const SLOT_PERIODO = { messaggio: errorePeriodo, campi: [campoInizio, campoFine] }

function mostraErrore(slot, messaggio) {
  slot.messaggio.textContent = messaggio
  slot.messaggio.hidden = false
  for (const campo of slot.campi) campo.setAttribute('aria-invalid', 'true')
  // Il risultato precedente sparisce: un numero accanto a un input invalido verrebbe
  // letto come vero. Lo scalino se ne va con lui perche' ci vive dentro; gli avvisi
  // stanno fuori dall'area risultati e vanno tolti a mano, altrimenti resterebbero in
  // pagina a commentare una RAL che non e' piu' quella scritta nel campo.
  risultato.hidden = true
  // Al posto del risultato ritorna l'attesa: sono le due facce della stessa area, e
  // lasciarla vuota rimpicciolirebbe la pagina di colpo sotto le dita di chi sta ancora
  // correggendo il campo.
  attesa.hidden = false
  mostraAvvisi([])
}

function nascondiErrore(slot) {
  slot.messaggio.hidden = true
  slot.messaggio.textContent = ''
  for (const campo of slot.campi) campo.removeAttribute('aria-invalid')
}

// Il segno di attenzione: decorativo, fuori dall'albero di accessibilita'. Il testo che
// accompagna dice gia' tutto, e sentirsi annunciare «emoji triangolo di avvertimento»
// prima di ogni avviso sarebbe rumore, non informazione.
function creaSegno() {
  const segno = document.createElement('span')
  segno.className = 'segno'
  segno.textContent = '⚠️'
  segno.setAttribute('aria-hidden', 'true')
  return segno
}

// Gli avvisi non bloccanti del motore (src/validazione.js): l'input e' calcolabile ma
// sospetto — una RAL sotto il minimale contributivo non e' un tempo pieno per l'anno
// intero. Il calcolo si mostra comunque: negarlo tratterebbe come errore quello che il
// dominio classifica come dubbio.
function mostraAvvisi(elenco) {
  avvisi.replaceChildren(
    ...elenco.map((testo) => {
      const banner = document.createElement('p')
      banner.className = 'avviso'
      banner.append(creaSegno(), document.createTextNode(testo))
      return banner
    }),
  )
  avvisi.hidden = elenco.length === 0
}

function creaEroe({ etichetta, valore, spiegazione, incidenza, nota, primario }) {
  const eroe = document.createElement('article')
  // Il primo dei tre e' la risposta alla domanda che ha portato l'utente qui: prende la riga
  // intera e il fondo pieno d'accento. Gerarchia di lettura, non di dominio — quale voce
  // venga per prima lo decide EROI, qui sopra.
  eroe.className = primario ? 'eroe eroe-primario' : 'eroe'

  const titolo = document.createElement('h2')
  titolo.className = 'eroe-etichetta'
  titolo.textContent = etichetta

  const numero = document.createElement('p')
  numero.className = 'eroe-valore'
  numero.textContent = valore

  eroe.append(titolo, numero)

  if (incidenza) {
    const quota = document.createElement('p')
    quota.className = 'eroe-incidenza'
    quota.textContent = incidenza
    eroe.append(quota)
  }

  const glossa = document.createElement('p')
  glossa.className = 'eroe-glossa'
  glossa.textContent = spiegazione
  eroe.append(glossa)

  if (nota) {
    const avvertenza = document.createElement('p')
    avvertenza.className = 'eroe-nota'
    avvertenza.textContent = nota
    eroe.append(avvertenza)
  }

  return eroe
}

// Una riga della cascata. <details> invece di un bottone e un pannello: apertura e chiusura
// da tastiera, stato iniziale chiuso e semantica di divulgazione arrivano dal browser, senza
// una riga di JavaScript che possa sbagliarli.
function creaVoce({ voce, etichetta, valore, spiegazione, nota, fonte, deroga, aperta }) {
  const riga = document.createElement('li')
  riga.className = 'voce'

  const dettaglio = document.createElement('details')
  // La chiave serve a ritrovare questa riga dopo un ricalcolo: vedi vociAperte().
  dettaglio.dataset.voce = voce
  dettaglio.open = aperta

  const intestazione = document.createElement('summary')
  intestazione.className = 'voce-riga'

  const nome = document.createElement('span')
  nome.className = 'voce-etichetta'
  nome.textContent = etichetta

  const importo = document.createElement('span')
  // Una voce a zero resta in cascata e si vede che e' zero: la struttura non cambia con
  // l'input, cambia l'importo. Il grigio dice "non e' il tuo caso" senza toglierla di mezzo.
  importo.className = valore === 0 ? 'voce-importo voce-importo-zero' : 'voce-importo'
  importo.textContent = formattaEuro(valore)

  intestazione.append(nome, importo)

  const corpo = document.createElement('div')
  corpo.className = 'voce-corpo'

  const glossa = document.createElement('p')
  glossa.className = 'voce-spiegazione'
  glossa.textContent = spiegazione
  corpo.append(glossa)

  if (nota) {
    // Il motore emette una nota solo dove il caso devia da quello liscio — massimale,
    // incapienza, gate delle addizionali, soglia secca: e' il motore a decidere che c'e'
    // qualcosa da segnalare, la pagina si limita a segnalarlo.
    const avvertenza = document.createElement('p')
    avvertenza.className = 'voce-nota'
    avvertenza.append(creaSegno(), document.createTextNode(nota))
    corpo.append(avvertenza)
  }

  if (deroga) {
    // L'offerta di precisione: un bottone dentro una nota, non un campo nel form. E'
    // <button> e non <a> perche' non porta da nessuna parte — ricalcola questa stessa
    // pagina sotto l'altra ipotesi. `aria-pressed` dice a chi non vede il testo quale
    // delle due sia attiva in questo momento.
    const offerta = document.createElement('p')
    offerta.className = 'voce-deroga'

    const comando = document.createElement('button')
    comando.type = 'button'
    comando.className = 'deroga-comando'
    comando.textContent = deroga.comando
    comando.setAttribute('aria-pressed', String(deroga.attiva))
    comando.addEventListener('click', alternaDeroga)

    offerta.append(document.createTextNode(`${deroga.testo} `), comando)
    corpo.append(offerta)
  }

  if (fonte) {
    // La riga espansa chiude sul documento da cui il numero proviene: la promessa del
    // README («la fonte normativa accanto a ogni voce») diventa verificabile in un click
    // invece di restare un'affermazione. Nuova scheda perche' andare a leggere una
    // circolare non deve far perdere il calcolo appena fatto; rel="noopener" perche' un
    // target="_blank" senza lascia alla pagina di destinazione un riferimento a questa.
    const citazione = document.createElement('p')
    citazione.className = 'voce-fonte'

    const collegamento = document.createElement('a')
    collegamento.href = fonte.url
    collegamento.textContent = fonte.citazione
    collegamento.target = '_blank'
    collegamento.rel = 'noopener'

    citazione.append(document.createTextNode(`${ETICHETTA_FONTE}: `), collegamento)
    corpo.append(citazione)
  }

  dettaglio.append(intestazione, corpo)
  riga.append(dettaglio)
  return riga
}

// Lo stato d'attesa: la pagina prima del click. Ha la forma che avra' da calcolata — tre
// carte e le voci della cascata — e nessun numero. Il trattino tiene la colonna
// dell'importo e sta fuori dall'albero di accessibilita': diciotto trattini annunciati a
// voce non aggiungono niente all'invito che li precede.
function creaAttesaCarta({ etichetta, primario }) {
  const carta = document.createElement('article')
  carta.className = primario ? 'attesa-eroe attesa-eroe-primario' : 'attesa-eroe'

  const nome = document.createElement('p')
  nome.className = 'attesa-eroe-etichetta'
  nome.textContent = etichetta

  carta.append(nome, creaAttesaSegno('attesa-eroe-valore'))
  return carta
}

function creaAttesaVoce(etichetta) {
  const riga = document.createElement('li')
  riga.className = 'attesa-voce'

  const nome = document.createElement('span')
  nome.textContent = etichetta

  riga.append(nome, creaAttesaSegno('attesa-segno'))
  return riga
}

function creaAttesaSegno(classe) {
  const segno = document.createElement('span')
  segno.className = classe
  segno.textContent = '—'
  segno.setAttribute('aria-hidden', 'true')
  return segno
}

// Le etichette dell'attesa sono quelle vere della cascata, non un elenco riscritto nella
// pagina: due di esse portano il nome della regione e del comune scelti, e una voce nuova
// in ORDINE_VOCI deve comparire anche prima del calcolo senza che nessuno se ne ricordi.
// Il motore gira per i soli nomi e i valori si buttano — nessuna cifra raggiunge la pagina
// finche' l'utente non preme «Calcola». Si rifa' a ogni cambio di luogo, che e' l'unico
// input da cui quelle due etichette dipendono.
function mostraAttesa() {
  let testi
  try {
    const importo = interpretaImporto(campoRal.value)
    if (!importo.valido) return
    testi = testiCascata(
      calcolaCascata({
        ral: importo.valore,
        mensilita: leggiMensilita(),
        anno: ANNO_CORRENTE,
        ...leggiPeriodo(),
        comune: luogoScelto ?? COMUNE_DEFAULT,
      }),
    )
  } catch {
    // Input a meta' di una correzione: restano le etichette gia' in pagina, che al
    // massimo portano il luogo di un istante fa. Nessun motivo di svuotare la struttura
    // per un input che non riguarda i nomi.
    return
  }

  attesaEroi.replaceChildren(
    ...EROI.map((voce, posizione) =>
      creaAttesaCarta({ etichetta: testi[voce].etichetta, primario: posizione === 0 }),
    ),
  )
  attesaVoci.replaceChildren(...ORDINE_VOCI.map((voce) => creaAttesaVoce(testi[voce].etichetta)))
}

// Il mini-grafico dello scalino. La curva, la finestra e i punti arrivano gia' decisi da
// presentaScalino (src/presentazione.js): qui si scelgono solo le coordinate. Tutto quello
// che segue e' geometria — nessuna soglia, nessuna regola, nessun numero di dominio.
const SVG = 'http://www.w3.org/2000/svg'

// Una tela piccola e proporzioni fisse: l'SVG scala con la colonna, quindi le misure qui
// dentro sono rapporti, non pixel. I margini fanno posto alle scritte — sopra l'etichetta
// del punto, sotto i due estremi della zona.
const TELA = { larghezza: 340, altezza: 150, sopra: 22, sotto: 26, lato: 14 }

function creaNodo(nome, attributi) {
  const nodo = document.createElementNS(SVG, nome)
  for (const [chiave, valore] of Object.entries(attributi)) nodo.setAttribute(chiave, valore)
  return nodo
}

function creaGrafico({ zona, tuSeiQui, punti }) {
  const { larghezza, altezza, sopra, sotto, lato } = TELA
  const netti = punti.map((punto) => punto.netto)
  const ralMin = punti[0].ral
  const ralMax = punti.at(-1).ral
  const nettoMin = Math.min(...netti)
  const nettoMax = Math.max(...netti)

  const x = (ral) => lato + ((ral - ralMin) / (ralMax - ralMin)) * (larghezza - 2 * lato)
  const y = (netto) =>
    sopra + ((nettoMax - netto) / (nettoMax - nettoMin)) * (altezza - sopra - sotto)
  const coppia = (punto) => `${x(punto.ral)},${y(punto.netto)}`

  const disegno = creaNodo('svg', {
    viewBox: `0 0 ${larghezza} ${altezza}`,
    // Decorativo, fuori dall'albero di accessibilita': ogni cifra che il grafico mostra e'
    // gia' scritta nel testo del banner, e ripeterla come etichetta alternativa sarebbe un
    // doppione. Chi non lo vede non perde un dato — perde un colpo d'occhio.
    'aria-hidden': 'true',
  })

  disegno.append(
    creaNodo('rect', {
      class: 'grafico-fondo',
      x: 0,
      y: 0,
      width: larghezza,
      height: altezza,
      rx: 8,
    }),
  )

  // L'area fra il livello perduto e la curva: e' letteralmente il buco di cui parla il
  // testo. Si chiude sui due estremi della zona, dove la curva tocca di nuovo il livello.
  const dentroLaZona = punti.filter((punto) => punto.ral > zona.da && punto.ral <= zona.a)
  disegno.append(
    creaNodo('polygon', {
      class: 'grafico-perdita',
      points: [
        `${x(zona.da)},${y(zona.livello)}`,
        ...dentroLaZona.map(coppia),
        `${x(zona.a)},${y(zona.livello)}`,
      ].join(' '),
    }),
    creaNodo('line', {
      class: 'grafico-livello',
      x1: x(zona.da),
      y1: y(zona.livello),
      x2: x(zona.a),
      y2: y(zona.livello),
    }),
    creaNodo('polyline', { class: 'grafico-curva', points: punti.map(coppia).join(' ') }),
  )

  // I due estremi sull'asse: sono la prova che la scala e' ristretta — poche centinaia di
  // euro fra un capo e l'altro del disegno. Stessa formattazione dei numeri del testo.
  for (const ral of [zona.da, zona.a]) {
    const tacca = creaNodo('line', {
      class: 'grafico-tacca',
      x1: x(ral),
      y1: altezza - sotto,
      x2: x(ral),
      y2: altezza - sotto + 4,
    })
    const scritta = creaNodo('text', {
      class: 'grafico-scala',
      x: x(ral),
      y: altezza - 7,
      'text-anchor': 'middle',
    })
    scritta.textContent = formattaEuro(ral)
    disegno.append(tacca, scritta)
  }

  // «Tu sei qui»: il punto sulla RAL inserita, in fondo al salto. L'etichetta sta dal lato
  // dove c'e' spazio, altrimenti uscirebbe dalla tela quando la RAL e' vicina a un estremo.
  const puntoX = x(tuSeiQui.ral)
  const aSinistra = puntoX < larghezza / 2
  const etichetta = creaNodo('text', {
    class: 'grafico-punto-etichetta',
    x: aSinistra ? puntoX + 7 : puntoX - 7,
    y: y(tuSeiQui.netto) - 9,
    'text-anchor': aSinistra ? 'start' : 'end',
  })
  etichetta.textContent = ETICHETTA_TU_SEI_QUI
  disegno.append(
    creaNodo('circle', { class: 'grafico-punto', cx: puntoX, cy: y(tuSeiQui.netto), r: 4 }),
    etichetta,
  )

  return disegno
}

// L'ultima cascata mostrata. Serve alla sola deroga, che ricalcola gli stessi input sotto
// l'altra ipotesi: sono quelli del risultato che l'utente ha davanti, non quelli scritti
// nel campo in questo momento — che potrebbe aver riscritto senza premere «Calcola».
let ultimaCascata = null

// Quali righe della cascata sono aperte adesso. Solo la deroga se ne serve: quel click
// parte da dentro una riga aperta, e richiuderla porterebbe via lo stesso testo che ha
// appena offerto il ricalcolo. Un click su «Calcola» riparte invece da tutte chiuse — e'
// un calcolo nuovo, non lo stesso visto sotto un'altra ipotesi.
function vociAperte() {
  return new Set([...elencoVoci.querySelectorAll('details[open]')].map((riga) => riga.dataset.voce))
}

// Apri tutte / chiudi tutte. Diciotto righe da aprire una per una sono diciotto click per
// chi vuole leggere il calcolo per intero, o stamparlo: il comando fa in un gesto quello che
// resta comunque possibile fare riga per riga — non sostituisce il <details>, lo aziona in
// blocco. Il verso e' quello che manca: finche' una riga e' chiusa il bottone apre, quando
// sono tutte aperte chiude.
function righeDellaCascata() {
  return [...elencoVoci.querySelectorAll('details')]
}

function aggiornaComandoTutte() {
  const righe = righeDellaCascata()
  // Prima del primo calcolo l'elenco e' vuoto: un bottone che non ha niente da aprire non
  // si mostra. (L'attesa ha una struttura sua, e le sue righe non si aprono.)
  comandoTutte.hidden = righe.length === 0

  // `every` su un elenco vuoto dice di si': senza il primo termine il bottone nascerebbe
  // «Chiudi tutte» prima che esista una riga da chiudere.
  const tutteAperte = righe.length > 0 && righe.every((riga) => riga.open)
  comandoTutte.textContent = tutteAperte ? ETICHETTA_CHIUDI_TUTTE : ETICHETTA_APRI_TUTTE
  comandoTutte.setAttribute('aria-expanded', String(tutteAperte))
}

comandoTutte.addEventListener('click', () => {
  const righe = righeDellaCascata()
  const daAprire = !righe.every((riga) => riga.open)
  for (const riga of righe) riga.open = daAprire
  aggiornaComandoTutte()
})

// Il bottone segue anche le righe aperte a mano: chi apre l'ultima si trova «Chiudi tutte»
// senza aver toccato il comando. `toggle` non fa bubbling — di qui il terzo argomento, che
// mette l'ascolto in fase di cattura invece che di risalita.
elencoVoci.addEventListener('toggle', aggiornaComandoTutte, true)

// Nasce con l'etichetta giusta e senza righe da comandare: l'area risultati e' nascosta
// finche' non c'e' un calcolo, ma il bottone non deve avere un testo vuoto nel frattempo.
aggiornaComandoTutte()

function alternaDeroga() {
  iscrittoAnte1996 = !iscrittoAnte1996

  // Tutti gli input del risultato mostrato, non solo i primi tre: senza comune e date il
  // motore ricadrebbe sul luogo predefinito e sull'anno intero, e il ridisegno cambierebbe
  // luogo e periodo in silenzio mentre i menu' dicono ancora la scelta dell'utente.
  const { ral, mensilita, anno, comune, dataInizio, dataFine } = ultimaCascata
  const apertura = vociAperte()
  mostraRisultato(
    calcolaCascata({ ral, mensilita, anno, comune, dataInizio, dataFine, iscrittoAnte1996 }),
    apertura,
  )

  // Il bottone appena premuto e' stato distrutto dal ridisegno: il fuoco va sul suo
  // sostituto, che dice ora il verso opposto. Senza, chi naviga da tastiera si ritrova
  // in cima al documento dopo aver chiesto una precisione in fondo a una riga.
  elencoVoci.querySelector('.deroga-comando')?.focus()
}

function mostraRisultato(cascata, apertura = new Set()) {
  ultimaCascata = cascata
  const voci = presentaCascata(cascata)
  const testi = testiCascata(cascata)

  mostraAvvisi(cascata.avvisi)

  // Il periodo parziale cambia tutti e tre i numeri hero — e non nella proporzione che
  // chiunque si aspetterebbe — quindi il banner li precede. Compare solo quando c'e'
  // qualcosa da dire: il motore restituisce null sull'anno intero.
  const periodoDaSpiegare = avvisoPeriodo(cascata)
  periodoAvvisoTesto.textContent = periodoDaSpiegare ?? ''
  periodoAvviso.hidden = periodoDaSpiegare === null

  // Lo scalino e' l'unico contenuto della pagina che spiega un numero *piu' basso* di
  // quello che l'utente avrebbe visto con una RAL minore: senza gli estremi espliciti
  // sembrerebbe un errore del calcolo. Sta sotto i numeri hero perche' commenta quelli.
  // Fuori dalle zone di non-monotonia il motore restituisce null e il banner sparisce.
  const scalinoDaMostrare = avvisoScalino(cascata)
  scalinoTesto.textContent = scalinoDaMostrare ?? ''
  scalino.hidden = scalinoDaMostrare === null

  // Il grafico illustra il testo, non lo completa: compaiono insieme perche' rispondono
  // alla stessa condizione di dominio (la RAL dentro una zona), ma se il disegno non ci
  // fosse il banner resterebbe leggibile e completo da solo.
  const profilo = presentaScalino(cascata)
  scalinoGrafico.replaceChildren(...(profilo ? [creaGrafico(profilo)] : []))

  eroi.replaceChildren(
    ...EROI.map((voce, posizione) =>
      creaEroe({
        etichetta: testi[voce].etichetta,
        valore: formattaEuro(voci[voce]),
        spiegazione: testi[voce].spiegazione,
        nota: testi[voce].nota,
        primario: posizione === 0,
        incidenza:
          voce === 'trattenuteTotali'
            ? `${formattaPercentuale(voci.incidenzaTrattenute)} della RAL`
            : null,
      }),
    ),
  )

  // La cascata si renderizza come mappa su ORDINE_VOCI: l'ordine e' dominio (ogni passo
  // parte da dove e' arrivato il precedente) e la pagina non lo ricostruisce. Le righe sono
  // ricreate a ogni calcolo, quindi nascono tutte chiuse anche dopo il secondo click —
  // tranne quelle che `apertura` chiede di riaprire, cioe' solo dopo una deroga.
  elencoVoci.replaceChildren(
    ...ORDINE_VOCI.map((voce) =>
      creaVoce({
        voce,
        etichetta: testi[voce].etichetta,
        valore: voci[voce],
        spiegazione: testi[voce].spiegazione,
        nota: testi[voce].nota,
        fonte: testi[voce].fonte,
        deroga: testi[voce].deroga ?? null,
        aperta: apertura.has(voce),
      }),
    ),
  )

  // Le righe sono nuove di zecca: nessun `toggle` e' passato di qui, e il verso del comando
  // va riallineato a mano — dopo un «Calcola» sono tutte chiuse, dopo una deroga no.
  aggiornaComandoTutte()

  attesa.hidden = true
  risultato.hidden = false
}

// Al blur il campo si riscrive in stile italiano: «30000» diventa «30.000», cosi' l'utente
// rilegge senza ambiguita' la cifra su cui sta per calcolare. Se l'importo non e'
// interpretabile si lascia intatto quello che ha scritto — riformattare a forza vorrebbe
// dire indovinare, e correggergli il testo sotto le dita gli toglierebbe il modo di capire
// dove ha sbagliato.
campoRal.addEventListener('blur', () => {
  const importo = interpretaImporto(campoRal.value)
  if (importo.valido) campoRal.value = formattaImporto(importo.valore)
})

// Mentre l'utente corregge, il messaggio precedente diventa vecchio: sparisce. Il risultato
// no — quello torna solo da un click su «Calcola».
campoRal.addEventListener('input', () => nascondiErrore(SLOT_RAL))

// I giorni si aggiornano mentre l'utente tocca le date, non al click: sono il numero che
// dice cosa sta per calcolare, e arriva insieme alla scelta invece che dopo. Con le date
// incoerenti sparisce, e al suo posto parla l'errore.
function aggiornaGiorni() {
  const esito = validaPeriodo(leggiPeriodo(), COSTANTI_PER_ANNO[ANNO_CORRENTE])
  if (esito.valida) {
    nascondiErrore(SLOT_PERIODO)
    const { dataInizio, dataFine } = leggiPeriodo()
    periodoGiorni.textContent = descriviGiorniDelRapporto(giorniDelRapporto(dataInizio, dataFine))
    return true
  }
  periodoGiorni.textContent = ''
  mostraErrore(SLOT_PERIODO, esito.errori[0])
  return false
}

for (const campo of [campoInizio, campoFine]) {
  campo.addEventListener('change', aggiornaGiorni)
  campo.addEventListener('input', aggiornaGiorni)
}

// Il numero c'e' gia' al primo caricamento, prima di ogni gesto: i campi nascono pieni, e
// una riga vuota accanto a due date valide sembrerebbe un pezzo che non ha funzionato.
periodoGiorni.textContent = descriviGiorniDelRapporto(
  giorniDelRapporto(inizioAnno(ANNO_CORRENTE), fineAnno(ANNO_CORRENTE)),
)

form.addEventListener('submit', (evento) => {
  evento.preventDefault()

  const importo = interpretaImporto(campoRal.value)
  if (!importo.valido) {
    mostraErrore(SLOT_RAL, importo.errore)
    return
  }
  // Le date si controllano prima di chiamare il motore, cosi' il messaggio finisce sotto i
  // campi che lo hanno prodotto invece che nel catch generico sotto la RAL.
  if (!aggiornaGiorni()) return

  try {
    mostraRisultato(
      calcolaCascata({
        ral: importo.valore,
        mensilita: leggiMensilita(),
        anno: ANNO_CORRENTE,
        ...leggiPeriodo(),
        comune: luogoScelto,
        // La deroga eventualmente attivata resta: e' una risposta su di se', non su questa
        // RAL. Sotto il massimale non cambia nulla, quindi non ha modo di sorprendere.
        iscrittoAnte1996,
      }),
    )
    nascondiErrore(SLOT_RAL)
  } catch (problema) {
    // Il motore rifiuta gli input fuori dominio con un messaggio gia' in lingua
    // (src/validazione.js): RAL <= 0 arriva qui, non dal parsing.
    mostraErrore(
      SLOT_RAL,
      problema instanceof RangeError
        ? problema.message
        : 'non riesco a calcolare il netto con questo input',
    )
  }
})
