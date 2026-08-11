# Trattamento integrativo, somma integrativa e ulteriore detrazione (redditi bassi e medi)

Anno di riferimento: **anno d'imposta 2026**
Data della ricerca: **2026-08-11**
Issue di origine: [teodea/jethr-task#4](https://github.com/teodea/jethr-task/issues/4)

## La domanda

Per l'anno d'imposta 2026: **tutte le misure vigenti per redditi bassi e medi**, sia le
somme **erogate** in busta paga sia le **detrazioni aggiuntive fuori dall'art. 13** —
oggi: il **trattamento integrativo** (DL 3/2020), la **somma integrativa** (bonus
percentuale sul reddito da lavoro per le fasce basse) e l'**ulteriore detrazione** per le
fasce medie (entrambe L. 207/2024). Per ciascuna misura: importo o formula, soglie,
condizioni di spettanza, base su cui si valuta la soglia, e classificazione per leva
(erogazione / detrazione). In più: censimento di tutti i punti di discontinuità della
funzione reddito → erogazioni/detrazioni, coppie di casi a cavallo, un caso end-to-end
di incapienza.

Perimetro del prototipo (dal glossario del repo): impiegato privato a tempo
indeterminato, tempo pieno, residente a Milano, anno intero, un solo rapporto di lavoro,
nessun familiare a carico, nessun fringe benefit, nessun altro reddito. In questo
perimetro **reddito complessivo = reddito di lavoro dipendente = imponibile fiscale**.

---

## 1. Quadro normativo 2026: cosa è vigente e cosa no

### 1.1 La legge di bilancio 2026 NON ha modificato le misure

La L. 30 dicembre 2025, n. 199 (legge di bilancio 2026, GU Serie Generale n. 301 del
30-12-2025) — [testo su Gazzetta Ufficiale](https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/SG),
[art. 1 su Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-12-30;199~art1):

- **art. 1, comma 3**: nell'art. 11, comma 1, lettera b) del TUIR «le parole: "35 per
  cento" sono sostituite dalle seguenti: "33 per cento"» — l'aliquota IRPEF del secondo
  scaglione (28.000–50.000 EUR) scende dal 35% al **33%** per il 2026; le soglie degli
  scaglioni restano invariate. Fonte: Normattiva L. 199/2025 art. 1 (URL sopra), anno 2026.
- **art. 1, comma 4**: riduzione di **440 EUR** delle detrazioni per i redditi
  complessivi **superiori a 200.000 EUR** (fuori dal perimetro «redditi bassi e medi» di
  questa ricerca). Stessa fonte.
- **Nessuna modifica** all'art. 13 TUIR, al DL 3/2020 (trattamento integrativo) né
  all'art. 1, commi 4–9, della L. 207/2024 (somma integrativa e ulteriore detrazione) è
  stata trovata nel pacchetto IRPEF iniziale dell'art. 1 (verifica condotta sui commi
  iniziali via Normattiva; l'unico intervento sulla L. 207/2024 trovato è al comma 8
  della LdB 2026, che tocca il comma 385 della L. 207/2024, estraneo alle misure qui
  trattate). Vedi anche la conferma indiretta al § 1.2.

### 1.2 Il nuovo Testo unico (D.Lgs. 117/2026) abroga il comma 6, ma dal 2027

Sulla pagina Normattiva della L. 207/2024, il comma 6 dell'art. 1 (ulteriore detrazione)
compare oggi con la nota di vigenza «((COMMA ABROGATO DAL D.LGS. 19 GIUGNO 2026,
N. 117))» — fonte: [Normattiva, L. 207/2024 art. 1, testo vigente](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1).

