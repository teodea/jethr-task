# Ricerca: arrotondamenti lungo la cascata e quadratura delle voci

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-11

## Domanda

Nel calcolo annuale a consuntivo per l'anno d'imposta 2026, con quali arrotondamenti
si determinano imponibile fiscale, IRPEF lorda e netta e addizionali? Gli imponibili
si arrotondano all'unità di euro come nei modelli dichiarativi (istruzioni AdE)?
In quali passi della cascata si arrotonda e in quali si tiene il centesimo?

## Risposta in sintesi

Esistono **due mondi con regole diverse**, entrambi documentati da fonte primaria:

1. **Mondo del sostituto d'imposta (conguaglio, Certificazione Unica)**: tutto in
   **euro e centesimi**, arrotondando sulla terza cifra decimale (0–4 per difetto,
   5–9 per eccesso). È il mondo con cui si confronta una CU reale.
2. **Mondo dichiarativo (730/Redditi PF e relativa liquidazione)**: gli importi
   esposti sono in **unità di euro** (≥ 50 centesimi per eccesso, altrimenti per
   difetto); nella liquidazione l'arrotondamento si fa **solo nella fase finale del
   calcolo di ciascun rigo**, mai nei passaggi intermedi.

Trasversale a entrambi i mondi c'è **una sola regola sostanziale che tocca il motore
di calcolo**: i quozienti delle detrazioni (tra cui la detrazione per lavoro
dipendente) **si assumono nelle prime quattro cifre decimali** (troncamento, non
arrotondamento). È una norma di legge (art. 13, comma 6, TUIR), non una convenzione
di compilazione: va implementata nel calcolo, qualunque sia la politica di
presentazione.

**Conseguenza per la decisione di prodotto già presa** (calcolo interno al
centesimo, arrotondamento solo in presentazione, quadratura per differenza):
è compatibile con il mondo CU/conguaglio, che lavora al centesimo. La regola
dell'unità di euro è una regola di **esposizione dichiarativa**, non del calcolo in
sé — va recepita solo se si vuole riprodurre esattamente un 730-3. Il troncamento
del quoziente a 4 decimali, invece, **va recepito nel calcolo** perché è imposto
dalla fonte primaria (vedi sotto).

## Le regole di arrotondamento per ciascun passo della cascata

### 0. RAL → imponibile previdenziale e contributi a carico del dipendente (mondo INPS)

- Nei flussi UniEmens gli **imponibili** sono espressi in **unità di euro** come
  importi interi: «Il valore indicato, espresso in unità di euro, deve essere
  conforme alle caratteristiche previste per la generalità degli importi interi»
  (definizione degli elementi imponibile, es. `<Imponibile>`).
  Fonte: Documento tecnico UniEmens (individuale), Release 1.2 del 25/1/2011,
  allegato n. 1 alla circolare INPS n. 13 del 28/01/2011, pagg. 16, 79, 82 —
  https://servizi2.inps.it/CircolariZIP/circolare%20numero%2013%20del%2028-01-2011_Allegato%20n%201.pdf
  (anno 2011, standard del flusso tuttora in uso).
- Gli **importi contributivi** ammettono al massimo 2 decimali: «L'arrotondamento
  dovrà avvenire per i millesimi da 0 a 4 al centesimo inferiore e da 5 a 9 al
  centesimo superiore.» Stessa fonte, pag. 16.
- Nella sezione previdenziale della **Certificazione Unica** «gli importi delle
  retribuzioni e delle contribuzioni devono essere indicati in Euro, esponendo i
  dati in centesimi, arrotondando per eccesso se la terza cifra decimale è uguale o
  superiore a cinque o per difetto se inferiore a detto limite».
  Fonte: Istruzioni CU 2026 (agg. 24/02/2026), pag. 68 del PDF —
  https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istr_2026_agg+24+02.pdf/4184818b-05a3-acce-5956-70811c7d2233?t=1771947585334
  (anno 2026).

### 1. Imponibile fiscale e tutte le voci del conguaglio del sostituto (CU)

