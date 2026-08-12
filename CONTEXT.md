# Retribuzione lorda → netta

Il contesto del prototipo: data una RAL, la catena di contributi e imposte che
porta al netto annuale. Questo file è il glossario del dominio — la fonte di
verità dei termini, non una specifica.

## Le grandezze

**RAL**:
La retribuzione annua lorda pattuita in contratto, mensilità aggiuntive
comprese, per un anno intero di lavoro. È un input del calcolo, non un suo
risultato.
_Avoid_: stipendio lordo, lordo annuo, `grossSalary`. Mai "stipendio mensile
× 12": le mensilità aggiuntive sono già dentro la RAL, non si sommano. E mai
"quanto ho percepito nell'anno": quella è la retribuzione effettiva del periodo,
e con un rapporto parziale i due numeri divergono.

**Retribuzione effettiva del periodo**:
La quota di RAL che matura nei giorni in cui il rapporto è in essere. Coincide
con la RAL quando il rapporto copre l'anno intero. È la prima voce della cascata
e la base di ogni voce successiva: contributi, imposte e sconti si applicano a
questa, mai alla RAL.
_Avoid_: RAL rapportata, RAL effettiva — tengono nel nome una parola, "annua",
che il concetto nega.

**Netto annuo**:
Quanto il lavoratore incassa nell'anno d'imposta dopo contributi e imposte. È
l'output del calcolo.
_Avoid_: `netSalary`, netto in busta (che è un'altra cosa, vedi Netto mensile).
Anche con un rapporto parziale resta "annuo": fuori dal periodo non c'è altro
reddito.

**Netto mensile**:
Netto annuo diviso le mensilità maturate. È una media: nessuna busta paga reale
coincide con questo numero, perché le trattenute mensili sono provvisorie fino
al conguaglio.
_Avoid_: netto in busta, stipendio mensile.

**Trattenute totali**:
La differenza fra la retribuzione effettiva del periodo e il netto annuo:
contributi previdenziali e imposte insieme, già al netto delle erogazioni. È un
aggregato di presentazione, non una voce della cascata — esiste per rispondere
alla domanda «quante tasse pago» senza costringere a una sottrazione.
_Avoid_: tasse, prelievo fiscale. Entrambi mettono i contributi sotto
l'etichetta dell'imposta. E mai la differenza dalla RAL: la retribuzione che il
rapporto non copre non è trattenuta da nessuno.

**Mensilità**:
Le rate in cui la RAL viene erogata in un anno intero — 12, 13 o 14 secondo il
CCNL. Input del calcolo; non incide sul netto annuo.
_Avoid_: tredicesima intesa come importo che si aggiunge alla RAL.

**Mensilità maturate**:
Le mensilità che il rapporto matura nel suo periodo, ed è il divisore del netto
mensile. Coincidono con le mensilità quando il rapporto copre l'anno intero.
_Avoid_: dividere per le mensilità intere un netto di periodo — dà la media su
mesi non lavorati, che non è quello che si incassa nei mesi lavorati.

## Il periodo di lavoro

**Periodo di lavoro**:
L'intervallo, dentro l'anno d'imposta, in cui il rapporto è in essere: due date
che sono un input del calcolo. Il default è l'anno intero.
_Avoid_: durata del contratto — un tempo indeterminato non ha durata, ma ha una
data di inizio.

**Giorni del rapporto**:
I giorni di calendario compresi nel periodo di lavoro, estremi inclusi: sabati,
domeniche, festivi e ferie ci stanno dentro. Sono l'unità con cui si rapportano
al periodo la detrazione per lavoro dipendente e le erogazioni.
_Avoid_: giorni lavorati, giornate — designano l'opposto (le giornate
effettivamente prestate) e sono l'errore di dominio più facile da fare qui. Le
giornate retribuite, altra unità ancora, servono solo al minimale contributivo.

**Ragguaglio al periodo**:
La riduzione di un importo in proporzione ai giorni del rapporto. Riguarda gli
**importi**, mai le soglie: queste si valutano sempre sul reddito effettivamente
percepito. È il motivo per cui la cascata di un periodo non è la cascata annua
moltiplicata per una frazione — a reddito più basso cambia la fascia, e con la
fascia cambiano le voci che spettano.
_Avoid_: proporzionale, pro-rata.

## Le due basi di calcolo

Sono due, mai una. Confonderle è l'errore di dominio più costoso del progetto.

**Base imponibile contributiva**:
L'importo su cui si calcolano i contributi previdenziali. Per un dipendente
retribuito interamente in denaro coincide con la retribuzione effettiva del
periodo, fino al massimale contributivo.
_Avoid_: imponibile, reddito.

