# Addizionali regionale e comunale all'IRPEF — Lombardia e Milano, formato dati MEF

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-11

## La domanda (issue #3, teodea/jethr-task)

Quattro livelli:

1. **Caso del brief**: aliquote dell'addizionale regionale Lombardia e comunale
   Milano, con eventuali scaglioni e soglie di esenzione.
2. **Estensione**: in che formato il Dipartimento delle Finanze (MEF) pubblica le
   delibere di tutte le regioni e di tutti i comuni? Con che granularità e
   frequenza? Ne discende la raccomandazione fattibile/non fattibile su un
   selettore regione/comune.
3. **Dipendenza dall'IRPEF**: le addizionali sono dovute anche quando l'IRPEF
   netta è zero? Su quale base si calcolano, e le detrazioni IRPEF le riducono?
4. **Vigenza per il 2026**: quali delibere fanno fede per Regione Lombardia e
   Comune di Milano nell'anno d'imposta 2026, entro quale termine andavano
   pubblicate, e quale regola si applica in assenza di nuova delibera.

In coda: censimento dei punti di discontinuità (per la issue #8) e casi di test
candidati (per la issue #4).

---

## 1. Caso del brief: aliquote Lombardia e Milano

### 1a. Addizionale regionale — Lombardia, anno d'imposta 2026

| Scaglione di reddito | Aliquota |
|---|---|
| fino a 15.000 EUR | 1,23% |
| oltre 15.000 e fino a 28.000 EUR | 1,58% |
| oltre 28.000 e fino a 50.000 EUR | 1,72% |
| oltre 50.000 EUR | 1,73% |

- **Fonte del valore (anno d'imposta 2026)**: Dipartimento delle Finanze — MEF,
  servizio "Addizionale regionale all'IRPEF - ricerca aliquote applicabili",
  pagina Regione Lombardia, anno selezionato 2026 (default), pagina aggiornata
  al 28-01-2026:
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10>
- **Norma regionale citata dal MEF**: art. 72, comma 1, legge regionale
  14 luglio 2003, n. 10.
- **Annualità della delibera**: la tabella è in vigore **dall'anno d'imposta
  2022**, fissata dall'art. 72 c. 1 L.R. 10/2003 come modificato dall'art. 1
  della L.R. 31 marzo 2022, n. 5 — fonte: Regione Lombardia, pagina ufficiale
  "Addizionale regionale all'IRPEF":
  <https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef>.
  Per il 2026 non c'è una nuova legge regionale: vale la tabella 2022,
  legittimata per gli anni 2025–2028 dalla regola sui quattro scaglioni (vedi §4).

**Metodo di calcolo: per scaglioni progressivi, come l'IRPEF** (marginalità, non
aliquota sull'intero reddito). Fonti:

- Regione Lombardia (pagina sopra): l'addizionale si calcola "applicando
  aliquote progressive al reddito complessivo determinato ai fini IRPEF, al
  netto degli oneri deducibili", sugli "stessi scaglioni previsti per l'IRPEF".
- D.Lgs. 68/2011, art. 6: le regioni "possono stabilire aliquote
  dell'addizionale regionale all'IRPEF differenziate esclusivamente in relazione
  agli scaglioni di reddito" statali — fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2011-05-06;68~art6!vig=>

**Cornice statale** (contesto, stesse fonti):

- Aliquota di base nazionale: **1,23%** dal 2012 — D.Lgs. 68/2011, art. 6
  (Normattiva, URL sopra) e MEF, "Disciplina del tributo" (addizionale
  regionale): <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/>
- Maggiorazione massima per le regioni ordinarie: **fino a 2,1 punti
  percentuali** dal 2015 — stesse fonti.
- Nessuna soglia di esenzione regionale risulta per la Lombardia né dalla pagina
  MEF per l'anno 2026 né dalla pagina di Regione Lombardia (URL sopra).

### 1b. Addizionale comunale — Milano

| Parametro | Valore |
|---|---|
| Aliquota | **0,8%** (unica) |
| Soglia di esenzione | reddito imponibile fino a **23.000,00 EUR** |
| Tipo di soglia | **soglia secca (a scalino)**: sotto o pari alla soglia non si paga nulla; sopra, l'aliquota si applica all'**intero** reddito imponibile, non all'eccedenza |

- **Fonte del valore**: Dipartimento delle Finanze — MEF, servizio "Addizionale
  comunale all'IRPEF", risultato per il Comune di Milano (codice catastale
  F205): <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1>
  - Anno d'imposta 2025: aliquota 0,8%, esenzione fino a 23.000,00 EUR,
    delibera n. 46 del 28-09-2020, nota "conferma", data pubblicazione
    20-12-2025, contrassegnata con asterisco = "aliquota non inviata dal comune
    e inserita d'ufficio" (cioè proroga registrata dal MEF, vedi §4).
  - Anno d'imposta 2024: identica (pubblicazione 20-12-2024, stessa delibera).
  - **Anno d'imposta 2026: nessun dato pubblicato** alla data della ricerca
    (2026-08-11). Si applica la proroga delle aliquote 2025 (vedi §4).
- **Annualità della delibera**: deliberazione del Consiglio Comunale di Milano
  **n. 46 del 28 settembre 2020**, che ha portato la soglia di esenzione a
  23.000 EUR a decorrere dall'anno 2020; aliquota 0,8% — conferme sul dominio
  del Comune di Milano: <https://www.comune.milano.it/en/argomenti/tributi/addizionale-comunale-irpef>
  e FAQ <https://servizicrm.comune.milano.it/centro-supporto/KA-01934/Aliquota-addizionale-comunale-IRPEF>
  (testo ottenuto dai risultati di ricerca sul dominio comune.milano.it: le
  pagine rifiutano il fetch diretto — vedi Lacune; i valori coincidono con la
  pagina MEF per-comune, aperta direttamente).
- **Comportamento a scalino, norma**: D.Lgs. 360/1998, art. 1, c. 3-bis — la
  soglia di esenzione è stabilita "in ragione del possesso di specifici
  requisiti reddituali" e, nel caso di superamento della soglia, l'addizionale
  "si applica al reddito complessivo" — fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1!vig=>.
  Conferma MEF, "Disciplina del tributo" (addizionale comunale): "l'addizionale
  non è dovuta qualora il reddito sia inferiore o pari al limite stabilito dal
  comune, mentre la stessa si applica al reddito complessivo nell'ipotesi in cui
  il reddito superi detto limite" —
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/disciplina-del-tributo/>
- **Tetto statale dell'aliquota**: 0,8% (0,9% solo per Roma Capitale) —
  D.Lgs. 360/1998, art. 1, c. 3 (Normattiva, URL sopra) e MEF "Disciplina del
  tributo" (URL sopra), anno di consultazione 2026.

---

## 2. Formato e reperibilità dei dati nazionali (MEF)

Risposta netta: **sì, i dati sono tabellari e scaricabili**, per entrambe le
addizionali, in **CSV per anno d'imposta, aggiornati quotidianamente**.

### Addizionale comunale (tutti i comuni)

- **Elenchi generali in CSV, un file per anno dal 2001 al 2026**, aggiornati
  quotidianamente in base alle pubblicazioni delle delibere; URL di download del
  tipo `download.php?anno=2026` — fonte: MEF, "Elenchi generali aggiornati
  quotidianamente":
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addirpef_newDF/download/tabella.htm>
- Campi: codice catastale, comune, provincia, estremi e data di pubblicazione
  della delibera, struttura dell'aliquota (unica o ad aliquote multiple), soglie
  di esenzione. **Dal 2021 il tracciato è esteso** con il dettaglio di esenzioni
  e aliquote deliberate da ciascun ente "con le relative descrizioni" (testuali).
  Convenzioni: "0*" = comune che non ha deliberato/istituito il tributo.
- In parallelo esiste l'**elenco riepilogativo annuale** (xlsx e pdf), pensato
  per saldo dell'anno e acconto dell'anno successivo: per ogni comune codice
  catastale, denominazione, provincia, aliquota unica o multipla (3 o 4
  aliquote), soglia di esenzione; "0,0" = addizionale non applicata; la dicitura
  "NOTA" rimanda a esenzioni non universali descritte solo nella scheda del
  comune — fonte: MEF, "Elenco riepilogativo delle aliquote per l'anno d'imposta
  2025": <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/aliquote-applicabili/elenco-aliquote-2025/>

### Addizionale regionale (tutte le regioni)

- Consultazione a schermo per regione con selettore anno (2015–2026):
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/sceltaregione.htm>
- **Elenchi generali in CSV, un file per anno dal 2015 al 2026**, con aliquote
  ed eventuali esenzioni per regione, "aggiornati in automatico in base alle
  pubblicazioni effettuate quotidianamente" (alla consultazione i file
  risultavano aggiornati al 19-06-2026) — fonte: MEF:
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/download/tabella.htm>

### Raccomandazione sul selettore regione/comune

**Fattibile**, con un caveat sul tracciato comunale:

- I dati esistono in formato strutturato (CSV), per annualità, con
  aggiornamento quotidiano e granularità per singolo ente: la base dati per un
  selettore regione/comune c'è.
- Il modello dati deve reggere le tre forme censite dagli stessi elenchi MEF:
  **aliquota unica**, **aliquote multiple su scaglioni propri** (3 o 4), e
  **soglia di esenzione a scalino**.
- Il punto critico è la coda descrittiva: le esenzioni "non universali"
  (marcate "NOTA" negli elenchi) sono testo libero, non un campo strutturato.
  Un selettore automatico copre in modo affidabile i comuni con aliquota unica o
  scaglioni + soglia semplice; per i comuni con esenzioni descrittive serve
  fallback esplicito (escluderli o mostrare la nota). La riga "Residenza a
  Milano" in `docs/ASSUNZIONI.md` può quindi essere aggiornata con: estensione
  fattibile su dati MEF strutturati, con degradazione dichiarata sui casi "NOTA".
- I dati vanno sempre letti **per annualità** e con la regola di
  vigenza/proroga del §4: l'assenza di una riga per l'anno N non significa
  aliquota zero ma proroga dell'anno N-1.

---

## 3. Dipendenza dall'IRPEF netta

**Sì, per entrambe le addizionali: sono dovute solo se, per lo stesso anno,
l'IRPEF risulta dovuta al netto delle detrazioni.** Con IRPEF netta pari a zero
(incapienza), regionale e comunale non sono dovute affatto.

- **Regionale** — D.Lgs. 446/1997, art. 50, c. 2: l'addizionale si calcola sul
  "reddito complessivo determinato ai fini dell'imposta sul reddito delle
  persone fisiche, al netto degli oneri deducibili", ed è dovuta "se per lo
  stesso anno l'imposta sul reddito delle persone fisiche, al netto delle
  detrazioni per essa riconosciute e dei crediti" risulta dovuta — fonte:
  Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1997-12-15;446~art50!vig=>.
  Nella formulazione del MEF: dovuta "se per lo stesso anno l'IRPEF risulta
  dovuta, al netto delle detrazioni per essa riconosciute e del credito di
  imposta per gli utili distribuiti da società ed enti e per i redditi prodotti
  all'estero" — <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/>
- **Comunale** — D.Lgs. 360/1998, art. 1, c. 4: base imponibile "reddito
  complessivo determinato ai fini dell'imposta sul reddito delle persone
  fisiche, al netto degli oneri deducibili"; dovuta "se per lo stesso anno
  risulta dovuta l'imposta sul reddito delle persone fisiche, al netto delle
  detrazioni per essa riconosciute e del credito di cui all'articolo 165" del
  TUIR — fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1!vig=>.
  Conferma MEF, disciplina del tributo comunale (URL in §1b).

### Conseguenze sulla forma del calcolo

- **Le detrazioni IRPEF non riducono le addizionali**: la base è l'imponibile
  fiscale (reddito complessivo meno oneri deducibili — per il caso del brief,
  RAL meno contributi a carico del dipendente), *prima* delle detrazioni. Le
  detrazioni entrano solo nella condizione on/off di debenza. È la conferma
  richiesta dal glossario, con le due norme sopra come prova.
- **La cascata non è lineare**: per sapere se le addizionali sono dovute bisogna
  aver già calcolato l'IRPEF netta (dopo le detrazioni). Il motore deve quindi
  calcolare: imponibile fiscale → IRPEF lorda → detrazioni → IRPEF netta →
  *solo ora* addizionali (sulla base imponibile, non sull'IRPEF), con gate
  "IRPEF netta > 0".
- **Caso incapienza (RAL basse)**: con IRPEF netta zero il netto è il lordo meno
  i soli contributi (più eventuale trattamento integrativo, fuori dal perimetro
  di questa ricerca): nessuna addizionale.
- La regola è **identica per entrambe** le addizionali (stessa struttura nei due
  decreti istitutivi); differiscono solo i crediti citati nella condizione.

Nota di meccanica (cassa vs competenza): per i lavoratori dipendenti il
sostituto d'imposta trattiene l'addizionale regionale determinata a conguaglio
"in un numero massimo di undici rate" nell'anno successivo (D.Lgs. 446/1997,
art. 50, c. 4 — Normattiva, URL sopra); per la comunale è previsto un acconto
pari al "30% dell'addizionale ottenuta applicando l'aliquota fissata dal comune
per l'anno precedente al reddito imponibile IRPEF dell'anno precedente"
(D.Lgs. 360/1998, art. 1, c. 4 — Normattiva e MEF, URL sopra). Il prototipo
proietta per competenza annua: queste regole riguardano *quando* le somme sono
trattenute in busta, non *quanto* è dovuto per l'anno.

---

## 4. Vigenza per l'anno d'imposta 2026 e regola di fallback

### Comunale (Milano)

- **Termine di approvazione**: le delibere su tariffe e aliquote vanno
  approvate entro la data fissata per la deliberazione del bilancio di
  previsione; **in caso di mancata approvazione entro il termine, le aliquote si
  intendono prorogate di anno in anno** — art. 1, c. 169, L. 27 dicembre 2006,
  n. 296 (riferimento normativo:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2006-12-27;296>);
  regola confermata, con rinvio esplicito al c. 169, dalla pagina MEF "Delibere
  comunali: adempimenti dei comuni":
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/delibere-comunali-adempimenti-dei-comuni/>
- **Termine di efficacia (pubblicazione)**: le delibere di variazione hanno
  effetto dal 1° gennaio dell'anno di pubblicazione sul sito informatico del
  MEF, "a condizione che detta pubblicazione avvenga **entro il 20 dicembre**
  dell'anno a cui la delibera afferisce" — D.Lgs. 23/2011, art. 14, c. 8,
  fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2011-03-14;23~art14!vig=>.
  In assenza di pubblicazione entro il 20 dicembre "si applicano le aliquote
  stabilite per l'anno precedente" (pagina MEF adempimenti, URL sopra). La
  pubblicazione sul sito MEF è costitutiva dell'efficacia: "l'efficacia della
  deliberazione decorre dalla data di pubblicazione nel predetto sito
  informatico" (D.Lgs. 360/1998, art. 1, c. 3 — Normattiva, URL in §3).
- **Applicazione a Milano per il 2026**: alla data della ricerca (2026-08-11) il
  portale MEF non espone alcuna delibera 2026 per Milano (pagina per-comune, §1b).
  Fanno quindi fede **0,8% e soglia 23.000 EUR** della delibera C.C. 46/2020,
  prorogati (le righe MEF 2024 e 2025 sono esse stesse "conferme" inserite
  d'ufficio con pubblicazione al 20-12). Caveat di prodotto: una delibera 2026
  pubblicata entro il 20-12-2026 avrebbe effetto retroattivo al 1° gennaio 2026;
  il valore va rivalidato a fine anno.

### Regionale (Lombardia)

- **Termine**: le leggi regionali che fissano le aliquote vanno pubblicate
  "nella Gazzetta Ufficiale non oltre il 31 dicembre dell'anno precedente a
  quello cui l'addizionale si riferisce" — D.Lgs. 446/1997, art. 50, c. 3
  (Normattiva, URL in §3; conferma MEF, disciplina del tributo regionale, URL in §1a).
- **Scaglioni 2025–2028**: "nelle more del riordino della fiscalità" le regioni
  "possono determinare aliquote differenziate dell'addizionale regionale
  all'IRPEF sulla base dei quattro scaglioni di reddito vigenti fino al
  31 dicembre 2024" per gli anni d'imposta 2025, 2026, 2027 e 2028 — art. 1,
  cc. 727-728, L. 207/2024, come modificati dall'art. 1, c. 649, L. 199/2025;
  fonte consultata: MEF, disciplina del tributo regionale (URL in §1a), che
  cita espressamente questi estremi.
- **Fallback**: per gli stessi anni, se la regione non approva tempestivamente
  la legge modificativa, "l'addizionale regionale all'IRPEF si applica sulla
  base degli scaglioni e delle aliquote vigenti in ciascun ente nell'anno
  precedente" — stessa fonte MEF.
- **Applicazione alla Lombardia per il 2026**: non serve il fallback — il MEF
  espone direttamente la tabella per l'anno d'imposta 2026 (pagina aggiornata al
  28-01-2026, §1a), identica a quella in vigore dal 2022.

---

## 5. Censimento dei punti di discontinuità (per la issue #8)

Discontinuità **legittime** (previste dalle norme) introdotte dalle addizionali,
sul percorso RAL → netto:

1. **Soglia di esenzione comunale di Milano, 23.000 EUR — scalino.**
   A imponibile 23.000,00 l'addizionale comunale è 0; a 23.000,01 è dovuta
   sull'intero imponibile: 0,8% × 23.000,01 ≈ 184,00 EUR. Salto secco di circa
   184 EUR di netto per un centesimo di imponibile in più. Coppia a cavallo,
   in entrambe le grandezze: imponibile fiscale 23.000,00 / 23.000,01 ⇔
   **RAL ≈ 25.327,61 / 25.327,62** (aliquota contributiva piatta 9,19%, sotto la
   prima fascia 56.224 — ricerca issue #2). (Norme: D.Lgs. 360/1998 art. 1
   c. 3-bis; delibera C.C. Milano 46/2020 — §1b.)
2. **Condizione di debenza "IRPEF netta > 0" — scalino, per entrambe le
   addizionali.** Nel punto di reddito in cui l'IRPEF netta passa da 0 a
   positiva, regionale e comunale scattano **per intero** sull'imponibile
   fiscale, non gradualmente. (Norme: D.Lgs. 446/1997 art. 50 c. 2; D.Lgs.
   360/1998 art. 1 c. 4 — §3.) Nel dominio del prototipo il punto è l'uscita
   dalla no tax area: **RC = 8.500** (detrazione art. 13 = 1.955 = 23% × 8.500 —
   ricerca issue #1). Coppia a cavallo, in entrambe le grandezze: RC 8.500,00 /
   8.500,01 ⇔ **RAL ≈ 9.360,20 / 9.360,21**; a 8.500,01 scatta la sola regionale
   (1,23% × 8.500,01 ≈ **104,55 EUR** di salto; la comunale di Milano resta
   esente, imponibile ≤ 23.000).
   **Riconciliazione col mondo dichiarativo** (ricerca issue #5, §9): la
   circolare di liquidazione 730 attiva le addizionali solo se l'IRPEF di
   riferimento supera **10 euro** — regola operativa della liquidazione, non
   delle norme istitutive. Il prototipo proietta il mondo del
   sostituto/competenza annua e usa il gate normativo «IRPEF netta > 0»; nella
   finestra 0 < IRPEF netta ≤ 10 (RC tra 8.500,01 e ~8.543,48 = 1.965/0,23) un
   730-3 reale non esporrebbe addizionali dovute. Scelta registrata in
   `docs/ASSUNZIONI.md`.
3. **Scaglioni regionali Lombardia — nessun salto.** Le aliquote 1,23/1,58/
   1,72/1,73% si applicano per scaglioni progressivi (§1a): ai confini 15.000,
   28.000, 50.000 la funzione è continua, cambia solo la pendenza (kink, non
   scalino). Un salto osservato in corrispondenza di questi confini sarebbe un
   bug, non una discontinuità legittima.

---

## Casi di test candidati

Le fonti primarie consultate **non contengono esempi numerici svolti**. I casi
seguenti sono **derivati dalle regole** documentate sopra (aliquote e soglie con
fonte nei §1–§4; l'aritmetica è nostra e va verificata dal motore, non citata
come valore atteso di fonte):

| Caso | Imponibile fiscale | Addiz. regionale attesa | Addiz. comunale attesa | Cosa prova |
|---|---|---|---|---|
| Confine 1° scaglione | 15.000,00 | 1,23% × 15.000 = 184,50 | 0 (≤ 23.000) | base marginalità |
| Discriminante marginalità | 16.000,00 | 184,50 + 1,58% × 1.000 = 200,30 (se fosse sull'intero reddito: 252,80) | 0 | scaglioni progressivi vs aliquota sull'intero |
| Soglia Milano, sotto | 23.000,00 | 184,50 + 1,58% × 8.000 = 310,90 | **0** (esente) | soglia secca, lato esente |
| Soglia Milano, sopra | 23.000,01 | ≈ 310,90 | **≈ 184,00** (0,8% sull'intero) | scalino: coppia a cavallo con la riga sopra |
| Confine 2° scaglione | 28.000,00 | 184,50 + 1,58% × 13.000 = 389,90 | 0,8% × 28.000 = 224,00 | continuità al confine |
| Confine 3° scaglione | 50.000,00 | 389,90 + 1,72% × 22.000 = 768,30 | 0,8% × 50.000 = 400,00 | continuità al confine |
| Incapienza | imponibile nella no-tax area (IRPEF netta = 0) | **0** | **0** | gate di debenza §3 |

(Le coppie 23.000,00/23.000,01 e il caso incapienza alimentano l'elenco delle
discontinuità legittime della issue #8; la coppia a cavallo è nello stile della
issue #4.)

---

## Lacune

- **Testo letterale dell'art. 1, c. 169, L. 296/2006 non letto direttamente**:
  su Normattiva l'art. 1 (1.364 commi) viene troncato prima del c. 169 in
  consultazione automatica. Il contenuto della regola (termine = bilancio di
  previsione; proroga automatica in caso di mancata approvazione) è confermato
  dalla pagina MEF "adempimenti dei comuni" (fonte primaria, §4), che cita
  espressamente il comma. Da rileggere su Normattiva in consultazione manuale
  prima di citarne il testo tra virgolette.
- **Testo letterale dell'art. 72 L.R. Lombardia 10/2003 non letto
  direttamente**: la banca dati Norme Lombardia ha restituito l'indice ma non il
  corpo dell'articolo (errore server sul permalink). I valori sono comunque
  confermati da due fonti primarie indipendenti (MEF anno 2026 e pagina
  ufficiale di Regione Lombardia, §1a).
- **Estremi dei cc. 727-728 L. 207/2024 e c. 649 L. 199/2025 non verificati su
  Normattiva/Gazzetta**: riportati come citati dalla pagina MEF di disciplina
  del tributo regionale (fonte primaria). Verificare il testo dei commi se
  serviranno tra virgolette.
- **Pagine del Comune di Milano non fetchabili direttamente** (HTTP 403 sul
  sito e sulle FAQ): aliquota, soglia e delibera 46/2020 provengono dai
  risultati di ricerca sul dominio comune.milano.it e coincidono con la pagina
  MEF per-comune aperta direttamente. Il regolamento comunale in PDF non era
  raggiungibile (404): la definizione esatta di "reddito imponibile" usata dal
  Comune per la soglia non è stata letta nel testo regolamentare — per il caso
  del brief (solo reddito da lavoro dipendente, nessun onere) la distinzione non
  cambia il risultato.
- **Delibera 2026 di Milano inesistente alla data della ricerca**: i valori
  2026 derivano dalla proroga (§4). Rivalidare dopo il 20-12-2026.
- ~~Soglie di versamento minimo e loro interazione con la debenza~~ **Chiusa
  dalla ricerca della issue #5** (`docs/ricerca/arrotondamenti-e-quadratura.md`,
  §9-§10): la liquidazione 730 attiva le addizionali solo sopra 10 euro di IRPEF
  di riferimento e il sostituto non versa/rimborsa importi ≤ 12 euro per voce.
  Riconciliazione nel §5, punto 2: il prototipo usa il gate normativo
  «IRPEF netta > 0» (scelta in `docs/ASSUNZIONI.md`).
- **Numero di rate della trattenuta dell'acconto comunale in busta paga** (la
  regionale è in massimo 11 rate, art. 50 c. 4; per la comunale il dettaglio
  delle rate di acconto/saldo non è stato verificato): irrilevante per la
  proiezione annua per competenza, da approfondire solo se si modella la busta
  mese per mese per cassa.
