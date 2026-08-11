// Costanti fiscali e contributive per l'anno d'imposta 2025 (anno chiuso).
// Servono solo alla validazione contro una CU 2026 reale (redditi 2025):
// docs/ricerca/costanti-2025-e-protocollo-cu.md, issue #6.
// Divergenze attese dal set 2026: seconda aliquota IRPEF 35% (vs 33%), prima fascia
// 55.448 (vs 56.224), massimale 120.607 (vs 122.295), minimale 57,32 (vs 58,13).

export const COSTANTI_2025 = {
  anno: 2025,

  contributi: {
    aliquotaIvsDipendente: 0.0919, // FPLD, quota lavoratore - fonte: Istruzioni CU 2026 AdE, sez. dati previdenziali INPS, punto 6, pagg. 70-71, https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istruzioni_2026.pdf/4184818b-05a3-acce-5956-70811c7d2233, anno 2025
    aliquotaAggiuntiva: 0.01, // art. 3-ter D.L. 384/1992 conv. L. 438/1992 - fonte: Circolare INPS n. 26 del 30/01/2025, par. 5, https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2025/01/Circolare_14806/Allegati/15874_Circolare-numero-26-del-30-01-2025.pdf, anno 2025
    primaFasciaAnnua: 55448, // EUR - fonte: Circolare INPS n. 26 del 30/01/2025, par. 5, pag. 6, URL sopra, anno 2025
    massimaleAnnuo: 120607, // EUR (120.606,90 arrotondato all'unita) - fonte: Circolare INPS n. 26 del 30/01/2025, par. 6, pag. 6, URL sopra, anno 2025
    minimaleGiornaliero: 57.32, // EUR (9,5% del trattamento minimo mensile 603,40) - fonte: Circolare INPS n. 26 del 30/01/2025, par. 1, pag. 3, URL sopra, anno 2025
    giornateAnnoMinimale: 312, // stessa convenzione del set 2026
  },

  irpef: {
    // art. 11 c. 1 TUIR, testo vigente al 31/12/2025 (a regime da L. 207/2024 art. 1 c. 2 lett. a) - fonte:
    // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2025-12-31, anno 2025
    scaglioni: [
      { fino: 28000, aliquota: 0.23 },
      { fino: 50000, aliquota: 0.35 }, // nel 2025 il 35% era davvero in vigore (divergenza attesa dal 2026)
      { fino: Infinity, aliquota: 0.43 },
    ],
  },

  // art. 13 TUIR, testo vigente al 31/12/2025 - identico al 2026 - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2025-12-31, anno 2025
  detrazioneLavoroDipendente: {
    importoFascia1: 1955,
    minimo: 690,
    sogliaFascia1: 15000,
    baseFascia2: 1910,
    incrementoFascia2: 1190,
    sogliaFascia2: 28000,
    ampiezzaFascia2: 13000,
    baseFascia3: 1910,
    sogliaFascia3: 50000,
    ampiezzaFascia3: 22000,
    maggiorazione: 65,
    maggiorazioneDa: 25000,
    maggiorazioneFinoA: 35000,
  },

  // L. 207/2024 art. 1 c. 6, testo vigente al 31/12/2025 - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2025-12-31, anno 2025
  ulterioreDetrazione: {
    importo: 1000,
    sogliaInferiore: 20000,
    inizioDecalage: 32000,
    azzeramento: 40000,
  },

  // DL 3/2020 art. 1, testo vigente al 31/12/2025 - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1!vig=2025-12-31, anno 2025
  trattamentoIntegrativo: {
    importo: 1200,
    sogliaRedditoComplessivo: 15000,
    riduzioneDetrazione: 75, // L. 207/2024 art. 1 c. 3
  },

  // L. 207/2024 art. 1 cc. 4-5 - fonte: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1, anno 2025
  sommaIntegrativa: {
    sogliaRedditoComplessivo: 20000,
    fasce: [
      { fino: 8500, percentuale: 0.071 },
      { fino: 15000, percentuale: 0.053 },
      { fino: Infinity, percentuale: 0.048 },
    ],
  },

  // Lombardia 2025: quattro scaglioni previgenti mantenuti - fonte: MEF, aliquote addizionale regionale
  // Lombardia anno d'imposta 2025 (art. 72 c. 1 L.R. 10/2003),
  // https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10, anno 2025
  addizionaleRegionale: {
    scaglioni: [
      { fino: 15000, aliquota: 0.0123 },
      { fino: 28000, aliquota: 0.0158 },
      { fino: 50000, aliquota: 0.0172 },
      { fino: Infinity, aliquota: 0.0173 },
    ],
  },

  // Milano 2025: delibera C.C. n. 46 del 28/09/2020 (conferma d'ufficio MEF, pubbl. 20/12/2025) - fonte:
  // MEF, https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=2025&pr=MI&cc=F205&r=1, anno 2025
  addizionaleComunale: {
    aliquota: 0.008,
    esenzioneFinoA: 23000,
  },
}
