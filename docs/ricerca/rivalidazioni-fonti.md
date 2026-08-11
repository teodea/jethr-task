# Rivalidazioni periodiche delle fonti — stato alla verifica di agosto

Anno di riferimento: anno d'imposta 2026
Data della verifica: 2026-08-11

## La domanda (issue #9, teodea/jethr-task)

Tre questioni restano aperte in attesa di documenti ufficiali non ancora
pubblicati. Questo file registra l'esito di ogni ciclo di verifica: per ciascun
punto, "documento trovato" (con estremi) oppure "nessun documento pubblicato
alla data di verifica". Il file si aggiorna a ogni ciclo, non si duplica
(convenzione di `docs/ricerca/README.md`).

1. **Data di scarico degli elenchi MEF** delle addizionali. Il presidio ha
   cambiato natura con la issue #21: non è più «una delibera da controllare» ma
   «una data di scarico da rinfrescare». Prima l'unico valore a rischio era
   l'addizionale comunale di Milano, trascritta a mano per proroga della
   delibera C.C. 46/2020; ora i dati di tutti i 7.896 comuni stanno in
   `dati/addizionali/<anno>/`, ognuno col campo `scaricatoIl`, e si rigenerano
   con un comando:

   ```bash
   node strumenti/importa-addizionali.mjs
   ```

   Il ciclo di verifica non deve più leggere una scheda comunale: deve
   rieseguire lo script e committare il diff. Resta la stessa scadenza — una
   delibera pubblicata sul MEF entro il **20-12-2026** ha effetto retroattivo al
   1° gennaio 2026 (D.Lgs. 23/2011, art. 14, c. 8 — vedi
   `addizionali-regionale-comunale.md`, §4) — e al 12-08-2026 riguarda **4.909
   comuni** ancora senza delibera 2026, che il calcolo tratta per proroga
   dell'anno precedente. Due presidi automatici sostituiscono la lettura a mano:
   un test confronta i dati importati di Milano e della Lombardia con le
   costanti curate (`test/luoghi.test.js`), e lo script si ferma se cambia il
   tracciato dei CSV o il testo di un'agevolazione regionale curata.
