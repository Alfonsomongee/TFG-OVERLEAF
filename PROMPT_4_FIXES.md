# PROMPT PARA CLAUDE CODE — 4 FIXES VISUALES PRIORITARIOS

## CONTEXTO
Docusaurus v2.4.3 + React 17. Paleta forense oscura.
Lee cada archivo completo antes de editar. Build tras cada tarea.
Commits separados por tarea.

---

## TAREA 1 — StickyCollapse.jsx: fix DEFINITIVO del scroll

**Problema:** El sismógrafo sticky sigue tapando el párrafo siguiente
aunque se añadió `80vh` de margen. La causa real es que `position: sticky`
dentro de un flexbox con `align-items: flex-start` no respeta el flujo
del documento cuando el contenedor padre no tiene altura explícita.

**Archivo:** `src/components/StickyCollapse.jsx`

### Cambio 1 — Wrapper exterior de ScrollyMode

```jsx
// BUSCAR:
<div style={{ position: 'relative', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

// REEMPLAZAR POR:
<div style={{
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '42% 1fr',
  gap: '2rem',
  alignItems: 'start',
}}>
```

Cambiar de `flex` a `grid` resuelve el problema: en CSS Grid, `position: sticky`
respeta correctamente la altura del contenedor hermano (la columna de texto).

### Cambio 2 — Panel sticky del sismógrafo

```jsx
// BUSCAR el div con position: sticky:
<div style={{
  flex: 1,
  position: 'sticky',
  top: '80px',
  height: '65vh',
  zIndex: 10,
}}>

// REEMPLAZAR POR:
<div style={{
  position: 'sticky',
  top: '80px',
  height: 'fit-content',
  maxHeight: '70vh',
  zIndex: 10,
  alignSelf: 'start',
}}>
```

### Cambio 3 — Último Step: margen inferior correcto

```jsx
// BUSCAR:
margin: i === steps.length - 1 ? '45vh 0 0 0' : '45vh 0',

// REEMPLAZAR POR:
margin: i === steps.length - 1 ? '45vh 0 60vh 0' : '45vh 0',
```

### Cambio 4 — Altura interna del sismógrafo dentro del sticky

```jsx
// BUSCAR:
<div style={{
  height: 'calc(100% - 44px)',
  background: 'var(--ifm-background-surface-color)',
  borderRadius: 10,
  padding: '0.75rem',
  border: `1px solid ${color}40`,
  transition: 'border-color 0.3s ease',
}}>

// REEMPLAZAR POR:
<div style={{
  height: 'auto',
  maxHeight: 'calc(70vh - 60px)',
  overflow: 'hidden',
  background: 'var(--ifm-background-surface-color)',
  borderRadius: 10,
  padding: '0.75rem',
  border: `1px solid ${color}40`,
  transition: 'border-color 0.3s ease',
}}>
```

**Verificación:** Hacer scroll lento hasta el final del StickyCollapse en
`/analisis-incidente`. El sismógrafo debe desaparecer antes de que aparezca
el texto "En 11 segundos, la red peninsular se destruyó a sí misma...".

---

## TAREA 2 — TapLagSequence.jsx: rediseño tipográfico + velocidad ANSI 59

**Archivo:** `src/components/TapLagSequence.jsx`

### Cambio 2a — ViewBox y dimensiones del SVG

```jsx
// BUSCAR:
const W = 640, H = 340;

// REEMPLAZAR POR:
const W = 780, H = 460;
```

### Cambio 2b — Animación ANSI 59 a 0.35s y más visible

```jsx
// BUSCAR el bloque de animación ANSI 59:
<animate attributeName="opacity"
  values="0.9;0.4;0.9" dur="0.8s" repeatCount="indefinite" />

// REEMPLAZAR POR:
<animate attributeName="opacity"
  values="1;0.2;1" dur="0.35s" repeatCount="indefinite" />
```

También agrandar el rectángulo ANSI 59 para que sea más visible:
```jsx
// BUSCAR:
<rect x="220" y="196" width="70" height="18" rx="3"

// REEMPLAZAR POR:
<rect x="215" y="192" width="82" height="22" rx="4"
```

Y el texto del ANSI 59:
```jsx
// BUSCAR:
<text x="255" y="209" fill="#fff" fontSize="9"

// REEMPLAZAR POR:
<text x="256" y="207" fill="#fff" fontSize="11"
```

