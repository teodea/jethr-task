# Ricerca: costanti 2025 (anno chiuso) e protocollo del confronto con la CU

Anno di riferimento: **2025** (anno d'imposta chiuso; il documento di confronto è la
**Certificazione Unica 2026**, che certifica i redditi 2025)
Data della ricerca: **2026-08-11**
Issue di origine: teodea/jethr-task#6

## Domanda

Per l'anno d'imposta 2025, a solo scopo di validazione contro una CU reale: lo stesso
perimetro delle issue #1–#4 —

- scaglioni e aliquote IRPEF 2025 (con il 35% sulla seconda fascia);
- detrazione per lavoro dipendente (art. 13 TUIR) nella versione 2025;
- somma integrativa e ulteriore detrazione (L. 207/2024) e trattamento integrativo
  (DL 3/2020), nelle versioni vigenti nel 2025;
- aliquota contributiva a carico del dipendente con minimale, prima fascia e massimale 2025;
- addizionali Lombardia e Milano vigenti per il 2025;

con fonte primaria per ogni valore. Inoltre: il protocollo del confronto con la CU
(checklist di idoneità, tabella di mappatura, criterio di confronto per voce), scritto
prima di procurarsi il documento.

Perché due set: un errore da fonte non aggiornata sul 2026 (es. tabella IRPEF col 35%
al posto del 33%) non è rilevabile dal confronto col 2025, dove il 35% era davvero in
vigore. I punti in cui i due set devono divergere sono elencati in fondo alla sezione 1
e nei casi di test.

---

## 1. Scaglioni e aliquote IRPEF 2025

| Scaglione di reddito imponibile | Aliquota |
|---|---|
| fino a 28.000 € | **23%** |
| oltre 28.000 € e fino a 50.000 € | **35%** |
| oltre 50.000 € | **43%** |

Fonte: art. 11, comma 1, TUIR (DPR 917/1986), **testo vigente al 31-12-2025** —
Normattiva: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2025-12-31> (anno 2025).
Il comma è stato sostituito, a regime, dall'art. 1, comma 2, lett. a), L. 30-12-2024
n. 207 (legge di bilancio 2025) — Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1>.

**Divergenza attesa col set 2026**: nel testo dell'art. 11 vigente all'11-08-2026 la
seconda aliquota è il **33%** (stessi scaglioni 28.000/50.000) — Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art11!vig=2026-08-11>.
Un motore che usasse il 35% nel 2026 (o il 33% nel 2025) deve fallire i test incrociati.

## 2. Detrazione per lavoro dipendente 2025 (art. 13 TUIR)

Testo vigente al 31-12-2025 — Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2025-12-31> (anno 2025).
L'importo di 1.955 € è stato reso strutturale dall'art. 1, comma 2, lett. b),
L. 207/2024 (stesso URL Normattiva della sezione 1).

| Reddito complessivo (RC) | Detrazione annua |
|---|---|
| RC ≤ 15.000 € | **1.955 €** (minimo effettivo **690 €**; **1.380 €** per i rapporti a tempo determinato) — comma 1, lett. a) |
| 15.000 € < RC ≤ 28.000 € | **1.910 € + 1.190 € × (28.000 − RC) / 13.000** — comma 1, lett. b) |
| 28.000 € < RC ≤ 50.000 € | **1.910 € × (50.000 − RC) / 22.000** — comma 1, lett. c) |
| RC > 50.000 € | 0 € |

Maggiorazione (comma 1.1): la detrazione è aumentata di **65 €** se
25.000 € < RC ≤ 35.000 €. (Importo fisso, non ragguagliato al periodo.)

## 3. Somma integrativa 2025 (L. 207/2024, art. 1, commi 4-5)

È un'**erogazione** (somma che *non concorre* alla formazione del reddito), non una
detrazione. Spetta ai titolari di reddito di lavoro dipendente (art. 49 TUIR, esclusi i
pensionati) con **reddito complessivo ≤ 20.000 €**. Si calcola applicando al **reddito
di lavoro dipendente** (non al reddito complessivo) la percentuale:

| Reddito di lavoro dipendente | Percentuale |
|---|---|
| ≤ 8.500 € | **7,1%** |
| oltre 8.500 € e fino a 15.000 € | **5,3%** |
| oltre 15.000 € | **4,8%** |

