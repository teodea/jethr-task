// Costanti fiscali e contributive per l'anno d'imposta 2026.
// Ogni valore porta accanto la fonte primaria e l'anno (regola del repo).
// Ricerche di provenienza: docs/ricerca/irpef-scaglioni-e-detrazione-lavoro-dipendente.md,
// contributi-dipendente-aliquote-minimale-massimale.md, addizionali-regionale-comunale.md,
// trattamento-integrativo-somma-integrativa-ulteriore-detrazione.md

export const COSTANTI_2026 = {
  anno: 2026,

  contributi: {
    aliquotaIvsDipendente: 0.0919, // FPLD, quota lavoratore (8,89% + 0,30 dal 1/1/2007) - fonte: Circolare INPS n. 23 del 24/01/2007 (art. 1 c. 769 L. 296/2006), https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?sVirtuaLURL=%2Fcircolari%2FCircolare+numero+23+del+24-1-2007.htm, vigente 2026
    aliquotaAggiuntiva: 0.01, // sulla quota oltre la prima fascia - fonte: art. 3-ter D.L. 19/09/1992 n. 384 conv. L. 438/1992, https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:1992-09-19;384~art3ter, anno 1992
    primaFasciaAnnua: 56224, // EUR - fonte: Circolare INPS n. 6 del 30/01/2026, par. 5, https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html, anno 2026
    massimaleAnnuo: 122295, // EUR, solo iscritti post 31/12/1995 (122.295,40 arrotondato all'unita) - fonte: Circolare INPS n. 6 del 30/01/2026, par. 6 (art. 2 c. 18 L. 335/1995), URL sopra, anno 2026
    massimaleSoloIscrittiDopo: 1995, // il massimale opera per i soli iscritti dopo il 31/12/1995: e' la condizione della platea, non un valore d'anno (non si rivaluta) - fonte: art. 2 c. 18 L. 335/1995, https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335~art2, anno 1995
    minimaleGiornaliero: 58.13, // EUR (9,5% del trattamento minimo mensile 611,85) - fonte: Circolare INPS n. 6 del 30/01/2026, par. 1, URL sopra, anno 2026
    giornateAnnoMinimale: 312, // 52 settimane x 6 giornate: convenzione usata in docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md, par. 3.1, per annualizzare il minimale giornaliero
  },

  irpef: {
    // art. 11 c. 1 TUIR (DPR 917/1986), testo vigente 2026 - fonte: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-12-31, anno 2026
    scaglioni: [
      { fino: 28000, aliquota: 0.23 },
      { fino: 50000, aliquota: 0.33 }, // 33% (era 35% nel 2025): L. 199/2025 art. 1 c. 3, GU S.O. n. 42/L alla GU SG n. 301 del 30/12/2025, https://www.gazzettaufficiale.it/eli/gu/2025/12/30/301/so/42/sg/pdf, dal 1/1/2026
      { fino: Infinity, aliquota: 0.43 },
    ],
  },

  // art. 13 TUIR, testo vigente 2026 (importi a regime da L. 207/2024 art. 1 c. 2) - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-12-31, anno 2026
  detrazioneLavoroDipendente: {
    importoFascia1: 1955, // se RC <= 15.000 (c. 1 lett. a)
    minimo: 690, // minimo effettivo per tempo indeterminato (c. 1 lett. a)
    sogliaFascia1: 15000,
    baseFascia2: 1910, // c. 1 lett. b: 1.910 + 1.190 x (28.000 - RC) / 13.000
    incrementoFascia2: 1190,
    sogliaFascia2: 28000,
    ampiezzaFascia2: 13000,
    baseFascia3: 1910, // c. 1 lett. c: 1.910 x (50.000 - RC) / 22.000
    sogliaFascia3: 50000,
    ampiezzaFascia3: 22000,
    maggiorazione: 65, // c. 1.1: +65 se 25.000 < RC <= 35.000
    maggiorazioneDa: 25000,
    maggiorazioneFinoA: 35000,
    // c. 6: il quoziente "si assume nelle prime quattro cifre decimali" (troncamento) -
    // regola sostanziale recepita nel calcolo (docs/ricerca/arrotondamenti-e-quadratura.md, par. 5)
  },

  // L. 207/2024 art. 1 c. 6, vigente per il 2026 (abrogazione D.Lgs. 117/2026 dal 1/1/2027) - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-12-31, anno 2026
  ulterioreDetrazione: {
    importo: 1000, // se 20.000 < RC <= 32.000
    sogliaInferiore: 20000,
    inizioDecalage: 32000, // 1.000 x (40.000 - RC) / 8.000 fra 32.000 e 40.000
    azzeramento: 40000,
  },

  // DL 3/2020 art. 1 conv. L. 21/2020, come modificato da L. 207/2024 art. 1 c. 3 - fonte:
  // https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1!vig=2026-12-31, anno 2026
  trattamentoIntegrativo: {
    importo: 1200, // EUR/anno, rapportato al periodo (anno intero nel prototipo)
    sogliaRedditoComplessivo: 15000, // spetta se RC <= 15.000 (la fascia 15-28k richiede detrazioni extra art. 13 c. 1, mai presenti nel perimetro del prototipo)
    riduzioneDetrazione: 75, // capienza: imposta lorda > detrazione art. 13 c. 1 - 75 (L. 207/2024 art. 1 c. 3)
  },

  // L. 207/2024 art. 1 cc. 4-5 - fonte: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-12-31, anno 2026
  sommaIntegrativa: {
    sogliaRedditoComplessivo: 20000, // soglia secca sul reddito complessivo
    fasce: [
      { fino: 8500, percentuale: 0.071 }, // percentuale sul reddito di lavoro dipendente
      { fino: 15000, percentuale: 0.053 },
      { fino: Infinity, percentuale: 0.048 },
    ],
  },

  // Le due addizionali del LUOGO PREDEFINITO. Il selettore le sostituisce con quelle del
  // comune scelto, lette dai JSON importati (src/luoghi.js); queste restano il caso curato
  // a mano, con la fonte accanto al valore, e sono l'oracolo contro cui un test confronta
  // l'output dello script di importazione (test/luoghi.test.js). Se il MEF pubblicasse per
  // Milano una delibera diversa, il confronto fallirebbe invece di lasciar divergere in
  // silenzio il percorso curato e quello importato.
  //
  // La forma e' la stessa per entrambe — `{ scaglioni, esenzioneFinoA }`, piu' `varianti` e
  // `detrazioni` dove un ente le prevede — perche' il motore le calcola con una funzione
  // sola (`addizionale`, src/cascata.js). Restano due voci distinte in cascata: il glossario
  // vieta di trattarle come un'unica addizionale, e hanno davvero destinatario, base
  // normativa e delibere proprie. Forma stabilita dalla ricerca della issue #18,
  // docs/ricerca/modello-dati-addizionali-italia.md, par. 6.

  // Lombardia: art. 72 c. 1 L.R. 10/2003 (mod. L.R. 5/2022), scaglioni progressivi - fonte:
  // MEF, aliquote addizionale regionale Lombardia anno d'imposta 2026,
  // https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10, anno 2026
  addizionaleRegionale: {
    ente: 'lombardia',
    denominazione: 'Regione Lombardia',
    scaglioni: [
      { fino: 15000, aliquota: 0.0123 },
      { fino: 28000, aliquota: 0.0158 },
      { fino: 50000, aliquota: 0.0172 },
      { fino: Infinity, aliquota: 0.0173 },
    ],
    esenzioneFinoA: null, // la Lombardia non prevede esenzione: sei enti su ventuno lo fanno
    fonte: {
      citazione:
        'MEF, addizionale regionale IRPEF della Lombardia, anno d’imposta 2026 (art. 72 c. 1 L.R. 10/2003)',
      url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10',
    },
  },

  // Milano: delibera C.C. n. 46 del 28/09/2020, prorogata per il 2026 (nessuna delibera 2026 al 11/08/2026,
  // art. 1 c. 169 L. 296/2006) - fonte: MEF, addizionale comunale Milano (cod. F205),
  // https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1, anno 2026 (proroga)
  addizionaleComunale: {
    codice: 'F205', // codice catastale: la chiave con cui il MEF indicizza i comuni, e quella del selettore
    nome: 'Milano',
    provincia: 'MI',
    scaglioni: [{ fino: Infinity, aliquota: 0.008 }], // aliquota unica = un solo scaglione, aperto
    esenzioneFinoA: 23000, // soglia secca: sopra, l'aliquota si applica all'INTERO imponibile (D.Lgs. 360/1998 art. 1 c. 3-bis)
    nota: null, // il testo libero delle esenzioni non universali: Milano non ne ha
    fonte: {
      citazione:
        'MEF, addizionale comunale IRPEF di Milano (cod. F205): delibera C.C. n. 46 del 28/09/2020, prorogata per il 2026',
      url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1',
    },
  },
}

