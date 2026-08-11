# Modello dati delle addizionali per l'Italia intera — forma delle regole comunali e regionali

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-11

## La domanda (issue #18, teodea/jethr-task)

La issue #3 ha stabilito che i dati MEF esistono in CSV per annualità. Quattro
domande sulla forma delle regole, che decidono lo schema del JSON importato:

1. **Aliquote comunali multiple**: per scaglioni progressivi come l'IRPEF, o con
   altro criterio? Su scaglioni statali o propri del comune?
2. **Esenzione + aliquote multiple**: sopra la soglia, gli scaglioni si applicano
   all'intero imponibile (scalino alla Milano) o solo all'eccedenza?
3. **Esenzioni regionali**: scalino o franchigia? Esistono regioni ad aliquota
   unica?
4. **Statuto speciale**: Trento e Bolzano hanno un regime proprio? Se sì, «una
   regola per regione» non basta come chiave.

In coda: tracciato reale dei CSV con i conteggi (comuni «NOTA», aliquote
multiple, «0*»), la chiave di join con l'anagrafica ISTAT, e lo schema proposto.
Il lavoro empirico è stato svolto sui file scaricati l'11-08-2026 (vedi §5).

---

## 1. Aliquote comunali multiple: scaglioni progressivi, su scaglioni statali

**Risposta netta: per scaglioni progressivi come l'IRPEF, ed esclusivamente
sugli scaglioni statali — mai su scaglioni propri del comune.**

- **Norma**: i comuni possono stabilire aliquote dell'addizionale comunale
  "utilizzando esclusivamente gli stessi scaglioni di reddito stabiliti, ai fini
  dell'imposta sul reddito delle persone fisiche, dalla legge statale, nel
  rispetto del principio di progressività" — art. 1, c. 11, D.L. 13 agosto 2011,
  n. 138, conv. L. 148/2011, testo vigente su Normattiva:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2011-08-13;138~art1!vig=>.
  Il D.Lgs. 360/1998, art. 1, di suo non prevede scaglioni (l'aliquota base è
  unica, tetto 0,8 punti al c. 3): la facoltà di differenziare viene tutta dal
  c. 11 del D.L. 138/2011 —
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1!vig=>.
- **Conferma MEF** (disciplina del tributo comunale): le aliquote plurime devono
  essere "articolate secondo i medesimi scaglioni di reddito stabiliti per
  l'IRPEF nazionale, nonché diversificate e crescenti in relazione a ciascuno di
  essi" —
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/disciplina-del-tributo/>,
  anno di consultazione 2026.
