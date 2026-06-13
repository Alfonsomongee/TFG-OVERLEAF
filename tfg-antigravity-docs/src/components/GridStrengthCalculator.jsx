import React, { useState, useMemo, useCallback } from 'react';
import Translate from '@docusaurus/Translate';
import styles from './GridStrengthCalculator.module.css';

// ─── Proyección geográfica (viewBox 1000×800) ────────────────────────────────
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX    = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west)  / (GEO_BOUNDS.east  - GEO_BOUNDS.west))  * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

// ─── Contornos geográficos ────────────────────────────────────────────────────
const IBERIA_OUTLINE = [
  [43.78, -7.86], [43.47, -8.45], [42.88, -9.28], [42.03, -8.87], [41.87, -8.87],
  [41.38, -8.73], [40.64, -8.75], [39.36, -9.40], [38.62, -9.50], [37.01, -8.91],
  [36.97, -7.85], [36.01, -5.61], [36.17, -5.36], [36.69, -4.41], [36.72, -3.48],
  [37.20, -1.90], [37.64, -0.69], [38.68,  0.23], [39.58,  0.34], [40.72,  0.73],
  [41.29,  1.83], [41.42,  2.22], [42.43,  3.16], [42.80,  1.72], [43.37, -1.79],
  [43.49, -3.80], [43.57, -5.66], [43.78, -7.86],
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87], [41.52, -6.92], [39.67, -7.06], [37.43, -7.44], [36.97, -7.85],
  [37.01, -8.91], [38.62, -9.50], [39.36, -9.40], [40.64, -8.75], [41.38, -8.73],
  [41.87, -8.87],
];

