// src/components/IberianGridMap.jsx
import React, { useMemo, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

// ============================================================
// PROYECCIÓN GEOGRÁFICA Y PATHS VECTORIALES
// ============================================================
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

const IBERIA_OUTLINE = [
  [43.78, -7.86],  [43.47, -8.45],  [42.88, -9.28],  [42.03, -8.87],  [41.87, -8.87],
  [41.38, -8.73],  [40.64, -8.75],  [39.36, -9.40],  [38.62, -9.50],  [37.01, -8.91],
  [36.97, -7.85],  [36.01, -5.61],  [36.17, -5.36],  [36.69, -4.41],  [36.72, -3.48],
  [37.20, -1.90],  [37.64, -0.69],  [38.68,  0.23],  [39.58,  0.34],  [40.72,  0.73],
  [41.29,  1.83],  [41.42,  2.22],  [42.43,  3.16],  [42.80,  1.72],  [43.37, -1.79],
  [43.49, -3.80],  [43.57, -5.66],  [43.78, -7.86]
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87],  [41.52, -6.92],  [39.67, -7.06],  [37.43, -7.44],  [36.97, -7.85],
  [37.01, -8.91],  [38.62, -9.50],  [39.36, -9.40],  [40.64, -8.75],  [41.38, -8.73],
  [41.87, -8.87]
];

const MALLORCA_OUTLINE = [
  [39.96, 3.22],   [39.89, 2.32],   [39.27, 2.84],   [39.25, 3.48],   [39.78, 3.47],
  [39.96, 3.22]
];