- **Anni 2025-2028, quattro scaglioni previgenti** — art. 1, cc. 750-752,
  L. 207/2024, letti nel testo vigente su Normattiva (l'articolo è servito a
  blocchi di 100 commi; blocco 701-800):
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2024-12-30;207~art1!vig=>.
  Fonte alternativa con permalink puntuale: la **Gazzetta Ufficiale** —
  L. 207/2024 in GU Serie Generale n. 305 del 31-12-2024, S.O. n. 43, ELI
  <https://www.gazzettaufficiale.it/eli/id/2024/12/31/24G00229/sg> — serve
  l'art. 1 negli stessi blocchi da 100 commi ma con URL parametrici stabili,
  senza token di sessione; il blocco dei cc. 701-800 (testo originario, che
  copre anche i cc. 727-728 di §3), letto l'11-08-2026:
  <https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.versione=1&art.idGruppo=1&art.flagTipoArticolo=0&art.codiceRedazionale=24G00229&art.idArticolo=1&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=2024-12-31&art.progressivo=8>.
  Attenzione al testo *originario*: nel c. 751 la GU riporta "2025, 2026 e
  2027" e "Per il solo anno di imposta 2025 [...] 15 aprile 2025" — il 2028 e
  il termine del 15-04-2026 arrivano dopo, col c. 650 della L. 199/2025 (URL
  GU qui sotto).
  - **c. 750**: i comuni per l'anno 2025 "modificano, con propria
    deliberazione, entro il 15 aprile 2025, gli scaglioni e le aliquote
    dell'addizionale comunale in conformità alla nuova articolazione prevista
    per l'imposta sul reddito delle persone fisiche".
  - **c. 751**: "Nelle more del riordino della fiscalità degli enti
    territoriali, i comuni possono determinare, per i soli anni di imposta
    2025, 2026, 2027 e 2028, aliquote differenziate dell'addizionale comunale
    all'imposta sul reddito delle persone fisiche sulla base degli scaglioni
    di reddito previsti dall'articolo 11, comma 1, del testo unico di cui al
    decreto del Presidente della Repubblica 22 dicembre 1986, n. 917, vigenti
    fino alla data di entrata in vigore della presente legge". Termini di
    delibera: 15 aprile 2025 e 15 aprile 2026.
  - **c. 752**: senza delibera nei termini, "per gli anni di imposta 2025,
    2026, 2027 e 2028, l'addizionale comunale all'imposta sul reddito delle
    persone fisiche si applica sulla base degli scaglioni di reddito e delle
    aliquote già vigenti in ciascun ente nell'anno precedente a quello di
    riferimento" — la base normativa specifica della regola di proroga usata
    in §5, accanto a quella generale del c. 169 L. 296/2006.

  L'estensione al 2028 e il termine del 15-04-2026 vengono dall'art. 1,
  **c. 650**, L. 199/2025 — non dal c. 649, che copre le sole regioni
  (cc. 727-728, vedi §3). Letto su Normattiva (blocco 601-700:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-12-30;199~art1!vig=>)
  e riscontrato in **Gazzetta Ufficiale** — L. 199/2025 in GU Serie Generale
  n. 301 del 30-12-2025, S.O. n. 42, ELI
  <https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/sg>; blocco dei
  cc. 601-700 (copre anche il c. 649), con URL parametrico stabile, letto
  l'11-08-2026:
  <https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.versione=1&art.idGruppo=1&art.flagTipoArticolo=0&art.codiceRedazionale=25G00212&art.idArticolo=1&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=2025-12-30&art.progressivo=7>:
  "a) al comma 751, le parole: «e 2027» sono sostituite dalle seguenti:
  «, 2027 e 2028» [...] b) al comma 752, le parole: «e 2027» sono sostituite
  dalle seguenti: «, 2027 e 2028»". La facoltà copre quindi il 2028 per
  *entrambi* i livelli. Nel CSV MEF la facoltà ha un **marcatore strutturale**:
  la NOTE "DELIBERA ADOTTATA EX ART. 1, COMMA 751, L. 207/2024" (testo unico,
  sempre identico) compare in **593 comuni** del CSV 2025 e in **143** del CSV
  2026 (riconteggio diretto dell'11-08-2026), e nel 2025 coincide *esattamente*
  — stesso insieme di codici catastali, zero eccezioni nelle due direzioni —
  col set dei 593 comuni a quattro scaglioni previgenti di §5. L'importatore
  deve usare questa NOTE come criterio di riconoscimento della facoltà, non
  dedurla dalle fasce.

**Prova empirica** (elenco CSV MEF, anno d'imposta 2025, anno chiuso — vedi §5):
dei 6.989 comuni con delibera, **1.171 hanno scaglioni multipli**, e le fasce
usate sono *solo due insiemi*: **578 comuni** sui tre scaglioni statali vigenti
(fino a 28.000 / 28.000,01–50.000 / oltre 50.000) e **593 comuni** sui quattro
scaglioni previgenti (15.000 / 28.000 / 50.000 — la facoltà del c. 751).
Nel 2025 nessun comune usa confini propri: le ~14 varianti residue nel testo
delle fasce sono solo grafie diverse degli stessi confini ("fino a 15000€",
"DA 15.001,00 A 28.000,00", ecc.). La risposta alla domanda "3 o 4 aliquote" è
quindi: **entrambe, 578 a tre e 593 a quattro**, su confini statali.

**L'invariante «solo confini statali» vale però solo per il 2025**: nel CSV
2026 c'è già un'eccezione. **Marnate** (VA, codice catastale E965, flag 0)
delibera quattro fasce con la terza "Applicabile a OLTRE € 28000,00 FINO A
€ 55000,00" e la quarta "Applicabile a OLTRE € 55000,00" — il confine 55.000
non appartiene a nessuno dei due insiemi statali (refuso o delibera
irregolare; unico caso sulle 2.988 delibere 2026, riga riletta l'11-08-2026).
Lo schema di §6 regge comunque, perché `fino` è un numero arbitrario, ma
**l'importatore non può validare i confini contro i due insiemi statali**:
li parsa come numeri e al più segnala le divergenze (vedi §5).

---

## 2. Esenzione comunale + scaglioni: scalino sull'intero imponibile

**Risposta netta: scalino. Sopra la soglia gli scaglioni si applicano
all'intero imponibile, mai alla sola eccedenza — il caso Milano generalizza
all'Italia intera.**

- **Norma**: la soglia di esenzione del c. 3-bis "deve essere intesa come limite
  di reddito al di sotto del quale l'addizionale comunale all'imposta sul
  reddito delle persone fisiche non è dovuta e, nel caso di superamento del
  suddetto limite, la stessa si applica al reddito complessivo" — art. 1,
  c. 11, D.L. 138/2011 (Normattiva, URL in §1). Stessa formulazione
  nell'aggiornamento in calce all'art. 1 D.Lgs. 360/1998 (Normattiva, URL in §1)
  e nella pagina MEF di disciplina (URL in §1).
- La norma non distingue fra comune ad aliquota unica e comune a scaglioni: "si
  applica al reddito complessivo" vale per entrambi. Con scaglioni, sopra la
  soglia il calcolo è progressivo *a partire da zero*, non dall'eccedenza.
- **Nessuna franchigia comunale esiste nei dati**: nel CSV 2025 l'esenzione
  universale compare sempre come soglia secca (una sola per comune: nessuna riga
  ha due fasce "Esenzione per redditi imponibili fino a euro N" — conteggio §5).

La funzione `addizionaleComunale` di `src/cascata.js` (soglia secca +
aliquota) e la `addizionaleRegionale` (scaglioni progressivi) si compongono
quindi senza sorprese: la forma comunale generale è «se imponibile ≤ soglia → 0;
altrimenti scaglioni progressivi sull'intero imponibile», di cui l'aliquota
unica è il caso a uno scaglione.

---

## 3. Esenzioni regionali: scalini dichiarati nel testo, mai franchigie; 6 regioni ad aliquota unica

**Risposta netta: tutte le esenzioni regionali censite per il 2026 sono
scalini (sopra soglia si paga su tutto), dichiarati testualmente dalla fonte;
nessuna regione usa la franchigia. Sei enti hanno aliquota unica.**

Censimento completo dal CSV regionale MEF 2026 (72 righe, tutte lette — §5):

| Ente | Meccanismo dell'agevolazione | Forma |
|---|---|---|
| Valle d'Aosta | esenzione fino a 15.000: "Ai soggetti con reddito complessivo oltre 15.000 euro si applica l'aliquota ordinaria **sull'intero imponibile**" | scalino |
| Friuli Venezia Giulia | aliquota ridotta 0,70% fino a 15.000; sopra, "l'aliquota e' pari a 1,23 per cento **sull'intero importo**" | scalino (via aliquota ridotta) |
| P.A. Trento | "deduzione di euro 30.000,00" per redditi ≤ 30.000; "Tale deduzione **non spetta** ai contribuenti aventi un reddito imponibile superiore a euro 30.000,00" | scalino (via deduzione: equivale a esenzioneFinoA = 30.000) |
| P.A. Bolzano | detrazione fissa di 430,50 EUR per redditi ≤ 90.000 (più una detrazione a rampa: 125 × (reddito − 50.000)/25.000, max 125, per redditi > 50.000) | franchigia *economica* (detrazione dall'imposta, pavimento a zero), con scalino a 90.000 |
| Umbria | le maggiorazioni (+0,50 e +1,79 punti sui primi due scaglioni) "non trovano applicazione" per redditi ≤ 28.000; detrazione di 150 EUR per redditi 28.001–50.000 | scaglioni *condizionati* al reddito complessivo + detrazione per fascia |
| Lazio | aliquota 1,73% per redditi ≤ 28.000 (invece dei scaglioni fino a 3,33%); detrazione 60 EUR per redditi 28.001–30.000 | scaglioni condizionati + detrazione per fascia |

- **Fonte di tutte le righe**: CSV MEF addizionale regionale, anno d'imposta
  2026, campi DISPOSIZIONE/NORME/NOTE — download
  `download.php?tipo=reg&anno=2026` dalla pagina
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/download/tabella.htm>
  (file aggiornato al 19-06-2026, scaricato e letto integralmente
  l'11-08-2026). Le virgolette sopra sono testo letterale del campo
  DISPOSIZIONE. Per Trento e Bolzano il testo delle leggi provinciali è stato
  letto direttamente (vedi §4); per l'Umbria, qui sotto.
- **Umbria, legge regionale letta**: L.R. 11 aprile 2025, n. 2, art. 1 —
  testo vigente sul sito dell'Assemblea legislativa dell'Umbria, pubblicata
  sul BUR n. 19, ed. straordinaria, dell'11-04-2025:
  <https://leggi.alumbria.it/parser_nir.php?urn=urn%3Anir%3Aregione.umbria%3Alegge%3A2025-04-11%3B2>
  — **URL fragile**: il certificato TLS di `leggi.alumbria.it` non supera la
  verifica di catena in alcuni client automatici (la pagina va aperta da
  browser). Fonte alternativa stabile e statale: il testo integrale
  dell'art. 1 è ripubblicato in **Gazzetta Ufficiale** come comunicato della
  Regione Umbria, GU Serie Generale n. 88 del 15-04-2025 (ELI:
  <https://www.gazzettaufficiale.it/eli/id/2025/04/15/25A02351/sg>; atto
  completo:
  <https://www.gazzettaufficiale.it/atto/vediMenuHTML?atto.dataPubblicazioneGazzetta=2025-04-15&atto.codiceRedazionale=25A02351&tipoSerie=serie_generale&tipoVigenza=originario>),
  letta l'11-08-2026: i cc. 1-3 citati qui sotto vi compaiono verbatim (testo
  originario, anteriore alla modifica dell'art. 24, L.R. 5/2025). La sostanza
  è confermata verbatim anche dal campo DISPOSIZIONE del CSV regionale MEF
  2026 (fonte della tabella sopra).
  Il c. 1 fissa le maggiorazioni sull'aliquota di base: "a) fino a 15.000,00
  euro, maggiorazione dello 0,5 per cento; b) oltre 15.000,00 euro e fino a
  28.000,00 euro, maggiorazione del 1,79 per cento; c) oltre 28.000,00 euro e
  fino a 50.000,00 euro maggiorazione del 1,89 per cento; d) oltre 50.000,00
  euro, maggiorazione del 2,1 per cento". Il c. 2: le maggiorazioni "di cui al
  comma 1, lettere a) e b), non trovano applicazione nei confronti dei
  soggetti con un reddito imponibile complessivo, ai fini dell'addizionale
  regionale all'IRPEF, fino a 28.000,00 euro". Il c. 3: detrazione di 150,00
  euro per redditi fra 28.001,00 e 50.000,00 euro, e "non può, comunque,
  derivare il riconoscimento di alcun credito d'imposta". **La variante per
  redditi ≤ 28.000 è quindi l'aliquota di base 1,23% su entrambi i primi
  scaglioni** (base nazionale: art. 6 D.Lgs. 68/2011, URL sotto) — non più
  un'inferenza aritmetica dal CSV: i valori sono fissabili nel JSON. Vigenza
  dei cc. 1-3: anni d'imposta 2025, 2026 e 2027, nel testo modificato
  dall'art. 24 della L.R. 29 luglio 2025, n. 5 (note di vigenza, stessa
  fonte).