Il D.Lgs. 19 giugno 2026, n. 117 è il **nuovo Testo unico delle imposte sui redditi**
(GU Serie Generale n. 152 del 3-7-2026, S.O. n. 26 —
[Gazzetta Ufficiale](https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg),
[Normattiva](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2026-07-03&atto.codiceRedazionale=26G00131)).
Il testo unico «sarà applicabile **dal 1° gennaio 2027**» — fonte: FiscoOggi, rivista
telematica dell'Agenzia delle Entrate,
[«Esordio ufficiale per il nuovo Testo unico»](https://www.fiscooggi.it/portale/-/esordio-ufficiale-per-il-nuovo), anno 2026.

**Conseguenza per il prototipo**: per l'**anno d'imposta 2026** tutte e tre le misure si
applicano nella formulazione della L. 207/2024 / DL 3/2020 descritta sotto. L'abrogazione
del comma 6 decorre con l'applicazione del nuovo testo unico (2027) e conferma, a
contrario, che nel 2026 la misura era ancora applicabile. (Il numero esatto dell'articolo
del D.Lgs. 117/2026 che dispone abrogazioni e decorrenza non è stato estratto dal testo
primario: vedi Lacune.)

---

## 2. Le tre misure

### 2.1 Trattamento integrativo (DL 3/2020) — leva: EROGAZIONE

Fonte primaria: DL 5 febbraio 2020, n. 3, art. 1, convertito con modificazioni dalla
L. 2 aprile 2020, n. 21, testo vigente —
[Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1), anno 2026.
Chiarimenti: Circolare Agenzia delle Entrate n. 4/E del 16 maggio 2025, § 1.1 —
[PDF](https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91).

- **Importo**: 1.200 EUR/anno «a decorrere dall'anno 2021», rapportato al periodo di
  lavoro nell'anno. Fonte: DL 3/2020 art. 1 c. 1 (Normattiva, URL sopra), anno 2026.
- **Platea**: titolari di redditi di lavoro dipendente di cui all'art. 49 TUIR (escluse
  le pensioni di cui all'art. 49 c. 2 lett. a) e di taluni redditi assimilati (art. 50
  c. 1 lett. a, b, c, c-bis, d, h-bis, l). Fonte: Circolare 4/E/2025, § 1.1, p. 8.
- **Soglia di spettanza**: reddito complessivo **non superiore a 15.000 EUR**. Fonte:
  DL 3/2020 art. 1 c. 1 (Normattiva), anno 2026.
- **Condizione di capienza**: spetta solo se «l'imposta lorda determinata sui redditi
  [di lavoro dipendente e assimilati] è di importo superiore a quello della detrazione
  spettante ai sensi dell'articolo 13, comma 1» del TUIR «**diminuita dell'importo di 75
  euro** rapportato al periodo di lavoro nell'anno». Fonte: DL 3/2020 art. 1 c. 1
  (Normattiva) come modificato da L. 207/2024 art. 1 c. 3; Circolare 4/E/2025 § 1.1
  pp. 7–8 (la riduzione di 75 EUR «mira a neutralizzare l'incremento dell'importo della
  detrazione» da 1.880 a 1.955 EUR). Attenzione: l'imposta lorda del confronto è quella
  sui **soli redditi di lavoro dipendente e assimilati**, non sull'intero reddito.
- **Fascia 15.000–28.000 EUR** (secondo periodo del c. 1): il trattamento «è
  riconosciuto anche se il reddito complessivo è superiore a 15.000 euro ma non a 28.000
  euro, a condizione che la somma delle detrazioni di cui agli articoli 12 e 13, comma 1
  [TUIR], delle detrazioni di cui all'articolo 15, comma 1, lettere a) e b), e comma
  1-ter [interessi mutui contratti fino al 31-12-2021], e delle rate relative alle
  detrazioni di cui agli articoli 15, comma 1, lettera c) [spese sanitarie], e 16-bis
  [recupero edilizio] nonché di quelle relative alle detrazioni previste da altre
  disposizioni normative, per spese sostenute fino al 31 dicembre 2021, sia di ammontare
  superiore all'imposta lorda»; in tal caso spetta «per un ammontare, comunque non
  superiore a 1.200 euro, determinato in misura pari alla differenza tra la somma delle
  detrazioni ivi elencate e l'imposta lorda». Fonte: DL 3/2020 art. 1 c. 1, citato
  testualmente nella Circolare 4/E/2025, nota 9, p. 8.
  **Nel perimetro del prototipo** (solo detrazione art. 13, nessun'altra detrazione) la
  condizione non si verifica mai: per ogni reddito complessivo R > 15.000 la detrazione
  art. 13 è sempre inferiore all'imposta lorda (a 15.001 EUR: detrazione 3.099,88 <
  imposta lorda 3.450,23, quoziente troncato a 4 decimali ex art. 13 c. 6 TUIR; il
  divario cresce con il reddito) → trattamento = 0. [derivazione]
- **Classificazione per leva: EROGAZIONE.** È una somma riconosciuta dai sostituti
  d'imposta che non transita dall'imposta netta: se spetta, arriva per intero anche con
  IRPEF netta pari a zero. La «condizione di capienza» è un requisito on/off di
  spettanza, non un tetto proporzionale (glossario: soglia secca, non capienza da
  detrazione).
- **Soglia su quale grandezza**: reddito complessivo (per la spettanza rileva il
  c.d. «reddito di riferimento», che include anche redditi a cedolare secca, regime
  forfetario, ecc. — Circolare 4/E/2025, nota 8, p. 7; irrilevante nel perimetro del
  prototipo). La condizione di capienza è invece definita su imposta lorda e detrazione
  art. 13, cioè su grandezze **derivate** dal reddito: genera un punto di discontinuità
  che non coincide con nessuna soglia scritta in norma (vedi § 5).

