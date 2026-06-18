/**
 * IberianGridTopologyData.js
 *
 * Datos del simulador de cascada de sobretensión — apagón ibérico 28-A.
 *
 * FUENTES PRIMARIAS:
 *  - ENTSO-E Expert Panel Final Report, 20 marzo 2026 (264 pp.)
 *    https://www.entsoe.eu/publications/...
 *  - REE Informe técnico del incidente, 18 junio 2025
 *    https://d1n1o4zeyfu21r.cloudfront.net/WEB_Incidente_SistemaElectricoPeninsularEspanol_18junio2025.pdf
 *  - Comité de Análisis del Gobierno (MITECO), 17 junio 2025
 *    https://www.miteco.gob.es/...
 *  - Euronews análisis ENTSO-E final, 20 marzo 2026
 *
 * CORRECCIONES RESPECTO A VERSIÓN ANTERIOR:
 *
 *  1. ORDEN BAD/SEV INVERTIDO EN ORIGINAL:
 *     Original: SEV activationTime=3, BAD activationTime=5 (SEV antes que BAD)
 *     Real: Badajoz (12:33:16) ANTES que zona Sur/Sevilla (12:33:17)
 *     Fuente: "A las 12:33:16, dos subestaciones en la zona de Badajoz perdieron
 *              727 megavatios. A las 12:33:17, otros 928 megavatios cayeron en
 *              Segovia, Huelva, Sevilla y Cáceres." (ENTSO-E / Euronews, mar 2026)
 *     Corrección: BAD activationTime=5, SEV activationTime=6
 *
 *  2. LABEL '0.8 Hz' → '0,21 Hz':
 *     El link BAD→LIS tenía label '0.8 Hz', valor no documentado en ninguna fuente.
 *     La oscilación inter-área documentada fue de 0,21 Hz (segunda oscilación,
 *     12:16-12:22 CEST). Fuente: ENTSO-E report + Wikipedia ES (2ª oscilación).
 *
 *  3. REFERENCIA 'NÚÑEZ DE BALBOA' ELIMINADA:
 *     El original atribuía el colapso de Badajoz a "Núñez de Balboa" como hecho
 *     establecido. REE señaló esa planta como iniciadora de una oscilación crítica,
 *     pero Iberdrola demandó a REE por denigración. Atribución litigada, no
 *     establecida. Fuente: Inteligenia.info análisis 1 año después (abril 2026).
 *     Corrección: descripción neutral — "causas parcialmente indeterminadas (ENTSO-E)"
 *
 *  4. FRAMING 'INERCIA BASE' DE ALMARAZ ELIMINADO:
 *     REE concluye explícitamente: "El incidente NO se produjo por un problema de
 *     inercia; se explica desde el balance de potencia reactiva (control de tensión)
 *     y no de potencia activa (control de frecuencia)."
 *     Fuente: REE Informe técnico, junio 2025.
 *
 *  5. ORDEN AC/HVDC EN SEPARACIÓN DE FRANCIA CORREGIDO:
 *     "A las 12:33:21.535, las líneas aéreas entre Francia y España se desconectaron
 *     (ANSI 78). A las 12:33:23.960, se completó la separación por el disparo de
 *     las líneas HVDC." El AC se desconecta PRIMERO.
 *     Fuente: ENTSO-E / El Periódico de la Energía (oct 2025).
 *     Corrección: ZAR→FR (AC) lostAtTime=11, BAR→FR (HVDC) lostAtTime=12
 *
 *  6. LOG: PÉRDIDA DE SINCRONISMO ANTES DE APERTURA AC:
 *     "A las 12:33:19, la red ibérica perdió el sincronismo con el sistema continental
 *     europeo. A las 12:33:21, las líneas AC entre Francia y España se desconectaron."
 *     El original ponía la apertura AC antes de la pérdida de sincronismo. Corregido.
 *     Fuente: ENTSO-E Expert Panel Final Report (Euronews, mar 2026).
 *
 *  7. BUG `e.time || e.t` CORREGIDO:
 *     El filtro original era: EVENT_LOG.filter(e => e.time <= simTime || e.t <= simTime)
 *     donde `e.time` es siempre undefined. Estandarizado a `e.t` en todos los eventos.
 */

// ── Proyección geográfica ──────────────────────────────────────────────────

export const GEO_BOUNDS = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
export const VIEWBOX    = { width: 1000, height: 800 };

export function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west)  / (GEO_BOUNDS.east  - GEO_BOUNDS.west))  * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