«La certificazione è compilata in euro esponendo i dati in centesimi, arrotondando
per eccesso se la terza cifra decimale è uguale o superiore a cinque o per difetto
se inferiore a detto limite. Ad esempio: 55,505 diventa 55,51; 65,626 diventa
65,63; 65,493 diventa 65,49.»
Fonte: Istruzioni CU 2026 (agg. 24/02/2026), pag. 17 del PDF — URL sopra (anno 2026).

Quindi nel mondo del sostituto (che è quello che una proiezione RAL → netto
riproduce) **l'imponibile fiscale NON si arrotonda all'unità di euro: si tiene il
centesimo**.

### 2. Importi esposti in dichiarazione (730/Redditi PF)

«Gli importi da indicare nella dichiarazione devono essere arrotondati all'unità di
euro per eccesso se la frazione decimale è uguale o superiore a cinquanta centesimi
di euro oppure per difetto se inferiore a questo limite (ad esempio 65,50 diventa
66; 65,51 diventa 66; 65,49 diventa 65).»
Fonte: Istruzioni modello 730/2026, "Modalità di arrotondamento", pag. 16 del PDF —
https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734
(edizione per l'anno d'imposta 2025, la più recente disponibile; vedi Lacune).

La regola vale per i dati di **input** della dichiarazione. Per le operazioni di
liquidazione vale il punto 3.

### 3. Regola generale della liquidazione: arrotondare solo alla fine di ogni voce

«Nello svolgimento delle operazioni di controllo e liquidazione, gli importi debbono
essere considerati in unità di EURO […]; i campi che contengono una percentuale
debbono essere arrotondati alla seconda cifra decimale.» (§1.1, pag. 20)

«La modalità di arrotondamento degli importi […] deve essere il seguente:
arrotondamento per eccesso, se la frazione di decimale è uguale o superiore a 50
centesimi di euro; arrotondamento per difetto, se la frazione di decimale è
inferiore a detto limite. […] Se non diversamente precisato nelle istruzioni dei
singoli paragrafi […] l'arrotondamento deve essere effettuato **nella sola fase
finale del calcolo, ossia prima dell'esposizione del risultato nel prospetto di
liquidazione e non nei singoli passaggi intermedi**.» (§1.2, pag. 21)

Fonte: Circolare di liquidazione mod. 730/2026 (Allegato C), §1.1–1.2, pagg. 20–21
del PDF —
https://www.agenziaentrate.gov.it/portale/documents/20143/9772565/Allegato+C+-+Circolare+di+liquidazione+mod+730+2026.pdf
(edizione per l'anno d'imposta 2025; vedi Lacune).

Questa è la risposta alla domanda «in quali passi si arrotonda»: **dentro il calcolo
di una voce si tiene il centesimo; si arrotonda all'unità una volta sola, quando la
voce viene esposta come rigo del 730-3**. I righi (già interi) si combinano poi tra
loro in aritmetica intera.

### 4. IRPEF lorda

Calcolata applicando gli scaglioni al reddito imponibile del rigo 14 (già in unità
di euro perché rigo del prospetto); il risultato è arrotondato all'unità solo
all'esposizione nel rigo 16.
Fonte regola: Circolare di liquidazione mod. 730/2026, §19.5 "Imposta lorda – rigo
16", pag. 329 del PDF (URL sopra), combinata con la regola generale §1.2.

Aliquote e scaglioni per l'anno d'imposta 2026 (usati nei casi di test):

- fino a 28.000 euro: 23%
- oltre 28.000 e fino a 50.000 euro: 33%
- oltre 50.000 euro: 43%

Fonte: art. 11, comma 1, DPR 917/1986 (TUIR), testo vigente dal 1/1/2026 al
31/12/2026 —
https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-08-11
(anno 2026). Ultima modifica: legge di bilancio 2026, L. 30/12/2025 n. 199, GU
Serie Generale n. 301 del 30/12/2025, S.O. n. 42 —
https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/sg

### 5. Detrazione per lavoro dipendente: quoziente TRONCATO a 4 decimali

Norma sostanziale: «Se il risultato dei rapporti indicati nei commi 1, 3, 4 e 5 è
maggiore di zero, lo stesso si assume nelle prime quattro cifre decimali.»
Fonte: art. 13, comma 6, DPR 917/1986 (TUIR), testo vigente dal 1/1/2025 al
31/12/2026 —
https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-08-11
(anno 2026). «Si assume nelle prime quattro cifre decimali» = troncamento: la
quinta cifra si scarta, non si arrotonda (così anche le formule operative della
circolare di liquidazione).

