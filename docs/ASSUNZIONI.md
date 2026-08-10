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
| Calcolo annuale a consuntivo; netto mensile come media | L'IRPEF è un'imposta annuale. La trattenuta che il datore opera ogni mese è una previsione, che viene corretta a dicembre con il **conguaglio**. Esponiamo netto annuo ÷ mensilità. | Servirebbe simulare 12 buste: ragguaglio mensile delle detrazioni, tredicesima (su cui non spettano detrazioni aggiuntive, essendo rapportate ai giorni e non alle mensilità) e conguaglio di dicembre. Il **totale annuo resterebbe identico**: cambierebbe solo la distribuzione fra i mesi, e nessun mese coinciderebbe con la media che mostriamo. |