Ai soli fini dell'individuazione della percentuale, il reddito di lavoro dipendente è
**rapportato all'intero anno** (comma 5). Attenzione: la percentuale si applica
all'intero reddito, non per scaglioni — alle soglie 8.500 e 15.000 la somma è
discontinua (vedi casi di test).

Comma 9: il reddito complessivo rilevante è assunto **al netto del reddito
dell'abitazione principale e pertinenze** (art. 10, comma 3-bis, TUIR); rilevano anche
le quote esenti dei regimi ricercatori/impatriati. Le istruzioni CU 2026 (fonte AdE,
sez. sotto) precisano che nel "reddito di riferimento" contano anche i redditi a
cedolare secca.

Fonte: art. 1, commi 4, 5 e 9, L. 207/2024 — Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1> (anno 2025).
Conferma incrociata (percentuali e regole): istruzioni CU 2026, Agenzia delle Entrate —
<https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istruzioni_2026.pdf/4184818b-05a3-acce-5956-70811c7d2233> (pagg. 50-52).

## 4. Ulteriore detrazione 2025 (L. 207/2024, art. 1, comma 6)

È una **detrazione** dall'imposta lorda, **rapportata al periodo di lavoro**, per i
titolari di reddito di lavoro dipendente (esclusi i pensionati) con reddito complessivo
**superiore a 20.000 €**:

| Reddito complessivo (RC) | Ulteriore detrazione annua |
|---|---|
| 20.000 € < RC ≤ 32.000 € | **1.000 €** |
| 32.000 € < RC ≤ 40.000 € | **1.000 € × (40.000 − RC) / 8.000** |
| RC > 40.000 € | 0 € |

Fonte: art. 1, comma 6, L. 207/2024, **testo vigente al 31-12-2025** — Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2025-12-31> (anno 2025).
Conferma incrociata: istruzioni CU 2026 AdE, punto 368 (stesso URL della sez. 3).

**Divergenza attesa col set 2026**: **nessuna, su questa voce**. Il comma 6 è
pienamente vigente anche nel 2026: il testo Normattiva vigente all'11-08-2026 lo
riporta integralmente, senza marcature di abrogazione —
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=2026-08-11>
(anno 2026). L'abrogazione esiste ma **decorre dal 1° gennaio 2027**: l'art. 376,
comma 1, lett. pppppp) del testo unico delle imposte sui redditi allegato al
D.Lgs. 19-06-2026 n. 117 abroga, tra gli altri, l'art. 1, comma 6, L. 207/2024
«dalla data di cui all'articolo 377», e l'art. 377 (rubrica «Decorrenza») dispone:
«Le disposizioni del presente testo unico si applicano a decorrere dal 1° gennaio
2027». La detrazione non sparisce nel merito: è trasfusa nell'art. 13 («Altre
detrazioni») del nuovo testo unico, che in epigrafe cita come fonti l'art. 13
DPR 917/1986 e l'art. 1, comma 6, L. 207/2024. Fonte: D.Lgs. 19-06-2026 n. 117,
GU Serie Generale n. 152 del 03-07-2026, S.O. n. 26/L —
<https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg>; testo integrale
nel PDF del S.O.: <https://www.gazzettaufficiale.it/eli/gu/2026/07/03/152/so/26/sg/pdf>
(anno 2026). Ai fini del test incrociato 2025 vs 2026 l'ulteriore detrazione è
quindi presente in **entrambi** gli anni; l'assetto 2026 di dettaglio resta materia
delle issue #1–#4.

## 5. Trattamento integrativo 2025 (DL 3/2020, art. 1)

Erogazione di **1.200 € annui** (dal 2021; "per l'anno 2025" confermato dalle
istruzioni CU 2026), rapportata al periodo di lavoro:

- **RC ≤ 15.000 €**: spetta se l'imposta lorda determinata sui redditi di lavoro
  dipendente (art. 49, escluse pensioni, e assimilati indicati) è **superiore alla
  detrazione per lavoro dipendente** spettante ai sensi dell'art. 13, comma 1, TUIR,
  **diminuita di 75 €** rapportati al periodo di lavoro nell'anno (riduzione inserita
  dall'art. 1, comma 3, L. 207/2024, che neutralizza l'aumento a 1.955 € nella verifica
  di capienza);
