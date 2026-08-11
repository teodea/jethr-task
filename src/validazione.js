// Dominio di input della RAL (issue #7):
// - RAL > 0 obbligatoria: zero, negativi e non numerici sono errori bloccanti;
// - sotto il minimale contributivo annuo: avviso non bloccante (RAL full-time
//   implausibile, ma il calcolo resta eseguibile);
// - sopra il massimale contributivo: calcolo regolare (cambia solo la forma dei
//   contributi, non la validita' dell'input).

export const MENSILITA_AMMESSE = [12, 13, 14] // docs/ASSUNZIONI.md: "Mensilita' come input (12/13/14), default 13"

export function minimaleContributivoAnnuo(costanti) {
  const c = costanti.contributi
  return c.minimaleGiornaliero * c.giornateAnnoMinimale
}

export function validaInput({ ral, mensilita = 13 }, costanti) {
  const errori = []
  const avvisi = []

  if (typeof ral !== 'number' || !Number.isFinite(ral)) {
    errori.push('la RAL deve essere un numero')
  } else if (ral <= 0) {
    errori.push('la RAL deve essere maggiore di zero')
  } else {
    const minimale = minimaleContributivoAnnuo(costanti)
    if (ral < minimale) {
      avvisi.push(
        `RAL sotto il minimale contributivo annuo (${minimale.toFixed(2)} EUR = ` +
          `${costanti.contributi.minimaleGiornaliero.toFixed(2)} x ${costanti.contributi.giornateAnnoMinimale} giornate): ` +
          'implausibile per un tempo pieno per l\'anno intero',
      )
    }
  }

  if (!MENSILITA_AMMESSE.includes(mensilita)) {
    errori.push(`le mensilita' devono essere una fra ${MENSILITA_AMMESSE.join(', ')}`)
  }

  return { valida: errori.length === 0, errori, avvisi }
}
