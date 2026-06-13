import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './TimeLapseGridMap.module.css';

// ─── Proyección geográfica simplificada (viewBox 1000x800) ───────────────────
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX    = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west)  / (GEO_BOUNDS.east  - GEO_BOUNDS.west))  * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

const IBERIA_OUTLINE = [
  [43.78, -7.86], [43.47, -8.45], [42.88, -9.28], [42.03, -8.87], [41.87, -8.87],
  [41.38, -8.73], [40.64, -8.75], [39.36, -9.40], [38.62, -9.50], [37.01, -8.91],
  [36.97, -7.85], [36.01, -5.61], [36.17, -5.36], [36.69, -4.41], [36.72, -3.48],
  [37.20, -1.90], [37.64, -0.69], [38.68,  0.23], [39.58,  0.34], [40.72,  0.73],
  [41.29,  1.83], [41.42,  2.22], [42.43,  3.16], [42.80,  1.72], [43.37, -1.79],
  [43.49, -3.80], [43.57, -5.66], [43.78, -7.86]
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87], [41.52, -6.92], [39.67, -7.06], [37.43, -7.44], [36.97, -7.85],
  [37.01, -8.91], [38.62, -9.50], [39.36, -9.40], [40.64, -8.75], [41.38, -8.73],
  [41.87, -8.87]
];

