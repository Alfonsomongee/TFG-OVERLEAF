import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

// ════════════════════════════════════════════════════════════════════
// PROYECCIÓN GEOGRÁFICA Y PATHS VECTORIALES
// ════════════════════════════════════════════════════════════════════
const GEO = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VB  = { w: 1000, h: 800 };

function gp(lat, lon) {
  return {
    x: Math.round(((lon - GEO.west)  / (GEO.east  - GEO.west))  * VB.w),
    y: Math.round(((GEO.north - lat) / (GEO.north - GEO.south)) * VB.h),
  };
}

function toPath(pts) {
  return pts.map(([lat, lon], i) => {
    const { x, y } = gp(lat, lon);
    return `${i ? 'L' : 'M'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_OUTLINE = [
  [43.78,-7.86],[43.47,-8.45],[42.88,-9.28],[42.03,-8.87],[41.87,-8.87],
  [41.38,-8.73],[40.64,-8.75],[39.36,-9.40],[38.62,-9.50],[37.01,-8.91],
  [36.97,-7.85],[36.01,-5.61],[36.17,-5.36],[36.69,-4.41],[36.72,-3.48],
  [37.20,-1.90],[37.64,-0.69],[38.68, 0.23],[39.58, 0.34],[40.72, 0.73],
  [41.29, 1.83],[41.42, 2.22],[42.43, 3.16],[42.80, 1.72],[43.37,-1.79],
  [43.49,-3.80],[43.57,-5.66],[43.78,-7.86],
];

const PORTUGAL_OUTLINE = [
  [41.87,-8.87],[41.52,-6.92],[39.67,-7.06],[37.43,-7.44],[36.97,-7.85],
  [37.01,-8.91],[38.62,-9.50],[39.36,-9.40],[40.64,-8.75],[41.38,-8.73],
  [41.87,-8.87],
];

const MALLORCA_OUTLINE = [
  [39.96,3.22],[39.89,2.32],[39.27,2.84],[39.25,3.48],[39.78,3.47],[39.96,3.22],
];

const IBERIA_PATH   = toPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = toPath(PORTUGAL_OUTLINE);
const BALEARES_PATH = toPath(MALLORCA_OUTLINE);

// ════════════════════════════════════════════════════════════════════
// SUBESTACIONES Y NUDOS (coordenadas reales verificadas)
// ════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════
// ARCOS DE PROPAGACIÓN
// ════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════
// LOG DE EVENTOS FORENSE
// ════════════════════════════════════════════════════════════════════
const EVENTS = [
  { t:0,  msg:'12:32:57 CEST — DISPARO RAÍZ: Caparacena (Granada). Trafo 400/220 kV. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t:2,  msg:'12:33:00 CEST — Cascada: plantas FV Badajoz y Sevilla cruzan umbral ANSI 59 (>435 kV).' },
  { t:3,  msg:'12:33:05 CEST — Segovia y zona norte-centro afectadas. Tensión >440 kV en barras colectoras.' },
  { t:5,  msg:'12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). REN alerta.' },
  { t:6,  msg:'12:33:18 CEST — Frecuencia cae a 48,46 Hz. HVDC INELFE mantiene 1.000 MW PMODE1.' },
  { t:8,  msg:'12:33:21 CEST — PÉRDIDA DE SINCRONISMO. ANSI 78 abre enlaces AC transpirenaicos.' },
  { t:10, msg:'12:33:24 CEST — CERO ELÉCTRICO SISTÉMICO. −15 GW en 30 segundos.' },
];

// ════════════════════════════════════════════════════════════════════
// SISTEMA DE COLOR DUAL
// ════════════════════════════════════════════════════════════════════

// Colores de nodo por tipo y modo — el schema dark es vivaz sobre fondo navy,
// el light usa tonos más oscuros y saturados para legibilidad sobre fondo crema
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
    // Contenedor
    wrapBg:         'rgba(5,10,20,0.98)',
    wrapBorder:     'rgba(0,217,255,0.15)',
    // Panel inferior
    panelBg:        'rgba(5,10,20,0.96)',
    panelBorder:    'rgba(0,217,255,0.18)',
    // Log
    logBg:          'rgba(0,0,0,0.25)',
    logBorder:      'rgba(0,217,255,0.07)',
    // Texto general
    textPrimary:    '#e2e8f0',
    textSec:        '#94a3b8',
    textMuted:      '#4b5563',
    textDanger:     '#ef4444',
    // GW counter
    gwBg:           'rgba(239,68,68,0.07)',
    gwBorder:       'rgba(239,68,68,0.22)',
    gwUnit:         '#94a3b8',
    // Timeline
    timelineBg:     'rgba(239,68,68,0.10)',
    timelineGrad:   'linear-gradient(90deg,#f59e0b,#ef4444)',
    // Botón
    btnPlay:  { bg:'rgba(0,217,255,0.12)',  border:'#00d9ff', color:'#00d9ff' },
    btnPause: { bg:'rgba(239,68,68,0.15)',  border:'#ef4444', color:'#ef4444' },
    // Leyenda
    legendText:     '#6b7280',
    // Log de eventos
    logActive:      '#e2e8f0',
    logPast:        '#4b5563',
    logBullet:      '#ef4444',
    // Mapa SVG
    ocean:          '#081629',          // fondo oceánico azul profundo (contraste mejorado con tierra)
    landGradA:      '#142c4a',
    landGradB:      '#0b1827',
    landStroke:     'rgba(56,189,248,0.25)',
    gridLine:       'rgba(255,255,255,0.03)',
    relief:         'rgba(255,255,255,0.04)',
    shadow:         'rgba(0,0,0,0.22)',
    ptFill:         'rgba(255,170,0,0.08)',
    ptStroke:       'rgba(255,170,0,0.40)',
    // Arcos
    arcColors:      { cascade:'#ef4444', oscillation:'#f59e0b', sync:'#3b82f6', stable:'rgba(0,217,255,0.18)' },
    arcInactive:    'rgba(0,217,255,0.06)',
    // Nodo inactivo
    nodeOff:        { fill:'rgba(12,22,44,0.80)', stroke:'rgba(0,217,255,0.10)', label:'#374151' },
    // Tooltip
    tooltip:        { bg:'rgba(5,10,20,0.96)', border:'rgba(0,217,255,0.35)', title:'#00d9ff', body:'#94a3b8' },
    // Overlay colapso
    collapso:       'rgba(239,68,68,0.07)',
    collapsoText:   '#ef4444',
    collapsoSub:    '#fca5a5',
  },
  light: {
    // Contenedor
    wrapBg:         '#F4F1EA',
    wrapBorder:     'rgba(139,38,53,0.20)',
    // Panel inferior
    panelBg:        '#EDE9DF',
    panelBorder:    'rgba(139,38,53,0.16)',
    // Log
    logBg:          'rgba(0,0,0,0.03)',
    logBorder:      'rgba(139,38,53,0.10)',
    // Texto general
    textPrimary:    '#1A1410',
    textSec:        '#4A4035',
    textMuted:      '#7A7065',
    textDanger:     '#C41E30',
    // GW counter
    gwBg:           'rgba(196,30,48,0.06)',
    gwBorder:       'rgba(196,30,48,0.22)',
    gwUnit:         '#7A7065',
    // Timeline
    timelineBg:     'rgba(196,30,48,0.08)',
    timelineGrad:   'linear-gradient(90deg,#B45309,#C41E30)',
    // Botón
    btnPlay:  { bg:'rgba(29,53,87,0.08)',   border:'#1D3557', color:'#1D3557' },
    btnPause: { bg:'rgba(196,30,48,0.10)',  border:'#C41E30', color:'#C41E30' },
    // Leyenda
    legendText:     '#7A7065',
    // Log de eventos
    logActive:      '#1A1410',
    logPast:        '#7A7065',
    logBullet:      '#C41E30',
    // Mapa SVG
    ocean:          '#C4D8E4',          // fondo oceánico azul-gris claro (Atlántico/Mediterráneo)
    landGradA:      '#F0ECE1',
    landGradB:      '#D6CEBC',
    landStroke:     'rgba(90,100,120,0.28)',
    gridLine:       'rgba(0,0,0,0.045)',
    relief:         'rgba(0,0,0,0.028)',
    shadow:         'rgba(0,0,0,0.07)',
    ptFill:         'rgba(160,100,0,0.09)',
    ptStroke:       'rgba(130,80,0,0.38)',
    // Arcos — saturados para legibilidad sobre fondo crema
    arcColors:      { cascade:'#DC2626', oscillation:'#D97706', sync:'#2563EB', stable:'rgba(29,53,87,0.16)' },
    arcInactive:    'rgba(90,100,120,0.12)',
    // Nodo inactivo
    nodeOff:        { fill:'rgba(195,188,175,0.82)', stroke:'rgba(100,110,130,0.30)', label:'#A09585' },
    // Tooltip
    tooltip:        { bg:'rgba(244,241,234,0.98)', border:'rgba(139,38,53,0.35)', title:'#8B2635', body:'#4A4035' },
    // Overlay colapso
    collapso:       'rgba(196,30,48,0.05)',
    collapsoText:   '#C41E30',
    collapsoSub:    '#8B1423',
  },
};

// ════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// (BrowserOnly eliminado — el padre BlackoutPropagationMap.jsx ya lo gestiona
//  via React.lazy + BrowserOnly + Suspense)
// ════════════════════════════════════════════════════════════════════
export default function BlackoutPropagationMapBase() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const th = THEME[isDark ? 'dark' : 'light'];
  const nc = NODE_COLORS[isDark ? 'dark' : 'light'];

  // IDs únicos por instancia — evita colisiones de defs SVG en páginas
  // con múltiples instancias del componente
  const uid = useRef(`bpm-${Math.random().toString(36).slice(2, 7)}`).current;
  const ids = {
    landGrad:   `${uid}-lg`,
    relief:     `${uid}-rf`,
    glowRed:    `${uid}-gr`,
    clipIberia: `${uid}-ci`,
  };

  const [simTime,     setSimTime]     = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 12;

  // setTimeout chain — más limpio que setInterval con simTime como dep
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

  // Color del GW counter escalonado por severidad
  const gwColor = gwLost >= 10 ? th.textDanger
    : gwLost >= 5  ? (isDark ? '#f97316' : '#C2500A')
    : gwLost >= 1  ? (isDark ? '#f59e0b' : '#B45309')
    : th.textMuted;

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

        {/* ── SVG MAPA ── */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            viewBox="0 0 1000 800"
            style={{ width: '100%', display: 'block' }}
            aria-label="Mapa interactivo de la cascada de desconexiones IBR durante el apagón ibérico del 28-A"
          >
            <defs>
              {/* Filtro de resplandor rojo — nodos en colapso y texto final */}
              <filter id={ids.glowRed}
                x="-50" y="-50" width="1100" height="900"
                filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              {/* Clip de la masa continental ibérica */}
              <clipPath id={ids.clipIberia}>
                <path d={IBERIA_PATH}/>
                <path d={PORTUGAL_PATH}/>
                <path d={BALEARES_PATH}/>
              </clipPath>

              {/* Gradiente radial de tierra — dark: navy, light: crema */}
              <radialGradient id={ids.landGrad}
                cx="450" cy="360" r="520"
                gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor={th.landGradA}/>
                <stop offset="100%" stopColor={th.landGradB}/>
              </radialGradient>

              {/* Filtro de sombra para relieve topográfico */}
              <filter id={ids.relief}
                x="-50" y="-50" width="1100" height="900"
                filterUnits="userSpaceOnUse">
                <feDropShadow dx="1.5" dy="2" stdDeviation="2.5"
                  floodColor={th.shadow} floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* Fondo oceánico — Atlántico + Mediterráneo */}
            <rect width="1000" height="800" fill={th.ocean}/>

            {/* Masa de tierra */}
            <g filter={`url(#${ids.relief})`}
               opacity={simTime >= 8 ? 0.38 : 1}
               style={{ transition: 'opacity 1.2s ease' }}>
              <path d={IBERIA_PATH}
                    fill={`url(#${ids.landGrad})`}
                    stroke={th.landStroke}
                    strokeWidth="1.2"
                    strokeLinejoin="round"/>
              {/* Portugal — borde punteado diferenciador */}
              <path d={PORTUGAL_PATH}
                    fill={th.ptFill}
                    stroke={th.ptStroke}
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    strokeLinejoin="round"/>
              <path d={BALEARES_PATH}
                    fill={`url(#${ids.landGrad})`}
                    stroke={th.landStroke}
                    strokeWidth="1.2"
                    strokeLinejoin="round"/>
            </g>

            {/* Líneas de relieve topográfico */}
            <g clipPath={`url(#${ids.clipIberia})`}
               opacity={simTime >= 8 ? 0.10 : 0.42}
               style={{ transition: 'opacity 1.2s ease' }}>
              {Array.from({ length: 18 }, (_, i) => (
                <path key={i}
                  d={`M ${80+i*40} ${60+i*25} C ${400+i*15} ${100+i*10}, ${600-i*20} ${500-i*15}, ${200+i*30} ${600-i*20}`}
                  fill="none" stroke={th.relief}
                  strokeWidth="1.8" strokeDasharray="8 6"/>
              ))}
            </g>

            {/* Grid cartográfico de referencia */}
            <g clipPath={`url(#${ids.clipIberia})`}
               opacity={simTime >= 8 ? 0.10 : 0.55}
               style={{ transition: 'opacity 1.2s ease' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <line key={`h${i}`}
                  x1={0} y1={(800/12)*i} x2={1000} y2={(800/12)*i}
                  stroke={th.gridLine} strokeWidth="0.8"/>
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <line key={`v${i}`}
                  x1={(1000/14)*i} y1={0} x2={(1000/14)*i} y2={800}
                  stroke={th.gridLine} strokeWidth="0.8"/>
              ))}
            </g>

            {/* ── ARCOS DE PROPAGACIÓN ── */}
            {ARCS.map((arc, i) => {
              const src = nodeMap[arc.from];
              const tgt = nodeMap[arc.to];
              if (!src || !tgt) return null;
              const isActive = simTime >= arc.activationTime;
              if (!isActive && arc.type === 'stable') return null;

              const color = th.arcColors[arc.type] || th.arcColors.stable;
              const mx    = (src.x + tgt.x) / 2;
              // Curvatura proporcional a la longitud del arco (antes era -30 fijo)
              const dist  = Math.hypot(tgt.x - src.x, tgt.y - src.y);
              const my    = (src.y + tgt.y) / 2 - Math.min(95, dist * 0.23);

              return (
                <g key={i}>
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

            {/* ── NODOS ── */}
            {nodes.map(node => {
              const colors    = nc[node.type] || nc.stable;
              const isHovered = hoveredNode === node.id;
              const r = node.type === 'france'  ? 13
                      : node.type === 'origin'  ? 14
                      : 10;
              const activeFill   = node.isActive ? colors.fill   : th.nodeOff.fill;
              const activeStroke = node.isActive ? colors.stroke : th.nodeOff.stroke;
              const activeLabel  = node.isActive ? colors.label  : th.nodeOff.label;

              return (
                <g key={node.id}
                   style={{ cursor: 'pointer' }}
                   onMouseEnter={() => setHoveredNode(node.id)}
                   onMouseLeave={() => setHoveredNode(null)}>

                  {/* Pulso de alarma — corregido: fill en el elemento, no en animate */}
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

                  {/* Círculo principal del nodo */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={activeFill}
                    stroke={activeStroke}
                    strokeWidth={isHovered ? 3 : node.type === 'origin' ? 2.2 : 1.5}
                    filter={node.isCollapsing ? `url(#${ids.glowRed})` : 'none'}
                  />

                  {/* Signo de alerta en nodos en colapso */}
                  {node.isCollapsing && (
                    <text x={node.x} y={node.y + 4}
                          textAnchor="middle" fontSize="10"
                          fill="#fff" fontWeight="900">!</text>
                  )}

                  {/* Etiqueta del nodo */}
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

            {/* ── TOOLTIP DE TELEMETRÍA ── */}
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

            {/* ── OVERLAY: COLAPSO ELÉCTRICO TOTAL ── */}
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

        {/* ── PANEL INFERIOR ── */}
        <div style={{
          background:          th.panelBg,
          borderTop:           `1px solid ${th.panelBorder}`,
          padding:             '16px 20px',
          display:             'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap:                 '24px',
          alignItems:          'start',
        }}>

          {/* COLUMNA IZQUIERDA: controles y métricas */}
          <div>
            {/* Cabecera + botón */}
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

            {/* Barra temporal 12:32:57 → 12:33:27 */}
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

            {/* Contador de potencia perdida */}
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

            {/* Leyenda — usa nc.*.fill para consistencia dual-mode */}
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
                    width:        10,
                    height:       10,
                    borderRadius: '50%',
                    background:   color,
                    flexShrink:   0,
                  }}/>
                  <span style={{ color: th.legendText }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: log forense de eventos */}
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

      {/* Pie de figura */}
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
