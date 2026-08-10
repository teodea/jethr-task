# Assunzioni e semplificazioni

Ogni riga è un pezzo di dominio che il prototipo **non** copre, o che copre in
forma approssimata. Il brief prevede che queste scelte siano discusse: questo file
è la traccia di quella discussione.

La colonna che conta è la terza. Dire *cosa* si è escluso mostra solo che lo si è
escluso; dire *cosa cambierebbe* mostra che si sa come funzionerebbe il caso vero.

Si compila **quando la scelta viene fatta**, non a fine progetto.

## Perimetro dato dal brief

Queste tre sono concesse esplicitamente dalla traccia, non sono scelte nostre.

| Assunzione | Perché | Cosa cambierebbe senza |
|---|---|---|
| Impiegato a tempo indeterminato | Concesso dal brief. Fissa la categoria e quindi l'aliquota contributiva. | Apprendistato, dirigente e operaio hanno aliquote contributive diverse. Il tempo determinato non cambia di per sé il calcolo annuale, ma si accompagna quasi sempre a un rapporto infrannuale — vedi la riga sull'anno intero. |
| Residenza a Milano | Concesso dal brief. Fissa addizionale regionale (Lombardia) e comunale (Milano). | Le addizionali variano per regione e per comune, con soglie di esenzione e aliquote a scaglioni diverse. Servirebbe un input comune/regione e una tabella. |
| Nessuna agevolazione | Concesso dal brief. Esclude regimi come impatriati, ricercatori, decontribuzioni. | Le agevolazioni agiscono su basi diverse (imponibile fiscale o contributi) e cambiano il netto in modo consistente, non marginale. |

## Scelte nostre

<!--
Formato di ogni riga:

| Assunzione | Perché | Cosa cambierebbe senza |

Esempio di come si compila:

| Nessun familiare a carico | Le detrazioni per coniuge e figli richiedono in input reddito del coniuge, numero ed età dei figli, e stato di famiglia. | Due o tre input in più e un blocco di detrazioni aggiuntive; il netto sale. La logica è nota (art. 12 TUIR) ma allarga la superficie del prototipo senza aggiungere niente alla catena lordo→netto, che è il punto del task. |
-->

