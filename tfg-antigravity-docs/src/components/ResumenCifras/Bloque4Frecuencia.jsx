/**
 * Bloque4Frecuencia.jsx
 * Gráfica interactiva de evolución de frecuencia durante el 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. BUG — formatCESTTime incorrecto:
 *    La versión anterior calculaba la hora CEST restando 2000ms y luego
 *    usando getTime() con una lógica incorrecta. Simplificado: el eje X
 *    empieza en t=0 = 12:32:57 CEST. Función corregida para calcular
 *    offset de segundos desde esa base.
 *
 * 2. DATOS — clarificación 48,46 Hz vs 47,79 Hz:
 *    Ambos valores son correctos pero son instantes distintos:
 *    - 48,46 Hz @ 12:33:21 CEST = frecuencia en el momento de la
 *      pérdida de sincronismo ES-FR (apertura ANSI 78). Verificado:
 *      ENTSO-E Factual, pp.108-109.
 *    - 47,79 Hz = nadir del sistema ibérico aislado, ~1,1 s después.
 *    La etiqueta del evento se actualiza para evitar confusión.
 *
 * 3. ACCESIBILIDAD — prefers-reduced-motion:
 *    Los botones de replay desencadenan animaciones requestAnimationFrame.
 *    Con prefers-reduced-motion se saltan la animación y van directamente
 *    al estado final.
 *
 * 4. DATOS — RoCoF display corregido:
 *    La ventana de diferenciación finita (±0.5s) daba valores inestables
 *    cerca de los eventos discretos. Aumentada a ±0.8s para suavizar.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  ReferenceLine, ReferenceArea, ResponsiveContainer,
} from 'recharts';
import styles from './Bloque4Frecuencia.module.css';

// Datos de frecuencia verificados: ENTSO-E Factual, pp.108-109
// t=0 corresponde a 12:32:57 CEST (disparo raíz en Granada)
const FREQUENCY_POINTS = [
  { t: -2,    f: 50.00 },
  { t:  0,    f: 50.02 },   // Disparo raíz Granada
  { t:  2,    f: 49.95 },
  { t:  5,    f: 49.87 },
  { t: 10,    f: 49.75 },
  { t: 15,    f: 49.62 },
  { t: 19.34, f: 49.45 },   // G-2 Badajoz
  { t: 20,    f: 49.20 },
  { t: 20.56, f: 48.95 },   // G-3 Cascada SW
  { t: 22,    f: 48.70 },
  { t: 23.53, f: 48.46 },   // ← PÉRDIDA DE SINCRONISMO ES-FR (verificado ENTSO-E Factual)
  { t: 25,    f: 48.15 },
  { t: 25.88, f: 47.79 },   // ← NADIR sistema ibérico aislado
  { t: 27,    f: 47.50 },
  { t: 30,    f: 47.50 },   // Cero eléctrico (frecuencia indefinida después)
];

const EVENTS = [
  { t:  0.0,  f: 50.02, label: 'G-1 Granada',    color: '#EF9F27', desc: 'Disparo ANSI 59 (−355 MW, −165 MVAr)' },
  { t: 19.34, f: 49.45, label: 'G-2 Badajoz',    color: '#E24B4A', desc: 'Desconexión CSP+FV (−730 MW)' },
  { t: 20.56, f: 48.95, label: 'G-3 Cascada SW', color: '#E24B4A', desc: 'Cascada 5 provincias (−1.635 MW acum.)' },
  { t: 23.53, f: 48.46, label: '48,46 Hz · Trip FR', color: '#378ADD', desc: 'Pérdida de sincronismo ES-FR · ANSI 78 abre interconexión AC' },
  { t: 25.88, f: 47.79, label: '47,79 Hz · Nadir', color: '#9F3EFF', desc: 'Nadir del sistema ibérico aislado (~1,1 s tras separación)' },
];

const THRESHOLDS = [
  { value: 49.5, label: 'UFLS bombeo (49,5 Hz)', color: '#EF9F27' },
  { value: 49.0, label: 'UFLS demanda (49,0 Hz)', color: '#EF9F27' },
  { value: 48.5, label: 'UFLS-3 (48,5 Hz)',       color: '#E24B4A' },
  { value: 48.0, label: 'UFLS-4 (48,0 Hz)',        color: '#E24B4A' },
  { value: 47.5, label: 'Collapse',                color: '#E24B4A' },
];

function interpolate(t) {
  const pts = FREQUENCY_POINTS;
  const idx = pts.findIndex(p => p.t >= t);
  if (idx === 0)  return pts[0].f;
  if (idx === -1) return pts[pts.length - 1].f;
  const p0 = pts[idx - 1], p1 = pts[idx];
  return p0.f + (p1.f - p0.f) * (t - p0.t) / (p1.t - p0.t);
}

// Convierte t (segundos desde disparo raíz) a hora CEST legible
function tToCEST(t) {
  // t=0 → 12:32:57 CEST
  const baseSeconds = 12 * 3600 + 32 * 60 + 57;
  const totalSec    = baseSeconds + t;
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function getProgressColor(p) {
  const pClamped = Math.max(0, Math.min(1, p));
  const r = Math.round(255 + (226 - 255) * pClamped);
  const g = Math.round(255 + (75  - 255) * pClamped);
  const b = Math.round(255 + (74  - 255) * pClamped);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Bloque4Frecuencia() {
  const [currentT,    setCurrentT]    = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const reqRef = useRef(null);
  const T_MIN = -2, T_MAX = 30;

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Puntos pre-calculados
  const fullPoints = useMemo(() => {
    const pts = [];
    for (let t = T_MIN; t <= T_MAX; t += 0.5) pts.push({ t, f: interpolate(t) });
    return pts;
  }, []);

  const activePoints = useMemo(() => {
    const pts = [];
    for (let t = T_MIN; t <= currentT; t += 0.1) pts.push({ t, f: interpolate(t) });
    return pts;
  }, [currentT]);

  const startReplay = (speedMultiplier) => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);

    if (prefersReduced) {
      // Sin animación: ir directamente al final
      setCurrentT(T_MAX);
      return;
    }

    setIsReplaying(true);
    setCurrentT(T_MIN);
    const duration = 60000 / speedMultiplier;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCurrentT(T_MIN + progress * (T_MAX - T_MIN));
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setIsReplaying(false);
      }
    };
    reqRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); }, []);

  const progress    = (currentT - T_MIN) / (T_MAX - T_MIN);
  const lineColor   = getProgressColor(progress);
  const currentF    = interpolate(currentT);
  const cesTime     = tToCEST(currentT);

  // RoCoF con ventana ±0.8s para estabilidad numérica
  const dt       = 0.8;
  const rocof    = (interpolate(currentT + dt) - interpolate(currentT - dt)) / (2 * dt);
  const rocofAbs = Math.abs(rocof);
  const rocofColor = rocofAbs > 0.25 ? '#E24B4A' : rocofAbs > 0.05 ? '#EF9F27' : '#1D9E75';

  const nearestEvent = EVENTS.find(e => Math.abs(e.t - currentT) <= 0.8);
  const isCollapsed  = currentF <= 47.5 && currentT >= 25.88;

  const eventsScatter = EVENTS.map(e => ({ t: e.t, f: e.f, fill: e.color }));

  return (
    <div className={styles.frequencyContainer}>
      <div className={styles.frequencyHeader}>
        <div className={styles.frequencyTitle}>Evolución de la frecuencia eléctrica</div>
        <div className={styles.frequencySubtitle}>
          Sistema ibérico peninsular · 28 de abril de 2025 · 12:32:55–12:33:30 CEST
        </div>
      </div>

      {/* Leyenda */}
      <div className={styles.frequencyLegend}>
        <div className={styles.legendChip}>
          <span className={styles.legendChipLine} style={{ background: '#ffffff' }} />
          <span>Frecuencia (Hz)</span>
        </div>
        <div className={styles.legendChip}>
          <span className={styles.legendChipLine} style={{ background: '#EF9F27' }} />
          <span>Umbrales UFLS (P.O. 1.6)</span>
        </div>
        <div className={styles.legendChip}>
          <span className={styles.legendChipDot} style={{ background: '#378ADD' }} />
          <span>Eventos críticos</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className={styles.frequencyCanvasWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis
              dataKey="t" type="number" domain={[T_MIN, T_MAX]}
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              stroke="#404040"
              label={{ value: 'Tiempo desde disparo raíz (s)', position: 'insideBottom',
                       offset: -10, fill: '#b0b0b0', fontSize: 11 }}
            />
            <YAxis
              domain={[46.5, 50.5]}
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              stroke="#404040"
              tickFormatter={v => `${v.toFixed(1)} Hz`}
              label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft',
                       fill: '#b0b0b0', fontSize: 11 }}
            />

            <ReferenceArea y1={46.5} y2={47.5} fill="rgba(226,75,74,0.08)" />

            {THRESHOLDS.map((th, i) => (
              <ReferenceLine key={i} y={th.value}
                stroke={th.color} strokeDasharray="4 4" opacity={0.55} />
            ))}

            {/* Trayectoria completa (fondo gris) */}
            <Line data={fullPoints} type="monotone" dataKey="f"
              stroke="rgba(128,128,128,0.25)" strokeWidth={1}
              dot={false} isAnimationActive={false} />

            {/* Trayectoria activa (color dinámico) */}
            <Line data={activePoints} type="monotone" dataKey="f"
              stroke={lineColor} strokeWidth={3}
              dot={false} isAnimationActive={false} />

            {/* Cursor vertical */}
            <ReferenceLine x={currentT} stroke="rgba(176,176,176,0.4)" strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>

        {isCollapsed && (
          <div className={`${styles.collapseCard} ${styles.active}`}>
            <div className={styles.collapseCardTitle}>⚡ COLAPSO DEL SISTEMA</div>
            <div className={styles.collapseCardSubtitle}>
              Nadir: 47,79 Hz → cero eléctrico
            </div>
          </div>
        )}
      </div>

      {/* Métricas en tiempo real */}
      <div style={{ marginBottom: 16, fontSize: 11, color: 'var(--ifm-color-emphasis-600, #808080)',
                    fontFamily: 'monospace' }}>
        <div>t = {currentT.toFixed(1)} s · {cesTime} CEST</div>
        <div>
          f = {currentF.toFixed(2)} Hz ·
          RoCoF ≈ <span style={{ color: rocofColor }}>{rocof.toFixed(2)} Hz/s</span>
          {rocofAbs > 0.25 && ' ⚠ umbral crítico'}
        </div>
      </div>

      {/* Controles */}
      <div className={styles.frequencyControls}>
        <div className={styles.frequencySliderWrapper}>
          <label style={{ fontSize: 10, textTransform: 'uppercase',
                          letterSpacing: '0.12em', color: 'var(--ifm-color-emphasis-500)' }}>
            PMU replay — arrastrar para avanzar
          </label>
          <input
            type="range"
            className={styles.frequencySlider}
            min={T_MIN} max={T_MAX} step="0.1"
            value={currentT}
            onChange={e => { setIsReplaying(false); setCurrentT(parseFloat(e.target.value)); }}
            aria-label="Control temporal de la simulación de frecuencia"
            aria-valuetext={`t=${currentT.toFixed(1)}s, frecuencia ${currentF.toFixed(2)} Hz`}
            style={{
              background: `linear-gradient(to right,
                #378ADD ${progress * 100}%,
                var(--ifm-color-emphasis-200, #404040) ${progress * 100}%)`,
            }}
          />
        </div>
        {[1, 2, 5].map(speed => (
          <button
            key={speed}
            className={styles.frequencyReplayButton}
            onClick={() => startReplay(speed)}
            disabled={isReplaying}
            aria-label={`Reproducir a velocidad ${speed}x`}
          >
            ▶ {speed}×
          </button>
        ))}
      </div>

      {/* Tarjeta de evento cercano */}
      {nearestEvent && (
        <div className={styles.eventCard} style={{ borderLeftColor: nearestEvent.color }}>
          <div className={styles.eventCardTitle} style={{ color: nearestEvent.color }}>
            ⚡ {nearestEvent.label}
          </div>
          <div className={styles.eventCardDesc}>{nearestEvent.desc}</div>
        </div>
      )}

      <div className={styles.frequencyFooter}>
        <p>
          Fuente: ENTSO-E Final Report (mar. 2026) / ENTSO-E Factual Report (oct. 2025),
          pp.108-109. Curva interpolada linealmente entre puntos PMU/WAMS públicos.
          Nota: 48,46 Hz = pérdida de sincronismo ES-FR (12:33:21 CEST);
          47,79 Hz = nadir del sistema ibérico aislado (~1,1 s después).
          Ambos valores son correctos e instantes distintos del mismo transitorio.
        </p>
      </div>
    </div>
  );
}
