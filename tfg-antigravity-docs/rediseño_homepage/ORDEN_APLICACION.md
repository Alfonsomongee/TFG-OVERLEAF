# ORDEN DE APLICACIÓN — Homepage patches

Aplicar en este orden. Cada patch es independiente.
Hacer npm run build tras todos para verificar.

---

## Prioridad 1 — IMPRESCINDIBLE (copy incorrecto)

### patch_hero_copy_numbers.md
Archivo: src/components/HomeHero.jsx
Cambios: 8 str_replace (4 locales strip + 4 locales chain detail)
Qué hace: Corrige "57 M" → ">50 M" y "33 s" → "<1 min"
           en la franja de cifras del hero y en el detail de la cadena causal.

---

## Prioridad 2 — RECOMENDABLE (rendimiento)

### patch_hero_performance.md
Archivo: src/components/HomeHero.module.css
Cambios: 3 (eliminar nodePulse, eliminar metricSweep, actualizar reduced-motion)
Qué hace: Elimina animaciones de box-shadow y gradient que disparan
           paint continuo. No hay cambio visual notable al quitarlos.

---

## Prioridad 3 — OPCIONAL (robustez + UX)

### patch_annexes_observer.md
Archivos: src/components/HomeAnnexes.jsx + HomeAnnexes.module.css
Cambios: 4 (import, useEffect, ref, clases CSS)
Qué hace: La animación de entrada de los 10 anexos solo dispara
           cuando el grid entra en viewport, no en el load inicial.

### patch_readingpaths_position.md
Archivo: src/components/HomeReadingPaths.module.css
Cambios: 1 str_replace
Qué hace: Añade position: relative al .card para que los corner
           brackets decorativos no dependan de SpotlightCard.

---

## Prioridad 4 — EDITORIAL (decisión)

### patch_chatinvite_level.md
Archivos: src/components/HomeChatInvite.jsx + HomeChatInvite.module.css
Cambios: 4 (padding, eliminar ::before decorativo, font-size, tag h2→h3)
Qué hace: Reduce el protagonismo visual del bloque del chatbot.
           Aplicar solo si se considera que el chatbot
           está compitiendo con los bloques de contenido académico.

---

## Verificación final

npm run build

Si build OK: no hay más cambios necesarios en la homepage.