Formule operative (fasce di reddito complessivo, importi vigenti; giorni = 365 per
anno intero):

- fino a 15.000: detrazione 1.955 (minimo 690, o 1.380 per tempo determinato) —
  art. 13, co. 1, lett. a) TUIR (URL sopra, anno 2026) e Tabella 6 delle istruzioni
  730/2026, pag. 149 del PDF.
- oltre 15.000 e fino a 28.000: `[1.910 + 1.190 × Q] × giorni/365`, con
  `Q = (28.000 − reddito)/13.000` nelle prime 4 cifre decimali; +65 euro (non
  rapportati ai giorni) se il reddito è tra 25.001 e 28.000.
  Fonte: Circolare di liquidazione mod. 730/2026, §19.9.1 lett. B, pag. 340 del PDF.
- oltre 28.000 e fino a 50.000: `1.910 × Q × giorni/365`, con
  `Q = (50.000 − reddito)/22.000` nelle prime 4 cifre decimali; +65 euro (non
  rapportati ai giorni) se il reddito è tra 28.001 e 35.000.
  Fonte: Circolare di liquidazione mod. 730/2026, §19.9.1 lett. C, pag. 341 del PDF;
  la Tabella 6 delle istruzioni 730/2026 (pag. 149) esprime la maggiorazione come
  «aumentata di un importo pari a 65 euro, se il reddito complessivo è compreso tra
  25.001 euro e 35.000 euro».

Il risultato della formula (che ha i centesimi) si arrotonda all'unità solo
all'esposizione nel rigo 25 del 730-3 (regola generale §1.2).

**Questa è la regola che "sovrascrive" il centesimo pieno**: anche calcolando tutto
al centesimo, il quoziente va troncato a 4 decimali, altrimenti la detrazione
diverge da quella di una CU o di un 730-3 reale (vedi Casi di test).

### 6. Ulteriore detrazione (L. 207/2024, art. 1, comma 6)

Testo di legge (riportato integralmente nella circolare di liquidazione, pag. 137):
1.000 euro se il reddito complessivo è tra 20.000 e 32.000; tra 32.000 e 40.000 è
`1.000 × (40.000 − reddito complessivo)/8.000`, rapportata al periodo di lavoro.
Formula operativa: `Comma-6-Ulteriore-Detrazione = 1.000 × (40.000 − reddito)/8.000
× giorni/365` (Circolare di liquidazione, §8.3.5, pag. 142 del PDF).
Fonte normativa: L. 30/12/2024 n. 207, art. 1, comma 6, GU Serie Generale n. 305
del 31/12/2024, S.O. n. 43 —
https://www.gazzettaufficiale.it/eli/id/2024/12/31/24G00229/sg (anno 2025, a regime).

