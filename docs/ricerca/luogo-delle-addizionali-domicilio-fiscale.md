# Il luogo delle addizionali: domicilio fiscale al 1° gennaio dell'anno d'imposta

Anno di riferimento: anno d'imposta 2026
Data della ricerca: 2026-08-11

## La domanda (issue #19, teodea/jethr-task)

Il selettore chiederà all'utente un luogo. Quale luogo? Quattro punti:

1. Le addizionali regionale e comunale seguono la residenza attuale o il
   domicilio fiscale a una data fissa dell'anno d'imposta?
2. Se la data è fissa, è la stessa per entrambe le addizionali?
3. L'acconto comunale (30%) segue la stessa regola o una data diversa?
4. Chi trasloca in corso d'anno: l'addizionale resta interamente all'ente di
   partenza o si fraziona?

In coda, il deliverable UI: il testo esatto dell'etichetta del campo che
discende dalla norma, e l'indicazione se serva un input aggiuntivo (data del
trasferimento) o basti una riga in `docs/ASSUNZIONI.md`.

---

## 1. La regola: domicilio fiscale al 1° gennaio, non la residenza attuale

**Risposta netta: entrambe le addizionali seguono il domicilio fiscale al
1° gennaio dell'anno cui l'addizionale si riferisce.** La residenza attuale
è irrilevante; conta la fotografia al 1° gennaio dell'anno d'imposta.

### Regionale — D.Lgs. 446/1997, art. 50, c. 5

Testo vigente letto su Normattiva:

> «L'addizionale regionale è versata, in unica soluzione e con le modalità e
> nei termini previsti per il versamento delle ritenute e del saldo
> dell'imposta sul reddito delle persone fisiche, alla regione in cui il
> contribuente ha il domicilio fiscale alla data del **1° gennaio dell'anno cui
> si riferisce l'addizionale stessa**.»

- Fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1997-12-15;446~art50!vig=>
- Conferma MEF, «Disciplina del tributo» (addizionale regionale), che riprende
  la stessa formula («domicilio fiscale alla data del 1° gennaio dell'anno cui
  si riferisce l'addizionale stessa»):
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/>

**Attenzione alla traccia della issue**: la data è nel **comma 5** (versamento),
non nel comma sul calcolo — e nel testo vigente è il **1° gennaio**, non il
31 dicembre. Il 31 dicembre è il testo *storico*: vedi §2.

### Comunale — D.Lgs. 360/1998, art. 1, c. 4

Testo vigente letto su Normattiva:

> «L'addizionale è dovuta alla provincia e al comune nel quale il contribuente
> ha il domicilio fiscale alla data del **1° gennaio dell'anno cui si riferisce
> l'addizionale stessa**, per le parti spettanti.»

- Fonte: Normattiva, testo vigente:
  <https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-09-28;360~art1!vig=>
  (Il riferimento alla provincia è lettera morta: l'aliquota è deliberata dal
  solo comune, art. 1 c. 3, e la provincia non è un'entità fiscale — coerente
  col glossario in `CONTEXT.md`.)
- Conferma MEF, «Disciplina del tributo» (addizionale comunale): l'addizionale
  è dovuta al comune nel quale il contribuente ha il domicilio fiscale alla
  data del 1° gennaio (formulazione della pagina come restituita dal fetch:
  «dell'anno cui si riferisce il pagamento» — vedi Lacune):
  <https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-comunale-allIRPEF/disciplina-del-tributo/>

### Cosa è il domicilio fiscale — d.P.R. 600/1973, art. 58

Testo vigente letto su Normattiva
(<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1973-09-29;600~art58!vig=>):

> «Le persone fisiche residenti nel territorio dello Stato hanno il domicilio
> fiscale **nel comune nella cui anagrafe sono iscritte**.» (art. 58, c. 2,
> primo periodo)

> «Le cause di variazione del domicilio fiscale hanno effetto **dal
> sessantesimo giorno successivo** a quello in cui si sono verificate.»
> (art. 58, ultimo comma)

Quindi: per chi risiede in Italia il domicilio fiscale è il comune di
**residenza anagrafica**, ma un cambio di residenza *diventa* domicilio fiscale
solo 60 giorni dopo. «Domicilio fiscale» e «residenza attuale» divergono in due
casi: chi ha traslocato da meno di 60 giorni, e chi ha traslocato dopo la data
utile per il 1° gennaio (vedi §4).

Caso di scuola a parte: l'amministrazione finanziaria può stabilire d'ufficio
(o consentire su istanza) un domicilio fiscale diverso dal comune anagrafico —
d.P.R. 600/1973, art. 59, testo vigente:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1973-09-29;600~art59!vig=>.
Riguarda provvedimenti individuali e motivati: fuori dal perimetro di un
prototipo, ma è il motivo per cui l'etichetta corretta è «domicilio fiscale» e
non «residenza».

---

## 2. Stessa data per entrambe? Sì — e lo è solo dal 2014

**Risposta netta: sì, 1° gennaio per entrambe.** Ma non è sempre stato così, e
la storia spiega le fonti secondarie discordanti che si incontrano.

L'allineamento è opera del **D.Lgs. 21 novembre 2014, n. 175, art. 8**
(«Semplificazioni in materia di addizionali comunali e regionali all'Irpef»),
in vigore dal 13-12-2014 — testo vigente letto su Normattiva:
<https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2014-11-21;175~art8!vig=>:

> «b) al comma 5 le parole: "31 dicembre dell'anno cui si riferisce
> l'addizionale stessa ovvero relativamente ai redditi di lavoro dipendente e a
> quelli assimilati a questi alla regione in cui il sostituito ha il domicilio
> fiscale all'atto della effettuazione delle operazioni di conguaglio relative
> a detti redditi" sono sostituite dalle seguenti: "1° gennaio dell'anno cui si
> riferisce l'addizionale stessa".» (art. 8, c. 1, lett. b)

Prima del 2014, quindi, la **regionale** guardava al 31 dicembre (e, per i
dipendenti, al domicilio *al momento del conguaglio*): ogni fonte che ancora
oggi dice «31 dicembre» sta citando il testo abrogato. La **comunale** era già
al 1° gennaio.

**Conseguenza di prodotto**: un solo campo alimenta entrambe le addizionali.
L'utente indica il comune; la regione si deriva dal comune. Nessun secondo
campo, nessuna seconda data.

---

## 3. L'acconto comunale (30%): stesso luogo, parametri dell'anno precedente

**Risposta netta: nessuna data diversa per il *luogo*.** La norma fissa un solo
criterio di spettanza — il c. 4 letto in §1 vale per l'addizionale intera,
acconto compreso. L'«anno precedente» entra solo nella *misura* dell'acconto,
non nella scelta dell'ente.

Testo vigente dell'art. 1, c. 4, ultimi periodi (Normattiva, URL in §1):

> «Il versamento dell'addizionale medesima è effettuato in acconto e a saldo
> unitamente al saldo dell'imposta sul reddito delle persone fisiche. L'acconto
> è stabilito nella misura del 30 per cento dell'addizionale ottenuta
> applicando le aliquote di cui ai commi 2 e 3 al reddito imponibile dell'anno
> precedente determinato ai sensi del primo periodo del presente comma. Ai fini
> della determinazione dell'acconto, l'aliquota di cui al comma 3 e la soglia
> di esenzione di cui al comma 3-bis sono assunte nella misura vigente
> nell'anno precedente, ((...)).»

Il «((...))» non è un taglio nostro: è la soppressione operata dal
**D.Lgs. 175/2014, art. 8, c. 2** (Normattiva, URL in §2):

> «2. All'articolo 1, comma 4, ultimo periodo, del decreto legislativo
> 28 settembre 1998, n. 360, le parole: "salvo che la pubblicazione della
> delibera sia effettuata entro il 20 dicembre precedente l'anno di
> riferimento" sono soppresse.»

Quindi, dal 2014, **l'acconto usa sempre aliquota e soglia dell'anno
precedente**, senza più l'eccezione della delibera pubblicata entro il
20 dicembre. Riepilogo per l'acconto dell'anno d'imposta N:

| Dimensione | Regola | Fonte |
|---|---|---|
| **Comune** | domicilio fiscale al 1° gennaio dell'anno N (stesso del saldo) | art. 1, c. 4, D.Lgs. 360/1998 (§1) |
| Aliquota e soglia | misura vigente nell'anno N−1 | art. 1, c. 4, ultimo periodo (sopra) |
| Base | reddito imponibile dell'anno N−1 | art. 1, c. 4 (sopra) |
| Trattenuta in busta | max 9 rate mensili da marzo (acconto); saldo a conguaglio in max 11 rate | art. 1, c. 5, D.Lgs. 360/1998 (Normattiva, URL in §1) |

**Rilevanza per il prototipo: nulla sul quantum.** Il prototipo proietta per
competenza annua (riga già in `docs/ASSUNZIONI.md`, «Addizionali imputate per
competenza»): acconto e saldo sono meccanica di cassa. Il punto che questa
issue doveva chiudere è che l'acconto **non introduce un secondo luogo né una
seconda data** da chiedere all'utente.

---

## 4. Chi trasloca in corso d'anno: nessun frazionamento

**Risposta netta: l'addizionale dell'anno resta interamente all'ente del
domicilio fiscale al 1° gennaio.** Non esiste alcuna norma di riparto pro-rata:
il criterio del c. 4 (comunale) e del c. 5 (regionale) assegna l'anno intero a
un solo ente, e chi si trasferisce — anche a gennaio — paga a regione e comune
di partenza per tutto l'anno d'imposta. Il nuovo ente inizia a percepire
dall'anno successivo.

Il momento esatto dello scatto lo decide la regola dei 60 giorni (art. 58,
ultimo comma, d.P.R. 600/1973 — §1): il trasferimento anagrafico avvenuto il
giorno X diventa domicilio fiscale al giorno X+60. Per pesare sul 1° gennaio
dell'anno N, il trasferimento deve avvenire **entro il 2 novembre dell'anno
N−1** (2 novembre + 60 giorni = 1° gennaio).

La prassi dell'Agenzia delle Entrate applica esattamente questa aritmetica —
istruzioni per la compilazione del modello 730/2026 (agg. 28-05-2026), sezione
«Domicilio fiscale al 1° gennaio 2026», p. 18:
<https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_2026_istruzioni_+agg+28+05+2026.pdf/0965387c-8738-287a-9378-1d038b997833?t=1779979758734>:

> «Se la residenza è variata, gli effetti della variazione decorrono dal
> sessantesimo giorno successivo a quello in cui essa si è verificata [...] Se
> la variazione è avvenuta a partire dal **3 novembre 2025** indicare il
> precedente domicilio; se invece la variazione è avvenuta entro il
> **2 novembre 2025** indicare il nuovo domicilio.»

Si noti che nemmeno il 730 chiede la *data* del trasferimento: chiede il
comune, e delega al contribuente l'applicazione della regola del 2 novembre
scritta nelle istruzioni. Tavola dei casi per l'anno d'imposta 2026:

| Trasferimento anagrafico | Domicilio fiscale al 1/1/2026 | Addizionali 2026 dovute a |
|---|---|---|
| entro il 2-11-2025 | comune nuovo | enti del comune **nuovo**, anno intero |
| dal 3-11-2025 in poi | comune vecchio | enti del comune **vecchio**, anno intero |
| in qualsiasi momento del 2026 | comune vecchio (fissato all'1/1) | enti del comune **vecchio**, anno intero |

---

## 5. Deliverable UI: etichetta, aiuto, e nessun input in più

### Il campo (per quando il selettore esisterà)

L'etichetta «Dove abiti» raccoglierebbe la risposta sbagliata da chiunque abbia
traslocato tra il 3 novembre 2025 e oggi: la norma vuole la fotografia al
1° gennaio, non il presente. Testo proposto, coerente col tono della pagina
(italiano, seconda persona, l'anno dichiarato):

- **Etichetta**: `Comune di domicilio fiscale al 1° gennaio 2026`
- **Testo di aiuto** (una riga sotto il campo):
  `Di norma è il comune dove risultavi all'anagrafe il 1° gennaio. Se hai
  cambiato residenza dopo il 2 novembre 2025, vale ancora il comune precedente.`

La prima frase copre la totalità degli utenti (domicilio fiscale = residenza
anagrafica, art. 58 c. 2); la seconda copre l'unico caso in cui la fotografia
al 1° gennaio inganna (regola dei 60 giorni, art. 58 ultimo comma, nella forma
operativa delle istruzioni 730 — §4). L'anno nell'etichetta si legge da
`ANNO_CORRENTE`, come già fa il resto della pagina.

### Serve un input in più (data del trasferimento)? No

La data del trasferimento **non serve come input**: non entra in nessuna
formula — decide solo *quale* comune indicare, e la seconda riga dell'aiuto fa
questo lavoro con una frase. Chiedere la data e calcolare noi i 60 giorni
replicherebbe la logica del frontespizio 730 per spostare l'errore
dall'etichetta a un secondo campo; il 730 stesso non lo fa (chiede il comune,
non la data — §4). È lo stesso criterio della riga sul formato della RAL in
`docs/ASSUNZIONI.md`: un input in più per un problema che si risolve con una
frase.

### La riga di assunzione (da aggiungere a `docs/ASSUNZIONI.md`, non scritta qui)

Finché il luogo è fisso (Milano, dal brief), basta una riga che dichiari la
lettura corretta del vincolo. Testo proposto:

> | Il luogo del calcolo è il **domicilio fiscale al 1° gennaio 2026**, assunto
> a Milano | Le addizionali seguono il domicilio fiscale al 1° gennaio
> dell'anno d'imposta (art. 50 c. 5 D.Lgs. 446/1997; art. 1 c. 4
> D.Lgs. 360/1998), non la residenza attuale; il brief dà «residenza a Milano»
> e la leggiamo come domicilio fiscale all'1/1/2026. | Per chi ha spostato la
> residenza dopo il 2-11-2025 le due nozioni divergono (effetto dal 60° giorno,
> art. 58 d.P.R. 600/1973): con un futuro selettore etichettato «Dove abiti» il
> traslocato otterrebbe un netto sbagliato a interfaccia perfetta; l'etichetta
> «domicilio fiscale al 1° gennaio» rende l'errore un errore di input, non di
> calcolo. Nessun frazionamento in corso d'anno: l'anno intero spetta a un solo
> ente (§4 della ricerca issue #19). |

(La riga esistente «Residenza a Milano» resta: questa la precisa, non la
sostituisce. In alternativa si può arricchire quella.)

---

## Lacune

- **Formulazione esatta della pagina MEF «Disciplina del tributo» comunale sul
  domicilio fiscale**: il fetch ha restituito la frase «L'addizionale è dovuta
  al comune nel quale il contribuente ha il domicilio fiscale alla data del
  1° gennaio dell'anno cui si riferisce il pagamento» — «il pagamento» invece
  di «l'addizionale stessa». Letta tramite lo strumento di fetch (che riassume
  con un modello), non sull'HTML grezzo: la sostanza (1° gennaio) coincide con
  la norma letta direttamente su Normattiva, ma la parola esatta della pagina
  MEF non è certificata. La regionale ha lo stesso caveat, con frase però
  identica alla norma.
- **Decorrenza applicativa dell'art. 8 D.Lgs. 175/2014**: il decreto è in
  vigore dal 13-12-2014 (intestazione Normattiva); non ho verificato su fonte
  primaria da quale *anno d'imposta* la nuova data (1° gennaio per la
  regionale) sia stata applicata in concreto (2014 o 2015). Irrilevante per
  l'anno d'imposta 2026: il testo vigente è univoco.
- **Prassi AdE specifica sul «frazionamento»**: non ho cercato circolari o
  risoluzioni dedicate al trasferimento in corso d'anno oltre alle istruzioni
  730/2026 (lette direttamente, PDF p. 18). Le norme istitutive assegnano
  l'anno intero a un solo ente senza prevedere riparto, e le istruzioni 730
  confermano la meccanica del 2 novembre: una prassi ulteriore potrebbe solo
  ribadire, non contraddire.
- **«Casi particolari addizionale regionale» (Veneto e Marche)**: le stesse
  istruzioni 730/2026 (p. 18) prevedono una casella per aliquote regionali
  agevolate legate a condizioni soggettive. Fuori dal perimetro (il caso del
  brief è la Lombardia), ma è un promemoria per l'eventuale selettore
  nazionale: in almeno due regioni l'aliquota non dipende solo dal luogo e dal
  reddito. Non approfondito.
