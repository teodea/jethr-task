# Giorni del rapporto e ragguaglio al periodo di detrazioni ed erogazioni

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-11

## La domanda (issue #20, teodea/jethr-task)

Il prototipo assume il rapporto in essere per l'anno intero. Introducendo data di
inizio e data di fine, cinque domande:

1. **Unità di misura**: i giorni che danno diritto alla detrazione per lavoro
   dipendente sono giorni di calendario o giorni lavorati? Denominatore 365 o 366
   negli anni bisestili?
2. **Il minimo di 690 EUR** (art. 13 c. 1 lett. a, tempo indeterminato) si
   rapporta ai giorni o è un pavimento assoluto?
3. **Le erogazioni**: trattamento integrativo, somma integrativa e ulteriore
   detrazione si rapportano al periodo come la detrazione, o hanno regole proprie?
4. **Le soglie di reddito** (15.000, 20.000, 32.000, 40.000…) si valutano sul
   reddito effettivamente percepito nel periodo o su un reddito ragguagliato ad
   anno? — il punto che decide la forma della cascata.
5. **I contributi**: il minimale contributivo si rapporta ai giorni, e con quale
   conteggio? Da cosa si frazionano le 312 giornate di `src/costanti/2026.js`?

---

## 1. L'unità di misura: giorni di calendario, denominatore 365 (punto 1)

### 1.1 La norma: «rapportata al periodo di lavoro nell'anno»

L'art. 13, comma 1, TUIR (DPR 917/1986) dispone che la detrazione spetta
«rapportata al periodo di lavoro nell'anno» — il testo non contiene alcun
riferimento a giorni né al numero 365: la regola di conteggio è tutta nella
prassi. Fonte: Normattiva, testo vigente,
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=>, anno 2026.

### 1.2 La prassi: giorni di calendario compresi nel rapporto, festivi e ferie inclusi

**Certificazione Unica 2026, istruzioni, punto 6** (Dati fiscali): «va indicato il
numero dei giorni compresi nel periodo di durata del rapporto di lavoro per i
quali il percipiente ha diritto alla detrazione di cui all'art. 13, comma 1 del
TUIR»; in caso di più redditi conguagliati la somma dei giorni «non deve eccedere
giorni 365». Il punto 11 marca con il codice 2 il caso in cui «nel periodo di
lavoro sono presenti giorni per i quali non sono previste detrazioni (ad es.
periodo di aspettativa non retribuita)»: la sottrazione è l'eccezione, il
calendario è la regola. Fonte: Agenzia delle Entrate, istruzioni CU 2026
definitive (agg. 24/02/2026), p. 25 del PDF,
<https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istr_2026_agg+24+02.pdf/4184818b-05a3-acce-5956-70811c7d2233?t=1771947585334>, anno 2026
(virgolettati riscontrati sul PDF definitivo, identici alla bozza internet).

**Istruzioni 730/2026, rigo C5** (periodo di lavoro), colonna 1: indicare i giorni
del periodo di lavoro «(365 per l'intero anno)», riportando il punto 6 della CU;
se il datore non ha rilasciato la CU, determinare il numero «tenendo conto che
vanno in ogni caso compresi le festività, i riposi settimanali e gli altri giorni
non lavorativi e che vanno sottratti i giorni per cui non spetta alcuna
retribuzione, neanche differita (ad esempio, in caso di assenza per aspettativa
senza corresponsione di assegni)». Le ferie sono retribuite: rientrano nei giorni
compresi. Fonte: Agenzia delle Entrate, istruzioni 730/2026 (agg. 28/05/2026),
<https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734>,
anno 2026 (riferite all'anno d'imposta 2025; art. 13 invariato nel 2026 —
`docs/ricerca/irpef-scaglioni-e-detrazione-lavoro-dipendente.md`).

**Risposta netta**: giorni di **calendario** compresi fra data di inizio e data di
fine del rapporto — sabati, domeniche, festivi e ferie inclusi — meno i soli
giorni senza diritto ad alcuna retribuzione, neppure differita. Non giorni
lavorati.

### 1.3 Part-time: i giorni spettano per l'intera durata

Stesso rigo C5 delle istruzioni 730/2026: «se il rapporto di lavoro è part-time
(nel senso che la prestazione lavorativa viene resa per un orario ridotto) i
giorni possono essere considerati per l'intero periodo di lavoro» (fonte al
§ 1.2). È la fonte generale che la riga «Tempo pieno» di `docs/ASSUNZIONI.md`
citava per prassi: l'orario ridotto — orizzontale o verticale — non riduce i
giorni di detrazione. L'unica riduzione proporzionale prevista è per i contratti
a tempo determinato con prestazioni «a giornata» (edili, braccianti): festività,
riposi e giorni non lavorativi si contano «proporzionalmente al rapporto
esistente tra le giornate effettivamente lavorate e quelle previste come
lavorative dai contratti collettivi», con arrotondamento all'unità successiva —
istruzioni 730/2026, Appendice, «Periodo di lavoro - Casi particolari», p. 139
(fonte al § 1.2). Fuori dal perimetro del prototipo (tempo indeterminato).

### 1.4 Denominatore: 365 anche negli anni bisestili

