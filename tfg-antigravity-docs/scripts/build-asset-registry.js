#!/usr/bin/env node
// scripts/build-asset-registry.js
//
// Genera static/asset_registry.json a partir de los artifacts embebidos en chunks.json.
// Migra 1:1 las trigger_questions que antes estaban hardcodeadas en scoreArtifactForQuestion.
//
// Ejecutar: node scripts/build-asset-registry.js
// Input:    static/chunks.json
// Output:   static/asset_registry.json

const fs = require('fs');
const path = require('path');

const CHUNKS_PATH = path.join(__dirname, '..', 'static', 'chunks.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'static', 'asset_registry.json');

// ── 1. Cargar chunks ─────────────────────────────────────────────────────────
const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, 'utf8'));
console.log(`[build-asset-registry] Loaded ${chunks.length} chunks.`);

// ── 2. Extraer artifacts únicos ──────────────────────────────────────────────
const seen = new Set();
const assets = [];

for (const chunk of chunks) {
  const a = chunk.artifact;
  if (!a || !a.id || seen.has(a.id)) continue;
  seen.add(a.id);

  assets.push({
    id:                a.id,
    type:              a.type || 'unknown',
    source:            a.source || '',
    title:             (a.title || '').slice(0, 120),
    description:       (a.description || '').slice(0, 200),
    url:               a.url || a.slug || '',
    path:              a.path || '',
    // Semilla de keywords: las del artifact + heading del chunk padre
    trigger_questions: [
      ...(a.keywords || []),
      ...(chunk.heading ? [chunk.heading] : []),
    ],
    // Campos opcionales para el frontend
    whyMatters:        a.whyMatters || '',
    whyMatters_en:     a.whyMatters_en || '',
    description_en:    a.description_en || '',
    keyElements:       a.keyElements || [],
    origin:            a.origin || '',
  });
}

console.log(`[build-asset-registry] ${assets.length} unique artifacts extracted.`);

// ── 3. Migrar trigger_questions desde las reglas hardcodeadas eliminadas ──────
// Fuente: las antiguas SIMULATOR_KEYWORDS, SEMANTIC_BOOSTS, LOAD_SHEDDING_KEYWORDS, etc.
// de scoreArtifactForQuestion (chat.js v1, L809-1066)

