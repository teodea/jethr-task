# Ricerca: imposta sostitutiva sugli incrementi retributivi da rinnovi contrattuali

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-12
Issue di origine: `teodea/jethr-task#25`

## La domanda

Per il 2026 esiste una misura di imposta sostitutiva sugli incrementi retributivi
derivanti da rinnovi di contratti collettivi. Due ricerche precedenti, sulle
stesse fonti, hanno restituito valori contraddittori: aliquota 5% oppure 10%,
soglia di reddito 33.000 oppure 80.000 EUR. Sei domande: aliquota esatta; soglia
(importo, anno, grandezza); somme incluse ed escluse; coordinamento con la
detassazione dei premi di risultato; norma primaria con articolo e comma; e se la
misura ha una scadenza.

## Sintesi operativa (le sei risposte in una tabella)

| Domanda | Risposta netta 2026 | Fonte |
|---|---|---|
| 1. Aliquota | **5%**, sostitutiva di IRPEF e addizionali regionali e comunali | art. 1, c. 7, L. 199/2025 |
| 2. Soglia | **33.000 EUR** di **reddito di lavoro dipendente** conseguito nell'**anno 2025** (non reddito complessivo, non 2026) | art. 1, c. 7, secondo periodo, L. 199/2025; Circ. AdE 2/E/2026, § 1 |
| 3. Somme | incrementi da **rinnovi di CCNL nazionali sottoscritti dall'1/1/2024 al 31/12/2026**, **corrisposti nel 2026**, che confluiscono nella **retribuzione diretta**; **nessun tetto d'importo**; agevolazione **automatica ma rinunciabile** per iscritto | art. 1, c. 7, L. 199/2025; Circ. 2/E/2026 § 1; Circ. 3/E/2026 §§ 1.1–1.4 |
| 4. Coordinamento con i premi di risultato | misure **indipendenti e cumulabili**: norme, soglie, tetti e aliquote distinti; nessuna disposizione le mette in concorrenza | art. 1, cc. 7, 9 e 11, L. 199/2025; art. 1, cc. 182 e 186, L. 208/2015 |
| 5. Norma primaria | **art. 1, comma 7, L. 30 dicembre 2025, n. 199** (legge di bilancio 2026) | Normattiva; Ris. AdE 3/E del 29/01/2026; Circ. 2/E e 3/E del 2026 |
| 6. Scadenza | **sì: misura per il solo anno d'imposta 2026** — non è a regime, non è prorogata al 12/08/2026 | art. 1, c. 7, L. 199/2025 |

Formula, se un giorno servisse:

```
imponibileSostitutiva = quota di retribuzione 2026 costituita da incrementi da rinnovo agevolabili
impostaSostitutiva    = 5% × imponibileSostitutiva            // sostituisce IRPEF + addizionali su quella quota
redditoComplessivo    = imponibileFiscale − imponibileSostitutiva   // art. 3, c. 3, lett. a), TUIR
```

con l'eccezione del trattamento integrativo, per il quale la verifica di capienza
torna a computare anche la quota assoggettata a sostitutiva (§ 7.2).

---

## 0. Da dove nascono le due contraddizioni

Entrambe vengono dalla **sovrapposizione con un'altra misura**, la detassazione
dei premi di risultato. Sono due regimi distinti che convivono nella stessa legge
di bilancio e nella stessa circolare:

| | Incrementi da rinnovo | Premi di risultato |
|---|---|---|
| Norma istitutiva | art. 1, c. 7, L. 199/2025 | art. 1, cc. 182-189, L. 208/2015 |
| Aliquota 2026 | **5%** | **1%** (art. 1, c. 9, L. 199/2025) — ordinaria **10%** (c. 182) |
| Tetto d'importo | **nessuno** | **5.000 EUR** per 2026-2027 (c. 9) |
| Soglia soggettiva | reddito di lavoro dipendente **2025 ≤ 33.000 EUR** | reddito di lavoro dipendente dell'**anno precedente ≤ 80.000 EUR** (c. 186) |

Il **10%** è quindi l'aliquota ordinaria dei premi di risultato, non degli
incrementi; gli **80.000 EUR** sono la soglia dei premi di risultato, non degli
incrementi. Nessuno dei due valori appartiene alla misura oggetto della issue.

---

## 1. Aliquota: 5 per cento (domanda 1)

**Risposta netta: 5 per cento**, imposta sostitutiva dell'IRPEF *e* delle
addizionali regionali e comunali.

Testo dell'art. 1, comma 7, L. 199/2025, letto su Normattiva (testo vigente):

> «Al fine di favorire l'adeguamento salariale al costo della vita e di
> rafforzare il legame tra produttività e salario, gli incrementi retributivi
> corrisposti ai lavoratori dipendenti nell'anno 2026, in attuazione di rinnovi
> contrattuali sottoscritti dal 1° gennaio 2024 al 31 dicembre 2026, sono
> assoggettati, salva espressa rinuncia scritta del prestatore di lavoro, a
> un'imposta sostitutiva dell'imposta sul reddito delle persone fisiche e delle
> addizionali regionali e comunali pari al 5 per cento. L'imposta sostitutiva di
> cui al primo periodo si applica soltanto ai lavoratori del settore privato con
> un reddito di lavoro dipendente, nell'anno 2025, non superiore a 33.000 euro.»

Fonte: Normattiva, L. 30 dicembre 2025, n. 199, art. 1, c. 7,
<https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2025-12-30&atto.codiceRedazionale=25G00212&atto.articolo.numero=1&atto.articolo.sottoArticolo=1&atto.articolo.sottoArticolo1=10&tabID=0.1&title=Articolo>, anno 2025.

Il virgolettato è **identico** al testo riportato in nota 1 della Circolare AdE
n. 2/E del 24/02/2026 e in nota 1 della Circolare AdE n. 3/E del 24/06/2026 (PDF
letti per intero, vedi Nota metodologica): tre riscontri indipendenti dello
stesso testo. La Risoluzione AdE n. 3/E del 29/01/2026 lo parafrasa in premessa e
denomina i codici tributo «*… - articolo 1, comma 7, legge 30 dicembre 2025,
n. 199*».

