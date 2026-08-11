import { COSTANTI_2026, FONTI_2026 } from './2026.js'
import { COSTANTI_2025, FONTI_2025 } from './2025.js'

export const COSTANTI_PER_ANNO = {
  2026: COSTANTI_2026,
  2025: COSTANTI_2025,
}

// Le fonti restano un indice separato dai valori invece di stare dentro COSTANTI_PER_ANNO:
// il motore riceve i valori nudi e non ha modo di inciampare in una citazione (issue #14).
export const FONTI_PER_ANNO = {
  2026: FONTI_2026,
  2025: FONTI_2025,
}

export const ANNO_CORRENTE = 2026 // anno d'imposta del prototipo (docs/ASSUNZIONI.md: "Anno d'imposta 2026, unico")

export { COSTANTI_2026, COSTANTI_2025, FONTI_2026, FONTI_2025 }