function pointsToPath(pts) {
  return pts.map((p, i) => {
    const { x, y } = geoToSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_PATH  = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);

// ─── Nudos de la red 400 kV — eje sur-occidental ibérico ─────────────────────
const NODES = [
  { id: 'almaraz',     name: 'C.N. Almaraz',  lat: 39.808, lon: -5.696 },
  { id: 'san_servan',  name: 'San Serván',     lat: 38.865, lon: -6.350 },
  { id: 'brovales',    name: 'Brovales',       lat: 38.312, lon: -6.753 },
  { id: 'guillena',    name: 'Guillena',       lat: 37.545, lon: -6.054 },
  { id: 'don_rodrigo', name: 'Don Rodrigo',    lat: 37.234, lon: -5.882 },
  { id: 'carmona',     name: 'Carmona',        lat: 37.471, lon: -5.638 },
  { id: 'caparacena',  name: 'Caparacena',     lat: 37.235, lon: -3.684 },
  { id: 'hueneja',     name: 'Huéneja',        lat: 37.165, lon: -3.001 },
];

// ─── Arcos de transporte 400 kV ───────────────────────────────────────────────
const EDGES = [
  { from: 'almaraz',     to: 'san_servan'  },
  { from: 'san_servan',  to: 'brovales'    },
  { from: 'brovales',    to: 'guillena'    },
  { from: 'guillena',    to: 'don_rodrigo' },
  { from: 'guillena',    to: 'carmona'     },
  { from: 'carmona',     to: 'don_rodrigo' },
  { from: 'carmona',     to: 'caparacena'  },
  { from: 'caparacena',  to: 'hueneja'     },
];

// ─── Parque generador: síncronos e IBR ────────────────────────────────────────
// scc_mva: contribución a la potencia de cortocircuito del nudo propio.
// Los IBR (isIBR: true) aumentan el denominador del SCR sin aportar Scc significativa.
const GENERATORS = [
  {
    id:            'almaraz_nc',
    name:          'C.N. Almaraz',
    nodeId:        'almaraz',
    type:          'nuclear',
    label:         'Nuclear · 2.100 MW',
    scc_mva:       4200,
    power_mw:      2100,
    isIBR:         false,
    initialActive: true,
    detail:
      'Dos reactores PWR de 1.050 MW. Alternador síncrono de gran masa inercial (H ≈ 6 s). ' +
      'Contribuye ~4.200 MVA a la Scc local y sostiene la tensión de referencia de los nudos adyacentes.',
  },
  {
    id:            'ccgt_carmona',
    name:          'CCGT Carmona',
    nodeId:        'carmona',
    type:          'ccgt',
    label:         'CCGT · 800 MW',
    scc_mva:       1600,
    power_mw:      800,
    isIBR:         false,
    initialActive: true,
    detail:
      'Ciclo combinado de gas 800 MW. Alternador síncrono con AVR de regulación de tensión. ' +
      'Absorbe potencia reactiva capacitiva en zonas de sobretensión (Q-droop activo).',
  },
  {
    id:            'ccgt_malaga',
    name:          'CCGT Málaga',
    nodeId:        'caparacena',
    type:          'ccgt',
    label:         'CCGT · 800 MW',
    scc_mva:       1600,
    power_mw:      800,
    isIBR:         false,
    initialActive: false, // ← DESACOPLADO en el 28-A por razones de mercado
    detail:
      '⚠ CONDICIÓN 28-A: Este CCGT estaba fuera de servicio el 28/04/2025. ' +
      'Su ausencia redujo la Scc en el eje Granada-Málaga a valores críticos, ' +
      'desestabilizando los PLL de los inversores fotovoltaicos conectados a Caparacena.',
  },
  {
    id:            'solar_guillena',
    name:          'FV Guillena',
    nodeId:        'guillena',
    type:          'solar',
    label:         'Solar FV · 600 MW',
    scc_mva:       60,   // IBR: ~10 % de contribución real a Scc
    power_mw:      600,
    isIBR:         true,
    initialActive: true,
    detail:
      'Parque fotovoltaico de 600 MW (IBR puro, Type-4). El PLL del inversor necesita una ' +
      'tensión de referencia estable para sincronizarse. Con SCR < 1,5, la tensión oscila ' +
      'más rápido de lo que el PLL puede seguir, iniciando inestabilidad subsincrónica.',
  },
  {
    id:            'wind_brovales',
    name:          'Eólica Brovales',
    nodeId:        'brovales',
    type:          'wind',
    label:         'Eólica · 400 MW',
    scc_mva:       40,   // IBR: prácticamente nula
    power_mw:      400,
    isIBR:         true,
    initialActive: true,
    detail:
      'Parque eólico de 400 MW (full-converter, Type-4). Prácticamente nula aportación ' +
      'a la Scc. Consume "fortaleza de red" sin generarla: aumenta el denominador del SCR ' +
      'mientras el numerador (Scc) permanece constante.',
  },
];

// ─── Parámetros del modelo ────────────────────────────────────────────────────
// Scc de red base (sin ningún generador local conectado): solo la malla de transporte.
const SCC_BASE_MVA = 3000;

// Factor de atenuación de Scc en función de la distancia eléctrica (saltos de línea).
// Basado en el decaimiento aproximado de la corriente de cortocircuito en redes malladas.
const DIST_FACTORS = [1.00, 0.58, 0.32, 0.14, 0.05];

// ─── BFS — distancias eléctricas entre nudos ──────────────────────────────────
function buildAdj(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });
  return adj;
}

function bfs(startId, adj) {
  const dist = { [startId]: 0 };
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of adj[cur]) {
      if (dist[nb] === undefined) {
        dist[nb] = dist[cur] + 1;
        queue.push(nb);
      }
    }
  }
  return dist;
}

// Pre-computados a nivel de módulo (constantes, no dependen de estado)
const ADJ           = buildAdj(NODES, EDGES);
const ALL_DISTANCES = Object.fromEntries(NODES.map(n => [n.id, bfs(n.id, ADJ)]));
const PROJECTED     = NODES.map(n => ({ ...n, ...geoToSvg(n.lat, n.lon) }));
const NODE_MAP      = Object.fromEntries(PROJECTED.map(n => [n.id, n]));

// Estado inicial de generadores (escenario histórico 28-A)
const INITIAL_STATES = Object.fromEntries(GENERATORS.map(g => [g.id, g.initialActive]));

