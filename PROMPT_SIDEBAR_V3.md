# PROMPT PARA CLAUDE CODE — SIDEBAR V3

## CONTEXTO
Docusaurus v2.4.3 + React 17. Estética forense: fondo azul noche (#050a14),
acento cian (#00d9ff), ámbar (#ffaa00), tipografía monoespaciada.
Los archivos afectados son `src/css/custom.css` y `sidebars.js`.

## REGLAS
1. Lee los archivos completos antes de editar.
2. No toques ningún otro CSS ni componente React.
3. Build al final: `npm run build -- --locale es`
4. Un solo commit: `style(sidebar): SVG icons + V3 hover + transitions`

---

## PASO 1 — AUDITORÍA (solo lectura, no editar todavía)

Ejecuta estos greps para entender el estado actual antes de tocar nada:

```bash
# Ver TODAS las reglas CSS relacionadas con sidebar-icon-*
grep -n "sidebar-icon" src/css/custom.css

# Ver si hay emojis/unicode en ::before de la sidebar
grep -n "::before\|content:" src/css/custom.css | grep -i "sidebar\|menu__link--sublist\|⚡\|🌍\|🛠\|📚\|📊\|📡\|zap\|globe\|tool\|book\|trend\|activ"

# Ver las reglas de transición y hover actuales
grep -n "menu__link\|menu__list-item\|sidebar.*hover\|sidebar.*transition" src/css/custom.css | head -40

# Ver las reglas de scrollbar
grep -n "scrollbar\|webkit-scroll" src/css/custom.css

# Ver si existe sidebar-icon-activity (puede no existir aún)
grep -n "sidebar-icon-activity" src/css/custom.css
```

Anota mentalmente qué líneas contienen reglas de `sidebar-icon-*` con `content:` o
`background-image:` usando emojis. Las eliminarás en el paso 2.

---

## PASO 2 — ELIMINAR REGLAS EMOJI EXISTENTES

En `src/css/custom.css`, busca y ELIMINA cualquier bloque del tipo:

```css
/* ELIMINAR bloques similares a estos: */
.sidebar-icon-zap .menu__link--sublist::before { content: '⚡'; ... }
.sidebar-icon-globe .menu__link--sublist::before { content: '🌍'; ... }
.sidebar-icon-tool .menu__link--sublist::before { content: '🛠️'; ... }
.sidebar-icon-book .menu__link--sublist::before { content: '📚'; ... }
.sidebar-icon-trending .menu__link--sublist::before { content: '📊'; ... }
.sidebar-icon-activity .menu__link--sublist::before { content: '📡'; ... }
```

Si los iconos están implementados como `background-image` con emojis encoded,
elimina esos bloques también. Si encuentras variantes (`.sidebar-icon-zap > a::before`,
`.sidebar-icon-zap .menu__link::before`, etc.), elimínalas todas.

Si `sidebar-icon-activity` NO existe en el CSS, no hay nada que eliminar para esa clase.

---

## PASO 3 — AÑADIR SISTEMA DE ICONOS SVG

Al final de `src/css/custom.css`, AÑADE este bloque completo:

```css
/* ═══════════════════════════════════════════════════════════════
   SIDEBAR ICON SYSTEM v2 — SVG data-URI (sin emojis)
   Colores por sección para orientación visual instantánea.
   ═══════════════════════════════════════════════════════════════ */

/* Base compartida — setup del pseudo-elemento */
.sidebar-icon-zap    .menu__link--sublist::before,
.sidebar-icon-globe  .menu__link--sublist::before,
.sidebar-icon-tool   .menu__link--sublist::before,
.sidebar-icon-book   .menu__link--sublist::before,
.sidebar-icon-trending .menu__link--sublist::before,
.sidebar-icon-activity .menu__link--sublist::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 7px;
  vertical-align: -1px;
  flex-shrink: 0;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 0.8;
  transition: opacity 200ms ease;
}

.sidebar-icon-zap:hover    .menu__link--sublist::before,
.sidebar-icon-globe:hover  .menu__link--sublist::before,
.sidebar-icon-tool:hover   .menu__link--sublist::before,
.sidebar-icon-book:hover   .menu__link--sublist::before,
.sidebar-icon-trending:hover .menu__link--sublist::before,
.sidebar-icon-activity:hover .menu__link--sublist::before {
  opacity: 1;
}

/* ── Rayo rojo — EL COLAPSO ───────────────────────────────── */
.sidebar-icon-zap .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E%3C/svg%3E");
}

/* ── Globo cian — DIMENSIÓN EUROPEA ─────────────────────── */
.sidebar-icon-globe .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%2300d9ff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
}

/* ── Llave púrpura — MÉTODOS Y ACTUALIZACIONES ───────────── */
.sidebar-icon-tool .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/%3E%3C/svg%3E");
}

/* ── Libro verde — CIFRAS Y REFERENCIA ───────────────────── */
.sidebar-icon-book .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/%3E%3C/svg%3E");
}

/* ── Barras ámbar — VISUALIZACIONES ─────────────────────── */
.sidebar-icon-trending .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2.5' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='18' y1='20' x2='18' y2='10'/%3E%3Cline x1='12' y1='20' x2='12' y2='4'/%3E%3Cline x1='6' y1='20' x2='6' y2='14'/%3E%3C/svg%3E");
}

/* ── Onda cian — DATOS EN TIEMPO REAL ───────────────────── */
.sidebar-icon-activity .menu__link--sublist::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%2300d9ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='22 12 18 12 15 21 9 3 6 12 2 12'/%3E%3C/svg%3E");
}
```

---

## PASO 4 — MEJORAS V3: TRANSICIONES, HOVER, ACTIVE, SCROLLBAR

Añade este bloque INMEDIATAMENTE DESPUÉS del bloque anterior en `custom.css`.

**IMPORTANTE:** Antes de añadir, comprueba si ya existen reglas para
`.menu__link`, `.menu__link--active`, `.theme-doc-sidebar-menu::-webkit-scrollbar`
en el CSS. Si existen, en lugar de añadir duplicado, MODIFICA las existentes.

```css
/* ═══════════════════════════════════════════════════════════════
   SIDEBAR V3 — Transiciones, hover, active, scrollbar
   ═══════════════════════════════════════════════════════════════ */

/* Transiciones suaves — reemplaza any/all */
.menu__link {
  transition:
    color 200ms ease,
    border-left-color 200ms ease,
    background-color 200ms ease !important;
  will-change: color, background-color;
}

/* Hover — gradiente direccional sutil */
.menu__link:not(.menu__link--active):hover {
  border-left-color: rgba(0, 217, 255, 0.35) !important;
  background: linear-gradient(
    90deg,
    rgba(0, 217, 255, 0.05) 0%,
    transparent 70%
  ) !important;
  color: #e2e8f0 !important;
}

/* Active — borde ámbar sólido con fondo cálido */
.menu__link--active:not(.menu__link--sublist) {
  border-left: 3px solid #ffaa00 !important;
  background: linear-gradient(
    90deg,
    rgba(255, 170, 0, 0.09) 0%,
    transparent 60%
  ) !important;
  color: #fef3c7 !important;
  font-weight: 500 !important;
}

/* Categorías colapsables — escala de texto */
.menu__link--sublist {
  letter-spacing: 0.05em;
  font-size: 0.71rem;
}

/* Items de navegación — tamaño coherente */
.menu__link:not(.menu__link--sublist):not(.menu__caret) {
  font-size: 0.83rem;
  line-height: 1.45;
}

/* Scrollbar ultradelgada */
.theme-doc-sidebar-menu {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 217, 255, 0.15) transparent;
}
.theme-doc-sidebar-menu::-webkit-scrollbar {
  width: 3px;
}
.theme-doc-sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}
.theme-doc-sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.15);
  border-radius: 2px;
}
.theme-doc-sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 217, 255, 0.35);
}

/* Separadores internos en DATOS EN TIEMPO REAL — migrar de inline style */
.sidebar-section-divider {
  font-family: var(--font-display, monospace);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--ifm-color-primary, #00d9ff);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0 0.5rem 0.3rem;
  margin: 0.8rem 0 0.3rem;
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  pointer-events: none;
}
```

---

## PASO 5 — SIDEBARS.JS: DOS CAMBIOS

**Cambio 5a — Label con interrogación en sección de datos:**
En `sidebars.js`, buscar:
```js
label: '¿Quién Generaba cuando Cayó la Red?',
```
Reemplazar por:
```js
label: 'Mix de Generación en el Colapso',
```

**Cambio 5b — Migrar inline styles de los dividers HTML a clase CSS:**
Buscar el primer `type: 'html'` dentro de DATOS EN TIEMPO REAL:
```js
value: '<div style="font-family:var(--font-display);font-size:0.7rem;font-weight:700;color:var(--ifm-color-primary);letter-spacing:0.1em;margin:0.5rem 0;padding:0 0.5rem 0.3rem;text-transform:uppercase;border-bottom:1px solid rgba(6,182,212,0.2);">Telemetría del Incidente</div>',
```
Reemplazar por:
```js
value: '<div class="sidebar-section-divider">Telemetría del Incidente</div>',
```

Buscar el segundo `type: 'html'`:
```js
value: '<div style="font-family:var(--font-display);font-size:0.7rem;font-weight:700;color:var(--ifm-color-primary);letter-spacing:0.1em;margin:1rem 0 0.5rem;padding:0 0.5rem 0.3rem;text-transform:uppercase;border-bottom:1px solid rgba(6,182,212,0.2);">Estructura y Mercado</div>',
```
Reemplazar por:
```js
value: '<div class="sidebar-section-divider">Estructura y Mercado</div>',
```

---

## PASO 6 — VERIFICACIÓN

```bash
npm run build -- --locale es
```

Build debe terminar sin errores. Verificación visual:
1. Abrir cualquier capítulo en `npm run start`
2. Las categorías EL COLAPSO, DIMENSIÓN EUROPEA, etc. deben mostrar un pequeño
   icono SVG a la izquierda del texto, sin emoji unicode
3. Al hacer hover sobre un item: gradiente lateral sutil visible
4. El item activo: borde ámbar izquierdo + fondo cálido
5. El scrollbar de la sidebar: delgado 3px, apenas visible
6. Los separadores de DATOS EN TIEMPO REAL: mismo aspecto que antes
   pero ahora usando la clase CSS en lugar de inline styles

---

## COMMIT

```bash
git add sidebars.js src/css/custom.css
git commit -m "style(sidebar): SVG icons v2 + V3 hover + transitions + scrollbar"
git push origin main
```