const MIGRATED_TRIGGERS = {
  // Simuladores interactivos (ex SIMULATOR_KEYWORDS)
  'ferranti':               ['ferranti', 'efecto ferranti', 'línea descargada', 'línea vacía',
                             'linea descargada', 'linea vacia', 'mallado', 'líneas en vacío',
                             'lineas en vacio', '11 líneas', 'GVAr', 'reactiva capacitiva',
                             'capacitancia distribuida', 'sobretensión pasiva'],
  'pvcurve':                ['curva p-v', 'pv curve', 'colapso de tensión', 'colapso de tension',
                             'punto de nariz', 'cargabilidad', 'colapso jacobiano', 'nariz',
                             'margen Q-V', 'margen qv'],
  'swing':                  ['ecuación del swing', 'ecuacion del swing', 'swing equation',
                             'rocof', 'inercia', 'constante H', 'constante h'],
  'map':                    ['mapa propagación', 'mapa propagacion', 'cascada geográfica',
                             'cascada geografica', 'animado', 'animated map',
                             'portugal arrastrado', 'propagación hacia portugal'],
  'sismograph':             ['sismógrafo', 'sismografo', '27 segundos', 'segundos críticos',
                             'segundos criticos'],
  'timeline':               ['cronología', 'cronologia', 'línea de tiempo', 'linea de tiempo',
                             'cronograma', 'secuencia eventos'],
  'ansi59':                 ['ansi 59', 'ansi59', 'protección sobretensión',
                             'proteccion sobretension', 'cascada IBR', 'cascada ibr'],
  'phaseplane':             ['plano de fase', 'phase plane', 'trayectoria angular'],
  'frequency':              ['caída de frecuencia', 'caida de frecuencia', 'nadir frecuencial',
                             'gráfica de frecuencia', 'grafica de frecuencia', 'Hz',
                             '47,79', '47.79'],
  'radar-vulnerabilidad':   ['radar', 'vulnerabilidad', 'ejes resiliencia'],
  'comparador-28a':         ['comparador', 'comparación escenarios', 'comparacion escenarios',
                             'sistema ahora vs'],
  'dynamic-security-shift': ['frontera de seguridad', 'desplazamiento seguridad',
                             'seguridad dinámica', 'seguridad dinamica'],
  'waterfall':              ['cascada financiera', 'waterfall', 'costes del apagón',
                             'costes del apagon', 'coste total apagón'],
  'matrix':                 ['matriz de costes', 'OPEX CAPEX', 'opex capex', 'inacción',
                             'inaccion', 'coste inacción', 'prevenir', 'evitar otro apagón',
                             'evitar otro apagon', 'recomendaciones futuro',
                             'qué hacer para evitar', 'que hacer para evitar'],
  'topology':               ['topología red', 'topologia red', 'nodos red', 'mapa eléctrico',
                             'mapa electrico', 'propagación eléctrica'],
  'interconnection':        ['interconexión', 'interconexion', 'Hernani', 'Santa Llogaia',
                             'capacidad interconexión', 'francia desconectó',
                             'francia desconecto', 'líneas AC francia', 'lineas AC francia',
                             'transpirenaicas', 'aislamiento peninsular'],
  'restoration':            ['re-energización', 'reenergización', 'reenergizacion',
                             'reposición sistema', 'reposicion sistema',
                             'islas eléctricas', 'islas electricas', 'fragmentación territorial',
                             'bottom-up top-down', 'estrategia dual'],
  'streamgraph':            ['transición energética', 'transicion energetica',
                             'evolución mix', 'evolucion mix'],
  'energy-trilemma':        ['trilema', 'trilema energético', 'trilema energetico'],
  'dcopf-congestion':       ['DC-OPF', 'dc-opf', 'congestión red', 'congestion red'],
  'bess-boom-chart':        ['BESS', 'bess', 'almacenamiento', 'batería', 'bateria'],
  'cnmc-sanctions-chart':   ['CNMC', 'cnmc', 'sanciones', 'expediente sancionador'],
  'sticky-collapse':        ['colapso animado', 'scrollytelling', 'narración colapso'],

  // Gráficas ENTSO-E (ex SEMANTIC_BOOSTS)
  'chart-1':  ['demanda peninsular', 'caída de demanda', 'caida de demanda',
               'recuperación demanda', 'recuperacion demanda'],
  'chart-2':  ['demanda total ibérica', 'demanda total iberica', 'carga total ES PT',
               'demanda ibérica', 'demanda iberica', 'pérdida total suministro'],
  'chart-8':  ['renovable', 'CO2', 'co2', 'IBR penetración', 'porcentaje renovable'],
  'chart-9':  ['precio spot', 'OMIE', 'omie', 'precio negativo', 'mercado spot'],
  'chart-11': ['precio Europa', 'mercado europeo', 'day-ahead', 'MIBEL', 'mibel'],
  'chart-13': ['intercambio frontera', 'P48', 'p48', 'exportación', 'exportacion', 'saldo frontera'],
  'chart-14': ['flujo físico', 'flujo fisico', 'frontera Francia', 'Marruecos'],
  'chart-18': ['desequilibrio', 'balance generación', 'balance generacion'],
  'chart-19': ['imbalance', 'desvío MW', 'desvio MW', 'déficit', 'deficit'],
  'chart-20': ['precio desvío', 'precio desvio', 'máximo 9999', 'maximo 9999'],
  'chart-21': ['reserva FRR', 'aFRR', 'mFRR', 'reserva frecuencia'],
  'chart-23': ['fallback ENTSO-E', 'protocolo emergencia europeo', 'proceso IN',
               'separación continental', 'separacion continental'],

  // Tablas forenses con alta relevancia temática
  'comparativa-conclusiones-entidades': ['discrepan', 'REE vs ICAI', 'conclusiones entidades',
                                         'quién dice qué', 'quien dice que'],
  'costes-economicos':                  ['coste apagón', 'coste apagon', 'impacto económico',
                                         'impacto economico', 'pérdidas económicas'],
  'escalones-ufls':                     ['UFLS', 'ufls', 'deslastre', 'subfrecuencia',
                                         'escalones carga'],
  'evolucion-frecuencia-rocof':         ['evolución frecuencia', 'evolucion frecuencia',
                                         'RoCoF tabla', 'nadir tabla'],
  'load-shedding-es-pt':                ['carga desconectada', 'demanda desconectada',
                                         'MW desconectados', 'load shedding'],
  'demand-shedding-es':                 ['desconexión demanda España', 'desconexion demanda España'],
  'demand-shedding-pt':                 ['desconexión demanda Portugal', 'desconexion demanda Portugal',
                                         'LFDD Portugal'],
  'mix-generacion-12-30':               ['mix generación', 'mix generacion', '12:30',
                                         'solar 53%', 'penetración IBR'],
};

// Aplicar triggers migrados
let enriched = 0;
for (const asset of assets) {
  const extra = MIGRATED_TRIGGERS[asset.id];
  if (!extra) continue;

  const existing = new Set(
    asset.trigger_questions.map(t => t.toLowerCase().trim())
  );

  for (const t of extra) {
    if (!existing.has(t.toLowerCase().trim())) {
      asset.trigger_questions.push(t);
    }
  }
  enriched++;
}

console.log(`[build-asset-registry] ${enriched} assets enriched with migrated triggers.`);

// ── 4. Escribir output ───────────────────────────────────────────────────────
const output = {
  _generated: new Date().toISOString(),
  _source:    'scripts/build-asset-registry.js',
  _count:     assets.length,
  assets,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
console.log(`[build-asset-registry] ✅ ${OUTPUT_PATH} — ${assets.length} assets written.`);