**Né la legge né la circolare fissano un numero di decimali per questo rapporto**
(a differenza dell'art. 13, co. 6 TUIR): si tiene il centesimo fino
all'arrotondamento finale della voce (regola generale §1.2). Vedi Lacune.

### 7. Somma integrativa (L. 207/2024, art. 1, commi 4–5) — erogazione, non detrazione

Percentuali sul reddito di lavoro dipendente (che per individuare la percentuale è
rapportato all'intero anno): 7,1% fino a 8.500 euro; 5,3% oltre 8.500 e fino a
15.000; 4,8% oltre 15.000 (spetta con reddito complessivo fino a 20.000 euro).
Fonti: L. 207/2024, art. 1, commi 4–5 (GU, URL sopra, anno 2025 a regime); formule
operative `Comma-4-Somma-Spettante = 7,1/100 × …` ecc. in Circolare di
liquidazione, §8.3.4, pag. 141 del PDF.
Nessuna regola di arrotondamento specifica: centesimi fino all'esposizione
(righi 65–67 del 730-3), regola generale §1.2.

### 8. Trattamento integrativo (D.L. 3/2020) — erogazione

`TrattamentoIntegrativoSpettante = 1.200 × GiorniLavoro / 365`.
Fonte: Circolare di liquidazione mod. 730/2026, §8.2.5.2, pag. 132 del PDF (importo
massimo 1.200 euro: ivi citato testo dell'art. 1, D.L. 3/2020 come modificato da
L. 234/2021, pag. 127). Nessun arrotondamento intermedio: regola generale §1.2.
Per un anno intero il fattore giorni è 1 e non pone problemi di arrotondamento.

### 9. Addizionale regionale e comunale

- **Soglia secca di attivazione**: le addizionali sono dovute solo se l'IRPEF netta
  di riferimento (rigo 16 meno detrazioni e crediti d'imposta per redditi esteri)
  «risulti un importo maggiore di euro 10» (richiamo a D.Lgs. 446/1997, art. 50 e
  D.Lgs. 360/1998, art. 1).
  Fonte: Circolare di liquidazione mod. 730/2026, §19.24.1, pag. 399 del PDF.
  **Riconciliazione con la ricerca della issue #3** (che dalle norme istitutive
  ricava il gate «IRPEF netta > 0»): i «10 euro» sono la regola operativa della
  liquidazione dichiarativa, non delle norme istitutive. Il prototipo — proiezione
  annua nel mondo del sostituto — usa il gate normativo «IRPEF netta > 0»; nella
  finestra 0 < IRPEF netta ≤ 10 i due mondi divergono (per il 2026: RC tra
  8.500,01 e ~8.543,48) e il punto di discontinuità del censimento (issue #3, §5
  punto 2) resta RC = 8.500. Scelta registrata in `docs/ASSUNZIONI.md`.
- **Base imponibile**: rigo 71 = rigo 14, cioè **lo stesso imponibile fiscale
  dell'IRPEF** (in unità di euro nel mondo dichiarativo, al centesimo nel mondo
  CU). Fonte: §19.24.2, pag. 400 del PDF.
- **Calcolo**: si applicano al rigo 71 le aliquote deliberate da regione e comune
  del domicilio fiscale al 1° gennaio dell'anno d'imposta; il risultato si
  arrotonda all'unità solo all'esposizione (righi 72 e segg.), regola generale
  §1.2. Fonte: §19.24.3, pag. 400 del PDF. (Le aliquote 2026 di Regione Lombardia
  e Comune di Milano sono oggetto di altra ricerca; qui rileva solo la regola.)

### 10. Soglia secca di versamento/rimborso (quadratura con una CU/730 reale)

«Il sostituto d'imposta non esegue il versamento del debito o il rimborso del
credito di ogni singola imposta o addizionale se l'importo che risulta dalla
dichiarazione è uguale o inferiore a 12 euro.»
Fonte: Istruzioni modello 730/2026, pag. 8 del PDF (URL sopra, anno d'imposta 2025).
Non tocca il calcolo del netto del prototipo, ma spiega scarti fino a 12 euro per
voce quando si confronta la proiezione con un conguaglio da dichiarazione reale.

## Risposta alla decisione di prodotto

- Il calcolo interno **al centesimo con arrotondamento solo in presentazione** è
  la stessa politica del mondo sostituto/CU (fonte: Istruzioni CU 2026, pag. 17) e
  coincide con lo spirito della liquidazione AdE («arrotondamento nella sola fase
  finale», §1.2): la scelta regge.
- **Unica eccezione da recepire nel motore**: il quoziente delle detrazioni si
  tronca alle prime 4 cifre decimali (art. 13, co. 6, TUIR). Non è presentazione:
  cambia il valore della detrazione.
- Se in futuro si volesse una "modalità 730-3" che riproduce il prospetto di
  liquidazione al'euro, la ricetta è: input in unità di euro (regola dei 50
  centesimi), ogni voce arrotondata all'unità solo alla sua esposizione, righi
  combinati in aritmetica intera.

## Casi di test candidati

### A. Esempi svolti presenti nelle fonti (arrotondamenti puri)

- Unità di euro (istruzioni 730/2026, pag. 16): `65,50 → 66`; `65,51 → 66`;
  `65,49 → 65`.
- Centesimi CU (istruzioni CU 2026, pag. 17): `55,505 → 55,51`; `65,626 → 65,63`;
  `65,493 → 65,49`.
- Centesimi contributi UniEmens (doc. tecnico, pag. 16): millesimi 0–4 al
  centesimo inferiore, 5–9 al superiore.

### B. Troncamento del quoziente vs quoziente pieno (derivato dalle regole sopra)

Reddito complessivo 35.002 euro, anno intero, anno d'imposta 2026 (fascia
28.000–50.000, niente maggiorazione di 65 euro perché sopra 35.000):