2. **Modello e istruzioni 730/2027** (anno d'imposta 2026): confermerebbero che
   le regole di arrotondamento dichiarative (regola dei 50 centesimi,
   arrotondamento a fine voce, troncamento del quoziente a 4 decimali) restano
   invariate dal 2025 al 2026 (vedi `arrotondamenti-e-quadratura.md`).
3. **Circolare AE di commento organico ai commi 3-4 dell'art. 1,
   L. 199/2025** (taglio della seconda aliquota IRPEF dal 35% al 33% e
   comma 5-bis dell'art. 16-ter TUIR): darebbe esempi numerici ufficiali per i
   valori attesi dei test (vedi `irpef-scaglioni-e-detrazione-lavoro-dipendente.md`).

In coda, fuori dai cicli di verifica: la nota architetturale per un eventuale
set di costanti 2027 (nuovo Testo Unico), quarto punto della stessa issue.

---

## Ciclo di verifica del 2026-08-11

### 1. Delibera addizionale comunale Milano 2026 — **nessun documento pubblicato**

- Pagina consultata: Dipartimento delle Finanze — MEF, servizio "Addizionale
  comunale all'IRPEF", risultato per il Comune di Milano (codice catastale
  F205):
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1>
  (consultata il 2026-08-11).
- Esito per l'anno d'imposta 2026: la pagina espone testualmente **"Anno 2026:
  non ci sono dati per il comune selezionato"**.
- Riga più recente esposta: anno d'imposta 2025 — aliquota 0,8%, esenzione per
  reddito imponibile fino a 23.000,00 EUR, delibera n. 46 del 28-09-2020,
  pubblicazione 20-12-2025 (conferma inserita d'ufficio).
- **Conseguenza per il motore: nessuna.** Restano in vigore, per proroga
  (art. 1, c. 169, L. 296/2006; D.Lgs. 23/2011, art. 14, c. 8), lo 0,8% e la
  soglia di 23.000 EUR della delibera C.C. 46/2020. Il valore resta da
  rivalidare dopo il **20-12-2026**: fino a quella data una delibera 2026
  pubblicata sul sito MEF avrebbe effetto retroattivo al 1° gennaio 2026.

### 2. Modello/istruzioni 730/2027 — **nessun documento pubblicato**

- Pagina consultata: Agenzia delle Entrate, "Modelli in bozza":
  <https://www.agenziaentrate.gov.it/portale/web/guest/strumenti/modelli/modelli-in-bozza>
  (consultata il 2026-08-11). La pagina espone testualmente **"Attualmente non
  sono disponibili modelli in bozza"**: nessuna bozza del 730/2027 né delle
  relative istruzioni.
- Controprova sul ciclo precedente: la bozza delle istruzioni 730/2026 (anno
  d'imposta 2025) risulta pubblicata nella stessa sezione a fine gennaio 2026
  (<https://www.agenziaentrate.gov.it/portale/documents/d/guest/730_2026_istruzioni_bozza-internet>);
  il modello definitivo 730/2026 è in
  <https://www.agenziaentrate.gov.it/portale/730-2026/modello-e-istruzioni>.
  È quindi ragionevole attendersi la bozza del 730/2027 non prima di
  **gennaio-febbraio 2027**, e la circolare di liquidazione in primavera 2027.
- **Conseguenza per il motore: nessuna.** L'assunzione di invarianza 2025→2026
  delle regole di arrotondamento dichiarative resta un'assunzione: non è ancora
  né confermabile né smentibile da fonte primaria. Prossima verifica utile:
  **febbraio 2027**.

### 3. Circolare AE sui commi 3-4 della L. 199/2025 — **nessun documento pubblicato**

- Pagina consultata: Agenzia delle Entrate, sezione Circolari:
  <https://www.agenziaentrate.gov.it/portale/normativa-e-prassi/circolari>
  (consultata il 2026-08-11).
- Censimento delle circolari 2026 pubblicate alla data di verifica:

  | Circolare | Data | Oggetto | Tocca i commi 3-4? |
  |---|---|---|---|
  | 1/E | 19-02-2026 | Chiarimenti sul Codice del Terzo settore | No |
  | 2/E | 24-02-2026 | Tassazione degli incrementi retributivi — L. 199/2025, prime indicazioni (commi 7 e 10-12) | No |
  | 3/E | 24-06-2026 | Tassazione degli incrementi retributivi e delle maggiorazioni/indennità per lavoro notturno, festivo, riposo settimanale, turni — L. 199/2025, risposte a quesiti | No |
  | 4/E | 06-07-2026 | Indici sintetici di affidabilità fiscale — periodo d'imposta 2025 | No |
  | 5/E | 16-07-2026 | Codice della crisi di impresa e dell'insolvenza (D.Lgs. 14/2019) | No |
  | 6/E | 06-08-2026 | Nuovo regime di adempimento collaborativo | No |
  | 7/E | 07-08-2026 | Enti sportivi professionistici e dilettantistici (D.Lgs. 36/2021) | No |

- Verifica puntuale sulla 3/E (l'unica candidata plausibile, essendo l'unico
  seguito sulla legge di bilancio 2026): letto il testo integrale
  (<https://www.agenziaentrate.gov.it/portale/documents/20143/10065075/Circolare+domande+risposte+incrementi+n.+3+del+24+giugno+2026.pdf/f4b19f05-c4cd-bea5-b930-6b600e8dfc0e?t=1782287058526>,
  consultato il 2026-08-11). La premessa dichiara che la circolare fa seguito
  alla 2/E del 24-02-2026 e fornisce "ulteriori precisazioni […] in merito
  all'applicazione delle agevolazioni di cui all'articolo 1, commi 7, 10 e 11,
  della legge 30 dicembre 2025, n. 199": imposta sostitutiva del 5% sugli
  incrementi da rinnovi contrattuali (comma 7) e del 15% su maggiorazioni e
  indennità per notturno/festivo/turni (commi 10-11). L'indice non contiene
  alcuna sezione su aliquote o scaglioni IRPEF: **i commi 3-4 non sono
  trattati**.
- **Conseguenza per il motore: nessuna.** All'11-08-2026 non esiste una
  circolare di commento organico alle nuove aliquote IRPEF 2026 (23/33/43%)
  con esempi numerici. I valori attesi dei test restano ancorati al testo di
  legge (art. 1, cc. 3-4, L. 199/2025) e alle istruzioni dichiarative 2025.

---

## Esito complessivo del ciclo 2026-08-11

Nessuno dei tre documenti attesi risulta pubblicato: **nessuna modifica al
motore né al registro delle assunzioni**. La issue #9 (teodea/jethr-task) è
stata chiusa con questo ciclo: il presidio dei checkpoint futuri è **questo
file**, da aggiornare a ogni ciclo di verifica.

Prossimi momenti utili di verifica:

- **dopo il 20-12-2026** — punto 1 (termine di efficacia delle delibere
  comunali per il 2026): rieseguire `node strumenti/importa-addizionali.mjs` e
  committare il diff dei JSON. Se il test che confronta i dati importati con le
  costanti curate fallisce, il MEF ha pubblicato per Milano una delibera 2026:
  aggiornare `src/costanti/2026.js` e `addizionali-regionale-comunale.md`
  (§1b e §4). Se passa e il diff è vuoto sui comuni già deliberati, la proroga
  è definitiva e la nota nei file passa da «caveat» a «confermato»;
- **febbraio 2027** — punto 2 (finestra storica di pubblicazione delle bozze
  730) e punto 3 (una circolare sulle aliquote potrebbe arrivare in qualunque
  momento; ricontrollare la sezione Circolari a ogni ciclo);
- **all'uscita di una circolare sui commi 3-4** — usare gli eventuali esempi
  numerici svolti per certificare le coppie a cavallo di soglia oggi marcate
  [derivazione] in `irpef-scaglioni-e-detrazione-lavoro-dipendente.md` e nei
  test.

---

## Nota architetturale per un eventuale set 2027 (nuovo Testo Unico)

Il D.Lgs. 19-06-2026, n. 117 (GU Serie Generale n. 152 del 03-07-2026,
S.O. n. 26/L) sostituisce il TUIR: le disposizioni del nuovo testo unico «si
applicano a decorrere dal 1° gennaio 2027» (art. 377, rubrica «Decorrenza»).
Fonti già verificate direttamente in `costanti-2025-e-protocollo-cu.md`,
sez. 4: frontespizio <https://www.gazzettaufficiale.it/eli/id/2026/07/03/26G00131/sg>,
testo integrale <https://www.gazzettaufficiale.it/eli/gu/2026/07/03/152/so/26/sg/pdf>.

Conseguenze, se si costruisce un set di costanti 2027:

- **le citazioni normative vanno rimappate sui nuovi articoli**: oggi le
  costanti citano art. 11 e 13 DPR 917/1986 e art. 1, c. 6, L. 207/2024;
  quest'ultimo è abrogato dall'art. 376, c. 1, lett. pppppp) del nuovo TU e
  l'ulteriore detrazione è trasfusa nell'art. 13 «Altre detrazioni», che in
  epigrafe cita entrambe le fonti previgenti;
- **le formule non dovrebbero cambiare nel merito** (trasfusione a
  legislazione vigente, non riforma), ma va verificato articolo per articolo
  sul testo del S.O. 26/L prima di riusare i valori 2026;
- **l'architettura regge senza modifiche**: «un file di costanti per anno, con
  la fonte accanto a ogni valore» (`src/costanti/`) fa del set 2027 un file
  nuovo (`2027.js`) con citazioni rimappate, non un refactoring del set 2026.

## Lacune

- Il censimento delle circolari 2026 (tabella al §3) deriva dalla pagina indice
  dell'Agenzia; solo la 3/E è stata letta nel testo integrale in questo ciclo.
  Gli oggetti delle 4/E-7/E rendono implausibile che contengano un commento
  alle aliquote IRPEF, ma non sono stati letti per esteso. La 2/E era già
  stata verificata nel ciclo precedente (commi 7 e 10-12 — vedi
  `irpef-scaglioni-e-detrazione-lavoro-dipendente.md`).