### Cambio 2c — Tipografía: aumentar TODOS los fontSize del SVG

Aplicar estas sustituciones globales en el archivo (busca y reemplaza todas
las ocurrencias dentro del componente DiagramSVG):

| Buscar | Reemplazar | Contexto |
|--------|------------|---------|
| `fontSize="7"` | `fontSize="10"` | Etiquetas menores |
| `fontSize="8"` | `fontSize="11"` | Etiquetas de gauge |
| `fontSize="9"` | `fontSize="12"` | Notas y labels |
| `fontSize="10"` | `fontSize="13"` | Títulos de sección |
| `fontSize="12"` | `fontSize="15"` | Valores p.u. |
| `fontSize="16"` | `fontSize="20"` | Texto de cascada |
| `fontSize="11"` | `fontSize="13"` | Texto secundario cascada |

### Cambio 2d — Redistribuir secciones con más espacio horizontal

Con W=780, mover la sección derecha +80px para evitar solapamiento:

```jsx
// BUSCAR todas las x de la sección derecha (RED 220kV):
// text x="320" → text x="400"
// rect x="320" y="35" → rect x="400" y="35"
// El loop de plantas FV:
const x = 325 + i * 58  →  const x = 405 + i * 62

// Brecha de observabilidad:
// rect x="215" y="55" width="290" → rect x="215" y="55" width="370"
// text x="360" (ZONA CIEGA) → text x="400"
// text x="360" (REE no observa) → text x="400"

// Gauge derecho — mover a la derecha:
// text x="590" → text x="714"
// rect x="612" → rect x="730"
// todas las referencias x="608"/x="612"/x="624" → x="726"/x="730"/x="744"

// Nota inferior — ampliar:
// rect x="60" y="295" width="530" height="36"
//   → rect x="20" y="375" width="740" height="48"
// text x="75" y="311" → text x="36" y="393"
// text x="75" y="325" → text x="36" y="413"
```

### Cambio 2e — Cascada visual (paso 5) más centrada y legible

```jsx
// BUSCAR:
<rect x="60" y="145" width="530" height="85" rx="4"
// REEMPLAZAR POR:
<rect x="30" y="140" width="720" height="110" rx="6"

// BUSCAR:
<text x="325" y="175" fill={C.critical} fontSize="16"
// REEMPLAZAR POR:
<text x="390" y="172" fill={C.critical} fontSize="20"

// BUSCAR:
<text x="325" y="195" fill={C.critical} fontSize="11"
// REEMPLAZAR POR:
<text x="390" y="196" fill={C.critical} fontSize="13"

// BUSCAR:
<text x="325" y="213" fill="#f87171" fontSize="10"
// REEMPLAZAR POR:
<text x="390" y="216" fill="#f87171" fontSize="12"
```

### Cambio 2f — Gauges de tensión más altos y visibles

```jsx
// BUSCAR:
const bar400H = Math.round(step.v400 * 80);
const bar220H = Math.round(step.v220 * 80);

// REEMPLAZAR POR:
const bar400H = Math.round(step.v400 * 110);
const bar220H = Math.round(step.v220 * 110);

// Ajustar la base de los gauges:
// Todas las referencias a "270 - Math.round(v * 80)"
//   → "300 - Math.round(v * 110)"
// "170 + 100 - bar400H" → "185 + 110 - bar400H"
// rect height="100" (gauges) → height="110"
```

---

## TAREA 3 — BlackoutPropagationMap: reescribir con PNG de España como fondo

**Eliminar completamente `@deck.gl`** del componente. Reemplazar con SVG puro
usando el PNG `iberian_satellite.png` ya disponible en `/static/img/`.

**Archivos a modificar:**
- `src/components/BlackoutPropagationMapBase.jsx` — REESCRIBIR COMPLETO
- `src/components/BlackoutPropagationMap.jsx` — solo verificar que el wrapper
  funciona (React.lazy del Base)

**Reemplaza el contenido de `BlackoutPropagationMapBase.jsx` con:**

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Proyección geográfica (lon/lat → píxeles en viewBox 800×560) ─────────────
function project(lon, lat) {
  const LON_MIN = -9.5, LON_MAX = 3.4;
  const LAT_MIN = 35.9, LAT_MAX = 43.9;
  const W = 800, H = 560;
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
  return [Math.round(x), Math.round(y)];
}