- Circolare AdE n. 29/E del 14/12/2020, p. 14: «la detrazione spettante ai sensi
  dell'articolo 13 del TUIR è calcolata in ragione del periodo di lavoro che,
  qualora sia riferito all'intero anno solare, è **sempre pari a 365 giorni,
  indipendentemente dalla circostanza che l'anno solare sia bisestile**» (detto a
  proposito del 2020, bisestile: il semestre 1/1–30/6/2020 vale al massimo 181
  giorni, non 182). Fonte:
  <https://www.agenziaentrate.gov.it/portale/documents/20143/2957155/Circolare+n.+29E+del+14+dicembre+2020.pdf/61cbef4d-5db8-9968-e28d-be33343879f5>, anno 2020.
- C.M. n. 326/E del 23/12/1997, § 3.3 (periodo di paga): «Per l'applicazione
  della ritenuta, l'anno si deve intendere suddiviso in 12 mesi, 24 quindicine,
  52 settimane e **365 giorni (anche negli anni bisestili)**». Fonte: Ministero
  delle Finanze, C.M. 326/E, pubblicata in GU SG n. 303 del 30/12/1997,
  <https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=1997-12-30&atto.codiceRedazionale=97A10414>
  (testo letto da copia del Servizio di documentazione tributaria — vedi Lacune), anno 1997.
- Il tetto dei 365 giorni per anno d'imposta vale anche cumulando più rapporti:
  «in ogni caso non spettano detrazioni per un periodo superiore a 365 giorni per
  ogni anno d'imposta» — Circolare AdE n. 67/E del 06/07/2001 (stessa copia, vedi
  Lacune), anno 2001; conferma operativa nelle istruzioni CU 2026 (§ 1.2).

**Risposta netta**: denominatore fisso **365**, anche negli anni bisestili; un
anno bisestile intero vale comunque 365/365. La formula operativa è
`detrazione(RC) × giorni / 365` — istruzioni Redditi PF 2026, Fascicolo 1, rigo
RN7 col. 1, p. 141: «Detrazione = 1.955 x N. Giorni Lav. Dip / 365» (fascia a) e
«[1910 + (1190 x Quoziente)] x N. Giorni Lav. Dip / 365» (fascia b). Fonte:
<https://www.agenziaentrate.gov.it/portale/documents/d/guest/pf1_istruzioni_2026_agg-28-05-2026>, anno 2026.

---

## 2. Il minimo di 690 EUR: pavimento assoluto, non rapportato (punto 2)

Testo dell'art. 13, c. 1, lett. a), TUIR: «1.955 euro, se il reddito complessivo
non supera 15.000 euro. L'ammontare della detrazione **effettivamente spettante**
non può essere inferiore a 690 euro. Per i rapporti di lavoro a tempo
determinato, l'ammontare della detrazione effettivamente spettante non può essere
inferiore a 1.380 euro» (Normattiva, URL al § 1.1, anno 2026). «Effettivamente
spettante» = dopo il ragguaglio ai giorni: il minimo è il pavimento del
risultato, non un importo da rapportare a sua volta.

Doppia conferma di prassi:

- Circolare AdE n. 4/E del 18/02/2022, § 1.1: «tali misure minime competono
  laddove superiori al risultato derivante dal calcolo di ragguaglio al periodo
  di spettanza nell'anno». Fonte:
  <https://www.agenziaentrate.gov.it/portale/documents/20143/4169770/Circolare+n.+4+del+18+febbraio+2022.pdf/a83fd984-2bc3-39a9-1e09-79e9a870d401>, anno 2022.
- Istruzioni PF 2026, rigo RN7 (p. 141): prima si calcola `1.955 × giorni / 365`,
  poi «se la detrazione così determinata è inferiore ad euro 690 e il reddito di
  lavoro dipendente deriva da un rapporto a tempo indeterminato ... la detrazione
  spettante è pari ad euro 690» (URL al § 1.4).

**Risposta netta**: pavimento **assoluto**. Con anno intero non scatta mai
(1.955 > 690); scatta per rapporti brevi nella fascia a: sotto
690/1.955 × 365 ≈ **129 giorni** il ragguaglio scenderebbe sotto 690 e il
pavimento lo rialza. [derivazione]

Nota contigua (stessa circolare 4/E/2022): la **maggiorazione di 65 EUR**
(art. 13 c. 1.1, 25.000 < RC ≤ 35.000) «deve essere corrisposto ... per intero
..., senza effettuare alcun ragguaglio al periodo di lavoro nell'anno» — è un
correttivo che si somma **dopo** il riproporzionamento (il chiarimento è reso per
il 2022 sul correttivo allora vigente; la nota 8 della circolare lo àncora alla
regola generale degli importi correttivi). Coerente con la sequenza operativa PF
2026 (pp. 140–141), dove il ×giorni/365 sta dentro le formule di fascia e i 65 euro si
aggiungono fuori. Stessa struttura nel testo dell'art. 13 c. 1.1, che non ripete
la clausola di ragguaglio del comma 1.

---

## 3. Le tre erogazioni: sì/no al ragguaglio, misura per misura (punto 3)