// ── Timestamps reales mapeados a los 15 estados del simulador (t=0…14) ────
//
// La simulación representa los ~93 segundos del colapso:
//   t=0  = 12:32:00 (pre-evento — sistema operativo)
//   t=14 = 12:33:30 (cero eléctrico peninsular)
//
// Fuente: ENTSO-E Expert Panel Final Report (marzo 2026), cronología verificada.

export const SIM_TIMESTAMPS = [
  '12:32:00', // t=0  — pre-evento. Sistema operativo, renovables ≈82%
  '12:32:57', // t=1  — DISPARO RAÍZ: trafo 400/220 kV Granada (355 MW)
  '12:33:00', // t=2  — tensión sube en zona sur, >417,9 kV en Granada
  '12:33:04', // t=3  — tensión supera 420 kV; defensas escalonadas activas
  '12:33:08', // t=4  — deslastre automático activado; sin efecto contenedor
  '12:33:16', // t=5  — BADAJOZ: −727 MW fotovoltaica + termosolar (2 subestaciones)
  '12:33:17', // t=6  — SUR: −930 MW en <1s (Segovia, Huelva, Sevilla, Cáceres)
  '12:33:18', // t=7  — >2,5 GW perdidos. Tensión >435 kV. Sistema fuera de control
  '12:33:18', // t=8  — sobretensión se propaga a Portugal; nuevas desconexiones
  '12:33:19', // t=9  — PÉRDIDA DE SINCRONISMO ibérico-continente europeo
  '12:33:20', // t=10 — Marruecos desconecta por subfrecuencia (48,46 Hz)
  '12:33:21', // t=11 — enlaces AC transpirenaicos abren (ANSI 78) — AC PRIMERO
  '12:33:23', // t=12 — HVDC INELFE desconecta (modo potencia constante) — HVDC DESPUÉS
  '12:33:26', // t=13 — colapso total en curso; tensión y frecuencia colapsan
  '12:33:30', // t=14 — CERO ELÉCTRICO PENINSULAR: 15 GW, >50M personas
];

// ── Nodos de la topología ──────────────────────────────────────────────────
//
// `label`         — array de líneas mostradas bajo el nodo
// `desc`          — array de líneas mostradas en el tooltip al hacer hover
// `activationTime`— simTime en el que el nodo pasa a estado "en colapso"
// `group`         — 'collapse' | 'stable' | 'portugal' | 'france'