- **Regioni ad aliquota unica nel 2026: 6** — Valle d'Aosta (1,23), Veneto
  (1,23), Calabria (1,73), Sicilia (1,23), Sardegna (1,23), Basilicata (1,23);
  nel CSV compaiono con FASCIA = "Aliquota Unica" (stessa fonte). L'aliquota
  unica come scaglione singolo `fino a Infinity` regge.
- **Il punto critico del CSV regionale**: le fasce/aliquote sono strutturate,
  ma **le esenzioni e le detrazioni vivono solo nel testo libero del campo
  DISPOSIZIONE** — non esiste un campo `IMPORTO_ESENTE` regionale. Con 21 enti
  la cura manuale è però sostenibile (a differenza dei 7.897 comuni).
- **Cornice normativa**: le aliquote differenziate regionali sono ammesse
  "esclusivamente in relazione agli scaglioni di reddito" statali (art. 6,
  D.Lgs. 68/2011, Normattiva:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2011-05-06;68~art6!vig=>),
  con applicazione progressiva ("diversificate e crescenti in relazione a
  ciascuno di essi" — MEF, disciplina del tributo regionale:
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/>).
  Per il 2025-2028 vale la facoltà dei quattro scaglioni previgenti — art. 1,
  c. 727, L. 207/2024, letto nel testo vigente su Normattiva (URL in §1,
  blocco 701-800): "Nelle more del riordino della fiscalità degli enti
  territoriali, le regioni e le province autonome di Trento e di Bolzano
  possono determinare, per i soli anni di imposta 2025, 2026, 2027 e 2028,
  aliquote differenziate dell'addizionale regionale all'imposta sul reddito
  delle persone fisiche sulla base degli scaglioni di reddito previsti
  dall'articolo 11, comma 1, del testo unico delle imposte sui redditi [...]
  vigenti fino alla data di entrata in vigore della presente legge". Il c. 728
  è la proroga: senza legge modificativa nei termini, l'addizionale "si
  applica sulla base degli scaglioni di reddito e delle aliquote già vigenti
  in ciascun ente nell'anno precedente a quello di riferimento". Il 2028 è
  opera dell'art. 1, c. 649, L. 199/2025, anch'esso letto (URL in §1):
  "All'articolo 1, commi 727 e 728, della legge 30 dicembre 2024, n. 207, le
  parole: «e 2027», ovunque ricorrono, sono sostituite dalle seguenti: «, 2027
  e 2028»". Le detrazioni regionali
  poggiano sull'art. 6, cc. 5-6, D.Lgs. 68/2011 (detrazioni in favore della
  famiglia e in sostituzione di sussidi — Normattiva, URL sopra).