| Misura | Importo rapportato al periodo? | Fonte |
|---|---|---|
| Trattamento integrativo (DL 3/2020) | **SÌ** — l'importo di 1.200 EUR si rapporta ai giorni su 365 | DL 3/2020 art. 1 c. 2; Circ. 29/E/2020 |
| Somma integrativa (L. 207/2024 c. 4) | **NO** — nessun ragguaglio dell'importo: è una percentuale del reddito effettivo, che scala da sé; il ragguaglio ad anno esiste solo per scegliere la percentuale (c. 5) | L. 207/2024 art. 1 cc. 4–5; Circ. 4/E/2025 |
| Ulteriore detrazione (L. 207/2024 c. 6) | **SÌ** — «rapportata al periodo di lavoro» | L. 207/2024 art. 1 c. 6; Circ. 4/E/2025 |

### 3.1 Trattamento integrativo — SÌ

- Norma: «Il trattamento integrativo di cui al comma 1 è **rapportato al periodo
  di lavoro** e spetta per le prestazioni rese dal 1° luglio 2020» — DL 3/2020,
  art. 1, c. 2, Normattiva, testo vigente,
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1>, anno 2026.
  Conferma la dicitura «rapportato al periodo (anno intero nel prototipo)» già in
  `src/costanti/2026.js`.
- Meccanica: «L'importo del bonus Irpef, stabilito su base annuale, per il 2020
  deve essere quindi determinato dividendo per 365 e moltiplicando per il numero
  dei giorni lavorati nel primo semestre 2020, fino ad un massimo di 181
  giorni» — Circ. 29/E/2020, p. 14 (URL al § 1.4; detto per il semestre
  1/1–30/6/2020, regola generale del rapporto su base annua). La lettera «giorni
  lavorati» non va letta come giornate di effettivo lavoro, e la lettura
  calendario si argomenta dalla stessa pagina, non per omissione: poche righe
  sopra la circolare enuncia la regola come «rapportando **i giorni che danno
  diritto all'agevolazione** al numero dei giorni dell'anno solare», e deriva il
  tetto dei 181 giorni del semestre proprio dal conteggio dei giorni di
  detrazione ex art. 13 (§ 1.4) — 181 sono i giorni di **calendario**
  dell'1/1–30/6 (31+29+31+30+31+30 = 182, capped a 181 dal denominatore 365),
  un numero che nessun conteggio di giornate lavorate produce. «Giorni
  lavorati» è quindi il numero dei giorni di detrazione del periodo: giorni di
  calendario del rapporto (§ 1.2).
- Anche il correttivo della condizione di capienza si rapporta: la detrazione
  art. 13 c. 1 è «diminuita dell'importo di 75 euro **rapportato al periodo di
  lavoro nell'anno**» — DL 3/2020 art. 1 c. 1 (Normattiva, URL sopra), come
  modificato da L. 207/2024 art. 1 c. 3; Circ. AdE 4/E del 16/05/2025, § 1.1,
  pp. 7–8, <https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91>, anno 2025 (misura a regime, vigente 2026:
  `docs/ricerca/trattamento-integrativo-somma-integrativa-ulteriore-detrazione.md`, § 1).
  E poiché nel confronto entrano la detrazione rapportata, il −75 rapportato e
  l'imposta lorda sul reddito del periodo, la soglia derivata di capienza (punto
  D1 della ricerca issue #4) resta al suo posto in termini di reddito effettivo. [derivazione]

### 3.2 Somma integrativa — NO (con l'unico ragguaglio sul c. 5, in direzione opposta)

- L'importo non ha clausola di ragguaglio: il c. 4 riconosce «una somma ...
  determinata applicando al reddito di lavoro dipendente del contribuente la
  percentuale corrispondente» (7,1% / 5,3% / 4,8%) — L. 207/2024, art. 1, c. 4,
  testo integrale in Circ. 4/E/2025, nota 11, p. 9 (URL al § 3.1). Una
  percentuale del reddito **effettivamente percepito** scala da sé con il
  periodo: rapportarla ai giorni la ridurrebbe due volte.
- L'unico ragguaglio è al c. 5 e serve a **individuare la percentuale**, non a
  ridurre l'importo: «Ai soli fini dell'individuazione della percentuale
  applicabile ai sensi del comma 4 il reddito di lavoro dipendente è rapportato
  all'intero anno» — L. 207/2024, art. 1, c. 5, Normattiva
  (<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1>, anno 2026).
- Procedimento in tre passi, Circ. 4/E/2025, p. 10: calcolare il «reddito annuale
  teorico» (reddito percepito ÷ giorni × 365); determinare con esso la
  percentuale; «applicare detta percentuale al reddito di lavoro dipendente
  effettivamente percepito nell'anno». Nota 15: le relazioni alla legge precisano
  «che la percentuale è determinata in base al reddito da lavoro dipendente
  rapportato all'intero anno ed è applicata al reddito da lavoro dipendente
  dichiarato». Esempio 1 (pp. 10–11): 62 giorni (1/1–3/3), reddito 2.000, teorico
  (2.000÷62)×365 ⇒ fascia 5,3% ⇒ somma 106 = 5,3% × 2.000 — l'importo non è
  ulteriormente rapportato. I giorni del divisore sono i giorni di lavoro
  dipendente del § 1 (62 = giorni di calendario dal 1/1 al 3/3), e la CU 2026 li
  fa transitare nel punto 721 «numero dei giorni di lavoro già indicato al campo
  6» proprio per questo calcolo (istruzioni CU 2026 definitive, p. 51 del PDF,
  URL al § 1.2).
