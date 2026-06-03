# Plan de Rediseño: Modo Claro Analógico / Pergamino
## TFG Apagón Ibérico 28-A — Docusaurus `custom.css`

> **Estado**: Plan técnico listo para ejecución por agente de código.  
> **Alcance**: Únicamente modo claro (`[data-theme='light']`). El modo oscuro queda intacto.  
> **Principio rector**: *"Informe técnico impreso en pergamino envejecido"* — cero neón, cero azules fríos, máximo contraste analógico.

---

## 1. Nueva Paleta (14 colores)

| Token | Hex | Ratio vs bg-0 | Uso principal |
|---|---|---|---|
| `--bg-0` | `#F5F0E8` | — | Fondo de página, Navbar base |
| `--bg-1` | `#EDE7D9` | — | Tarjetas, pie de página, sidebar |
| `--bg-2` | `#E2DBCD` | — | Superficies elevadas, dropdowns |
| `--bg-3` | `#D6CEBC` | — | Estados hover |
| `--forensic-bg-primary` | `#F0EBE0` | — | Admonitions base alternativo |
| `--forensic-bg-surface` | `#FAF7F2` | — | Fondo de notas/admonitions |
| `--text-0` | `#2C2416` | **13.50:1** ✅ | Titulares, h1–h4 |
| `--text-1` | `#3D3426` | **10.78:1** ✅ | Cuerpo del texto |
| `--text-2` | `#5C5240` | **6.77:1** ✅ | Subtítulos, cabeceras tabla |
| `--text-3` | `#6B5F50` | **5.48:1** ✅ | Metadatos, fechas, fuentes |
| `--accent-primary` | `#1E3A5F` | **10.14:1** ✅ | Botones primarios, enlaces activos |
| `--accent-alarm` | `#7A2535` | **8.64:1** ✅ | Sidebar activo, alertas forenses |
| `--accent-secondary` | `#7A5C0E` | **5.50:1** ✅ | Alertas moderadas (reemplaza naranja) |
| `--accent-danger` | `#7A2535` | **8.64:1** ✅ | Admonitions peligro, bordes críticos |
| `--accent-success` | `#3B6B3E` | **5.51:1** ✅ | Restauraciones, estados OK |
| `--accent-verde-bosque` | `#2F5233` | **7.79:1** ✅ | Admonitions técnicas, bordes |
| `--accent-terracota` | `#8B4A2F` | **5.94:1** ✅ | Incident boxes, elementos críticos |

> **Nota sobre mostaza y text-3**: Ambos superan AA normal (4.5:1). `text-3` se eleva de `#7A6E5E` (4.39:1 — suspenso) a `#6B5F50` (5.48:1 — aprobado AA).

---

## 2. Mapeo Componente → Variable CSS