- **Detrazioni familiari fuori perimetro**: Marche, Veneto, Piemonte, Puglia,
  Campania, Sardegna, Trento e Bolzano prevedono agevolazioni legate a figli a
  carico o disabilità (campo DISPOSIZIONE, stessa fonte). Sono già escluse
  dall'assunzione «nessun familiare a carico» di `docs/ASSUNZIONI.md`: per il
  modello dati contano solo le agevolazioni *universali* della tabella sopra.
- **Attenzione alle delibere multiple nello stesso anno**: nel CSV 2026 Molise
  e Puglia compaiono due volte (delibera di gennaio e rideterminazione di
  maggio/giugno per disavanzo sanitario, ex art. 1, c. 174, L. 311/2004 — campo
  NOTE, stessa fonte). L'importazione deve tenere l'ultima per data di
  pubblicazione, non la prima.

---

## 4. Trento e Bolzano: regime proprio; la chiave è l'ente impositore, non la regione

**Risposta netta: sì, hanno un regime proprio. Nel CSV MEF il
Trentino-Alto Adige non esiste come ente: esistono "PROVINCIA AUTONOMA DI
TRENTO" e "PROVINCIA AUTONOMA DI BOLZANO", con leggi provinciali proprie.
«Una regola per regione» non basta: la chiave del modello è l'ente impositore,
21 valori (19 regioni + 2 province autonome).**

- **Prova diretta**: il CSV regionale 2026 (fonte in §3) elenca 21 enti; le
  righe di Trento citano come norma "legge provinciale 23 dicembre 2019, n. 13,
  come modificato dall'articolo 1 della legge provinciale 29 dicembre 2025,
  n. 11", quelle di Bolzano "Art. 21/sexiesdecies, legge provinciale 11 agosto
  1998, n. 9". Nessuna riga "Trentino-Alto Adige".
- **Conferma MEF**: la pagina di disciplina del tributo regionale include
  esplicitamente "le province autonome di Trento e di Bolzano" fra i soggetti
  della facoltà 2025-2028 (URL in §3), e per gli enti a statuto speciale
  documenta poteri propri di maggiorazione (fino a 0,5 punti, o 1 punto per
  rimborso di anticipazioni di liquidità — stessa pagina).
- **Base statutaria, letta**: art. 73, c. 1-bis, Statuto TAA (D.P.R.
  670/1972), Normattiva — "Le province, relativamente ai tributi erariali per
  i quali lo Stato ne prevede la possibilità, possono in ogni caso modificare
  aliquote e prevedere esenzioni, detrazioni e deduzioni purché nei limiti
  delle aliquote superiori definite dalla normativa statale" —
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1972-08-31;670~art73!vig=>
  (il permalink apre sull'indice dell'atto: l'articolo va aperto dalla voce
  «art. 73»). È la copertura di rango costituzionale delle deduzioni e
  detrazioni provinciali qui sotto.