### 2.2 Somma integrativa (L. 207/2024, art. 1, commi 4–5, 7–9) — leva: EROGAZIONE

Fonte primaria: L. 30 dicembre 2024, n. 207, art. 1, commi 4–9 —
[Normattiva, testo vigente](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1);
testo del comma 4 citato integralmente nella Circolare AdE 4/E del 16 maggio 2025,
nota 11, p. 9 ([PDF](https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91)), anno 2025 (misura a regime, confermata per il 2026: § 1).

Testo del comma 4 (dalla Circolare 4/E/2025, nota 11): ai «titolari di reddito di lavoro
dipendente di cui all'articolo 49 [TUIR], con esclusione di quelli indicati alla lettera
a) del comma 2 del medesimo articolo 49, che hanno un reddito complessivo non superiore
a 20.000 euro è riconosciuta una somma, che non concorre alla formazione del reddito,
determinata applicando al reddito di lavoro dipendente del contribuente la percentuale
corrispondente di seguito indicata:
a) 7,1 per cento, se il reddito di lavoro dipendente non è superiore a 8.500 euro;
b) 5,3 per cento, se il reddito di lavoro dipendente è superiore a 8.500 euro ma non a 15.000 euro;
c) 4,8 per cento, se il reddito di lavoro dipendente è superiore a 15.000 euro».

- **Soglia di spettanza**: reddito complessivo ≤ **20.000 EUR** (soglia secca: a
  20.001 EUR la somma si azzera per intero). Fonte: comma 4, cit.
- **Base della percentuale**: il **reddito di lavoro dipendente** (non il complessivo).
  Le due grandezze differiscono in generale; coincidono nel perimetro del prototipo.
- **Ragguaglio ad anno (comma 5)**: «ai soli fini dell'individuazione della percentuale
  applicabile ai sensi del comma 4 il reddito di lavoro dipendente è rapportato
  all'intero anno» — la percentuale si individua sul reddito annuale teorico, ma si
  applica al reddito effettivamente percepito. Fonte: comma 5, citato nella Circolare
  4/E/2025, nota 14, p. 10; procedimento in tre passi a p. 10. Per un lavoratore
  impiegato tutto l'anno (prototipo) teorico ed effettivo coincidono.
- **La somma non concorre alla formazione del reddito** (esente): non entra
  nell'imponibile fiscale né nel reddito complessivo delle altre soglie. Fonte: comma 4, cit.
- **Riconoscimento (commi 7–8)**: i sostituti d'imposta la riconoscono «in via
  automatica ... all'atto dell'erogazione delle retribuzioni e verificano in sede di
  conguaglio la spettanza»; se non spettante e superiore a 60 EUR, recupero «in dieci
  rate di pari ammontare»; il sostituto compensa il credito (art. 17 D.Lgs. 241/1997).
  Fonte: comma 7 citato nella Circolare 4/E/2025, nota 19, p. 14; comma 8, ivi p. 19.
- **Definizione del reddito (comma 9)**: nel reddito complessivo e nel reddito di lavoro
  dipendente dei commi 4 e 6 rileva anche la quota esente dei regimi ricercatori
  (art. 44 DL 78/2010) e impatriati (art. 16 D.Lgs. 147/2015; art. 5 D.Lgs. 209/2023);
  il reddito complessivo è assunto **al netto** del reddito dell'abitazione principale e
  pertinenze. Fonte: comma 9 citato nella Circolare 4/E/2025, nota 18, p. 12.
  Irrilevante nel perimetro del prototipo.
