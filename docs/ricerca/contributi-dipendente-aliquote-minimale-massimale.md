# Ricerca: aliquota contributiva a carico del dipendente (impiegato) — minimale, aliquota aggiuntiva 1%, massimale

Anno di riferimento: 2026
Data della ricerca: 2026-08-11
Issue di origine: `teodea/jethr-task#2`

## Domanda

Qual è l'aliquota contributiva **a carico del lavoratore** per un impiegato a tempo
indeterminato nel settore privato? E quali sono i **tre punti di rottura della
proporzionalità**: il minimale di retribuzione imponibile; l'aliquota aggiuntiva
sulla quota eccedente la prima fascia di retribuzione pensionabile (art. 3-ter
D.L. 384/1992); il massimale contributivo (art. 2, c. 18, L. 335/1995) con la
platea a cui si applica? Utile anche l'aliquota a carico del datore per una
eventuale vista "costo azienda".

## Sintesi operativa (per la cascata RAL → netto)

Per l'impiegato del nostro dominio (privato, tempo indeterminato, tempo pieno, un
solo rapporto per l'intero 2026, iscritto a forme pensionistiche dopo il
31/12/1995):

| Voce | Valore 2026 | Fonte |
|---|---|---|
| Aliquota IVS a carico del dipendente (FPLD) | **9,19%** | Circolare INPS n. 23 del 24/01/2007 (in attuazione dell'art. 1, c. 769, L. 296/2006) |
| Eventuale contributo CIGS a carico del dipendente | **+0,30%** (solo aziende soggette a CIGS) | Art. 23, D.lgs. 148/2015 |
| Aliquota aggiuntiva oltre la prima fascia | **1%** sulla quota eccedente | Art. 3-ter, D.L. 384/1992 conv. L. 438/1992 |
| Prima fascia di retribuzione pensionabile | **56.224,00 EUR/anno** (mensilizzato **4.685,00 EUR**) | Circolare INPS n. 6 del 30/01/2026, par. 5 |
| Massimale annuo base contributiva e pensionabile | **122.295,00 EUR** (valore esatto 122.295,40, arrotondato all'unità) | Circolare INPS n. 6 del 30/01/2026, par. 6 |
| Minimale di retribuzione giornaliera | **58,13 EUR** (9,5% di 611,85 EUR) | Circolare INPS n. 6 del 30/01/2026, par. 1 |

Formula risultante (RAL sotto il massimale):

```
contributiDipendente = 9,19% × RAL + 1% × max(0, RAL − 56.224)      // + 0,30% × RAL se azienda soggetta a CIGS
imponibileFiscale    = RAL − contributiDipendente
```

Sopra il massimale (solo iscritti post-1995): sia il 9,19% sia l'1% si fermano a
122.295,00 EUR.

## 1. Aliquota a carico del dipendente

**9,19%** è l'aliquota IVS (invalidità, vecchiaia e superstiti) a carico del
lavoratore dipendente iscritto al Fondo pensioni lavoratori dipendenti (FPLD).

- Genesi normativa: l'aliquota complessiva di finanziamento del FPLD è stata
  elevata al **32%** dal 1° gennaio 1996 dall'art. 3, c. 23, L. 8 agosto 1995,
  n. 335 (il c. 24 dispone poi aumenti di 0,35 punti a carico del dipendente e
  0,35 a carico del datore) — fonte: Normattiva, testo vigente,
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335~art3>, anno 1995.
- L'art. 1, c. 769, L. 27 dicembre 2006, n. 296 (finanziaria 2007) ha aumentato
  di **0,30 punti percentuali** l'aliquota a carico del lavoratore dal 1° gennaio
  2007: la quota dipendente FPLD è così passata **da 8,89% a 9,19%**, con il
  vincolo che la contribuzione pensionistica complessiva (datore + lavoratore)
  non superi il **33%** — fonte: Circolare INPS n. 23 del 24/01/2007,
  <https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?sVirtuaLURL=%2Fcircolari%2FCircolare+numero+23+del+24-1-2007.htm>, anno 2007.
- Il valore è tuttora vigente: la Circolare INPS n. 6/2026 (par. 5) presuppone
  per la generalità dei dipendenti aliquote a carico del lavoratore **inferiori
  al 10%** (condizione di applicabilità dell'aliquota aggiuntiva, vedi § 3.2).

**Variante da registrare in `docs/ASSUNZIONI.md`**: se l'azienda rientra nel
campo di applicazione della CIGS, al dipendente è trattenuto anche lo **0,30%**
(contribuzione CIGS complessiva 0,90%, di cui 0,60% a carico del datore e 0,30%
a carico del lavoratore) — fonte: art. 23, D.lgs. 14 settembre 2015, n. 148,
Normattiva, <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-09-14;148~art23>, anno 2015.
Il totale a carico del dipendente diventa in quel caso **9,49%**. Il brief non
dice nulla sull'azienda (settore, organico), quindi la scelta tra 9,19% e 9,49%
è un'assunzione legittima, non un dato reperibile.

### I contributi a carico del dipendente riducono l'imponibile fiscale

Confermato. Art. 51, c. 2, lett. a), D.P.R. 22 dicembre 1986, n. 917 (TUIR): non
concorrono a formare il reddito di lavoro dipendente "i contributi previdenziali
e assistenziali versati ... in ottemperanza a disposizioni di legge" — fonte:
Normattiva, testo vigente,
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51>, anno 1986 (testo vigente 2026).
Vale per il 9,19%, per l'eventuale 0,30% CIGS e **anche per l'1% aggiuntivo**,
che è un contributo dovuto per legge (art. 3-ter, D.L. 384/1992) a carico del
lavoratore: `imponibileFiscale = ral − contributiDipendente` con l'1% incluso
nei contributi.

## 2. Aliquota a carico del datore (vista "costo azienda")

- Quota datore dell'IVS/FPLD: **23,81%** (33,00% complessivo − 9,19% a carico
  del dipendente; il tetto del 33% complessivo è fissato dall'art. 1, c. 769,
  L. 296/2006) — fonte: Circolare INPS n. 23 del 24/01/2007, URL sopra, anno 2007.
- Il costo contributivo totale del datore è però **più alto e variabile**:
  oltre all'IVS si aggiungono le contribuzioni minori (NASpI, ex-CUAF, malattia,
  maternità, CIGO/CIGS o fondi di solidarietà, Fondo di garanzia TFR), le cui
  aliquote dipendono da settore, inquadramento aziendale (CSC) e organico.
  Non esiste un'unica aliquota "datore" da fonte primaria valida per tutti i
  casi: vedi Lacune.

