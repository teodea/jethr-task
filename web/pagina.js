// Lo strato di pagina: legge gli input, chiama i seam del motore, renderizza. Qui non vive
// nessuna decisione di dominio — mensilita' ammesse, anno d'imposta, testi, formati e
// regole di validazione arrivano tutti da src/. Se in questo file compare una soglia, un
// ordine o una stringa di dominio, e' nel posto sbagliato.

import { calcolaCascata } from '../src/cascata.js'
import { presentaCascata } from '../src/presentazione.js'
import { testiCascata, formattaEuro, formattaPercentuale, ORDINE_VOCI } from '../src/testi.js'
import { MENSILITA_AMMESSE, MENSILITA_DEFAULT } from '../src/validazione.js'
import { interpretaImporto, formattaImporto } from '../src/formato.js'
import { ANNO_CORRENTE } from '../src/costanti/index.js'

const form = document.querySelector('#calcolatore')
const campoRal = document.querySelector('#ral')
const gruppoMensilita = document.querySelector('#mensilita')
const errore = document.querySelector('#errore')
const risultato = document.querySelector('#risultato')
const eroi = document.querySelector('#eroi')
const elencoVoci = document.querySelector('#voci')

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
  // letto come vero.
  risultato.hidden = true
}

function nascondiErrore() {
  errore.hidden = true
  errore.textContent = ''
  campoRal.removeAttribute('aria-invalid')
}

function creaEroe({ etichetta, valore, spiegazione, incidenza, nota }) {
  const eroe = document.createElement('article')
  eroe.className = 'eroe'

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
function creaVoce({ etichetta, valore, spiegazione, nota }) {
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
    // qualcosa da segnalare, la pagina si limita a segnalarlo. Il segno e' decorativo e
    // resta fuori dall'albero di accessibilita': il testo della nota si spiega da solo.
    const avvertenza = document.createElement('p')
    avvertenza.className = 'voce-nota'

    const segno = document.createElement('span')
    segno.className = 'voce-segno'
    segno.textContent = '⚠️'
    segno.setAttribute('aria-hidden', 'true')

    avvertenza.append(segno, document.createTextNode(nota))
    corpo.append(avvertenza)
  }

  dettaglio.append(intestazione, corpo)
  riga.append(dettaglio)
  return riga
}

function mostraRisultato(cascata) {
  const voci = presentaCascata(cascata)
  const testi = testiCascata(cascata)

  eroi.replaceChildren(
    ...EROI.map((voce) =>
      creaEroe({
        etichetta: testi[voce].etichetta,
        valore: formattaEuro(voci[voce]),
        spiegazione: testi[voce].spiegazione,
        nota: testi[voce].nota,
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
      calcolaCascata({ ral: importo.valore, mensilita: leggiMensilita(), anno: ANNO_CORRENTE }),
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