// Le fonti primarie come dato, una per gruppo di costanti: la pagina le mostra in fondo a
// ogni riga espansa della cascata, come link cliccabile (issue #14). Vivono qui, nello
// stesso file dei valori, per la stessa ragione per cui ci vivono i commenti - un file di
// fonti separato divergerebbe al primo aggiornamento.
//
// Il motore non le legge: continua a leggere i valori nudi di COSTANTI_2026. Le legge
// src/testi.js, che sa quale gruppo sta dietro ogni voce della cascata.
//
// Quattro chiavi non corrispondono a un gruppo di costanti (redditoLavoroDipendente,
// imponibile, impostaNetta, ritenutaEConguaglio): sono le voci che il motore deriva per
// somma o differenza senza usare alcuna costante d'anno. La regola che le governa sta
// comunque in una norma, e finora era l'unico pezzo di cascata senza fonte scritta da
// nessuna parte.
//
// Dove un gruppo poggia su piu' documenti - i contributi: circolare dell'anno per soglie e
// massimali, norme istitutive per le aliquote - la citazione porta quello che certifica i
// valori che cambiano ogni anno. Gli altri restano nei commenti riga per riga
// (semplificazione registrata in docs/ASSUNZIONI.md).
export const FONTI_2026 = {
  redditoLavoroDipendente: {
    citazione: 'art. 51 c. 1 TUIR (DPR 917/1986), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51!vig=2026-12-31',
  },

  contributi: {
    citazione: 'Circolare INPS n. 6 del 30/01/2026 (aliquote, minimale e massimale per il 2026)',
    url: 'https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html',
  },

  // "I contributi previdenziali e assistenziali versati dal datore di lavoro o dal
  // lavoratore in ottemperanza a disposizioni di legge" non concorrono al reddito: e' la
  // norma dietro l'identita' imponibile fiscale = RAL - contributi (src/cascata.js).
  imponibile: {
    citazione: 'art. 51 c. 2 lett. a TUIR (DPR 917/1986), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51!vig=2026-12-31',
  },

  irpef: {
    citazione: 'art. 11 c. 1 TUIR (DPR 917/1986), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-12-31',
  },

  // "L'imposta netta e' determinata operando sull'imposta lorda, fino alla concorrenza del
  // suo ammontare, le detrazioni": la norma dietro la capienza, cioe' dietro il fatto che
  // uno sconto che avanza non diventa un credito.
  impostaNetta: {
    citazione: 'art. 11 c. 3 TUIR (DPR 917/1986), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-12-31',
  },

  detrazioneLavoroDipendente: {
    citazione: 'art. 13 cc. 1 e 1.1 TUIR (DPR 917/1986), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-12-31',
  },

  ulterioreDetrazione: {
    citazione: 'L. 207/2024 art. 1 c. 6, vigente per il 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-12-31',
  },

  trattamentoIntegrativo: {
    citazione: 'DL 3/2020 art. 1 (conv. L. 21/2020), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1!vig=2026-12-31',
  },

  sommaIntegrativa: {
    citazione: 'L. 207/2024 art. 1 cc. 4-5',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-12-31',
  },

  // Le due addizionali non stanno in questa mappa: la loro fonte dipende dal LUOGO, non
  // dall'anno, quindi viaggia dentro la regola stessa (`addizionaleRegionale.fonte` e
  // `addizionaleComunale.fonte` qui sopra, e il campo omonimo nei JSON importati). La
  // scheda MEF e' indicizzata per codice catastale: parametrizzare il comune parametrizza
  // il link alla fonte, senza una seconda tabella da tenere allineata a ottomila voci.

  // Il netto annuo e quello mensile non hanno una costante propria: sono il risultato della
  // cascata. La norma che li governa e' quella del sostituto d'imposta - ritenuta a ogni
  // periodo di paga (c. 1) e conguaglio di fine anno (c. 3) - ed e' anche la fonte della
  // frase che la pagina ripete: nessuna busta reale coincide con la media mensile.
  ritenutaEConguaglio: {
    citazione: 'art. 23 DPR 600/1973 (ritenuta e conguaglio di fine anno), testo vigente 2026',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1973-09-29;600~art23!vig=2026-12-31',
  },
}