export const NODES_DATA = [
  {
    id: 'GRN',
    lon: -3.60, lat: 37.25,
    label: ['Granada', 'Caparacena 220 kV'],
    desc: [
      'DISPARO RAÍZ — 12:32:57 CEST',
      '−355 MW · absorbía 165 MVAr',
      'Tensión 400 kV previa: 417,9 kV',
      'Pérdida reactiva → tensión sube',
    ],
    // Simulación empieza AT el colapso de Granada: activationTime=0 muestra
    // el nodo en colapso desde el primer paso (t=0 = 12:32:57).
    activationTime: 1,
    group: 'collapse',
  },
  {
    id: 'BAD',
    lon: -6.97, lat: 38.88,
    label: ['Badajoz', 'Dos subestaciones 400 kV'],
    desc: [
      'CASCADA — 12:33:16 CEST',
      '−727 MW fotovoltaica + termosolar',
      'Tensión en disparo: 435,4 kV',
      'Causas: parcialmente indeterminadas (ENTSO-E)',
    ],
    // CORRECCIÓN: activationTime=5 (12:33:16) — antes de SEV (t=6 / 12:33:17)
    // Original tenía BAD=5, SEV=3, lo que era INCORRECTO (SEV aparecía antes)
    activationTime: 5,
    group: 'collapse',
  },
  {
    id: 'SEV',
    lon: -5.50, lat: 37.60,
    label: ['Sur peninsular', 'Sevilla · Huelva · Cáceres'],
    desc: [
      'CASCADA — 12:33:17–18 CEST',
      '−930 MW en menos de 1 segundo',
      'Segovia · Huelva · Sevilla · Cáceres',
      'Mayoría: causa no determinada (ENTSO-E)',
    ],
    // CORRECCIÓN: activationTime=6 (12:33:17) — después de BAD (t=5 / 12:33:16)
    // Original tenía SEV=3, que era ANTERIOR a BAD=5. Orden real: BAD → SEV.
    activationTime: 6,
    group: 'collapse',
  },
  {
    id: 'MAD',
    lon: -3.70, lat: 40.42,
    label: ['Madrid', 'Morata de Tajuña'],
    desc: [
      'Nodo central — corredor norte',
      'Paro en cascada final (~12:33:30)',
      'Zona de máxima demanda de emergencia',
      'Nivel 3 protección civil solicitado',
    ],
    activationTime: 0,
    group: 'stable',
  },
  {
    id: 'ALM',
    lon: -5.87, lat: 39.75,
    label: ['Almaraz', 'Nuclear'],
    desc: [
      'Central nuclear · 2 × 1.066 MW',
      'Paro automático 12:33 CEST',
      'Causa: pérdida tensión exterior',
      'Problema: reactiva, no inercia (REE)',
    ],
    // CORRECCIÓN: eliminado framing "inercia base".
    // REE confirma: "el incidente NO se produjo por un problema de inercia"
    activationTime: 0,
    group: 'stable',
  },
  {
    id: 'ZAR',
    lon: -0.88, lat: 41.65,
    label: ['Aragón', 'Corredor norte AC'],
    desc: [
      'Corredor norte — enlace AC con Francia',
      'Apertura ANSI 78 — 12:33:21 CEST',
      'Primer tipo de enlace en abrir',
    ],
    activationTime: 0,
    group: 'stable',
  },
  {
    id: 'BAR',
    lon: 2.02, lat: 41.47,
    label: ['Cataluña', 'Santa Llogaia HVDC'],
    desc: [
      'HVDC Santa Llogaia–Baixas',
      '1.000 MW modo potencia constante',
      'Exportando a Francia en el colapso',
      'Desconexión: 12:33:23 (último enlace)',
    ],
    activationTime: 0,
    group: 'stable',
  },
  {
    id: 'LIS',
    lon: -9.14, lat: 38.72,
    label: ['Lisboa', 'REN'],
    desc: [
      'Propagación — 12:33:18–21 CEST',
      'Oscilación inter-área: 0,21 Hz',
      'Tensión se dispara en Portugal',
      'Cascada ibérica completa',
    ],
    // Propagación a Portugal: 12:33:18-21 → t=8
    activationTime: 8,
    group: 'portugal',
  },
  {
    id: 'POR',
    lon: -8.61, lat: 41.15,
    label: ['Porto', 'REN Norte'],
    desc: [
      'Zona norte Portugal',
      'Receptor de oscilaciones inter-área',
      'Primer punto Black Start: Tapada do Outeiro',
    ],
    activationTime: 0,
    group: 'portugal',
  },
  {
    id: 'FR',
    lon: 2.81, lat: 42.72,
    label: ['Francia', 'Baixas · RTE'],
    desc: [
      'Separación en dos fases:',
      'AC abre (ANSI 78): 12:33:21',
      'HVDC desconecta: 12:33:23',
      'Impidió propagación continental',
    ],
    activationTime: 0,
    group: 'france',
  },
];

// ── Links de la topología ──────────────────────────────────────────────────
//
// `lostAtTime` — simTime en el que el link queda inactivo (línea desconectada).
//   null = nunca se pierde en la simulación.
//   Reemplaza el hack original `simTime >= 10 && link.target === 'FR'`.

export const LINKS_DATA = [
  {
    source: 'GRN', target: 'BAD',
    isCritical: true, activationTime: 1, lostAtTime: null,
    label: '+Tensión',
  },
  {
    source: 'BAD', target: 'SEV',
    isCritical: true,
    // CORRECCIÓN: activationTime=5 (cuando BAD activa), no 4
    activationTime: 5, lostAtTime: null,
    label: 'Cascada',
  },
  {
    source: 'SEV', target: 'LIS',
    isCritical: true, activationTime: 6, lostAtTime: null,
    // CORRECCIÓN: '0.8 Hz' → '0,21 Hz'
    // Oscilación inter-área documentada (ENTSO-E, REE).
    // '0.8 Hz' no aparece en ninguna fuente primaria.
    label: '0,21 Hz',
  },
  { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0, lostAtTime: null,  label: '' },
  { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0, lostAtTime: null,  label: '' },
  { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0, lostAtTime: null,  label: '' },
  { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0, lostAtTime: null,  label: '' },
  { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0, lostAtTime: null,  label: '' },
  {
    // CORRECCIÓN: AC abre PRIMERO (12:33:21 → t=11)
    source: 'ZAR', target: 'FR',
    isCritical: true, activationTime: 0, lostAtTime: 11,
    label: 'AC',
  },
  {
    // CORRECCIÓN: HVDC desconecta DESPUÉS del AC (12:33:23 → t=12)
    // Original los gestionaba simultáneamente con `link.target === 'FR'` hack
    source: 'BAR', target: 'FR',
    isCritical: true, activationTime: 0, lostAtTime: 12,
    label: 'HVDC',
  },
];

