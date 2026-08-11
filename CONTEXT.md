# Retribuzione lorda → netta

Il contesto del prototipo: data una RAL, la catena di contributi e imposte che
porta al netto annuale. Questo file è il glossario del dominio — la fonte di
verità dei termini, non una specifica.

## Le grandezze

**RAL**:
La retribuzione annua lorda pattuita in contratto, mensilità aggiuntive
comprese. Con le mensilità, è uno dei due input del calcolo.
_Avoid_: stipendio lordo, lordo annuo, `grossSalary`. Mai "stipendio mensile
× 12": le mensilità aggiuntive sono già dentro la RAL, non si sommano.

**Netto annuo**:
Quanto il lavoratore incassa in un anno dopo contributi e imposte. È l'output
del calcolo.
_Avoid_: `netSalary`, netto in busta (che è un'altra cosa, vedi Netto mensile).

**Netto mensile**:
Netto annuo diviso le mensilità. È una media: nessuna busta paga reale coincide
con questo numero, perché le trattenute mensili sono provvisorie fino al
conguaglio.
_Avoid_: netto in busta, stipendio mensile.

**Trattenute totali**:
La differenza fra la RAL e il netto annuo: contributi previdenziali e imposte
insieme, già al netto delle erogazioni. È un aggregato di presentazione, non una
voce della cascata — esiste per rispondere alla domanda «quante tasse pago»
senza costringere a una sottrazione.
_Avoid_: tasse, prelievo fiscale. Entrambi mettono i contributi sotto
l'etichetta dell'imposta.

**Mensilità**:
Le rate in cui la RAL viene erogata nell'anno — 12, 13 o 14 secondo il CCNL.
Secondo input del calcolo e divisore del netto mensile; non incide sul netto
annuo.
_Avoid_: tredicesima intesa come importo che si aggiunge alla RAL.

## Le due basi di calcolo

Sono due, mai una. Confonderle è l'errore di dominio più costoso del progetto.

**Base imponibile contributiva**:
L'importo su cui si calcolano i contributi previdenziali. Per un dipendente
retribuito interamente in denaro coincide con la RAL, fino al massimale
contributivo.
_Avoid_: imponibile, reddito.

**Imponibile fiscale**:
L'importo su cui si calcolano IRPEF e addizionali: la RAL meno i contributi a
carico del dipendente. È sempre minore della RAL.
_Avoid_: reddito, reddito imponibile, imponibile, `taxableIncome`. Una variabile
chiamata `reddito` significa che le due basi sono state fuse: è un bug, non uno
stile.

**Reddito complessivo**:
La somma di tutti i redditi del contribuente. Nel perimetro del prototipo — un
solo rapporto di lavoro — coincide con l'imponibile fiscale. Il termine esiste
perché detrazioni e agevolazioni sono parametrate su di esso, non sulla RAL.

## I prelievi

**Contributi previdenziali**:
Il prelievo destinato all'INPS che finanzia pensione e tutele del lavoratore.
Non sono un'imposta: destinatario, natura e momento del calcolo sono diversi.
_Avoid_: tasse, oneri sociali, `taxes`. Contributi e imposte non stanno mai
sotto la stessa etichetta.

**Contributi a carico del dipendente**:
La quota di contributi trattenuta dalla retribuzione. È l'unica che riduce il
netto ed è ciò che separa la base imponibile contributiva dall'imponibile
fiscale.
_Avoid_: contributi INPS — ambiguo, non dice a carico di chi.

**Contributi a carico del datore**:
La quota versata dall'azienda in aggiunta alla RAL. Non tocca né la RAL né il
netto: sta fuori dal calcolo.

**Minimale contributivo**:
La retribuzione minima su cui i contributi sono comunque dovuti. Per una RAL
annua a tempo pieno che gli sta sotto è un segnale di input implausibile, non
una voce della cascata.

**Prima fascia di retribuzione pensionabile**:
La soglia di retribuzione oltre la quale scatta un'aliquota contributiva
aggiuntiva a carico del dipendente. Primo punto in cui i contributi smettono di
essere proporzionali alla RAL.

**Massimale contributivo**:
Il tetto oltre il quale la retribuzione non genera più contributi, per chi è
iscritto a forme pensionistiche dopo il 31/12/1995. Oltre il tetto la base
imponibile contributiva smette di coincidere con la RAL.

**IRPEF**:
L'imposta progressiva sul reddito delle persone fisiche, dovuta all'Erario e
calcolata sull'imponibile fiscale.
_Avoid_: tasse, imposta sul reddito.

**Scaglione**:
Una fascia di imponibile fiscale con la propria aliquota. Ogni fascia è tassata
alla propria aliquota: superare una soglia non ritassa gli euro sottostanti.
_Avoid_: applicare un'aliquota unica all'intero imponibile.

**Aliquota marginale**:
L'aliquota che colpisce l'ultimo euro guadagnato, cioè quella dello scaglione
più alto raggiunto. È il tasso a cui vale un aumento.

**Aliquota media**:
IRPEF netta divisa per l'imponibile fiscale. Sempre inferiore alla marginale.
_Avoid_: "aliquota" senza aggettivo — le due si differenziano anche di dieci
punti e vengono scambiate di continuo.

**IRPEF lorda**:
L'imposta che risulta dall'applicazione degli scaglioni, prima delle detrazioni.

**IRPEF netta**:
L'IRPEF lorda meno le detrazioni, con pavimento a zero. Non può essere negativa:
lo Stato non versa imposta al contribuente.
_Avoid_: imposta dovuta — ambiguo fra lorda e netta.

**Addizionale regionale** e **Addizionale comunale**:
Imposte locali sull'imponibile fiscale, dovute alla regione e al comune di
residenza. Non sono ridotte dalle detrazioni IRPEF.
_Avoid_: trattarle come un'unica "addizionale". Attenzione anche alla provincia:
non è un'entità fiscale e non deve comparire nel calcolo.

## Le tre leve

Agiscono su tre punti diversi della catena e non sono intercambiabili.

**Deduzione**:
Riduce la base su cui si calcola l'imposta. Il risparmio dipende dall'aliquota
marginale: la stessa deduzione vale di più a redditi alti.

**Detrazione**:
Riduce l'imposta già calcolata. Il risparmio è pari al suo importo, ma solo fino
a capienza.

**Erogazione**:
Somma che si aggiunge direttamente al netto senza passare per l'imposta. È
l'unica voce positiva della cascata.
_Avoid_: chiamare "bonus" o "sconto" indistintamente una qualsiasi delle tre.

**Detrazione per lavoro dipendente**:
La detrazione che spetta per il solo fatto di percepire reddito di lavoro
dipendente. Decresce al crescere del reddito complessivo fino ad azzerarsi.

**Incapienza**:
La condizione in cui le detrazioni spettanti superano l'IRPEF lorda.
L'eccedenza non viene rimborsata: si perde, salvo che una norma la trasformi in
erogazione.

**Trattamento integrativo**:
L'erogazione destinata ai redditi da lavoro dipendente bassi, subordinata alla
capienza dell'IRPEF lorda rispetto alla detrazione per lavoro dipendente. Può
non spettare proprio ai redditi più bassi.
_Avoid_: bonus Renzi, bonus 100 euro.

**Somma integrativa**:
L'erogazione calcolata in percentuale del reddito da lavoro dipendente per le
fasce basse. È un'erogazione, non una detrazione: si somma al netto senza
passare per l'imposta.

**Ulteriore detrazione**:
La detrazione aggiuntiva per le fasce medie di reddito, distinta dalla
detrazione per lavoro dipendente. Come ogni detrazione è limitata dalla
capienza.

**No tax area**:
La soglia di reddito sotto la quale l'IRPEF netta è zero. Non è un parametro di
legge ma il punto in cui la detrazione pareggia l'IRPEF lorda: si deriva dagli
scaglioni e dalle detrazioni, non si fissa.
_Avoid_: una costante `NO_TAX_AREA` nel codice — sarebbe un numero senza fonte.

**Soglia secca**:
Una soglia oltre la quale un'agevolazione si perde per intero invece di ridursi
gradualmente. Rende la funzione RAL → netto non monotona: esiste un intervallo
in cui a un lordo più alto corrisponde un netto più basso.
_Avoid_: cliff.

## La cascata

**Cascata**:
La sequenza ordinata che va dalla RAL al netto annuo, in cui ogni passo dichiara
cosa toglie e su quale base. È il modello di calcolo e insieme ciò che il
prototipo mostra.

**Voce**:
Un singolo passo della cascata — un contributo, un'imposta, una detrazione,
un'erogazione. Il brief chiede che siano esposte tutte.
_Avoid_: trattenuta come sinonimo: l'erogazione è una voce e non è trattenuta.

## Il perimetro

Termini nominati proprio per poter dire che stanno fuori.

**Sostituto d'imposta**:
Il datore di lavoro, che trattiene contributi e imposte e li versa per conto del
lavoratore. È il motivo per cui il lavoratore vede solo il netto.

**Conguaglio**:
La correzione di fine anno con cui il sostituto allinea le trattenute mensili
all'imposta annuale effettiva. Il prototipo calcola il risultato annuale a
consuntivo e non lo simula.

**CU**:
La Certificazione Unica con cui il sostituto d'imposta attesta redditi,
ritenute e contributi dell'anno. Non riporta il netto: un confronto con il
prototipo è per voce, non sul totale.

**TFR**:
Retribuzione differita, accantonata ogni anno e liquidata alla cessazione con
tassazione propria. Non fa parte né della RAL né del netto.

**Costo azienda**:
Quanto il lavoratore costa complessivamente al datore: RAL più contributi a
carico del datore e altri oneri. Fuori dal perimetro, e con esso il cuneo
fiscale, che ne è la differenza rispetto al netto.

**Anno d'imposta**:
L'anno le cui regole — aliquote, scaglioni, detrazioni, soglie — si applicano al
calcolo. Qui il 2026.
