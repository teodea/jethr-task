# Skill installate

Set completo (25 skill) da [mattpocock/skills](https://github.com/mattpocock/skills) (MIT),
copiato **non modificato** dal commit `84fdeffd12f2ee307994d1eb6feb48173b6e0502` (2026-08-06).

Installate come pacchetto intero, non a pezzi, perché sono un **flusso**, non un menu:
`ask-matt` è un router sulle altre, e più skill ne invocano altre internamente
(`implement` guida `tdd` e chiude con `code-review`; `grill-with-docs` esegue `grilling`
usando `domain-modeling`). Sceglierne un sottoinsieme lascia riferimenti pendenti.

Il costo di tenerle tutte è vicino a zero: le skill user-invoked hanno
`disable-model-invocation: true`, quindi non partono da sole — si attivano solo se digitate.

## Da dove si parte

`/ask-matt` è il router: descrive il flusso principale e dice quale skill serve in quale
situazione. `/setup-matt-pocock-skills` è dichiarato precondizione — va eseguito una volta
per repo prima del primo flusso.