- Il ragguaglio del c. 5 lavora **contro** il lavoratore part-year nella scelta
  della percentuale (un mezzo anno da 13.600 EUR ha teorico ~27.000 ⇒ 4,8%, non
  5,3%), mentre l'assenza di ragguaglio dell'importo lavora a favore: due regole
  distinte, da non fondere in un unico coefficiente.

### 3.3 Ulteriore detrazione — SÌ

Testo del c. 6: «spetta un'ulteriore detrazione dall'imposta lorda, **rapportata
al periodo di lavoro**, di importo pari: a) a 1.000 euro, se l'ammontare del
reddito complessivo è superiore a 20.000 euro ma non a 32.000 euro; b) al
prodotto tra 1.000 euro e l'importo corrispondente al rapporto tra 40.000 euro,
diminuito del reddito complessivo, e 8.000 euro ...» — L. 207/2024, art. 1,
c. 6, testo integrale in Circ. 4/E/2025, nota 16, p. 11, ribadito nel corpo:
«Tale detrazione, rapportata al periodo di lavoro nell'anno, è di importo pari
a...» (p. 12; URL al § 3.1). Quindi: `1.000 × giorni / 365` (o il décalage ×
giorni/365).

**Vigenza 2026, da fonte primaria.** Il nuovo Testo unico delle imposte sui
redditi (D.Lgs. 19 giugno 2026, n. 117, GU SG n. 152 del 03/07/2026, S.O.
n. 26/L) abroga il c. 6 nelle Disposizioni transitorie e finali, art. 376
(«Abrogazioni»), c. 1: «Dalla data di cui all'articolo 377 sono abrogate le
seguenti disposizioni: ... pppppp) articolo 1, commi 6, 14, 15, 16, 17, 24, 98,
169, terzo periodo, 354, 390, 399 e 400, della legge 30 dicembre 2024, n. 207»
(pp. 324 e 328 del S.O.); e l'art. 377 («Decorrenza»), c. 1, fissa la data:
«Le disposizioni del presente testo unico si applicano a decorrere dal 1°
gennaio 2027» (p. 328). Il c. 6 resta dunque in vigore per tutto il 2026.
Fonte: PDF GU, <https://www.gazzettaufficiale.it/eli/gu/2026/07/03/152/so/26/sg/pdf>
(pagina di riferimento
<https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg>), anno 2026.
Nota di link: la pagina Normattiva a vigenza corrente espone sul c. 6
l'annotazione di abrogazione da D.Lgs. 117/2026; il testo del comma si legge al
permalink con vigenza anteriore esplicita, verificato oggi (serve il testo con
«spetta un'ulteriore detrazione dall'imposta lorda, rapportata al periodo di
lavoro»):
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-06-30>.

---

## 4. Le soglie si valutano sul reddito effettivo, non ragguagliato (punto 4)

**Risposta netta: sul reddito complessivo effettivamente percepito nell'anno.
Nessuna soglia si ragguaglia ad anno.** Il ragguaglio riguarda gli **importi**
(detrazione art. 13, trattamento integrativo, ulteriore detrazione, il −75), mai
le **soglie**. Tre prove:

1. **Il testo delle norme.** Tutte le soglie sono scritte sul «reddito
   complessivo» (art. 13 c. 1 TUIR; DL 3/2020 art. 1 c. 1: «se il reddito
   complessivo non è superiore a 15.000 euro»; L. 207/2024 art. 1 cc. 4 e 6),
   che per l'art. 8 TUIR è la somma dei redditi dell'anno — una grandezza
   effettiva. L'unico ragguaglio ad anno scritto in tutto il pacchetto è quello
   del c. 5 della L. 207/2024, che si autolimita: «**ai soli fini**
   dell'individuazione della percentuale». A contrario: dove il legislatore
   voleva un reddito teorico, l'ha scritto; le soglie non lo dicono.
2. **La struttura del c. 4: la scala delle percentuali è aperta verso l'alto.**
   La lett. c) fissa il 4,8% per il reddito di lavoro dipendente «superiore a
   15.000 euro» senza tetto superiore; il limite dei 20.000 sta solo nella
   condizione di spettanza, scritta sul reddito complessivo (L. 207/2024, art. 1,
   c. 4, Normattiva, URL al § 3.2). È il binario su cui viaggia il caso
   discriminante: un part-year con reddito complessivo effettivo sotto 20.000 e
   teorico sopra (es. § 7.1: RC 13.621,50, teorico ≈ 27.021) trova nella lett. c)
   la sua percentuale — la norma prevede da sé che il teorico superi 20.000 senza
   che la spettanza ne sia toccata. Se la soglia si valutasse sul ragguagliato,
   quel caso darebbe zero e la lett. c) sopra i 20.000 di teorico non troverebbe
   mai applicazione. [lettura sistematica] (L'Esempio 1 della Circ. 4/E/2025,
   pp. 10–11, è coerente ma non discriminante: lì anche il teorico, 11.744,19,
   resta sotto 20.000.)
3. **Le istruzioni operative.** PF 2026, rigo RN7: le fasce si scelgono sul
   «Reddito per detrazioni = Rigo RN1 col. 1 − rigo RN2» — il reddito complessivo
   dichiarato dell'anno, effettivo (p. 140, URL al § 1.4). Nessun passaggio di
   annualizzazione, mentre il ×giorni/365 compare subito dopo, sull'importo.