- **15.000 € < RC ≤ 28.000 €** (regola introdotta dalla L. 234/2021): spetta se la
  somma di un elenco tassativo di detrazioni supera l'imposta lorda; in tal caso il
  trattamento è pari alla differenza, con tetto 1.200 €.

Fonti: art. 1, DL 5-02-2020 n. 3 (conv. L. 21/2020), **testo vigente al 31-12-2025** —
Normattiva: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2020-02-05;3~art1!vig=2025-12-31> (anno 2025);
art. 1, comma 3, L. 207/2024 (riduzione di 75 €) — Normattiva, URL della sez. 1;
istruzioni CU 2026 AdE, pagg. 34-35 (URL della sez. 3).

## 6. Contributi a carico del dipendente 2025

| Valore | Importo 2025 | Fonte |
|---|---|---|
| Aliquota IVS a carico del lavoratore (FPLD) | **9,19%** | Istruzioni CU 2026 AdE, sezione dati previdenziali INPS, punto 6: elenco dei contributi standard a carico del lavoratore ("9,19% (IVS)") — URL sez. 3, pagg. 70-71 (anno 2025) |
| Aliquota aggiuntiva oltre la prima fascia | **1%** sulla parte eccedente la prima fascia di retribuzione pensionabile: **55.448,00 €/anno** (mensilizzato **4.621,00 €**), fino al massimale (art. 3-ter DL 19-09-1992 n. 384, conv. con mod. L. 14-11-1992 n. 438) | Circolare INPS n. 26 del 30-01-2025, par. 5 "Quota di retribuzione soggetta all'aliquota aggiuntiva dell'1%", pag. 6 del PDF: "la prima fascia di retribuzione pensionabile è stata determinata, per l'anno 2025, in 55.448,00 euro" — PDF: <https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2025/01/Circolare_14806/Allegati/15874_Circolare-numero-26-del-30-01-2025.pdf>; pagina di pubblicazione: <https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2025.01.circolare-numero-26-del-30-01-2025_14806.html> (anno 2025) |
| Massimale annuo della base contributiva e pensionabile (art. 2, c. 18, L. 335/1995) | **120.607,00 €** | Circolare INPS 26/2025, par. 6 "Massimale annuo della base contributiva e pensionabile", pag. 6 del PDF: 120.606,90 €, "che arrotondato all'unità di euro è pari a 120.607,00 euro" (URL PDF alla riga sopra; anno 2025); conferma incrociata: Istruzioni CU 2026 AdE, punto 4 sez. INPS: "massimale di cui all'art. 2, co.18, della L. n. 335 [...] fissato per l'anno 2025 in euro 120.607,00" (URL sez. 3, pag. 70) |
| Minimale di retribuzione giornaliera | **57,32 €** (9,5% del trattamento minimo mensile di pensione FPLD al 01-01-2025, pari a 603,40 €) | Circolare INPS 26/2025, par. 1 "Minimali di retribuzione giornaliera", pag. 3 del PDF: "devono essere ragguagliati a 57,32 euro (9,5% dell'importo del trattamento minimo mensile di pensione [...] pari a 603,40 euro mensili)" (URL PDF alla riga sopra; anno 2025) |
| Contributo CIGS a carico del lavoratore (solo aziende soggette) | **0,30%** | Istruzioni CU 2026 AdE, punto 6 sez. INPS (URL sez. 3) |

Note di perimetro (già nel registro assunzioni o da registrarvi):

- il massimale 120.607 € vale per gli iscritti a gestioni pensionistiche **dal
  1° gennaio 1996** senza anzianità precedente; per gli ante-1996 non c'è massimale;
- il minimale non incide sul percorso RAL → netto per una RAL da impiegato full-time:
  serve come limite inferiore dell'imponibile giornaliero, rilevante solo per
  retribuzioni sotto minimale;
- lo 0,30% CIGS dipende dall'azienda (dimensione/settore): per il confronto con una CU
  reale va chiesto se l'azienda vi è soggetta (vedi checklist, punto 6 sez. INPS).

## 7. Addizionale regionale Lombardia 2025

Applicata **per scaglioni** (quattro scaglioni previgenti, mantenuti per il 2025):

| Scaglione | Aliquota |
|---|---|
| fino a 15.000 € | **1,23%** |
| oltre 15.000 € e fino a 28.000 € | **1,58%** |
| oltre 28.000 € e fino a 50.000 € | **1,72%** |
| oltre 50.000 € | **1,73%** |

