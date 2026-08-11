// Dominio di input della RAL (issue #7):
// - RAL > 0 obbligatoria: zero, negativi e non numerici sono errori bloccanti;
// - sotto il minimale contributivo annuo: avviso non bloccante (RAL full-time
//   implausibile, ma il calcolo resta eseguibile);
// - sopra il massimale contributivo: calcolo regolare (cambia solo la forma dei
//   contributi, non la validita' dell'input).
//
// Errori e avvisi finiscono sotto gli occhi dell'utente — sotto il campo i primi, nel banner
// giallo sopra i risultati i secondi — quindi seguono le stesse regole dei testi del motore
// (src/testi.js): seconda persona singolare, accenti e apostrofi veri, e ogni cifra scritta
// come la pagina la scrive altrove. Un «10665.60 EUR» in mezzo a una frase in italiano e' la
// stessa stringa buona per un log e cattiva per una persona.

import { formattaImporto } from './formato.js'

const euro = (valore) => `${formattaImporto(valore)} €`

export const MENSILITA_AMMESSE = [12, 13, 14] // docs/ASSUNZIONI.md: "Mensilita' come input (12/13/14), default 13"
export const MENSILITA_DEFAULT = 13 // il caso piu' diffuso per gli impiegati (docs/ASSUNZIONI.md)

export function minimaleContributivoAnnuo(costanti) {
  const c = costanti.contributi
  return c.minimaleGiornaliero * c.giornateAnnoMinimale
}

export function validaInput({ ral, mensilita = MENSILITA_DEFAULT }, costanti) {
  const errori = []
  const avvisi = []

  if (typeof ral !== 'number' || !Number.isFinite(ral)) {
    errori.push('non riesco a leggere la RAL: scrivila in cifre')
  } else if (ral <= 0) {
    errori.push('la RAL deve essere maggiore di zero: scrivi quanto guadagni lordo in un anno')
  } else {
    const minimale = minimaleContributivoAnnuo(costanti)
    if (ral < minimale) {
      // Non e' un errore ma un dubbio: il calcolo si mostra lo stesso, e il testo lo dice
      // esplicitamente, altrimenti un avviso accanto a un numero si legge come «questo
      // numero e' sbagliato». Gli estremi del minimale sono in chiaro perche' l'utente
      // possa riconoscere il proprio caso — un part-time, o un rapporto iniziato a marzo.
      avvisi.push(
        `La tua RAL è sotto il minimale contributivo annuo (${euro(minimale)}, cioè ` +
          `${euro(costanti.contributi.minimaleGiornaliero)} per ${costanti.contributi.giornateAnnoMinimale} giornate): ` +
          'per un tempo pieno su tutto l’anno è un importo implausibile. Il calcolo lo trovi ' +
          'comunque, ma ricontrolla la cifra che hai scritto.',
      )
    }
  }

  if (!MENSILITA_AMMESSE.includes(mensilita)) {
    errori.push(`scegli le mensilità fra ${MENSILITA_AMMESSE.join(', ')}`)
  }

  return { valida: errori.length === 0, errori, avvisi }
}
