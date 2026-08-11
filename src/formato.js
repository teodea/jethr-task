// Il campo RAL parla italiano (issue #12): interpretazione tollerante di quello che un
// utente scrive davvero — «30000», «30.000», «30.000,50», con o senza spazi e simbolo di
// valuta — e riformattazione in stile it-IT.
//
// Due regole guidano tutto il modulo:
//
// 1. Tollerante sulle forme, intransigente sulle ambiguita'. «30,000» in italiano vale
//    trenta, in inglese trentamila: mille volte di differenza su un numero che l'utente
//    legge come uno stipendio. Indovinare con un'euristica sarebbe il modo piu' silenzioso
//    di sbagliare, quindi il caso si rifiuta e si spiega. Vale anche per il formato inglese
//    completo («30,000.50»): interpretarlo insegnerebbe all'utente una convenzione che il
//    resto della pagina non usa.
// 2. Il parsing non conosce il dominio. Qui si decide solo se una stringa e' un numero e
//    quale; che una RAL debba essere > 0 lo dice `validaInput` (src/validazione.js), che
//    resta l'unico posto in cui vive quella regola. Un «-30.000» esce da qui interpretato
//    e viene fermato dopo.
//
// Funzioni pure, nessun DOM: la pagina chiama, non decide.

// Il separatore delle migliaia in it-IT e' il punto, ma un testo incollato porta con se'
// spazi di ogni specie (\s in JS copre anche lo spazio unificatore e quello stretto, che
// altre locale usano per raggruppare) e il simbolo di valuta che il campo mostra gia'
// accanto all'input.
const RUMORE = /[\s€]/g

const SOLO_CIFRE = /^\d+$/

const MESSAGGIO_VUOTO = 'inserisci la RAL'

const MESSAGGIO_FORMA =
  'non riesco a leggere questo importo: usa le cifre, il punto per le migliaia e la virgola ' +
  'per i decimali (per esempio 30.000 oppure 30.000,50)'

// L'ambiguita' si spiega mostrando all'utente le due letture, scritte con la sua stessa
// cifra: un messaggio generico lo lascerebbe a indovinare quale delle due volevamo.
function messaggioAmbiguo(intero, decimali) {
  return (
    `«${intero},${decimali}» si può leggere in due modi: in italiano la virgola separa i ` +
    `decimali, ma tre cifre dopo la virgola sembrano migliaia. Scrivi «${intero}.${decimali}» ` +
    `se intendi le migliaia, «${intero},${decimali.slice(0, 2)}» se intendi i decimali.`
  )
}

const rifiuta = (errore) => ({ valido: false, valore: null, errore })
const accetta = (valore) => ({ valido: true, valore, errore: null })

// «1.234.567» si', «12.34.567» e «1234.567» no: il primo gruppo ha da 1 a 3 cifre, tutti
// gli altri esattamente 3. E' la regola che distingue il punto delle migliaia dal punto
// decimale senza doverlo chiedere all'utente.
function raggruppamentoValido(gruppi) {
  return (
    gruppi.length > 1 &&
    /^\d{1,3}$/.test(gruppi[0]) &&
    gruppi.slice(1).every((gruppo) => /^\d{3}$/.test(gruppo))
  )
}

// La parte intera, che puo' essere raggruppata («30.000») o nuda («30000»), ridotta alle
// sole cifre. null se non e' ne' l'una ne' l'altra cosa.
function cifreParteIntera(intero) {
  if (intero === '') return '0' // «,50» e' mezzo euro: la parte intera sottintesa e' zero
  if (SOLO_CIFRE.test(intero)) return intero
  const gruppi = intero.split('.')
  return raggruppamentoValido(gruppi) ? gruppi.join('') : null
}

/**
 * Interpreta un importo scritto da un utente italiano.
 * @returns {{valido: true, valore: number, errore: null} | {valido: false, valore: null, errore: string}}
 */
export function interpretaImporto(testo) {
  if (typeof testo !== 'string') return rifiuta(MESSAGGIO_FORMA)

  const pulito = testo.replace(RUMORE, '')
  if (pulito === '') return rifiuta(MESSAGGIO_VUOTO)

  const segno = pulito.startsWith('-') ? -1 : 1
  const corpo = pulito.replace(/^[+-]/, '')
  if (!/^[\d.,]+$/.test(corpo)) return rifiuta(MESSAGGIO_FORMA)

  const virgole = corpo.split(',').length - 1
  if (virgole > 1) return rifiuta(MESSAGGIO_FORMA)

  if (virgole === 1) {
    const [intero, decimali] = corpo.split(',')
    // Il formato inglese completo («30,000.50») cade qui: dopo la virgola c'e' un punto.
    if (!SOLO_CIFRE.test(decimali)) return rifiuta(MESSAGGIO_FORMA)
    if (!intero.includes('.') && decimali.length === 3) {
      return rifiuta(messaggioAmbiguo(intero, decimali))
    }
    const cifre = cifreParteIntera(intero)
    return cifre === null ? rifiuta(MESSAGGIO_FORMA) : accetta(segno * Number(`${cifre}.${decimali}`))
  }

  if (!corpo.includes('.')) {
    return SOLO_CIFRE.test(corpo) ? accetta(segno * Number(corpo)) : rifiuta(MESSAGGIO_FORMA)
  }

  // Nessuna virgola ma almeno un punto: o sono le migliaia, o e' il punto decimale di chi
  // scrive dal tastierino. Le due letture non si sovrappongono mai — un raggruppamento
  // valido finisce sempre con tre cifre, un decimale in euro ne ha al massimo due.
  const gruppi = corpo.split('.')
  if (raggruppamentoValido(gruppi)) return accetta(segno * Number(gruppi.join('')))
  if (gruppi.length === 2 && SOLO_CIFRE.test(gruppi[0]) && /^\d{1,2}$/.test(gruppi[1])) {
    return accetta(segno * Number(corpo))
  }
  return rifiuta(MESSAGGIO_FORMA)
}

// `useGrouping: 'always'` perche' in it-IT il CLDR non raggruppa sotto le cinque cifre:
// senza, una RAL di 1.000 tornerebbe nel campo come «1000» dopo essere stata scritta
// «1.000». Stessa scelta, stessa ragione, di src/testi.js.
const INTERO = new Intl.NumberFormat('it-IT', {
  maximumFractionDigits: 0,
  useGrouping: 'always',
})

const CON_CENTESIMI = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: 'always',
})

/**
 * Riformatta un importo in stile italiano. I centesimi compaiono solo se ci sono: una RAL
 * di 30.000 riscritta «30.000,00» suggerirebbe una precisione che l'utente non ha inserito.
 */
export function formattaImporto(valore) {
  return Number.isInteger(valore) ? INTERO.format(valore) : CON_CENTESIMI.format(valore)
}