Fonte: Dipartimento delle Finanze — MEF, tabella aliquote addizionale regionale
Regione Lombardia (riferimento normativo indicato dalla pagina: art. 72, comma 1,
L.R. 14-07-2003 n. 10; dati per l'anno d'imposta 2025, pubblicati il 28-01-2026) —
<https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10> (anno 2025).

## 8. Addizionale comunale Milano 2025

- Aliquota unica: **0,8%**
- **Esenzione** per reddito imponibile ≤ **23.000 €** — è una **soglia secca**, non una
  franchigia: sopra soglia lo 0,8% si applica all'intero imponibile. Il Comune lo dice
  esplicitamente: "L'esenzione non equivale a franchigia".

Fonti:
- Dipartimento delle Finanze — MEF, risultato ricerca addizionale comunale, Comune di
  Milano, anno d'imposta 2025 (delibera indicata dalla pagina: n. 46 del 28-09-2020) —
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=2025&pr=MI&cc=F205&r=1> (anno 2025);
- Comune di Milano, aliquota — <https://servizicrm.comune.milano.it/centro-supporto/KA-01934/Aliquota-addizionale-comunale-IRPEF>;
  esenzioni — <https://servizicrm.comune.milano.it/centro-supporto/KA-01737/Esenzioni-addizionale-comunale-IRPEF>.

---

## Protocollo del confronto con la CU

Documento di riferimento: **Certificazione Unica 2026** (redditi 2025), approvata con
provvedimento AdE del 15-01-2026 —
<https://www.agenziaentrate.gov.it/portale/provvedimento-del-15-gennaio-2026-cu>;
modello e istruzioni:
<https://www.agenziaentrate.gov.it/portale/certificazione-unica-2026/modello-e-istruzioni>;
istruzioni PDF (i numeri di punto citati sotto provengono da qui):
<https://www.agenziaentrate.gov.it/portale/documents/20143/9602395/CU_istruzioni_2026.pdf/4184818b-05a3-acce-5956-70811c7d2233>.

Nota terminologica: una "CU 2025" certifica i redditi **2024**. Per validare il set
2025 serve una **CU 2026**.

### 1. Checklist di idoneità della CU

Una CU fuori perimetro rende le discrepanze non interpretabili (bug del motore o voce
fuori perimetro?). Requisiti e verifica sul documento:

| Requisito | Come si verifica sulla CU 2026 |
|---|---|
| Rapporto per l'intero anno | punto 6 (giorni detrazione) = 365; punto 722 (inizio rapporto) ≤ 01-01-2025 e punto 723 (cessazione) assente |
| Tempo indeterminato | reddito nel **punto 1** (tempo indeterminato), punto 2 vuoto |
| Tempo pieno | non desumibile dalla parte fiscale della CU: chiedere al titolare (il part-time emerge solo nei dati previdenziali/UNIEMENS) |
| Residenza a Milano tutto l'anno | sezione dati anagrafici: domicilio fiscale al 01-01-2025 = Milano; rigo "domicilio al 01-01-2026" assente o identico |
| Nessun familiare a carico | punto 362 (detrazioni per carichi di famiglia) vuoto/zero |
| Nessuna previdenza complementare | punti 411-427 vuoti (in particolare 412, contributi versati) |
| Nessun welfare / fringe benefit | nessun importo nei punti dei compensi in natura e nessuna annotazione relativa (verifica per assenza sulle annotazioni) |
| Unico rapporto, nessun conguaglio di altri sostituti | punti 531-570 (redditi erogati da altri soggetti) vuoti; punti 731-741 (somma/ulteriore detrazione da precedenti sostituti) vuoti |
| Nessun onere dedotto dal sostituto | punto 431 vuoto/zero |
| Azienda soggetta a CIGS? | non è un requisito di esclusione, ma va chiesto: determina se i contributi del punto 6 (sez. INPS) includono lo 0,30% |

### 2. Tabella di mappatura punto CU → voce della cascata