// ── Log de eventos — cronología verificada ────────────────────────────────
//
// ESTANDARIZADO a `t` (bug original: filtraba con `e.time || e.t`
// donde `e.time` era siempre undefined).
//
// CORRECCIÓN CLAVE: t=9 (pérdida sincronismo) ANTES de t=11 (apertura AC)
// Original los tenía en orden incorrecto.

export const EVENT_LOG = [
  {
    t: 0,
    msg: '12:32:00 — Sistema operativo. Renovables ≈82 %. H_eq ≈ 2,4 s (↑ mínimo ENTSO-E). Exportación neta ≈5 GW.',
  },
  {
    t: 1,
    msg: '12:32:57 — DISPARO RAÍZ: trafo 400/220 kV subestación Granada. −355 MW. Absorción reactiva perdida: 165 MVAr.',
  },
  {
    t: 2,
    msg: '12:32:57+ — Tensión sube en zona sur. Plantas renovables cercanas activan protecciones por sobretensión.',
  },
  {
    t: 3,
    msg: '12:33:00–15 — Tensión supera 420 kV en varios nodos. Defensas escalonadas activas; sin efecto contenedor.',
  },
  {
    t: 5,
    msg: '12:33:16 — BADAJOZ: dos subestaciones 400 kV pierden 727 MW (FV + termosolar). Tensión: 435,4 kV.',
  },
  {
    t: 6,
    msg: '12:33:17 — SUR: Segovia · Huelva · Sevilla · Cáceres pierden 930 MW en < 1 segundo. Mayoría: causa desconocida.',
  },
  {
    t: 7,
    msg: '12:33:18 — Pérdida total > 2,5 GW en 21 segundos. Cascada de sobretensión imparable. Sistema fuera de control.',
  },
  {
    t: 8,
    msg: '12:33:18–19 — Sobretensión se propaga a Portugal. Nuevas desconexiones. Frecuencia en caída libre.',
  },
  {
    // CORRECCIÓN: pérdida de sincronismo (12:33:19) ANTES de apertura AC (12:33:21)
    // El original lo tenía al revés.
    t: 9,
    msg: '12:33:19 — PÉRDIDA DE SINCRONISMO. Sistema ibérico empieza a desacoplarse del continente europeo.',
  },
  {
    t: 10,
    msg: '12:33:20 — Marruecos desconecta por subfrecuencia (48,46 Hz). REE activa el 6.º escalón de deslastre.',
  },
  {
    // CORRECCIÓN: AC se abre DESPUÉS de la pérdida de sincronismo, no antes
    t: 11,
    msg: '12:33:21 — Apertura enlaces AC transpirenaicos (ANSI 78). AC desconecta PRIMERO. Isla ibérica formada.',
  },
  {
    // CORRECCIÓN: HVDC desconecta DESPUÉS del AC
    t: 12,
    msg: '12:33:23 — HVDC INELFE desconecta (modo potencia constante). Sistema ibérico completamente aislado.',
  },
  {
    t: 13,
    msg: '12:33:26 — Colapso total en curso. Los 6 escalones de deslastre no lograron frenar la cascada.',
  },
  {
    t: 14,
    msg: '12:33:30 — CERO ELÉCTRICO PENINSULAR. 15 GW · 33 segundos · > 50 millones de personas sin suministro.',
  },
];

// ── Colores por grupo — función pura (sin dependencias del componente) ────

export function getGroupColors(isDark) {
  return {
    collapse: {
      fill:   isDark ? '#D98798' : '#A13D36',
      stroke: isDark ? '#F0B4C0' : '#C8798A',
    },
    stable: {
      fill:   isDark ? '#A6C67B' : '#2F6B4F',
      stroke: isDark ? '#D3E7B0' : '#6FA784',
    },
    portugal: {
      fill:   isDark ? '#E6B45C' : '#A96000',
      stroke: isDark ? '#F3D38A' : '#D9A441',
    },
    france: {
      fill:   isDark ? '#7DCDE3' : '#1F6F78',
      stroke: isDark ? '#B7EAF4' : '#5AA7B2',
    },
  };
}
