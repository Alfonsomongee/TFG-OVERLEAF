/**
 * BlackoutPropagationMapData.js
 *
 * Datos del mapa de propagación de la cascada IBR — apagón 28-A.
 * Contiene: proyección, retícula, paletas THEME/NODE_COLORS,
 * subestaciones, arcos de propagación, log de eventos y función GW.
 *
 * FUENTES PRIMARIAS:
 *  - ENTSO-E Expert Panel Final Report, 20 marzo 2026
 *  - REE Informe técnico del incidente, 18 junio 2025
 *  - Comité de Análisis del Gobierno (MITECO), 17 junio 2025
 *
 * CORRECCIONES RESPECTO A VERSIÓN ANTERIOR:
 *
 *  1. ALMARAZ — 'Inercia síncrona' eliminado como explicación causal.
 *     REE confirma explícitamente: "El incidente NO se produjo por un problema
 *     de inercia; se explica desde el balance de potencia reactiva (control de
 *     tensión)." (REE Informe técnico, junio 2025).
 *
 *  2. BADAJOZ — 'Oleas de choque reactiva' no es terminología técnica
 *     estándar del sector eléctrico español/europeo. Sustituido por descripción
 *     verificada contra ENTSO-E Factual Report y REE.
 *
 *  3. ARCOS FR — ZAR→FR (AC) y BAR→FR (HVDC) eran ambos activationTime:8
 *     (simultáneos). Secuencia real verificada:
 *       12:33:21.535 — líneas AC transpirenaicas abren (ANSI 78)
 *       12:33:23.960 — HVDC INELFE desconecta (modo potencia constante)
 *     Fuente: ENTSO-E Expert Panel Final Report (marzo 2026).
 *     Corrección: ZAR→FR activationTime:8, BAR→FR activationTime:9.
 *
 *  4. EVENTS — pérdida de sincronismo (12:33:19) era parte del evento t:8
 *     junto con la apertura AC (12:33:21). Son dos hechos distintos separados
 *     por 2 segundos. Ahora son eventos independientes:
 *       t=7: pérdida sincronismo (12:33:19)
 *       t=8: apertura AC (12:33:21)
 *       t=9: HVDC desconecta (12:33:23) — evento nuevo
 *
 *  5. EVENTS t:6 — Marruecos desconecta (subfrecuencia 48,46 Hz, 12:33:20.473)
 *     añadido. El HVDC PMODE1 era un estado previo al colapso, no un evento
 *     reactivo en ese instante.
 */

// ── Proyección geográfica ─────────────────────────────────────────────────

export const GEO = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
export const VB  = { w: 1000, h: 800 };

/** Equirectangular → coordenadas SVG del viewBox 1000×800. */
export function gp(lat, lon) {
  return {
    x: Math.round(((lon - GEO.west)  / (GEO.east  - GEO.west))  * VB.w),
    y: Math.round(((GEO.north - lat) / (GEO.north - GEO.south)) * VB.h),
  };
}

// ── Retícula cartográfica (meridianos cada 2°lon, paralelos cada 2°lat) ──

const GRATICULE_LONS = [-10, -8, -6, -4, -2, 0, 2, 4];
const GRATICULE_LATS = [36, 38, 40, 42, 44];

function buildGraticulePaths() {
  const lines = [];
  for (const lon of GRATICULE_LONS) {
    const top = gp(GEO.north, lon);
    const bot = gp(GEO.south, lon);
    lines.push({
      d:      `M${top.x},${top.y} L${bot.x},${bot.y}`,
      label:  `${Math.abs(lon)}°${lon < 0 ? 'W' : lon > 0 ? 'E' : ''}`,
      lx: top.x, ly: 14, anchor: 'middle',
    });
  }
  for (const lat of GRATICULE_LATS) {
    const left  = gp(lat, GEO.west);
    const right = gp(lat, GEO.east);
    lines.push({
      d:      `M${left.x},${left.y} L${right.x},${right.y}`,
      label:  `${lat}°N`,
      lx: 18, ly: left.y - 4, anchor: 'start',
    });
  }
  return lines;
}

/** Pre-computado una sola vez al importar el módulo. */
export const GRATICULE = buildGraticulePaths();

// ── Paleta — nodos eléctricos ─────────────────────────────────────────────