function pointsToPath(points) {
  return points
    .map((p, i) => {
      const { x, y } = geoToSvg(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ') + ' Z';
}

const IBERIA_PATH  = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);

// ─── Nudos de la red de 400 kV ───────────────────────────────────────────────
const NODES = [
  { id: 'N_GUILLENA_400',   name: 'Guillena',     lat: 37.545, lon: -6.054, generator: null },
  { id: 'N_ALMARAZ_400',    name: 'C.N. Almaraz', lat: 39.808, lon: -5.696, generator: { type: 'nuclear' } },
  { id: 'N_DON_RODRIGO_400',name: 'Don Rodrigo',  lat: 37.234, lon: -5.882, generator: null },
  { id: 'N_CARMONA_400',    name: 'Carmona',      lat: 37.471, lon: -5.638, generator: { type: 'ccgt' } },
  { id: 'N_BROVALES_400',   name: 'Brovales',     lat: 38.312, lon: -6.753, generator: null },
  { id: 'N_HUENEJA_400',    name: 'Huéneja',      lat: 37.165, lon: -3.001, generator: null },
  { id: 'N_CAPARACENA_400', name: 'Caparacena',   lat: 37.235, lon: -3.684, generator: null },
  { id: 'N_SAN_SERVAN_400', name: 'San Serván',   lat: 38.865, lon: -6.350, generator: null }
];

// ─── Aristas de la red ───────────────────────────────────────────────────────
const EDGES = [
  { from: 'N_ALMARAZ_400',    to: 'N_SAN_SERVAN_400' },
  { from: 'N_SAN_SERVAN_400', to: 'N_BROVALES_400' },
  { from: 'N_BROVALES_400',   to: 'N_GUILLENA_400' },
  { from: 'N_GUILLENA_400',   to: 'N_CARMONA_400' },
  { from: 'N_GUILLENA_400',   to: 'N_DON_RODRIGO_400' },
  { from: 'N_CARMONA_400',    to: 'N_DON_RODRIGO_400' },
  { from: 'N_CARMONA_400',    to: 'N_CAPARACENA_400' },
  { from: 'N_CAPARACENA_400', to: 'N_HUENEJA_400' }
];

// ─── Cronología del colapso (0 – 32 000 ms) ──────────────────────────────────
const TIMELINE_EVENTS = [
  { ms:     0, title: 'Estabilidad de Red (t = 0.0s)',         desc: 'Sistema eléctrico en configuración de alta exportación en equilibrio dinámico.' },
  { ms:  1500, title: 'Disparo de Trafo (t = 1.5s)',           desc: 'Fallo y desconexión automática del transformador 400/220 kV de Caparacena (Granada) por sobretensión.' },
  { ms:  4000, title: 'Efecto Ferranti Inicial (t = 4.0s)',    desc: 'Sobretensión capacitiva inicial detectada en Don Rodrigo (Sevilla). Línea Caparacena–Huéneja saturada.' },
  { ms:  8000, title: 'Sobretensión Generalizada (t = 8.0s)',  desc: 'Efecto Ferranti severo propagado. Líneas Guillena–Carmona y Almaraz–Guillena en vacío entran en pulsación crítica.' },
  { ms: 12000, title: 'Disparo ANSI 59 Sevilla (t = 12.0s)',  desc: 'Los relés de protección ANSI 59 actúan por sobretensión en Don Rodrigo, desconectando 1 200 MW fotovoltaicos.' },
  { ms: 16000, title: 'Cascada de Inversores (t = 16.0s)',     desc: 'Desconexiones en cascada de IBR en Brovales y Huéneja por sobretensión crítica de red.' },
  { ms: 20000, title: 'Inestabilidad de Carmona (t = 20.0s)', desc: 'Oscilaciones severas de potencia reactiva. El CCGT de Carmona registra pre-alarma de sobretensión.' },
  { ms: 24000, title: 'Pérdida de Generación Térmica (t = 24.0s)', desc: 'Disparo por sobretensión del CCGT de Carmona, eliminando 800 MVA de inercia y reactiva.' },
  { ms: 28000, title: 'Derrumbe de Frecuencia y UFLS (t = 28.0s)', desc: 'Caída de frecuencia bajo 48.5 Hz. Actuación del deslastre de carga automático por mínima frecuencia (ANSI 81U).' },
  { ms: 32000, title: 'Cero Eléctrico Sistémico (t = 32.0s)', desc: 'Apagón total del subsistema andaluz-extremeño. Pérdida irreversible de estabilidad angular y colapso de la red.' }
];

const DURATION_MS = 32000;
const SPEEDS = [1, 2, 4];

// ─── Resolución del estado de nodo/línea por instante temporal ───────────────
function resolveNodeState(nodeId, progress) {
  if (progress >= DURATION_MS) return 'blackout';
  switch (nodeId) {
    case 'N_HUENEJA_400':
      if (progress >= 16000) return 'trip';
      if (progress >=  1500) return 'warning';
      break;
    case 'N_CAPARACENA_400':
      if (progress >=  1500) return 'trip';
      break;
    case 'N_DON_RODRIGO_400':
      if (progress >= 12000) return 'trip';
      if (progress >=  4000) return 'warning';
      break;
    case 'N_BROVALES_400':
      if (progress >= 16000) return 'trip';
      if (progress >=  8000) return 'warning';
      break;
    case 'N_CARMONA_400':
      if (progress >= 24000) return 'trip';
      if (progress >= 20000) return 'warning';
      break;
    case 'N_ALMARAZ_400':
      if (progress >= 28000) return 'warning';
      break;
    case 'N_SAN_SERVAN_400':
      if (progress >= 26000) return 'warning';
      break;
    default:
      break;
  }
  return 'stable';
}

function resolveEdgeState(edgeId, progress) {
  if (progress >= DURATION_MS) return 'blackout';
  switch (edgeId) {
    case 'N_CAPARACENA_400-N_HUENEJA_400':
      if (progress >= 16000) return 'trip';
      if (progress >=  1500) return 'ferranti';
      break;
    case 'N_CARMONA_400-N_CAPARACENA_400':
      if (progress >= 24000) return 'trip';
      if (progress >=  4000) return 'ferranti';
      break;
    case 'N_GUILLENA_400-N_CARMONA_400':
      if (progress >= 24000) return 'trip';
      if (progress >=  8000) return 'ferranti';
      break;
    case 'N_GUILLENA_400-N_DON_RODRIGO_400':
    case 'N_CARMONA_400-N_DON_RODRIGO_400':
      if (progress >= 12000) return 'trip';
      if (progress >=  8000) return 'ferranti';
      break;
    case 'N_ALMARAZ_400-N_SAN_SERVAN_400':
      if (progress >=  8000) return 'ferranti';
      break;
    case 'N_SAN_SERVAN_400-N_BROVALES_400':
    case 'N_BROVALES_400-N_GUILLENA_400':
      if (progress >= 16000) return 'trip';
      if (progress >=  8000) return 'ferranti';
      break;
    default:
      break;
  }
  return 'stable';
}

const NODE_STATE_CLASS = {
  stable:  null,
  warning: styles.nodeWarning,
  trip:    styles.nodeTripOff,
  blackout:styles.nodeBlackout
};

const EDGE_STATE_CLASS = {
  stable:   styles.lineActive,
  ferranti: styles.lineFerrantiActive,
  trip:     styles.lineTripOff,
  blackout: styles.lineBlackout
};

// ─── Componente principal ─────────────────────────────────────────────────────
function TimeLapseContent() {
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [simTime,    setSimTime]    = useState(0);
  const [playSpeed,  setPlaySpeed]  = useState(1);   // ← multiplicador de velocidad

  // Refs DOM para mutación imperativa (evita re-renders por cada tick RAF)
  const containerRef    = useRef(null);
  const timeTextRef     = useRef(null);
  const eventTitleRef   = useRef(null);
  const eventDescRef    = useRef(null);
  const progressBarRef  = useRef(null);
  const sliderRef       = useRef(null);

  // Refs de animación
  const requestRef     = useRef(null);
  const startTimeRef   = useRef(null);
  const currentTimeRef = useRef(0);
  const isPlayingRef   = useRef(false);
  const playSpeedRef   = useRef(1);

  // Mantener playSpeedRef sincronizado con el estado React
  useEffect(() => {
    playSpeedRef.current = playSpeed;
  }, [playSpeed]);

  // ─── Actualización imperativa del DOM en cada tick ─────────────────────────
  const onTick = useCallback((progress) => {
    // Actualizar cronómetro
    if (timeTextRef.current) {
      timeTextRef.current.innerText =
        `${(progress / 1000).toFixed(2)}s / ${(DURATION_MS / 1000).toFixed(0)}s`;
    }

    // Evento cronológico activo
    const currentEvent =
      [...TIMELINE_EVENTS].reverse().find(e => progress >= e.ms) ?? TIMELINE_EVENTS[0];
    if (eventTitleRef.current) eventTitleRef.current.innerText = currentEvent.title;
    if (eventDescRef.current)  eventDescRef.current.innerText  = currentEvent.desc;

    // Barras de progreso y slider
    const pct = (progress / DURATION_MS) * 100;
    if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
    if (sliderRef.current)      sliderRef.current.value = String(progress);

    if (!containerRef.current) return;

    // Nodos
    NODES.forEach(node => {
      const nodeEl = containerRef.current.querySelector(`#node-${node.id}`);
      const ringEl = containerRef.current.querySelector(`#ring-${node.id}`);
      if (!nodeEl) return;

      // Limpiar estado anterior
      nodeEl.className = styles.nodeCircle;
      if (ringEl) ringEl.className = styles.genRing;

      const state = resolveNodeState(node.id, progress);
      const cls   = NODE_STATE_CLASS[state];
      if (cls) {
        nodeEl.classList.add(cls);
        if (ringEl) ringEl.classList.add(cls);
      }
    });

    // Líneas
    EDGES.forEach(edge => {
      const lineEl = containerRef.current.querySelector(`#edge-${edge.from}-${edge.to}`);
      if (!lineEl) return;

      const state = resolveEdgeState(`${edge.from}-${edge.to}`, progress);
      lineEl.className = EDGE_STATE_CLASS[state] ?? styles.lineActive;
    });

    // Overlay de blackout
    const overlayEl = containerRef.current.querySelector('#blackout-overlay');
    if (overlayEl) {
      overlayEl.classList.toggle(styles.overlayVisible, progress >= DURATION_MS);
    }
  }, []);

  // ─── Bucle requestAnimationFrame con multiplicador de velocidad ────────────
  const animate = useCallback((time) => {
    if (startTimeRef.current === null) {
      // Compensar el tiempo ya transcurrido al reanudar
      startTimeRef.current = time - currentTimeRef.current / playSpeedRef.current;
    }

    const elapsed  = (time - startTimeRef.current) * playSpeedRef.current;
    const progress = Math.min(elapsed, DURATION_MS);

    currentTimeRef.current = progress;
    setSimTime(progress);
    onTick(progress);

    if (progress < DURATION_MS) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [onTick]);

  // ─── Efectos de play/pause ─────────────────────────────────────────────────
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
      startTimeRef.current = null;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, animate]);

  // ─── Salto temporal (seek) ─────────────────────────────────────────────────
  const seek = useCallback((timeMs) => {
    cancelAnimationFrame(requestRef.current);
    setIsPlaying(false);
    isPlayingRef.current = false;
    startTimeRef.current = null;
    currentTimeRef.current = timeMs;
    setSimTime(timeMs);
    onTick(timeMs);
  }, [onTick]);

  // ─── Restart ───────────────────────────────────────────────────────────────
  const restartSim = useCallback(() => seek(0), [seek]);

  // ─── Toggle play/pause ─────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (simTime >= DURATION_MS) {
      restartSim();
      setTimeout(() => setIsPlaying(true), 0);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [simTime, restartSim]);

  const handleSliderInput = (e) => seek(parseInt(e.target.value, 10));

  // ─── Atajos de teclado ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      // Ignorar si el foco está en un input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTimeRef.current - 2000));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(DURATION_MS, currentTimeRef.current + 2000));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          restartSim();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, seek, restartSim]);

  // ─── Nodos proyectados (memoizados) ───────────────────────────────────────
  const projectedNodes = useMemo(
    () => NODES.map(n => ({ ...n, ...geoToSvg(n.lat, n.lon) })),
    []
  );

  const nodesMap = useMemo(
    () => Object.fromEntries(projectedNodes.map(n => [n.id, n])),
    [projectedNodes]
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="timelapse.badge">Cronografía Telegráfica</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="timelapse.title">Mapa Temporal del Colapso (Time-lapse 0–32 s)</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="timelapse.subtitle">
            Visualiza con precisión de milisegundos la propagación del Efecto Ferranti, alarmas ANSI 59 y disparos automáticos.
          </Translate>
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Mapa GIS SVG ── */}
        <div className={styles.mapContainer}>
          <svg
            viewBox="0 0 1000 800"
            className={styles.svg}
            role="img"
            aria-label="Mapa de la red eléctrica ibérica de 400 kV durante el apagón del 28-A"
          >
            <path d={IBERIA_PATH}  className={styles.landES} />
            <path d={PORTUGAL_PATH} className={styles.landPT} />

            {/* Líneas de transporte */}
            {EDGES.map((edge, idx) => {
              const src = nodesMap[edge.from];
              const tgt = nodesMap[edge.to];
              if (!src || !tgt) return null;
              return (
                <line
                  id={`edge-${edge.from}-${edge.to}`}
                  key={idx}
                  x1={src.x} y1={src.y}
                  x2={tgt.x} y2={tgt.y}
                  className={styles.lineActive}
                />
              );
            })}

            {/* Nodos */}
            {projectedNodes.map(node => {
              const hasGen = !!node.generator;
              return (
                <g key={node.id} className={styles.nodeGroup}>
                  {hasGen && (
                    <circle
                      id={`ring-${node.id}`}
                      cx={node.x} cy={node.y} r={20}
                      className={styles.genRing}
                    />
                  )}
                  <circle
                    id={`node-${node.id}`}
                    cx={node.x} cy={node.y}
                    r={hasGen ? 12 : 8}
                    className={styles.nodeCircle}
                  />
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

            {/* Overlay de blackout total */}
            <g id="blackout-overlay" className={styles.blackoutOverlay}>
              <rect width="1000" height="800" className={styles.overlayBg} />
              <text x="500" y="380" textAnchor="middle" className={styles.overlayTitle}>
                CERO ELÉCTRICO GENERALIZADO
              </text>
              <text x="500" y="420" textAnchor="middle" className={styles.overlaySubtitle}>
                t = 32.00 s · Pérdida Completa de Sincronismo y Deslastre de Carga
              </text>
            </g>
          </svg>
        </div>

        {/* ── Telemetría y Log de eventos ── */}
        <div className={styles.telemetryPanel}>

          {/* Cronómetro y controles de reproducción */}
          <div className={styles.card}>
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryLabel}>
                <Translate id="timelapse.time_title">Cronómetro Fasorial</Translate>
              </span>
              <span ref={timeTextRef} className={styles.timeVal}>
                0.00s / 32s
              </span>
            </div>

            <div className={styles.progressTrack}>
              <div ref={progressBarRef} className={styles.progressBar} />
            </div>

            <div className={styles.playControls}>
              <button
                onClick={togglePlay}
                className={`${styles.playBtn} ${isPlaying ? styles.btnActive : ''}`}
                aria-label={isPlaying ? 'Pausar simulación' : 'Reproducir simulación'}
              >
                {isPlaying ? '⏸ PAUSA' : '▶ PLAY'}
              </button>

              <input
                ref={sliderRef}
                type="range"
                min="0"
                max={DURATION_MS}
                step="50"
                defaultValue="0"
                onInput={handleSliderInput}
                className={styles.slider}
                aria-label="Barra de tiempo de la simulación"
              />

              <button
                onClick={restartSim}
                className={styles.btnRestart}
                title="Reiniciar (R)"
                aria-label="Reiniciar simulación"
              >
                ↺
              </button>
            </div>

            {/* Control de velocidad */}
            <div className={styles.speedGroup} style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className={styles.speedLabel}>VEL:</span>
              {SPEEDS.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setPlaySpeed(s);
                    // Resetear el timestamp base para que el nuevo speed arranque limpio
                    startTimeRef.current = null;
                  }}
                  className={`${styles.speedBtn} ${playSpeed === s ? styles.speedBtnActive : ''}`}
                  aria-pressed={playSpeed === s}
                >
                  {s}×
                </button>
              ))}
            </div>

            <p className={styles.keyboardHint}>
              Espacio = play/pausa · ← → = ±2 s · R = reiniciar
            </p>
          </div>

          {/* Evento activo */}
          <div className={`${styles.card} ${styles.eventCard}`}>
            <h4 ref={eventTitleRef} className={styles.eventTitle}>
              Estabilidad de Red
            </h4>
            <p ref={eventDescRef} className={styles.eventDesc}>
              Sistema eléctrico en configuración de alta exportación en equilibrio dinámico.
            </p>
          </div>

          {/* Leyenda */}
          <div className={styles.legendCard}>
            <h4 className={styles.legendTitle}>Leyenda del Estado de Red</h4>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotStable}`} />
                <span>Estable (400 kV)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotWarning}`} />
                <span>Sobre-Voltaje ANSI 59</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotTrip}`} />
                <span>Tripped / Desconectado</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotFerranti}`} />
                <span>Efecto Ferranti</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TimeLapseGridMap(props) {
  return (
    <BrowserOnly
      fallback={
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#050a14',
          borderRadius: '8px',
          color: '#808080',
          fontFamily: 'monospace'
        }}>
          Inicializando bucle temporal rAF para el mapa GIS…
        </div>
      }
    >
      {() => <TimeLapseContent {...props} />}
    </BrowserOnly>
  );
}