Le due circolari qualificano la misura come «imposta sostitutiva pari al 5 per
cento per i lavoratori dipendenti privati, sugli incrementi retributivi,
corrisposti nell'anno 2026, in attuazione dei contratti collettivi sottoscritti
negli anni 2024, 2025 e 2026» (Circ. 2/E/2026, Premessa, p. 3;
Circ. 3/E/2026, Premessa, p. 3).

**Il 10% non c'entra**: è l'aliquota base della detassazione dei premi di
risultato, art. 1, c. 182, L. 28 dicembre 2015, n. 208, riportata alla lettera
nella nota 18 della Circ. 2/E/2026 («*imposta sostitutiva … pari al 10 per cento,
entro il limite di importo complessivo di 3.000 euro lordi*»).

---

## 2. Soglia: 33.000 EUR di reddito di lavoro dipendente **2025** (domanda 2)

**Risposta netta: 33.000 EUR**, riferiti al **reddito di lavoro dipendente**
(non al reddito complessivo) conseguito nell'**anno 2025** (non nel 2026).

- Il secondo periodo del comma 7 la scrive così: «*si applica soltanto ai
  lavoratori del settore privato con un reddito di lavoro dipendente, nell'anno
  2025, non superiore a 33.000 euro*» (fonte al § 1).
- La Circ. 2/E/2026 (§ 1, p. 4) precisa il perimetro della verifica: «*Nella
  verifica del predetto limite reddituale devono essere inclusi tutti i redditi
  di lavoro dipendente percepiti dal lavoratore nel periodo d'imposta 2025, anche
  se derivanti da più rapporti di lavoro*», con rinvio in nota 3 alla
  circ. 28/E/2016, § 1.1.2. Fonte:
  <https://www.agenziaentrate.gov.it/portale/documents/20143/9680913/Circolare+n.+2+del+24+febbraio+2026/a340d513-97f7-061b-108f-cbf31ceb21d9>, anno 2026.
- Onere informativo: se nel 2025 il lavoratore ha avuto più datori, «*comunica
  all'attuale datore di lavoro le informazioni relative ai redditi derivanti
  dagli altri rapporti di lavoro, attraverso la consegna delle certificazioni
  uniche (CU) o, in mancanza, tramite una dichiarazione sostitutiva di atto di
  notorietà*» ex art. 47 d.P.R. 445/2000 (Circ. 2/E/2026, § 1, pp. 7-8).
- La soglia è **secca**, non un tetto d'importo: superati i 33.000 EUR nel 2025
  l'agevolazione non spetta affatto per il 2026. Il comma 7 non prevede nessun
  décalage. [lettura del testo]

