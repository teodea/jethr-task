# RAL → netto

### → **[Apri la pagina](https://teodea.github.io/jethr-task/)**

Data una retribuzione annua lorda, questo prototipo proietta il netto annuale e mensile
ed espone **ogni singola voce** che sta in mezzo — con, accanto a ciascuna, la spiegazione
di cosa sia e la fonte normativa da cui il numero proviene.

Anno d'imposta **2026**. Impiegato privato a tempo indeterminato, tempo pieno, residente
a Milano. Il perimetro completo, e cosa resta fuori, sta in
[docs/ASSUNZIONI.md](docs/ASSUNZIONI.md).

---

## Cosa produce

Per una RAL di 30.000 € su 13 mensilità:

| Voce | Importo |
|---|---:|
| Retribuzione annua lorda (RAL) | 30.000,00 € |
| Contributi a carico del dipendente | − 2.757,01 € |
| **Imponibile fiscale** | 27.242,99 € |
| IRPEF lorda | 6.265,89 € |
| Detrazione per lavoro dipendente | − 2.044,26 € |
| Ulteriore detrazione | − 1.000,00 € |
| **IRPEF netta** | 3.221,63 € |
| Addizionale regionale (Lombardia) | − 377,94 € |
| Addizionale comunale (Milano) | − 217,94 € |
| Trattamento integrativo | 0,00 € |
| Somma integrativa | 0,00 € |
| **Netto annuo** | **23.425,48 €** |
| **Netto mensile** (media) | **1.801,96 €** |

Ogni riga porta con sé un testo in lingua comune. Ad esempio, sull'addizionale comunale:

> *Imposta del Comune sullo stesso imponibile: 0,8%, con esenzione fino a 23.000 € di imponibile.*
> ⚠️ *Attenzione: sopra 23.000 € l'aliquota si applica all'intero imponibile, non solo alla
> parte eccedente. È una soglia, non una franchigia.*

---

## Come si usa

La pagina vive su **<https://teodea.github.io/jethr-task/>**: si apre e funziona, senza
installare niente.

Per servirla in locale serve un server statico — gli ES modules non si caricano da
`file://`, il browser li blocca per la same-origin policy:

```bash
python -m http.server 8000
```

Poi <http://localhost:8000>. Va bene qualunque altro server statico (`npx serve .`,
`php -S localhost:8000`): non c'è nessun build step da eseguire prima.

La suite di test:

```bash
npm test
```

Il motore è usabile anche da solo, senza passare dalla pagina:

```js
import { calcolaCascata } from './src/cascata.js'
import { presentaCascata } from './src/presentazione.js'
import { testiCascata, avvisoScalino, ORDINE_VOCI } from './src/testi.js'

const cascata = calcolaCascata({ ral: 30000, mensilita: 13, anno: 2026 })

const voci = presentaCascata(cascata) // importi arrotondati e quadrati
const testi = testiCascata(cascata) // etichetta, spiegazione e nota di ogni voce
const avviso = avvisoScalino(cascata) // null fuori dalle zone critiche
```

---

## Il dominio in cinque minuti

### La cascata

Il netto non si ottiene con una percentuale. Si ottiene facendo passare la RAL attraverso
una **sequenza ordinata**, in cui ogni passo parte da dove è arrivato il precedente:

```
RAL
  − contributi previdenziali        → resta l'IMPONIBILE FISCALE
  × aliquote a scaglioni            → dà l'IRPEF LORDA
  − detrazioni                      → dà l'IRPEF NETTA
  − addizionali regionale e comunale
  + erogazioni (i bonus)
= NETTO
```

L'ordine non è un dettaglio di implementazione: è dominio. Le addizionali, per esempio,
si calcolano sull'imponibile fiscale ma **sono dovute solo se l'IRPEF netta è positiva** —
quindi non possono essere calcolate prima di aver applicato le detrazioni.

### Le tre leve

Tre meccanismi diversi, che intervengono in **tre punti diversi** della cascata. Confonderli
è l'errore che produce numeri plausibili e sbagliati.