**Conseguenza sulla forma della cascata** (il «perché serve» della issue): con
data di inizio/fine, il reddito complessivo effettivo scende, e con lui **la
fascia**. Chi lavora metà anno a RAL 30.000 ha RC ≈ 13.622: entra nella platea
del trattamento integrativo (≤ 15.000) e della somma integrativa (≤ 20.000), esce
da quella dell'ulteriore detrazione (> 20.000) e dalla maggiorazione dei 65
(> 25.000). Le voci cambiano di **stato**, non solo di importo: la cascata con
periodo non è la cascata annua moltiplicata per giorni/365 (vedi § 7). L'unica
eccezione, in senso opposto, è la percentuale della somma integrativa (§ 3.2).

---

## 5. Il minimale contributivo: giornaliero, si fraziona per giornate retribuite (punto 5)

### 5.1 La regola

Il minimale è **giornaliero** per legge: «il limite minimo di retribuzione
giornaliera, ivi compresa la misura minima giornaliera dei salari medi
convenzionali, per tutte le contribuzioni dovute in materia di previdenza e
assistenza sociale, non può essere inferiore» a una percentuale del trattamento
minimo mensile di pensione FPLD in vigore al 1° gennaio — art. 7, c. 1, secondo
periodo, D.L. 463/1983 conv. L. 638/1983 (percentuale elevata al 9,5% dal
1/1/1989 dall'art. 1, c. 2, D.L. 338/1989). Fonte: Normattiva, testo vigente,
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:1983-09-12;463~art7!vig=>, anno 2026.
Valore 2026: **58,13 EUR/giorno** (9,5% di 611,85) — Circolare INPS n. 6 del
30/01/2026, par. 1: i limiti giornalieri rivalutati «devono essere ragguagliati a
58,13 euro (9,5% dell'importo del trattamento minimo mensile di pensione a carico
del Fondo pensioni lavoratori dipendenti in vigore al 1° gennaio 2026, pari a
611,85 euro mensili) se di importo inferiore». Fonte: PDF ufficiale della
circolare (allegato della pagina di dettaglio INPS), letto direttamente qui,
<https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/01/Circolare_15151/Allegati/16546_Circolare-numero-6-del-30-01-2026.pdf>, anno 2026
(pagina di dettaglio:
<https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html>;
conferma la lettura di `docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md`).

Essendo un limite **per giornata retribuita**, per un rapporto infrannuale il
pavimento del periodo è `58,13 × giornate retribuite del periodo`: si fraziona da
sé con la durata del rapporto. Non esiste un «minimale annuo» normativo da
rapportare su 365.

### 5.2 Le 312 giornate e il loro frazionamento

Le 312 giornate in `src/costanti/2026.js` sono 52 settimane × 6 giornate, ovvero
26 giornate × 12 mesi. La convenzione ha due ancoraggi di fonte primaria:

- **26 giornate/mese per i mensilizzati.** Per i dipendenti «retribuiti
  periodicamente in misura predeterminata, fissata cioè a prescindere dalle
  giornate o dalle ore effettivamente lavorate», le giornate retribuite da
  esporre nel DM 10/M — «da valere a tutti gli effetti (minimali,
  fiscalizzazione, ecc.)» — sono, «nel sistema di paga mensile, pari a 26, anche
  quando nel mese risultino giornate effettivamente lavorate in numero superiore
  o inferiore a tale limite»; nei mesi non interamente retribuiti (assunzione,
  cessazione, assenze senza retribuzione) si opera «detraendo sempre da 26 il
  numero delle giornate non retribuite». Fonte: INPS, Lettera-Circolare n. 1 del
  07/01/1988 («Fiscalizzazione degli oneri sociali. Chiarimenti»), punto a),
  versione testuale sul servizio Bussola INPS,
  <https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?svirtualurl=%2Fcircolari%2Fcircolare+numero+1+del+7-1-1988.htm>, anno 1988
  (la versione testuale rende gli accenti come apostrofi — «cioe'» —
  normalizzati qui).
- **La stessa convenzione nel flusso vigente.** Il documento tecnico Uniemens
  definisce `<GiorniRetribuiti>` come «Numero dei giorni retribuiti nel mese,
  determinato avendo a riferimento, per ciascuna settimana, il numero delle
  giornate per le quali è stabilita contrattualmente la corresponsione della
  retribuzione» (p. 55) e nell'esempio ufficiale di un mese interamente coperto
  espone `<GiorniRetribuiti>26</GiorniRetribuiti>` (p. 75). Fonte: INPS,
  Documento tecnico Uniemens (individuale), versione 4.32 del 30/04/2026,
  <https://www.inps.it/content/dam/inps-site/pdf/prestazioni-e-servizi/uniemens-aziende-private/UniEMENSind.pdf>, anno 2026.

Le **6 giornate settimanali** anche in regime di settimana corta (gestioni
private, orario normale di 40 ore) restano testimoniate dalla formula del
minimale orario part-time: «58,13 euro x 6/40 = 8,72 euro» — Circolare INPS
6/2026, par. 4, riscontrata qui sul PDF ufficiale (URL al § 5.1). Lo stesso
paragrafo espone la variante della Gestione pubblica, «58,13 euro x 5/36 = 8,07
euro» (36 ore su cinque giorni): il «6» non è un numero magico ma le giornate di
lavoro settimanale ad orario normale (art. 11, c. 1, D.Lgs. 81/2015, citato alla
nota 9 della circolare).

