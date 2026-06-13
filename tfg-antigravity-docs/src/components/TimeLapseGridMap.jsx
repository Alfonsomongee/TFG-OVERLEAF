import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './TimeLapseGridMap.module.css';

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

// Definición de nudos en la red
const NODES = [
  { id: 'N_GUILLENA_400', name: 'Guillena', lat: 37.545, lon: -6.054, generator: null },
  { id: 'N_ALMARAZ_400', name: 'C.N. Almaraz', lat: 39.808, lon: -5.696, generator: { type: 'nuclear' } },
  { id: 'N_DON_RODRIGO_400', name: 'Don Rodrigo', lat: 37.234, lon: -5.882, generator: null },
  { id: 'N_CARMONA_400', name: 'Carmona', lat: 37.471, lon: -5.638, generator: { type: 'ccgt' } },
  { id: 'N_BROVALES_400', name: 'Brovales', lat: 38.312, lon: -6.753, generator: null },
  { id: 'N_HUENEJA_400', name: 'Huéneja', lat: 37.165, lon: -3.001, generator: null },
  { id: 'N_CAPARACENA_400', name: 'Caparacena', lat: 37.235, lon: -3.684, generator: null },
  { id: 'N_SAN_SERVAN_400', name: 'San Serván', lat: 38.865, lon: -6.350, generator: null }
];

// Definición de arcos
const EDGES = [
  { from: 'N_ALMARAZ_400', to: 'N_SAN_SERVAN_400' },
  { from: 'N_SAN_SERVAN_400', to: 'N_BROVALES_400' },
  { from: 'N_BROVALES_400', to: 'N_GUILLENA_400' },
  { from: 'N_GUILLENA_400', to: 'N_CARMONA_400' },
  { from: 'N_GUILLENA_400', to: 'N_DON_RODRIGO_400' },
  { from: 'N_CARMONA_400', to: 'N_DON_RODRIGO_400' },
  { from: 'N_CARMONA_400', to: 'N_CAPARACENA_400' },
  { from: 'N_CAPARACENA_400', to: 'N_HUENEJA_400' }
];

// Cronología del colapso (0 - 32,000 ms)
const TIMELINE_EVENTS = [
  { ms: 0, title: 'Estabilidad de Red (t = 0.0s)', desc: 'Sistema eléctrico en configuración de alta exportación en equilibrio dinámico.' },
  { ms: 1500, title: 'Disparo de Trafo (t = 1.5s)', desc: 'Fallo y desconexión automática del transformador 400/220 kV de Caparacena (Granada) por sobretensión.' },
  { ms: 4000, title: 'Efecto Ferranti Inicial (t = 4.0s)', desc: 'Sobretensión capacitiva inicial detectada en subestación de Don Rodrigo (Sevilla). Línea Caparacena - Huéneja saturada.' },
  { ms: 8000, title: 'Sobretensión Generalizada (t = 8.0s)', desc: 'Efecto Ferranti severo se propaga. Líneas Guillena - Carmona y Almaraz - Guillena en vacío entran en pulsación crítica.' },
  { ms: 12000, title: 'Disparo ANSI 59 Sevilla (t = 12.0s)', desc: 'Los relés de protección ANSI 59 actúan por sobretensión en Don Rodrigo, desconectando 1.200 MW fotovoltaicos.' },
  { ms: 16000, title: 'Cascada de Inversores (t = 16.0s)', desc: 'Desconexiones en cascada de IBR en subestaciones de Brovales y Huéneja por sobretensión crítica de red.' },
  { ms: 20000, title: 'Inestabilidad de Carmona (t = 20.0s)', desc: 'Oscilaciones severas de potencia reactiva. El Ciclo Combinado de Carmona registra pre-alarma de sobretensión.' },
  { ms: 24000, title: 'Pérdida de Generación Térmica (t = 24.0s)', desc: 'Disparo por sobretensión en vacío del Ciclo Combinado de Carmona, eliminando 800 MVA de inercia y reactiva.' },
  { ms: 28000, title: 'Derrumbe de Frecuencia y UFLS (t = 28.0s)', desc: 'Caída de frecuencia bajo 48.5 Hz. Actuación rápida del deslastre de carga automático por mínima frecuencia (ANSI 81U).' },
  { ms: 32000, title: 'Cero Eléctrico Sistémico (t = 32.0s)', desc: 'Apagón total del subsistema andaluz-extremeño. Pérdida irreversible de estabilidad angular y colapso de la red.' }
];

function TimeLapseContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0); // Sincronizado para el slider cuando está en pausa

  // Refs de manipulación imperativa del DOM
  const containerRef = useRef(null);
  const timeTextRef = useRef(null);
  const eventTitleRef = useRef(null);
  const eventDescRef = useRef(null);
  const progressBarRef = useRef(null);
  const sliderRef = useRef(null);

  // Reloj de animación
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const currentTimeRef = useRef(0);
  const isPlayingRef = useRef(false);

  const DURATION_MS = 32000;

  // Lógica imperativa para actualizar elementos visuales
  const onTick = useCallback((progress) => {
    // 1. Actualizar textos de telemetría e indicador
    if (timeTextRef.current) {
      timeTextRef.current.innerText = `${(progress / 1000).toFixed(2)}s / ${(DURATION_MS / 1000).toFixed(0)}s`;
    }
    
    // Encontrar evento cronológico activo
    const currentEvent = TIMELINE_EVENTS.slice().reverse().find(e => progress >= e.ms) || TIMELINE_EVENTS[0];
    if (eventTitleRef.current) eventTitleRef.current.innerText = currentEvent.title;
    if (eventDescRef.current) eventDescRef.current.innerText = currentEvent.desc;

    // Actualizar barras de progreso y sliders
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(progress / DURATION_MS) * 100}%`;
    }
    if (sliderRef.current) {
      sliderRef.current.value = progress;
    }

    // 2. Mutar de forma eficiente los estados de nodos y líneas en el SVG
    if (!containerRef.current) return;

    // Actualización de nodos
    NODES.forEach(node => {
      const nodeEl = containerRef.current.querySelector(`#node-${node.id}`);
      const ringEl = containerRef.current.querySelector(`#ring-${node.id}`);
      if (!nodeEl) return;

      // Limpiar clases
      nodeEl.classList.remove(styles.nodeWarning, styles.nodeTripOff, styles.nodeBlackout);
      if (ringEl) ringEl.classList.remove(styles.nodeWarning, styles.nodeTripOff, styles.nodeBlackout);

      // Determinar estado basado en marcas de tiempo específicas
      if (progress >= 32000) {
        nodeEl.classList.add(styles.nodeBlackout);
        if (ringEl) ringEl.classList.add(styles.nodeBlackout);
      } else {
        let state = 'stable';
        if (node.id === 'N_HUENEJA_400') {
          if (progress >= 1500 && progress < 16000) state = 'warning';
          else if (progress >= 16000) state = 'trip';
        } else if (node.id === 'N_CAPARACENA_400') {
          if (progress >= 1500) state = 'trip';
        } else if (node.id === 'N_DON_RODRIGO_400') {
          if (progress >= 4000 && progress < 12000) state = 'warning';
          else if (progress >= 12000) state = 'trip';
        } else if (node.id === 'N_BROVALES_400') {
          if (progress >= 8000 && progress < 16000) state = 'warning';
          else if (progress >= 16000) state = 'trip';
        } else if (node.id === 'N_CARMONA_400') {
          if (progress >= 20000 && progress < 24000) state = 'warning';
          else if (progress >= 24000) state = 'trip';
        } else if (node.id === 'N_ALMARAZ_400') {
          if (progress >= 28000) state = 'warning';
        } else if (node.id === 'N_SAN_SERVAN_400') {
          if (progress >= 26000) state = 'warning';
        }

        if (state === 'warning') {
          nodeEl.classList.add(styles.nodeWarning);
          if (ringEl) ringEl.classList.add(styles.nodeWarning);
        } else if (state === 'trip') {
          nodeEl.classList.add(styles.nodeTripOff);
          if (ringEl) ringEl.classList.add(styles.nodeTripOff);
        }
      }
    });

    // Actualización de líneas (edges)
    EDGES.forEach(edge => {
      const lineEl = containerRef.current.querySelector(`#edge-${edge.from}-${edge.to}`);
      if (!lineEl) return;

      lineEl.classList.remove(styles.lineFerrantiActive, styles.lineTripOff, styles.lineBlackout);

      if (progress >= 32000) {
        lineEl.classList.add(styles.lineBlackout);
      } else {
        const edgeId = `${edge.from}-${edge.to}`;
        let state = 'stable';

        if (edgeId === 'N_CAPARACENA_400-N_HUENEJA_400') {
          if (progress >= 1500 && progress < 16000) state = 'ferranti';
          else if (progress >= 16000) state = 'trip';
        } else if (edgeId === 'N_CARMONA_400-N_CAPARACENA_400') {
          if (progress >= 4000 && progress < 24000) state = 'ferranti';
          else if (progress >= 24000) state = 'trip';
        } else if (edgeId === 'N_GUILLENA_400-N_CARMONA_400') {
          if (progress >= 8000 && progress < 24000) state = 'ferranti';
          else if (progress >= 24000) state = 'trip';
        } else if (edgeId === 'N_GUILLENA_400-N_DON_RODRIGO_400' || edgeId === 'N_CARMONA_400-N_DON_RODRIGO_400') {
          if (progress >= 8000 && progress < 12000) state = 'ferranti';
          else if (progress >= 12000) state = 'trip';
        } else if (edgeId === 'N_ALMARAZ_400-N_SAN_SERVAN_400') {
          if (progress >= 8000) state = 'ferranti';
        } else if (edgeId === 'N_SAN_SERVAN_400-N_BROVALES_400' || edgeId === 'N_BROVALES_400-N_GUILLENA_400') {
          if (progress >= 8000 && progress < 16000) state = 'ferranti';
          else if (progress >= 16000) state = 'trip';
        }

        if (state === 'ferranti') {
          lineEl.classList.add(styles.lineFerrantiActive);
        } else if (state === 'trip') {
          lineEl.classList.add(styles.lineTripOff);
        }
      }
    });

    // 3. Mostrar u ocultar el overlay de blackout
    const overlayEl = containerRef.current.querySelector('#blackout-overlay');
    if (overlayEl) {
      if (progress >= 32000) {
        overlayEl.classList.add(styles.overlayVisible);
      } else {
        overlayEl.classList.remove(styles.overlayVisible);
      }
    }

  }, []);

  // Bucle requestAnimationFrame
  const animate = useCallback((time) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = time - currentTimeRef.current;
    }
    
    let progress = time - startTimeRef.current;
    
    if (progress >= DURATION_MS) {
      progress = DURATION_MS;
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    currentTimeRef.current = progress;
    setSimTime(progress);
    onTick(progress);
  }, [onTick]);

  // Manejar cambio en Play/Pause
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      startTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Controlador de salto temporal en slider
  const seek = useCallback((timeMs) => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    startTimeRef.current = null;
    currentTimeRef.current = timeMs;
    setSimTime(timeMs);
    onTick(timeMs);
  }, [onTick]);

  const handleSliderInput = (e) => {
    const value = parseInt(e.target.value, 10);
    seek(value);
  };

  const togglePlay = () => {
    if (simTime >= DURATION_MS) {
      seek(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Nodos proyectados memoizados
  const projectedNodes = useMemo(() => {
    return NODES.map(n => ({
      ...n,
      ...geoToSvg(n.lat, n.lon)
    }));
  }, []);

  const nodesMap = useMemo(() => {
    return Object.fromEntries(projectedNodes.map(n => [n.id, n]));
  }, [projectedNodes]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="timelapse.badge">Cronografía Telegráfica</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="timelapse.title">Mapa Temporal del Colapso (Time-lapse 0-32s)</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="timelapse.subtitle">
            Visualiza en tiempo real de milisegundos la propagación del Efecto Ferranti, alarmas de sobretensión y disparos automáticos ANSI 59.
          </Translate>
        </p>
      </div>

      <div className={styles.layout}>
        {/* Mapa GIS SVG */}
        <div className={styles.mapContainer}>
          <svg viewBox="0 0 1000 800" className={styles.svg}>
            {/* Dibujo de contorno del mapa */}
            <path d={IBERIA_PATH} className={styles.landES} />
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
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  className={styles.lineActive}
                />
              );
            })}

            {/* Nodos */}
            {projectedNodes.map(node => {
              const hasGen = !!node.generator;
              return (
                <g key={node.id} className={styles.nodeGroup}>
                  {/* Anillo de advertencia o estado de alternador */}
                  {hasGen && (
                    <circle
                      id={`ring-${node.id}`}
                      cx={node.x} cy={node.y} r={20}
                      className={styles.genRing}
                    />
                  )}

                  {/* Nodo físico */}
                  <circle
                    id={`node-${node.id}`}
                    cx={node.x} cy={node.y}
                    r={hasGen ? 12 : 8}
                    className={styles.nodeCircle}
                  />

                  {/* Etiqueta */}
                  <text
                    x={node.x} y={node.y - 18}
                    className={styles.nodeLabel}
                    textAnchor="middle"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}

            {/* Overlay de Blackout total */}
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

        {/* Telemetría y Log de eventos */}
        <div className={styles.telemetryPanel}>
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
              >
                {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
              </button>
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="32000"
                step="50"
                defaultValue="0"
                onInput={handleSliderInput}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={`${styles.card} ${styles.eventCard}`}>
            <h4 ref={eventTitleRef} className={styles.eventTitle}>
              Estabilidad de Red
            </h4>
            <p ref={eventDescRef} className={styles.eventDesc}>
              Sistema eléctrico en configuración de alta exportación en equilibrio dinámico.
            </p>
          </div>

          <div className={styles.legendCard}>
            <h4 className={styles.legendTitle}>Leyenda del Estado de Red</h4>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotStable}`} />
                <span>Estable (400 kV)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.colorDot} ${styles.dotWarning}`} />
                <span>Sobre-Voltaje (ANSI 59)</span>
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
    <BrowserOnly fallback={
      <div style={{ padding: '2rem', textAlign: 'center', background: '#050a14', borderRadius: '8px', color: '#808080' }}>
        Inicializando bucle temporal rAF para el mapa GIS...
      </div>
    }>
      {() => <TimeLapseContent {...props} />}
    </BrowserOnly>
  );
}