| Componente | Propiedad | Variable actual | **Nuevo valor** |
|---|---|---|---|
| **Página / body** | background | `--bg-0` | `#F5F0E8` |
| **Navbar** | background | `--bg-0` (glassmorphism) | `color-mix(in srgb, #EDE7D9 88%, transparent)` |
| **Navbar** | texto links | `--text-1` | `#3D3426` |
| **Navbar** | link activo | accent primario | `#1E3A5F` |
| **Sidebar** | background | fusionado con `--bg-0` | `#F5F0E8` (sin cambio estructural) |
| **Sidebar** | ítem activo | `--accent-alarm` (ámbar) | `#1E3A5F` (tinta azul) |
| **Sidebar** | ítem activo bg | ámbar translúcido | `rgba(30, 58, 95, 0.08)` |
| **Sidebar** | texto inactivo | `--text-2` | `#5C5240` |
| **Admonition note** | borde izq. | cian | `#2F5233` (verde bosque) |
| **Admonition note** | fondo | `--forensic-bg-surface` | `rgba(47, 82, 51, 0.06)` |
| **Admonition warning** | borde izq. | ámbar | `#7A5C0E` (mostaza oscura) |
| **Admonition warning** | fondo | ámbar translúcido | `rgba(122, 92, 14, 0.07)` |
| **Admonition danger** | borde izq. | rojo | `#7A2535` (burdeos) |
| **Admonition danger** | fondo | rojo translúcido | `rgba(122, 37, 53, 0.07)` |
| **Incident Box** | fondo | `rgba(239,68,68,0.1)` | `rgba(139, 74, 47, 0.10)` (terracota) |
| **Incident Box** | borde | rojo puro | `#7A2535` |
| **Tablas** | borde filas | azul frío sutil | `rgba(44, 36, 22, 0.12)` |
| **Tablas** | cabecera bg | `--bg-1` | `#EDE7D9` |
| **Tablas** | cabecera texto | `--text-0` | `#2C2416` |
| **Cards (gráficas)** | background | `--bg-1` | `#EDE7D9` |
| **Cards (gráficas)** | border | sutil | `1px solid rgba(44,36,22,0.15)` |
| **Botones primarios** | background | cian hsl(190…) | `#1E3A5F` |
| **Botones primarios** | hover bg | más claro | `#2A4E7A` |
| **Botones primarios** | texto | blanco | `#FAF7F2` |
| **Botones secundarios** | background | gris-azulado | `transparent` |
| **Botones secundarios** | border | accent | `1px solid #1E3A5F` |
| **Botones secundarios** | texto | accent | `#1E3A5F` |
| **Código inline** | background | frío | `rgba(44, 36, 22, 0.08)` |
| **Código inline** | texto | accent | `#7A2535` |
| **Drop-caps** | color | cian / ámbar | `#1E3A5F` |
| **Footer** | background | `--bg-1` | `#EDE7D9` |
| **Footer** | texto | `--text-2` | `#5C5240` |
| **TOC (tabla contenidos)** | link activo | cian | `#1E3A5F` |
| **TOC** | link hover | — | `#7A2535` |
| **Scrollbar** | thumb | cian | `#C4B8A0` |
| **Scrollbar** | track | — | `#E2DBCD` |

---

## 3. Código CSS Completo