- **Leggi provinciali, lette nel testo vigente** (avvertenza sui due URL:
  entrambi servono applicazioni dinamiche — `doc_dispatcher.aspx` a Trento,
  LexBrowser a Bolzano — che in fetch automatico restituiscono solo la shell
  del sito: il testo si legge da browser. La verifica *machine-readable* dei
  valori portanti — deduzione di 30.000 di Trento; detrazione di 430,50,
  rampa 125 × (reddito − 50.000)/25.000 e incremento marginale oltre 50.000
  di Bolzano — passa dal campo DISPOSIZIONE del CSV regionale MEF 2026 (§3),
  che li riporta verbatim; righe ricontrollate l'11-08-2026):
  - **Trento** — L.P. 23 dicembre 2019, n. 13, art. 1 (Codice provinciale,
    Consiglio della P.A. di Trento, testo aggiornato al 01-01-2026:
    <https://www.consiglio.provincia.tn.it/_layouts/15/dispatcher/doc_dispatcher.aspx?app=clex&at_id=34300>).
    Il c. 2-quater: "Per gli anni d'imposta 2024, 2025 e 2026, ai soggetti
    passivi aventi un reddito imponibile ai fini dell'addizionale regionale
    all'IRPEF non superiore a 30.000 euro è riconosciuta, ai sensi
    dell'articolo 73 dello Statuto speciale, una deduzione dalla base
    imponibile di 30.000 euro. Questa deduzione non spetta ai soggetti passivi
    aventi un reddito imponibile [...] superiore a 30.000 euro" — lo scalino
    della tabella sopra, confermato alla fonte. Il c. 3-bis: per i periodi
    2022-2026 l'aliquota "è aumentata di 0,5 punti percentuali per la quota di
    reddito imponibile eccedente l'importo di 50.000 euro" — incremento
    *marginale*, cioè un normale scaglione. Il c. 2-sexies (detrazione di 246
    euro per figlio, redditi ≤ 50.000) resta fuori perimetro con le altre
    agevolazioni familiari. L'estensione al 2026 è delle ll.pp. 1 agosto 2025,
    n. 5 e 29 dicembre 2025, n. 11 (note al testo, stessa fonte).
  - **Bolzano** — L.P. 11 agosto 1998, n. 9, art. 21-sexiesdecies (LexBrowser,
    banca dati normativa della P.A. di Bolzano:
    <http://lexbrowser.provinz.bz.it/doc/it/lp-1998-9_2/legge_provinciale_11_agosto_1998_n_9.aspx?view=1>).
    C. 1: dal 2025, ai redditi imponibili non superiori a 90.000,00 euro
    "spetta una detrazione dall'importo dovuto a titolo di addizionale
    regionale IRPEF di 430,50 euro" (sostituito da ultimo dall'art. 1, c. 10,
    L.P. 20 dicembre 2024, n. 11 — nota 110 al testo). C. 4: dal 2022, "per la
    parte di reddito imponibile [...] eccedente la soglia di 50.000,00 euro"
    l'aliquota "è incrementata dello 0,5 per cento" — di nuovo marginale.
    C. 4-bis: la detrazione a rampa è "determinata dall'importo di 125,00 euro
    moltiplicato per il rapporto tra il reddito imponibile diminuito di
    50.000,00 euro e l'importo di 25.000,00 euro. L'importo massimo detraibile
    ammonta a 125,00 euro". C. 4-ter: le detrazioni "sono cumulabili ma, in
    nessun caso, generano credito d'imposta". I valori del §3 (430,50 + rampa)
    sono quindi fissabili nel JSON dalla fonte provinciale, non solo dal CSV.
- **Conseguenza sull'interfaccia e sul vincolo di CONTEXT.md**: il glossario
  vieta la provincia come entità fiscale del calcolo. Il vincolo regge se la
  chiave si chiama **ente impositore dell'addizionale "regionale"** e viene
  *derivata* dal comune (sigla TN → P.A. Trento, sigla BZ → P.A. Bolzano, ogni
  altra sigla → regione ISTAT del comune): nessun input "provincia" in
  interfaccia, e la prima dropdown — se si sceglie regione+comune — deve
  elencare i 21 enti, non le 20 regioni (il Trentino-Alto Adige compare come
  due voci). L'alternativa più pulita: un solo selettore del comune, con l'ente
  derivato. La nota del glossario («la provincia non è un'entità fiscale») va
  precisata per il caso TN/BZ quando il selettore verrà implementato.

---

## 5. Il tracciato reale dei CSV e i conteggi

Tutti i numeri di questa sezione sono **contati** dai file scaricati
l'11-08-2026 (script di conteggio nell'area di lavoro temporanea, parser CSV
con virgolette):

- comunale 2026: `download.php?anno=2026` e comunale 2025:
  `download.php?anno=2025` dalla pagina "Elenchi generali aggiornati
  quotidianamente":
  <https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addirpef_newDF/download/tabella.htm>.
  **Attenzione al percorso**: `addirpef_newDF/download/download.php?anno=N`
  risponde oggi `301 Moved Permanently` verso
  `nuova_addcomirpef/download/download.php?anno=N` (verificato con richiesta
  HEAD l'11-08-2026; il percorso nuovo risponde `200` col CSV in
  `Content-Disposition`): l'importatore deve seguire i redirect o usare
  direttamente il percorso nuovo.
- regionale 2026: `download.php?tipo=reg&anno=2026` (URL pagina in §3)

### Tracciato comunale (dal 2021)

Separatore `;`, UTF-8, una riga per comune. Colonne: `CODICE_CATASTALE`,
`COMUNE`, `PR`, `NUMERO_DELIBERA`, `DATA_DELIBERA`, `DATA_PUBBLICAZIONE`,
`NOTE`, `MULTIALIQ`, poi dodici coppie `ALIQUOTA[_n]`/`FASCIA[_n]`, infine
`FLAG_NUOVA` e `IMPORTO_ESENTE`. Convenzioni osservate:

- L'**esenzione universale** è una pseudo-aliquota: prima (o ultima) coppia con
  aliquota `0` e fascia "Esenzione per redditi imponibili fino a euro N", più il
  campo strutturato `IMPORTO_ESENTE = N`. Milano 2025: `MULTIALIQ=SI`,
  `[0] Esenzione ... 23.000,00`, `[,8] Aliquota unica`, `FLAG_NUOVA=2`,
  `IMPORTO_ESENTE=23000` — cioè un comune ad aliquota unica può avere
  `MULTIALIQ=SI` per via della pseudo-riga di esenzione.
- Le **aliquote decimali** hanno la virgola e possono mancare dello zero
  iniziale (`,8` = 0,8; esiste anche `1,014`, Palermo).
- `FLAG_NUOVA` classifica il sistema: 1 unica, 2 unica+esenzione, 3 scaglioni,
  4 scaglioni+esenzione, 5 unica+esenzioni *specifiche*, 6
  scaglioni+esenzioni specifiche, e **0 per i casi fuori formato standard** —
  legenda sulla pagina di download (URL sopra). Empiricamente il flag 0 marca
  i comuni sui **quattro scaglioni previgenti** ex c. 751 (593 su 594 righe
  flag 0 del 2025 hanno 4 fasce di scaglione). **Il criterio robusto per
  riconoscere la facoltà del c. 751 è però la NOTE** "DELIBERA ADOTTATA EX
  ART. 1, COMMA 751, L. 207/2024" (593 comuni nel 2025, 143 nel 2026,
  coincidenza esatta col set a quattro scaglioni nel 2025 — §1): il flag 0 da
  solo non basta, perché marca anche fuori-formato di altra natura (es.
  Marnate nel 2026, qui sotto).
- **I confini delle fasce non sono validabili**: l'invariante «solo confini
  statali» vale nel 2025 ma il CSV 2026 contiene già l'eccezione di Marnate
  (confine 55.000 — §1). L'importatore parsa i confini come numeri arbitrari
  e non li confronta con i due insiemi statali; una divergenza va al più
  loggata, mai rifiutata.
- **Trappola di importazione**: per i comuni flag 0, `IMPORTO_ESENTE` **non è
  valorizzato** anche quando l'esenzione c'è — nel 2025, 411 dei 594 comuni
  flag 0 hanno l'esenzione solo come fascia testuale "Esenzione per redditi
  imponibili fino a euro N" con `IMPORTO_ESENTE=0`. Il pattern è però regolare
  e si estrae con un'espressione regolare: l'importatore deve parsare le fasce,
  non fidarsi del solo campo strutturato.
- La convenzione **"0\*"** ha definizione ufficiale sulla pagina di download:
  "Qualora, alla data dell'interrogazione, il comune non abbia adottato la
  delibera per l'anno in corso, in corrispondenza dello stesso viene riportata
  la dicitura 0\*". **Quindi nell'anno in corso "0\*" non distingue** il comune
  che non ha mai istituito il tributo da quello in proroga (art. 1, c. 169,
  L. 296/2006 — ricerca issue #3, §4).

### Conteggi, anno d'imposta 2025 (anno chiuso: la base per la proroga)

7.896 righe. Con delibera: **6.989**; "0\*" (mai istituito): **907**.

| Forma | Comuni | % dei 6.989 |
|---|---|---|
| aliquota unica, senza esenzione | 3.800 | 54,4% |
| aliquota unica + esenzione universale | 1.939 | 27,7% |
| scaglioni multipli, senza esenzione | 313 | 4,5% |
| scaglioni multipli + esenzione universale | 834 | 11,9% |
| esenzioni **non universali** descrittive («NOTA») | **103** | **1,5%** |

La tabella si riconcilia col conteggio di §1 (1.171 comuni a scaglioni
multipli) così: la riga «NOTA» prevale sulle altre, e **24 dei 103 comuni
«NOTA» hanno anche scaglioni multipli** (10 con flag 6 e 14 con flag 0; gli
altri 79 sono ad aliquota unica). Quindi 313 + 834 + 24 = 1.171. In dettaglio:
i 578 comuni sui tre scaglioni statali sono i flag 3/4/6 (145 + 423 + 10), i
593 sui quattro previgenti sono i flag 0 a scaglioni (conteggi rifatti sul CSV
2025 l'11-08-2026, stesso parser di §5).

- Dei 6.989, **87 comuni hanno deliberato aliquota unica pari a 0** ("Non
  applica" nella legenda note MEF:
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/aliquote-applicabili/legenda-note/>):
  caso legittimo, voce a zero, distinto da "0\*".
- **12 comuni superano il tetto dello 0,8%** (righe rilette una per una dal
  CSV 2025 l'11-08-2026, aliquota massima per comune). Al massimo **1,2% sono
  sei**: Alessandria (scaglioni 0,8/1,1/1,2), Brindisi (unica 1,2), Genova
  (1,0/1,1/1,2), Lecce (0,8/0,8/1,2/1,2), Torino (0,8/0,8/1,1/1,2), Vibo
  Valentia (unica 1,2). Poi Salerno 1,1; Palermo 1,014; Avellino e Napoli
  1,0; Potenza 0,8/0,8/1,0; Roma 0,9 è l'eccezione di legge (art. 1, c. 3,
  D.Lgs. 360/1998). La copertura primaria della deroga, letta su
  Normattiva, sta in due norme:
  - **art. 1, c. 572, lett. a), L. 234/2021**: i comuni capoluogo di città
    metropolitana con disavanzo pro capite oltre 700 euro (c. 567) che
    sottoscrivono l'accordo di ripiano possono deliberare "un incremento
    dell'addizionale comunale all'IRPEF, in deroga al limite previsto
    dall'articolo 1, comma 3, del decreto legislativo 28 settembre 1998,
    n. 360" —
    <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2021-12-30;234~art1!vig=>
    (blocco commi 501-600). I cc. 565-566, ipotizzati dalla issue, istituiscono
    invece solo il fondo per i comuni in riequilibrio: la deroga non sta lì.
  - **art. 43, c. 2, D.L. 50/2022** (conv. L. 91/2022): estende le stesse
    misure ai comuni capoluogo di provincia con disavanzo pro capite oltre 500
    euro, con tetto — l'incremento "non può essere superiore a 0,4 punti
    percentuali" —
    <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2022-05-17;50~art43!vig=>.
    0,8 + 0,4 = 1,2: esattamente il massimo osservato nel CSV per i
    capoluoghi di provincia (Alessandria, Brindisi, Lecce, Vibo Valentia);
    Torino e Genova, capoluoghi di città metropolitana, arrivano allo stesso
    1,2 per la via della L. 234/2021, che non fissa quel tetto.

  La norma è per categoria di comune; le 12 delibere una per una non sono
  state lette (vedi Lacune). **L'importatore non deve validare né troncare a
  0,8.**

### Anno d'imposta 2026 (in corso) e la regola di importazione

7.897 righe (una in più del 2025: M439 "CASTEGNERO NANTO", fusione in provincia
di Vicenza). Con delibera pubblicata all'11-08-2026: **2.988** (fra cui 35 con
flag 5/6). "0\*": **4.909**, di cui — incrociando col 2025 — **4.024 hanno una
delibera 2025** (proroga: la regola vera è quella dell'anno prima) e **884 sono
"0\*" anche nel 2025** (mai istituito, addizionale zero). Milano è fra i 4.024.

**Regola di importazione che ne discende**: per l'anno d'imposta N in corso si
importano *due* file, N e N−1; ogni "0\*" dell'anno N con delibera nell'anno
N−1 eredita la regola N−1 (proroga ex art. 1, c. 169, L. 296/2006); "0\*" in
entrambi gli anni = tributo non istituito, voce a zero in cascata. Dopo il
20 dicembre il file N diventa autosufficiente (definizione "0\*" sopra;
termine di efficacia: D.Lgs. 23/2011, art. 14, c. 8 — ricerca issue #3, §4).

### I comuni «NOTA»: quanti, in che forma, come riconoscerli

- **103 comuni nel 2025 (1,5%)**. Si riconoscono automaticamente: flag 5 (78) e
  flag 6 (10), più 15 comuni flag 0 la cui fascia di esenzione non segue il
  pattern universale. Criterio robusto per l'importatore: fascia che inizia per
  "Esenzione per" ma **non** per "Esenzione per redditi imponibili fino a".
- **Forma**: testo libero per categorie di reddito, con soglia numerica dentro
  la frase — es. Acerra: "Esenzione per i redditi di lavoratori dipendenti
  8.174,00 euro"; Bacoli: "Esenzione per CONTRIBUENTI CON REDDITO DI LAVORO
  DIPENDENTE COMPLESSIVO ANNUO IMPONIBILE INFERIORE A EURO 8.000"; Gottolengo:
  esenzione per dipendenti e pensionati "con reddito complessivo irpef non
  superiore ad euro 9.360,00" (CSV 2025, righe lette direttamente).
- **Raccomandazione esplicita: non escluderli.** Calcolare con la parte
  strutturata (aliquote/scaglioni, che c'è sempre) ignorando l'esenzione
  specifica, e mostrare il testo della nota accanto alla voce. Motivo: le
  soglie descrittive stanno quasi tutte sotto i 15.000 EUR di reddito, dove per
  il lavoratore dipendente tipico l'addizionale vale poche decine di euro;
  escludere 103 comuni per quello è sproporzionato. La degradazione è
  dichiarata (il prototipo può *sovrastimare* l'addizionale comunale di questi
  comuni sotto la soglia descritta) e va registrata in `docs/ASSUNZIONI.md`
  quando il selettore verrà implementato.

### Anagrafica ISTAT e chiave di join

- **File**: "Elenco dei comuni italiani", permalink CSV
  <https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv>
  (scaricato l'11-08-2026: ISO-8859-1, separatore `;`, header su più righe con
  a-capo dentro le virgolette — serve un parser CSV vero, non uno split).
  Pagina di provenienza: "Codici statistici delle unità amministrative
  territoriali: comuni, città metropolitane, province e regioni",
  <https://www.istat.it/it/archivio/6789>, aggiornamento al 21-02-2026.
- **Colonne utili**: "Codice Catastale del comune", "Denominazione in
  italiano", "Denominazione Regione", "Sigla automobilistica" (166 comuni TN,
  116 BZ), "Codice Regione".
- **Chiave di join**: `CODICE_CATASTALE` (MEF) ↔ "Codice Catastale del comune"
  (ISTAT). **Copertura provata: 7.896 su 7.897** righe MEF 2026 trovano
  riscontro (99,99%); l'unico buco è M439 Castegnero Nanto (VI), fusione
  presente nel MEF ma non ancora nell'anagrafica ISTAT del 21-02-2026 (i due
  comuni pre-fusione sono ancora in entrambi i file). In direzione inversa:
  zero comuni ISTAT senza riga MEF. Fallback per i buchi da fusione: tenere il
  comune con la sola sigla provincia del MEF finché ISTAT non aggiorna.
- **Derivazione dell'ente impositore** (§4): sigla TN → P.A. Trento, BZ → P.A.
  Bolzano, altrimenti "Denominazione Regione".

---

## 6. Lo schema del modello dati

**Verdetto sull'ipotesi di lavoro**: `{ scaglioni, esenzioneFinoA }` **regge
l'intero universo comunale** — tutte le 6.989 regole 2025 sono (scaglioni
progressivi sull'intero imponibile sopra un'eventuale soglia secca), con
l'aliquota unica come scaglione singolo `fino: null` e la nota testuale come
campo di degradazione per i 103 «NOTA». **Non regge da sola l'universo
regionale**: il censimento §3 richiede tre estensioni — varianti di scaglioni
condizionate al reddito complessivo (Umbria, Lazio, FVG), detrazioni per fascia
con pavimento a zero (Umbria, Lazio, Bolzano), e la detrazione a rampa di
Bolzano. L'esenzione a scalino resta un caso particolare (variante a scaglioni
vuoti), quindi la forma unificata è una generalizzazione, non una sostituzione.