**Gli 80.000 EUR non c'entrano**: sono la soglia soggettiva dei **premi di
risultato**, art. 1, c. 186, L. 208/2015 — «*Le disposizioni di cui ai commi da
182 a 185 trovano applicazione per il settore privato e con riferimento ai
titolari di reddito di lavoro dipendente di importo non superiore, nell'anno
precedente quello di percezione delle somme di cui al comma 182, a euro
50.000*» nel testo originario pubblicato in Gazzetta
(<https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=2&art.idArticolo=1&art.versione=1&art.codiceRedazionale=15G00222&art.dataPubblicazioneGazzetta=2015-12-30&art.idGruppo=0&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=0>, anno 2015),
importo poi elevato a **80.000 EUR** dall'art. 1, c. 160, lett. d), L. 232/2016 —
Circ. AdE n. 5/E del 29/03/2018, § 1, lett. a): «*possono fruire del regime di
favore i lavoratori che nell'anno precedente a quello di percezione del premio
siano stati titolari di reddito di lavoro dipendente non superiore ad euro 80.000
annui, e non più euro 50.000 annui, come in origine previsto dalla legge di
Stabilità 2016*»
(<https://www.agenziaentrate.gov.it/portale/documents/20143/297586/Circolare+n+5+del+29+03+2018_Circolare+_5_29032018.pdf/b2c59474-6b1c-4b5f-f3b7-8918c5c4cfe9>, anno 2018).
Conferma operativa vigente nelle **istruzioni 730/2026, rigo C4**: possono fruire
della tassazione agevolata i lavoratori «*che nell'anno d'imposta 2024 abbiano
percepito redditi da lavoro dipendente d'importo non superiore a 80.000 euro*»
(p. 40 del PDF,
<https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734>, anno 2026).
Vedi Lacune per il testo vigente del c. 186, non letto direttamente.

---

## 3. Quali somme rientrano, quali no (domanda 3)

### 3.1 La finestra temporale: due date, non una

Il comma 7 incrocia **due** condizioni temporali indipendenti:

1. il **rinnovo** dev'essere sottoscritto fra il **1° gennaio 2024 e il
   31 dicembre 2026** (testo del comma; la Circ. 2/E/2026, § 1, p. 4, precisa che
   si tratta di «*rinnovi dei contratti collettivi **nazionali** sottoscritti
   negli anni 2024, 2025 e 2026*»);
2. l'incremento dev'essere **corrisposto dal 1° gennaio al 31 dicembre 2026**,
   «*fermo restando il principio di cassa allargato*» — cioè conta anche quanto
   pagato entro il 12 gennaio 2027 se riferito al 2026 (Circ. 2/E/2026, § 1,
   p. 4, con nota 4 che richiama l'art. 51, c. 1, ultimo periodo, TUIR).

Conseguenze esplicitate dalle circolari:

- «*Sono esclusi, quindi, dall'agevolazione gli importi derivanti dai medesimi
  rinnovi, ma erogati prima del 1° gennaio 2026*» (Circ. 2/E/2026, § 1, p. 5).
- Se il rinnovo distribuisce l'aumento **su più anni**, l'imposta sostitutiva
  «*si applichi comunque alle tranche di incremento corrisposte dal 1° gennaio al
  31 dicembre 2026, ancorché la loro erogazione sia iniziata precedentemente*»
  (ivi). **Esempio ufficiale** (Circ. 2/E/2026, § 1, p. 5): CCNL rinnovato il
  22/04/2025 con aumento mensile a regime di 200 EUR in quattro rate — 27,00 EUR
  dall'1/6/2025, 53,00 dall'1/6/2026, 59,00 dall'1/6/2027, 61,00 dall'1/6/2028.
  Nel 2026 l'imposta sostitutiva colpisce «*27 euro da gennaio a maggio 2026,
  27 euro più 53 euro da giugno a dicembre 2026*» — cioè 27 × 5 + 80 × 7 = 695 EUR
  di imponibile agevolato nell'anno. [l'aritmetica è nostra; le rate sono della
  circolare]
- La **decorrenza economica anteriore** non pregiudica nulla: gli incrementi
  «*erogati dal 1° gennaio 2026 al 31 dicembre 2026, anche se relativi ad
  annualità precedenti*» (per esempio con decorrenza 2023) restano agevolati —
  Circ. 3/E/2026, § 1.2, p. 6; ripreso nel comunicato stampa AdE del 24/06/2026,
  <https://www.agenziaentrate.gov.it/portale/documents/20143/10065730/034_Com.+st.+Circolare+tassazione+agevolata+Irpef_24.06.2026/4768793a-99b9-f61f-dc99-bfe5547de9c4?t=1782310338722>, anno 2026.

### 3.2 Cosa rientra

Criterio generale (Circ. 2/E/2026, § 1, p. 5): l'agevolazione si applica «*ai
soli incrementi retributivi, previsti dai rinnovi contrattuali interessati, che
confluiscono nella **retribuzione diretta**, vale a dire le dodici mensilità della
retribuzione, la tredicesima e la quattordicesima mensilità*»; e agli «*istituti
retributivi indiretti interessati dai medesimi incrementi retributivi quali le
assenze, **per la sola parte integrata dal datore di lavoro**, che danno diritto
alla conservazione del posto di lavoro (malattia, maternità/paternità,
infortunio)*».

Casi risolti in senso **inclusivo** dalla Circ. 3/E/2026:

| Voce | Esito | Riferimento |
|---|---|---|
| Incrementi di indennità mensili legate alla mansione (es. indennità di cassa) | inclusi — «*corrisposte mensilmente e confluiscono nella retribuzione ordinaria*» | § 1.1, p. 5 |
| Superminimo **assorbito** dall'aumento contrattuale | incluso, **anche** se il superminimo nasce da accordo individuale e non dal CCNL | Circ. 2/E § 1, p. 6; Circ. 3/E § 1.3, p. 6 |
| Retribuzione dei giorni di **ferie** | inclusa — durante le ferie si percepisce la retribuzione ordinaria | § 1.4, p. 7 |
| **Festività soppresse** e permessi contrattuali (ROL, PAR) | inclusi | § 1.4, p. 7 |
| **Gratifica feriale** prevista dal CCNL | inclusa — «*mensilità aggiuntiva assimilabile alla quattordicesima*» | § 1.4, p. 7 |
| Trattamento aggiuntivo per la festività soppressa del **4 novembre** | incluso — rientra nella retribuzione ordinaria | § 1.4, p. 7 |

### 3.3 Cosa resta escluso

- **Scatti di anzianità** e «*somme corrisposte per prestazioni aggiuntive
  all'ordinaria attività*»: ore oltre il normale orario con maggiorazione,
  indennità e maggiorazioni per lavoro notturno o festivo, indennità di turno
  (Circ. 2/E/2026, § 1, p. 5). Quelle voci hanno un regime proprio — l'imposta
  sostitutiva al **15%** entro 1.500 EUR dei commi 10-11, con soglia soggettiva a
  40.000 EUR: da non confondere con il 5%.
- **Una tantum** disposti dal rinnovo «*al fine di dare integrale copertura al
  periodo di carenza contrattuale*», per il loro «*carattere straordinario*»
  (Circ. 2/E/2026, § 1, p. 6; ribadito in Circ. 3/E/2026, § 1.2, p. 6: «*Restano,
  in ogni caso, esclusi gli importi erogati "una tantum"*»).
- **TFR**, «*elemento della retribuzione il cui pagamento è differito*»
  (Circ. 2/E/2026, § 1, p. 6).
- Rapporti **senza CCNL applicato**: «*qualora al rapporto di lavoro non sia
  stato applicato un CCNL, le suddette imposte sostitutive non possano trovare
  applicazione*» (Circ. 3/E/2026, § 3.1, p. 12).
- **Settore pubblico**: il comma 7 riserva la misura ai «*lavoratori del settore
  privato*»; per la nozione la Circ. 2/E/2026 rinvia in nota 2 alla circ. 28/E/2016,
  § 1.1.1 (non letta in questa ricerca — vedi Lacune).

Caso speciale, **impatriati e docenti/ricercatori rientrati**: la Circ. 3/E/2026,
§ 3.2, pp. 13-14, corregge la lettura della 2/E e chiarisce che gli incrementi
«*devono essere assoggettate alla predetta imposta sostitutiva per l'intero
ammontare, senza, dunque, tener conto delle riduzioni previste dalle relative
norme agevolative*»; solo in caso di rinuncia l'incremento concorre al reddito
complessivo «*nella misura ridotta prevista dalla norma*».

### 3.4 Nessun tetto d'importo, ma un'opzione di uscita

**Non esiste un limite di importo agevolabile**: il comma 7 non ne prevede
alcuno, a differenza del comma 10 (1.500 EUR) e del regime dei premi di risultato
(3.000/4.000/5.000 EUR). L'intero incremento corrisposto nel 2026 sconta il 5%.
[lettura del testo]

**L'agevolazione è automatica ma rinunciabile.** «*Per fruire della tassazione
con imposta sostitutiva, il lavoratore dipendente non deve presentare una
specifica istanza, mentre è riconosciuta al medesimo la possibilità di avvalersi
della tassazione ordinaria, attraverso un'espressa rinuncia scritta
dell'imposizione sostitutiva*» (Circ. 2/E/2026, § 1, p. 7). Due correttivi
dichiarativi (ivi, p. 8): il dipendente deve far concorrere al reddito
complessivo le somme assoggettate a sostitutiva «*pur in assenza dei presupposti
richiesti dalla legge*», e può usare la dichiarazione per tornare all'ordinaria
«*nel caso in cui la ritenga più conveniente*». Chi è privo di sostituto d'imposta
(es. lavoratore domestico) fruisce della misura in dichiarazione.

L'imposta è versata dal sostituto con i codici tributo 1075, 1609, 1926, 1927,
1310 (Ris. AdE n. 3/E del 29/01/2026,
<https://www.agenziaentrate.gov.it/portale/documents/20143/9674111/RIS_n_3_del_29_01_2026.pdf/74f351f9-f1a4-1386-2d1c-9f973885616f>, anno 2026);
per accertamento, riscossione, sanzioni e contenzioso vale il **comma 12** della
stessa legge (Circ. 2/E/2026, § 1, pp. 8-9).

---

## 4. Coordinamento con la detassazione dei premi di risultato (domanda 4)

**Risposta netta: i due regimi sono indipendenti e cumulabili nello stesso anno.
I tetti non si sommano e non si erodono a vicenda, perché la misura sugli
incrementi non ha tetto.**

### 4.1 Le due discipline, affiancate

| | Incrementi da rinnovo | Premi di risultato / partecipazione agli utili |
|---|---|---|
| Norma | art. 1, c. 7, L. 199/2025 | art. 1, cc. 182 e ss., L. 208/2015 |
| Aliquota 2026 | 5% | **1%** (art. 1, c. 9, L. 199/2025) |
| Aliquota 2025 | — (misura inesistente) | 5% (art. 1, c. 385, L. 207/2024, ristretto al solo 2025 dal c. 8 della L. 199/2025) |
| Aliquota a regime | — | 10% (c. 182, L. 208/2015) |
| Tetto | **nessuno** | 5.000 EUR per il 2026 e il 2027 (c. 9); a regime 3.000, elevabile a 4.000 con coinvolgimento paritetico dei lavoratori in base a contratti stipulati fino al 24/04/2017 e ancora vigenti (istruzioni 730/2026, rigo C4) |
| Soglia soggettiva | reddito di lavoro dipendente 2025 ≤ 33.000 EUR | reddito di lavoro dipendente dell'anno precedente ≤ 80.000 EUR (c. 186) |
| Fonte dell'incremento | rinnovo di **CCNL nazionale** | contrattazione **aziendale o territoriale** di secondo livello, depositata |
| Rinunciabile | sì, per iscritto | sì, per iscritto |

Testo del **comma 9**, L. 199/2025, letto su Normattiva (URL al § 1) e riportato
identico in nota 18 della Circ. 2/E/2026:

> «Ai premi di produttività e alle somme erogate a titolo di partecipazione agli
> utili di cui all'articolo 1, comma 182, della legge 28 dicembre 2015, n. 208,
> erogati negli anni 2026 e 2027, l'imposta sostitutiva ivi prevista è
> applicabile, entro il limite di importo complessivo di 5.000 euro, con
> l'aliquota ridotta all'1 per cento.»

Testo del **comma 8** (stessa fonte), che spiega perché il 5% dei premi non è più
del 2026: «*All'articolo 1, comma 385, della legge 30 dicembre 2024, n. 207, le
parole: «negli anni 2025, 2026 e 2027,» sono sostituite dalle seguenti:
«nell'anno 2025».*» Il 5% dei premi di risultato è dunque **il regime del 2025**
(confermato dalle istruzioni 730/2026, rigo C4, p. 41: «*calcolerà sugli stessi
l'imposta sostitutiva del 5 per cento*», URL al § 2), sostituito dall'1% per il
2026-2027. Notare la coincidenza aritmetica insidiosa: **5% è l'aliquota degli
incrementi nel 2026 ed era l'aliquota dei premi nel 2025** — un'altra sorgente di
confusione fra le due misure.

### 4.2 L'unica regola di non-concorrenza scritta nella legge riguarda un terzo regime

Il **comma 11** dispone: «*Ai fini del limite annuo di cui al comma 10 non
concorrono i premi di risultato e le somme erogate a titolo di partecipazione
agli utili assoggettati alle disposizioni dell'articolo 1, commi 182 e seguenti,
della legge 28 dicembre 2015, n. 208*» (testo in nota 11 della Circ. 2/E/2026 e
nota 2 della Circ. 3/E/2026; commentato in Circ. 2/E/2026, § 2, p. 13).

Quel limite annuo è quello di **1.500 EUR della sostitutiva al 15%** su
maggiorazioni notturne/festive/turni — non ha nulla a che vedere con il comma 7.
È l'unico coordinamento esplicito presente nella L. 199/2025, e va nella
direzione di **tenere separati** i plafond, non di sommarli.

### 4.3 Conclusione

- **Nessuna disposizione** della L. 199/2025 né della L. 208/2015 subordina il
  comma 7 al regime dei premi di risultato o viceversa. [lettura del testo di
  entrambe le norme]
- **Nessuna delle due circolari** affronta un'ipotesi di incompatibilità o di
  erosione reciproca dei plafond: la Circ. 2/E/2026 tratta i commi 7 e 10-12 in
  due capitoli distinti e richiama la L. 208/2015 in due soli punti (nota 18 e
  § 2, p. 13), sempre in relazione al limite dei 1.500 EUR.
- Un lavoratore con reddito di lavoro dipendente 2025 ≤ 33.000 EUR soddisfa
  **anche** la soglia degli 80.000 EUR dei premi di risultato: nel dominio della
  misura del comma 7 le due platee sono **annidate**, e la cumulabilità è la
  regola, non l'eccezione. [derivazione]
- **Sì, si possono avere entrambe nello stesso anno**: 5% senza tetto sugli
  incrementi da rinnovo *e* 1% entro 5.000 EUR sul premio di risultato aziendale.
  Con un terzo regime possibile in aggiunta (15% entro 1.500 EUR su
  notturno/festivo/turni, se il reddito 2025 non supera 40.000 EUR).
- Effetto combinato da non trascurare: **ogni somma assoggettata a sostitutiva
  esce dal reddito complessivo** (art. 3, c. 3, lett. a), TUIR), quindi tre
  regimi cumulati abbassano il reddito complessivo tre volte, con conseguenze a
  valle su detrazioni, erogazioni e soglie di esenzione delle addizionali
  (§ 7).

---

## 5. La norma primaria (domanda 5)

**Art. 1, comma 7, della legge 30 dicembre 2025, n. 199** («Bilancio di
previsione dello Stato per l'anno finanziario 2026 e bilancio pluriennale per il
triennio 2026-2028»), pubblicata in **Gazzetta Ufficiale Serie Generale n. 301
del 30 dicembre 2025, Supplemento Ordinario n. 42**, in vigore dal 1° gennaio 2026
(<https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/sg>, anno 2025).

Norme collegate della stessa legge, tutte all'art. 1:

| Comma | Contenuto |
|---|---|
| **7** | imposta sostitutiva 5% sugli incrementi da rinnovo; soglia 33.000 EUR |
| 8 | restringe al solo 2025 l'aliquota ridotta dei premi di risultato dell'art. 1, c. 385, L. 207/2024 |
| 9 | premi di risultato e utili 2026-2027: aliquota **1%** entro **5.000 EUR** |
| 10 | imposta sostitutiva **15%** su maggiorazioni/indennità notturno, festivo, riposo settimanale, turni, entro **1.500 EUR** |
| 11 | applicazione del c. 10: sostituti privati, soglia **40.000 EUR** sul reddito 2025, esclusioni, non concorrenza dei premi al limite dei 1.500 |
| 12 | accertamento, riscossione, sanzioni e contenzioso: si applicano le disposizioni in materia di imposte sui redditi |
| 18 | trattamento integrativo speciale per somministrazione alimenti/bevande e turismo (1/1–30/9/2026), che **esclude** quei lavoratori dal c. 10 |

**Nota di verifica sul numero di comma** (la issue segnalava un precedente numero
sbagliato letto su Normattiva). Il «comma 7» è confermato da **quattro** documenti
indipendenti: il testo Normattiva (§ 1); la Circ. 2/E/2026 (rubrica del § 1 e
nota 1); la Circ. 3/E/2026 (indice: «*Incrementi retributivi dei rinnovi
contrattuali - Articolo 1, comma 7, della legge di bilancio 2026*»); e la
Ris. 3/E del 29/01/2026, che incorpora «*articolo 1, comma 7, legge 30 dicembre
2025, n. 199*» **nella denominazione ufficiale dei codici tributo** — la citazione
più difficile da sbagliare, perché finisce nel modello F24.

Le circolari sono **guida, non fonte**: la Circ. 2/E/2026 lo dice di sé
(«*istruzioni operative agli Uffici, per garantirne l'uniformità di azione*»,
Premessa, p. 3). Nel file, dove una regola sta solo nella circolare e non nel
testo di legge — perimetro della retribuzione diretta, ferie, superminimo,
una tantum — la fonte è citata come tale.

---

## 6. Scadenza: misura per il solo 2026 (domanda 6)

**Risposta netta: sì, la misura ha una scadenza secca. Vale per gli incrementi
corrisposti nell'anno 2026 e basta.** Non è a regime, non ha proroghe.

Il comma 7 chiude due volte il perimetro temporale: incrementi «*corrisposti ai
lavoratori dipendenti **nell'anno 2026***» e rinnovi sottoscritti «*dal 1° gennaio
2024 al 31 dicembre 2026*». Il primo vincolo esaurisce la misura al 31/12/2026
(più la coda della cassa allargata al 12/01/2027). Al **12/08/2026** non risulta
alcun provvedimento che la proroghi: ricerca ristretta ai domini
`agenziaentrate.gov.it`, `normattiva.it`, `gazzettaufficiale.it`, `inps.it`,
`lavoro.gov.it`, e censimento delle circolari AdE 2026 già svolto in
`docs/ricerca/rivalidazioni-fonti.md`, § 3 (nessuna circolare successiva alla
3/E sul tema).

Da notare il **disallineamento delle scadenze** fra le misure contigue: il c. 7
copre il solo 2026; il c. 9 (premi all'1% entro 5.000) copre **2026 e 2027**; i
cc. 10-11 (15% entro 1.500) coprono il solo 2026. Un set di costanti 2027 non
potrebbe riusare né il 5% né il 15%, ma dovrebbe conservare l'1% dei premi.

### Voce proposta per `docs/ricerca/rivalidazioni-fonti.md`

*(Proposta: questo file non modifica `rivalidazioni-fonti.md`.)*

> **4. Sorte dell'imposta sostitutiva sugli incrementi retributivi da rinnovi
> contrattuali dopo il 2026** (art. 1, c. 7, L. 199/2025). La misura è scritta
> per i soli incrementi corrisposti nell'anno 2026. **Momento utile di verifica:
> gennaio 2027**, alla pubblicazione della legge di bilancio 2027 in Gazzetta
> Ufficiale — verificare (a) se il c. 7 è prorogato al 2027 e con quali aliquota
> e soglia, (b) se cambia la finestra di sottoscrizione dei rinnovi, (c) se resta
> l'1% entro 5.000 EUR sui premi di risultato, che il c. 9 della L. 199/2025 ha
> già scritto **anche per il 2027** e che quindi va confermato, non ricostruito.
> Un set di costanti 2027 che ereditasse il 5% del 2026 sarebbe sbagliato per
> difetto di verifica.

---

## 7. La misura tocca la cascata RAL → netto del prototipo? (esito richiesto)

**Sì, la tocca — e non ai margini: la spezza in due tratti con basi imponibili
diverse. Ma richiede input che il brief non dà, quindi l'esito corretto è una
riga in `docs/ASSUNZIONI.md`, non una modifica del motore.**

### 7.1 Dove morde

Oggi la cascata poggia su due identità: `imponibileFiscale = ral − contributi` e
`redditoComplessivo = imponibileFiscale` (registrate in `docs/ASSUNZIONI.md`).
Se una quota della RAL 2026 è incremento da rinnovo agevolabile, **la seconda
identità salta**: quella quota non concorre al reddito complessivo (art. 3,
c. 3, lett. a), TUIR, richiamato espressamente dalla Circ. 2/E/2026, § 1, p. 6-7)
e paga il 5% invece di IRPEF e addizionali.

Effetti a catena, tutti già modellati nel prototipo e tutti sensibili al reddito
complessivo:

| Voce | Effetto della sostitutiva |
|---|---|
| IRPEF lorda | base minore ⇒ possibile scivolamento in uno scaglione inferiore |
| Detrazione art. 13 TUIR | cambia fascia e importo (reddito complessivo minore) |
| Ulteriore detrazione (L. 207/2024, c. 6) | può accendersi o spegnersi sulle soglie 20.000/32.000/40.000 |
| Trattamento integrativo | soglia 15.000 valutata sul reddito complessivo **ridotto** ⇒ può accendersi; **ma la capienza no**, vedi § 7.2 |
| Somma integrativa (L. 207/2024, c. 4) | la percentuale si sceglie sul reddito di lavoro dipendente: da chiarire se al lordo o al netto della quota a sostitutiva (non trattato dalle circolari) |
| Addizionale regionale e comunale | la sostitutiva **le assorbe** sulla quota agevolata; sul resto la soglia di esenzione comunale (23.000 a Milano) si valuta su un imponibile minore |
| Contributi previdenziali | **nessun effetto**: il c. 7 sostituisce IRPEF e addizionali, non i contributi (§ 7.3) |

### 7.2 Il correttivo esplicito sul trattamento integrativo

La Circ. 2/E/2026 (§ 1, pp. 6-7) fissa un'eccezione che un'implementazione
ingenua sbaglierebbe: ai fini del trattamento integrativo «*il reddito di lavoro
dipendente che è assoggettato a imposta sostitutiva ai sensi del comma 7 …
**va computato nel reddito complessivo da lavoro dipendente**, per verificare se
l'imposta lorda determinata in relazione a quest'ultimo è superiore alla relativa
detrazione da lavoro dipendente*». Motivazione data dalla circolare: altrimenti
«*si realizzerebbe una penalizzazione per il lavoratore dipendente, in contrasto
con … la finalità della disposizione*».

Cioè: la **soglia** del trattamento integrativo lavora sul reddito complessivo
ridotto, ma la **verifica di capienza** (imposta lorda > detrazione) torna a
computare la quota a sostitutiva. Due grandezze diverse nello stesso test —
esattamente il tipo di asimmetria che il file
`trattamento-integrativo-somma-integrativa-ulteriore-detrazione.md` già presidia.
La stessa regola è ripetuta per il regime al 15% (Circ. 2/E/2026, § 2, p. 12).

### 7.3 I contributi non cambiano — ma è una derivazione, non una citazione

Il comma 7 sostituisce «*l'imposta sul reddito delle persone fisiche e … le
addizionali regionali e comunali*»: non nomina i contributi, e l'incremento resta
retribuzione imponibile ai fini previdenziali. La clausola esplicita «*Restano
ferme le ordinarie regole contributive in materia previdenziale e assistenziale*»
compare **solo nel comma 11** (regime al 15%), non nel comma 7, e nessuna delle
due circolari affronta il punto (ricerca testuale su «contribut» nei PDF integrali
di 2/E e 3/E: due sole occorrenze, entrambe nella citazione del c. 11).
Conclusione operativa: `contributiDipendente` continua a calcolarsi su tutta la
RAL, incremento incluso. **[derivazione]** — vedi Lacune.

### 7.4 Quali input servirebbero

Per far entrare la misura nella cascata servono quattro dati che oggi il form non
chiede e il brief non dà:

1. la **quota della retribuzione 2026 costituita da incrementi da rinnovo
   agevolabili** — non deducibile dalla RAL, perché dipende dal CCNL applicato,
   dalla data di sottoscrizione del rinnovo, dal calendario delle rate e
   dall'anzianità del lavoratore (§ 3.1);
2. il **reddito di lavoro dipendente 2025** del lavoratore, per il test dei
   33.000 EUR — una grandezza dell'anno precedente, che il prototipo non modella
   (la riga «Un solo rapporto di lavoro, nessun altro reddito» di
   `docs/ASSUNZIONI.md` riguarda l'anno in corso);
3. la conferma che il rapporto è **privato e con un CCNL nazionale applicato**
   (§ 3.3);
4. l'eventuale **rinuncia scritta** del lavoratore (§ 3.4).

Applicando le tre domande di `CLAUDE.md`: (1) togliere la misura non fa uscire un
numero sbagliato per il caso che il brief chiede — RAL costante, retribuzione
ordinaria; (2) i dati normativi sono reperibili e infatti sono in questo file, ma
non bastano senza l'input della quota; (3) la misura **richiede input che il
brief non dà**. È il caso 3: assunzione legittima.

### 7.5 Riga proposta per `docs/ASSUNZIONI.md`

*(Proposta: questo file non modifica `ASSUNZIONI.md`.)*

Esiste già la riga «*Retribuzione composta di soli elementi a tassazione
ordinaria: nessun premio di risultato*». La misura del comma 7 **appartiene alla
stessa famiglia** (imposta sostitutiva che estrae una quota di retribuzione dalla
cascata) ma è **diversa nel meccanismo**: colpisce la retribuzione *ordinaria*,
non un elemento variabile, e non ha tetto. La riga esistente va quindi **estesa**,
non duplicata:

| Assunzione | Perché | Cosa cambierebbe senza |
|---|---|---|
| Nessuna quota della RAL 2026 deriva da un rinnovo contrattuale agevolato | Gli incrementi corrisposti nel 2026 in attuazione di rinnovi di CCNL sottoscritti dall'1/1/2024 al 31/12/2026 scontano un'imposta sostitutiva di IRPEF e addizionali al **5%**, senza tetto, per i lavoratori privati con reddito di lavoro dipendente 2025 ≤ 33.000 EUR (art. 1, c. 7, L. 199/2025). Individuare quella quota richiede CCNL, data del rinnovo e calendario delle rate — input che il brief non dà — e il test dei 33.000 richiede il reddito dell'anno precedente, che il prototipo non modella. | La quota agevolata uscirebbe dal reddito complessivo (art. 3, c. 3, lett. a, TUIR) pagando il 5% al posto di IRPEF e addizionali: cambierebbero scaglione, detrazione art. 13, ulteriore detrazione, soglie del trattamento integrativo e delle addizionali comunali — con la trappola che per la **capienza** del trattamento integrativo la quota va ricomputata (Circ. AdE 2/E/2026). I contributi resterebbero invariati. Si combina con la riga «La RAL è costante»: chi prende l'aumento da rinnovo matura una RAL diversa **e** la matura con un'altra tassazione. |

---

## 8. Casi di test candidati (se un giorno si implementasse)

Le fonti **non contengono esempi numerici di calcolo dell'imposta**: l'unico
esempio svolto (Circ. 2/E/2026, § 1, p. 5) individua le somme agevolabili, non
l'imposta. I casi seguenti sono derivati dalle regole documentate sopra.

1. **Individuazione dell'imponibile agevolato dalle rate ufficiali** (§ 3.1):
   rinnovo 22/04/2025, rate 27 / 53 / 59 / 61 EUR mensili ⇒ imponibile 2026 =
   27 × 5 + (27 + 53) × 7 = **695,00 EUR**; imposta sostitutiva = **34,75 EUR**;
   IRPEF+addizionali risparmiate su quella quota (aliquota marginale 23% + 1,23%
   regionale + 0,8% comunale) ≈ 174,7 EUR. [derivazione sulle rate della circolare]
2. **Soglia secca dei 33.000** (§ 2): reddito di lavoro dipendente 2025 pari a
   33.000,00 vs 33.000,01 ⇒ agevolazione piena vs zero. Nessun décalage.
3. **Rinuncia** (§ 3.4): stesso incremento, con rinuncia scritta ⇒ tassazione
   ordinaria integrale; il test verifica che il motore non applichi mai il 5% in
   automatico quando la rinuncia è presente.
4. **Capienza del trattamento integrativo** (§ 7.2): un caso in cui l'esclusione
   della quota dal reddito complessivo farebbe scendere l'imposta lorda sotto la
   detrazione, mentre ricomputandola resta sopra ⇒ trattamento integrativo
   spettante. È il test che smaschera l'implementazione ingenua.
5. **Cumulo dei regimi** (§ 4.3): incremento da rinnovo al 5% *e* premio di
   risultato 3.000 EUR all'1% nello stesso anno ⇒ entrambi fuori dal reddito
   complessivo, nessuna erosione reciproca del plafond.

---

## Nota metodologica

I PDF dell'Agenzia non si estraggono via fetch (restituiscono «contenuto
binario»), come segnalato dalla issue. Il testo integrale della **Circolare 2/E
del 24/02/2026** (14 pagine) e della **Circolare 3/E del 24/06/2026** (14 pagine)
è stato estratto localmente dai PDF scaricati dagli URL ufficiali e **letto per
intero**: tutti i virgolettati di questo file provengono da quel testo, non da
riassunti. Stesso trattamento per la Ris. 3/E del 29/01/2026, per il comunicato
stampa AdE del 24/06/2026, per la Circ. 5/E del 29/03/2018 e per le istruzioni
730/2026. I due comunicati stampa AdE (24/02 e 24/06/2026) sono stati usati solo
come riscontro, mai come fonte di un dato.

Su **Normattiva** il testo dei commi 7, 8 e 9 dell'art. 1 della L. 199/2025 è
stato letto verbatim e coincide parola per parola con le note 1 e 18 della
Circ. 2/E/2026: doppia fonte per ogni virgolettato normativo. La paginazione
dell'art. 1 in blocchi da 100 commi ha invece impedito di raggiungere i commi 182
e 186 della L. 208/2015 e il comma 385 della L. 207/2024 (endpoint
`caricaArticolo` di Normattiva: **HTTP 500**); per la L. 208/2015 il testo
**originario** è stato letto sulla Gazzetta Ufficiale (§ 2), il vigente no.

---

## Lacune

- **Testo vigente dei commi 182 e 186 della L. 208/2015: non letto direttamente.**
  Provato: Normattiva `caricaArticolo` (HTTP 500 su tutte le varianti di
  `art.progressivo`), Normattiva `caricaDettaglioAtto` (restituisce sempre i
  commi 1-100), Gazzetta Ufficiale `caricaArticolo` con `art.progressivo=2`
  (funziona, ma espone il testo **originario** del 2015: 10%, 2.000 EUR,
  50.000 EUR). Gli importi vigenti — 3.000 EUR e 80.000 EUR — sono documentati
  dalla nota 18 della Circ. 2/E/2026 (per il c. 182) e dalla Circ. 5/E/2018 §1a
  più le istruzioni 730/2026 rigo C4 (per gli 80.000). Il **comma 160, lett. d),
  della L. 232/2016**, che ha portato 50.000 a 80.000, non è stato letto
  direttamente: la GU ha restituito solo la pagina di caricamento del portale.
  Nessuno dei due valori sta sul percorso RAL → netto del prototipo: servono a
  spiegare la contraddizione della issue, non a calcolare.
- **Comma 385 della L. 207/2024: non letto direttamente** (stessa paginazione).
  La sua esistenza e la sua portata risultano dal comma 8 della L. 199/2025
  (letto verbatim, § 4.1) e dall'aliquota del 5% esposta dalle istruzioni
  730/2026 per l'anno d'imposta 2025.
- **Trattamento contributivo degli incrementi agevolati: non confermato da
  fonte.** Né la 2/E né la 3/E lo affrontano, e il comma 7 — a differenza del
  comma 11 — non contiene la clausola «restano ferme le ordinarie regole
  contributive». Che l'imponibile contributivo resti pieno è una derivazione
  (§ 7.3). Non è stata cercata una circolare o un messaggio **INPS** sul punto:
  è la ricerca da fare per prima se la misura entrasse nel motore.
- **Base di calcolo del 5%: lordo o al netto dei contributi a carico del
  dipendente?** Nessuna delle due circolari lo dice, e il testo del comma 7 parla
  genericamente di «incrementi retributivi corrisposti». Il regime dei premi di
  risultato ha una prassi consolidata sul punto (circ. 28/E/2016) che non è stata
  verificata qui.
- **Nozione di «settore privato»**: la Circ. 2/E/2026 rinvia in nota 2 alla
  circ. 28/E/2016, § 1.1.1, non letta in questa ricerca. Irrilevante per il
  dominio del prototipo (impiegato privato), rilevante se la platea si allargasse.
- **Interazione con la somma integrativa** (L. 207/2024, c. 4): la percentuale si
  determina sul reddito di lavoro dipendente, e nessuna delle due circolari dice
  se quella grandezza vada assunta al lordo o al netto della quota assoggettata a
  sostitutiva. La 2/E interviene espressamente **solo** sul trattamento
  integrativo. Punto aperto, segnalato in tabella al § 7.1.
- **Relazione illustrativa e relazione tecnica** alla legge di bilancio 2026:
  citate dalla Circ. 2/E/2026 (§ 1, p. 4) ma non consultate direttamente; le due
  frasi che questo file ne riporta sono citazioni di secondo grado, e sono
  marcate come tali nella circolare.

---

## Fonti primarie consultate

- **L. 30 dicembre 2025, n. 199** (legge di bilancio 2026), art. 1, cc. 7, 8, 9,
  testo vigente su Normattiva — <https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2025-12-30&atto.codiceRedazionale=25G00212&atto.articolo.numero=1&atto.articolo.sottoArticolo=1&atto.articolo.sottoArticolo1=10&tabID=0.1&title=Articolo>;
  estremi di pubblicazione (GU SG n. 301 del 30/12/2025, S.O. n. 42) — <https://www.gazzettaufficiale.it/eli/id/2025/12/30/25G00212/sg>
- **Agenzia delle Entrate, Circolare n. 2/E del 24 febbraio 2026**, «Novità sulla
  tassazione degli incrementi retributivi dei rinnovi contrattuali, delle
  maggiorazioni e delle indennità per lavoro notturno, festivo, nei giorni di
  riposo settimanale o per i turni – Legge 30 dicembre 2025, n. 199» (14 pp.) —
  <https://www.agenziaentrate.gov.it/portale/documents/20143/9680913/Circolare+n.+2+del+24+febbraio+2026/a340d513-97f7-061b-108f-cbf31ceb21d9>
  (URL alternativo dello stesso file: <https://www.agenziaentrate.gov.it/portale/documents/d/guest/circolare-n-2-del-24-febbraio-2026>)
- **Agenzia delle Entrate, Circolare n. 3/E del 24 giugno 2026**, risposte a
  quesiti (14 pp.) — <https://www.agenziaentrate.gov.it/portale/documents/20143/10065075/Circolare+domande+risposte+incrementi+n.+3+del+24+giugno+2026.pdf/f4b19f05-c4cd-bea5-b930-6b600e8dfc0e>
- **Agenzia delle Entrate, Risoluzione n. 3/E del 29 gennaio 2026** (codici
  tributo 1075, 1609, 1926, 1927, 1310) — <https://www.agenziaentrate.gov.it/portale/documents/20143/9674111/RIS_n_3_del_29_01_2026.pdf/74f351f9-f1a4-1386-2d1c-9f973885616f>
- **Agenzia delle Entrate, comunicato stampa del 24 febbraio 2026** — <https://www.agenziaentrate.gov.it/portale/-/comunicato-stampa-del-24-febbraio-2026>
- **Agenzia delle Entrate, comunicato stampa del 24 giugno 2026**, «Perimetro
  allargato per la sostitutiva Irpef al 5% sugli aumenti dei dipendenti privati» —
  <https://www.agenziaentrate.gov.it/portale/documents/20143/10065730/034_Com.+st.+Circolare+tassazione+agevolata+Irpef_24.06.2026/4768793a-99b9-f61f-dc99-bfe5547de9c4?t=1782310338722>
  (pagina di riferimento: <https://www.agenziaentrate.gov.it/portale/-/cs-24-giugno-2026>)
- **L. 28 dicembre 2015, n. 208**, art. 1, cc. 182 e 186, testo originario in
  Gazzetta Ufficiale — <https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=2&art.idArticolo=1&art.versione=1&art.codiceRedazionale=15G00222&art.dataPubblicazioneGazzetta=2015-12-30&art.idGruppo=0&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=0>
- **Agenzia delle Entrate, Circolare n. 5/E del 29 marzo 2018** (premi di
  risultato: innalzamento della soglia da 50.000 a 80.000 EUR) — <https://www.agenziaentrate.gov.it/portale/documents/20143/297586/Circolare+n+5+del+29+03+2018_Circolare+_5_29032018.pdf/b2c59474-6b1c-4b5f-f3b7-8918c5c4cfe9>
- **Agenzia delle Entrate, istruzioni 730/2026** (agg. 28/05/2026), rigo C4
  «Somme per premi di risultato e welfare aziendale», pp. 40-41 — <https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734>
- **D.P.R. 22 dicembre 1986, n. 917 (TUIR)**, art. 3, c. 3, lett. a) (i redditi a
  imposta sostitutiva non concorrono al reddito complessivo) e art. 51, c. 1,
  ultimo periodo (cassa allargata) — richiamati dalla Circ. 2/E/2026, note 4 e
  corpo del § 1; testo su Normattiva — art. 3: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art3>,
  art. 51: <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51>