function pointsToPath(points) {
  return points.map((p, i) => {
    const { x, y } = geoToSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_PATH = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);
const BALEARES_PATH = pointsToPath(MALLORCA_OUTLINE);

// ============================================================
// UBICACIONES GEOGRÁFICAS EXACTAS
// ============================================================
const STATIONS = [
  { id: 'caparacena', name: 'Caparacena', city: 'Granada', lat: 37.2661, lon: -3.658, type: 'trigger' },
  { id: 'alcores', name: 'Alcores', city: 'Sevilla', lat: 37.3824, lon: -5.9126, type: 'cascade' },
  { id: 'guillena', name: 'Guillena', city: 'Sevilla', lat: 37.4833, lon: -6.05, type: 'cascade' },
  { id: 'almaraz', name: 'C.N. Almaraz', city: 'Cáceres', lat: 39.8167, lon: -5.6833, type: 'nuclear' },
  { id: 'madrid-sur', name: 'Madrid Sur', city: 'Morata', lat: 40.31, lon: -3.5, type: 'substation' },
  { id: 'aragon', name: 'Nudo Aragón', city: 'Zaragoza', lat: 41.65, lon: -0.88, type: 'substation' },
  { id: 'rubi', name: 'Rubí', city: 'Barcelona', lat: 41.4833, lon: 2.0167, type: 'substation' },
  { id: 'lisboa', name: 'Lisboa', city: 'REN Portugal', lat: 38.7223, lon: -9.1393, type: 'capital' },
  { id: 'porto', name: 'Porto', city: 'REN Portugal', lat: 41.1579, lon: -8.6291, type: 'capital' },
  { id: 'frontera', name: 'Frontera', city: 'Transpirenaica', lat: 42.8, lon: 2.0, type: 'interconnection' },
];

// Conexiones entre nodos (pares de ids)
const ARCS = [
  ['caparacena', 'alcores'],
  ['alcores', 'guillena'],
  ['caparacena', 'almaraz'],
  ['almaraz', 'madrid-sur'],
  ['madrid-sur', 'aragon'],
  ['aragon', 'rubi'],
  ['rubi', 'frontera'],
  ['madrid-sur', 'lisboa'],
  ['lisboa', 'porto'],
];

// Proyección geográfica movida arriba

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function IberianGridMap({ showLabels = true, showArcs = true }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const palette = {
    landGradientStart: isDark ? '#142c4a' : '#f0ece1',
    landGradientEnd: isDark ? '#0b1827' : '#d6cebc',
    landStroke: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(100, 116, 139, 0.3)',
    reliefLight: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    reliefDark: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
    arcStroke: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(100, 116, 139, 0.4)',
    nodeStroke: isDark ? '#0a1128' : '#fcfcfc',
    textFill: isDark ? '#e2e8f0' : '#1e293b',
    textBg: isDark ? 'rgba(10, 17, 40, 0.8)' : 'rgba(252, 252, 252, 0.85)',
    textBorder: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
    gridLine: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
  };

  // FIX 3 — IDs únicos por instancia (React 17 compatible)
  const uid = useRef(`igm-${Math.random().toString(36).slice(2, 7)}`).current;
  const ids = {
    landGrad:   `${uid}-landGrad`,
    relief:     `${uid}-relief`,
    nodeGlow:   `${uid}-nodeGlow`,
    clipIberia: `${uid}-clipIberia`,
  };

  const typeColors = {
    trigger: isDark ? '#ef4444' : '#dc2626',
    cascade: isDark ? '#f59e0b' : '#d97706',
    nuclear: isDark ? '#06b6d4' : '#0891b2',
    substation: isDark ? '#8b5cf6' : '#7c3aed',
    capital: isDark ? '#10b981' : '#059669',
    interconnection: isDark ? '#d946ef' : '#c026d3',
  };

  // Proyectar nodos
  const nodes = useMemo(
    () =>
      STATIONS.map((s) => {
        const { x, y } = geoToSvg(s.lat, s.lon);
        return { ...s, x, y };
      }),
    []
  );

  // Proyectar arcos
  const arcs = useMemo(
    () =>
      ARCS.map(([fromId, toId]) => {
        const from = nodes.find((n) => n.id === fromId);
        const to = nodes.find((n) => n.id === toId);
        return { from, to };
      }).filter((a) => a.from && a.to),
    [nodes]
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        background: 'transparent',
      }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        style={{
          width: '100%',
          maxWidth: '800px',
          height: 'auto',
          background: 'transparent',
          filter: isDark
            ? 'drop-shadow(0 0 40px rgba(14, 165, 233, 0.15)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.25))'
            : 'drop-shadow(0 8px 24px rgba(0,0,0,0.08))',
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* FIX 1+3 — gradientUnits userSpaceOnUse + coordenadas absolutas viewBox */}
          <linearGradient id={ids.landGrad}
            x1="0" y1="0" x2="0" y2="800"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </linearGradient>

          {/* FIX 2+3 — filterUnits userSpaceOnUse + coordenadas absolutas */}
          <filter id={ids.relief}
            x="-50" y="-50" width="1100" height="900"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow dx="-2" dy="-3" stdDeviation="4" floodColor={palette.reliefLight} />
            <feDropShadow dx="3" dy="5" stdDeviation="6" floodColor={palette.reliefDark} />
          </filter>

          {/* FIX 2+3 — nodeGlow con unidades absolutas */}
          <filter id={ids.nodeGlow}
            x="-50" y="-50" width="1100" height="900"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id={ids.clipIberia}>
            <path d={IBERIA_PATH} />
            <path d={PORTUGAL_PATH} />
            <path d={BALEARES_PATH} />
          </clipPath>
        </defs>

        {/* Cuadrícula de fondo (recortada) */}
        <g clipPath={`url(#${ids.clipIberia})`} opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={(VIEWBOX.height / 12) * i}
              x2={VIEWBOX.width}
              y2={(VIEWBOX.height / 12) * i}
              stroke={palette.gridLine}
              strokeWidth="0.8"
            />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={(VIEWBOX.width / 14) * i}
              y1={0}
              x2={(VIEWBOX.width / 14) * i}
              y2={VIEWBOX.height}
              stroke={palette.gridLine}
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Masa terrestre con relieve */}
        <g filter={`url(#${ids.relief})`}>
          <path d={IBERIA_PATH} fill={`url(#${ids.landGrad})`} stroke={palette.landStroke} strokeWidth="1.2" strokeLinejoin="round" />
          <path d={PORTUGAL_PATH} fill={isDark ? 'rgba(255,170,0,0.08)' : 'rgba(200,140,0,0.08)'} stroke={isDark ? 'rgba(255,170,0,0.4)' : 'rgba(180,120,0,0.4)'} strokeWidth="1" strokeDasharray="4 3" strokeLinejoin="round" />
          <path d={BALEARES_PATH} fill={`url(#${ids.landGrad})`} stroke={palette.landStroke} strokeWidth="1.2" strokeLinejoin="round" />
        </g>

        {/* Arcos de conexión */}
        {showArcs &&
          arcs.map((arc, i) => (
            <line
              key={`arc-${i}`}
              x1={arc.from.x}
              y1={arc.from.y}
              x2={arc.to.x}
              y2={arc.to.y}
              stroke={palette.arcStroke}
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.7"
            />
          ))}

        {/* Nodos de subestaciones */}
        {nodes.map((node) => {
          const color = typeColors[node.type] || typeColors.substation;
          return (
            <g key={node.id}>
              {/* Anillo radar animado */}
              <circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="8"
                  to="16"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Punto central */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'trigger' ? 5 : 3.5}
                fill={color}
                stroke={palette.nodeStroke}
                strokeWidth="1.5"
                filter={`url(#${ids.nodeGlow})`}
              />

              {/* Etiqueta */}
              {showLabels && (
                <g>
                  <rect
                    x={node.x + 9}
                    y={node.y - 13}
                    width={node.name.length * 7.5 + 14}
                    height="22"
                    rx="5"
                    fill={palette.textBg}
                    stroke={palette.textBorder}
                    strokeWidth="0.8"
                  />
                  <text
                    x={node.x + 16}
                    y={node.y + 2}
                    fill={palette.textFill}
                    fontSize="10"
                    fontFamily="Inter, -apple-system, sans-serif"
                    fontWeight="600"
                    letterSpacing="0.3"
                  >
                    {node.name}
                  </text>
                  <line
                    x1={node.x + 4}
                    y1={node.y}
                    x2={node.x + 9}
                    y2={node.y}
                    stroke={color}
                    strokeWidth="0.8"
                    opacity="0.8"
                  />
                </g>
              )}

              {/* Tooltip */}
              <title>{`${node.name} (${node.city})\nTipo: ${node.type}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