La regola di frazionamento per un rapporto part-year è quindi **per giornate
retribuite** — 26 per ogni mese intero di rapporto e, per il mese parziale, 26
meno le giornate non retribuite (Lettera-Circolare 1/1988) — **non** per giorni
di calendario su 365. Le due unità di misura convivono nella stessa cascata: 184
giorni di calendario di detrazione e 156 giornate contributive per lo stesso
semestre (vedi § 7).

### 5.3 Il minimale morde con un rapporto breve?

**No, non per effetto della sola durata — e questo corregge l'aspettativa della
issue.** Con retribuzione proporzionale al periodo (RAL × mesi/12) e giornate
proporzionali (26 × mesi), la retribuzione giornaliera è `RAL / 312` qualunque
sia la durata: il minimale morde se e solo se `RAL < 58,13 × 312 =
18.136,56 EUR`, esattamente come per l'anno intero. [derivazione] Ciò che il
rapporto breve rompe è la **validazione**: l'importo annuo percepito da un
part-year con RAL piena (es. 15.000 su mezzo anno a RAL 30.000) sta sotto il
minimale annualizzato 18.136,56 senza che il minimale morda — il confronto va
fatto sul periodo (`percepito del periodo` vs `58,13 × giornate del periodo`) o,
equivalentemente, sulla RAL annua pattuita. La riga del registro «per un tempo
pieno con RAL da CCNL non morde mai» resta vera anche part-year, a parità di RAL
pattuita plausibile.

---

## 6. Sintesi operativa: cosa si rapporta e cosa no

| Grandezza | Si rapporta al periodo? | Come | Fonte |
|---|---|---|---|
| Detrazione art. 13 c. 1 | sì | × giorni di calendario / 365 | art. 13 c. 1 TUIR; PF 2026 rigo RN7 (§ 1) |
| Minimo 690 (t. indeterminato) | no | pavimento assoluto sul risultato rapportato | art. 13 c. 1 lett. a; Circ. 4/E/2022 (§ 2) |
| Maggiorazione 65 | no | per intero, senza ragguaglio | Circ. 4/E/2022 (§ 2) |
| Trattamento integrativo (1.200) | sì | × giorni / 365 | DL 3/2020 art. 1 c. 2; Circ. 29/E/2020 (§ 3.1) |
| Correttivo −75 della capienza | sì | × giorni / 365 | DL 3/2020 art. 1 c. 1 (§ 3.1) |
| Somma integrativa | no (importo) | percentuale × reddito effettivo; percentuale scelta sul teorico = effettivo ÷ giorni × 365 | L. 207/2024 cc. 4–5; Circ. 4/E/2025 (§ 3.2) |
| Ulteriore detrazione (1.000/décalage) | sì | × giorni / 365 | L. 207/2024 c. 6 (§ 3.3) |
| Tutte le soglie di reddito | **no** | reddito complessivo effettivo dell'anno | § 4 |
| Scaglioni IRPEF e addizionali | no | si applicano all'imponibile effettivo (imposte annuali sul reddito posseduto) | art. 11 c. 1 TUIR (ricerca issue #1) |
| Minimale contributivo | sì, ma per giornate retribuite | 58,13 × giornate del periodo (26/mese, 6/settimana), non giorni/365 | § 5 |

Due denominatori diversi, mai interscambiabili: **365 giorni di calendario** per
il fisco, **312 giornate retribuite** (26 × 12) per i contributi.

---

## 7. Casi di test candidati

