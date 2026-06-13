import React, { useState, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './GridStrengthCalculator.module.css';

// ─── Proyección geográfica simplificada (viewBox 1000x800) ───────────────────
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

function pointsToPath(points) {
  return points.map((p, i) => {
    const { x, y } = geoToSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_PATH = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);

// ─── Algoritmo de inversión de matriz de Gauss-Jordan ────────────────────────
function invertMatrix(A) {
  const n = A.length;
  const M = [];
  for (let i = 0; i < n; i++) {
    M[i] = [];
    for (let j = 0; j < n; j++) {
      M[i][j] = A[i][j];
    }
    for (let j = 0; j < n; j++) {
      M[i][j + n] = (i === j) ? 1.0 : 0.0;
    }
  }

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[maxRow][i])) {
        maxRow = r;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-9) return null; // Singular

    for (let j = i; j < 2 * n; j++) {
      M[i][j] /= pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const factor = M[r][i];
        for (let j = i; j < 2 * n; j++) {
          M[r][j] -= factor * M[i][j];
        }
      }
    }
  }

  const inv = [];
  for (let i = 0; i < n; i++) {
    inv[i] = [];
    for (let j = 0; j < n; j++) {
      inv[i][j] = M[i][j + n];
    }
  }
  return inv;
}

// ─── Definición del modelo de red en p.u. (Sbase = 1000 MVA) ─────────────────
const NETWORK_DATA = {
  baseMVA: 1000,
  nodes: [
    { id: 'N_GUILLENA_400', name: 'Guillena', lat: 37.545, lon: -6.054, voltage_kv: 400, ssc_base_mva: 25010, ibr_capacity_mw: 850, x_boundary: 0.045, generator: null },
    { id: 'N_ALMARAZ_400', name: 'C.N. Almaraz', lat: 39.808, lon: -5.696, voltage_kv: 400, ssc_base_mva: 19500, ibr_capacity_mw: 0, x_boundary: 0.070, generator: { type: 'nuclear', s_nom_mva: 1180, xd_subtransient_pu: 0.236, x_sys_base: 0.20 } },
    { id: 'N_DON_RODRIGO_400', name: 'Don Rodrigo', lat: 37.234, lon: -5.882, voltage_kv: 400, ssc_base_mva: 15400, ibr_capacity_mw: 1200, x_boundary: 0.075, generator: null },
    { id: 'N_CARMONA_400', name: 'Carmona', lat: 37.471, lon: -5.638, voltage_kv: 400, ssc_base_mva: 14200, ibr_capacity_mw: 940, x_boundary: 0.090, generator: { type: 'ccgt', s_nom_mva: 800, xd_subtransient_pu: 0.185, x_sys_base: 0.23125 } },
    { id: 'N_BROVALES_400', name: 'Brovales', lat: 38.312, lon: -6.753, voltage_kv: 400, ssc_base_mva: 11200, ibr_capacity_mw: 650, x_boundary: 0.110, generator: null },
    { id: 'N_HUENEJA_400', name: 'Huéneja', lat: 37.165, lon: -3.001, voltage_kv: 400, ssc_base_mva: 6500, ibr_capacity_mw: 1400, x_boundary: 0.180, generator: null },
    { id: 'N_CAPARACENA_400', name: 'Caparacena', lat: 37.235, lon: -3.684, voltage_kv: 400, ssc_base_mva: 9800, ibr_capacity_mw: 500, x_boundary: 0.120, generator: null },
    { id: 'N_SAN_SERVAN_400', name: 'San Serván', lat: 38.865, lon: -6.350, voltage_kv: 400, ssc_base_mva: 12300, ibr_capacity_mw: 1100, x_boundary: 0.095, generator: null }
  ],
  edges: [
    { from: 'N_ALMARAZ_400', to: 'N_SAN_SERVAN_400', x: 0.050 },
    { from: 'N_SAN_SERVAN_400', to: 'N_BROVALES_400', x: 0.040 },
    { from: 'N_BROVALES_400', to: 'N_GUILLENA_400', x: 0.045 },
    { from: 'N_GUILLENA_400', to: 'N_CARMONA_400', x: 0.015 },
    { from: 'N_GUILLENA_400', to: 'N_DON_RODRIGO_400', x: 0.020 },
    { from: 'N_CARMONA_400', to: 'N_DON_RODRIGO_400', x: 0.025 },
    { from: 'N_CARMONA_400', to: 'N_CAPARACENA_400', x: 0.070 },
    { from: 'N_CAPARACENA_400', to: 'N_HUENEJA_400', x: 0.030 }
  ]
};

