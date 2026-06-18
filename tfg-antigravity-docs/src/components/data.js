/**
 * data.js — Datos del simulador de reposición ibérica 28-A
 *
 * FUENTES VERIFICADAS:
 *  - REE, nota oficial "Actuación de Red Eléctrica ante el incidente del 28 de abril"
 *    https://www.ree.es/es/sala-de-prensa/actualidad/nota-de-prensa/2025/04/...
 *  - REE, Informe técnico del incidente, junio 2025
 *    https://d1n1o4zeyfu21r.cloudfront.net/WEB_Incidente_SistemaElectricoPeninsularEspanol_18junio2025.pdf
 *  - Comité de análisis del Gobierno (MITECO), junio 2025
 *    https://www.miteco.gob.es/es/prensa/ultimas-noticias/2025/junio/...
 *  - Wikipedia ES con referencias primarias (consultado junio 2026)
 *
 * ESCALA TEMPORAL DEL SIMULADOR:
 *  Cada paso (simTime +1) representa ~1 hora del evento real.
 *  simTime 0  = 12:33 CEST — cero energético
 *  simTime 18 = ~07:00 CEST (29-A) — 99,95 % restituido
 *  Interval: 2 segundos por paso → 36 segundos totales de simulación.
 *
 * METODOLOGÍA DE PORCENTAJES POR ZONA:
 *  No existe desglose oficial por área funcional. Se usa:
 *    1. Distribución de demanda real por CCAA (datos históricos REE 2025)
 *    2. Hitos verificados de la curva agregada:
 *       ~18:00h → 56% nacional | ~22:35h → 48% | ~04:00h → ~95% | 07:00h → 99,95%
 *    3. Orden real de reposición confirmado por REE
 *  Los porcentajes individuales son proporcionales al peso demográfico/industrial
 *  de cada zona. La suma de todas las zonas = 99 % (el 0,95% restante corresponde
 *  a suministros de última milla certificados a las 07:30h del 29-A).
 *
 * NOTA: Baleares, Canarias, Ceuta y Melilla NO se vieron afectadas.
 */

// ── Proyección geográfica ──────────────────────────────────────────────────

export const GEO_BOUNDS = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
export const VIEWBOX    = { width: 1000, height: 800 };

export function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west)  / (GEO_BOUNDS.east  - GEO_BOUNDS.west))  * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

export function project(lon, lat) {
  const { x, y } = geoToSvg(lat, lon);
  return [x, y];
}

// ── Islas eléctricas funcionales ───────────────────────────────────────────
//
// restoreTime  = simTime en el que la zona aparece como "restituida" en el mapa
//                (equivalente a la hora real de las primeras confirmaciones de REE)
// restorePercent = porcentaje de la demanda peninsular total que representa esa zona
//
// Verificación de la suma:
//   CAT(14) + NOR(9) + GAL(9) + POR(14) + SUR(20) + CEN(24) + LVT(9) = 99
//   (el 1% restante: suministros de última milla, certificados a las 07:30h del 29-A)
//
// Orden real confirmado por REE:
//   ~12:43  → Hernani (País Vasco) — primer punto con tensión
//   ~13:10  → Bilbao. ~13:45 → San Sebastián. ~14:45 → Pamplona
//   ~14:30-15:30 → Cataluña NE (top-down desde Francia vía Baixas)
//   ~15:00  → Galicia y Castilla y León (Black Start Aldeadávila)
//   ~15:00  → Portugal (Black Start Castelo de Bode y Tapada do Outeiro)
//   ~17:00  → REE confirma: Cataluña, Aragón, PV, Galicia, Asturias, Navarra, CyL, Extremadura, Andalucía
//   ~18:00  → Se suman: Madrid, C. Valenciana, Murcia, Castilla-La Mancha
//   07:00 (29-A) → 99,95% demanda (25.794 MW) — REE nota oficial