Le fonti consultate non contengono esempi svolti sul 2026: gli esempi di fonte
sono quelli della Circ. 4/E/2025 (§ 3.2 e ricerca issue #4, § 7). I casi seguenti
sono **derivati dalle regole** documentate sopra (aliquote e soglie con fonte nei
§§ 1–6; l'aritmetica è nostra e va verificata dal motore, non citata come valore
atteso di fonte). Convenzioni: costanti 2026 del repo; retribuzione del periodo =
RAL × mesi/12; quoziente art. 13 troncato a 4 decimali; il rapporto giorni/365 è
lasciato al centesimo pieno (nessuna fonte ne fissa i decimali — vedi Lacune).

### 7.1 La coppia che decide: RAL 30.000, anno intero vs 1/7 → 31/12/2026

Semestre: 184 giorni di calendario (31+31+30+31+30+31), 156 giornate contributive
(26 × 6), percepito 15.000.

| Voce | Anno intero (365 gg) | Mezzo anno (184 gg) | Cambio di **stato** |
|---|---|---|---|
| Contributi (9,19%) | 2.757,00 | 1.378,50 | no (minimale non morde in entrambi: 30.000/312 = 96,15 > 58,13) |
| Imponibile fiscale = RC | 27.243,00 | 13.621,50 | — |
| IRPEF lorda (23%/33%) | 6.265,89 | 3.132,95 | no |
| Detrazione art. 13 | 1.979,26 (lett. b, quoziente 0,0582) | 985,53 (lett. a: 1.955 × 184/365; pavimento 690 non scatta) | cambia **fascia** (b → a) |
| Maggiorazione 65 | 65,00 | **0** (RC ≤ 25.000) | **sì: da presente ad assente** |
| Ulteriore detrazione | 1.000,00 | **0** (RC ≤ 20.000) | **sì: da positiva a zero** |
| IRPEF netta | 3.221,63 | 2.147,41 | no |
| Trattamento integrativo | **0** (RC > 15.000) | **604,93** (soglia ok; capienza: 3.132,95 > 985,53 − 75 × 184/365 = 947,72; importo 1.200 × 184/365) | **sì: da zero a positivo** |
| Somma integrativa | **0** (RC > 20.000) | **653,83** (teorico 13.621,50 ÷ 184 × 365 ≈ 27.021 ⇒ 4,8%; 4,8% × 13.621,50) | **sì: da zero a positiva** |
| Addizionale regionale | 377,94 | 167,54 (1,23% × 13.621,50) | no (dovuta in entrambi) |
| Addizionale comunale Milano | 217,94 | **0** (imponibile ≤ 23.000) | **sì: da dovuta a esente** |
| **Netto del periodo** | **23.425,49** | **12.565,31** | — |

Convenzione di arrotondamento della tabella: la catena di calcolo corre a
precisione piena e l'arrotondamento al centesimo è solo di esposizione, riga per
riga. Per questo l'IRPEF netta del mezzo anno esposta (2.147,41) non è la
differenza delle righe esposte (3.132,95 − 985,53 = 2.147,42): i valori pieni
sono 3.132,945 − 985,5342… = 2.147,4108…, che arrotonda a 2.147,41. Le righe
non si sommano né si sottraggono fra loro al centesimo.

Cinque voci cambiano di stato per effetto della sola data — e il netto del mezzo
anno (12.565,31) è **più di metà** del netto annuo (23.425,49 / 2 = 11.712,75):
la conferma numerica della riga di `docs/ASSUNZIONI.md` «il netto di chi lavora
metà anno non è metà del netto annuo». Da notare che nessuno dei cinque cambi di
stato viene dal ragguaglio degli importi: vengono tutti dalle **soglie valutate
sul reddito effettivo** (§ 4). Il ragguaglio, da solo, sposta importi; le soglie
spostano la struttura.

### 7.2 Il pavimento dei 690: rapporto di 120 giorni, RAL bassa

RC in fascia a con 120 giorni: 1.955 × 120/365 = 642,74 < 690 ⇒ detrazione
spettante **690,00** (§ 2). Con 130 giorni: 1.955 × 130/365 = 696,30 > 690 ⇒
resta 696,30. Il pavimento scatta sotto ≈ 129 giorni. [derivazione]

### 7.3 La percentuale sul teorico, l'importo sull'effettivo (dalla fonte)

Esempio 1, Circ. 4/E/2025, pp. 10–11 (già fra i casi della ricerca issue #4):
62 giorni, reddito 2.000, RC 6.000 ⇒ teorico 11.744,19 [(2.000 ÷ 62) × 365, così
nel PDF] ⇒ fascia 5,3% ⇒ somma **106,00** = 5,3% × 2.000. Prova il § 3.2
(percentuale sul teorico, importo sull'effettivo); per il § 4 è coerente ma non
discriminante, perché anche il teorico resta sotto 20.000 (la prova del § 4 sta
nel testo delle norme, punti 1 e 2).

### 7.4 Minimale: la coppia che NON cambia stato

RAL 17.000 (< 18.136,56): giornaliera 17.000/312 = 54,49 < 58,13 ⇒ il minimale
morde **sia** ad anno intero (base 58,13 × 312 = 18.136,56 > 17.000) **sia** a
mezzo anno (base 58,13 × 156 = 9.068,28 > 8.500): stesso stato, base frazionata.
E il caso speculare del § 5.3: RAL 30.000 su mezzo anno, percepito 15.000 <
18.136,56 annuo, ma 15.000/156 = 96,15 > 58,13 ⇒ il minimale **non** morde — il
test che smaschera un'implementazione che confrontasse il percepito con il
minimale annualizzato. [derivazione]

---

## Lacune

- **C.M. 326/E/1997 e Circolare 67/E/2001 lette da copia**: il testo è stato
  letto dal PDF «Servizio di documentazione tributaria» ospitato su mefop.it
  (<https://www.mefop.it/cms/doc/17705/circolare-ministero-delle-finanze-n-326-e-23-dicembre-1997.pdf>);
  la pagina GU della 326/E espone solo i metadati e def.finanze.it non ha
  restituito il corpo del documento al fetch. La frase sui 365 giorni «anche
  negli anni bisestili» (§ 1.4) proviene da quella copia, § 3.3.
- **La regola «festività, riposi settimanali...» non è stata trovata nel testo
  della 326/E** consultato: la citazione del conteggio dei giorni usata al § 1.2
  proviene dalle istruzioni 730/2026 (fonte primaria AdE, letta direttamente),
  che ne sono la formulazione operativa vigente. La 326/E resta citata solo per
  il § 3.3 (365 anche bisestili) e non per la regola di conteggio.
- **Continuità DM10 → Uniemens della regola delle 26 giornate**: la
  Lettera-Circolare INPS 1/1988 (§ 5.2) enuncia le 26 giornate per il quadro B
  del DM 10/M, modello sostituito dal flusso Uniemens nel 2009; il documento
  tecnico Uniemens vigente non ripete la frase «pari a 26» come regola generale,
  ma la definizione per giornate contrattuali settimanali e l'esempio ufficiale
  con 26 giornate per il mese intero (§ 5.2) ne attestano la continuità. Una
  circolare o messaggio dell'era Uniemens che riformuli testualmente la regola
  per i mensilizzati non è stata individuata.
- **Decimali del rapporto giorni/365**: nessuna fonte letta fissa i decimali di
  `giorni/365` (il troncamento a 4 decimali dell'art. 13 c. 6 TUIR riguarda i
  quozienti delle fasce, non il rapporto sui giorni). Le istruzioni PF applicano
  la moltiplicazione senza enunciare arrotondamenti intermedi; i centesimi dei
  casi § 7 vanno consolidati in implementazione (stessa lacuna già registrata
  per l'ulteriore detrazione in `docs/ASSUNZIONI.md`).
- **Testi Normattiva letti via fetch assistito**: le citazioni da art. 13 TUIR,
  DL 3/2020 art. 1 e L. 207/2024 art. 1 cc. 4–6 sono i passaggi testuali
  restituiti dalla consultazione della pagina Normattiva, coincidenti con i
  testi integrali riportati nelle note 9, 11 e 16 della Circ. 4/E/2025 (PDF
  letto per esteso): doppia fonte per ogni virgolettato normativo.

---

## Fonti primarie consultate

- Art. 13 TUIR (DPR 917/1986), testo vigente — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=>
- DL 3/2020, art. 1 (conv. L. 21/2020), testo vigente — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1>
- L. 207/2024, art. 1, cc. 4–6 — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1>; per il testo del c. 6 (su cui la vigenza corrente espone l'annotazione di abrogazione da D.Lgs. 117/2026, con decorrenza 2027), permalink a vigenza anteriore: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-06-30>
- D.Lgs. 19 giugno 2026, n. 117 («Testo unico delle disposizioni legislative in materia di imposte sui redditi»), artt. 376 c. 1 lett. pppppp) e 377 c. 1 (pp. 324 e 328 del S.O.) — PDF GU SG n. 152 del 03/07/2026, S.O. n. 26/L, <https://www.gazzettaufficiale.it/eli/gu/2026/07/03/152/so/26/sg/pdf> (pagina di riferimento: <https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg>)
- D.L. 463/1983, art. 7 (conv. L. 638/1983), testo vigente — <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:1983-09-12;463~art7!vig=>
- Agenzia delle Entrate, istruzioni 730/2026 (agg. 28/05/2026), rigo C5, Tabella 6, Appendice «Periodo di lavoro - Casi particolari» (p. 139) — <https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734>
- Agenzia delle Entrate, istruzioni Redditi PF 2026, Fascicolo 1 (agg. 28/05/2026), rigo RN7 pp. 140–141 — <https://www.agenziaentrate.gov.it/portale/documents/d/guest/pf1_istruzioni_2026_agg-28-05-2026>
- Agenzia delle Entrate, istruzioni CU 2026 definitive (agg. 24/02/2026), pp. 25 e 51 — <https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istr_2026_agg+24+02.pdf/4184818b-05a3-acce-5956-70811c7d2233?t=1771947585334> (link risolto dalla pagina <https://www.agenziaentrate.gov.it/portale/certificazione-unica-2026/modello-e-istruzioni>)
- Agenzia delle Entrate, Circolare n. 29/E del 14/12/2020 — <https://www.agenziaentrate.gov.it/portale/documents/20143/2957155/Circolare+n.+29E+del+14+dicembre+2020.pdf/61cbef4d-5db8-9968-e28d-be33343879f5>
- Agenzia delle Entrate, Circolare n. 4/E del 18/02/2022 — <https://www.agenziaentrate.gov.it/portale/documents/20143/4169770/Circolare+n.+4+del+18+febbraio+2022.pdf/a83fd984-2bc3-39a9-1e09-79e9a870d401>
- Agenzia delle Entrate, Circolare n. 4/E del 16/05/2025 — <https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91>
- Ministero delle Finanze, C.M. n. 326/E del 23/12/1997 (GU SG n. 303 del 30/12/1997) — <https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=1997-12-30&atto.codiceRedazionale=97A10414> (testo da copia: <https://www.mefop.it/cms/doc/17705/circolare-ministero-delle-finanze-n-326-e-23-dicembre-1997.pdf>)
- Agenzia delle Entrate, Circolare n. 67/E del 06/07/2001 (stessa copia)
- Circolare INPS n. 6 del 30/01/2026, parr. 1 e 4 (PDF ufficiale, letto direttamente) — <https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/01/Circolare_15151/Allegati/16546_Circolare-numero-6-del-30-01-2026.pdf> (pagina di dettaglio: <https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html>)
- INPS, Lettera-Circolare n. 1 del 07/01/1988 («Fiscalizzazione degli oneri sociali. Chiarimenti»), versione testuale Bussola — <https://servizi2.inps.it/servizi/Bussola/visualizzadoc.aspx?svirtualurl=%2Fcircolari%2Fcircolare+numero+1+del+7-1-1988.htm>
- INPS, Documento tecnico Uniemens (individuale), versione 4.32 del 30/04/2026, pp. 55 e 75 — <https://www.inps.it/content/dam/inps-site/pdf/prestazioni-e-servizi/uniemens-aziende-private/UniEMENSind.pdf>