// ─── Clasificación del SCR ────────────────────────────────────────────────────
function classifySCR(scr) {
  if (!isFinite(scr) || scr > 99) {
    return {
      label: 'N/D',
      color: 'var(--calc-muted)',
      lineClass: 'active',
      desc: 'Sin generación IBR conectada en este nudo. La potencia de cortocircuito no limita la estabilidad.',
    };
  }
  if (scr >= 3.0) {
    return {
      label: 'FUERTE',
      color: 'var(--calc-active-gen)',
      lineClass: 'active',
      desc: 'Red robusta (SCR ≥ 3,0). Los inversores IBR pueden operar con PLL estable y sin riesgo de resonancia subsincrónica.',
    };
  }
  if (scr >= 2.0) {
    return {
      label: 'MODERADO',
      color: '#ffc300',
      lineClass: 'weak',
      desc: 'Red moderadamente débil (2,0 ≤ SCR < 3,0). Oscilaciones subsincrónicas posibles bajo perturbación. Monitorización recomendada.',
    };
  }
  if (scr >= 1.5) {
    return {
      label: 'DÉBIL',
      color: '#ff8800',
      lineClass: 'weak',
      desc: 'Red débil (1,5 ≤ SCR < 2,0). Alta probabilidad de pérdida de sincronismo del PLL ante variaciones de tensión. Condición pre-crítica.',
    };
  }
  return {
    label: 'CRÍTICO',
    color: 'var(--calc-critical-line)',
    lineClass: 'critical',
    desc: '⚠ Condición 28-A (SCR < 1,5). La tensión de referencia oscila más rápido de lo que el PLL puede seguir. Inicio del bucle de retroalimentación positiva ANSI 59.',
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function GridStrengthCalculator() {
  const [genStates, setGenStates]       = useState(INITIAL_STATES);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const toggleGen = useCallback((id) => {
    setGenStates(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const applyScenario28A = () => {
    setGenStates(INITIAL_STATES);
    setSelectedNodeId(null);
  };

  const applyScenarioAllOnline = () => {
    setGenStates(Object.fromEntries(GENERATORS.map(g => [g.id, true])));
    setSelectedNodeId(null);
  };

  // ── Cómputo de métricas SCR (solo recalcula cuando cambia genStates) ─────
  const metrics = useMemo(() => {
    const activeGens = GENERATORS.filter(g => genStates[g.id]);

    // Scc en cada nudo: base de red + suma de contribuciones atenuadas por distancia eléctrica
    const nodeScc = {};
    NODES.forEach(n => {
      let scc = SCC_BASE_MVA;
      activeGens.forEach(gen => {
        const hops   = ALL_DISTANCES[gen.nodeId]?.[n.id] ?? 99;
        const factor = DIST_FACTORS[Math.min(hops, DIST_FACTORS.length - 1)];
        scc += gen.scc_mva * factor;
      });
      nodeScc[n.id] = Math.round(scc);
    });

    // Potencia IBR acoplada a cada nudo (denominador del SCR)
    const nodeIBR = Object.fromEntries(NODES.map(n => [n.id, 0]));
    activeGens.filter(g => g.isIBR).forEach(gen => {
      nodeIBR[gen.nodeId] += gen.power_mw;
    });

    // SCR = Scc / P_IBR en cada nudo
    const nodeSCR = {};
    NODES.forEach(n => {
      nodeSCR[n.id] = nodeIBR[n.id] > 0
        ? nodeScc[n.id] / nodeIBR[n.id]
        : Infinity;
    });

    // Estado de cada arco: mínimo SCR de los dos extremos
    const edgeClass = {};
    EDGES.forEach(e => {
      const key    = `${e.from}--${e.to}`;
      const minSCR = Math.min(
        isFinite(nodeSCR[e.from]) ? nodeSCR[e.from] : 99,
        isFinite(nodeSCR[e.to])   ? nodeSCR[e.to]   : 99,
      );
      edgeClass[key] = classifySCR(minSCR).lineClass;
    });

    // SCR mínimo global (solo nudos con IBR)
    const finiteScrs   = Object.values(nodeSCR).filter(s => isFinite(s));
    const globalMinSCR = finiteScrs.length ? Math.min(...finiteScrs) : Infinity;
    const globalStatus = classifySCR(globalMinSCR);

    // Scc media del sistema (indicador de robustez general)
    const avgScc = Math.round(
      Object.values(nodeScc).reduce((a, b) => a + b, 0) / NODES.length,
    );

    return { nodeScc, nodeIBR, nodeSCR, edgeClass, globalMinSCR, globalStatus, avgScc };
  }, [genStates]);

  // ── Datos del nudo seleccionado ───────────────────────────────────────────
  const selNode    = selectedNodeId ? NODES.find(n => n.id === selectedNodeId) : null;
  const selSCR     = selNode ? metrics.nodeSCR[selNode.id]  : null;
  const selStatus  = selNode ? classifySCR(selSCR)           : null;
  const selScc     = selNode ? metrics.nodeScc[selNode.id]   : null;
  const selIBR     = selNode ? metrics.nodeIBR[selNode.id]   : null;
  const nodeGens   = selNode ? GENERATORS.filter(g => g.nodeId === selNode.id) : [];

  return (
    <div className={styles.container}>
      {/* ── Cabecera ── */}
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="scr.badge">Análisis de Fortaleza de Red · 28-A</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="scr.title">Calculadora de SCR — Short Circuit Ratio</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="scr.subtitle">
            Conecta o desacopla generadores síncronos e IBR para visualizar cómo varía la potencia de cortocircuito (Scc)
            y el SCR en cada nudo. SCR {'<'} 1,5 reproduce la condición exacta del eje sur-occidental durante el 28-A.
          </Translate>
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Mapa SVG ── */}
        <div className={styles.mapContainer}>
          <svg viewBox="0 0 1000 800" className={styles.svg}>
            {/* Contornos geográficos */}
            <path d={IBERIA_PATH}   className={styles.landES} />
            <path d={PORTUGAL_PATH} className={styles.landPT} />

            {/* Líneas de transporte (color = fortaleza local de red) */}
            {EDGES.map((edge, idx) => {
              const src = NODE_MAP[edge.from];
              const tgt = NODE_MAP[edge.to];
              if (!src || !tgt) return null;

              const cls = metrics.edgeClass[`${edge.from}--${edge.to}`];
              const lineClass =
                cls === 'critical' ? styles.lineCritical :
                cls === 'weak'     ? styles.lineWeak     :
                                     styles.lineActive;

              return (
                <line
                  key={idx}
                  x1={src.x} y1={src.y}
                  x2={tgt.x} y2={tgt.y}
                  className={lineClass}
                />
              );
            })}

            {/* Nudos */}
            {PROJECTED.map(node => {
              const nodeGensAll  = GENERATORS.filter(g => g.nodeId === node.id);
              const hasGen       = nodeGensAll.length > 0;
              const hasActiveGen = nodeGensAll.some(g => genStates[g.id]);
              const isSelected   = selectedNodeId === node.id;

              const scr       = metrics.nodeSCR[node.id];
              const { color } = classifySCR(scr);
              const nodeR     = hasGen ? 12 : 8;
              const ringR     = nodeR + 8;

              return (
                <g
                  key={node.id}
                  className={styles.nodeGroup}
                  onClick={() => setSelectedNodeId(prev => prev === node.id ? null : node.id)}
                  role="button"
                  aria-label={node.name}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedNodeId(prev => prev === node.id ? null : node.id)}
                >
                  {/* Anillo de generador (rotante si activo) */}
                  {hasGen && (
                    <circle
                      cx={node.x} cy={node.y} r={ringR}
                      className={hasActiveGen ? styles.genActiveRing : styles.genInactiveRing}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  )}

                  {/* Anillo de selección */}
                  {isSelected && (
                    <circle
                      cx={node.x} cy={node.y}
                      r={hasGen ? ringR + 6 : nodeR + 6}
                      fill="none"
                      stroke="var(--calc-teal)"
                      strokeWidth="2"
                      strokeDasharray="5 3"
                      opacity="0.9"
                    />
                  )}

                  {/* Nodo principal (color = SCR del nudo) */}
                  <circle
                    cx={node.x} cy={node.y} r={nodeR}
                    fill={color}
                    stroke="var(--calc-surface, #fffdf7)"
                    strokeWidth="2"
                    style={{ transition: 'fill 0.35s ease' }}
                  />

                  {/* Etiqueta */}
                  <text
                    x={node.x}
                    y={node.y - (hasGen ? ringR + 8 : nodeR + 6)}
                    className={styles.nodeLabel}
                    textAnchor="middle"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Panel de telemetría ── */}
        <div className={styles.telemetryPanel}>

          {/* Card 1: Parque generador con toggles */}
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Parque Generador</h4>
            <p className={styles.cardDesc}>
              Los alternadores síncronos elevan la Scc (SCR sube). Los IBR la consumen sin aportarla (SCR baja).
            </p>
            <div className={styles.togglesList}>
              {GENERATORS.map(gen => {
                const isActive = genStates[gen.id];
                return (
                  <div key={gen.id} className={styles.toggleItem}>
                    <div>
                      <span className={styles.toggleName}>{gen.name}</span>
                      <span className={styles.toggleDetail}>
                        {gen.label}
                        {' · '}
                        {gen.isIBR
                          ? 'IBR — Scc ≈ 0'
                          : `+${gen.scc_mva.toLocaleString('es-ES')} MVA`}
                      </span>
                    </div>
                    <button
                      className={`${styles.switchBtn} ${isActive ? styles.switchOn : styles.switchOff}`}
                      onClick={() => toggleGen(gen.id)}
                      aria-pressed={isActive}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Estado del nudo seleccionado (o estado global) */}
          <div className={`${styles.card} ${styles.detailCard}`}>
            {selNode ? (
              <>
                <h4 className={styles.cardTitle}>{selNode.name}</h4>

                <div className={styles.metaRow}>
                  <span>Scc local</span>
                  <strong>{selScc.toLocaleString('es-ES')} MVA</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>IBR acoplada</span>
                  <strong>
                    {selIBR > 0 ? `${selIBR.toLocaleString('es-ES')} MW` : '— (sin IBR)'}
                  </strong>
                </div>
                <div className={styles.metaRow}>
                  <span>SCR local</span>
                  <strong style={{ color: selStatus.color }}>
                    {isFinite(selSCR) ? selSCR.toFixed(2) : '∞'}
                  </strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Estado</span>
                  <strong style={{ color: selStatus.color }}>{selStatus.label}</strong>
                </div>

                <div className={styles.statusDescription}>
                  <p>{selStatus.desc}</p>
                  {nodeGens.map(gen => (
                    <p key={gen.id} style={{ marginTop: '0.6rem' }}>
                      <strong
                        style={{
                          color: genStates[gen.id]
                            ? 'var(--calc-active-gen)'
                            : 'var(--calc-inactive-gen)',
                        }}
                      >
                        [{genStates[gen.id] ? 'ONLINE' : 'OFFLINE'}]
                      </strong>
                      {' '}{gen.detail}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyDetail}>
                <p>Haz clic en un nudo del mapa para inspeccionar su SCR local y telemetría.</p>
                <p style={{ marginTop: '0.8rem' }}>
                  SCR mín. del sistema:{' '}
                  <strong style={{ color: metrics.globalStatus.color }}>
                    {isFinite(metrics.globalMinSCR)
                      ? `${metrics.globalMinSCR.toFixed(2)} — ${metrics.globalStatus.label}`
                      : '∞ — Sin IBR activa'}
                  </strong>
                </p>
                <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', opacity: 0.75 }}>
                  Scc media del sistema:{' '}
                  <strong>{metrics.avgScc.toLocaleString('es-ES')} MVA</strong>
                </p>
              </div>
            )}
          </div>

          {/* Botones de escenario */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              className={`${styles.switchBtn} ${styles.switchOff}`}
              onClick={applyScenario28A}
              style={{ flex: 1, padding: '0.45rem 0.5rem', fontSize: '0.72rem' }}
            >
              ↺ Escenario 28-A
            </button>
            <button
              className={`${styles.switchBtn} ${styles.switchOn}`}
              onClick={applyScenarioAllOnline}
              style={{ flex: 1, padding: '0.45rem 0.5rem', fontSize: '0.72rem' }}
            >
              ✓ Todo Online
            </button>
          </div>
        </div>
      </div>

      {/* ── Leyenda de fórmulas ── */}
      <div className={styles.formulaLegend}>
        <div className={styles.formulaItem}>
          <code>SCR = Scc [MVA] / P_IBR [MW]</code>
          <span>Short Circuit Ratio en el punto de conexión del inversor</span>
        </div>
        <div className={styles.formulaItem}>
          <code>Scc ≈ SCC_base + Σ Sgen × k(d)</code>
          <span>k(d) es el factor de atenuación por distancia eléctrica entre nudos</span>
        </div>
        <div className={styles.formulaItem}>
          <code>SCR {'<'} 1,5 → Inestabilidad de PLL</code>
          <span>Condición reproducida el 28-A en el eje sur-occidental: inicio de cascada ANSI 59</span>
        </div>
      </div>
    </div>
  );
}
