# Annex.module.css — 4 cambios quirúrgicos

Aplicar con str_replace. Sin tocar nada más.

---

## Cambio 1 · header::before — quitar gradiente, color sólido

BUSCAR:
```css
.header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  bottom: 1.35rem;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--annex-accent),
    color-mix(in srgb, var(--annex-accent) 28%, transparent)
  );
}
```

REEMPLAZAR CON:
```css
.header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  bottom: 1.35rem;
  width: 2px;
  background: var(--annex-accent);
}
```

---

## Cambio 2 · header::after — quitar gradiente, color sólido

BUSCAR:
```css
.header::after {
  content: '';
  position: absolute;
  left: clamp(0.9rem, 2vw, 1.15rem);
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--annex-accent) 44%, var(--annex-border)),
    var(--annex-border) 34%,
    transparent
  );
}
```

REEMPLAZAR CON:
```css
.header::after {
  content: '';
  position: absolute;
  left: clamp(0.9rem, 2vw, 1.15rem);
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--annex-border);
}
```

---

## Cambio 3 · sectionContent border-left — subir opacidad de 16% a 32%

BUSCAR:
```css
  border-left: 2px solid color-mix(in srgb, var(--annex-accent) 16%, transparent);
```

REEMPLAZAR CON:
```css
  border-left: 2px solid color-mix(in srgb, var(--annex-accent) 32%, transparent);
```

---

## Cambio 4 · sectionSummary y sectionDetails — eliminar estas reglas enteras

Ya no hacen falta porque AnnexSection.jsx elimina el <details>.
Borrar los siguientes bloques completos:

- `.sectionDetails[open] .sectionSummary { ... }`
- `.sectionDetails[open] .sectionSummary .sectionTitle { ... }`
- `.sectionSummary { ... }` (bloque completo con position, margin, padding, etc.)
- `.sectionSummary::after { ... }`
- `.sectionSummary::before { ... }`
- `.sectionDetails[open] > .sectionSummary::before { ... }`
- `.sectionSummary:hover { ... }`
- `.sectionSummary:hover::after { ... }`
- `.sectionDetails[open] > .sectionSummary::after { ... }`
- `.sectionSummary:focus { ... }`
- `.sectionSummary::-webkit-details-marker { ... }`

Añadir en su lugar el nuevo bloque de cabecera de sección:

```css
.sectionHeader {
  margin-bottom: 0.65rem;
}
```

Y en el bloque @media (prefers-reduced-motion: reduce), eliminar
`.sectionSummary` de la lista de selectores.