// Precalcula el Zbus base con todos los generadores encendidos
const ZBUS_BASE = (() => {
  const n = NETWORK_DATA.nodes.length;
  const Y = Array(n).fill(null).map(() => Array(n).fill(0));

  // Agregar líneas a Ybus
  NETWORK_DATA.edges.forEach(edge => {
    const u = NETWORK_DATA.nodes.findIndex(node => node.id === edge.from);
    const v = NETWORK_DATA.nodes.findIndex(node => node.id === edge.to);
    Y[u][v] -= 1 / edge.x;
    Y[v][u] -= 1 / edge.x;
    Y[u][u] += 1 / edge.x;
    Y[v][v] += 1 / edge.x;
  });

  // Agregar shunts y generadores
  NETWORK_DATA.nodes.forEach((node, idx) => {
    Y[idx][idx] += 1 / node.x_boundary;
    if (node.generator) {
      Y[idx][idx] += 1 / node.generator.x_sys_base;
    }
  });

  return invertMatrix(Y) || Array(n).fill(null).map(() => Array(n).fill(0));
})();

function getScrColor(scr) {
  if (scr === Infinity) return '#808080'; 
  if (scr < 2.0) return '#FF3333';        
  if (scr >= 2.0 && scr < 3.0) return '#FFC300'; 
  return '#33FF57';                       
}