| Assunzione | Perché | Cosa cambierebbe senza |
|---|---|---|
| Anno d'imposta 2026, unico | Il brief non indica l'anno. Scegliamo quello in corso: è la domanda che l'utente si pone davvero. | Servirebbe un selettore dell'anno e un set di costanti versionato: aliquote, detrazioni e soglie cambiano a ogni legge di bilancio. In ogni caso l'anno va **esposto nell'interfaccia** — un calcolatore fiscale che non dichiara l'anno non è verificabile da nessuno. (Nota operativa, non un'assunzione: per confrontare i risultati con una CU reale serve un anno chiuso, quindi il 2025 resta utile in fase di test.) |
| Rapporto in essere per l'anno intero | Il brief fissa il **tipo di contratto**, non la **data di assunzione**: si può essere a tempo indeterminato ed entrare in azienda il 1° marzo. Assumiamo 365 giorni di lavoro. | Servirebbe un input "giorni di lavoro nell'anno" che propaga su tutta la catena. Le detrazioni sono rapportate ai giorni: scendono sia l'imponibile sia la detrazione, e i due effetti non si compensano. Il netto di chi lavora metà anno **non è** metà del netto annuo. |
| Nessun costo azienda, nessun cuneo fiscale | Il brief chiede la catena RAL → netto. Il costo azienda sta dalla parte opposta della RAL e non serve a nessuna voce del netto. | Servirebbero le aliquote a carico del datore e il tasso INAIL, che dipende dalla classificazione dell'attività aziendale — un input che il brief non dà e che non si deduce dalla RAL. Il prototipo guadagnerebbe la narrazione "quanto costo / quanto prendo", che è la più efficace per un HR, ma nessuna cifra del netto cambierebbe. |
| Calcolo annuale a consuntivo; netto mensile come media | L'IRPEF è un'imposta annuale. La trattenuta che il datore opera ogni mese è una previsione, che viene corretta a dicembre con il **conguaglio**. Esponiamo netto annuo ÷ mensilità. | Servirebbe simulare 12 buste: ragguaglio mensile delle detrazioni, tredicesima (su cui non spettano detrazioni aggiuntive, essendo rapportate ai giorni e non alle mensilità) e conguaglio di dicembre. Il **totale annuo resterebbe identico** per l'IRPEF: cambierebbe solo la distribuzione fra i mesi, e nessun mese coinciderebbe con la media che mostriamo. Per le addizionali l'identità vale solo per competenza — viste per cassa, in busta si trattengono quelle sull'anno precedente (vedi la riga sulle addizionali). |
| Mensilità come input (12/13/14), default 13 | Il divisore del netto mensile dipende dal CCNL, che il brief non dà. Lo esponiamo come input invece di fissarlo; 13 è il caso più diffuso per gli impiegati. | Derivare le mensilità dal CCNL richiederebbe di modellare il contratto collettivo — un input di dominio in più per cambiare solo il divisore. Fra 12 e 14 il netto mensile varia di ~275 EUR su RAL 30.000; l'annuo non cambia mai. |
| Nessun familiare a carico, nessun onere deducibile o detraibile oltre ai contributi obbligatori | Oltre a RAL e mensilità il calcolo non prende altri input: coniuge/figli, previdenza complementare e spese detraibili richiedono input che il brief non dà. | Le detrazioni per familiari (art. 12 TUIR) e gli oneri alzerebbero il netto anche di centinaia di euro l'anno; un onere deducibile spezzerebbe l'identità reddito complessivo = imponibile fiscale, cambiando la base di detrazioni e addizionali. |
| Retribuzione interamente in denaro: nessun fringe benefit né welfare | Il glossario fonda su questo l'identità base imponibile contributiva = RAL. Benefit e welfare richiedono input (tipologia, valore) che il brief non dà. | I benefit concorrono alle basi imponibili oltre soglie di esenzione specifiche per tipologia (fringe entro la soglia annua, buoni pasto entro il limite giornaliero, auto a percentuali convenzionali): cambierebbero **entrambe** le basi e ogni voce a valle. |
| Un solo rapporto di lavoro, nessun altro reddito | Rende vera l'identità reddito complessivo = imponibile fiscale su cui poggiano detrazione per lavoro dipendente, trattamento integrativo e soglie di esenzione delle addizionali. | Con un secondo reddito (altro datore, locazioni) il reddito complessivo divergerebbe dall'imponibile fiscale del rapporto: detrazione e trattamento integrativo scenderebbero a parità di RAL, e servirebbe un input «altri redditi». |
| Addizionali imputate per competenza all'anno d'imposta | Attribuiamo al 2026 le addizionali calcolate sul reddito 2026; il sostituto le trattiene però nel 2027 (saldo in max 11 rate, più acconto comunale del 30% in 9 rate da marzo). | Per cassa il netto 2026 conterrebbe le addizionali sul reddito 2025: servirebbe il reddito dell'anno precedente in input e la simulazione delle rate. A regime, con RAL costante, i due criteri coincidono. |
| Tempo pieno | Il brief fissa categoria e durata del contratto, non l'orario. Il part-time richiederebbe in input tipo e percentuale. | A parità di RAL l'effetto principale è sulla validazione dell'input: il minimale contributivo diventa orario. Per prassi AdE i giorni di detrazione spettano per l'intera durata del rapporto anche nel part-time verticale. |
| Iscritto a forme pensionistiche dopo il 31/12/1995 | Il massimale contributivo si applica solo a questa platea (da confermare con la issue #2). È il caso ormai tipico della forza lavoro. | Per un iscritto ante-1996 i contributi non si fermerebbero al massimale: su RAL molto alte il netto scenderebbe. Servirebbe un input biografico (data di prima iscrizione) che il brief non dà. |
