import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import {
  MAP_VIEWBOX,
  LAND_PATHS,
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  CITY_POINTS,
  ADMIN1_PATHS,       // ← NUEVO: fronteras CCAA/distritos
} from '../data/cartography/naturalEarthIberiaPaths';

/* ═══════════════════════════════════════════════════════════════════════════
   PROYECCIÓN LINEAL  (equirectangular → viewBox 1000×800)
   ═══════════════════════════════════════════════════════════════════════════ */
const GEO = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
const VB  = { w: 1000, h: 800 };

function gp(lat, lon) {
  return {
    x: Math.round(((lon - GEO.west)  / (GEO.east - GEO.west))  * VB.w),
    y: Math.round(((GEO.north - lat) / (GEO.north - GEO.south)) * VB.h),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RETÍCULA CARTOGRÁFICA REAL (cada 2° lon, 2° lat)
   ═══════════════════════════════════════════════════════════════════════════ */
const GRATICULE_LONS = [-10, -8, -6, -4, -2, 0, 2, 4];
const GRATICULE_LATS = [36, 38, 40, 42, 44];

function buildGraticulePaths() {
  const lines = [];
  // Meridianos (verticales)
  for (const lon of GRATICULE_LONS) {
    const top = gp(GEO.north, lon);
    const bot = gp(GEO.south, lon);
    lines.push({ d: `M${top.x},${top.y} L${bot.x},${bot.y}`, label: `${Math.abs(lon)}°${lon < 0 ? 'W' : lon > 0 ? 'E' : ''}`, lx: top.x, ly: 14, anchor: 'middle' });
  }
  // Paralelos (horizontales)
  for (const lat of GRATICULE_LATS) {
    const left  = gp(lat, GEO.west);
    const right = gp(lat, GEO.east);
    lines.push({ d: `M${left.x},${left.y} L${right.x},${right.y}`, label: `${lat}°N`, lx: 18, ly: left.y - 4, anchor: 'start' });
  }
  return lines;
}
const GRATICULE = buildGraticulePaths();

/* ═══════════════════════════════════════════════════════════════════════════
   CAPAS COUNTRY PRE-EXTRAÍDAS
   ═══════════════════════════════════════════════════════════════════════════ */
const SPAIN_PATHS    = COUNTRY_PATHS.ESP?.paths || [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths || [];
const ANDORRA_PATHS  = COUNTRY_PATHS.AND?.paths || [];
const FRANCE_PATHS   = COUNTRY_PATHS.FRA?.paths || [];
const MOROCCO_PATHS  = COUNTRY_PATHS.MAR?.paths || [];

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN1 — Fronteras CCAA (España) + Distritos (Portugal)
   Capa nueva: líneas sutiles que aportan contexto geográfico sin competir
   con la capa eléctrica.
   ═══════════════════════════════════════════════════════════════════════════ */
// Extracción estática (se evalúa una vez al importar el módulo, no dentro de React)
const ALL_ADMIN1_PATHS = (() => {
  if (!ADMIN1_PATHS) return [];
  const paths = [];
  for (const country of ['ESP', 'PRT']) {
    const regions = ADMIN1_PATHS[country];
    if (!regions) continue;
    for (const name of Object.keys(regions)) {
      const region = regions[name];
      if (region?.paths) paths.push(...region.paths);
    }
  }
  return paths;
})();

/* ═══════════════════════════════════════════════════════════════════════════
   DATOS ELÉCTRICOS — Subestaciones, arcos, eventos
   (Sin cambios respecto al original)
   ═══════════════════════════════════════════════════════════════════════════ */
const STATIONS = [
  { id:'GRN', lat:37.2661, lon:-3.658,  name:'Caparacena (Granada)',  type:'origin',   activationTime:0,
    desc:`DISPARO RAÍZ — 12:32:57 CEST\nTransformador 400/220 kV dispara por sobretensión\nen colector 220 kV (242 kV = 1,10 p.u.)\nPérdida: −355 MW, −165 MVAr\n(ENTSO-E Factual, p.28)` },
  { id:'BAD', lat:38.88,   lon:-6.97,   name:'Badajoz',               type:'lost',     activationTime:3,
    desc:`12:33:16 CEST (t=19s)\nOleas de choque reactiva\nCaída por colapso de tensión\n−730 MW desconectados` },
  { id:'SEV', lat:37.3824, lon:-5.9126, name:'Alcores (Sevilla)',      type:'lost',     activationTime:4,
    desc:`12:33:17 CEST (t=20s)\nCascada sur: Sevilla + Huelva\n−550 MW desconectados` },
  { id:'SEG', lat:40.95,   lon:-4.12,   name:'Segovia',               type:'lost',     activationTime:4,
    desc:`12:33:17 CEST (t=20s)\nCascada norte-centro\nProtecciones ANSI 59 activas` },
  { id:'ALM', lat:39.8167, lon:-5.6833, name:'C.N. Almaraz (Cáceres)',type:'stable',   activationTime:0,
    desc:`Central nuclear — Inercia síncrona\n2 × 1.066 MW\nResistió hasta el colapso final` },
  { id:'MAD', lat:40.31,   lon:-3.5,    name:'Madrid Sur / Morata',   type:'stable',   activationTime:0,
    desc:`Nudo central\nFrecuencia cayó a 48,7 Hz\nÚltimo punto de contención` },
  { id:'ZAR', lat:41.65,   lon:-0.88,   name:'Nudo Aragón (Zaragoza)',type:'stable',   activationTime:0,
    desc:`Puente transpirenaico\nIntentos de importación Francia` },
  { id:'BAR', lat:41.4833, lon: 2.0167, name:'Rubí (Barcelona)',      type:'stable',   activationTime:0,
    desc:`Resistencia este\nConexión AC + HVDC con Francia\nEstable hasta pérdida de sincronismo` },
  { id:'LIS', lat:38.7223, lon:-9.1393, name:'Lisboa (REN)',          type:'portugal', activationTime:5,
    desc:`12:33:10 CEST\nOscilaciones inter-área 0,21 Hz\nPortugal totalmente afectado` },
  { id:'POR', lat:41.1579, lon:-8.6291, name:'Porto (REN)',           type:'portugal', activationTime:0,
    desc:`Red portuguesa\nSufrió el colapso completo\nBlack Start desde Castelo de Bode` },
  { id:'FR',  lat:42.8,    lon: 2.0,    name:'Interconexión Francia', type:'france',   activationTime:8,
    desc:`12:33:21 CEST — Pérdida sincronismo\nHVDC INELFE: 1.000 MW PMODE1\nLineas AC: pico 3.800 MW\n(ENTSO-E Factual, pp.12,108)` },
];

const ARCS = [
  { from:'GRN', to:'SEV', activationTime:2, type:'cascade',     label:'Sobretensión' },
  { from:'GRN', to:'BAD', activationTime:2, type:'cascade',     label:'Cascada'      },
  { from:'BAD', to:'LIS', activationTime:5, type:'oscillation', label:'0,21 Hz'      },
  { from:'GRN', to:'SEG', activationTime:3, type:'cascade',     label:'Cascada'      },
  { from:'MAD', to:'ZAR', activationTime:0, type:'stable',      label:''             },
  { from:'ZAR', to:'BAR', activationTime:0, type:'stable',      label:''             },
  { from:'ZAR', to:'FR',  activationTime:8, type:'sync',        label:'ANSI 78'      },
  { from:'BAR', to:'FR',  activationTime:8, type:'sync',        label:'HVDC'         },
];

const EVENTS = [
  { t:0,  msg:'12:32:57 CEST — DISPARO RAÍZ: Caparacena (Granada). Trafo 400/220 kV. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t:2,  msg:'12:33:00 CEST — Cascada: plantas FV Badajoz y Sevilla cruzan umbral ANSI 59 (>435 kV).' },
  { t:3,  msg:'12:33:05 CEST — Segovia y zona norte-centro afectadas. Tensión >440 kV en barras colectoras.' },
  { t:5,  msg:'12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). REN alerta.' },
  { t:6,  msg:'12:33:18 CEST — Frecuencia cae a 48,46 Hz. HVDC INELFE mantiene 1.000 MW PMODE1.' },
  { t:8,  msg:'12:33:21 CEST — PÉRDIDA DE SINCRONISMO. ANSI 78 abre enlaces AC transpirenaicos.' },
  { t:10, msg:'12:33:24 CEST — CERO ELÉCTRICO SISTÉMICO. −15 GW en 30 segundos.' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PALETA DE COLORES — Nodos y tema general (sin cambios)
   ═══════════════════════════════════════════════════════════════════════════ */
const NODE_COLORS = {
  dark: {
    origin:   { fill:'#ef4444', stroke:'#fca5a5', label:'#fca5a5' },
    lost:     { fill:'#f97316', stroke:'#fdba74', label:'#fdba74' },
    stable:   { fill:'#10b981', stroke:'#6ee7b7', label:'#6ee7b7' },
    portugal: { fill:'#f59e0b', stroke:'#fcd34d', label:'#fcd34d' },
    france:   { fill:'#3b82f6', stroke:'#93c5fd', label:'#93c5fd' },
  },
  light: {
    origin:   { fill:'#C41E30', stroke:'#8B1423', label:'#7B1020' },
    lost:     { fill:'#C2500A', stroke:'#7C2D12', label:'#6C2510' },
    stable:   { fill:'#166534', stroke:'#14532D', label:'#0D4524' },
    portugal: { fill:'#B45309', stroke:'#78350F', label:'#6A2D08' },
    france:   { fill:'#1D4ED8', stroke:'#1E3A8A', label:'#18307A' },
  },
};

const THEME = {
  dark: {
    wrapBg:         'rgba(5,10,20,0.98)',
    wrapBorder:     'rgba(0,217,255,0.15)',
    panelBg:        'rgba(5,10,20,0.96)',
    panelBorder:    'rgba(0,217,255,0.18)',
    logBg:          'rgba(0,0,0,0.25)',
    logBorder:      'rgba(0,217,255,0.07)',
    textPrimary:    '#e2e8f0',
    textSec:        '#94a3b8',
    textMuted:      '#4b5563',
    textDanger:     '#ef4444',
    gwBg:           'rgba(239,68,68,0.07)',
    gwBorder:       'rgba(239,68,68,0.22)',
    gwUnit:         '#94a3b8',
    timelineBg:     'rgba(239,68,68,0.10)',
    timelineGrad:   'linear-gradient(90deg,#f59e0b,#ef4444)',
    btnPlay:        { bg:'rgba(0,217,255,0.12)',  border:'#00d9ff', color:'#00d9ff' },
    btnPause:       { bg:'rgba(239,68,68,0.15)',  border:'#ef4444', color:'#ef4444' },
    legendText:     '#6b7280',
    logActive:      '#e2e8f0',
    logPast:        '#4b5563',
    logBullet:      '#ef4444',
    ocean:          '#07182D',
    landMain:       '#173149',
    landNeighbor:   '#10263B',
    coastline:      '#3E6176',
    border:         '#2D4E63',
    adminBorder:    'rgba(118, 151, 168, 0.18)',
    city:           '#8FA8B7',
    cityLabel:      'rgba(210, 224, 232, 0.50)',
    gridLine:       'rgba(255,255,255,0.06)',
    gridLabel:      'rgba(255,255,255,0.14)',
    shadow:         'rgba(0,0,0,0.22)',
    ptFill:         'rgba(255,170,0,0.08)',
    ptStroke:       'rgba(255,170,0,0.40)',
    arcColors:      { cascade:'#ef4444', oscillation:'#f59e0b', sync:'#3b82f6', stable:'rgba(0,217,255,0.18)' },
    arcInactive:    'rgba(0,217,255,0.06)',
    nodeOff:        { fill:'rgba(12,22,44,0.80)', stroke:'rgba(0,217,255,0.10)', label:'#374151' },
    tooltip:        { bg:'rgba(5,10,20,0.96)', border:'rgba(0,217,255,0.35)', title:'#00d9ff', body:'#94a3b8' },
    collapso:       'rgba(239,68,68,0.07)',
    collapsoText:   '#ef4444',
    collapsoSub:    '#fca5a5',
  },
  light: {
    wrapBg:         '#F4F1EA',
    wrapBorder:     'rgba(139,38,53,0.20)',
    panelBg:        '#EDE9DF',
    panelBorder:    'rgba(139,38,53,0.16)',
    logBg:          'rgba(0,0,0,0.03)',
    logBorder:      'rgba(139,38,53,0.10)',
    textPrimary:    '#1A1410',
    textSec:        '#4A4035',
    textMuted:      '#7A7065',
    textDanger:     '#C41E30',
    gwBg:           'rgba(196,30,48,0.06)',
    gwBorder:       'rgba(196,30,48,0.22)',
    gwUnit:         '#7A7065',
    timelineBg:     'rgba(196,30,48,0.08)',
    timelineGrad:   'linear-gradient(90deg,#B45309,#C41E30)',
    btnPlay:        { bg:'rgba(29,53,87,0.08)',   border:'#1D3557', color:'#1D3557' },
    btnPause:       { bg:'rgba(196,30,48,0.10)',  border:'#C41E30', color:'#C41E30' },
    legendText:     '#7A7065',
    logActive:      '#1A1410',
    logPast:        '#7A7065',
    logBullet:      '#C41E30',
    ocean:          '#EEF3F2',
    landMain:       '#D9DED4',
    landNeighbor:   '#E7E9E1',
    coastline:      '#9EAA9C',
    border:         '#B7C0B2',
    adminBorder:    'rgba(104, 116, 98, 0.22)',
    city:           '#7D8577',
    cityLabel:      'rgba(60, 67, 58, 0.56)',
    gridLine:       'rgba(0,0,0,0.06)',
    gridLabel:      'rgba(0,0,0,0.16)',
    shadow:         'rgba(0,0,0,0.07)',
    ptFill:         'rgba(160,100,0,0.09)',
    ptStroke:       'rgba(130,80,0,0.38)',
    arcColors:      { cascade:'#DC2626', oscillation:'#D97706', sync:'#2563EB', stable:'rgba(29,53,87,0.16)' },
    arcInactive:    'rgba(90,100,120,0.12)',
    nodeOff:        { fill:'rgba(195,188,175,0.82)', stroke:'rgba(100,110,130,0.30)', label:'#A09585' },
    tooltip:        { bg:'rgba(244,241,234,0.98)', border:'rgba(139,38,53,0.35)', title:'#8B2635', body:'#4A4035' },
    collapso:       'rgba(196,30,48,0.05)',
    collapsoText:   '#C41E30',
    collapsoSub:    '#8B1423',
  },
};


/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════════════════ */
export default function BlackoutPropagationMapBase() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const th = THEME[isDark ? 'dark' : 'light'];
  const nc = NODE_COLORS[isDark ? 'dark' : 'light'];

  const uid = useRef(`bpm-${Math.random().toString(36).slice(2, 7)}`).current;
  const ids = {
    glowRed:    `${uid}-gr`,
    clipIberia: `${uid}-ci`,
    relief:     `${uid}-rf`,
  };

  const [simTime,     setSimTime]     = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 12;

  useEffect(() => {
    if (!isPlaying) return;
    if (simTime >= MAX_TIME) { setIsPlaying(false); return; }
    const id = setTimeout(() => setSimTime(t => Math.min(t + 1, MAX_TIME)), 800);
    return () => clearTimeout(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  const nodes = useMemo(() => STATIONS.map(s => {
    const { x, y } = gp(s.lat, s.lon);
    const isActive     = simTime >= s.activationTime;
    const isCollapsing = (s.type === 'lost' || s.type === 'origin') && isActive;
    return { ...s, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() =>
    Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleEvents = EVENTS.filter(e => e.t <= simTime).reverse().slice(0, 4);

  const gwLost = useMemo(() => {
    if (simTime >= 10) return 15.0;
    if (simTime >= 8)  return 12.0;
    if (simTime >= 6)  return 8.0;
    if (simTime >= 4)  return 3.5;
    if (simTime >= 2)  return 1.2;
    return 0;
  }, [simTime]);

  const gwColor = gwLost >= 10 ? th.textDanger
    : gwLost >= 5  ? (isDark ? '#f97316' : '#C2500A')
    : gwLost >= 1  ? (isDark ? '#f59e0b' : '#B45309')
    : th.textMuted;

  // Opacidad general del mapa durante colapso final
  const mapOpacity    = simTime >= 8 ? 0.38 : 1;
  const mapTransition = 'opacity 1.2s ease';

  return (
    <figure style={{ margin: '1.5rem 0', padding: 0 }}>
      <div style={{
        width:          '100%',
        background:     th.wrapBg,
        borderRadius:   12,
        border:         `1px solid ${th.wrapBorder}`,
        overflow:       'hidden',
        display:        'flex',
        flexDirection:  'column',
        fontFamily:     'var(--ifm-font-family-base, system-ui, -apple-system, sans-serif)',
      }}>
        {/* ─── SVG MAP ────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            viewBox="0 0 1000 800"
            style={{ width: '100%', display: 'block' }}
            aria-label="Mapa interactivo de la cascada de desconexiones IBR durante el apagón ibérico del 28-A"
          >
            <defs>
              <filter id={ids.glowRed}
                x="-50" y="-50" width="1100" height="900"
                filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              <clipPath id={ids.clipIberia}>
                {SPAIN_PATHS.map((d, i) => <path key={`c-es-${i}`} d={d} />)}
                {PORTUGAL_PATHS.map((d, i) => <path key={`c-pt-${i}`} d={d} />)}
                {ANDORRA_PATHS.map((d, i) => <path key={`c-ad-${i}`} d={d} />)}
              </clipPath>

              <filter id={ids.relief}
                x="-50" y="-50" width="1100" height="900"
                filterUnits="userSpaceOnUse">
                <feDropShadow dx="1.5" dy="2" stdDeviation="2.5"
                  floodColor={th.shadow} floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* Fondo océano */}
            <rect width="1000" height="800" fill={th.ocean}/>

            {/* ─── RETÍCULA CARTOGRÁFICA REAL ─────────────────────────── */}
            <g opacity={simTime >= 8 ? 0.10 : 0.55}
               style={{ transition: mapTransition }}>
              {GRATICULE.map((g, i) => (
                <g key={`grat-${i}`}>
                  <path d={g.d}
                        fill="none"
                        stroke={th.gridLine}
                        strokeWidth="0.6"/>
                  <text x={g.lx} y={g.ly}
                        textAnchor={g.anchor}
                        fontSize="7"
                        fontFamily="var(--font-mono, monospace)"
                        fill={th.gridLabel}>
                    {g.label}
                  </text>
                </g>
              ))}
            </g>

            {/* ─── MASAS TERRESTRES ───────────────────────────────────── */}
            <g filter={`url(#${ids.relief})`}
               opacity={mapOpacity}
               style={{ transition: mapTransition }}>
              {/* España */}
              {SPAIN_PATHS.map((d, i) => (
                <path key={`es-${i}`} d={d}
                      fill={th.landMain}
                      stroke={th.border}
                      strokeWidth="1.2"
                      strokeLinejoin="round"/>
              ))}
              {/* Portugal (con overlay diferenciador) */}
              {PORTUGAL_PATHS.map((d, i) => (
                <g key={`pt-g-${i}`}>
                  <path d={d}
                        fill={th.landMain}
                        stroke={th.border}
                        strokeWidth="1.2"
                        strokeLinejoin="round"/>
                  <path d={d}
                        fill={th.ptFill}
                        stroke={th.ptStroke}
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        strokeLinejoin="round"/>
                </g>
              ))}
              {/* Andorra */}
              {ANDORRA_PATHS.map((d, i) => (
                <path key={`ad-${i}`} d={d}
                      fill={th.landMain}
                      stroke={th.border}
                      strokeWidth="1.0"
                      strokeLinejoin="round"/>
              ))}
              {/* Francia (vecino) */}
              {FRANCE_PATHS.map((d, i) => (
                <path key={`fr-${i}`} d={d}
                      fill={th.landNeighbor}
                      stroke={th.border}
                      strokeWidth="0.8"
                      strokeLinejoin="round"/>
              ))}
              {/* Marruecos (vecino) */}
              {MOROCCO_PATHS.map((d, i) => (
                <path key={`ma-${i}`} d={d}
                      fill={th.landNeighbor}
                      stroke={th.border}
                      strokeWidth="0.8"
                      strokeLinejoin="round"/>
              ))}
            </g>

            {/* ─── CCAA / DISTRITOS (ADMIN_1) — CAPA NUEVA ──────────── */}
            {ALL_ADMIN1_PATHS.length > 0 && (
              <g opacity={simTime >= 8 ? 0.12 : 0.5}
                 style={{ transition: mapTransition }}>
                {ALL_ADMIN1_PATHS.map((d, i) => (
                  <path key={`a1-${i}`} d={d}
                        fill="none"
                        stroke={th.adminBorder}
                        strokeWidth="0.7"
                        strokeLinejoin="round"/>
                ))}
              </g>
            )}

            {/* ─── FRONTERAS INTERNACIONALES ──────────────────────────── */}
            <g opacity={mapOpacity} style={{ transition: mapTransition }}>
              {BORDER_PATHS.map((d, i) => (
                <path key={`brd-${i}`} d={d}
                      fill="none"
                      stroke={th.border}
                      strokeWidth="1.0"
                      strokeDasharray="3 3"/>
              ))}
            </g>

            {/* ─── LÍNEA DE COSTA ────────────────────────────────────── */}
            <g opacity={mapOpacity} style={{ transition: mapTransition }}>
              {COASTLINE_PATHS.map((d, i) => (
                <path key={`cst-${i}`} d={d}
                      fill="none"
                      stroke={th.coastline}
                      strokeWidth="0.8"/>
              ))}
            </g>

            {/* ─── CIUDADES DE REFERENCIA ─────────────────────────────── */}
            <g opacity={simTime >= 8 ? 0.25 : 0.6}
               style={{ transition: mapTransition }}>
              {CITY_POINTS.map((c, i) => (
                <g key={`city-${i}`} transform={`translate(${c.x}, ${c.y})`}>
                  <circle r="2" fill={th.city} />
                  <text x="5" y="3"
                        fontFamily="var(--font-mono, monospace)"
                        fontSize="7.5"
                        fill={th.cityLabel}
                        opacity="0.8">
                    {c.name}
                  </text>
                </g>
              ))}
            </g>

            {/* ─── ARCOS DE PROPAGACIÓN ───────────────────────────────── */}
            {ARCS.map((arc, i) => {
              const src = nodeMap[arc.from];
              const tgt = nodeMap[arc.to];
              if (!src || !tgt) return null;
              const isActive = simTime >= arc.activationTime;
              if (!isActive && arc.type === 'stable') return null;

              const color = th.arcColors[arc.type] || th.arcColors.stable;
              const mx    = (src.x + tgt.x) / 2;
              const dist  = Math.hypot(tgt.x - src.x, tgt.y - src.y);
              const my    = (src.y + tgt.y) / 2 - Math.min(95, dist * 0.23);

              return (
                <g key={`arc-${i}`}>
                  <path
                    d={`M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`}
                    fill="none"
                    stroke={isActive ? color : th.arcInactive}
                    strokeWidth={arc.type === 'stable' ? 1 : (isActive ? 2.5 : 0.8)}
                    strokeDasharray={arc.type === 'stable' ? '5 3' : 'none'}
                    opacity={isActive ? 1 : 0.25}
                  />
                  {arc.label && isActive && (
                    <text x={mx} y={my - 7}
                          fill={color} fontSize="9.5"
                          fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                          textAnchor="middle" fontWeight="600" opacity="0.95">
                      {arc.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* ─── NODOS ELÉCTRICOS ──────────────────────────────────── */}
            {nodes.map(node => {
              const colors    = nc[node.type] || nc.stable;
              const isHovered = hoveredNode === node.id;
              const r = node.type === 'france' ? 13
                      : node.type === 'origin' ? 14
                      : 10;
              const activeFill   = node.isActive ? colors.fill   : th.nodeOff.fill;
              const activeStroke = node.isActive ? colors.stroke : th.nodeOff.stroke;
              const activeLabel  = node.isActive ? colors.label  : th.nodeOff.label;

              return (
                <g key={node.id}
                   style={{ cursor: 'pointer' }}
                   onMouseEnter={() => setHoveredNode(node.id)}
                   onMouseLeave={() => setHoveredNode(null)}>

                  {node.isCollapsing && (
                    <circle cx={node.x} cy={node.y} r={r}
                            fill={colors.fill} opacity="0">
                      <animate attributeName="r"
                               values={`${r};${r+18};${r}`}
                               dur="1.4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity"
                               values="0.55;0;0.55"
                               dur="1.4s" repeatCount="indefinite"/>
                    </circle>
                  )}

                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={activeFill}
                    stroke={activeStroke}
                    strokeWidth={isHovered ? 3 : node.type === 'origin' ? 2.2 : 1.5}
                    filter={node.isCollapsing ? `url(#${ids.glowRed})` : 'none'}
                  />

                  {node.isCollapsing && (
                    <text x={node.x} y={node.y + 4}
                          textAnchor="middle" fontSize="10"
                          fill="#fff" fontWeight="900">!</text>
                  )}

                  <text
                    x={node.x} y={node.y + r + 14}
                    textAnchor="middle" fontSize="9.5"
                    fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                    fill={activeLabel} fontWeight="600">
                    {node.name.split('\n')[0]}
                  </text>
                </g>
              );
            })}

            {/* ─── TOOLTIP ────────────────────────────────────────────── */}
            {hoveredNode && (() => {
              const node = nodeMap[hoveredNode];
              if (!node) return null;
              const lines = node.desc.split('\n');
              const tw    = 212;
              let tx = node.x + 20;
              if (tx + tw > 978) tx = node.x - tw - 20;
              let ty = node.y - 20;
              if (ty < 12) ty = 12;

              return (
                <g>
                  <rect
                    x={tx - 8} y={ty - 14}
                    width={tw + 16} height={lines.length * 14 + 20}
                    rx="5"
                    fill={th.tooltip.bg}
                    stroke={th.tooltip.border}
                    strokeWidth="1"/>
                  {lines.map((line, li) => (
                    <text key={li}
                          x={tx} y={ty + li * 14}
                          fontSize={li === 0 ? 10 : 9}
                          fill={li === 0 ? th.tooltip.title : th.tooltip.body}
                          fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                          fontWeight={li === 0 ? '700' : '400'}>
                      {line}
                    </text>
                  ))}
                </g>
              );
            })()}

            {/* ─── CERO ELÉCTRICO ────────────────────────────────────── */}
            {simTime >= 10 && (
              <g>
                <rect width="1000" height="800" fill={th.collapso}/>
                <text x="500" y="388"
                      textAnchor="middle"
                      fontSize="22"
                      fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                      fontWeight="900"
                      fill={th.collapsoText}
                      filter={`url(#${ids.glowRed})`}
                      opacity="0.90">
                  CERO ELÉCTRICO SISTÉMICO
                </text>
                <text x="500" y="414"
                      textAnchor="middle"
                      fontSize="12"
                      fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                      fill={th.collapsoSub}
                      opacity="0.72">
                  12:33:24 CEST · −15 GW · 60 millones de personas
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* ─── PANEL INFERIOR ────────────────────────────────────────── */}
        <div style={{
          background:          th.panelBg,
          borderTop:           `1px solid ${th.panelBorder}`,
          padding:             '16px 20px',
          display:             'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap:                 '24px',
          alignItems:          'start',
        }}>
          {/* Controles */}
          <div>
            <div style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'space-between',
              marginBottom:    12,
            }}>
              <span style={{
                fontFamily:    'var(--font-mono, monospace)',
                fontSize:      12,
                letterSpacing: '0.10em',
                color:         th.textDanger,
                fontWeight:    700,
              }}>
                CASCADA IBR 28-A
              </span>
              <button onClick={handlePlayPause} style={{
                background:  isPlaying ? th.btnPause.bg    : th.btnPlay.bg,
                border:      `1px solid ${isPlaying ? th.btnPause.border : th.btnPlay.border}`,
                color:       isPlaying ? th.btnPause.color : th.btnPlay.color,
                padding:     '4px 12px',
                borderRadius:4,
                cursor:      'pointer',
                fontSize:    12,
                fontFamily:  'var(--font-mono, monospace)',
                fontWeight:  700,
              }}>
                {simTime >= MAX_TIME ? '↺ REINICIAR' : isPlaying ? '⏸ PAUSA' : '▶ REPRODUCIR'}
              </button>
            </div>

            {/* Barra de tiempo */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                display:         'flex',
                justifyContent:  'space-between',
                fontSize:        10,
                color:           th.textMuted,
                fontFamily:      'var(--font-mono, monospace)',
                marginBottom:    4,
              }}>
                <span>12:32:57</span><span>12:33:27 CEST</span>
              </div>
              <div style={{
                height:       4,
                background:   th.timelineBg,
                borderRadius: 2,
                overflow:     'hidden',
              }}>
                <div style={{
                  height:     '100%',
                  borderRadius:2,
                  width:      `${(simTime / MAX_TIME) * 100}%`,
                  background: th.timelineGrad,
                  transition: 'width 0.8s ease',
                }}/>
              </div>
            </div>

            {/* GW perdidos */}
            <div style={{
              background:   th.gwBg,
              border:       `1px solid ${th.gwBorder}`,
              borderRadius: 6,
              padding:      '10px 14px',
              marginBottom: 12,
              textAlign:    'center',
            }}>
              <div style={{
                fontSize:   32,
                fontWeight: 700,
                lineHeight: 1,
                color:      gwColor,
                fontFamily: 'var(--font-mono, monospace)',
                transition: 'color 0.3s ease',
              }}>
                {gwLost.toFixed(1)}
                <span style={{ fontSize:'0.68rem', color:th.gwUnit, marginLeft:6 }}>
                  GW perdidos
                </span>
              </div>
            </div>

            {/* Leyenda */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 '6px 12px',
              fontSize:            10,
              fontFamily:          'var(--font-mono, monospace)',
            }}>
              {[
                { color: nc.origin.fill,   label: 'Origen colapso' },
                { color: nc.lost.fill,     label: 'Nodo perdido'   },
                { color: nc.stable.fill,   label: 'Nodo estable'   },
                { color: nc.france.fill,   label: 'Francia (RTE)'  },
              ].map(({ color, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{
                    width:10, height:10, borderRadius:'50%',
                    background:color, flexShrink:0,
                  }}/>
                  <span style={{ color: th.legendText }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log de eventos */}
          <div style={{
            background:    th.logBg,
            border:        `1px solid ${th.logBorder}`,
            borderRadius:  6,
            padding:       '10px 12px',
            minHeight:     140,
            maxHeight:     160,
            overflowY:     'auto',
            display:       'flex',
            flexDirection: 'column',
          }}>
            {visibleEvents.length === 0 ? (
              <p style={{
                color:      th.textMuted,
                fontSize:   11,
                fontFamily: 'var(--font-mono, monospace)',
                margin:     0,
              }}>
                Pulsa ▶ para iniciar la simulación
              </p>
            ) : visibleEvents.map((ev, i) => (
              <div key={i} style={{
                fontSize:    11,
                fontFamily:  'var(--font-mono, monospace)',
                color:       i === 0 ? th.logActive : th.logPast,
                borderLeft:  `2px solid ${i === 0 ? th.logBullet : 'transparent'}`,
                paddingLeft: 8,
                marginBottom:8,
                lineHeight:  1.4,
                transition:  'all 0.3s ease',
              }}>
                {ev.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption style={{
        fontSize:   '0.8rem',
        color:      isDark ? '#6b7280' : '#7A7065',
        marginTop:  '0.75rem',
        textAlign:  'center',
        lineHeight: 1.5,
      }}>
        <strong>Simulador interactivo.</strong>{' '}
        Cascada de desconexiones IBR durante el apagón ibérico del 28-A (12:32:57–12:33:27 CEST).
        Pulsa ▶ para reproducir la secuencia. Coloca el cursor sobre los nodos para ver la telemetría ENTSO-E.
      </figcaption>
    </figure>
  );
}