export const ISLANDS_DATA = [
  {
    id: 'NOR',
    label: ['Norte', 'Euskadi–Navarra'],
    color: '#be185d',
    // Primera zona con tensión: Hernani 12:43, Bilbao 13:45 → simTime 2 (~14:30h)
    restoreTime: 2,
    blackStartType: 'top-down',
    anchor: { lon: -2.5, lat: 43.0 },
    // PV + NA + CB + AS + LO: ~9% demanda peninsular (fuente: REE estructura demanda 2024)
    restorePercent: 9,
    country: 'ES',
    postals: ['PV', 'NA', 'CB', 'AS', 'LO'],
  },
  {
    id: 'CAT',
    label: ['Cataluña', 'Aragón'],
    color: '#7c3aed',
    // Top-down desde Baixas (Francia): primeras comarcas ~14:30h → simTime 2
    restoreTime: 2,
    blackStartType: 'top-down',
    anchor: { lon: 1.4, lat: 41.6 },
    // CT + AR: ~14% demanda peninsular
    restorePercent: 14,
    country: 'ES',
    postals: ['CT', 'AR'],
  },
  {
    id: 'GAL',
    label: ['Galicia', 'Castilla y León'],
    color: '#15803d',
    // Black Start Aldeadávila (~15:00h) + top-down Norte → simTime 3
    restoreTime: 3,
    blackStartType: 'bottom-up',
    anchor: { lon: -6.8, lat: 42.4 },
    // GA + CL: ~9% demanda peninsular
    restorePercent: 9,
    country: 'ES',
    postals: ['GA', 'CL'],
  },
  {
    id: 'POR',
    label: ['Portugal'],
    color: '#2563eb',
    // Black Start Castelo de Bode + Tapada do Outeiro (~15:00h) → simTime 3
    // REN confirmó 2,5M clientes restituidos ya por la tarde
    restoreTime: 3,
    blackStartType: 'bottom-up',
    anchor: { lon: -8.0, lat: 39.5 },
    // Portugal: ~14% de la demanda peninsular ibérica total (ES+PT)
    restorePercent: 14,
    country: 'PT',
  },
  {
    id: 'SUR',
    label: ['Sur', 'Andalucía–Extremadura'],
    color: '#d97706',
    // REE confirma tensión en Andalucía y Extremadura ~17:00h → simTime 5
    restoreTime: 5,
    blackStartType: 'bottom-up',
    anchor: { lon: -4.5, lat: 37.5 },
    // AN + EX: ~20% demanda peninsular (mayor zona por superficie e industria)
    restorePercent: 20,
    country: 'ES',
    postals: ['AN', 'EX'],
  },
  {
    id: 'LVT',
    label: ['Levante', 'Valencia–Murcia'],
    color: '#0891b2',
    // REE confirma C. Valenciana y Murcia ~18:00h → simTime 6
    restoreTime: 6,
    blackStartType: 'top-down',
    anchor: { lon: -0.4, lat: 39.4 },
    // VC + MU: ~9% demanda peninsular
    restorePercent: 9,
    country: 'ES',
    postals: ['VC', 'MU'],
  },
  {
    id: 'CEN',
    label: ['Centro', 'Madrid–Castilla LM'],
    color: '#0e7490',
    // Madrid recupera tensión ~18:00h, última zona grande → simTime 6
    // Madrid fue la zona con mayor demanda de emergencia nivel 3
    restoreTime: 6,
    blackStartType: 'top-down',
    anchor: { lon: -3.6, lat: 40.2 },
    // MD + CM: ~24% demanda peninsular (la de mayor peso)
    restorePercent: 24,
    country: 'ES',
    postals: ['MD', 'CM'],
  },
];

// Verificación: 9+14+9+14+20+9+24 = 99 ✓

// ── Puntos de Black Start — verificados en fuentes primarias ───────────────

