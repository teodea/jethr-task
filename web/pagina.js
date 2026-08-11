// Lo strato di pagina: legge gli input, chiama i seam del motore, renderizza. Qui non vive
// nessuna decisione di dominio — mensilita' ammesse, anno d'imposta, testi, formati e
// regole di validazione arrivano tutti da src/. Se in questo file compare una soglia, un
// ordine o una stringa di dominio, e' nel posto sbagliato.

import { calcolaCascata } from '../src/cascata.js'
import { presentaCascata, presentaScalino } from '../src/presentazione.js'
import {
  testiCascata,
  avvisoScalino,
  formattaEuro,
  formattaPercentuale,
  ORDINE_VOCI,
  ETICHETTA_FONTE,
  ETICHETTA_TU_SEI_QUI,
  etichettaEnte,
  etichettaComune,
  aiutoComune,
} from '../src/testi.js'
import { MENSILITA_AMMESSE, MENSILITA_DEFAULT } from '../src/validazione.js'
import { interpretaImporto, formattaImporto } from '../src/formato.js'
import { ANNO_CORRENTE } from '../src/costanti/index.js'
import { caricaIndice, caricaEnte, comuniDellEnte, luogoDefault } from '../src/luoghi.js'

const form = document.querySelector('#calcolatore')
const campoRal = document.querySelector('#ral')
const gruppoMensilita = document.querySelector('#mensilita')
const errore = document.querySelector('#errore')
const avvisi = document.querySelector('#avvisi')
const risultato = document.querySelector('#risultato')
const scalino = document.querySelector('#scalino')
const scalinoTesto = document.querySelector('#scalino-testo')
const scalinoGrafico = document.querySelector('#scalino-grafico')
const eroi = document.querySelector('#eroi')
const elencoVoci = document.querySelector('#voci')
const menuEnte = document.querySelector('#ente')
const menuComune = document.querySelector('#comune')
const aiutoDelComune = document.querySelector('#aiuto-comune')

// I tre numeri hero, nell'ordine in cui rispondono alle domande dell'utente: quanto prendo
// in un anno, quanto al mese, quanto non mi arriva.
const EROI = ['nettoAnnuo', 'nettoMensile', 'trattenuteTotali']

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

// ---------------------------------------------------------------------------
// Il selettore del luogo
// ---------------------------------------------------------------------------

// I due menu' a cascata. Il primo elenca i ventuno enti impositori — diciannove regioni piu'
// le due province autonome, che hanno leggi proprie e nella norma stanno al posto della
// regione: elencarne venti lascerebbe fuori Trento o Bolzano. Il secondo elenca i comuni del
// solo ente scelto, ed e' anche la ragione per cui i dati sono divisi per ente: la pagina
// scarica una regione, non l'Italia.
const { ente: ENTE_DEFAULT, comune: COMUNE_DEFAULT } = luogoDefault(ANNO_CORRENTE)

// Finche' i dati non sono arrivati il calcolo usa il luogo predefinito, curato nelle
// costanti: `null` e' esattamente questo, e tiene la pagina utile anche se il caricamento
// fallisce del tutto.
let luogoScelto = null

document.querySelector('label[for="ente"]').textContent = etichettaEnte()
document.querySelector('label[for="comune"]').textContent = etichettaComune(ANNO_CORRENTE)
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

async function mostraComuniDi(slug, comuneDaSelezionare) {
  const { capoluogo } = await caricaEnte(ANNO_CORRENTE, slug)
  const comuni = comuniDellEnte(ANNO_CORRENTE, slug)
  riempiMenu(
    menuComune,
    // La provincia compare solo come etichetta, per distinguere i comuni omonimi — e sono
    // molti. Nel calcolo non entra mai: non e' un'entita' fiscale (CONTEXT.md).
    comuni.map(({ codice, nome, provincia }) => ({ valore: codice, testo: `${nome} (${provincia})` })),
    comuneDaSelezionare ?? capoluogo,
  )
  menuComune.disabled = false
  luogoScelto = menuComune.value
}

