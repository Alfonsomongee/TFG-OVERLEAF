# PROMPT PARA CLAUDE CODE — MAPAS GEOGRÁFICOS + SISMÓGRAFO V2

## CONTEXTO
Docusaurus v2.4.3 + React 17. Paleta forense: fondo `#050a14`, cian `#00d9ff`,
ámbar `#ffaa00`, rojo `#ef4444`. JetBrains Mono para datos numéricos.

Vas a reescribir tres componentes. Lee cada archivo completo antes de tocar nada.
Build tras cada componente: `npm run build -- --locale es`.

---

## TAREA 1 — IberianGridTopologyBase.jsx
### Reemplazar react-force-graph-2d por SVG geográfico real

**Archivo:** `src/components/IberianGridTopologyBase.jsx`

El componente actual usa `react-force-graph-2d` (D3 + Three.js, ~1.2MB) para
mostrar nodos flotantes sobre fondo negro. Hay que reemplazarlo por un SVG puro
con el contorno real de la Península Ibérica como fondo geográfico.

**NO elimines** la librería `react-force-graph-2d` del `package.json` — puede
usarse en otros componentes. Solo deja de importarla en este archivo.

### Implementación exacta

Reemplaza el contenido completo de `IberianGridTopologyBase.jsx` con este componente:

```jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Proyección geográfica simplificada ──────────────────────────────────────
// Convierte coordenadas lon/lat reales a píxeles en un viewBox 800×560
// Bounds ibéricos: lon [-9.5, 3.4], lat [35.9, 43.9]
function project(lon, lat) {
  const LON_MIN = -9.5, LON_MAX = 3.4;
  const LAT_MIN = 35.9, LAT_MAX = 43.9;
  const W = 800, H = 560;
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
  return [Math.round(x), Math.round(y)];
}

// ─── Contorno simplificado de la Península Ibérica (SVG path) ─────────────────
// Path derivado de coordenadas geográficas reales, proyectadas al viewBox 800×560
const IBERIAN_PATH = `
  M 95,10 L 155,5 L 220,8 L 290,15 L 360,12 L 430,8 L 490,15 L 550,25
  L 610,18 L 660,30 L 700,55 L 730,85 L 750,120 L 760,160 L 755,200
  L 750,240 L 760,275 L 755,310 L 740,340 L 720,365 L 695,385 L 660,400
  L 625,415 L 590,430 L 550,445 L 510,455 L 470,460 L 430,465 L 390,460
  L 350,450 L 310,445 L 270,455 L 235,465 L 195,460 L 155,445 L 115,425
  L 80,400 L 55,370 L 35,340 L 20,305 L 10,270 L 8,230 L 12,190
  L 20,155 L 30,120 L 45,90 L 65,65 L 95,10 Z
`;

// Portugal aproximado (parte oeste)
const PORTUGAL_PATH = `
  M 95,10 L 65,65 L 45,90 L 30,120 L 20,155 L 12,190 L 8,230
  L 10,270 L 20,305 L 35,340 L 55,370 L 80,400 L 115,425
  L 130,415 L 140,390 L 135,350 L 140,310 L 145,270 L 140,230
  L 145,190 L 150,150 L 145,110 L 130,75 L 110,40 L 95,10 Z
