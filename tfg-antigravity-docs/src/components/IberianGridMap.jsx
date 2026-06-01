// src/components/IberianGridMap.jsx
import React, { useMemo } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

// ============================================================
// PATHS VECTORIALES DE ALTA RESOLUCIÓN
// ============================================================
const IBERIA_PATH =
  'M 120,90 C 125,82 135,75 148,72 C 162,68 178,66 192,65 ' +
  'C 210,63 230,62 250,62 C 272,62 290,60 308,56 ' +
  'C 326,52 342,48 356,45 C 370,42 380,40 388,40 ' +
  'C 396,42 402,46 406,52 C 408,58 408,64 406,70 ' +
  'C 404,74 400,78 396,80 C 392,78 388,76 384,78 ' +
  'C 380,82 378,88 378,94 C 380,102 384,112 390,120 ' +
  'C 396,128 400,136 402,144 C 400,152 396,158 390,162 ' +
  'C 384,166 378,172 372,178 C 366,186 360,194 356,202 ' +
  'C 352,212 348,222 342,232 C 336,242 330,250 324,256 ' +
  'C 318,260 310,262 302,264 C 294,266 286,264 280,260 ' +
  'C 274,256 268,250 264,244 C 260,238 256,234 250,232 ' +
  'C 244,232 238,234 232,238 C 226,242 220,244 214,244 ' +
  'C 208,244 202,242 198,238 C 192,234 186,230 180,226 ' +
  'C 174,220 168,214 162,208 C 156,202 150,196 144,190 ' +
  'C 138,182 132,174 126,166 C 120,158 114,150 108,142 ' +
  'C 102,134 96,126 92,118 C 88,110 84,102 80,94 ' +
  'C 88,88 98,84 108,86 C 112,88 116,90 120,90 Z';

const BALEARES_PATH =
  'M 520,220 C 530,215 540,212 548,214 C 556,218 560,226 558,234 ' +
  'C 556,242 548,248 538,248 C 528,248 518,244 512,238 ' +
  'C 508,232 508,224 512,218 C 514,216 518,218 520,220 Z ' +
  'M 570,200 C 578,198 584,200 586,206 C 584,214 576,218 570,216 ' +
  'C 564,212 562,204 566,200 C 568,199 569,199 570,200 Z ' +
  'M 490,260 C 496,256 504,256 508,262 C 506,270 498,274 492,272 ' +
  'C 486,268 484,262 490,260 Z ' +
  'M 486,278 C 490,276 494,278 494,282 C 492,286 488,286 486,284 ' +
  'C 484,282 484,280 486,278 Z';

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

// ============================================================
// PROYECCIÓN GEOGRÁFICA
// ============================================================
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

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
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </linearGradient>

          <filter id="relief" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="-2" dy="-3" stdDeviation="4" floodColor={palette.reliefLight} />
            <feDropShadow dx="3" dy="5" stdDeviation="6" floodColor={palette.reliefDark} />
          </filter>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="clipIberia">
            <path d={IBERIA_PATH} />
            <path d={BALEARES_PATH} />
          </clipPath>
        </defs>

        {/* Cuadrícula de fondo (recortada) */}
        <g clipPath="url(#clipIberia)" opacity="0.6">
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
        <g filter="url(#relief)">
          <path d={IBERIA_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
          <path d={BALEARES_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
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
                filter="url(#nodeGlow)"
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