async function preparaSelettore() {
  const { enti } = await caricaIndice(ANNO_CORRENTE)
  riempiMenu(
    menuEnte,
    enti.map(({ slug, denominazione }) => ({ valore: slug, testo: denominazione })),
    ENTE_DEFAULT,
  )
  menuEnte.disabled = false
  await mostraComuniDi(ENTE_DEFAULT, COMUNE_DEFAULT)
}

// Cambiando ente il comune salta al capoluogo di quell'ente: cosi' lo stato «Lombardia +
// comune del Lazio» non e' rappresentabile dall'interfaccia, che e' il modo piu' solido di
// impedirlo — piu' di una validazione che lo scopre dopo.
menuEnte.addEventListener('change', async () => {
  menuComune.disabled = true
  await mostraComuniDi(menuEnte.value, null)
})

menuComune.addEventListener('change', () => {
  luogoScelto = menuComune.value
})

preparaSelettore().catch(() => {
  // I dati delle addizionali non sono arrivati. Il calcolo resta corretto sul luogo
  // predefinito, quindi la pagina non si blocca: si dice che il selettore non e'
  // disponibile e si va avanti, invece di negare un numero che sappiamo dare.
  menuEnte.disabled = true
  menuComune.disabled = true
  aiutoDelComune.textContent =
    'Non riesco a caricare l’elenco dei comuni: il calcolo usa il comune predefinito.'
})

// Un solo posto e un solo stile per tutti i messaggi bloccanti: quelli di forma
// (src/formato.js, «non riesco a leggere questo importo») e quelli di dominio
// (src/validazione.js, «la RAL deve essere maggiore di zero») arrivano da moduli diversi
// ma rispondono alla stessa domanda dell'utente — perche' non vedo un numero.
function mostraErrore(messaggio) {
  errore.textContent = messaggio
  errore.hidden = false
  // L'unico input che puo' essere invalido e' la RAL: le mensilita' fuori dominio non sono
  // rappresentabili dal segmented control.
  campoRal.setAttribute('aria-invalid', 'true')
  // Il risultato precedente sparisce: un numero accanto a un input invalido verrebbe
  // letto come vero. Lo scalino se ne va con lui perche' ci vive dentro; gli avvisi
  // stanno fuori dall'area risultati e vanno tolti a mano, altrimenti resterebbero in
  // pagina a commentare una RAL che non e' piu' quella scritta nel campo.
  risultato.hidden = true
  mostraAvvisi([])
}

function nascondiErrore() {
  errore.hidden = true
  errore.textContent = ''
  campoRal.removeAttribute('aria-invalid')
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
function creaVoce({ etichetta, valore, spiegazione, nota, fonte }) {
  const riga = document.createElement('li')
  riga.className = 'voce'

  const dettaglio = document.createElement('details')

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

function mostraRisultato(cascata) {
  const voci = presentaCascata(cascata)
  const testi = testiCascata(cascata)

  mostraAvvisi(cascata.avvisi)

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
  // ricreate a ogni calcolo, quindi nascono tutte chiuse anche dopo il secondo click.
  elencoVoci.replaceChildren(
    ...ORDINE_VOCI.map((voce) =>
      creaVoce({
        etichetta: testi[voce].etichetta,
        valore: voci[voce],
        spiegazione: testi[voce].spiegazione,
        nota: testi[voce].nota,
        fonte: testi[voce].fonte,
      }),
    ),
  )

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
campoRal.addEventListener('input', nascondiErrore)

form.addEventListener('submit', (evento) => {
  evento.preventDefault()

  const importo = interpretaImporto(campoRal.value)
  if (!importo.valido) {
    mostraErrore(importo.errore)
    return
  }

  try {
    mostraRisultato(
      calcolaCascata({
        ral: importo.valore,
        mensilita: leggiMensilita(),
        anno: ANNO_CORRENTE,
        comune: luogoScelto,
      }),
    )
    nascondiErrore()
  } catch (problema) {
    // Il motore rifiuta gli input fuori dominio con un messaggio gia' in lingua
    // (src/validazione.js): RAL <= 0 arriva qui, non dal parsing.
    mostraErrore(
      problema instanceof RangeError
        ? problema.message
        : 'non riesco a calcolare il netto con questo input',
    )
  }
})