**Imponibile fiscale**:
L'importo su cui si calcolano IRPEF e addizionali: la retribuzione effettiva del
periodo meno i contributi a carico del dipendente. È sempre minore di essa.
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

**IVS**:
Invalidità, vecchiaia e superstiti: l'assicurazione pensionistica obbligatoria
la cui quota a carico del lavoratore è la componente principale dei contributi a
carico del dipendente — per i dipendenti privati la gestisce il Fondo pensione
lavoratori dipendenti (FPLD). Distinta dall'aliquota aggiuntiva, che scatta solo
oltre la prima fascia di retribuzione pensionabile.
_Avoid_: usare la sigla senza mai scioglierla; "contributi INPS" per la sola
quota IVS — anche l'aggiuntiva va all'INPS.

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
Imposte locali sull'imponibile fiscale, dovute all'ente impositore e al comune
del domicilio fiscale. Non sono ridotte dalle detrazioni IRPEF.
_Avoid_: trattarle come un'unica "addizionale". Attenzione anche alla provincia:
non è un'entità fiscale e non deve comparire nel calcolo — vedi la voce sotto.

**Ente impositore**:
Chi delibera l'addizionale che la legge chiama "regionale". Sono **ventuno**, non
venti: le province autonome di Trento e Bolzano hanno leggi proprie e stanno al
posto della regione, mentre il Trentino-Alto Adige come ente impositore non
esiste. È la chiave del modello dati e la prima delle tre tendine. Si deriva dal
comune (sigla TN → Trento, BZ → Bolzano, ogni altra → la regione ISTAT), quindi
non introduce la provincia come input: è l'unico punto in cui il livello
provinciale tocca il calcolo, e lo tocca come identità di un ente, non come
territorio.
_Avoid_: "regione" quando il discorso include Trento e Bolzano.

**Provincia**:
Il gradino di mezzo del selettore, e **solo** quello: non delibera niente, non
entra in nessuna formula, non compare in nessuna voce del risultato. Esiste
perché la scelta del comune, senza, sarebbe un elenco da millecinquecento voci —
col filtro il più lungo è Torino, 312. Come l'ente impositore si **deriva** dal
comune (`provinciaDelComune`), non si chiede: aggiungere una tendina non ha
aggiunto un input al dominio. Nomi e sigle vengono dall'anagrafica ISTAT, dove si
chiamano "unità territoriali sovracomunali" e tengono insieme province, città
metropolitane e liberi consorzi siciliani: sono **107**.
_Avoid_: trattarla come un'entità fiscale; farne un parametro del motore.

**Domicilio fiscale**:
Il comune nella cui anagrafe il contribuente è iscritto, che determina entrambe
le addizionali per come risulta **al 1° gennaio** dell'anno d'imposta. Non è la
residenza attuale: un trasferimento produce effetti dal sessantesimo giorno, e
chi trasloca in corso d'anno paga per l'anno intero agli enti di partenza.
_Avoid_: residenza, "dove abiti" — raccolgono la risposta sbagliata da chi ha
traslocato di recente.

**Codice catastale**:
Il codice alfanumerico con cui lo Stato identifica ogni comune (F205 è Milano).
È la chiave con cui il MEF indicizza le addizionali comunali, e quindi la forma
in cui il comune del domicilio fiscale viaggia nel calcolo: il selettore mostra
un nome, il dominio riceve un codice.
_Avoid_: codice ISTAT — è un identificativo diverso, numerico; il nome del
comune come chiave — l'Italia ha comuni omonimi, il codice no.

**Soglia di esenzione**:
Il limite di imponibile sotto il quale un'addizionale non è dovuta. Superandolo
si paga sull'**intero** imponibile, non sull'eccedenza: è una soglia secca, e per
l'addizionale comunale è il salto più visibile della curva RAL → netto. Vale
anche per alcuni enti impositori, dove la deduzione pari alla soglia (Trento) è
la stessa cosa scritta in altra forma.
_Avoid_: franchigia. Una franchigia esenta la parte sotto la soglia; questa no.

**Variante di aliquota**:
Una scala di aliquote **alternativa**, che sostituisce quella ordinaria sotto una
soglia di reddito invece di esentare. La usano il Friuli-Venezia Giulia, l'Umbria
e il Lazio. Non è il primo scaglione di una scala progressiva: letta così darebbe
un numero più basso e sbagliato.

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

**Contesto di calcolo**:
La coppia **anno d'imposta + comune**: è ciò che determina l'intero insieme di
costanti da cui esce un netto. L'anno da solo non basta più da quando il luogo è
un input — due voci della cascata su quattordici dipendono dal comune, e con
loro il punto in cui la curva fa il suo salto.