- `Q = (50.000 − 35.002)/22.000 = 0,68172727… → 0,6817` (prime 4 cifre decimali).
- Detrazione = `1.910 × 0,6817 = 1.302,047 → 1.302,05` al centesimo.
- Senza troncamento: `1.910 × 0,6817272… = 1.302,099… → 1.302,10`.

Differenza di 5 centesimi sulla singola voce: un motore "tutto al centesimo" che
non tronca il quoziente sbaglia rispetto alla regola dell'art. 13, co. 6, TUIR.

### C. Caso richiesto dalla DoD: arrotondare per voce e arrotondare alla fine danno risultati diversi

Imponibile fiscale al centesimo: **35.001,50 euro**, anno intero, anno d'imposta
2026, solo cascata IRPEF (aliquote art. 11 TUIR vigente 2026; detrazione §19.9.1
lett. C). Valori attesi derivati dalle regole citate (non esempi svolti di fonte):

**Politica dichiarativa (arrotonda per voce, regole AdE):**

| Passo | Calcolo | Valore |
|---|---|---|
| Imponibile (rigo 14) | 35.001,50 → unità (frazione ,50 → eccesso) | 35.002 |
| IRPEF lorda | 28.000×23% + 7.002×33% = 6.440 + 2.310,66 = 8.750,66 | rigo 16 = **8.751** |
| Quoziente | (50.000 − 35.002)/22.000 = 0,681727… → 0,6817 | 0,6817 |
| Detrazione lavoro dipendente | 1.910 × 0,6817 = 1.302,047 | rigo 25 = **1.302** |
| IRPEF netta | 8.751 − 1.302 | **7.449** |

**Politica "tutto al centesimo, arrotondo solo alla fine" (senza troncare il quoziente):**

| Passo | Calcolo | Valore |
|---|---|---|
| IRPEF lorda | 6.440 + 7.001,50×33% = 8.750,495 | 8.750,50 |
| Detrazione | 1.910 × (14.998,50/22.000) = 1.910 × 0,681750 = 1.302,1425 | 1.302,14 |
| IRPEF netta | 8.750,495 − 1.302,1425 = 7.448,3525 | 7.448,35 → all'unità **7.448** |

**Le due politiche divergono di 1 euro anche dopo l'arrotondamento finale**
(7.449 vs 7.448): è il caso che rende un test capace di distinguere la politica di
arrotondamento implementata da un bug.

### D. Coppia a cavallo della soglia dei 50 centesimi

Stessa cascata, politica dichiarativa:

- imponibile **35.001,49** → rigo 14 = 35.001; lorda = 6.440 + 7.001×33% =
  8.750,33 → rigo 16 = 8.750; Q = (50.000−35.001)/22.000 = 0,6817727… → 0,6817;
  detrazione 1.302,047 → 1.302; **netta 7.448**;
- imponibile **35.001,50** → (caso C) **netta 7.449**.

Un centesimo di imponibile sposta il netto dichiarativo di 1 euro: utile come test
della regola dei 50 centesimi in isolamento.

## Fonti (riepilogo)