| Leva | Agisce | Su cosa | Esempio nel motore |
|---|---|---|---|
| **Deduzione** | *prima* dell'imposta | abbassa il **reddito** | i contributi INPS |
| **Detrazione** | *dopo* l'imposta | abbassa l'**imposta** | detrazione per lavoro dipendente |
| **Erogazione** | *fuori* dall'imposta | aggiunge **soldi** | somma integrativa |

Perché la distinzione conta davvero: **1.000 € valgono cifre diverse** a seconda della leva.

| | Reddito 9.000 € | Reddito 25.000 € | Reddito 60.000 € |
|---|---|---|---|
| 1.000 € di deduzione | 0 € | 230 € | **430 €** |
| 1.000 € di detrazione | 0 € | 1.000 € | 1.000 € |
| 1.000 € di erogazione | **1.000 €** | 1.000 € | 1.000 € |

La deduzione premia i redditi alti. La detrazione è piatta, ma **non arriva a chi non paga
imposta**. Solo l'erogazione raggiunge tutti — ed è il motivo per cui esiste la somma
integrativa introdotta dalla legge di bilancio 2025.

---

## Le cose contro-intuitive che il prototipo mostra

Sono la ragione per cui un calcolatore serve più di una percentuale a mente.

### A volte guadagnare di più fa scendere il netto

Alcune agevolazioni si perdono **per intero** superando una soglia, invece di ridursi
gradualmente. Nel 2026 succede in tre punti, tutti censiti in
[src/discontinuita.js](src/discontinuita.js) e derivati dalle costanti, mai scritti a mano:

| Il reddito passa da | a | e il netto |
|---|---|---|
| 8.500 € | 8.501 € | **−153 €** (cala la percentuale della somma integrativa) |
| 15.000 € | 15.001 € | **−130 €** (finisce il trattamento integrativo) |
| 35.000 € | 35.001 € | **−65 €** (si perde la maggiorazione dell'art. 13) |

Quando la RAL cade in una di queste zone, il prototipo lo dice con gli estremi espliciti:

> ⚠️ *Sei appena sopra uno scalino. A 38.542,01 € di RAL il netto annuo era più alto di
> quello attuale, fino a 65,00 € in più. Non è un errore del calcolo: la legge prevede
> soglie oltre le quali un'agevolazione si perde per intero invece di ridursi. Torni sopra
> quel livello da 38.707,63 € di RAL.*

### Uno sconto più grande dell'imposta si perde

Le detrazioni valgono solo **fino a concorrenza** dell'imposta: l'eccedenza non diventa un
credito. È la cosiddetta **incapienza**, e colpisce proprio i redditi più bassi. A RAL 9.000 €:

> *Ti spettavano 1.955,00 € di sconti, ma la tua imposta è più bassa: 75,23 € non vengono
> utilizzati e non sono rimborsabili.*

### Superare una soglia di esenzione non costa "un po'"

L'addizionale comunale di Milano è esente fino a 23.000 € di imponibile. A 23.000,01 € si
paga lo 0,8% **sull'intero imponibile**, non sull'eccedenza: circa 184 € persi per un
centesimo guadagnato.

### Il netto mensile è una media

Netto annuo diviso le mensilità. **Nessuna busta paga reale coincide con quel numero**:
le trattenute mensili sono provvisorie fino al conguaglio di dicembre. Il prototipo calcola
il risultato annuale a consuntivo e non simula le dodici buste.

---

## Com'è organizzato

| Percorso | Cosa contiene |
|---|---|
| [index.html](index.html) | la pagina pubblicata: importa il motore, zero build e zero dipendenze |
| [web/](web/) | lo strato di pagina — legge gli input, chiama i seam, renderizza; nessuna decisione di dominio |
| [src/cascata.js](src/cascata.js) | il motore: ogni voce dichiara cosa toglie e su quale base |
| [src/costanti/](src/costanti/) | un file per anno d'imposta (2025, 2026); ogni valore con la sua fonte |
| [src/presentazione.js](src/presentazione.js) | arrotondamento ai centesimi e quadratura delle voci esposte |
| [src/testi.js](src/testi.js) | i testi dell'interfaccia, con i numeri interpolati dalle costanti |
| [src/discontinuita.js](src/discontinuita.js) | censimento dei salti legittimi e delle zone non monotone |
| [src/validazione.js](src/validazione.js) | input fuori dominio (errori) e implausibili (avvisi) |
| [src/formato.js](src/formato.js) | come si legge e si riscrive un importo in italiano; rifiuta le forme ambigue |
| [test/](test/) | casi ancorati alle fonti, suite di proprietà, test dei testi |
| [CONTEXT.md](CONTEXT.md) | il glossario del dominio: fonte di verità dei termini |
| [docs/ASSUNZIONI.md](docs/ASSUNZIONI.md) | cosa il prototipo non copre, e cosa cambierebbe se lo coprisse |
| [docs/ricerca/](docs/ricerca/) | la ricerca sulle fonti primarie, una per domanda, con citazioni |

---

## Da dove vengono i numeri

**Nessuna costante fiscale senza la sua fonte primaria**, come commento sulla riga:

```js
primaFasciaAnnua: 56224, // EUR - fonte: Circolare INPS n. 6 del 30/01/2026, par. 5, <url>, anno 2026
```

Solo fonti primarie: Agenzia delle Entrate, INPS, Gazzetta Ufficiale, Normattiva, e le
delibere di regione e comune per le addizionali. Mai il riassunto di terze parti — se una
fonte cita una norma, si risale alla norma.

Vale anche per i valori attesi dei test: quelli certificati da una fonte portano la
citazione, quelli calcolati dalle formule di legge sono marcati `[derivazione]`.

Anche i **testi** rispettano la regola: nessuna cifra è scritta a mano nelle stringhe,
tutte sono interpolate dalle costanti dell'anno. Con due set attivi, un "33%" hardcodato
sarebbe falso metà delle volte — e un test lo verifica confrontando gli stessi testi
sul 2025 e sul 2026.

E la fonte non resta nel codice: la mappa `FONTI`, esportata dallo stesso file delle
costanti di ogni anno, la porta **in pagina**. Apri una voce della cascata e in fondo trovi
la circolare, la delibera o l'articolo da cui quel numero proviene, come link che apre il
documento in una nuova scheda. Un test al seam dei testi fallisce se una voce resta senza
fonte, se l'URL non è utilizzabile o se punta fuori dai domini delle fonti primarie: la
promessa è verificata, non affidata alla memoria.

### Perché le costanti sono in JavaScript e non in JSON

Perché JSON non ha commenti, e la fonte deve stare **accanto al valore**: un file di fonti
separato divergerebbe al primo aggiornamento. In più il formato usa `Infinity` per lo
scaglione più alto, che in JSON non esiste. Tabelle importate da una macchina — per
esempio i comuni dal portale MEF — andrebbero invece in JSON: sono dati, non costanti curate.

---

## Anno d'imposta e scadenze di rivalidazione

Il 2026 introduce una modifica sostanziale: la **seconda aliquota IRPEF scende dal 35% al
33%** (L. 199/2025, art. 1, c. 3). Una tabella non aggiornata sbaglia fino a 440 € a persona.
Il set di costanti 2025 è mantenuto in parallelo proprio per rendere l'errore rilevabile:
gli stessi test girano sui due anni e devono divergere nei punti attesi.

Tre valori dipendono da documenti non ancora pubblicati alla data dell'ultima verifica
(11/08/2026). Lo stato di ogni ciclo di controllo è in
[docs/ricerca/rivalidazioni-fonti.md](docs/ricerca/rivalidazioni-fonti.md); il più rilevante:
l'addizionale comunale di Milano vale **per proroga** della delibera del 2020, e una nuova
delibera pubblicata entro il 20/12/2026 avrebbe effetto retroattivo al 1° gennaio 2026.