```css
/* ============================================================
   MODO CLARO — ESTÉTICA ANALÓGICA / PERGAMINO ENVEJECIDO
   TFG Apagón Ibérico 28-A
   Añadir / sustituir en: src/css/custom.css
   Solo afecta a [data-theme='light']. El modo oscuro queda intacto.
   ============================================================ */

[data-theme='light'] {

  /* ----------------------------------------------------------
     1. FONDOS
  ---------------------------------------------------------- */
  --bg-0:                     #F5F0E8;   /* pergamino base — página y navbar */
  --bg-1:                     #EDE7D9;   /* hueso — tarjetas, footer, sidebar */
  --bg-2:                     #E2DBCD;   /* beige elevado — dropdowns, hover bg */
  --bg-3:                     #D6CEBC;   /* hover states — botones, filas tabla */
  --forensic-bg-primary:      #F0EBE0;   /* alternativo para componentes especiales */
  --forensic-bg-surface:      #FAF7F2;   /* fondo de notas/admonitions */

  /* ----------------------------------------------------------
     2. TEXTOS
  ---------------------------------------------------------- */
  --text-0:                   #2C2416;   /* carbón oscuro — titulares (13.5:1) */
  --text-1:                   #3D3426;   /* tinta oscura — cuerpo (10.8:1) */
  --text-2:                   #5C5240;   /* gris topo — subtítulos (6.8:1) */
  --text-3:                   #6B5F50;   /* gris plomo — metadatos (5.5:1) */

  /* ----------------------------------------------------------
     3. ACENTOS SEMÁNTICOS
  ---------------------------------------------------------- */
  --accent-primary:           #1E3A5F;   /* tinta azul — botones, links (10.1:1) */
  --accent-primary-hover:     #2A4E7A;   /* hover del primario */
  --accent-alarm:             #7A2535;   /* burdeos — alarmas forenses (8.6:1) */
  --accent-secondary:         #7A5C0E;   /* mostaza oscura — alertas mod. (5.5:1) */
  --accent-danger:            #7A2535;   /* burdeos — peligro crítico */
  --accent-success:           #3B6B3E;   /* verde bosque — restauraciones (5.5:1) */
  --accent-verde:             #2F5233;   /* verde bosque oscuro — técnico (7.8:1) */
  --accent-terracota:         #8B4A2F;   /* terracota — incident boxes (5.9:1) */

  /* ----------------------------------------------------------
     4. DOCUSAURUS OVERWRITES
     (variables propias de Docusaurus que usan cian por defecto)
  ---------------------------------------------------------- */
  --ifm-color-primary:              #1E3A5F;
  --ifm-color-primary-dark:         #162C4A;
  --ifm-color-primary-darker:       #112338;
  --ifm-color-primary-darkest:      #0A1522;
  --ifm-color-primary-light:        #2A4E7A;
  --ifm-color-primary-lighter:      #3A6494;
  --ifm-color-primary-lightest:     #4F7DAD;

  --ifm-background-color:           var(--bg-0);
  --ifm-background-surface-color:   var(--bg-1);
  --ifm-font-color-base:            var(--text-1);
  --ifm-heading-color:              var(--text-0);
  --ifm-link-color:                 var(--accent-primary);
  --ifm-link-hover-color:           var(--accent-alarm);
  --ifm-navbar-background-color:    var(--bg-0);
  --ifm-footer-background-color:    var(--bg-1);
  --ifm-toc-link-color:             var(--text-2);
  --ifm-toc-link-color-active:      var(--accent-primary);
  --ifm-code-background:            rgba(44, 36, 22, 0.07);
  --ifm-code-color:                 var(--accent-alarm);
  --ifm-blockquote-border-color:    var(--accent-verde);
  --ifm-blockquote-color:           var(--text-2);
  --ifm-hr-border-color:            rgba(44, 36, 22, 0.18);
  --ifm-table-border-color:         rgba(44, 36, 22, 0.14);
  --ifm-table-stripe-background:    rgba(44, 36, 22, 0.04);
  --ifm-menu-color:                 var(--text-2);
  --ifm-menu-color-active:          var(--accent-primary);
  --ifm-menu-color-background-active:  rgba(30, 58, 95, 0.08);
  --ifm-menu-color-background-hover:   rgba(30, 58, 95, 0.05);

  /* ----------------------------------------------------------
     5. NAVBAR GLASSMORPHISM — TONO CÁLIDO
  ---------------------------------------------------------- */
  --navbar-glass-bg: color-mix(in srgb, var(--bg-1) 88%, transparent);

  /* ----------------------------------------------------------
     6. SCROLLBAR
  ---------------------------------------------------------- */
  scrollbar-color: #C4B8A0 #E2DBCD;
}

/* ============================================================
   NAVBAR — Glassmorphism cálido
   ============================================================ */
[data-theme='light'] .navbar {
  background: var(--navbar-glass-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(44, 36, 22, 0.12);
  box-shadow: 0 1px 0 rgba(44, 36, 22, 0.08);
}

[data-theme='light'] .navbar__title,
[data-theme='light'] .navbar__brand {
  color: var(--text-0);
  font-family: 'Space Grotesk', system-ui, sans-serif;
}

[data-theme='light'] .navbar__link {
  color: var(--text-1);
}

[data-theme='light'] .navbar__link:hover,
[data-theme='light'] .navbar__link--active {
  color: var(--accent-primary);
}

/* ============================================================
   SIDEBAR — Fusión con pergamino
   ============================================================ */
[data-theme='light'] .theme-doc-sidebar-container,
[data-theme='light'] aside {
  background-color: var(--bg-0);
  border-right: 1px solid rgba(44, 36, 22, 0.10);
}

[data-theme='light'] .menu__link {
  color: var(--text-2);
  border-radius: 4px;
  transition: all 0.2s ease;
}

[data-theme='light'] .menu__link:hover {
  background: var(--ifm-menu-color-background-hover);
  color: var(--accent-primary);
}

[data-theme='light'] .menu__link--active {
  background: var(--ifm-menu-color-background-active);
  color: var(--accent-primary);
  font-weight: 600;
  border-left: 3px solid var(--accent-primary);
}

/* ============================================================
   ADMONITIONS — Reemplazar cian/ámbar por paleta analógica
   ============================================================ */
[data-theme='light'] .admonition {
  background: var(--forensic-bg-surface);
  border-radius: 4px;
  border-left-width: 4px;
  border-left-style: solid;
}

/* Nota técnica (note / tip) */
[data-theme='light'] .admonition-note,
[data-theme='light'] .admonition-tip {
  border-left-color: var(--accent-verde);
  background: rgba(47, 82, 51, 0.06);
}

[data-theme='light'] .admonition-note .admonition-heading,
[data-theme='light'] .admonition-tip .admonition-heading {
  color: var(--accent-verde);
}

/* Aviso / Warning */
[data-theme='light'] .admonition-warning,
[data-theme='light'] .admonition-caution {
  border-left-color: var(--accent-secondary);
  background: rgba(122, 92, 14, 0.07);
}

[data-theme='light'] .admonition-warning .admonition-heading,
[data-theme='light'] .admonition-caution .admonition-heading {
  color: var(--accent-secondary);
}

/* Peligro / Danger */
[data-theme='light'] .admonition-danger {
  border-left-color: var(--accent-danger);
  background: rgba(122, 37, 53, 0.07);
}

[data-theme='light'] .admonition-danger .admonition-heading {
  color: var(--accent-danger);
}

/* Info */
[data-theme='light'] .admonition-info {
  border-left-color: var(--accent-primary);
  background: rgba(30, 58, 95, 0.06);
}

[data-theme='light'] .admonition-info .admonition-heading {
  color: var(--accent-primary);
}

/* ============================================================
   INCIDENT BOX — Terracota en lugar de rojo neón
   ============================================================ */
[data-theme='light'] .incident-box,
[data-theme='light'] [class*="incidentBox"],
[data-theme='light'] [class*="incident-box"] {
  background: rgba(139, 74, 47, 0.08);
  border: 1.5px solid var(--accent-terracota);
  border-left-width: 4px;
  border-radius: 4px;
}

[data-theme='light'] .incident-box h3,
[data-theme='light'] .incident-box .incident-title {
  color: var(--accent-terracota);
}

/* ============================================================
   TABLAS — Diseño orgánico / pergamino
   ============================================================ */
[data-theme='light'] table {
  background: transparent;
  border-collapse: collapse;
}

[data-theme='light'] table thead tr {
  background-color: var(--bg-1);
  border-bottom: 2px solid rgba(44, 36, 22, 0.20);
}

[data-theme='light'] table thead th {
  color: var(--text-0);
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.78em;
}

[data-theme='light'] table tbody tr {
  border-bottom: 1px solid rgba(44, 36, 22, 0.10);
}

[data-theme='light'] table tbody tr:hover {
  background-color: rgba(44, 36, 22, 0.04);
}

[data-theme='light'] table td {
  color: var(--text-1);
}

/* Celdas de alerta dentro de tablas de incidentes */
[data-theme='light'] table td.critical,
[data-theme='light'] table td[data-severity="critical"] {
  color: var(--accent-danger);
  font-weight: 600;
}

/* ============================================================
   TARJETAS DE GRÁFICAS Y SIMULADORES
   ============================================================ */
[data-theme='light'] .card,
[data-theme='light'] [class*="chartCard"],
[data-theme='light'] [class*="chart-card"],
[data-theme='light'] [class*="simulatorCard"],
[data-theme='light'] [class*="simulator-card"] {
  background: var(--bg-1);
  border: 1px solid rgba(44, 36, 22, 0.12);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(44, 36, 22, 0.06);
}

/* Botones dentro de simuladores */
[data-theme='light'] [class*="simulator"] button,
[data-theme='light'] [class*="chart"] button {
  background: transparent;
  border: 1px solid rgba(44, 36, 22, 0.25);
  color: var(--text-1);
  border-radius: 3px;
  transition: all 0.2s ease;
}

[data-theme='light'] [class*="simulator"] button:hover,
[data-theme='light'] [class*="chart"] button:hover {
  background: var(--bg-2);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

[data-theme='light'] [class*="simulator"] button.active,
[data-theme='light'] [class*="simulator"] button[data-active="true"] {
  background: var(--accent-primary);
  color: var(--forensic-bg-surface);
  border-color: var(--accent-primary);
}

/* ============================================================
   BOTONES PRINCIPALES (CTA)
   ============================================================ */
[data-theme='light'] .button--primary {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #FAF7F2;
}

[data-theme='light'] .button--primary:hover {
  background-color: var(--accent-primary-hover);
  border-color: var(--accent-primary-hover);
  color: #FAF7F2;
}

[data-theme='light'] .button--secondary {
  background-color: transparent;
  border: 1.5px solid var(--accent-primary);
  color: var(--accent-primary);
}

[data-theme='light'] .button--secondary:hover {
  background-color: rgba(30, 58, 95, 0.08);
}

/* Botones de despliegue ("Ver simulador", etc.) */
[data-theme='light'] [class*="deployButton"],
[data-theme='light'] [class*="toggleButton"],
[data-theme='light'] [class*="expandButton"] {
  background: transparent;
  border: 1px solid rgba(44, 36, 22, 0.22);
  color: var(--accent-primary);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.82em;
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  border-radius: 3px;
  padding: 0.3em 0.8em;
}

[data-theme='light'] [class*="deployButton"]:hover,
[data-theme='light'] [class*="toggleButton"]:hover {
  background: var(--bg-2);
  border-color: var(--accent-primary);
}

/* ============================================================
   TOC (Tabla de Contenidos lateral)
   ============================================================ */
[data-theme='light'] .table-of-contents__link {
  color: var(--text-3);
}

[data-theme='light'] .table-of-contents__link:hover {
  color: var(--accent-primary);
}

[data-theme='light'] .table-of-contents__link--active {
  color: var(--accent-primary);
  font-weight: 600;
}

/* ============================================================
   CÓDIGO — Bloques y inline
   ============================================================ */
[data-theme='light'] code {
  background: rgba(44, 36, 22, 0.07);
  color: var(--accent-alarm);
  border-radius: 3px;
  font-size: 0.88em;
  padding: 0.1em 0.35em;
}

[data-theme='light'] .prism-code,
[data-theme='light'] pre {
  background: #EDE5D0 !important;
  border: 1px solid rgba(44, 36, 22, 0.14);
  border-radius: 5px;
}

/* ============================================================
   DROP-CAPS
   ============================================================ */
[data-theme='light'] .drop-cap::first-letter,
[data-theme='light'] p.drop-cap::first-letter {
  color: var(--accent-primary);
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 700;
}

/* ============================================================
   FOOTER
   ============================================================ */
[data-theme='light'] .footer {
  background: var(--bg-1);
  border-top: 1px solid rgba(44, 36, 22, 0.12);
  color: var(--text-2);
}

[data-theme='light'] .footer__title {
  color: var(--text-0);
  font-family: 'Space Grotesk', system-ui, sans-serif;
}

[data-theme='light'] .footer__link-item {
  color: var(--text-2);
}

[data-theme='light'] .footer__link-item:hover {
  color: var(--accent-primary);
}

/* ============================================================
   SCROLLBAR (Webkit)
   ============================================================ */
[data-theme='light'] ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

[data-theme='light'] ::-webkit-scrollbar-track {
  background: var(--bg-2);
}

[data-theme='light'] ::-webkit-scrollbar-thumb {
  background: #C4B8A0;
  border-radius: 4px;
  border: 2px solid var(--bg-2);
}

[data-theme='light'] ::-webkit-scrollbar-thumb:hover {
  background: #A89880;
}

/* ============================================================
   SELECCIÓN DE TEXTO
   ============================================================ */
[data-theme='light'] ::selection {
  background: rgba(30, 58, 95, 0.18);
  color: var(--text-0);
}

/* ============================================================
   SEPARADORES HORIZONTALES
   ============================================================ */
[data-theme='light'] hr {
  border-color: rgba(44, 36, 22, 0.15);
}

/* ============================================================
   BLOCKQUOTES (citas académicas)
   ============================================================ */
[data-theme='light'] blockquote {
  border-left: 3px solid var(--accent-verde);
  background: rgba(47, 82, 51, 0.05);
  color: var(--text-2);
  border-radius: 0 4px 4px 0;
  font-style: italic;
}
```