function CalculatorContent() {
  const [activeGenerators, setActiveGenerators] = useState(
    () => new Set(NETWORK_DATA.nodes.filter(n => n.generator).map(n => n.id))
  );
  const [hoveredNode, setHoveredNode] = useState(null);

  // Recálculo dinámico usando el Lema de Sherman-Morrison
  const networkMetrics = useMemo(() => {
    const nodes = NETWORK_DATA.nodes;
    const baseMVA = NETWORK_DATA.baseMVA;

    // Empezamos con la matriz Zbus de base (ambos encendidos)
    let currentZbus = ZBUS_BASE.map(row => [...row]);

    // Aplicar Sherman-Morrison por cada generador desconectado
    nodes.forEach((node, idx) => {
      if (node.generator && !activeGenerators.has(node.id)) {
        const k = idx;
        // La reactancia del generador en base de sistema
        const x_g = node.generator.x_sys_base;
        // Desconectar equivale a agregar en paralelo una reactancia de -x_g
        const deltaZ = -x_g;

        const nextZbus = Array(nodes.length).fill(null).map(() => Array(nodes.length).fill(0));
        const z_kk = currentZbus[k][k];

        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            const z_ij = currentZbus[i][j];
            const z_ik = currentZbus[i][k];
            const z_kj = currentZbus[k][j];
            // Lema de Sherman-Morrison general
            nextZbus[i][j] = z_ij - (z_ik * z_kj) / (z_kk + deltaZ);
          }
        }
        currentZbus = nextZbus;
      }
    });

    // Mapear los elementos diagonales resultantes a Ssc y SCR
    return nodes.map((node, i) => {
      const z_ii = Math.abs(currentZbus[i][i]);
      const sscDynamic = baseMVA / z_ii;
      const scr = node.ibr_capacity_mw > 0 ? sscDynamic / node.ibr_capacity_mw : Infinity;
      return {
        id: node.id,
        name: node.name,
        voltage_kv: node.voltage_kv,
        ibr_capacity_mw: node.ibr_capacity_mw,
        generator: node.generator,
        sscDynamic: sscDynamic,
        scr: scr,
        statusColor: getScrColor(scr),
        x: geoToSvg(node.lat, node.lon).x,
        y: geoToSvg(node.lat, node.lon).y
      };
    });
  }, [activeGenerators]);

  const metricsMap = useMemo(() => {
    return Object.fromEntries(networkMetrics.map(m => [m.id, m]));
  }, [networkMetrics]);

  const toggleGenerator = useCallback((nodeId) => {
    setActiveGenerators(prev => {
      const nextState = new Set(prev);
      if (nextState.has(nodeId)) {
        nextState.delete(nodeId);
      } else {
        nextState.add(nodeId);
      }
      return nextState;
    });
  }, []);

  const hoveredData = hoveredNode ? metricsMap[hoveredNode] : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="calculator.badge">Simulador Dinámico de Impedancia</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="calculator.title">Calculadora de Fortaleza de Red (SCR / Ssc)</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="calculator.subtitle">
            Conecta o desconecta generadores síncronos para evaluar el impacto en el Short Circuit Ratio (SCR) nodal en tiempo real mediante el Lema de Sherman-Morrison.
          </Translate>
        </p>
      </div>

      <div className={styles.layout}>
        {/* Mapa vectorial */}
        <div className={styles.mapContainer}>
          <svg viewBox="0 0 1000 800" className={styles.svg}>
            <defs>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dibujo de fondo del mapa */}
            <path d={IBERIA_PATH} className={styles.landES} />
            <path d={PORTUGAL_PATH} className={styles.landPT} />

            {/* Líneas de transporte */}
            {NETWORK_DATA.edges.map((edge, idx) => {
              const src = metricsMap[edge.from];
              const tgt = metricsMap[edge.to];
              if (!src || !tgt) return null;

              const isWeak = src.scr < 3.0 || tgt.scr < 3.0;
              const isCritical = src.scr < 2.0 || tgt.scr < 2.0;

              let lineClass = styles.lineActive;
              if (isCritical) lineClass = styles.lineCritical;
              else if (isWeak) lineClass = styles.lineWeak;

              return (
                <line
                  key={idx}
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  className={lineClass}
                />
              );
            })}

            {/* Nodos interactivos */}
            {networkMetrics.map(node => {
              const isHovered = hoveredNode === node.id;
              const hasGen = !!node.generator;
              const isGenActive = hasGen && activeGenerators.has(node.id);

              let filterUrl = 'none';
              if (node.scr < 2.0) filterUrl = 'url(#glowRed)';
              else if (node.scr < 3.0) filterUrl = 'url(#glowYellow)';
              else if (node.scr !== Infinity) filterUrl = 'url(#glowGreen)';

              return (
                <g
                  key={node.id}
                  className={styles.nodeGroup}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => hasGen && toggleGenerator(node.id)}
                >
                  {/* Halo interactivo */}
                  {hasGen && (
                    <circle
                      cx={node.x} cy={node.y} r={isHovered ? 28 : 22}
                      className={isGenActive ? styles.genActiveRing : styles.genInactiveRing}
                    />
                  )}

                  {/* Círculo del nodo */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={hasGen ? 14 : 9}
                    fill={node.statusColor}
                    stroke={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={isHovered ? 3 : 1.5}
                    filter={filterUrl}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Indicador de estado del generador */}
                  {hasGen && (
                    <circle
                      cx={node.x} cy={node.y} r={5}
                      fill={isGenActive ? '#33FF57' : '#FF3333'}
                    />
                  )}

                  {/* Etiqueta del nodo */}
                  <text
                    x={node.x} y={node.y - 20}
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

        {/* Panel de control y telemetría */}
        <div className={styles.telemetryPanel}>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>
              <Translate id="calculator.control_panel">Panel de Control de Generación</Translate>
            </h4>
            <p className={styles.cardDesc}>
              <Translate id="calculator.control_panel_desc">Haz clic en los nudos de generación síncrona en el mapa o utiliza los interruptores inferiores para simular su desconexión.</Translate>
            </p>

            <div className={styles.togglesList}>
              {NETWORK_DATA.nodes.filter(n => n.generator).map(node => {
                const isActive = activeGenerators.has(node.id);
                return (
                  <div key={node.id} className={styles.toggleItem}>
                    <div>
                      <span className={styles.toggleName}>{node.name}</span>
                      <span className={styles.toggleDetail}>
                        {node.generator.type === 'nuclear' ? 'Central Nuclear' : 'Ciclo Combinado'} ({node.generator.s_nom_mva} MVA)
                      </span>
                    </div>
                    <button
                      className={`${styles.switchBtn} ${isActive ? styles.switchOn : styles.switchOff}`}
                      onClick={() => toggleGenerator(node.id)}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Información del nodo seleccionado o hovered */}
          <div className={`${styles.card} ${styles.detailCard}`}>
            {hoveredData ? (
              <>
                <h4 className={styles.cardTitle} style={{ color: hoveredData.statusColor }}>
                  {hoveredData.name}
                </h4>
                <div className={styles.metaRow}>
                  <span>Tensión Nominal:</span>
                  <strong>{hoveredData.voltage_kv} kV</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Capacidad IBR:</span>
                  <strong>{hoveredData.ibr_capacity_mw > 0 ? `${hoveredData.ibr_capacity_mw} MW` : 'N/A'}</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Potencia Cortocircuito (S<sub>sc</sub>):</span>
                  <strong>{Math.round(hoveredData.sscDynamic).toLocaleString()} MVA</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Short Circuit Ratio (SCR):</span>
                  <strong style={{ color: hoveredData.statusColor }}>
                    {hoveredData.scr === Infinity ? '∞' : hoveredData.scr.toFixed(2)}
                  </strong>
                </div>
                <div className={styles.statusDescription}>
                  {hoveredData.scr === Infinity ? (
                    <p>Nudo pasivo de transporte. Sin generación renovable inyectada en barras.</p>
                  ) : hoveredData.scr < 2.0 ? (
                    <p style={{ color: '#FF3333' }}>
                      <strong>CRÍTICO (SCR &lt; 2.0):</strong> Nudo en red extremadamente débil. Los lazos de control de los inversores (PLL) perderán sincronismo de forma inminente ante faltas de red.
                    </p>
                  ) : hoveredData.scr < 3.0 ? (
                    <p style={{ color: '#FFC300' }}>
                      <strong>MARGINAL (2.0 &le; SCR &lt; 3.0):</strong> Red débil con baja estabilidad dinámica. Requiere control dinámico de tensión rápido y reactancia controlada.
                    </p>
                  ) : (
                    <p style={{ color: '#33FF57' }}>
                      <strong>FUERTE (SCR &ge; 3.0):</strong> Red rígida y estable. Capacidad síncrona suficiente para amortiguar transitorios rápidos de tensión.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.emptyDetail}>
                <p>Pasa el cursor sobre cualquier subestación del mapa para analizar la telemetría dinámica de potencia y estabilidad.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.formulaLegend}>
        <div className={styles.formulaItem}>
          <code>SCR = S_sc / P_IBR</code>
          <span>Short Circuit Ratio</span>
        </div>
        <div className={styles.formulaItem}>
          <code>S_sc = S_base / Z_ii</code>
          <span>Potencia de Cortocircuito Dinámica</span>
        </div>
        <div className={styles.formulaItem}>
          <code>Z_new_ii = Z_ii - (Z_ik)² / (Z_kk + &Delta;Z)</code>
          <span>Lema de Sherman-Morrison (O(N) update)</span>
        </div>
      </div>
    </div>
  );
}

export default function GridStrengthCalculator(props) {
  return (
    <BrowserOnly fallback={
      <div style={{ padding: '2rem', textAlign: 'center', background: '#071326', borderRadius: '8px', color: '#808080' }}>
        Inicializando visor matemático de fortaleza de red...
      </div>
    }>
      {() => <CalculatorContent {...props} />}
    </BrowserOnly>
  );
}
