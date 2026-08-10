# Jet HR - Task

Prototipo che, data una retribuzione annua lorda, proietta il netto annuale e
mensile ed espone tutte le voci trattenute. Task per Product Builder @ Jet HR.

## Regole di lavoro

### Registra ogni semplificazione, nel momento in cui la fai

Il brief dice che le semplificazioni saranno discusse in intervista: sono un
deliverable, non un dettaglio. Ogni volta che restringi il dominio — un caso che
non copri, un parametro che fissi invece di esporre, una regola che approssimi —
aggiungi subito una riga a `docs/ASSUNZIONI.md`. Non a fine progetto: le scelte
prese di sfuggita sono quelle che si dimenticano, ed è su quelle che si viene
incalzati.

Un ADR (`docs/adr/`) è un'altra cosa e ha una soglia più alta: irreversibile,
sorprendente, vero trade-off. Quasi nessuna semplificazione la supera.

### Nessuna costante fiscale senza la sua fonte

Ogni aliquota, scaglione, soglia o massimale porta accanto la fonte primaria e
l'anno di riferimento, come commento sulla riga:

```js
const ALIQUOTA_IRPEF_1 = 0.23 // fino a 28.000 EUR - fonte: <url>, anno <n>
```

Fonti primarie: Agenzia delle Entrate, INPS, Gazzetta Ufficiale, comune e regione
per le addizionali. Mai un riassunto di terze parti. Vale anche per i valori
attesi nei test: un numero atteso senza provenienza non prova niente.

### Lingua

Dominio in italiano, tecnica in inglese. `ral`, `imponibileFiscale`,
`addizionaleComunale` — non `grossSalary` né `taxableIncome`. I nomi dei test
descrivono il dominio in italiano: `test('IRPEF sul secondo scaglione')`.

Il glossario in `CONTEXT.md` è la fonte di verità dei termini: se un concetto non
c'è ancora, o stai inventando linguaggio o c'è un buco da colmare.

### Dove vivono le note

- `docs/ASSUNZIONI.md` — registro delle semplificazioni
- `docs/ricerca/` — output di `/research`, un file per domanda, con citazioni
- `CONTEXT.md` — glossario del dominio (lo crea `/domain-modeling`, non a mano)
- `docs/adr/` — decisioni architetturali, rare

## Agent skills

### Issue tracker

Issue e spec vivono come GitHub issue su `teodea/jethr-task`, via `gh` CLI.
Vedi `docs/agents/issue-tracker.md`.

### Triage labels

Le cinque etichette canoniche, con i nomi di default. Vedi `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` e `docs/adr/` alla radice. Vedi `docs/agents/domain.md`.
