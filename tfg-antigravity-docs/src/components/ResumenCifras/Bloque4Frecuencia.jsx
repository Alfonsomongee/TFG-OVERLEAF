import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer } from 'recharts';
import styles from './Bloque4Frecuencia.module.css';

const FREQUENCY_DATA = {
  frequencies: [
    { t: -2, f: 50.00 }, { t: 0, f: 50.02 }, { t: 2, f: 49.95 }, { t: 5, f: 49.87 },
    { t: 10, f: 49.75 }, { t: 15, f: 49.62 }, { t: 19.34, f: 49.45 }, { t: 20, f: 49.20 },
    { t: 20.56, f: 48.95 }, { t: 22, f: 48.70 }, { t: 23.53, f: 48.46 }, { t: 25, f: 48.15 },
    { t: 25.88, f: 47.79 }, { t: 27, f: 47.50 }, { t: 33, f: 47.50 }
  ],
  events: [
    { t: 0.0, f: 50.02, label: 'G-1 · Granada', desc: 'Disparo transformador 400/220 kV (−355 MW)', color: '#EF9F27' },
    { t: 19.34, f: 49.45, label: 'G-2 · Badajoz', desc: 'Desconexión CSP + FV (−727 MW)', color: '#E24B4A' },
    { t: 20.56, f: 48.95, label: 'G-3 · SW', desc: 'Cascada 5 provincias (−1.150 MW)', color: '#E24B4A' },
    { t: 23.53, f: 48.46, label: 'Trip FR', desc: 'Aislamiento de Iberia', color: '#378ADD' },
    { t: 25.88, f: 47.79, label: 'Nadir', desc: 'Mínimo de frecuencia (47,79 Hz)', color: '#9F3EFF' }
  ],
  thresholds: [
    { value: 49.5, label: 'UFLS-1', color: '#EF9F27' },
    { value: 49.0, label: 'UFLS-2', color: '#EF9F27' },
    { value: 48.5, label: 'UFLS-3', color: '#E24B4A' },
    { value: 48.0, label: 'UFLS-4', color: '#E24B4A' },
    { value: 47.5, label: 'Collapse', color: '#E24B4A' }
  ]
};

function interpolateFrequency(t) {
  const freqs = FREQUENCY_DATA.frequencies;
  const idx = freqs.findIndex(d => d.t >= t);
  if (idx === 0) return freqs[0].f;
  if (idx === -1) return freqs[freqs.length - 1].f;
  const p0 = freqs[idx - 1];
  const p1 = freqs[idx];
  const alpha = (t - p0.t) / (p1.t - p0.t);
  return p0.f + (p1.f - p0.f) * alpha;
}

