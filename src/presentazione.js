// Presentazione della cascata: arrotondamento ai centesimi SOLO qui, con quadratura
// per differenza su una voce designata — le voci esposte devono sommare esattamente al
// netto mostrato (decisione di prodotto della issue #5). Voce designata: i contributi a
// carico del dipendente, l'unica sempre strettamente positiva (RAL > 0 => contributi > 0),
// quindi mai portata sotto zero dai pochi centesimi di scarto.

function arrotondaCentesimi(valore) {
  return Math.round(valore * 100) / 100
}

export function presentaCascata(cascata) {
  const voci = {
    ral: arrotondaCentesimi(cascata.ral),
    contributiDipendente: arrotondaCentesimi(cascata.contributiDipendente),
    imponibileFiscale: arrotondaCentesimi(cascata.imponibileFiscale),
    irpefLorda: arrotondaCentesimi(cascata.irpefLorda),
    // Le due detrazioni esposte come voci proprie: stanno FUORI dalla quadratura del netto
    // (non entrano nella somma sotto) perche' l'aggregato che abbatte davvero l'imposta e'
    // detrazioniEffettive. In incapienza la loro somma e' maggiore: non e' un errore di
    // arrotondamento ma la parte di sconto che si perde, ed e' cio' che la nota su
    // detrazioniEffettive dice all'utente (src/testi.js).
    detrazioneLavoroDipendente: arrotondaCentesimi(cascata.detrazioneLavoroDipendente),
    ulterioreDetrazione: arrotondaCentesimi(cascata.ulterioreDetrazione),
    detrazioniEffettive: arrotondaCentesimi(cascata.detrazioniEffettive),
    irpefNetta: arrotondaCentesimi(cascata.irpefNetta),
    addizionaleRegionale: arrotondaCentesimi(cascata.addizionaleRegionale),
    addizionaleComunale: arrotondaCentesimi(cascata.addizionaleComunale),
    trattamentoIntegrativo: arrotondaCentesimi(cascata.trattamentoIntegrativo),
    sommaIntegrativa: arrotondaCentesimi(cascata.sommaIntegrativa),
    nettoAnnuo: arrotondaCentesimi(cascata.nettoAnnuo),
    nettoMensile: arrotondaCentesimi(cascata.nettoMensile),
  }

  // Quadratura: ral - contributi - irpefNetta - addizionali + erogazioni = nettoAnnuo,
  // esattamente, sui valori esposti. Lo scarto di arrotondamento (fino a 2 centesimi,
  // registrato in docs/ASSUNZIONI.md) va sui contributi.
  const sommaVoci =
    voci.ral -
    voci.contributiDipendente -
    voci.irpefNetta -
    voci.addizionaleRegionale -
    voci.addizionaleComunale +
    voci.trattamentoIntegrativo +
    voci.sommaIntegrativa
  const scarto = arrotondaCentesimi(sommaVoci - voci.nettoAnnuo)
  voci.contributiDipendente = arrotondaCentesimi(voci.contributiDipendente + scarto)

  // Anche le grandezze intermedie derivabili per sottrazione devono tornare sui valori
  // esposti (RAL - contributi = imponibile; lorda - detrazioni = netta): si derivano
  // per differenza invece di arrotondarle indipendentemente. Nessuna delle due entra
  // nella somma del netto: la quadratura sopra resta intatta.
  voci.imponibileFiscale = arrotondaCentesimi(voci.ral - voci.contributiDipendente)
  voci.detrazioniEffettive = arrotondaCentesimi(voci.irpefLorda - voci.irpefNetta)

  return voci
}