```jsonc
// dati/addizionali/2026.json — generato: comuni dallo script di importazione
// (CSV MEF N + fallback N-1), enti curati a mano dal CSV regionale (21 righe).
{
  "anno": 2026,

  "enti": {                              // ente impositore, chiave del §4
    "lombardia": {
      "nome": "Lombardia",
      "scaglioni": [                     // progressivi, sull'intero imponibile
        { "fino": 15000, "aliquota": 0.0123 },
        { "fino": 28000, "aliquota": 0.0158 },
        { "fino": 50000, "aliquota": 0.0172 },
        { "fino": null,  "aliquota": 0.0173 }   // null = Infinity
      ],
      "esenzioneFinoA": null,            // scalino: <= soglia -> 0, sopra tutto
      "varianti": [],                    // FVG/Umbria/Lazio: scaglioni alternativi
                                         //   se imponibile <= soglia, es. FVG:
                                         //   [{ "seImponibileFinoA": 15000,
                                         //      "scaglioni": [{ "fino": null, "aliquota": 0.007 }] }]
      "detrazioni": [],                  // pavimento a zero, mai credito. Umbria:
                                         //   [{ "da": 28000.01, "finoA": 50000, "importo": 150 }]
                                         //   Bolzano, rampa (unico caso, curato a mano):
                                         //   [{ "da": 50000.01, "finoA": null, "importo": 125,
                                         //      "rampa": { "da": 50000, "ampiezza": 25000 } }]
      "fonte": { "url": "...", "delibera": "...", "pubblicata": "2026-01-28" }
    },
    "trento":  { "nome": "P.A. Trento",  "esenzioneFinoA": 30000, "...": "..." },
    "bolzano": { "nome": "P.A. Bolzano", "...": "..." }
  },

  "comuni": {                            // chiave: codice catastale
    "F205": {
      "nome": "Milano", "provincia": "MI", "ente": "lombardia",
      "scaglioni": [ { "fino": null, "aliquota": 0.008 } ],
      "esenzioneFinoA": 23000,
      "nota": null,                      // testo libero per i 103 «NOTA» (§5):
                                         //   calcolo con la parte strutturata,
                                         //   nota mostrata accanto alla voce
      "fonte": { "delibera": "46/2020", "pubblicata": "2025-12-20", "proroga": true }
    }
    // comune mai istituito o aliquota deliberata 0: scaglioni [{fino:null, aliquota:0}]
    //   e voce a zero in cascata — mai riga assente
  }
}
```

