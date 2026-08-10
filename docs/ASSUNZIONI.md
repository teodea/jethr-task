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
| Impiegato a tempo indeterminato | Concesso dal brief. Fissa categoria e quindi aliquota contributiva, e rende l'anno pieno (12 mesi di competenza). | Apprendistato, dirigente e operaio hanno aliquote contributive diverse; il tempo determinato o l'assunzione infrannuale rendono il calcolo pro-rata e cambiano le detrazioni, che sono rapportate al periodo di lavoro. |
| Residenza a Milano | Concesso dal brief. Fissa addizionale regionale (Lombardia) e comunale (Milano). | Le addizionali variano per regione e per comune, con soglie di esenzione e aliquote a scaglioni diverse. Servirebbe un input comune/regione e una tabella. |
| Nessuna agevolazione | Concesso dal brief. Esclude regimi come impatriati, ricercatori, decontribuzioni. | Le agevolazioni agiscono su basi diverse (imponibile fiscale o contributi) e cambiano il netto in modo consistente, non marginale. |

## Scelte nostre

<!--
Formato di ogni riga:

| Assunzione | Perché | Cosa cambierebbe senza |

Esempio di come si compila:

| Nessun familiare a carico | Le detrazioni per coniuge e figli richiedono in input reddito del coniuge, numero ed età dei figli, e stato di famiglia. | Due o tre input in più e un blocco di detrazioni aggiuntive; il netto sale. La logica è nota (art. 12 TUIR) ma allarga la superficie del prototipo senza aggiungere niente alla catena lordo→netto, che è il punto del task. |
-->

_(vuota — si riempie durante il lavoro)_