---

## 4. Fragmentos JSX para Componentes Clave

### 4.1 — Colores de Recharts (todos los componentes de gráficas)

Los colores están **hardcodeados** en los componentes. Deben adaptarse al modo activo usando `useColorMode()` de Docusaurus.

```jsx
// hooks/useChartColors.js
import { useColorMode } from '@docusaurus/theme-common';

export function useChartColors() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return {
    // Líneas principales
    primary:    isDark ? '#06b6d4' : '#1E3A5F',    // cian → tinta azul
    danger:     isDark ? '#ef4444' : '#7A2535',    // rojo vivo → burdeos
    success:    isDark ? '#10b981' : '#3B6B3E',    // verde vivo → verde bosque
    warning:    isDark ? '#ffaa00' : '#7A5C0E',    // ámbar → mostaza oscura
    neutral:    isDark ? '#b0b8cc' : '#5C5240',    // gris frío → gris topo

    // Rellenos (con transparencia)
    primaryFill:  isDark ? 'rgba(6,182,212,0.15)'  : 'rgba(30,58,95,0.10)',
    dangerFill:   isDark ? 'rgba(239,68,68,0.15)'  : 'rgba(122,37,53,0.10)',
    successFill:  isDark ? 'rgba(16,185,129,0.15)' : 'rgba(59,107,62,0.10)',

    // Ejes y grid
    axisColor:  isDark ? '#7888aa' : '#6B5F50',
    gridColor:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(44,36,22,0.08)',

    // Tooltip
    tooltipBg:     isDark ? '#0f1830' : '#FAF7F2',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,36,22,0.15)',
    tooltipText:   isDark ? '#e8e8e8' : '#3D3426',

    // Background de la card
    cardBg:     isDark ? '#0f1830' : '#EDE7D9',
  };
}
```