export const BLACK_START_POINTS = [
  {
    id: 'Hernani',
    lon: -1.97, lat: 43.27,
    label: ['Hernani 400 kV', '12:43 — 1.ª subestación peninsular'],
    // Confirmado por REE: "fue la primera de la península en recibir tensión"
    time: 1,
    type: 'france',
  },
  {
    id: 'Baixas',
    lon: 2.81, lat: 42.72,
    label: ['Baixas (Francia)', 'Top-down → Cataluña'],
    // Connexió France→Cataluña activa desde las primeras horas
    time: 2,
    type: 'france',
  },
  {
    id: 'CastBode',
    lon: -8.27, lat: 39.48,
    label: ['Castelo de Bode', 'Black Start hidro (REN)'],
    // Confirmado por REN y CNN en sus comunicados
    time: 3,
    type: 'hydro',
  },
  {
    id: 'TapOuteiro',
    lon: -8.42, lat: 41.22,
    label: ['Tapada do Outeiro', 'CCGT Black Start (REN)'],
    time: 3,
    type: 'ccgt',
  },
  {
    id: 'Aldea',
    lon: -6.49, lat: 41.20,
    label: ['Aldeadávila', 'Black Start 1.100 MW hidro'],
    // Cuenca del Duero — mencionado en informe Comité análisis
    time: 3,
    type: 'hydro',
  },
  {
    id: 'Marruecos',
    lon: -5.58, lat: 35.92,
    label: ['Interconexión Marruecos', '+900 MW vía Estrecho'],
    // Wikipedia/REE: "Marruecos suministró hasta 900 MW"
    time: 4,
    type: 'morocco',
  },
];

export const BS_COLORS = {
  france:  '#3b82f6',
  hydro:   '#10b981',
  ccgt:    '#f59e0b',
  morocco: '#f97316',
};

// ── Log de eventos — cronología verificada ─────────────────────────────────
//
// Cada `time` es el simTime en el que aparece el evento.
// simTime N ≈ hora real 12:33 + N horas.

export const EVENT_LOG = [
  {
    time: 0,
    msg: '12:33 CEST — Cero energético. 15.000 MW pierden red en 5 s. Sistema ibérico en isla.',
  },
  {
    time: 1,
    msg: '12:43 CEST — Hernani (400 kV) recibe tensión de Francia. Primera subestación peninsular. [REE]',
  },
  {
    time: 2,
    msg: '~13:10–14:45 CEST — Reposición top-down: Bilbao, San Sebastián, Pamplona, primeras comarcas de Cataluña.',
  },
  {
    time: 3,
    msg: '~15:00 CEST — Black Start: Castelo de Bode y Tapada do Outeiro (PT). Aldeadávila activa (ES). [REN/REE]',
  },
  {
    time: 4,
    msg: '~16:00 CEST — Marruecos aporta +900 MW por el Estrecho. 38 % de su capacidad de generación. [Wikipedia/REE]',
  },
  {
    time: 5,
    msg: '~17:00 CEST — REE confirma tensión en 10 CCAA: Cataluña, Aragón, PV, Galicia, Asturias, Navarra, CyL, Extremadura, Andalucía.',
  },
  {
    time: 6,
    msg: '~18:00 CEST — Se suman Madrid, C. Valenciana, Murcia y Castilla-La Mancha. Demanda activa: ~56 % [REE datos en tiempo real].',
  },
  {
    time: 8,
    msg: '~20:35 CEST — Eduardo Prieto (REE) confirma 9.200 MW restituidos: 35,1 % de demanda prevista para ese tramo.',
  },
  {
    time: 10,
    msg: '~22:35 CEST — ~48–50 % de la demanda española con suministro. Proceso continúa en madrugada. [Pedro Sánchez/REE]',
  },
  {
    time: 12,
    msg: '00:00 CEST (29-A) — >61 % de la demanda restituida. Operadores trabajan en zonas rurales y última milla.',
  },
  {
    time: 15,
    msg: '04:00 CEST (29-A) — 100 % de las subestaciones de la red de transporte energizadas. [REE nota oficial]',
  },
  {
    time: 18,
    msg: '07:00 CEST (29-A) — 99,95 % demanda restituida (25.794 MW). Reposición certificada. [REE]',
  },
];
