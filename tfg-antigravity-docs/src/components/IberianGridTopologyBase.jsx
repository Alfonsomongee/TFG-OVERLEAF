import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import {
  MAP_VIEWBOX,
  LAND_PATHS,
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  CITY_POINTS
} from '../data/cartography/naturalEarthIberiaPaths';

// ============================================================
// PROYECCIÓN GEOGRÁFICA Y PATHS VECTORIALES
// ============================================================
const GEO_BOUNDS = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

const SPAIN_PATHS = COUNTRY_PATHS.ESP ? COUNTRY_PATHS.ESP.paths : [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT ? COUNTRY_PATHS.PRT.paths : [];
const ANDORRA_PATHS = COUNTRY_PATHS.AND ? COUNTRY_PATHS.AND.paths : [];


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
function getGroupColors(isDark) {
  return {
    collapse: {
      fill: isDark ? '#D98798' : '#A13D36',
      stroke: isDark ? '#F0B4C0' : '#C8798A',
      pulse: true,
    },
    stable: {
      fill: isDark ? '#A6C67B' : '#2F6B4F',
      stroke: isDark ? '#D3E7B0' : '#6FA784',
      pulse: false,
    },
    portugal: {
      fill: isDark ? '#E6B45C' : '#A96000',
      stroke: isDark ? '#F3D38A' : '#D9A441',
      pulse: false,
    },
    france: {
      fill: isDark ? '#7DCDE3' : '#1F6F78',
      stroke: isDark ? '#B7EAF4' : '#5AA7B2',
      pulse: false,
    },
  };
}

// ─── Componente principal ─────────────────────────────────────────────────────
function TopologyContent({}) {
  const lang = useDocLang();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const palette = {
    bg: isDark ? '#0D1E38' : '#F3EFE7',
    bgOverlay: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(255, 252, 245, 0.54)',
    panelBg: isDark ? 'rgba(16, 29, 53, 0.92)' : 'rgba(255, 252, 245, 0.88)',
    logBg: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(25, 24, 20, 0.035)',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(125, 205, 227, 0.34)' : 'rgba(31, 111, 120, 0.30)',

    landGradientStart: isDark ? '#162A46' : '#ECE6DB',
    landGradientEnd: isDark ? '#162A46' : '#ECE6DB',
    landStroke: isDark ? '#29415F' : '#D6CEC0',
    landNeighbor: isDark ? '#162A46' : '#ECE6DB',
    coastline: isDark ? '#29415F' : '#D6CEC0',

    portugalFill: isDark ? 'rgba(230, 180, 92, 0.10)' : 'rgba(169, 96, 0, 0.10)',
    portugalStroke: isDark ? 'rgba(230, 180, 92, 0.38)' : 'rgba(169, 96, 0, 0.30)',

    gridLine: isDark ? 'rgba(244, 247, 251, 0.055)' : 'rgba(25, 24, 20, 0.045)',
    reliefLight: isDark ? 'rgba(244, 247, 251, 0.055)' : 'rgba(255, 252, 245, 0.62)',
    reliefDark: isDark ? 'rgba(0, 0, 0, 0.26)' : 'rgba(25, 24, 20, 0.10)',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    accent: isDark ? '#7DCDE3' : '#1F6F78',
    accentSoft: isDark ? 'rgba(125, 205, 227, 0.12)' : 'rgba(31, 111, 120, 0.10)',
    accentBorder: isDark ? 'rgba(125, 205, 227, 0.38)' : 'rgba(31, 111, 120, 0.34)',

    warning: isDark ? '#E6B45C' : '#A96000',
    danger: isDark ? '#D98798' : '#A13D36',
    success: isDark ? '#A6C67B' : '#2F6B4F',

    linkIdle: isDark ? 'rgba(125, 205, 227, 0.10)' : 'rgba(31, 111, 120, 0.14)',
    linkActive: isDark ? 'rgba(125, 205, 227, 0.34)' : 'rgba(31, 111, 120, 0.36)',
    linkCritical: isDark ? '#D98798' : '#A13D36',

    inactiveNodeFill: isDark ? 'rgba(16, 29, 53, 0.90)' : 'rgba(255, 252, 245, 0.90)',
    inactiveNodeStroke: isDark ? 'rgba(226, 232, 240, 0.16)' : 'rgba(25, 24, 20, 0.16)',
  };

  const groupColors = useMemo(() => getGroupColors(isDark), [isDark]);

  // FIX 3 — IDs únicos por instancia (React 17 compatible)
  const uid = useRef(`topo-${Math.random().toString(36).slice(2, 7)}`).current;
  const ids = {
    landGrad:   `${uid}-landGrad`,
    relief:     `${uid}-relief`,
    glow:       `${uid}-glow`,
    glowRed:    `${uid}-glowRed`,
    clipIberia: `${uid}-clipIberia`,
  };

  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 14;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 2500);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Nodos con coordenadas proyectadas precalculadas
  const nodes = useMemo(() => NODES_ES.map(n => {
    const {x, y} = geoToSvg(n.lat, n.lon);
    const isActive = simTime >= n.activationTime;
    const isCollapsing = n.group === 'collapse' && isActive;
    return { ...n, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime || e.t <= simTime).reverse().slice(0, 4);

  return (
    <div style={{
      width: '100%',
      background: palette.bg,
      borderRadius: 12,
      border: `1px solid ${palette.border}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 1000 800" style={{ width: '100%', display: 'block' }}>
          
        <defs>
          {/* FIX 2+3 — filters con unidades absolutas e IDs únicos */}
          <filter id={ids.glow}
            x="-50" y="-50" width="1100" height="900"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id={ids.glowRed}
            x="-50" y="-50" width="1100" height="900"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          <clipPath id={ids.clipIberia}>
            {SPAIN_PATHS.map((d, i) => <path key={`clip-es-${i}`} d={d} />)}
            {PORTUGAL_PATHS.map((d, i) => <path key={`clip-pt-${i}`} d={d} />)}
            {ANDORRA_PATHS.map((d, i) => <path key={`clip-ad-${i}`} d={d} />)}
          </clipPath>
          {/* FIX 1+3 — gradientUnits userSpaceOnUse + coordenadas absolutas viewBox */}
          <radialGradient id={ids.landGrad}
            cx="450" cy="360" r="520"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </radialGradient>
          {/* FIX 2+3 — filterUnits userSpaceOnUse + coordenadas absolutas */}
          <filter id={ids.relief}
            x="-50" y="-50" width="1100" height="900"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor={palette.reliefDark} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Mar de fondo */}
        <rect width="1000" height="800" fill={palette.bg} />
        <rect width="1000" height="800" fill={palette.bgOverlay} />

        {/* 2. Países vecinos desaturados de fondo */}
        <g fill={palette.landNeighbor} stroke={palette.border} strokeWidth="0.6">
          {COUNTRY_PATHS.FRA?.paths?.map((d, i) => (
            <path key={`fr-${i}`} d={d} strokeLinejoin="round" />
          ))}
          {COUNTRY_PATHS.MAR?.paths?.map((d, i) => (
            <path key={`ma-${i}`} d={d} strokeLinejoin="round" />
          ))}
          {COUNTRY_PATHS.DZA?.paths?.map((d, i) => (
            <path key={`dz-${i}`} d={d} strokeLinejoin="round" />
          ))}
        </g>

        {/* 3. Tierra principal con sombra/relieve (España, Portugal, Andorra) */}
        <g filter={`url(#${ids.relief})`}>
          {SPAIN_PATHS.map((d, i) => (
            <path key={`es-${i}`} d={d} fill={`url(#${ids.landGrad})`} stroke={palette.landStroke} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
          {PORTUGAL_PATHS.map((d, i) => (
            <path key={`pt-${i}`} d={d} fill={palette.portugalFill} stroke={palette.portugalStroke} strokeWidth="1.0" strokeDasharray="4 3" strokeLinejoin="round" />
          ))}
          {ANDORRA_PATHS.map((d, i) => (
            <path key={`ad-${i}`} d={d} fill={`url(#${ids.landGrad})`} stroke={palette.landStroke} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
        </g>

        {/* 4. Fronteras y costas de alta fidelidad */}
        <g fill="none" stroke={palette.coastline} strokeWidth="1">
          {COASTLINE_PATHS.map((d, i) => (
            <path key={`coast-${i}`} d={d} />
          ))}
        </g>
        <g fill="none" stroke={palette.border} strokeWidth="1" strokeDasharray="3 3">
          {BORDER_PATHS.map((d, i) => (
            <path key={`border-${i}`} d={d} />
          ))}
        </g>

        <g clipPath={`url(#${ids.clipIberia})`} opacity="0.5">
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`rel-${i}`} d={`M ${80 + i * 40} ${60 + i * 25} C ${400 + i * 15} ${100 + i * 10}, ${600 - i * 20} ${500 - i * 15}, ${200 + i * 30} ${600 - i * 20}`} fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6" />
          ))}
        </g>

        <g clipPath={`url(#${ids.clipIberia})`} opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`grid-h-${i}`} x1={0} y1={(VIEWBOX.height / 12) * i} x2={VIEWBOX.width} y2={(VIEWBOX.height / 12) * i} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`grid-v-${i}`} x1={(VIEWBOX.width / 14) * i} y1={0} x2={(VIEWBOX.width / 14) * i} y2={VIEWBOX.height} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
        </g>


        {/* ── LINKS ─────────────────────────────────────────────────── */}
        {LINKS.map((link, i) => {
          const src = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          if (!src || !tgt) return null;

          // Retrasar el dibujado de los enlaces de Francia (RTE) y Aragón-Cataluña hasta t=5
          if ((link.target === 'FR' || (link.source === 'ZAR' && link.target === 'BAR')) && simTime < 5) {
            return null;
          }

          const isActive = simTime >= link.activationTime;
          const isCollapsing = link.isCritical && isActive && simTime < 12;
          const isLost = link.isCritical && simTime >= 10 && link.target === 'FR';

          let stroke = palette.linkIdle;
          let strokeWidth = 1;
          let dashArray = '4 4';

          if (isActive && !isLost) {
            stroke = link.isCritical
              ? (isCollapsing ? palette.linkCritical : palette.linkActive)
              : palette.linkActive;
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
                  fill={link.isCritical ? palette.warning : palette.accent}
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
          const colors = groupColors[node.group] || groupColors.stable;
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
                fill={node.isActive ? colors.fill : palette.inactiveNodeFill}
                stroke={node.isActive ? colors.stroke : palette.inactiveNodeStroke}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={node.isCollapsing ? `url(#${ids.glowRed})` : (node.isActive ? `url(#${ids.glow})` : 'none')}
              />

              {/* Icono de advertencia para nodos en colapso */}
              {node.isCollapsing && (
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle" fontSize="10"
                  fill={isDark ? '#071326' : '#FFFCF5'} fontWeight="bold"
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
                  fill={node.isActive ? palette.textPrimary : palette.textMuted}
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
          if (tx + tw > 990) tx = node.x - tw - 18;
          let ty = node.y - 20;

          return (
            <g>
              <rect
                x={tx - 6} y={ty - 14}
                width={tw + 12}
                height={lines.length * 15 + 18}
                rx="4"
                fill={palette.panelBg}
                stroke={palette.accentBorder}
                strokeWidth="1"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={tx} y={ty + li * 15}
                  fontSize={li === 0 ? 10 : 9}
                  fill={li === 0 ? palette.accent : palette.textMuted}
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
      </div>

      {/* ── PANEL INFERIOR ─────────────────────────────────────────── */}
      <div style={{
        background: palette.panelBg,
        borderTop: `1px solid ${palette.border}`,
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        
        {/* COLUMNA IZQUIERDA: Controles y Métricas */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12, letterSpacing: '0.1em',
              color: palette.accent, fontWeight: 700,
            }}>
              TOPOLOGÍA RED IBÉRICA
            </span>
            <button
              onClick={handlePlayPause}
              style={{
                background: simTime >= MAX_TIME
                  ? palette.success
                  : (isPlaying ? `${palette.danger}22` : palette.accentSoft),
                border: `1px solid ${
                  simTime >= MAX_TIME
                    ? palette.success
                    : (isPlaying ? palette.danger : palette.accent)
                }`,
                color: simTime >= MAX_TIME
                  ? (isDark ? '#071326' : '#FFFCF5')
                  : (isPlaying ? palette.danger : palette.accent),
                padding: '4px 12px', borderRadius: 4,
                cursor: 'pointer', fontSize: 12,
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700, letterSpacing: '0.05em',
              }}
            >
              {simTime >= MAX_TIME ? '↺ REINICIAR' : (isPlaying ? '⏸ PAUSA' : '▶ REPRODUCIR')}
            </button>
          </div>

          {/* Barra de progreso temporal */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, color: palette.textMuted,
              fontFamily: 'var(--font-mono, monospace)', marginBottom: 4,
            }}>
              <span>12:32:57</span>
              <span>12:33:27 CEST</span>
            </div>
            <div style={{
              height: 4, background: palette.accentSoft,
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(simTime / MAX_TIME) * 100}%`,
                background: simTime >= 10
                  ? `linear-gradient(90deg, ${palette.warning}, ${palette.danger})`
                  : `linear-gradient(90deg, ${palette.accent}, ${palette.success})`,
                borderRadius: 2,
                transition: 'width 2.5s linear, background 0.3s ease',
              }} />
            </div>
          </div>

          {/* Leyenda */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '6px 12px', marginBottom: 12, fontSize: 10,
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            {[
              { color: groupColors.collapse.fill, label: 'Nodo en colapso' },
              { color: groupColors.stable.fill, label: 'Nodo estable' },
              { color: groupColors.portugal.fill, label: 'Portugal' },
              { color: groupColors.france.fill, label: 'Francia' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                              background: color, flexShrink: 0 }} />
                <span style={{ color: palette.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Log de eventos */}
        <div style={{
          background: palette.logBg,
          border: `1px solid ${palette.border}`,
          borderRadius: 6,
          padding: '10px 12px',
          height: '100%',
          minHeight: 140,
          maxHeight: 160,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          {visibleLogs.length === 0 ? (
            <p style={{ color: palette.textMuted, fontSize: 11,
                        fontFamily: 'var(--font-mono, monospace)', margin: 0 }}>
              Pulsa ▶ para iniciar la simulación
            </p>
          ) : (
            visibleLogs.map((log, i) => (
              <div key={i} style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono, monospace)',
                color: i === 0 ? palette.textPrimary : palette.textMuted,
                borderLeft: `2px solid ${i === 0 ? palette.accent : 'transparent'}`,
                paddingLeft: 8, marginBottom: 8,
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

export default function IberianGridTopology({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: '#071326', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#7DCDE3', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando topología de red ibérica…
      </div>
    }>
      {() => <TopologyContent />}
    </BrowserOnly>
  );
}