function getProgressColor(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const r = Math.round(255 + (226 - 255) * p);
  const g = Math.round(255 + (75 - 255) * p);
  const b = Math.round(255 + (74 - 255) * p);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatCESTTime(t) {
  const seconds = (t + 2) * 1000;
  const baseDate = new Date('2025-04-28T10:32:57Z');
  const date = new Date(baseDate.getTime() - 2000 + seconds);
  return date.toISOString().substring(11, 19);
}

export default function Bloque4Frecuencia() {
  const [currentT, setCurrentT] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const reqRef = useRef(null);
  
  // Generar puntos completos pre-calculados (para sombra gris claro de fondo)
  const fullPoints = [];
  for (let t = -2; t <= 33; t += 0.5) {
    fullPoints.push({ t, f: interpolateFrequency(t) });
  }

  // Puntos activos hasta currentT
  const activePoints = [];
  for (let t = -2; t <= currentT; t += 0.1) {
    activePoints.push({ t, f: interpolateFrequency(t) });
  }

  const handleSliderChange = (e) => {
    setIsReplaying(false);
    setCurrentT(parseFloat(e.target.value));
  };

  const startReplay = (speedMultiplier) => {
    setIsReplaying(true);
    setCurrentT(-2);
    
    let startTime = performance.now();
    const duration = 60000 / speedMultiplier;
    
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newT = -2 + progress * 35;
      
      setCurrentT(newT);
      
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setIsReplaying(false);
      }
    };
    reqRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const progress = Math.max(0, Math.min(1, (currentT + 2) / 35));
  const lineColor = getProgressColor(progress);
  
  const currentF = interpolateFrequency(currentT);
  const timeStr = formatCESTTime(currentT);
  
  const dt = 0.5;
  const rocof = (interpolateFrequency(currentT + dt) - interpolateFrequency(currentT - dt)) / (2 * dt);
  const absRocof = Math.abs(rocof);
  let rocofColor = '#1D9E75';
  if (absRocof > 0.25) rocofColor = '#E24B4A';
  else if (absRocof > 0.05) rocofColor = '#EF9F27';

  const nearestEvent = FREQUENCY_DATA.events.find(e => Math.abs(e.t - currentT) <= 0.8);
  const isCollapsed = currentF <= 47.5 && currentT >= 25.88;

  // Adaptación de los eventos al formato Recharts
  const eventsData = FREQUENCY_DATA.events.map(e => ({ t: e.t, f: e.f, fill: e.color }));

  return (
    <div className={styles.frequencyContainer}>
      <div className={styles.frequencyHeader}>
        <div className={styles.frequencyTitle}>Evolución de la frecuencia eléctrica</div>
        <div className={styles.frequencySubtitle}>Sistema ibérico peninsular · 28 de abril de 2025 · 12:32:55 a 12:33:30 CEST</div>
      </div>

      <div className={styles.frequencyLegend}>
        <div className={styles.legendChip}><span className={styles.legendChipLine} style={{ background: '#ffffff' }}></span><span>Frecuencia medida</span></div>
        <div className={styles.legendChip}><span className={styles.legendChipLine} style={{ background: '#EF9F27' }}></span><span>Umbrales UFLS</span></div>
        <div className={styles.legendChip}><span className={styles.legendChipDot} style={{ background: '#378ADD' }}></span><span>Eventos críticos</span></div>
        <div className={styles.legendChip}><span className={styles.legendChipLine} style={{ background: 'rgba(226, 75, 74, 0.3)', height: '4px' }}></span><span>Zona colapso</span></div>
      </div>

      <div className={styles.frequencyCanvasWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis dataKey="t" type="number" domain={[-2, 33]} tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }} stroke="#404040" label={{ value: 'Tiempo (s)', position: 'insideBottom', offset: -10, fill: '#b0b0b0', fontSize: 11 }} />
            <YAxis domain={[46.5, 50.5]} tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }} stroke="#404040" tickFormatter={v => v.toFixed(2) + ' Hz'} label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', fill: '#b0b0b0', fontSize: 11 }} />
            
            <ReferenceArea y1={46.5} y2={47.5} fill="rgba(226, 75, 74, 0.1)" />

            {FREQUENCY_DATA.thresholds.map((t, idx) => (
              <ReferenceLine key={idx} y={t.value} stroke={t.color} strokeDasharray="4 4" opacity={0.6} />
            ))}

            <Line data={fullPoints} type="monotone" dataKey="f" stroke="rgba(128, 128, 128, 0.3)" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line data={activePoints} type="monotone" dataKey="f" stroke={lineColor} strokeWidth={3} dot={false} isAnimationActive={false} />
            
            <Scatter data={eventsData} fill="#8884d8" isAnimationActive={false}>
              {eventsData.map((entry, index) => (
                <circle key={`cell-${index}`} cx={0} cy={0} r={5} fill={entry.fill} stroke="var(--color-background-primary)" strokeWidth={2} />
              ))}
            </Scatter>

            <ReferenceLine x={currentT} stroke="rgba(176, 176, 176, 0.5)" strokeDasharray="4 4" />
            <ReferenceLine y={currentF} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1} />
          </ComposedChart>
        </ResponsiveContainer>

        {isCollapsed && (
          <div className={`${styles.collapseCard} ${styles.active}`}>
            <div className={styles.collapseCardTitle}>⚡ COLAPSO DEL SISTEMA</div>
            <div className={styles.collapseCardSubtitle}>Frecuencia crítica alcanzada (47,5 Hz)</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
        <div>t = {currentT.toFixed(1)} s · {timeStr} CEST</div>
        <div>F = {currentF.toFixed(2)} Hz · ROCOF ≈ <span style={{ color: rocofColor }}>{rocof.toFixed(2)} Hz/s</span></div>
      </div>

      <div className={styles.frequencyControls}>
        <div className={styles.frequencySliderWrapper}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-secondary)' }}>
            Avanzar en el tiempo (PMU replay)
          </label>
          <input 
            type="range" 
            className={styles.frequencySlider} 
            min="-2" max="33" step="0.1" 
            value={currentT} 
            onChange={handleSliderChange}
            style={{ background: `linear-gradient(to right, #378ADD ${progress * 100}%, var(--color-border-tertiary) ${progress * 100}%)` }}
          />
        </div>
        <button className={styles.frequencyReplayButton} onClick={() => startReplay(1)} disabled={isReplaying}>▶ 1x</button>
        <button className={styles.frequencyReplayButton} onClick={() => startReplay(2)} disabled={isReplaying}>▶ 2x</button>
        <button className={styles.frequencyReplayButton} onClick={() => startReplay(5)} disabled={isReplaying}>▶ 5x</button>
      </div>

      {nearestEvent && (
        <div className={styles.eventCard} style={{ borderLeftColor: nearestEvent.color }}>
          <div className={styles.eventCardTitle} style={{ color: nearestEvent.color }}>⚡ {nearestEvent.label}</div>
          <div className={styles.eventCardDesc}>{nearestEvent.desc}</div>
        </div>
      )}

      <div className={styles.frequencyFooter}>
        <p>Fuente: ENTSO-E Final Report (2026) · REE Informe Incidente · NREL/Lara et al. · Curva interpolada a partir de PMU públicos</p>
      </div>
    </div>
  );
}
