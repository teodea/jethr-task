// Dominio di input della RAL (issue #7):
// - RAL > 0 obbligatoria: zero, negativi e non numerici sono errori bloccanti;
// - sotto il minimale contributivo annuo: avviso non bloccante (RAL full-time
//   implausibile, ma il calcolo resta eseguibile);
// - sopra il massimale contributivo: calcolo regolare (cambia solo la forma dei
//   contributi, non la validita' dell'input).
//
// Dominio di input del periodo di lavoro (issue #22): due date leggibili, dentro l'anno
// d'imposta, nell'ordine giusto. Tutte e tre errori bloccanti — di un rapporto che finisce
// prima di cominciare non esiste un netto da mostrare accanto all'errore.
//
// Errori e avvisi finiscono sotto gli occhi dell'utente — sotto il campo i primi, nel banner
// giallo sopra i risultati i secondi — quindi seguono le stesse regole dei testi del motore
// (src/testi.js): seconda persona singolare, accenti e apostrofi veri, e ogni cifra scritta
// come la pagina la scrive altrove. Un «10665.60 EUR» in mezzo a una frase in italiano e' la
// stessa stringa buona per un log e cattiva per una persona.

import { formattaImporto } from './formato.js'
import { dataValida, annoDellaData, giorniDelRapporto, periodoRichiesto } from './periodo.js'

const euro = (valore) => `${formattaImporto(valore)} €`

export const MENSILITA_AMMESSE = [12, 13, 14] // docs/ASSUNZIONI.md: "Mensilita' come input (12/13/14), default 13"
export const MENSILITA_DEFAULT = 13 // il caso piu' diffuso per gli impiegati (docs/ASSUNZIONI.md)

export function minimaleContributivoAnnuo(costanti) {
  const c = costanti.contributi
  return c.minimaleGiornaliero * c.giornateAnnoMinimale
}

/**
 * Il periodo di lavoro, validato da solo: la pagina lo chiama per i due campi data mentre
 * l'utente li tocca, senza passare per la RAL — come gia' fa con `interpretaImporto` per il
 * campo della RAL. Gli stessi errori rientrano da `validaInput`, che resta la porta unica
 * del motore.
 *
 * Le date fuori dall'anno d'imposta sono un errore e non un troncamento silenzioso: un
 * rapporto che comincia nel 2025 e finisce nel 2026 ha due anni d'imposta e due cascate, e
 * il prototipo ne calcola una sola (docs/ASSUNZIONI.md).
 */
export function validaPeriodo({ dataInizio, dataFine }, costanti) {
  const errori = []

  for (const [estremo, valore] of [
    ['inizio', dataInizio],
    ['fine', dataFine],
  ]) {
    if (!dataValida(valore)) {
      errori.push(`non riesco a leggere la data di ${estremo} del rapporto`)
    } else if (annoDellaData(valore) !== costanti.anno) {
      errori.push(
        `la data di ${estremo} del rapporto deve cadere nell’anno d’imposta ${costanti.anno}`,
      )
    }
  }

  // Solo quando entrambe le date esistono: il confronto fra una data e un refuso non dice
  // niente, e due errori sullo stesso campo si leggono come due problemi diversi.
  if (errori.length === 0 && giorniDelRapporto(dataInizio, dataFine) === null) {
    errori.push('la data di fine del rapporto non può venire prima di quella di inizio')
  }

  return { valida: errori.length === 0, errori }
}

export function validaInput({ ral, mensilita = MENSILITA_DEFAULT, dataInizio, dataFine }, costanti) {
  const errori = []
  const avvisi = []

  if (typeof ral !== 'number' || !Number.isFinite(ral)) {
    errori.push('non riesco a leggere la RAL: scrivila in cifre')
  } else if (ral <= 0) {
    errori.push('la RAL deve essere maggiore di zero: scrivi quanto guadagni lordo in un anno')
  } else {
    const minimale = minimaleContributivoAnnuo(costanti)
    // Il confronto sta sulla RAL **pattuita**, non su quello che si percepisce nel periodo, e
    // con le date in input la differenza smette di essere teorica: chi ha RAL 30.000 dal
    // 1° luglio percepisce ~15.000, sotto il minimale annualizzato, ma la sua retribuzione
    // giornaliera resta 30.000/312 = 96,15 EUR, ben sopra i 58,13 di legge. Il minimale e' un
    // limite **giornaliero** e si fraziona da se' con la durata del rapporto: la durata, da
    // sola, non lo fa mordere (docs/ricerca/giorni-del-rapporto-e-ragguaglio-al-periodo.md,
    // par. 5.3). Confrontare il percepito col minimale annuo avviserebbe ogni rapporto breve.
    if (ral < minimale) {
      // Non e' un errore ma un dubbio: il calcolo si mostra lo stesso, e il testo lo dice
      // esplicitamente, altrimenti un avviso accanto a un numero si legge come «questo
      // numero e' sbagliato». Gli estremi del minimale sono in chiaro perche' l'utente
      // possa riconoscere il proprio caso — un part-time, per esempio.
      avvisi.push(
        `La tua RAL è sotto il minimale contributivo annuo (${euro(minimale)}, cioè ` +
          `${euro(costanti.contributi.minimaleGiornaliero)} per ${costanti.contributi.giornateAnnoMinimale} giornate): ` +
          'per un tempo pieno è un importo implausibile, e resta tale anche se il rapporto dura ' +
          'pochi mesi — qui si guarda la RAL scritta in contratto, non quanto percepisci nel ' +
          'periodo. Il calcolo lo trovi comunque, ma ricontrolla la cifra che hai scritto.',
      )
    }
  }

  if (!MENSILITA_AMMESSE.includes(mensilita)) {
    errori.push(`scegli le mensilità fra ${MENSILITA_AMMESSE.join(', ')}`)
  }

  const periodo = periodoRichiesto({ dataInizio, dataFine, anno: costanti.anno })
  errori.push(...validaPeriodo(periodo, costanti).errori)

  return { valida: errori.length === 0, errori, avvisi }
}
