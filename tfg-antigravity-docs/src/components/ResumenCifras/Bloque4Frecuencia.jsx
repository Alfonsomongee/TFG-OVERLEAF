/**
 * Bloque4Frecuencia.jsx
 * Gráfica interactiva de evolución de frecuencia durante el 28-A.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  ReferenceLine, ReferenceArea, ResponsiveContainer,
} from 'recharts';
import styles from './Bloque4Frecuencia.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

const STRINGS = {
  es: {
    title: 'Evolución de la frecuencia eléctrica',
    subtitle: 'Sistema ibérico peninsular · 28 de abril de 2025 · 12:32:55–12:33:30 CEST',
    legendFreq: 'Frecuencia (Hz)',
    legendUfls: 'Umbrales UFLS (P.O. 1.6)',
    legendEvents: 'Eventos críticos',
    axisX: 'Tiempo desde disparo raíz (s)',
    axisY: 'Frecuencia (Hz)',
    collapseTitle: '⚡ COLAPSO DEL SISTEMA',
    collapseSub: 'Nadir: 47,79 Hz → cero eléctrico',
    criticalThresh: '⚠ umbral crítico',
    dragLabel: 'PMU replay — arrastrar para avanzar',
    ariaSlider: 'Control temporal de la simulación de frecuencia',
    ariaPlay: (speed) => `Reproducir a velocidad ${speed}x`,
    footer: 'Fuente: ENTSO-E Final Report (mar. 2026) / ENTSO-E Factual Report (oct. 2025), pp.108-109. Curva interpolada linealmente entre puntos PMU/WAMS públicos. Nota: 48,46 Hz = pérdida de sincronismo ES-FR (12:33:21 CEST); 47,79 Hz = nadir del sistema ibérico aislado (~1,1 s después). Ambos valores son correctos e instantes distintos del mismo transitorio.',
    events: [
      { label: 'G-1 Granada', desc: 'Disparo ANSI 59 (−355 MW, −165 MVAr)' },
      { label: 'G-2 Badajoz', desc: 'Desconexión CSP+FV (−730 MW)' },
      { label: 'G-3 Cascada SW', desc: 'Cascada 5 provincias (−1.635 MW acum.)' },
      { label: '48,46 Hz · Trip FR', desc: 'Pérdida de sincronismo ES-FR · ANSI 78 abre interconexión AC' },
      { label: '47,79 Hz · Nadir', desc: 'Nadir del sistema ibérico aislado (~1,1 s tras separación)' },
    ],
    thresholds: [
      { label: 'UFLS bombeo (49,5 Hz)' },
      { label: 'UFLS demanda (49,0 Hz)' },
      { label: 'UFLS-3 (48,5 Hz)' },
      { label: 'UFLS-4 (48,0 Hz)' },
      { label: 'Collapse' },
    ]
  },
  en: {
    title: 'Evolution of electrical frequency',
    subtitle: 'Peninsular Iberian System · April 28, 2025 · 12:32:55–12:33:30 CEST',
    legendFreq: 'Frequency (Hz)',
    legendUfls: 'UFLS Thresholds (P.O. 1.6)',
    legendEvents: 'Critical events',
    axisX: 'Time since root trip (s)',
    axisY: 'Frequency (Hz)',
    collapseTitle: '⚡ SYSTEM COLLAPSE',
    collapseSub: 'Nadir: 47.79 Hz → electrical zero',
    criticalThresh: '⚠ critical threshold',
    dragLabel: 'PMU replay — drag to advance',
    ariaSlider: 'Time control of the frequency simulation',
    ariaPlay: (speed) => `Play at ${speed}x speed`,
    footer: 'Source: ENTSO-E Final Report (Mar 2026) / ENTSO-E Factual Report (Oct 2025), pp.108-109. Curve linearly interpolated between public PMU/WAMS points. Note: 48.46 Hz = ES-FR loss of synchronism (12:33:21 CEST); 47.79 Hz = nadir of the isolated Iberian system (~1.1 s later). Both values are correct and distinct instants of the same transient.',
    events: [
      { label: 'G-1 Granada', desc: 'ANSI 59 trip (−355 MW, −165 MVAr)' },
      { label: 'G-2 Badajoz', desc: 'CSP+PV disconnection (−730 MW)' },
      { label: 'G-3 SW Cascade', desc: '5 provinces cascade (−1,635 MW accum.)' },
      { label: '48.46 Hz · FR Trip', desc: 'ES-FR loss of synchronism · ANSI 78 opens AC interconnection' },
      { label: '47.79 Hz · Nadir', desc: 'Isolated Iberian system nadir (~1.1 s after separation)' },
    ],
    thresholds: [
      { label: 'Pump UFLS (49.5 Hz)' },
      { label: 'Demand UFLS (49.0 Hz)' },
      { label: 'UFLS-3 (48.5 Hz)' },
      { label: 'UFLS-4 (48.0 Hz)' },
      { label: 'Collapse' },
    ]
  },
  de: {
    title: 'Entwicklung der Netzfrequenz',
    subtitle: 'Iberisches Halbinselsystem · 28. April 2025 · 12:32:55–12:33:30 CEST',
    legendFreq: 'Frequenz (Hz)',
    legendUfls: 'UFLS-Grenzwerte (P.O. 1.6)',
    legendEvents: 'Kritische Ereignisse',
    axisX: 'Zeit seit Wurzelauslösung (s)',
    axisY: 'Frequenz (Hz)',
    collapseTitle: '⚡ SYSTEMKOLLAPS',
    collapseSub: 'Nadir: 47,79 Hz → elektrischer Nullpunkt',
    criticalThresh: '⚠ kritischer Grenzwert',
    dragLabel: 'PMU-Wiedergabe — zum Vorrücken ziehen',
    ariaSlider: 'Zeitsteuerung der Frequenzsimulation',
    ariaPlay: (speed) => `Wiedergabe mit ${speed}x Geschwindigkeit`,
    footer: 'Quelle: ENTSO-E Final Report (März 2026) / ENTSO-E Factual Report (Okt 2025), S.108-109. Kurve linear interpoliert zwischen öffentlichen PMU/WAMS-Punkten. Hinweis: 48,46 Hz = ES-FR Synchronisationsverlust (12:33:21 CEST); 47,79 Hz = Nadir des isolierten iberischen Systems (~1,1 s später). Beide Werte sind korrekt und stellen verschiedene Zeitpunkte desselben Transienten dar.',
    events: [
      { label: 'G-1 Granada', desc: 'ANSI 59 Auslösung (−355 MW, −165 MVAr)' },
      { label: 'G-2 Badajoz', desc: 'CSP+PV Trennung (−730 MW)' },
      { label: 'G-3 SW-Kaskade', desc: 'Kaskade in 5 Provinzen (−1.635 MW kum.)' },
      { label: '48,46 Hz · FR Trip', desc: 'ES-FR Synchronisationsverlust · ANSI 78 öffnet AC-Verbindung' },
      { label: '47,79 Hz · Nadir', desc: 'Nadir des isolierten iberischen Systems (~1,1 s nach Trennung)' },
    ],
    thresholds: [
      { label: 'Pump-UFLS (49,5 Hz)' },
      { label: 'Nachfrage-UFLS (49,0 Hz)' },
      { label: 'UFLS-3 (48,5 Hz)' },
      { label: 'UFLS-4 (48,0 Hz)' },
      { label: 'Collapse' },
    ]
  }
};

const FREQUENCY_POINTS = [
  { t: -2,    f: 50.00 },
  { t:  0,    f: 50.02 },
  { t:  2,    f: 49.95 },
  { t:  5,    f: 49.87 },
  { t: 10,    f: 49.75 },
  { t: 15,    f: 49.62 },
  { t: 19.34, f: 49.45 },
  { t: 20,    f: 49.20 },
  { t: 20.56, f: 48.95 },
  { t: 22,    f: 48.70 },
  { t: 23.53, f: 48.46 },
  { t: 25,    f: 48.15 },
  { t: 25.88, f: 47.79 },
  { t: 27,    f: 47.50 },
  { t: 30,    f: 47.50 },
];

const BASE_EVENTS = [
  { t:  0.0,  f: 50.02, color: '#EF9F27' },
  { t: 19.34, f: 49.45, color: '#E24B4A' },
  { t: 20.56, f: 48.95, color: '#E24B4A' },
  { t: 23.53, f: 48.46, color: '#378ADD' },
  { t: 25.88, f: 47.79, color: '#9F3EFF' },
];

const BASE_THRESHOLDS = [
  { value: 49.5, color: '#EF9F27' },
  { value: 49.0, color: '#EF9F27' },
  { value: 48.5, color: '#E24B4A' },
  { value: 48.0, color: '#E24B4A' },
  { value: 47.5, color: '#E24B4A' },
];

function interpolate(t) {
  const pts = FREQUENCY_POINTS;
  const idx = pts.findIndex(p => p.t >= t);
  if (idx === 0)  return pts[0].f;
  if (idx === -1) return pts[pts.length - 1].f;
  const p0 = pts[idx - 1], p1 = pts[idx];
  return p0.f + (p1.f - p0.f) * (t - p0.t) / (p1.t - p0.t);
}

function tToCEST(t) {
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
  const lang = useDocLang();
  const s = STRINGS[lang] || STRINGS.es;

  const EVENTS = BASE_EVENTS.map((e, i) => ({ ...e, label: s.events[i].label, desc: s.events[i].desc }));
  const THRESHOLDS = BASE_THRESHOLDS.map((t, i) => ({ ...t, label: s.thresholds[i].label }));

  const [currentT,    setCurrentT]    = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const reqRef = useRef(null);
  const T_MIN = -2, T_MAX = 30;

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

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

  const dt       = 0.8;
  const rocof    = (interpolate(currentT + dt) - interpolate(currentT - dt)) / (2 * dt);
  const rocofAbs = Math.abs(rocof);
  const rocofColor = rocofAbs > 0.25 ? '#E24B4A' : rocofAbs > 0.05 ? '#EF9F27' : '#1D9E75';

  const nearestEvent = EVENTS.find(e => Math.abs(e.t - currentT) <= 0.8);
  const isCollapsed  = currentF <= 47.5 && currentT >= 25.88;

  return (
    <div className={styles.frequencyContainer}>
      <div className={styles.frequencyHeader}>
        <div className={styles.frequencyTitle}>{s.title}</div>
        <div className={styles.frequencySubtitle}>{s.subtitle}</div>
      </div>

      <div className={styles.frequencyLegend}>
        <div className={styles.legendChip}>
          <span className={styles.legendChipLine} style={{ background: '#ffffff' }} />
          <span>{s.legendFreq}</span>
        </div>
        <div className={styles.legendChip}>
          <span className={styles.legendChipLine} style={{ background: '#EF9F27' }} />
          <span>{s.legendUfls}</span>
        </div>
        <div className={styles.legendChip}>
          <span className={styles.legendChipDot} style={{ background: '#378ADD' }} />
          <span>{s.legendEvents}</span>
        </div>
      </div>

      <div className={styles.frequencyCanvasWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis
              dataKey="t" type="number" domain={[T_MIN, T_MAX]}
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              stroke="#404040"
              label={{ value: s.axisX, position: 'insideBottom',
                       offset: -10, fill: '#b0b0b0', fontSize: 11 }}
            />
            <YAxis
              domain={[46.5, 50.5]}
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              stroke="#404040"
              tickFormatter={v => `${v.toFixed(1)} Hz`}
              label={{ value: s.axisY, angle: -90, position: 'insideLeft',
                       fill: '#b0b0b0', fontSize: 11 }}
            />

            <ReferenceArea y1={46.5} y2={47.5} fill="rgba(226,75,74,0.08)" />

            {THRESHOLDS.map((th, i) => (
              <ReferenceLine key={i} y={th.value}
                stroke={th.color} strokeDasharray="4 4" opacity={0.55} />
            ))}

            <Line data={fullPoints} type="monotone" dataKey="f"
              stroke="rgba(128,128,128,0.25)" strokeWidth={1}
              dot={false} isAnimationActive={false} />

            <Line data={activePoints} type="monotone" dataKey="f"
              stroke={lineColor} strokeWidth={3}
              dot={false} isAnimationActive={false} />

            <ReferenceLine x={currentT} stroke="rgba(176,176,176,0.4)" strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>

        {isCollapsed && (
          <div className={`${styles.collapseCard} ${styles.active}`}>
            <div className={styles.collapseCardTitle}>{s.collapseTitle}</div>
            <div className={styles.collapseCardSubtitle}>{s.collapseSub}</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16, fontSize: 11, color: 'var(--ifm-color-emphasis-600, #808080)',
                    fontFamily: 'monospace' }}>
        <div>t = {currentT.toFixed(1)} s · {cesTime} CEST</div>
        <div>
          f = {currentF.toFixed(2)} Hz ·
          RoCoF ≈ <span style={{ color: rocofColor }}>{rocof.toFixed(2)} Hz/s</span>
          {rocofAbs > 0.25 && ` ${s.criticalThresh}`}
        </div>
      </div>

      <div className={styles.frequencyControls}>
        <div className={styles.frequencySliderWrapper}>
          <label style={{ fontSize: 10, textTransform: 'uppercase',
                          letterSpacing: '0.12em', color: 'var(--ifm-color-emphasis-500)' }}>
            {s.dragLabel}
          </label>
          <input
            type="range"
            className={styles.frequencySlider}
            min={T_MIN} max={T_MAX} step="0.1"
            value={currentT}
            onChange={e => { setIsReplaying(false); setCurrentT(parseFloat(e.target.value)); }}
            aria-label={s.ariaSlider}
            aria-valuetext={`t=${currentT.toFixed(1)}s, f=${currentF.toFixed(2)}Hz`}
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
            aria-label={s.ariaPlay(speed)}
          >
            ▶ {speed}×
          </button>
        ))}
      </div>

      {nearestEvent && (
        <div className={styles.eventCard} style={{ borderLeftColor: nearestEvent.color }}>
          <div className={styles.eventCardTitle} style={{ color: nearestEvent.color }}>
            ⚡ {nearestEvent.label}
          </div>
          <div className={styles.eventCardDesc}>{nearestEvent.desc}</div>
        </div>
      )}

      <div className={styles.frequencyFooter}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