| Voce della cascata (glossario) | CU 2026 |
|---|---|
| RAL / imponibile previdenziale | sez. dati previdenziali INPS (Sezione 1), **punto 4** — imponibile previdenziale |
| Contributi a carico del dipendente | sez. INPS, **punto 6** — contributi trattenuti (9,19% IVS + eventuale 1% oltre prima fascia + eventuale 0,30% CIGS) |
| Imponibile fiscale (reddito di lavoro dipendente) | **punto 1** (dati fiscali); il reddito rilevante per somma/ulteriore detrazione è ripetuto nel **punto 719** |
| Giorni per detrazione | **punto 6** (dati fiscali); ripetuto nel **punto 721** per la somma integrativa |
| Detrazione per lavoro dipendente (art. 13) | **punto 367** |
| Ulteriore detrazione (c. 6 L. 207/2024) | **punto 368** |
| IRPEF trattenuta (netta, post conguaglio) | **punto 21** — ritenute IRPEF |
| Addizionale regionale 2025 (dovuta; trattenuta nel 2026) | **punto 22** |
| Addizionale comunale 2025 | **punto 26** (acconto trattenuto nel 2025) + **punto 27** (saldo dovuto) |
| Trattamento integrativo | **punto 390** (codice riconoscimento), **391** (erogato), **392** (riconosciuto non erogato) |
| Somma integrativa (c. 4 L. 207/2024) | **punto 718** (codice spettanza), **724** (codice riconoscimento), **725** (erogata), **726** (riconosciuta non erogata) |

Identità di coerenza interna alla CU (sanity check prima del confronto col motore):
punto 1 ≈ punto 4 − punto 6 (salvo arrotondamenti e voci escluse dall'uno o
dall'altro imponibile).

### 3. Criterio di confronto per voce

1. **Mai sul solo netto**: la CU non riporta "il netto". Il confronto è voce per voce,
   su base **annua** (il mensile del prototipo non è confrontabile con la CU).
2. **Ordine di confronto** (dalla base della cascata verso l'alto, così un errore a
   monte non viene scambiato per tre errori a valle):
   RAL/imponibile previdenziale (p. 4) → contributi (p. 6) → imponibile fiscale (p. 1)
   → detrazioni (p. 367, 368) → IRPEF trattenuta (p. 21) → addizionali (p. 22, p. 26+27)
   → erogazioni (p. 391, p. 725).
3. **Tolleranza**: scostamenti fino a ~1-2 € per voce sono compatibili con gli
   arrotondamenti mensili del cedolino ricomposti in sede di conguaglio; oltre, si
   classifica: (a) requisito di idoneità violato → CU fuori perimetro, non è un bug;
   (b) requisiti ok → bug del motore (o costante sbagliata: verificare prima le
   costanti di questo file contro le fonti).
4. **Semantica del punto 21**: sono le ritenute IRPEF effettivamente operate dopo il
   conguaglio — per una CU idonea (unico sostituto, anno intero) coincide con l'IRPEF
   netta annua del motore. Le addizionali non vi sono incluse (voci separate).
5. **Semantica temporale delle addizionali**: il punto 22 (regionale 2025) è trattenuto
   in 11 rate nel 2026; il totale comunale di competenza 2025 è punto 26 + punto 27. Il
   motore, che calcola per competenza, va confrontato con questi totali, non con quanto
   uscito in busta nel 2025.

---

## Casi di test candidati

Nessuna delle fonti primarie aperte contiene esempi numerici svolti. I candidati sotto
sono coppie a cavallo delle soglie citate nelle fonti; i valori attesi vanno derivati
dalle formule di questo file (i pochi numeri indicati sono derivazioni aritmetiche,
non valori certificati).

- **RC 15.000 / 15.001**: cambio lettera a) → b) dell'art. 13; cambio regime del
  trattamento integrativo; scaglione addizionale regionale 1,23% → 1,58%.
- **RC 20.000 / 20.001**: switch somma integrativa (erogazione) → ulteriore detrazione:
  le due voci devono essere mutuamente esclusive.
- **Reddito di lavoro dipendente 8.500 / 8.501 e 15.000 / 15.001** (con RC ≤ 20.000):
  discontinuità della somma integrativa (percentuale sull'intero reddito:
  8.500 × 7,1% = 603,50 € contro 8.501 × 5,3% = 450,55 €).
- **RC 25.000 / 25.001 e 35.000 / 35.001**: maggiorazione di 65 € (comma 1.1 art. 13)
  che si accende e si spegne.
- **RC 28.000 / 28.001**: scaglione IRPEF 23% → 35%; lettera b) → c) art. 13;
  scaglione regionale 1,58% → 1,72%.
