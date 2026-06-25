# custom.css v2 — limpieza de reglas que solapan con módulos

Las siguientes reglas usan !important sobre selectores [class*="..."] que
apuntan a clases de CSS Modules. Generan comportamiento impredecible porque
el hash de las clases puede cambiar. Aplicar estos cambios:

---

## Eliminar el bloque completo "4. EVIDENCE LEVEL 1"

BUSCAR Y ELIMINAR COMPLETO:
```css
/* ── 4. EVIDENCE LEVEL 1 — fondo más perceptible ────────────
   El background actual (opacity 0.02) es invisible.
   ──────────────────────────────────────────────────────────── */

[class*="level1"] {
  background-color: rgba(107, 16, 36, 0.04) !important;
  padding: 1rem 1.25rem !important;
}

html[data-theme='dark'] [class*="level1"] {
  background-color: rgba(107, 16, 36, 0.08) !important;
}
```

Razón: AnnexEvidence.module.css ya define .level1 correctamente.
El !important aquí fuerza padding incorrecto cuando level1 aparece
dentro de AnnexEvidenceLead (sobrescribe el grid de la columna derecha).

---

## Eliminar el bloque completo "3. EVIDENCE CHIPS"

BUSCAR Y ELIMINAR COMPLETO:
```css
/* ── 3. EVIDENCE CHIPS — más legibles en proyector ──────────
   Los chips actuales (0.60rem) son ilegibles a 3 metros.
   ──────────────────────────────────────────────────────────── */

[class*="chip1"],
[class*="chip2"] {
  font-size: 0.68rem !important;
  padding: 0.3rem 0.75rem !important;
  border-radius: 4px !important;
}
```

Razón: AnnexEvidence.module.css controla esto. Si se quiere aumentar
el font-size de los chips, hacerlo directamente en el módulo.

---

## Eliminar el bloque completo "2. SECTION SUMMARY"

BUSCAR Y ELIMINAR COMPLETO:
```css
/* ── 2. SECTION SUMMARY — indicador de colapsable ───────────
   ...
   ──────────────────────────────────────────────────────────── */

[class*="sectionSummary"]::after {
  content: '▾';
  ...
}

details:not([open]) > [class*="sectionSummary"]::after {
  transform: rotate(-90deg);
}

details[open] > [class*="sectionSummary"]::after {
  opacity: 0.6;
}
```

Razón: AnnexSection ya no usa <details>, estas reglas no aplican.

---

## Conservar sin cambios

Todos los demás bloques de custom.css v1 y v2 son seguros:
- article details:not([class]) — estilos para <details> nativos en MDX ✓
- .annex-summary-block / demonstrates / limits / connection ✓
- :::tip admonitions ✓
- projector readiness @media ✓
- print ✓