export const NODE_COLORS = {
  dark: {
    origin:   { fill: '#ef4444', stroke: '#fca5a5', label: '#fca5a5' },
    lost:     { fill: '#f97316', stroke: '#fdba74', label: '#fdba74' },
    stable:   { fill: '#10b981', stroke: '#6ee7b7', label: '#6ee7b7' },
    portugal: { fill: '#f59e0b', stroke: '#fcd34d', label: '#fcd34d' },
    france:   { fill: '#3b82f6', stroke: '#93c5fd', label: '#93c5fd' },
  },
  light: {
    origin:   { fill: '#C41E30', stroke: '#8B1423', label: '#7B1020' },
    lost:     { fill: '#C2500A', stroke: '#7C2D12', label: '#6C2510' },
    stable:   { fill: '#166534', stroke: '#14532D', label: '#0D4524' },
    portugal: { fill: '#B45309', stroke: '#78350F', label: '#6A2D08' },
    france:   { fill: '#1D4ED8', stroke: '#1E3A8A', label: '#18307A' },
  },
};

// ── Tema general — fondos, textos, arcos, mapa ───────────────────────────

export const THEME = {
  dark: {
    wrapBg:       'rgba(5,10,20,0.98)',
    wrapBorder:   'rgba(0,217,255,0.15)',
    panelBg:      'rgba(5,10,20,0.96)',
    panelBorder:  'rgba(0,217,255,0.18)',
    logBg:        'rgba(0,0,0,0.25)',
    logBorder:    'rgba(0,217,255,0.07)',
    textPrimary:  '#e2e8f0',
    textSec:      '#94a3b8',
    textMuted:    '#4b5563',
    textDanger:   '#ef4444',
    gwBg:         'rgba(239,68,68,0.07)',
    gwBorder:     'rgba(239,68,68,0.22)',
    gwUnit:       '#94a3b8',
    timelineBg:   'rgba(239,68,68,0.10)',
    timelineGrad: 'linear-gradient(90deg,#f59e0b,#ef4444)',
    btnPlay:      { bg: 'rgba(0,217,255,0.12)',  border: '#00d9ff', color: '#00d9ff' },
    btnPause:     { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444', color: '#ef4444' },
    legendText:   '#6b7280',
    logActive:    '#e2e8f0',
    logPast:      '#4b5563',
    logBullet:    '#ef4444',
    ocean:        '#051021',
    landMain:     '#1C3252',
    landNeighbor: '#10263B',
    coastline:    '#29415F',
    border:       '#29415F',
    adminBorder:  '#213754',
    city:         '#8FA8B7',
    cityLabel:    'rgba(210,224,232,0.50)',
    gridLine:     'rgba(255,255,255,0.06)',
    gridLabel:    'rgba(255,255,255,0.14)',
    shadow:       'rgba(0,0,0,0.22)',
    ptFill:       'rgba(255,170,0,0.08)',
    ptStroke:     'rgba(255,170,0,0.40)',
    arcColors:    { cascade: '#ef4444', oscillation: '#f59e0b', sync: '#3b82f6', stable: 'rgba(0,217,255,0.18)' },
    arcInactive:  'rgba(0,217,255,0.06)',
    nodeOff:      { fill: 'rgba(12,22,44,0.80)', stroke: 'rgba(0,217,255,0.10)', label: '#374151' },
    tooltip:      { bg: 'rgba(5,10,20,0.96)', border: 'rgba(0,217,255,0.35)', title: '#00d9ff', body: '#94a3b8' },
    collapso:     'rgba(239,68,68,0.07)',
    collapsoText: '#ef4444',
    collapsoSub:  '#fca5a5',
  },
  light: {
    wrapBg:       '#F4F1EA',
    wrapBorder:   'rgba(139,38,53,0.20)',
    panelBg:      '#EDE9DF',
    panelBorder:  'rgba(139,38,53,0.16)',
    logBg:        'rgba(0,0,0,0.03)',
    logBorder:    'rgba(139,38,53,0.10)',
    textPrimary:  '#1A1410',
    textSec:      '#4A4035',
    textMuted:    '#7A7065',
    textDanger:   '#C41E30',
    gwBg:         'rgba(196,30,48,0.06)',
    gwBorder:     'rgba(196,30,48,0.22)',
    gwUnit:       '#7A7065',
    timelineBg:   'rgba(196,30,48,0.08)',
    timelineGrad: 'linear-gradient(90deg,#B45309,#C41E30)',
    btnPlay:      { bg: 'rgba(29,53,87,0.08)',  border: '#1D3557', color: '#1D3557' },
    btnPause:     { bg: 'rgba(196,30,48,0.10)', border: '#C41E30', color: '#C41E30' },
    legendText:   '#7A7065',
    logActive:    '#1A1410',
    logPast:      '#7A7065',
    logBullet:    '#C41E30',
    ocean:        '#F3EFE7',
    landMain:     '#ECE6DB',
    landNeighbor: '#E7E9E1',
    coastline:    '#D6CEC0',
    border:       '#D6CEC0',
    adminBorder:  '#E2DBCF',
    city:         '#7D8577',
    cityLabel:    'rgba(60,67,58,0.56)',
    gridLine:     'rgba(0,0,0,0.06)',
    gridLabel:    'rgba(0,0,0,0.16)',
    shadow:       'rgba(0,0,0,0.07)',
    ptFill:       'rgba(160,100,0,0.09)',
    ptStroke:     'rgba(130,80,0,0.38)',
    arcColors:    { cascade: '#DC2626', oscillation: '#D97706', sync: '#2563EB', stable: 'rgba(29,53,87,0.16)' },
    arcInactive:  'rgba(90,100,120,0.12)',
    nodeOff:      { fill: 'rgba(195,188,175,0.82)', stroke: 'rgba(100,110,130,0.30)', label: '#A09585' },
    tooltip:      { bg: 'rgba(244,241,234,0.98)', border: 'rgba(139,38,53,0.35)', title: '#8B2635', body: '#4A4035' },
    collapso:     'rgba(196,30,48,0.05)',
    collapsoText: '#C41E30',
    collapsoSub:  '#8B1423',
  },
};

// ── Subestaciones ─────────────────────────────────────────────────────────
//
// `desc` usa '\n' para separación de líneas (se hace split() en NodeTooltip).
// `type` — 'origin' | 'lost' | 'stable' | 'portugal' | 'france'

export const STATIONS = [
  {
    id: 'GRN', lat: 37.2661, lon: -3.658,
    name: 'Caparacena (Granada)', type: 'origin', activationTime: 0,
    desc: 'DISPARO RAÍZ — 12:32:57 CEST\nTrafo 400/220 kV · protección sobretensión 220 kV\nTensión colector: 242 kV (1,10 p.u.)\nPérdida: −355 MW, −165 MVAr (ENTSO-E p.28)',
  },
  {
    id: 'BAD', lat: 38.88, lon: -6.97,
    name: 'Badajoz', type: 'lost', activationTime: 3,
    // CORRECCIÓN: eliminado 'Oleas de choque reactiva' — terminología no estándar.
    desc: 'CASCADA — 12:33:16 CEST\nDos subestaciones 400 kV: −727 MW\nFV + termosolar · tensión: 435,4 kV\nCausas: parcialmente indeterminadas (ENTSO-E)',
  },
  {
    id: 'SEV', lat: 37.3824, lon: -5.9126,
    name: 'Alcores (Sevilla)', type: 'lost', activationTime: 4,
    desc: '12:33:17 CEST\nCascada sur: Sevilla + Huelva\n−550 MW desconectados\nProtecciones ANSI 59 por sobretensión',
  },
  {
    id: 'SEG', lat: 40.95, lon: -4.12,
    name: 'Segovia', type: 'lost', activationTime: 4,
    desc: '12:33:17 CEST\nCascada norte-centro: Segovia + Cáceres\nProtecciones ANSI 59 activas\nTensión >440 kV en barras colectoras',
  },
  {
    id: 'ALM', lat: 39.8167, lon: -5.6833,
    name: 'C.N. Almaraz (Cáceres)', type: 'stable', activationTime: 0,
    // CORRECCIÓN: eliminado framing 'Inercia síncrona' como causa de estabilidad.
    // REE: "El incidente NO se produjo por un problema de inercia; se explica desde
    // el balance de potencia reactiva (control de tensión)." (jun 2025)
    desc: 'Central nuclear · 2 × 1.066 MW\nParo automático en colapso final\nProblema del incidente: tensión reactiva\nNo fue un problema de inercia (REE, jun 2025)',
  },
  {
    id: 'MAD', lat: 40.31, lon: -3.5,
    name: 'Madrid Sur / Morata', type: 'stable', activationTime: 0,
    desc: 'Nudo central · último en contener\nFrecuencia cayó a 48,7 Hz\nDeslastre escalonado activo (6 niveles)\nSeis escalones fallaron uno a uno',
  },
  {
    id: 'ZAR', lat: 41.65, lon: -0.88,
    name: 'Nudo Aragón (Zaragoza)', type: 'stable', activationTime: 0,
    desc: 'Puente transpirenaico AC\nIntentos de importación desde Francia\nSeparación AC ANSI 78: 12:33:21 CEST',
  },
  {
    id: 'BAR', lat: 41.4833, lon: 2.0167,
    name: 'Rubí (Barcelona)', type: 'stable', activationTime: 0,
    desc: 'Conexión AC + HVDC INELFE\nHVDC: 1.000 MW modo potencia constante\nSeparación HVDC: 12:33:23 CEST (último enlace)',
  },
  {
    id: 'LIS', lat: 38.7223, lon: -9.1393,
    name: 'Lisboa (REN)', type: 'portugal', activationTime: 5,
    desc: '12:33:10 CEST\nOscilaciones inter-área: 0,21 Hz\nPortugal totalmente afectado\nBlack Start: Tapada do Outeiro (Tejo)',
  },
  {
    id: 'POR', lat: 41.1579, lon: -8.6291,
    name: 'Porto (REN)', type: 'portugal', activationTime: 0,
    desc: 'Red portuguesa norte\nColapsó con el sistema ibérico\nBlack Start desde norte Portugal',
  },
  {
    id: 'FR', lat: 42.8, lon: 2.0,
    name: 'Interconexión Francia', type: 'france', activationTime: 8,
    // FR activa en t=8 (apertura AC 12:33:21).
    // HVDC desconecta a t=9 (12:33:23) — ver arc BAR→FR.
    desc: 'Separación en dos fases:\nAC transpirenaico: abre 12:33:21 (ANSI 78)\nHVDC INELFE: desconecta 12:33:23\nImpidió propagación al continente europeo',
  },
];

// ── Arcos de propagación ──────────────────────────────────────────────────
//
// `type` — 'cascade' | 'oscillation' | 'sync' | 'stable'
// Los arcos de tipo 'stable' no se renderizan si isActive=false (ver componente).

export const ARCS = [
  { from: 'GRN', to: 'SEV', activationTime: 2, type: 'cascade',     label: 'Sobretensión' },
  { from: 'GRN', to: 'BAD', activationTime: 2, type: 'cascade',     label: 'Cascada'      },
  { from: 'BAD', to: 'LIS', activationTime: 5, type: 'oscillation', label: '0,21 Hz'      },
  { from: 'GRN', to: 'SEG', activationTime: 3, type: 'cascade',     label: 'Cascada'      },
  { from: 'MAD', to: 'ZAR', activationTime: 0, type: 'stable',      label: ''             },
  { from: 'ZAR', to: 'BAR', activationTime: 0, type: 'stable',      label: ''             },
  // CORRECCIÓN: AC abre PRIMERO (12:33:21, t=8), HVDC DESPUÉS (12:33:23, t=9).
  // Original tenía ambos en activationTime:8 — simultáneos e incorrectos.
  { from: 'ZAR', to: 'FR',  activationTime: 8, type: 'sync',        label: 'AC abre'      },
  { from: 'BAR', to: 'FR',  activationTime: 9, type: 'sync',        label: 'HVDC'         },
];

// ── Log de eventos ────────────────────────────────────────────────────────
//
// CORRECCIONES:
//   t=7: PÉRDIDA DE SINCRONISMO (12:33:19) — evento propio, era parte de t=8
//   t=8: apertura AC (12:33:21) — separado del sincronismo
//   t=9: HVDC desconecta (12:33:23) — evento nuevo
//   t=6: Marruecos desconexión añadida (subfrecuencia 48,46 Hz, 12:33:20)

export const EVENTS = [
  { t: 0,  msg: '12:32:57 CEST — DISPARO RAÍZ: Caparacena (Granada). Trafo 400/220 kV. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t: 2,  msg: '12:33:00 CEST — Cascada FV: Badajoz y sur activan protecciones ANSI 59 (sobretensión >435 kV).' },
  { t: 3,  msg: '12:33:05 CEST — Segovia y zona norte-centro afectadas. Tensión >440 kV en barras colectoras.' },
  { t: 5,  msg: '12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). REN alerta.' },
  { t: 6,  msg: '12:33:18–20 CEST — Pérdida total >2,5 GW. Marruecos desconecta por subfrecuencia (48,46 Hz).' },
  // CORRECCIÓN: pérdida de sincronismo es un evento propio (12:33:19) — separado de la apertura AC
  { t: 7,  msg: '12:33:19 CEST — PÉRDIDA DE SINCRONISMO. España–Portugal empiezan a desacoplarse del continente.' },
  // CORRECCIÓN: apertura AC separada del sincronismo
  { t: 8,  msg: '12:33:21 CEST — Apertura enlaces AC transpirenaicos (ANSI 78). AC desconecta PRIMERO.' },
  // CORRECCIÓN: HVDC como evento propio (antes mezclado con AC)
  { t: 9,  msg: '12:33:23 CEST — HVDC INELFE desconecta. Sistema ibérico completamente aislado de Europa.' },
  { t: 10, msg: '12:33:30 CEST — CERO ELÉCTRICO SISTÉMICO. −15 GW en 33 segundos. >50 millones de personas.' },
];

// ── GW perdidos por simTime ───────────────────────────────────────────────

export function getGwLost(simTime) {
  if (simTime >= 10) return 15.0;
  if (simTime >= 8)  return 12.0;
  if (simTime >= 6)  return 8.0;
  if (simTime >= 4)  return 3.5;
  if (simTime >= 2)  return 1.2;
  return 0;
}