## 3. I tre punti di rottura della proporzionalità

### 3.1 Minimale di retribuzione giornaliera

La contribuzione non può essere calcolata su imponibili giornalieri inferiori al
minimale di legge: **58,13 EUR** per il 2026, pari al **9,5%** del trattamento
minimo mensile di pensione FPLD in vigore al 1° gennaio 2026 (**611,85 EUR**).

- Base normativa: art. 7, c. 1, secondo periodo, D.L. 12 settembre 1983, n. 463,
  conv. L. 638/1983, come modificato dall'art. 1, c. 2, D.L. 338/1989; opera
  insieme al "minimo contrattuale" ex art. 1, c. 1, D.L. 338/1989 conv. L. 389/1989.
- Valori 2026 e rivalutazione (variazione ISTAT +1,4% per il 2025): Circolare
  INPS n. 6 del 30/01/2026, par. 1,
  <https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html>, anno 2026.

Effetto sul prototipo: è un **pavimento sull'imponibile contributivo**, non sul
netto. Per un impiegato full-time con RAL da CCNL il minimale non morde: rompe
la proporzionalità solo per retribuzioni giornaliere sotto 58,13 EUR
(≈ 18.136 EUR/anno su 312 giornate), dove i contributi si calcolano sul minimale
anche se la retribuzione è più bassa.

### 3.2 Aliquota aggiuntiva dell'1% oltre la prima fascia di retribuzione pensionabile

**Esiste ed è a carico del dipendente.** L'art. 3-ter, D.L. 19 settembre 1992,
n. 384, conv. con modificazioni dalla L. 14 novembre 1992, n. 438, ha introdotto
dal 1° gennaio 1993 "una aliquota aggiuntiva nella misura di un punto percentuale
sulle quote di retribuzione eccedenti il limite della prima fascia di retribuzione
pensionabile" (determinata ai fini dell'art. 21, c. 6, L. 67/1988), dovuta quando
il regime pensionistico prevede aliquote a carico del lavoratore **inferiori al
10%** (il 9,19% del FPLD lo è) — fonte: Normattiva, testo vigente,
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:1992-09-19;384~art3ter>, anno 1992.

Valori 2026 (Circolare INPS n. 6 del 30/01/2026, par. 5, URL sopra, anno 2026):