- **RC 32.000 / 32.001 e 40.000 / 40.001**: inizio del décalage e azzeramento
  dell'ulteriore detrazione.
- **RC 50.000 / 50.001**: scaglione IRPEF 35% → 43%; regionale 1,72% → 1,73%;
  detrazione art. 13 a zero.
- **Imponibile 23.000 / 23.001 (Milano)**: soglia secca — addizionale comunale 0 €
  contro 0,8% × 23.001 = 184,01 €.
- **Retribuzione oltre 55.448 €**: si accende l'1% aggiuntivo sulla parte eccedente.
- **Retribuzione oltre 120.607 €**: stop dei contributi IVS al massimale (iscritti
  post-1995).
- **Stessa RAL, anni 2025 vs 2026**: i punti in cui i due set devono divergere sono
  quattro, tutti attesi:
  1. seconda aliquota IRPEF **35% → 33%** (per RAL con imponibile nella fascia
     28.000-50.000): test anti-"fonte non aggiornata";
  2. prima fascia pensionabile **55.448 → 56.224 €**: per retribuzioni sopra
     55.448 l'1% aggiuntivo parte da soglie diverse ⇒ divergono i contributi e
     quindi l'imponibile fiscale, componendo l'effetto con quello IRPEF;
  3. massimale contributivo **120.607 → 122.295 €**: sopra 120.607 lo stop dei
     contributi scatta a soglie diverse (stesso effetto composto);
  4. minimale giornaliero **57,32 → 58,13 €** (rileva solo per la validazione
     dell'input, non per il calcolo di una RAL full-time).
  L'ulteriore detrazione **non** è un punto di divergenza: è vigente in entrambi
  gli anni (l'abrogazione ad opera del D.Lgs. 117/2026 decorre dal 01-01-2027 —
  vedi sez. 4). Fonti dei valori 2026: ricerca issue #2
  (`docs/ricerca/contributi-dipendente-aliquote-minimale-massimale.md`,
  Circolare INPS 6/2026); fonti 2025: sez. 6 di questo file (Circolare INPS 26/2025).

## Lacune

1. **Base normativa puntuale del 9,19%**: l'aliquota è confermata come voce standard
   dalle istruzioni CU 2026 (AdE) e da testo INPS restituito dalla ricerca, ma non è
   stata ricostruita la sua composizione normativa da una pagina INPS aperta
   direttamente (la Circolare 26/2025, ora letta integralmente in PDF, tratta
   minimali/massimali e non riporta il 9,19%).
2. **Norma transitoria sui quattro scaglioni regionali 2025**: la regola per cui le
   regioni potevano mantenere i quattro scaglioni previgenti è riportata dalle pagine
   del Dipartimento delle Finanze (testo da risultato di ricerca), ma gli estremi
   normativi puntuali non sono stati verificati su Normattiva.
3. **Delibera Comune di Milano n. 46 del 28-09-2020**: estremi come riportati dal
   Dipartimento delle Finanze; il testo originale della delibera non è stato aperto.
4. **Attribuzione normativa del 33% (2026)**: il testo vigente 2026 dell'art. 11 TUIR
   mostra il 33% su Normattiva, ma la nota di modifica (attesa: L. 199/2025) non è
   stata estratta dalla pagina; è materia delle issue #1–#4.
5. **Elenco tassativo delle detrazioni** per la verifica del trattamento integrativo
   nella fascia 15.000-28.000 (regola L. 234/2021): la regola è citata da DL 3/2020 e
   istruzioni CU, ma l'elenco puntuale non è stato trascritto in questo file (fuori dal
   caso base del brief: nessun onere detraibile nel perimetro).
6. **Numeri di punto CU dei fringe benefit**: la checklist verifica per assenza; i
   punti dedicati ai compensi in natura non sono stati censiti singolarmente.

Lacune risolte in seguito a verifica (issue #6, follow-up del 2026-08-11): il
minimale giornaliero 57,32 € e la prima fascia 55.448,00 € sono ora citati dal PDF
della Circolare INPS 26/2025 (par. 1 e par. 5) aperto e letto direttamente; la
presunta abrogazione 2026 del comma 6 L. 207/2024 è stata corretta (abrogazione
reale ma con decorrenza 01-01-2027, art. 376-377 del testo unico allegato al
D.Lgs. 117/2026 — vedi sez. 4).