// ─── Subestaciones con coordenadas reales verificadas ─────────────────────────
const STATIONS = [
  {
    id: 'GRN', lon: -3.5985, lat: 37.1773,
    name: 'Caparacena (Granada)',
    type: 'origin',
    activationTime: 0,
    desc: 'DISPARO RAÍZ — 12:32:57 CEST\nTransformador 400/220 kV dispara por sobretensión\nen colector 220 kV (242 kV = 1,10 p.u.)\nPérdida: −355 MW, −165 MVAr\n(ENTSO-E Factual, p.28)',
  },
  {
    id: 'BAD', lon: -6.9706, lat: 38.8794,
    name: 'Guillena / Badajoz',
    type: 'lost',
    activationTime: 3,
    desc: '12:33:16 CEST (t=19s)\nOleas de choque reactiva\nCaída por colapso de tensión\n−730 MW desconectados',
  },
  {
    id: 'SEV', lon: -5.9844, lat: 37.3890,
    name: 'Alcores (Sevilla)',
    type: 'lost',
    activationTime: 4,
    desc: '12:33:17 CEST (t=20s)\nCascada sur: Sevilla + Huelva\n−550 MW desconectados',
  },
  {
    id: 'SEG', lon: -4.1184, lat: 40.9481,
    name: 'Segovia',
    type: 'lost',
    activationTime: 4,
    desc: '12:33:17 CEST (t=20s)\nCascada norte-centro\nProtecciones ANSI 59 activas',
  },
  {
    id: 'ALM', lon: -5.6961, lat: 39.8142,
    name: 'Almaraz (Nuclear)',
    type: 'stable',
    activationTime: 0,
    desc: 'Central nuclear — Inercia síncrona\n2 × 1.066 MW\nResistió hasta el colapso final',
  },
  {
    id: 'MAD', lon: -3.7037, lat: 40.4167,
    name: 'Madrid Sur / Morata',
    type: 'stable',
    activationTime: 0,
    desc: 'Nudo central\nFrecuencia cayó a 48,7 Hz\nÚltimo punto de contención',
  },
  {
    id: 'ZAR', lon: -0.8877, lat: 41.6497,
    name: 'Nudo Aragón',
    type: 'stable',
    activationTime: 0,
    desc: 'Puente transpirenaico\nIntentos de importación Francia',
  },
  {
    id: 'BAR', lon: 2.1734, lat: 41.3852,
    name: 'Rubí (Cataluña)',
    type: 'stable',
    activationTime: 0,
    desc: 'Resistencia este\nConexión AC + HVDC con Francia\nEstable hasta pérdida de sincronismo',
  },
  {
    id: 'LIS', lon: -9.1393, lat: 38.7222,
    name: 'Lisboa (REN)',
    type: 'portugal',
    activationTime: 5,
    desc: '12:33:10 CEST\nOscilaciones inter-área 0,21 Hz\nPortugal totalmente afectado',
  },
  {
    id: 'POR', lon: -8.6291, lat: 41.1579,
    name: 'Porto (REN)',
    type: 'portugal',
    activationTime: 0,
    desc: 'Red portuguesa\nSufrió el colapso completo\nBlack Start desde Castelo de Bode',
  },
  {
    id: 'FR', lon: 1.8845, lat: 42.6397,
    name: 'Francia (RTE/Baixas)',
    type: 'france',
    activationTime: 8,
    desc: '12:33:21 CEST — Pérdida sincronismo\nHVDC INELFE: 1.000 MW PMODE1\nLineas AC: pico 3.800 MW\n(ENTSO-E Factual, pp.12,108)',
  },
];

// ─── Arcos de propagación ─────────────────────────────────────────────────────
const ARCS = [
  { from: 'GRN', to: 'SEV', activationTime: 2, type: 'cascade', label: 'Sobretensión' },
  { from: 'GRN', to: 'BAD', activationTime: 2, type: 'cascade', label: 'Cascada' },
  { from: 'BAD', to: 'LIS', activationTime: 5, type: 'oscillation', label: '0,21 Hz' },
  { from: 'GRN', to: 'SEG', activationTime: 3, type: 'cascade', label: 'Cascada' },
  { from: 'MAD', to: 'ZAR', activationTime: 0, type: 'stable', label: '' },
  { from: 'ZAR', to: 'BAR', activationTime: 0, type: 'stable', label: '' },
  { from: 'ZAR', to: 'FR',  activationTime: 8, type: 'sync',   label: 'ANSI 78' },
  { from: 'BAR', to: 'FR',  activationTime: 8, type: 'sync',   label: 'HVDC' },
];