- prima fascia di retribuzione pensionabile annua: **56.224,00 EUR**;
- importo mensilizzato: **4.685,00 EUR** (attenzione: non è 56.224/12 = 4.685,33 —
  l'INPS pubblica il mensilizzato arrotondato a 4.685,00);
- applicazione: **criterio della mensilizzazione** — l'1% si applica mese per
  mese sulla quota di retribuzione eccedente 4.685,00 EUR, "senza tenere conto
  del superamento del tetto minimo su base annua", con **conguaglio a fine anno**
  sul confronto con la soglia annua di 56.224,00 EUR (circ. 6/2026, par. 5 e
  par. 10.1; cfr. circolare INPS n. 7/2010, par. 3, e messaggio n. 5327/2015);
- il massimale opera anche per l'1%: "Il massimale opera anche ai fini
  dell'aliquota aggiuntiva dell'1%" (circ. 6/2026, par. 6), quindi l'1% si applica
  sulla fascia 56.224,00 → 122.295,00 EUR;
- in caso di rapporti successivi o simultanei le retribuzioni si **cumulano** ai
  fini del superamento della fascia (circ. 6/2026, nota 10) — fuori dominio per
  noi (un solo rapporto per l'intero anno).

**Conferma fiscale**: rientra nei contributi che riducono l'imponibile fiscale
(art. 51, c. 2, lett. a), TUIR — vedi § 1). Su base annua, per il prototipo:
`1% × max(0, min(ral, 122.295) − 56.224)`.

### 3.3 Massimale annuo della base contributiva e pensionabile

Valore 2026: **122.295,00 EUR** (valore rivalutato esatto **122.295,40 EUR**,
arrotondato all'unità di euro) — fonte: Circolare INPS n. 6 del 30/01/2026,
par. 6, URL sopra, anno 2026.

- Base normativa: art. 2, c. 18, **secondo periodo**, L. 8 agosto 1995, n. 335:
  massimale originario di **lire 132 milioni** annue, rivalutato sulla base
  dell'indice ISTAT dei prezzi al consumo per le famiglie di operai e impiegati —
  fonte: Normattiva, testo vigente,
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335~art2>, anno 1995.
- **Platea (conferma dell'assunzione in `docs/ASSUNZIONI.md`)**: si applica SOLO
  ai "lavoratori iscritti successivamente al 31 dicembre 1995 a forme
  pensionistiche obbligatorie e per coloro che optano per la pensione con il
  sistema contributivo" (circ. 6/2026, par. 6; art. 2, c. 18, L. 335/1995,
  che parla di lavoratori "privi di anzianità contributiva" al 31/12/1995).
  L'assunzione registrata («iscritto a forme pensionistiche dopo il 31/12/1995»)
  è quindi **confermata come condizione necessaria** perché il massimale operi.
  Precisazione da Normattiva (modifica ex L. 208/2015): chi si vede accreditare
  su domanda contribuzione anteriore al 1996 **esce** dal massimale dal mese
  successivo alla domanda.
- **Cosa accade oltre la soglia**: la contribuzione IVS (9,19% + 1% aggiuntivo)
  si calcola solo fino a 122.295,00 EUR; la quota di retribuzione eccedente non
  entra nell'imponibile pensionistico ("L'imponibile eccedente il massimale non
  è compreso nell'elemento <Imponibile>") ma resta assoggettata alle
  **contribuzioni minori** (la circolare chiede di esporre l'eccedenza con le
  "relative contribuzioni minori" in `<EccedenzaMassimale>`, `<ContributoEccMass>`) —
  circ. 6/2026, par. 6. Per il lato dipendente ciò significa: 9,19% e 1% si
  fermano al massimale; l'eventuale 0,30% CIGS (contribuzione minore) continua
  sull'intera retribuzione.
- Per i lavoratori **già iscritti al 31/12/1995** il massimale non esiste:
  9,19% e 1% su tutta la retribuzione. Sopra il massimale l'errore di platea
  cambia segno, come segnalato nella issue.

## Casi di test candidati

Dalle fonti primarie (tutti da Circolare INPS n. 6 del 30/01/2026, URL sopra):

1. **Derivazione del minimale** (par. 1): `611,85 × 9,5% = 58,1258 → 58,13 EUR`.
   Test di arrotondamento a 2 decimali per eccesso al centesimo.
2. **Minimale orario part-time, esempi svolti dall'INPS** (par. 4):
   `58,13 × 6/40 = 8,72 EUR` (orario 40h private) e `58,13 × 5/36 = 8,07 EUR`
   (orario 36h pubbliche). Unici esempi numerici svolti presenti nella circolare.
3. **Mensilizzazione della prima fascia** (par. 5): `56.224,00 / 12 = 4.685,33`,
   ma il valore pubblicato è `4.685,00`. Un'implementazione che mensilizza da sé
   sbaglia di 0,33 EUR/mese: usare i valori pubblicati.
4. **Arrotondamento del massimale** (par. 6): `122.295,40 → 122.295,00`
   (arrotondamento all'unità di euro).
5. **Coppie a cavallo di soglia** (costruite sui valori pubblicati, non presenti
   come esempi in circolare):
   - RAL 56.224 vs 56.225: contributo aggiuntivo annuo 0 vs 0,01 EUR;
   - RAL 80.000: quota soggetta all'1% = 80.000 − 56.224 = 23.776 EUR →
     237,76 EUR/anno (ordine di grandezza ~1% dell'eccedenza citato nella issue);
   - RAL 122.295 vs 122.296 (iscritto post-1995): l'IVS del dipendente è identica,
     9,19% × 122.295 + 1% × (122.295 − 56.224); per l'iscritto ante-1996 invece
     continua a crescere.

## Lacune

- **Contenuto della "Rettifica" alla circolare 6/2026**: la pagina INPS della
  circolare segnala una rettifica ai dati, ma il portale (single-page app) non
  espone il testo della rettifica a un fetch diretto e nessuna ricerca ne ha
  restituito il dettaglio da dominio primario. I valori qui riportati coincidono
  tra il testo integrale della circolare (copia conforme del 02/02/2026) e i
  riassunti pubblicati dall'INPS successivamente; restano da verificare contro
  la sezione "Rettifica" alla prima occasione (apertura manuale della pagina).
- **Aliquota complessiva a carico del datore per settore**: non reperita una
  tabella primaria unica e vigente delle aliquote datoriali totali (IVS +
  contribuzioni minori) per settore/CSC; la pagina INPS storica "Aliquote
  contributive" risulta rimossa. Quantificato da fonte primaria solo l'IVS
  datore (23,81%) e la CIGS (0,60%). Per la vista "costo azienda" servirà una
  ricerca dedicata (circolari INPS di settore o tabelle CSC).
- **Applicabilità della CIGS al nostro impiegato**: dipende da settore e organico
  dell'azienda (art. 20, D.lgs. 148/2015, non approfondito qui). Il brief non
  fornisce questi input: la scelta 9,19% vs 9,49% va registrata in
  `docs/ASSUNZIONI.md` (variante consigliata: 9,19%, il caso universale).
- **Serie storica della quota dipendente ante-2007** (8,89% e ripartizione del
  32% del 1996): documentata solo al livello utile a giustificare il 9,19%
  vigente; non serve al percorso RAL → netto 2026.

## Nota metodologica

Il portale www.inps.it è una single-page app: il fetch diretto della pagina della
circolare restituisce solo la navigazione. Il testo integrale della Circolare
n. 6/2026 è stato letto da una copia conforme in PDF della pagina INPS (stampa
del 02/02/2026); tutti i valori numerici citati sono stati riscontrati anche in
contenuti restituiti da ricerche ristrette al dominio inps.it. La fonte citata
resta in ogni caso la circolare INPS. Le norme (D.L. 384/1992 art. 3-ter,
L. 335/1995 artt. 2-3, D.lgs. 148/2015 art. 23, TUIR art. 51) sono state lette
su Normattiva, testo vigente. La data ufficiale del D.L. 384/1992 è il
**19 settembre 1992** (Normattiva: «DECRETO-LEGGE 19 settembre 1992, n. 384»,
GU n. 221 del 19-09-1992), come lo cita anche la circolare INPS 6/2026.

## Fonti primarie consultate

- Circolare INPS n. 6 del 30/01/2026 — <https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html>
- Circolare INPS n. 23 del 24/01/2007 — <https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?sVirtuaLURL=%2Fcircolari%2FCircolare+numero+23+del+24-1-2007.htm>
- Art. 3-ter, D.L. 384/1992 conv. L. 438/1992 — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:1992-09-19;384~art3ter>
- Art. 2, c. 18, L. 335/1995 — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335~art2>
- Art. 3, cc. 23-24, L. 335/1995 — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1995-08-08;335~art3>
- Art. 23, D.lgs. 148/2015 — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2015-09-14;148~art23>
- Art. 51, c. 2, lett. a), D.P.R. 917/1986 (TUIR) — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51>