`;

// ─── Nodos con coordenadas reales verificadas ────────────────────────────────
const NODES_ES = [
  {
    id: 'GRN', lon: -3.60, lat: 37.25,
    name: 'Granada\n(Caparacena)',
    desc: 'DISPARO RAÍZ\n−355 MW · −165 MVAr\n(ENTSO-E p.28)',
    activationTime: 0, group: 'collapse',
  },
  {
    id: 'SEV', lon: -5.95, lat: 37.40,
    name: 'Sevilla\n(Alcores)',
    desc: 'Efecto dominó sur\nSobrecarga masiva',
    activationTime: 3, group: 'collapse',
  },
  {
    id: 'BAD', lon: -6.97, lat: 38.88,
    name: 'Badajoz\n(Guillena)',
    desc: 'Colapso de tensión\nNúñez de Balboa',
    activationTime: 5, group: 'collapse',
  },
  {
    id: 'MAD', lon: -3.70, lat: 40.42,
    name: 'Madrid\n(Morata)',
    desc: 'Contención central\nÚltima resistencia',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'ALM', lon: -5.87, lat: 39.75,
    name: 'Almaraz\n(Nuclear)',
    desc: 'Inercia base\n2 × 1.066 MW',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'ZAR', lon: -0.88, lat: 41.65,
    name: 'Aragón\n(Puente)',
    desc: 'Corredor norte\nPuente transpirenaico',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'BAR', lon: 2.02, lat: 41.47,
    name: 'Cataluña\n(Rubí)',
    desc: 'Resistencia este\nConexión AC Francia',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'LIS', lon: -9.14, lat: 38.72,
    name: 'Lisboa\n(Rele)',
    desc: 'Desequilibrio\nOscilaciones 0.21 Hz',
    activationTime: 6, group: 'portugal',
  },
  {
    id: 'POR', lon: -8.61, lat: 41.15,
    name: 'Porto\n(Norte)',
    desc: 'Compensación\nCorrector de tensión',
    activationTime: 0, group: 'portugal',
  },
  {
    id: 'FR', lon: 2.81, lat: 42.72,
    name: 'Francia\n(Baixas)',
    desc: 'Rescate externo\nInterconexión AC + HVDC',
    activationTime: 10, group: 'france',
  },
];

// ─── Links con coordenadas derivadas de los nodos ────────────────────────────
const LINKS = [
  { source: 'GRN', target: 'SEV', isCritical: true,  activationTime: 2,  label: 'Sobrecarga' },
  { source: 'SEV', target: 'BAD', isCritical: true,  activationTime: 4,  label: 'Cascada' },
  { source: 'BAD', target: 'LIS', isCritical: true,  activationTime: 6,  label: '0.8 Hz' },
  { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0,  label: '' },
  { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ZAR', target: 'FR',  isCritical: true,  activationTime: 10, label: 'HVDC' },
  { source: 'BAR', target: 'FR',  isCritical: true,  activationTime: 10, label: 'AC' },
];

// ─── Log de eventos ───────────────────────────────────────────────────────────
const EVENT_LOG = [
  { t: 0,  msg: '12:32:57 — Sistema operativo. Penetración renovable ≈82%. H_eq ≈ 2,4 s.' },
  { t: 2,  msg: '12:32:57 — DISPARO RAÍZ: Trafo 400/220 kV Granada. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t: 4,  msg: '12:33:00-10 — Tensión >440 kV. Protecciones ANSI 59 disparan plantas FV en cascada.' },
  { t: 6,  msg: '12:33:10 — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). Isla ibérica se debilita.' },
  { t: 8,  msg: '12:33:18 — Frecuencia cae a 48,46 Hz. HVDC INELFE exporta 1.000 MW (PMODE1).' },
  { t: 10, msg: '12:33:21 — PÉRDIDA DE SINCRONISMO. Apertura enlaces AC transpirenaicos (ANSI 78).' },
  { t: 12, msg: '12:33:24 — CERO DE TENSIÓN SISTÉMICO. 15 GW perdidos en 30 segundos.' },
];

// ─── Colores por grupo ────────────────────────────────────────────────────────
const GROUP_COLORS = {
  collapse:  { fill: '#ef4444', stroke: '#fca5a5', pulse: true },
  stable:    { fill: '#10b981', stroke: '#6ee7b7', pulse: false },
  portugal:  { fill: '#f59e0b', stroke: '#fcd34d', pulse: false },
  france:    { fill: '#3b82f6', stroke: '#93c5fd', pulse: false },
};

// ─── Componente principal ─────────────────────────────────────────────────────
function TopologyContent({ lang = 'es' }) {
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 14;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 900);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Nodos con coordenadas proyectadas precalculadas
  const nodes = useMemo(() => NODES_ES.map(n => {
    const [x, y] = project(n.lon, n.lat);
    const isActive = simTime >= n.activationTime;
    const isCollapsing = n.group === 'collapse' && isActive;
    return { ...n, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime || e.t <= simTime).reverse().slice(0, 4);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'var(--bg-0, #050a14)',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body, sans-serif)',
    }}>

      {/* ── SVG MAPA ─────────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 800 560"
        style={{ width: '100%', display: 'block' }}
        aria-label="Mapa topológico de la red ibérica durante el colapso del 28-A"
      >
        <defs>
          {/* Gradiente de fondo tipo "pantalla de radar" */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#0a1628" />
            <stop offset="100%" stopColor="#050a14" />
          </radialGradient>

          {/* Grid de referencia */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,217,255,0.04)" strokeWidth="0.5"/>
          </pattern>

          {/* Filtro glow para nodos activos */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Filtro glow rojo intenso para colapso */}
          <filter id="glowRed">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fondo */}
        <rect width="800" height="560" fill="url(#bgGrad)" />
        <rect width="800" height="560" fill="url(#grid)" />

        {/* Mar — tono ligeramente distinto al fondo */}
        <rect width="800" height="560" fill="rgba(0,40,80,0.15)" />

        {/* Contorno de Portugal (color diferente) */}
        <path
          d={PORTUGAL_PATH}
          fill="rgba(15,30,60,0.6)"
          stroke="rgba(0,217,255,0.12)"
          strokeWidth="1"
        />

        {/* Contorno Península Ibérica */}
        <path
          d={IBERIAN_PATH}
          fill="rgba(10,22,45,0.75)"
          stroke="rgba(0,217,255,0.25)"
          strokeWidth="1.5"
        />

        {/* Etiqueta "FRANCE" */}
        <text x="620" y="25" fill="rgba(59,130,246,0.5)" fontSize="11"
              fontFamily="var(--font-mono, monospace)" letterSpacing="3">
          FRANCE
        </text>

        {/* Etiqueta "MAR MEDITERRÁNEO" */}
        <text x="560" y="420" fill="rgba(0,217,255,0.2)" fontSize="10"
              fontFamily="var(--font-mono, monospace)" letterSpacing="2"
              transform="rotate(-5, 560, 420)">
          MAR MEDITERRÁNEO
        </text>

        {/* Etiqueta "OCÉANO ATLÁNTICO" */}
        <text x="20" y="280" fill="rgba(0,217,255,0.2)" fontSize="10"
              fontFamily="var(--font-mono, monospace)" letterSpacing="1"
              transform="rotate(-90, 20, 280)">
          OCÉANO ATLÁNTICO
        </text>

        {/* ── LINKS ─────────────────────────────────────────────────── */}
        {LINKS.map((link, i) => {
          const src = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          if (!src || !tgt) return null;

          const isActive = simTime >= link.activationTime;
          const isCollapsing = link.isCritical && isActive && simTime < 12;
          const isLost = link.isCritical && simTime >= 10 && link.target === 'FR';

          let stroke = 'rgba(0,217,255,0.08)';
          let strokeWidth = 1;
          let dashArray = '4 4';

          if (isActive && !isLost) {
            stroke = link.isCritical
              ? (isCollapsing ? '#ef4444' : 'rgba(0,217,255,0.35)')
              : 'rgba(0,217,255,0.25)';
            strokeWidth = link.isCritical ? 2.5 : 1.5;
            dashArray = link.isCritical ? 'none' : '4 3';
          }

          // Flecha de dirección
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const len = Math.sqrt(dx*dx + dy*dy);
          const mx = src.x + dx * 0.5;
          const my = src.y + dy * 0.5;

          return (
            <g key={i}>
              <line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                opacity={isLost ? 0.15 : 1}
              />
              {/* Label de la línea si tiene */}
              {link.label && isActive && (
                <text
                  x={mx} y={my - 6}
                  fill={link.isCritical ? '#f59e0b' : 'rgba(0,217,255,0.5)'}
                  fontSize="9"
                  fontFamily="var(--font-mono, monospace)"
                  textAnchor="middle"
                >
                  {link.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── NODOS ─────────────────────────────────────────────────── */}
        {nodes.map(node => {
          const colors = GROUP_COLORS[node.group] || GROUP_COLORS.stable;
          const isHovered = hoveredNode === node.id;
          const r = node.group === 'france' ? 14 : (node.group === 'collapse' && node.isActive ? 13 : 10);

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Halo pulsante para nodos en colapso */}
              {node.isCollapsing && (
                <circle
                  cx={node.x} cy={node.y} r={r + 8}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="1"
                  opacity="0.4"
                >
                  <animate attributeName="r" values={`${r+4};${r+14};${r+4}`}
                           dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5"
                           dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Nodo principal */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={node.isActive ? colors.fill : 'rgba(15,30,55,0.9)'}
                stroke={node.isActive ? colors.stroke : 'rgba(0,217,255,0.15)'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={node.isCollapsing ? 'url(#glowRed)' : (node.isActive ? 'url(#glow)' : 'none')}
              />

              {/* Icono de advertencia para nodos en colapso */}
              {node.isCollapsing && (
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle" fontSize="10"
                  fill="#fff" fontWeight="bold"
                >
                  !</text>
              )}

              {/* Etiqueta del nodo */}
              {node.name.split('\n').map((line, li) => (
                <text
                  key={li}
                  x={node.x}
                  y={node.y + r + 13 + li * 12}
                  textAnchor="middle"
                  fontSize={li === 0 ? 10 : 8.5}
                  fontFamily="var(--font-mono, monospace)"
                  fill={node.isActive ? '#e2e8f0' : '#475569'}
                  fontWeight={li === 0 ? '600' : '400'}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── TOOLTIP DE NODO ───────────────────────────────────────── */}
        {hoveredNode && (() => {
          const node = nodeMap[hoveredNode];
          if (!node) return null;
          const lines = node.desc.split('\n');
          const tw = 160;
          // Ajuste para no salir del viewBox
          let tx = node.x + 18;
          if (tx + tw > 790) tx = node.x - tw - 18;
          let ty = node.y - 20;

          return (
            <g>
              <rect
                x={tx - 6} y={ty - 14}
                width={tw + 12}
                height={lines.length * 15 + 18}
                rx="4"
                fill="rgba(5,10,20,0.95)"
                stroke="rgba(0,217,255,0.3)"
                strokeWidth="1"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={tx} y={ty + li * 15}
                  fontSize={li === 0 ? 10 : 9}
                  fill={li === 0 ? '#00d9ff' : '#94a3b8'}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={li === 0 ? '700' : '400'}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>

      {/* ── PANEL DE CONTROL ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(5,10,20,0.92)',
        border: '1px solid rgba(0,217,255,0.2)',
        borderRadius: 8,
        padding: '12px 14px',
        width: 260,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11, letterSpacing: '0.1em',
            color: '#00d9ff', fontWeight: 700,
          }}>
            TOPOLOGÍA RED IBÉRICA
          </span>
          <button
            onClick={handlePlayPause}
            style={{
              background: simTime >= MAX_TIME ? '#10b981' :
                          (isPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(0,217,255,0.15)'),
              border: `1px solid ${simTime >= MAX_TIME ? '#10b981' :
                       (isPlaying ? '#ef4444' : '#00d9ff')}`,
              color: simTime >= MAX_TIME ? '#fff' :
                     (isPlaying ? '#ef4444' : '#00d9ff'),
              padding: '4px 12px', borderRadius: 4,
              cursor: 'pointer', fontSize: 11,
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700, letterSpacing: '0.05em',
            }}
          >
            {simTime >= MAX_TIME ? '↺ REPLAY' : (isPlaying ? '⏸ PAUSA' : '▶ PLAY')}
          </button>
        </div>

        {/* Barra de progreso temporal */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, color: '#475569',
            fontFamily: 'var(--font-mono, monospace)', marginBottom: 4,
          }}>
            <span>12:32:57</span>
            <span>12:33:27 CEST</span>
          </div>
          <div style={{
            height: 4, background: 'rgba(0,217,255,0.1)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(simTime / MAX_TIME) * 100}%`,
              background: simTime >= 10
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : 'linear-gradient(90deg, #00d9ff, #10b981)',
              borderRadius: 2,
              transition: 'width 0.9s ease, background 0.3s ease',
            }} />
          </div>
        </div>

        {/* Leyenda */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4px 8px', marginBottom: 10, fontSize: 9,
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {[
            { color: '#ef4444', label: 'Nodo en colapso' },
            { color: '#10b981', label: 'Nodo estable' },
            { color: '#f59e0b', label: 'Portugal' },
            { color: '#3b82f6', label: 'Francia' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                            background: color, flexShrink: 0 }} />
              <span style={{ color: '#94a3b8' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Log de eventos */}
        <div style={{
          borderTop: '1px solid rgba(0,217,255,0.1)',
          paddingTop: 8, maxHeight: 150, overflowY: 'auto',
        }}>
          {visibleLogs.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 9,
                        fontFamily: 'var(--font-mono, monospace)', margin: 0 }}>
              Pulsa PLAY para iniciar la simulación
            </p>
          ) : (
            visibleLogs.map((log, i) => (
              <div key={i} style={{
                fontSize: 9.5,
                fontFamily: 'var(--font-mono, monospace)',
                color: i === 0 ? '#e2e8f0' : '#475569',
                borderLeft: `2px solid ${i === 0 ? '#00d9ff' : 'transparent'}`,
                paddingLeft: 6, marginBottom: 6,
                transition: 'all 0.3s ease',
              }}>
                {log.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function IberianGridTopology({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: '#050a14', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#00d9ff', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando topología de red ibérica…
      </div>
    }>
      {() => <TopologyContent lang={lang} />}
    </BrowserOnly>
  );
}
```

**Verifica** que `IberianGridTopologyBase.jsx` e `IberianGridTopology.jsx` son el mismo
archivo o uno importa al otro. Si el MDX importa `IberianGridTopology`, asegúrate
de que ese archivo re-exporta el componente correctamente.

---

## TAREA 2 — AnimatedRestorationMap.jsx
### Reemplazar react-force-graph-2d por SVG geográfico real con 7 islas

**Archivo:** `src/components/AnimatedRestorationMap.jsx`

Mismo principio: reemplaza el ForceGraph2D por SVG puro con geografía real.
Las 7 islas son polígonos SVG coloreados sobre el contorno ibérico.

Reemplaza el contenido completo con:

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Proyección (misma que IberianGridTopology) ───────────────────────────────
function project(lon, lat) {
  const LON_MIN = -9.5, LON_MAX = 3.4;
  const LAT_MIN = 35.9, LAT_MAX = 43.9;
  const W = 800, H = 520;
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
  return [Math.round(x), Math.round(y)];
}

// ─── Contorno ibérico (mismo path que IberianGridTopology) ────────────────────
const IBERIAN_PATH = `
  M 95,10 L 155,5 L 220,8 L 290,15 L 360,12 L 430,8 L 490,15 L 550,25
  L 610,18 L 660,30 L 700,55 L 730,85 L 750,120 L 760,160 L 755,200
  L 750,240 L 760,275 L 755,310 L 740,340 L 720,365 L 695,385 L 660,400
  L 625,415 L 590,430 L 550,445 L 510,455 L 470,460 L 430,465 L 390,460
  L 350,450 L 310,445 L 270,455 L 235,465 L 195,460 L 155,445 L 115,425
  L 80,400 L 55,370 L 35,340 L 20,305 L 10,270 L 8,230 L 12,190
  L 20,155 L 30,120 L 45,90 L 65,65 L 95,10 Z
`;

// ─── Las 7 islas eléctricas como polígonos aproximados ───────────────────────
// Cada isla es un conjunto de puntos [lon, lat] que definen su contorno
const ISLANDS = [
  {
    id: 'SUR',
    name: 'Sur\n(Andalucía)',
    color: '#f59e0b',
    restoreTime: 5,
    blackStartTime: 5,
    blackStartType: 'bottom-up',
    anchor: { lon: -4.5, lat: 37.5 },
    restorePercent: 18,
    points: [[-9.5,36.0],[-5.5,35.9],[-1.8,36.8],[-1.5,38.5],[-3.0,39.5],[-5.5,39.0],[-7.5,38.5],[-9.5,37.5]],
  },
  {
    id: 'CEN',
    name: 'Centro\n(Madrid)',
    color: '#00d9ff',
    restoreTime: 6,
    blackStartType: 'top-down',
    anchor: { lon: -3.5, lat: 40.4 },
    restorePercent: 22,
    points: [[-5.5,39.0],[-3.0,39.5],[-1.5,38.5],[0.5,39.0],[1.0,41.0],[-0.5,42.0],[-2.5,42.5],[-5.0,42.0],[-6.0,41.0],[-5.5,39.0]],
  },
  {
    id: 'LEV',
    name: 'Levante\n(Valencia)',
    color: '#10b981',
    restoreTime: 7,
    blackStartType: 'bottom-up',
    anchor: { lon: 0.0, lat: 39.5 },
    restorePercent: 12,
    points: [[-1.5,38.5],[0.8,37.5],[3.4,39.5],[2.5,41.5],[1.0,41.0],[0.5,39.0],[-1.5,38.5]],
  },
  {
    id: 'CAT',
    name: 'Cataluña\n(NE)',
    color: '#a78bfa',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: 1.8, lat: 41.8 },
    restorePercent: 10,
    points: [[1.0,41.0],[2.5,41.5],[3.4,42.8],[1.5,43.5],[0.0,43.0],[-0.5,42.0],[1.0,41.0]],
  },
  {
    id: 'NOR',
    name: 'Norte\n(Euskadi)',
    color: '#f472b6',
    restoreTime: 4,
    blackStartType: 'top-down',
    anchor: { lon: -2.5, lat: 43.0 },
    restorePercent: 8,
    points: [[-5.0,42.0],[-2.5,42.5],[-0.5,42.0],[0.0,43.0],[-0.5,43.8],[-2.0,43.5],[-4.5,43.8],[-6.0,43.5],[-5.5,42.5],[-5.0,42.0]],
  },
  {
    id: 'GAL',
    name: 'Galicia\nLeón',
    color: '#34d399',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: -7.5, lat: 42.5 },
    restorePercent: 8,
    points: [[-9.5,42.0],[-6.0,41.0],[-5.0,42.0],[-5.5,42.5],[-6.0,43.5],[-7.5,43.8],[-9.0,43.8],[-9.5,43.0],[-9.5,42.0]],
  },
  {
    id: 'POR',
    name: 'Portugal',
    color: '#60a5fa',
    restoreTime: 3,
    blackStartType: 'bottom-up',
    anchor: { lon: -8.0, lat: 39.5 },
    restorePercent: 10,
    points: [[-9.5,37.5],[-7.5,38.5],[-6.0,41.0],[-9.5,42.0],[-9.5,37.5]],
  },
];

// ─── Puntos de Black Start verificados ───────────────────────────────────────
const BLACK_START_POINTS = [
  { id: 'CastBode',   lon: -8.27, lat: 39.48, name: 'Castelo de Bode\n(138 MW hidro)', time: 3, type: 'hydro' },
  { id: 'TapOuteiro', lon: -8.42, lat: 41.22, name: 'Tapada do Outeiro\n(CCGT REN)',    time: 3, type: 'ccgt'  },
  { id: 'Aldea',      lon: -6.49, lat: 41.20, name: 'Aldeadávila\n(1.100 MW hidro)',    time: 5, type: 'hydro' },
  { id: 'Hernani',    lon: -1.97, lat: 43.27, name: 'Hernani\n(Conexión Francia)',      time: 2, type: 'france'},
  { id: 'Baixas',     lon:  2.81, lat: 42.72, name: 'Baixas\n(Francia → Cataluña)',     time: 2, type: 'france'},
];

// ─── Log de eventos ────────────────────────────────────────────────────────────
const EVENT_LOG = [
  { time: 0,  msg: '12:33 CEST — Blackout sistémico. 7 islas desenergizadas.' },
  { time: 2,  msg: '~12:44 CEST — TOP-DOWN: Hernani recibe tensión de Francia (31 MW iniciales).' },
  { time: 3,  msg: '~12:45 CEST — BOTTOM-UP: Black Start Castelo de Bode (PT). Tapada do Outeiro activo.' },
  { time: 4,  msg: '~13:04 CEST — Interconexión Marruecos: +900 MW. Norte y Galicia se estabilizan.' },
  { time: 5,  msg: '~16:00 CEST — Aldeadávila (España) inicia Black Start. Isla Sur activa.' },
  { time: 6,  msg: '~14:30 CEST — Madrid Central recupera tensión. Corredor centro conectado.' },
  { time: 7,  msg: '~17:00 CEST — Levante sincroniza con el esqueleto principal.' },
  { time: 8,  msg: '20:22 CEST — Portugal sincroniza frecuencia con continental europeo.' },
  { time: 11, msg: '07:05 (29-A) — 99,95% suministro restituido. Reposición certificada.' },
];

function RestorationContent({ lang = 'es' }) {
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const MAX_TIME = 12;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Calcular demanda restituida total
  const demandaRestituida = useMemo(() => {
    return ISLANDS.filter(i => simTime >= i.restoreTime)
      .reduce((sum, i) => sum + i.restorePercent, 0);
  }, [simTime]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime).reverse().slice(0, 4);

  return (
    <div style={{
      position: 'relative', width: '100%',
      background: 'var(--bg-0, #050a14)',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
    }}>

      <svg viewBox="0 0 800 520" style={{ width: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="bgGrad2" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#0a1628" />
            <stop offset="100%" stopColor="#050a14" />
          </radialGradient>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(0,217,255,0.04)" strokeWidth="0.5"/>
          </pattern>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="800" height="520" fill="url(#bgGrad2)" />
        <rect width="800" height="520" fill="url(#grid2)" />

        {/* Contorno base siempre visible (apagado) */}
        <path d={IBERIAN_PATH}
              fill="rgba(8,15,30,0.9)"
              stroke="rgba(0,217,255,0.1)"
              strokeWidth="1" />

        {/* ── ISLAS ELÉCTRICAS ─────────────────────────────────────── */}
        {ISLANDS.map(island => {
          const isRestored = simTime >= island.restoreTime;
          const isHovered  = hoveredIsland === island.id;
          const pts = island.points.map(([lon, lat]) => project(lon, lat).join(',')).join(' ');
          const anchorPx = project(island.anchor.lon, island.anchor.lat);

          return (
            <g key={island.id}
               onMouseEnter={() => setHoveredIsland(island.id)}
               onMouseLeave={() => setHoveredIsland(null)}
               style={{ cursor: 'default' }}>

              {/* Polígono de isla */}
              <polygon
                points={pts}
                fill={isRestored
                  ? `${island.color}28`
                  : 'rgba(239,68,68,0.04)'}
                stroke={isRestored
                  ? island.color
                  : 'rgba(239,68,68,0.2)'}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray={isRestored ? 'none' : '4 3'}
                style={{ transition: 'all 0.6s ease' }}
              />

              {/* Pulso de activación */}
              {isRestored && (
                <polygon
                  points={pts}
                  fill="none"
                  stroke={island.color}
                  strokeWidth="2"
                  opacity="0"
                >
                  <animate attributeName="opacity"
                           values="0.6;0" dur="1.5s"
                           begin="0s" repeatCount="1" />
                </polygon>
              )}

              {/* Etiqueta de la isla */}
              {island.name.split('\n').map((line, li) => (
                <text
                  key={li}
                  x={anchorPx[0]} y={anchorPx[1] + (li - 0.5) * 13}
                  textAnchor="middle"
                  fontSize={li === 0 ? 10 : 8.5}
                  fontFamily="var(--font-mono, monospace)"
                  fill={isRestored ? island.color : '#374151'}
                  fontWeight={li === 0 ? '700' : '400'}
                  style={{ transition: 'fill 0.5s ease' }}
                >
                  {line}
                </text>
              ))}

              {/* Porcentaje restituido */}
              {isRestored && (
                <text
                  x={anchorPx[0]} y={anchorPx[1] + 22}
                  textAnchor="middle" fontSize={8}
                  fontFamily="var(--font-mono, monospace)"
                  fill="rgba(255,255,255,0.5)"
                >
                  +{island.restorePercent}%
                </text>
              )}
            </g>
          );
        })}

        {/* ── PUNTOS DE BLACK START ─────────────────────────────────── */}
        {BLACK_START_POINTS.map(pt => {
          const isActive = simTime >= pt.time;
          if (!isActive) return null;
          const [px, py] = project(pt.lon, pt.lat);
          const color = pt.type === 'france' ? '#3b82f6'
                      : pt.type === 'hydro'  ? '#10b981'
                      : '#f59e0b';
          return (
            <g key={pt.id}>
              {/* Punto con pulso */}
              <circle cx={px} cy={py} r={5}
                      fill={color} filter="url(#glow2)" />
              <circle cx={px} cy={py} r={5}
                      fill="none" stroke={color} strokeWidth="1.5">
                <animate attributeName="r" values="5;14;5"
                         dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8"
                         dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* ── FLECHAS TOP-DOWN / BOTTOM-UP ─────────────────────────── */}
        {simTime >= 2 && (
          <g opacity="0.6">
            {/* Flecha Francia → Cataluña (top-down) */}
            <path d="M 670,30 L 640,120" stroke="#3b82f6"
                  strokeWidth="2" strokeDasharray="6 3"
                  markerEnd="url(#arrowBlue)" />
          </g>
        )}
        {simTime >= 3 && (
          <g opacity="0.6">
            {/* Flecha Portugal black-start (bottom-up) */}
            <path d="M 55,370 L 85,300" stroke="#10b981"
                  strokeWidth="2" strokeDasharray="6 3" />
          </g>
        )}

        {/* Etiquetas de mar */}
        <text x="25" y="270" fill="rgba(0,217,255,0.18)" fontSize="9"
              fontFamily="var(--font-mono, monospace)"
              transform="rotate(-90, 25, 270)" letterSpacing="2">
          OCÉANO ATLÁNTICO
        </text>
        <text x="570" y="415" fill="rgba(0,217,255,0.18)" fontSize="9"
              fontFamily="var(--font-mono, monospace)" letterSpacing="2"
              transform="rotate(-5, 570, 415)">
          MAR MEDITERRÁNEO
        </text>
        <text x="600" y="22" fill="rgba(59,130,246,0.45)" fontSize="10"
              fontFamily="var(--font-mono, monospace)" letterSpacing="3">
          FRANCE
        </text>
      </svg>

      {/* ── PANEL LATERAL DERECHO ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(5,10,20,0.93)',
        border: '1px solid rgba(0,217,255,0.2)',
        borderRadius: 8, padding: '12px 14px', width: 250,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)', fontSize: 10,
            letterSpacing: '0.1em', color: '#10b981', fontWeight: 700,
          }}>
            REPOSICIÓN IBÉRICA
          </span>
          <button onClick={handlePlayPause} style={{
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
            color: isPlaying ? '#ef4444' : '#10b981',
            padding: '3px 10px', borderRadius: 4,
            cursor: 'pointer', fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)', fontWeight: 700,
          }}>
            {simTime >= MAX_TIME ? '↺' : (isPlaying ? '⏸' : '▶')}
          </button>
        </div>

        {/* Contador de demanda restituida */}
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 6, padding: '8px 10px', marginBottom: 10,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 28, fontWeight: 700,
            color: demandaRestituida >= 90 ? '#10b981'
                 : demandaRestituida >= 50 ? '#f59e0b' : '#ef4444',
            lineHeight: 1,
            transition: 'color 0.5s ease',
          }}>
            {demandaRestituida}%
          </div>
          <div style={{
            fontSize: 9, color: '#475569',
            fontFamily: 'var(--font-mono, monospace)',
            marginTop: 3,
          }}>
            demanda restituida
          </div>
          <div style={{
            height: 3, background: 'rgba(16,185,129,0.1)',
            borderRadius: 2, marginTop: 6, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${demandaRestituida}%`,
              background: 'linear-gradient(90deg, #10b981, #00d9ff)',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Leyenda Top-Down / Bottom-Up */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 8,
          fontSize: 9, fontFamily: 'var(--font-mono, monospace)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 2, background: '#3b82f6',
                          borderRadius: 1 }} />
            <span style={{ color: '#6b7280' }}>Top-Down (FR)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 2, background: '#10b981',
                          borderRadius: 1 }} />
            <span style={{ color: '#6b7280' }}>Bottom-Up (Black Start)</span>
          </div>
        </div>

        {/* Log */}
        <div style={{
          borderTop: '1px solid rgba(0,217,255,0.1)',
          paddingTop: 8, maxHeight: 160, overflowY: 'auto',
        }}>
          {visibleLogs.map((log, i) => (
            <div key={i} style={{
              fontSize: 9,
              fontFamily: 'var(--font-mono, monospace)',
              color: i === 0 ? '#e2e8f0' : '#374151',
              borderLeft: `2px solid ${i === 0 ? '#10b981' : 'transparent'}`,
              paddingLeft: 5, marginBottom: 5,
              transition: 'all 0.3s ease',
            }}>
              {log.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnimatedRestorationMap({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: '#050a14', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#10b981', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando mapa de reposición…
      </div>
    }>
      {() => <RestorationContent lang={lang} />}
    </BrowserOnly>
  );
}
```

---

## TAREA 3 — CollapseSismograph.jsx
### Añadir contador de métricas en tiempo real

**Archivo:** `src/components/CollapseSismograph.jsx`

El componente actual es bueno. Solo hay que añadir un panel de contadores
que muestre los valores actuales de Frecuencia, Tensión y Potencia Perdida
para el punto más reciente del playback.

**Instrucciones:**
1. Lee el archivo completo.
2. Localiza el `return (` de la función principal.
3. Justo ANTES del `<div className={styles.chartWrapper}>`, inserta este bloque:

```jsx
{/* ── CONTADOR EN TIEMPO REAL ─────────────────────────────────────── */}
{(() => {
  const current = cascadeData[cascadeData.length - 1];
  if (!current) return null;
  const isCollapsing = current.freq < 49.5;
  const isVoltCritical = current.volt > 435;

  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      marginBottom: '1rem',
      fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid rgba(0,217,255,0.12)',
    }}>
      {/* Frecuencia */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: isCollapsing
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(6,182,212,0.06)',
        borderRight: '1px solid rgba(0,217,255,0.1)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Frecuencia
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: isCollapsing ? '#ef4444' : '#06b6d4',
          transition: 'color 0.3s ease',
        }}>
          {current.freq.toFixed(2)}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            Hz
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: isCollapsing ? '#ef444480' : '#06b6d440',
        }}>
          {isCollapsing
            ? `▼ ${(50 - current.freq).toFixed(2)} Hz bajo nominal`
            : 'Nominal 50 Hz'}
        </div>
      </div>

      {/* Tensión */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: isVoltCritical
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(239,68,68,0.04)',
        borderRight: '1px solid rgba(0,217,255,0.1)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Tensión 400 kV
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: isVoltCritical ? '#ef4444' : '#f87171',
          transition: 'color 0.3s ease',
        }}>
          {current.volt > 0 ? current.volt.toFixed(0) : '—'}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            kV
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: isVoltCritical ? '#ef444480' : '#ef444430',
        }}>
          {isVoltCritical
            ? `▲ ${(current.volt - 420).toFixed(0)} kV sobre nominal`
            : 'Nominal 420 kV'}
        </div>
      </div>

      {/* Potencia perdida */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: 'rgba(245,158,11,0.05)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Generación perdida
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: current.lostMW > 10000 ? '#ef4444'
               : current.lostMW > 3000  ? '#f59e0b'
               : '#fbbf24',
          transition: 'color 0.3s ease',
        }}>
          {(current.lostMW / 1000).toFixed(1)}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            GW
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: '#f59e0b40',
        }}>
          {current.lostMW > 0
            ? `${((current.lostMW / 29600) * 100).toFixed(0)}% cap. peninsular`
            : 'Sistema estable'}
        </div>
      </div>

      {/* Evento actual */}
      <div style={{
        flex: 2,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Evento — {current.timeLabel}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: '#94a3b8',
          lineHeight: 1.4,
        }}>
          {current.event}
        </div>
        <div style={{
          marginTop: '6px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: isCollapsing ? '#ef4444' : '#10b981',
            boxShadow: isCollapsing ? '0 0 6px #ef4444' : '0 0 6px #10b981',
          }}>
            {isCollapsing && (
              <style>{`
                @keyframes pulse-red {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
              `}</style>
            )}
          </div>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            color: isCollapsing ? '#ef4444' : '#10b981',
            letterSpacing: '0.08em',
          }}>
            {isCollapsing ? 'COLAPSO EN CURSO' : 'SISTEMA OPERATIVO'}
          </span>
        </div>
      </div>
    </div>
  );
})()}
```

4. Añade en `CollapseSismograph.module.css` si no existe ya una regla para
   que el contenedor general tenga `overflow: visible` para que el tooltip
   no quede cortado:
```css
.sismographContainer {
  overflow: visible;
}
```

---

## VERIFICACIÓN

```bash
npm run build -- --locale es
```

Los tres componentes deben compilar sin errores. Verificación visual:

1. **IberianGridTopology**: debe mostrar el contorno de la Península Ibérica
   en SVG (no fondo negro vacío), con nodos en coordenadas reales que se
   activan al pulsar Play.

2. **AnimatedRestorationMap**: debe mostrar el contorno ibérico con 7 polígonos
   coloreados que se iluminan progresivamente, contador de % demanda restituida.

3. **CollapseSismograph**: encima de la gráfica, 4 contadores (frecuencia,
   tensión, potencia perdida, evento) que se actualizan con el playbackT.

## COMMIT

```bash
git add src/components/IberianGridTopologyBase.jsx \
        src/components/AnimatedRestorationMap.jsx \
        src/components/CollapseSismograph.jsx
git commit -m "feat(maps): SVG geographic maps + sismograph realtime counters"
git push origin main
```