- **Classificazione per leva: EROGAZIONE.** Nessuna condizione di capienza: spetta per
  intero anche a IRPEF netta zero (è l'unica misura che raggiunge gli incapienti totali).
- **Cumulo con il trattamento integrativo**: nessuna clausola di alternatività nei testi
  letti (DL 3/2020 art. 1; L. 207/2024 art. 1 c. 4–9; Circolare 4/E/2025 §§ 1.1–1.2). Le
  due misure hanno requisiti autonomi e possono coesistere (es. reddito 10.000 EUR:
  spettano sia 1.200 EUR di trattamento sia il 5,3% di somma). L'alternatività esiste
  invece tra somma (c. 4) e ulteriore detrazione (c. 6): spartiacque a 20.000 EUR di
  reddito complessivo (Circolare 4/E/2025, pp. 17–18, sul conguaglio incrociato).

### 2.3 Ulteriore detrazione (L. 207/2024, art. 1, comma 6) — leva: DETRAZIONE

Fonte primaria: L. 207/2024, art. 1, comma 6, testo citato integralmente nella Circolare
AdE 4/E/2025, nota 16, p. 11 (PDF, URL al § 2.2); su Normattiva il comma è leggibile
nella versione vigente al 30-06-2025:
[Normattiva, vigenza 30-06-2025](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207!vig=2025-06-30~art1).
Applicabile all'anno d'imposta 2026; abrogato con decorrenza dall'applicazione del nuovo
testo unico, 1° gennaio 2027 (§ 1.2).

Testo del comma 6 (dalla Circolare 4/E/2025, nota 16): ai «titolari di reddito di lavoro
dipendente di cui all'articolo 49 [TUIR], con esclusione di quelli indicati alla lettera
a) del comma 2 del medesimo articolo 49, che hanno un reddito complessivo superiore a
20.000 euro spetta un'ulteriore detrazione dall'imposta lorda, **rapportata al periodo di
lavoro**, di importo pari:
a) a 1.000 euro, se l'ammontare del reddito complessivo è superiore a 20.000 euro ma non a 32.000 euro;
b) al prodotto tra 1.000 euro e l'importo corrispondente al rapporto tra 40.000 euro,
diminuito del reddito complessivo, e 8.000 euro, se l'ammontare del reddito complessivo è
superiore a 32.000 euro ma non a 40.000 euro».

- **Formula del décalage** (32.000 < RC ≤ 40.000): `1.000 × (40.000 − RC) / 8.000` —
  continua ai due bordi: vale 1.000 a RC = 32.000 e 0 a RC = 40.000 («decresce
  progressivamente ... fino ad azzerarsi raggiunta la soglia dei 40.000 euro»,
  Circolare 4/E/2025, p. 12).
- **Soglie su quale grandezza**: reddito complessivo (con le regole del comma 9 e il
  «reddito di riferimento», § 2.2). La soglia inferiore dei 20.000 EUR non è un cliff
  della sola detrazione: sotto c'è la somma integrativa (vedi § 5, punto D4).
- **Classificazione per leva: DETRAZIONE.** «È necessario che il contribuente abbia una
  capienza in termini di imposta lorda e, in caso di capienza parziale di quest'ultima,
  il beneficio spetta entro tale limite»; si somma alle altre detrazioni e l'importo
  complessivo «è portato in diminuzione dell'imposta lorda fino a concorrenza della
  stessa». Fonte: Circolare 4/E/2025, p. 16. (Nel perimetro del prototipo la capienza è
  sempre integrale: a RC = 20.001 l'imposta lorda residua dopo la detrazione art. 13 è
  1.958,01 EUR > 1.000 EUR. [derivazione])

### 2.4 Detrazione per lavoro dipendente (art. 13 TUIR) — valori 2026 per il censimento

(Perimetro della issue #1; riportata qui perché il censimento delle discontinuità è unico
e vive in questo file.) Fonte primaria: art. 13, comma 1, TUIR (DPR 917/1986), testo
vigente — [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917!vig=~art13), anno 2026;
schema riepilogativo in Circolare 4/E/2025, § 1.1, p. 6.

- lett. a): **1.955 EUR** se RC ≤ 15.000 EUR; la detrazione effettivamente spettante
  «non può essere inferiore a 690 euro» (1.380 EUR per i rapporti a tempo determinato —
  non applicabile al prototipo, tempo indeterminato). Il valore 1.955 è a regime per
  effetto di L. 207/2024 art. 1 c. 2 lett. b (da 1.880 a 1.955).
- lett. b): **1.910 + 1.190 × (28.000 − RC) / 13.000** se 15.000 < RC ≤ 28.000.
- lett. c): **1.910 × (50.000 − RC) / 22.000** se 28.000 < RC ≤ 50.000; oltre 50.000: zero.
- comma 1.1: la detrazione è **aumentata di 65 EUR** se 25.000 < RC ≤ 35.000 (due soglie
  secche, vedi § 5).
- comma 6-bis: il RC per le detrazioni è al netto dell'abitazione principale (Circolare
  4/E/2025, p. 6; irrilevante nel prototipo).

Aliquote IRPEF 2026 usate nelle derivazioni: 23% fino a 28.000 EUR; 33% oltre 28.000 e
fino a 50.000 (L. 199/2025 art. 1 c. 3, § 1.1); 43% oltre. Fonte: art. 11 TUIR come
modificato; schema previgente in Circolare 4/E/2025 pp. 4–5.

---

## 3. Su quale grandezza si valuta ogni soglia (risposta al punto 1 della issue)