Proprietà che lo schema garantisce, contro i casi censiti:

1. **Aliquota unica = scaglione singolo** (`fino: null`) — regge (§1, §3).
2. **Scalino comunale e regionale** = `esenzioneFinoA` (§2, §3); la deduzione
   di Trento vi si riduce esattamente (§3).
3. **FVG/Umbria/Lazio** = `varianti` selezionate sul reddito complessivo: si
   valuta la prima variante con `seImponibileFinoA >= imponibile`, altrimenti
   gli `scaglioni` base. Introduce scalini legittimi (da censire per la
   issue #8: FVG a 15.000, Umbria e Lazio a 28.000 — mitigati dalle
   detrazioni).
4. **Detrazioni per fascia** con pavimento a zero ("non sorge alcun credito
   d'imposta", testo ricorrente nel campo DISPOSIZIONE — §3): dopo gli
   scaglioni, prima del gate di debenza. La rampa di Bolzano è l'unico caso non
   tabellare: campo `rampa` dedicato, usato da un solo ente.
5. **I comuni non usano mai** `varianti` né `detrazioni`: lo schema comunale
   effettivo resta `{ scaglioni, esenzioneFinoA, nota }` — l'ipotesi della
   issue, più il campo di degradazione.
6. Il **motore diventa una funzione sola** per entrambe le addizionali
   (le due funzioni di `src/cascata.js` convergono): gate IRPEF netta > 0 →
   esenzione a scalino → varianti → scaglioni progressivi → detrazioni con
   pavimento. La costante di Milano/Lombardia attuale è il caso degenere.

---

## Lacune

- **Le 12 delibere comunali sopra lo 0,8% non sono state lette una per una**:
  la copertura normativa della deroga è verificata per categoria di comune
  (art. 1, c. 572, lett. a), L. 234/2021 per i capoluoghi di città
  metropolitana; art. 43, c. 2, D.L. 50/2022 per i capoluoghi di provincia —
  §5, testi letti su Normattiva), ma l'abbinamento comune-per-comune fra
  delibera e canale normativo (quale accordo, sottoscritto quando) non è stato
  verificato sulle singole delibere comunali. Da fare solo se e quando quelle
  aliquote entreranno nei dati con la fonte per riga.