// ─── Log de eventos ───────────────────────────────────────────────────────────
const EVENTS = [
  { t: 0, msg: '12:32:57 CEST — DISPARO RAÍZ: Caparacena (Granada). Trafo 400/220 kV. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t: 2, msg: '12:33:00 CEST — Cascada: plantas FV Badajoz y Sevilla cruzan umbral ANSI 59 (>435 kV).' },
  { t: 3, msg: '12:33:05 CEST — Segovia y zona norte-centro afectadas. Tensión >440 kV en barras colectoras.' },
  { t: 5, msg: '12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). REN alerta.' },
  { t: 6, msg: '12:33:18 CEST — Frecuencia cae a 48,46 Hz. HVDC INELFE mantiene 1.000 MW PMODE1.' },
  { t: 8, msg: '12:33:21 CEST — PÉRDIDA DE SINCRONISMO. ANSI 78 abre enlaces AC transpirenaicos.' },
  { t: 10, msg: '12:33:24 CEST — CERO ELÉCTRICO SISTÉMICO. −15 GW en 30 segundos.' },
];

// ─── Colores por tipo de nodo ─────────────────────────────────────────────────
const NODE_COLORS = {
  origin:    { fill: '#ef4444', stroke: '#fca5a5', label: '#fca5a5' },
  lost:      { fill: '#f97316', stroke: '#fdba74', label: '#fdba74' },
  stable:    { fill: '#10b981', stroke: '#6ee7b7', label: '#6ee7b7' },
  portugal:  { fill: '#f59e0b', stroke: '#fcd34d', label: '#fcd34d' },
  france:    { fill: '#3b82f6', stroke: '#93c5fd', label: '#93c5fd' },
};

const ARC_COLORS = {
  cascade:     '#ef4444',
  oscillation: '#f59e0b',
  sync:        '#3b82f6',
  stable:      'rgba(0,217,255,0.2)',
};

function BlackoutMapContent({ lang = 'es' }) {
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 12;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 800);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Nodos con coordenadas proyectadas
  const nodes = useMemo(() => STATIONS.map(s => {
    const [x, y] = project(s.lon, s.lat);
    const isActive = simTime >= s.activationTime;
    const isCollapsing = (s.type === 'lost' || s.type === 'origin') && isActive;
    return { ...s, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() =>
    Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleEvents = EVENTS.filter(e => e.t <= simTime).reverse().slice(0, 4);

  // Porcentaje de generación perdida
  const gwLost = useMemo(() => {
    if (simTime >= 10) return 15.0;
    if (simTime >= 8)  return 12.0;
    if (simTime >= 6)  return 8.0;
    if (simTime >= 4)  return 3.5;
    if (simTime >= 2)  return 1.2;
    return 0;
  }, [simTime]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: '#050a14',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body, sans-serif)',
    }}>
      <svg
        viewBox="0 0 800 560"
        style={{ width: '100%', display: 'block' }}
        aria-label="Mapa de cascada de desconexiones IBR durante el 28-A"
      >
        <defs>
          <filter id="bp-glow-red">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="bp-glow-cyan">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="bp-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0a1628"/>
            <stop offset="100%" stopColor="#050a14"/>
          </radialGradient>
          <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(0,217,255,0.04)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Fondo */}
        <rect width="800" height="560" fill="url(#bp-bg)"/>
        <rect width="800" height="560" fill="url(#bp-grid)"/>

        {/* PNG de España como fondo geográfico */}
        <image
          href="/img/iberian_satellite.png"
          x="0" y="0" width="800" height="560"
          preserveAspectRatio="xMidYMid meet"
          opacity={simTime >= 8 ? 0.15 : 0.28}
          style={{ transition: 'opacity 1s ease' }}
        />

        {/* Overlay oscuro para contraste */}
        <rect width="800" height="560"
              fill="rgba(5,10,20,0.55)"/>

        {/* Etiquetas geográficas */}
        <text x="30" y="265" fill="rgba(0,217,255,0.18)" fontSize="9"
              fontFamily="var(--font-mono,monospace)"
              transform="rotate(-90,30,265)" letterSpacing="2">
          OCÉANO ATLÁNTICO
        </text>
        <text x="570" y="420" fill="rgba(0,217,255,0.18)" fontSize="9"
              fontFamily="var(--font-mono,monospace)" letterSpacing="2"
              transform="rotate(-5,570,420)">
          MAR MEDITERRÁNEO
        </text>
        <text x="620" y="22" fill="rgba(59,130,246,0.45)" fontSize="10"
              fontFamily="var(--font-mono,monospace)" letterSpacing="3">
          FRANCE
        </text>
        <text x="35" y="395" fill="rgba(96,165,250,0.4)" fontSize="9"
              fontFamily="var(--font-mono,monospace)" letterSpacing="2">
          PORTUGAL
        </text>

        {/* ── ARCOS ── */}
        {ARCS.map((arc, i) => {
          const src = nodeMap[arc.from];
          const tgt = nodeMap[arc.to];
          if (!src || !tgt) return null;
          const isActive = simTime >= arc.activationTime;
          if (!isActive && arc.type === 'stable') return null;

          const color = ARC_COLORS[arc.type] || 'rgba(0,217,255,0.2)';
          const mx = (src.x + tgt.x) / 2;
          const my = (src.y + tgt.y) / 2 - 30;

          return (
            <g key={i}>
              <path
                d={`M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`}
                fill="none"
                stroke={isActive ? color : 'rgba(0,217,255,0.06)'}
                strokeWidth={arc.type === 'stable' ? 1 : (isActive ? 2.5 : 1)}
                strokeDasharray={arc.type === 'stable' ? '4 3' : 'none'}
                opacity={isActive ? 1 : 0.3}
              />
              {arc.label && isActive && (
                <text x={mx} y={my - 5}
                      fill={color} fontSize="9"
                      fontFamily="var(--font-mono,monospace)"
                      textAnchor="middle" opacity="0.9">
                  {arc.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── NODOS ── */}
        {nodes.map(node => {
          const colors = NODE_COLORS[node.type] || NODE_COLORS.stable;
          const isHovered = hoveredNode === node.id;
          const r = node.type === 'france' ? 13 : node.type === 'origin' ? 14 : 10;

          return (
            <g key={node.id}
               style={{ cursor: 'pointer' }}
               onMouseEnter={() => setHoveredNode(node.id)}
               onMouseLeave={() => setHoveredNode(null)}>

              {/* Pulso para nodos activos críticos */}
              {node.isCollapsing && (
                <circle cx={node.x} cy={node.y} r={r}>
                  <animate attributeName="r"
                           values={`${r};${r+12};${r}`}
                           dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity"
                           values="0.6;0;0.6"
                           dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="fill"
                           values={colors.stroke}/>
                </circle>
              )}

              {/* Nodo */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={node.isActive ? colors.fill : 'rgba(15,30,55,0.8)'}
                stroke={node.isActive ? colors.stroke : 'rgba(0,217,255,0.1)'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={node.isCollapsing ? 'url(#bp-glow-red)' : 'none'}
              />

              {/* Signo de exclamación en nodos en colapso */}
              {node.isCollapsing && (
                <text x={node.x} y={node.y + 4}
                      textAnchor="middle" fontSize="10"
                      fill="#fff" fontWeight="900">!</text>
              )}

              {/* Etiqueta */}
              <text
                x={node.x} y={node.y + r + 13}
                textAnchor="middle" fontSize="9.5"
                fontFamily="var(--font-mono,monospace)"
                fill={node.isActive ? colors.label : '#374151'}
                fontWeight="600"
              >
                {node.name.split('\n')[0]}
              </text>
            </g>
          );
        })}

        {/* ── TOOLTIP ── */}
        {hoveredNode && (() => {
          const node = nodeMap[hoveredNode];
          if (!node) return null;
          const lines = node.desc.split('\n');
          const tw = 200;
          let tx = node.x + 18;
          if (tx + tw > 780) tx = node.x - tw - 18;
          let ty = node.y - 20;
          if (ty < 10) ty = 10;

          return (
            <g>
              <rect x={tx-6} y={ty-14}
                    width={tw+12} height={lines.length*14+18}
                    rx="4"
                    fill="rgba(5,10,20,0.96)"
                    stroke="rgba(0,217,255,0.3)" strokeWidth="1"/>
              {lines.map((line, li) => (
                <text key={li} x={tx} y={ty + li*14}
                      fontSize={li===0 ? 10 : 9}
                      fill={li===0 ? '#00d9ff' : '#94a3b8'}
                      fontFamily="var(--font-mono,monospace)"
                      fontWeight={li===0 ? '700' : '400'}>
                  {line}
                </text>
              ))}
            </g>
          );
        })()}

        {/* ── OVERLAY COLAPSO TOTAL (paso final) ── */}
        {simTime >= 10 && (
          <g>
            <rect width="800" height="560" fill="rgba(239,68,68,0.06)"/>
            <text x="400" y="290" textAnchor="middle"
                  fontSize="22" fontFamily="var(--font-mono,monospace)"
                  fontWeight="900" fill="#ef4444"
                  filter="url(#bp-glow-red)" opacity="0.85">
              CERO ELÉCTRICO SISTÉMICO
            </text>
            <text x="400" y="315" textAnchor="middle"
                  fontSize="12" fontFamily="var(--font-mono,monospace)"
                  fill="#fca5a5" opacity="0.7">
              12:33:24 CEST · −15 GW · 60 millones de personas
            </text>
          </g>
        )}
      </svg>

      {/* ── PANEL DE CONTROL ── */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(5,10,20,0.93)',
        border: '1px solid rgba(0,217,255,0.2)',
        borderRadius: 8, padding: '12px 14px', width: 260,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header + play */}
        <div style={{ display:'flex', alignItems:'center',
                      justifyContent:'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono,monospace)', fontSize: 10,
            letterSpacing: '0.1em', color: '#ef4444', fontWeight: 700,
          }}>
            CASCADA IBR 28-A
          </span>
          <button onClick={handlePlayPause} style={{
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(0,217,255,0.12)',
            border: `1px solid ${isPlaying ? '#ef4444' : '#00d9ff'}`,
            color: isPlaying ? '#ef4444' : '#00d9ff',
            padding: '3px 10px', borderRadius: 4,
            cursor: 'pointer', fontSize: 11,
            fontFamily: 'var(--font-mono,monospace)', fontWeight: 700,
          }}>
            {simTime >= MAX_TIME ? '↺' : (isPlaying ? '⏸' : '▶')}
          </button>
        </div>

        {/* Barra temporal */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display:'flex', justifyContent:'space-between',
                        fontSize: 9, color: '#374151',
                        fontFamily: 'var(--font-mono,monospace)', marginBottom: 3 }}>
            <span>12:32:57</span><span>12:33:27 CEST</span>
          </div>
          <div style={{ height:3, background:'rgba(239,68,68,0.1)',
                        borderRadius:2, overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:2,
              width: `${(simTime/MAX_TIME)*100}%`,
              background: 'linear-gradient(90deg,#f59e0b,#ef4444)',
              transition: 'width 0.8s ease',
            }}/>
          </div>
        </div>

        {/* Contador GW perdidos */}
        <div style={{
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 6, padding: '6px 10px',
          marginBottom: 10, textAlign: 'center',
        }}>
          <div style={{
            fontSize: 26, fontWeight: 700, lineHeight: 1,
            color: gwLost >= 10 ? '#ef4444' : gwLost >= 5 ? '#f97316' : '#f59e0b',
            fontFamily: 'var(--font-mono,monospace)',
            transition: 'color 0.3s ease',
          }}>
            {gwLost.toFixed(1)}
            <span style={{ fontSize: '0.6rem', color: '#4b5563', marginLeft: 4 }}>GW perdidos</span>
          </div>
        </div>

        {/* Leyenda */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
                      gap:'3px 8px', marginBottom:8, fontSize:9,
                      fontFamily:'var(--font-mono,monospace)' }}>
          {[
            { color:'#ef4444', label:'Origen colapso' },
            { color:'#f97316', label:'Nodo perdido' },
            { color:'#10b981', label:'Nodo estable' },
            { color:'#3b82f6', label:'Francia (RTE)' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%',
                            background:color, flexShrink:0 }}/>
              <span style={{ color:'#6b7280' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Log de eventos */}
        <div style={{ borderTop:'1px solid rgba(0,217,255,0.1)',
                      paddingTop:8, maxHeight:150, overflowY:'auto' }}>
          {visibleEvents.length === 0 ? (
            <p style={{ color:'#374151', fontSize:9,
                        fontFamily:'var(--font-mono,monospace)', margin:0 }}>
              Pulsa ▶ para iniciar la simulación
            </p>
          ) : visibleEvents.map((ev, i) => (
            <div key={i} style={{
              fontSize:9.5, fontFamily:'var(--font-mono,monospace)',
              color: i===0 ? '#e2e8f0' : '#374151',
              borderLeft: `2px solid ${i===0 ? '#ef4444' : 'transparent'}`,
              paddingLeft:5, marginBottom:5,
              transition:'all 0.3s ease',
            }}>
              {ev.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlackoutPropagationMapBase({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background:'#050a14', borderRadius:12,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'#ef4444', fontFamily:'monospace', fontSize:12,
      }}>
        Cargando mapa de cascada IBR…
      </div>
    }>
      {() => <BlackoutMapContent lang={lang}/>}
    </BrowserOnly>
  );
}
```

**Después de reescribir**, verificar que `BlackoutPropagationMap.jsx` (el wrapper)
sigue apuntando a `BlackoutPropagationMapBase`:
```jsx
// Debe tener algo así:
const BlackoutPropagationMapBase = React.lazy(() =>
  import('./BlackoutPropagationMapBase')
);
```
Si no existe este wrapper o apunta directamente, no tocar — el componente
funciona igual sin el lazy wrapper.

---

## TAREA 4 — Colores modo claro: migrar hardcoded críticos a variables CSS

**Problema:** Los textos con colores hardcoded como `#e2e8f0`, `#94a3b8`,
`#64748b` son invisibles en modo claro porque son grises claros sobre fondo claro.

**Archivos a modificar:**
- `src/components/StickyCollapse.jsx`
- `src/components/TapLagSequence.jsx`
- `src/components/CollapseSismograph.jsx`

### Sustituciones globales — aplicar en los 3 archivos:

| Color hardcoded | Variable CSS | Contexto |
|-----------------|--------------|---------|
| `'#e2e8f0'` | `'var(--ifm-font-color-base)'` | Texto principal |
| `'#94a3b8'` | `'var(--ifm-color-emphasis-600)'` | Texto secundario |
| `'#64748b'` | `'var(--ifm-color-emphasis-500)'` | Texto terciario |
| `'#475569'` | `'var(--ifm-color-emphasis-400)'` | Texto muy tenue |
| `'#334155'` | `'var(--ifm-color-emphasis-300)'` | Bordes oscuros |
| `'#1e293b'` | `'var(--ifm-background-surface-color)'` | Fondos de card |
| `'var(--ifm-background-surface-color)'` | sin cambio | Ya usa variable |

**Los colores de DATOS (rojo, cian, ámbar, verde) NO cambiar** — son
semánticos y deben mantenerse iguales en ambos modos porque representan
estados técnicos (colapso, normal, alerta).

En `StickyCollapse.jsx`, cambiar también el fondo de los Step cards:
```jsx
// BUSCAR:
background: 'var(--ifm-background-surface-color)',

// Ya es correcto — verificar que existe. Si es un color hardcoded, cambiarlo.
```

---

## VERIFICACIÓN

```bash
npm run build -- --locale es
```

Verificación visual en AMBOS modos (claro y oscuro):
1. Activar modo claro en el toggle del navbar
2. Ir a `/analisis-incidente`
3. Verificar:
   - StickyCollapse no tapa el texto siguiente al final del scroll
   - TapLag: textos legibles, ANSI 59 parpadea rápido, paso 5 sin cortes
   - BlackoutPropagationMap: muestra imagen satelital de España de fondo
   - En modo claro: textos del StickyCollapse y TapLag legibles

## COMMITS

```bash
git add src/components/StickyCollapse.jsx
git commit -m "fix(sticky): grid layout + fit-content height prevents content overlap"

git add src/components/TapLagSequence.jsx
git commit -m "fix(taplag): larger viewBox, bigger fonts, ANSI 59 at 0.35s"

git add src/components/BlackoutPropagationMapBase.jsx
git commit -m "feat(blackout-map): replace deck.gl with SVG + iberian_satellite.png"

git add src/components/StickyCollapse.jsx src/components/TapLagSequence.jsx src/components/CollapseSismograph.jsx
git commit -m "fix(colors): replace hardcoded greys with CSS variables for light mode"

git push origin main
```