| Soglia | Valore | Grandezza su cui è definita | Fonte |
|---|---|---|---|
| Spettanza trattamento integrativo | RC ≤ 15.000 (e fascia 15.000–28.000) | **Reddito complessivo** (c.d. reddito di riferimento) | DL 3/2020 art. 1 c. 1; Circ. 4/E/2025 nota 8 |
| Capienza trattamento integrativo | imposta lorda > detrazione art. 13 − 75 | **Imposta lorda sui soli redditi di lavoro dipendente e assimilati** vs detrazione art. 13 (grandezze derivate) | DL 3/2020 art. 1 c. 1 |
| Spettanza somma integrativa | RC ≤ 20.000 | **Reddito complessivo** (regole c. 9) | L. 207/2024 art. 1 c. 4 |
| Percentuale somma integrativa (7,1/5,3/4,8) | 8.500 / 15.000 | **Reddito di lavoro dipendente** rapportato ad anno intero (c. 5) | L. 207/2024 art. 1 cc. 4–5 |
| Base di calcolo somma integrativa | — | **Reddito di lavoro dipendente effettivo** | L. 207/2024 art. 1 c. 4; Circ. 4/E/2025 p. 10 |
| Ulteriore detrazione | 20.000 < RC ≤ 40.000 (décalage da 32.000) | **Reddito complessivo** (regole c. 9) | L. 207/2024 art. 1 c. 6 |
| Detrazione art. 13 (scaglioni e +65) | 15.000 / 25.000 / 28.000 / 35.000 / 50.000 | **Reddito complessivo** (al netto abitazione principale, c. 6-bis) | art. 13 TUIR |