**Uso en cualquier componente de gráfica:**

```jsx
// Ejemplo de uso en un componente de Recharts
import { useChartColors } from '@site/src/hooks/useChartColors';

export default function FrequencyChart({ data }) {
  const colors = useChartColors();

  return (
    <div style={{ background: colors.cardBg, borderRadius: 6, padding: '1rem' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gridColor} />
          <XAxis
            dataKey="time"
            tick={{ fill: colors.axisColor, fontFamily: 'JetBrains Mono' }}
            stroke={colors.gridColor}
          />
          <YAxis
            tick={{ fill: colors.axisColor, fontFamily: 'JetBrains Mono' }}
            stroke={colors.gridColor}
          />
          <Tooltip
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              color: colors.tooltipText,
              borderRadius: 4,
            }}
          />
          <Line type="monotone" dataKey="frequency" stroke={colors.primary} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="threshold" stroke={colors.danger} strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

### 4.2 — Incident Box (componente React)

```jsx
// components/IncidentBox/index.jsx
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function IncidentBox({ title, timestamp, severity = 'critical', children }) {
  const { colorMode } = useColorMode();

  const lightStyles = {
    background:   'rgba(139, 74, 47, 0.08)',
    borderColor:  '#7A2535',
    titleColor:   '#7A2535',
    metaColor:    '#6B5F50',
  };

  const darkStyles = {
    background:   'rgba(239, 68, 68, 0.10)',
    borderColor:  '#ef4444',
    titleColor:   '#ef4444',
    metaColor:    '#7888aa',
  };

  const s = colorMode === 'dark' ? darkStyles : lightStyles;

  return (
    <div style={{
      background: s.background,
      border: `1.5px solid ${s.borderColor}`,
      borderLeft: `4px solid ${s.borderColor}`,
      borderRadius: 4,
      padding: '1rem 1.25rem',
      margin: '1.5rem 0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
        <h4 style={{ color: s.titleColor, fontFamily: 'Space Grotesk', margin: 0 }}>
          ⚡ {title}
        </h4>
        {timestamp && (
          <span style={{ color: s.metaColor, fontFamily: 'JetBrains Mono', fontSize: '0.78em' }}>
            {timestamp}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
```

---

### 4.3 — Botones de Despliegue ("Ver simulador")

```jsx
// components/ToggleButton/index.jsx
import { useColorMode } from '@docusaurus/theme-common';
import { useState } from 'react';

export default function ToggleButton({ label, children }) {
  const [open, setOpen] = useState(false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4em',
    background: 'transparent',
    border: isDark
      ? '1px solid rgba(176,184,204,0.30)'
      : '1px solid rgba(44,36,22,0.22)',
    color: isDark ? '#06b6d4' : '#1E3A5F',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.82em',
    letterSpacing: '0.04em',
    borderRadius: 3,
    padding: '0.3em 0.8em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: open ? '0.75rem' : '0',
  };

  return (
    <div>
      <button style={btnStyle} onClick={() => setOpen(v => !v)}>
        {open ? '▲' : '▼'} {label}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
```

---

### 4.4 — Paleta de Plotly (si se usa en algún capítulo)

```jsx
// utils/plotlyTheme.js
import { useColorMode } from '@docusaurus/theme-common';

export function usePlotlyTheme() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return {
    layout: {
      paper_bgcolor: isDark ? '#0f1830' : '#EDE7D9',
      plot_bgcolor:  isDark ? '#0a1128' : '#F5F0E8',
      font: {
        family: 'JetBrains Mono, monospace',
        color:  isDark ? '#b0b8cc' : '#5C5240',
        size: 11,
      },
      xaxis: {
        gridcolor:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(44,36,22,0.10)',
        linecolor:  isDark ? 'rgba(255,255,255,0.12)' : 'rgba(44,36,22,0.18)',
        tickfont: { color: isDark ? '#7888aa' : '#6B5F50' },
        zerolinecolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(44,36,22,0.20)',
      },
      yaxis: {
        gridcolor:  isDark ? 'rgba(255,255,255,0.06)' : 'rgba(44,36,22,0.10)',
        linecolor:  isDark ? 'rgba(255,255,255,0.12)' : 'rgba(44,36,22,0.18)',
        tickfont: { color: isDark ? '#7888aa' : '#6B5F50' },
      },
      colorway: isDark
        ? ['#06b6d4', '#ef4444', '#10b981', '#ffaa00', '#b0b8cc']
        : ['#1E3A5F', '#7A2535', '#3B6B3E', '#7A5C0E', '#8B4A2F'],
    },
  };
}
```

---

### 4.5 — Variables CSS adicionales para módulos `.module.css`

Si algún componente usa CSS Modules con colores hardcodeados para el modo claro, deben actualizarse:

```css
/* Ejemplo: src/components/SomeComponent/styles.module.css */

/* ANTES (eliminar o comentar) */
/*
.container { background: #faf8f5; border: 1px solid #e0dbd0; }
.title { color: #1a1a1a; }
.meta { color: #4b5563; }
.accentBar { background: hsl(190 80% 38%); }
*/

/* DESPUÉS */
:global([data-theme='light']) .container {
  background: var(--bg-1);
  border: 1px solid rgba(44, 36, 22, 0.12);
}

:global([data-theme='light']) .title {
  color: var(--text-0);
}

:global([data-theme='light']) .meta {
  color: var(--text-3);
}

:global([data-theme='light']) .accentBar {
  background: var(--accent-primary);
}
```

---

## 5. Checklist de Verificación

### 5.1 Accesibilidad (WCAG 2.1 AA)

- [ ] **text-0** (`#2C2416`) sobre **bg-0** (`#F5F0E8`): ratio ≥ 4.5:1 → *13.5:1* ✅
- [ ] **text-1** (`#3D3426`) sobre **bg-0**: ratio ≥ 4.5:1 → *10.8:1* ✅
- [ ] **text-2** (`#5C5240`) sobre **bg-0**: ratio ≥ 4.5:1 → *6.8:1* ✅
- [ ] **text-3** (`#6B5F50`) sobre **bg-0**: ratio ≥ 4.5:1 → *5.5:1* ✅
- [ ] **accent-primary** (`#1E3A5F`) sobre **bg-0**: ratio ≥ 4.5:1 → *10.1:1* ✅
- [ ] **accent-alarm** (`#7A2535`) sobre **bg-0**: ratio ≥ 4.5:1 → *8.6:1* ✅
- [ ] **accent-secondary** (`#7A5C0E`) sobre **bg-0**: ratio ≥ 4.5:1 → *5.5:1* ✅
- [ ] Verificar con herramienta: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 5.2 Coherencia Visual

- [ ] Sin ningún tono azul frío (`#00bcd4`, cian, `hsl(190 100% …)`) visible en modo claro
- [ ] Sin blanco puro (`#ffffff`) como fondo de página (solo en `--forensic-bg-surface`)
- [ ] Las admonitions tienen cada tipo su acento propio (verde → note, mostaza → warning, burdeos → danger, tinta → info)
- [ ] La Navbar muestra glassmorphism cálido (sin borde azul)
- [ ] El sidebar activo usa tinta azul, no ámbar

### 5.3 Gráficas (Recharts / Plotly)

- [ ] Hook `useChartColors()` implementado y exportado
- [ ] Todos los componentes de gráficas importan el hook en lugar de usar colores hardcodeados
- [ ] Las líneas de frecuencia (peligro) usan `colors.danger` (`#7A2535`) en modo claro
- [ ] Los tooltips tienen fondo pergamino (`#FAF7F2`) con borde sutil en modo claro
- [ ] Los ejes usan JetBrains Mono con color `#6B5F50`
- [ ] El grid usa `rgba(44,36,22,0.08)` en lugar de blanco translúcido

### 5.4 Componentes React adicionales

- [ ] `IncidentBox` usa colores terracota/burdeos en modo claro
- [ ] `ToggleButton` ("Ver simulador") usa tinta azul + border cálido
- [ ] Cualquier componente con `style` inline verificado manualmente en DevTools en modo claro

### 5.5 Pruebas de Entorno

- [ ] Activar modo claro desde el toggle → no debe quedar ningún elemento con fondo frío o neón
- [ ] Inspeccionar con DevTools → Accessibility → Color Contrast en elementos clave
- [ ] Verificar en Lighthouse modo claro: score de Accesibilidad ≥ 95
- [ ] Probar con pantalla a plena luz solar (simular en DevTools → Emulate vision deficiencies)
- [ ] Revisar el modo claro en iOS Safari (webkit scrollbar rendering)
- [ ] Revisar que el modo oscuro sigue intacto tras el build (`npm run build`)

### 5.6 Archivos Modificados (lista para el agente)

```
src/css/custom.css                         → Bloque CSS completo (Sección 3)
src/hooks/useChartColors.js                → Nuevo archivo (Sección 4.1)
src/utils/plotlyTheme.js                   → Nuevo archivo (Sección 4.4)
src/components/IncidentBox/index.jsx       → Modificar estilos (Sección 4.2)
src/components/ToggleButton/index.jsx      → Modificar estilos (Sección 4.3)
src/components/*/styles.module.css         → Donde haya colores hardcodeados (Sección 4.5)
```

---

## Apéndice: Tabla de correspondencias Dark → Light

| Variable | Modo Oscuro (actual) | Modo Claro (nuevo) |
|---|---|---|
| `--bg-0` | `#0a1128` | `#F5F0E8` |
| `--bg-1` | `#0f1830` | `#EDE7D9` |
| `--bg-2` | `#162040` | `#E2DBCD` |
| `--bg-3` | `#1e2a50` | `#D6CEBC` |
| `--text-0` | `#ffffff` | `#2C2416` |
| `--text-1` | `#e8e8e8` | `#3D3426` |
| `--text-2` | `#b0b8cc` | `#5C5240` |
| `--text-3` | `#7888aa` | `#6B5F50` |
| Primario (botones) | `hsl(190 100% 60%)` cian | `#1E3A5F` tinta azul |
| Alarma | `#ffaa00` ámbar | `#7A2535` burdeos |
| Peligro | `#ef4444` rojo | `#7A2535` burdeos |
| Éxito | `#10b981` verde vivo | `#3B6B3E` verde bosque |
| Recharts línea 1 | `#06b6d4` | `#1E3A5F` |
| Recharts línea danger | `#ef4444` | `#7A2535` |
| Recharts línea success | `#10b981` | `#3B6B3E` |
| Tooltip bg | `#0f1830` | `#FAF7F2` |

---

*Plan generado para ejecución autónoma. Todos los ratios de contraste han sido calculados programáticamente con la fórmula WCAG 2.1 de luminancia relativa.*