- **La numerazione dei blocchi di commi su Normattiva non è un permalink**: i
  cc. 727-728, 750-752 (L. 207/2024), 649-650 (L. 199/2025) e 567-572
  (L. 234/2021) sono stati letti scaricando i blocchi `caricaArticolo` da 100
  commi in cui Normattiva spezza l'art. 1 delle leggi di bilancio; gli URL dei
  blocchi contengono parametri di sessione e non sono citabili come permalink.
  Il permalink stabile resta quello dell'articolo intero (riportato in §1, §3
  e §5), da cui i blocchi si raggiungono in consultazione manuale. La lacuna è
  però **colmata per le due leggi di bilancio** dalla Gazzetta Ufficiale: i
  `caricaArticolo` di gazzettaufficiale.it hanno URL parametrici senza token
  di sessione (verificati anche senza cookie l'11-08-2026) e i due blocchi
  citati in §1 coprono cc. 727-728 e 750-752 (L. 207/2024, testo originario)
  e cc. 649-650 (L. 199/2025). Resta senza permalink puntuale il solo blocco
  dei cc. 567-572 della L. 234/2021, letto su Normattiva.
- **Pagina ISTAT ed estensione del permalink**: la pagina di provenienza
  dichiara il permalink come xlsx; il permalink CSV usato qui funziona ed è
  stato scaricato e parsato (7.896 comuni), ma il formato esposto potrebbe
  cambiare: lo script di importazione deve fallire rumorosamente se il tracciato
  cambia.
- **Il CSV comunale 2026 è una fotografia all'11-08-2026**: 4.909 "0\*" sono in
  attesa di delibera; i conteggi 2026 vanno rifatti dopo il 20-12-2026
  (presidio: `docs/ricerca/rivalidazioni-fonti.md`). I conteggi definitivi di
  questa ricerca sono quelli del 2025, anno chiuso.