**Nessuna soglia è definita sulla RAL.** La RAL entra solo a monte, via contributi a
carico del dipendente (issue #2): nel prototipo `reddito di lavoro dipendente =
imponibile fiscale = RAL × (1 − 0,0919)`.

---

## 4. Conversione delle soglie in RAL

Aliquota contributiva IVS a carico del lavoratore (generalità dei dipendenti privati,
Fondo pensioni lavoratori dipendenti): **9,19%** — da 8,89% a 9,19% per effetto
dell'aumento di 0,30 punti dal 1° gennaio 2007 disposto dall'art. 1, c. 769, L. 296/2006.
Fonte primaria: Circolare INPS n. 23 del 24/01/2007 —
<https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?sVirtuaLURL=%2Fcircolari%2FCircolare+numero+23+del+24-1-2007.htm>
(anno 2007; ricostruzione completa, con conferma di vigenza 2026, nella ricerca della
issue #2: `docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md`).

Formula: `RAL = grandezza / 0,9081`. Tutte le soglie di questo file cadono sotto la
**prima fascia di retribuzione pensionabile 2026, 56.224,00 EUR** (Circolare INPS n. 6
del 30/01/2026, par. 5 — vedi ricerca issue #2), oltre la quale scatta l'aliquota
aggiuntiva dell'1%: l'aliquota piatta 9,19% è quindi adeguata per tutte le conversioni
di questo file (la più alta è RC 50.000 → RAL 55.060,02 < 56.224). I centesimi delle RAL
equivalenti dipendono dalle regole di arrotondamento dei contributi (issue #2): i valori
sotto sono indicativi al centesimo.

---

## 5. Censimento dei punti di discontinuità (reddito → erogazioni/detrazioni)

Esclusi: gli scalini di esenzione delle addizionali regionale e comunale, censiti dalla
issue #3. Tutti i valori derivati usano le fonti dei §§ 2–4; RC = reddito complessivo,
R_lav = reddito di lavoro dipendente (coincidenti nel prototipo).

### 5.1 Salti (soglie secche) — coppie a cavallo

| # | Punto | Grandezza propria | Coppia (grandezza) | Coppia (RAL ≈) | Effetto al passaggio (dal basso verso l'alto) |
|---|---|---|---|---|---|
| D1 | Capienza trattamento integrativo (derivato: imposta lorda 23%·RC > 1.955 − 75 = 1.880 ⇒ RC > 8.173,91) | imposta lorda vs detrazione − 75 | 8.173,91 → TI 0; 8.173,92 → TI 1.200,00 | 9.001,11 / 9.001,12 | **+1.200,00** (salto in su: nessuna non-monotonia) |
| D2 | Percentuale somma integrativa 7,1% → 5,3% | R_lav = 8.500 | 8.500,00 → 603,50; 8.501,00 → 450,55 | 9.360,20 / 9.361,30 | **−152,95** (netto scende) |
| D3 | Triplo punto a 15.000: (a) percentuale somma 5,3% → 4,8%; (b) fine spettanza piena TI; (c) salto art. 13 lett. a → b | R_lav e RC = 15.000 | somma: 795,00 → 720,05; TI: 1.200,00 → 0 (nel prototipo, § 2.1); detrazione art. 13: 1.955,00 → 3.099,88 (quoziente 0,9999 troncato) | 16.518,00 / 16.519,10 | somma −74,95; TI −1.200,00; IRPEF netta −1.144,65 (da 1.495,00 a 350,35) ⇒ **netto ≈ −130** |
| D4 | Spartiacque somma ↔ ulteriore detrazione | RC = 20.000 | somma: 960,00 → 0; ulteriore detrazione: 0 → 1.000,00 (capienza piena, § 2.3) | 22.024,00 / 22.025,11 | −960,00 di erogazione esente, +1.000,00 di detrazione ⇒ **≈ +40**: monotono |
| D5 | Inizio maggiorazione 65 EUR (art. 13 c. 1.1) | RC = 25.000 | detrazione: +0 → +65,00 | 27.530,01 / 27.531,11 | **+65,00** (salto in su: monotono) |
| D6 | Fine maggiorazione 65 EUR (art. 13 c. 1.1) | RC = 35.000 | detrazione: +65,00 → +0 | 38.542,01 / 38.543,11 | **−65,00** (netto scende) |

Derivazione di D1: la detrazione art. 13 per RC ≤ 15.000 è 1.955 (§ 2.4); la condizione
del DL 3/2020 art. 1 c. 1 richiede imposta lorda (23% · RC, primo scaglione) strettamente
superiore a 1.955 − 75 = 1.880 ⇒ RC > 1.880 / 0,23 = 8.173,913… Il punto non coincide
con nessuna soglia scritta in norma e si sposta se cambiano aliquota del primo scaglione,
detrazione lett. a) o l'importo di 75 EUR.

Punto derivato contiguo (non è un salto): a R_lav = 8.500 l'imposta lorda eguaglia la
detrazione (23% × 8.500 = 1.955): sotto, IRPEF netta = 0 (no tax area, «ampliamento fino
a 8.500 euro della no tax area», Circolare 4/E/2025 p. 5); sopra, IRPEF netta > 0 con
continuità. Coincide volutamente con D2.

### 5.2 Bordi dei décalage (continui: il ±1 non distingue nulla)

| Décalage | Bordo inferiore (grandezza → RAL ≈) | Bordo superiore (grandezza → RAL ≈) | Fonte |
|---|---|---|---|
| Detrazione art. 13 lett. b (1.910 + 1.190·(28.000−RC)/13.000) | RC 15.000 → 16.518,00 (qui però c'è il **salto** D3) | RC 28.000 → 30.833,61 (raccordo continuo con lett. c: 1.910 da entrambi i lati) | art. 13 TUIR (§ 2.4) |
| Detrazione art. 13 lett. c (1.910·(50.000−RC)/22.000) | RC 28.000 → 30.833,61 | RC 50.000 → 55.060,02 (**punto di azzeramento**, continuo) | art. 13 TUIR (§ 2.4) |
| Ulteriore detrazione (1.000·(40.000−RC)/8.000) | RC 32.000 → 35.238,41 (raccordo continuo con l'importo fisso 1.000) | RC 40.000 → 44.048,01 (azzeramento continuo) | L. 207/2024 art. 1 c. 6 (§ 2.3) |

### 5.3 Dove il netto scende al crescere del lordo (non-monotonia)

Tre discese, tutte da soglie secche (valori dal § 5.1):

1. **R_lav 8.500 → 8.501** (RAL ≈ 9.360): −152,95 EUR di somma integrativa (D2);
2. **RC 15.000 → 15.001** (RAL ≈ 16.518): effetto combinato ≈ −130 EUR (D3 — la perdita
   di 1.200 EUR di trattamento integrativo è quasi compensata dal salto in su della
   detrazione art. 13);
3. **RC 35.000 → 35.001** (RAL ≈ 38.542): −65 EUR (D6).

Il passaggio dei 20.000 EUR (D4) è invece ≈ neutro-positivo: nessun avviso necessario.
Il calcolo degli estremi delle zone (la RAL alla quale il netto torna a superare quello
di soglia) è perimetro dell'implementazione a valle, come da issue.

---

## 6. Caso end-to-end di incapienza — RAL 8.500 EUR (anno intero, Milano)

Ogni valore è derivato dalle fonti citate; nessun valore è a memoria.

| Voce | Valore | Derivazione e fonte |
|---|---|---|
| Contributi a carico del dipendente | 781,15 | 8.500 × 9,19% (INPS Circ. 40/2011, § 4) |
| Reddito di lavoro dipendente = imponibile fiscale = RC | 7.718,85 | 8.500 − 781,15 |
| Imposta lorda | 1.775,34 | 23% × 7.718,85 (art. 11 TUIR, primo scaglione — § 2.4) |
| Detrazione art. 13 c. 1 lett. a | 1.955,00 (capiente fino a 1.775,34) | art. 13 TUIR (§ 2.4) |
| **IRPEF netta** | **0** | detrazione ≥ imposta lorda (sotto la no tax area di 8.500) |
| **Trattamento integrativo** | **0 — non spetta** | condizione di capienza: 1.775,34 NON è superiore a 1.955 − 75 = 1.880 (DL 3/2020 art. 1 c. 1, § 2.1); RC 7.718,85 < 8.173,92 = punto D1 |
| **Somma integrativa** | **548,04** (esente) | RC 7.718,85 ≤ 20.000 ⇒ spetta; R_lav annuo 7.718,85 ≤ 8.500 ⇒ 7,1% × 7.718,85 (L. 207/2024 art. 1 cc. 4–5, § 2.2) |
| Ulteriore detrazione | 0 | RC ≤ 20.000 (L. 207/2024 art. 1 c. 6) |
| Addizionale regionale | 0 — non dovuta | «L'addizionale regionale è dovuta se per lo stesso anno l'imposta sul reddito delle persone fisiche, al netto delle detrazioni per essa riconosciute e dei crediti di cui agli articoli 14 e 15 del citato testo unico, risulta dovuta» — qui IRPEF netta = 0. Fonte: D.Lgs. 446/1997 art. 50 c. 2, [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1997-12-15;446~art50) |
| Addizionale comunale | 0 — non dovuta | l'addizionale «è dovuta se per lo stesso anno risulta dovuta l'imposta sul reddito delle persone fisiche, al netto delle detrazioni per essa riconosciute e del credito di cui all'articolo 165» TUIR. Fonte: D.Lgs. 360/1998 art. 1 c. 4, [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1) |
| **Netto annuo** | **8.266,89** | 8.500 − 781,15 − 0 + 0 + 548,04 |

Il caso illustra la differenza di leva: l'erogazione «somma integrativa» arriva intera
nonostante l'incapienza totale; l'erogazione «trattamento integrativo» no, perché la sua
condizione di spettanza è costruita proprio sull'incapienza. Le aliquote ed esenzioni
locali (Lombardia, Milano) restano perimetro della issue #3: qui l'esonero discende già
dalla norma statale, prima ancora delle soglie locali.

---

## 7. Casi di test candidati

### Dalle fonti (esempi numerici svolti)

Circolare AdE 4/E del 16 maggio 2025, § 1.2 (PDF, URL al § 2.2):

1. **Esempio 1** (pp. 10–11): reddito complessivo 6.000; contratto 1/1–3/3/2025
   (62 giorni), reddito di lavoro dipendente 2.000. Reddito annuale teorico
   «11.744,19» = (2.000 : 62) × 365 ⇒ fascia 8.501–15.000 ⇒ 5,3%; **somma = 106**
   (5,3% × 2.000). ⚠ Nota di verifica: (2.000 : 62) × 365 = 11.774,19; il valore
   stampato in circolare (11.744,19) pare un refuso — la fascia e il risultato (106) non
   cambiano.
2. **Esempio 2** (p. 11): due contratti (62 + 30 giorni), redditi 2.000 + 1.000.
   Teorico 11.902,17 = (3.000 : 92) × 365 ⇒ 5,3%; **somma = 159** (5,3% × 3.000).
3. **Esempio 3** (pp. 13–14): impatriato, quota imponibile 4.500 + quota esente 10.500 ⇒
   RC (comma 9) = 15.000 ⇒ 5,3%; la percentuale si applica alla sola quota imponibile:
   **somma = 238,50** (5,3% × 4.500). (Fuori perimetro prototipo, utile come test della
   regola «percentuale sul teorico, importo sull'effettivo».)

### Coppie a cavallo (derivate dalle fonti, § 5.1)

4. R_lav 8.500 → somma 603,50; R_lav 8.501 → somma 450,55 (RAL ≈ 9.360,20 / 9.361,30).
5. RC 8.173,91 → TI 0; RC 8.173,92 → TI 1.200 (RAL ≈ 9.001,11 / 9.001,12) — punto
   derivato, sensibile ad aliquota primo scaglione, detrazione lett. a e importo 75.
6. RC 15.000 → {somma 795,00; TI 1.200; detrazione art. 13 1.955,00};
   RC 15.001 → {somma 720,05; TI 0; detrazione art. 13 3.099,88, quoziente 0,9999
   troncato a 4 decimali ex art. 13 c. 6 TUIR}
   (RAL ≈ 16.518,00 / 16.519,10).
7. RC 20.000 → {somma 960,00; ulteriore detrazione 0};
   RC 20.001 → {somma 0; ulteriore detrazione 1.000,00} (RAL ≈ 22.024,00 / 22.025,11).
8. RC 25.000 → +0; RC 25.001 → +65 (art. 13 c. 1.1; RAL ≈ 27.530,01 / 27.531,11).
9. RC 32.000 → ulteriore detrazione 1.000,00; RC 32.001 → 999,88 (bordo continuo del
   décalage; RAL ≈ 35.238,41).
10. RC 35.000 → +65; RC 35.001 → +0 (RAL ≈ 38.542,01 / 38.543,11).
11. RC 40.000 → ulteriore detrazione 0 (azzeramento continuo; RAL ≈ 44.048,01).
12. RC 50.000 → detrazione art. 13 = 0 (azzeramento continuo; RAL ≈ 55.060,02).
13. End-to-end RAL 8.500 (§ 6): IRPEF netta 0, TI 0, somma 548,04, addizionali 0,
    netto 8.266,89.

---

## 8. Lacune

1. **Articolo di abrogazione/decorrenza del D.Lgs. 117/2026**: le pagine GU e Normattiva
   dell'atto non hanno restituito il testo degli articoli finali (365–377, «Disposizioni
   transitorie e finali»). L'applicazione dal 1° gennaio 2027 è confermata da FiscoOggi
   (testata dell'Agenzia delle Entrate) e la nota di vigenza Normattiva sulla
   L. 207/2024 marca l'abrogazione del comma 6; il numero d'articolo e il testo esatto
   della decorrenza restano da estrarre dal PDF in Gazzetta se servirà citarli.
2. ~~Aliquota contributiva 9,19%~~ **Risolta dalla ricerca della issue #2**
   (`docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md`): 9,19% =
   8,89% + 0,30 punti dal 1-1-2007 (art. 1 c. 769 L. 296/2006; Circolare INPS
   23/2007), vigente nel 2026. Il § 4 di questo file è allineato a quella
   ricostruzione. Resta l'avvertenza settoriale: nelle aziende soggette a CIGS il
   dipendente paga anche lo 0,30% (scelta registrata in `docs/ASSUNZIONI.md`).
3. ~~Massimale contributivo 2026 e soglia dell'aliquota aggiuntiva 1%~~ **Risolta
   dalla ricerca della issue #2**: prima fascia 56.224,00 EUR, massimale 122.295,00
   EUR (Circolare INPS 6/2026, par. 5-6). Tutte le conversioni in RAL di questo file
   cadono sotto la prima fascia: l'aliquota piatta 9,19% usata resta valida.
4. **Scansione della L. 199/2025 limitata al pacchetto IRPEF iniziale** dell'art. 1
   (973 commi totali): nessuna modifica alle misure trovata nei commi verificati, con
   conferma indiretta dall'abrogazione del comma 6 solo dal 2027; una scansione
   integrale dei 973 commi non è stata fatta.
5. **Regole di arrotondamento** (troncamento vs arrotondamento al centesimo per
   percentuali, detrazioni, imposta): non disciplinate nelle fonti lette; i centesimi
   delle coppie a cavallo e delle RAL equivalenti vanno consolidati in implementazione.
6. **Aliquote ed esenzioni delle addizionali Lombardia/Milano**: perimetro della
   issue #3; qui è citata solo la norma statale di esonero per IRPEF netta zero.

---

## Fonti (tutte primarie, aperte l'11-08-2026)

- DL 5-2-2020 n. 3, art. 1 (testo vigente): <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1>
- L. 30-12-2024 n. 207, art. 1 (testo vigente e vigenza 30-06-2025): <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1> e <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207!vig=2025-06-30~art1>
- Circolare Agenzia delle Entrate n. 4/E del 16-5-2025: <https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91>
- Art. 13 TUIR, DPR 917/1986 (testo vigente): <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917!vig=~art13>
- L. 30-12-2025 n. 199 (bilancio 2026): <https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/SG> e <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-12-30;199~art1>
- D.Lgs. 19-6-2026 n. 117 (nuovo TU imposte sui redditi): <https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg>; FiscoOggi (AdE): <https://www.fiscooggi.it/portale/-/esordio-ufficiale-per-il-nuovo>
- INPS, Circolare n. 40 del 22-02-2011 (aliquota 9,19%): <https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2011.02.circolare-numero-40-del-22-02-2011_5989.html>
- D.Lgs. 446/1997, art. 50 (addizionale regionale): <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1997-12-15;446~art50>
- D.Lgs. 360/1998, art. 1 (addizionale comunale): <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1>