| Fonte | Cosa fonda | URL |
|---|---|---|
| Istruzioni mod. 730/2026 (AdE, agg. 28/05/2026), pagg. 8, 16, 148–149 | unità di euro in dichiarazione; soglia 12 euro; tabelle detrazioni con "prime 4 cifre decimali" | https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734 |
| Circolare di liquidazione mod. 730/2026 (AdE, Allegato C), §1.1–1.2 (pagg. 20–21), §8.2.5.2 (p. 132), §8.3.4–8.3.5 (pagg. 137–142), §19.5 (p. 329), §19.9.1 (pagg. 340–341), §19.24 (pagg. 399–400) | arrotondamento solo in fase finale; percentuali a 2 decimali; formule di ogni voce | https://www.agenziaentrate.gov.it/portale/documents/20143/9772565/Allegato+C+-+Circolare+di+liquidazione+mod+730+2026.pdf |
| Istruzioni CU 2026 (AdE, agg. 24/02/2026), pagg. 17 e 68 | centesimi in CU (parte fiscale e previdenziale), regola della terza cifra decimale | https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istr_2026_agg+24+02.pdf/4184818b-05a3-acce-5956-70811c7d2233?t=1771947585334 |
| TUIR art. 11 (Normattiva, vigente 1/1–31/12/2026) | scaglioni e aliquote 2026: 23/33/43 | https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-08-11 |
| TUIR art. 13 (Normattiva, vigente 1/1/2025–31/12/2026) | detrazione lavoro dipendente; comma 6: prime quattro cifre decimali | https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-08-11 |
| L. 30/12/2024 n. 207, art. 1, commi 4–6 (GU SG n. 305 del 31/12/2024, S.O. 43) | somma integrativa 7,1/5,3/4,8%; ulteriore detrazione 1.000 e rapporto /8.000 | https://www.gazzettaufficiale.it/eli/id/2024/12/31/24G00229/sg |
| L. 30/12/2025 n. 199 (GU SG n. 301 del 30/12/2025, S.O. 42) | legge di bilancio 2026 (ultima modifica dell'art. 11 TUIR) | https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/sg |
| Documento tecnico UniEmens, Release 1.2, all. 1 circ. INPS 13/2011, pagg. 16, 79, 82 | imponibili INPS in unità di euro; contributi al centesimo (millesimi 0–4/5–9) | https://servizi2.inps.it/CircolariZIP/circolare%20numero%2013%20del%2028-01-2011_Allegato%20n%201.pdf |

## Lacune

1. **Documenti dichiarativi riferiti all'anno d'imposta 2025.** Le istruzioni
   730/2026 e la circolare di liquidazione coprono l'anno d'imposta 2025; i
   documenti per il 2026 (730/2027) non esistono ancora ad agosto 2026. Le regole
   di arrotondamento qui citate sono procedurali e stabili tra le edizioni, ma
   l'assunzione di invarianza per il 2026 va registrata. Aliquote e importi usati
   nei casi di test provengono invece da norme già vigenti per il 2026 (art. 11 e
   13 TUIR, testo vigente su Normattiva).
2. **Verso dell'arrotondamento dell'imponibile UniEmens.** Il documento tecnico
   prescrive «unità di euro / importi interi» ma non esplicita la regola dei 50
   centesimi per passare dai centesimi all'intero. Le fonti che la fissano
   (circolare INPS n. 208 del 27/11/2001; deliberazione CdA INPS n. 1123 del
   17/11/1998) risultano irraggiungibili sul sito INPS (pagine a caricamento
   client-side / 404). Per il prototipo, che lavora al centesimo su base annua, il
   punto non è bloccante; se si volesse riprodurre la busta paga mensile andrebbe
   chiuso.
3. **Decimali del rapporto dell'ulteriore detrazione** `(40.000 − reddito)/8.000`
   (L. 207/2024, art. 1, comma 6): né la legge né la circolare di liquidazione
   fissano un numero di cifre decimali (a differenza dell'art. 13, co. 6 TUIR per
   le detrazioni). Assunzione conseguente: quoziente al centesimo pieno fino
   all'arrotondamento finale della voce.
4. **Comma esatto della L. 199/2025 che porta il secondo scaglione al 33%.** La
   pagina GU consultata è l'indice dell'atto e non ne espone il testo; il valore
   33% per il 2026 è comunque verificato sul testo vigente dell'art. 11 TUIR
   (Normattiva, vigenza 1/1–31/12/2026).
5. **Base normativa primaria della regola "unità di euro" in dichiarazione.** Le
   istruzioni AdE la prescrivono senza citare la norma istitutiva; una radice
   legislativa (spesso indicata in dottrina nel D.Lgs. 213/1998) non è stata
   confermata: l'art. 51 del D.Lgs. 213/1998 letto su Normattiva riguarda le
   sanzioni, non le dichiarazioni. Ai fini del prototipo la fonte AdE
   (istruzioni + circolare di liquidazione) è sufficiente e ammessa dalle regole
   del repo.
