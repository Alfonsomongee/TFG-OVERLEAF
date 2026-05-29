import React, { useState, useCallback, useMemo } from 'react';
import styles from './styles.module.css';
import { computeCoords, computeMetrics } from './trilemmaModel';

const PRESETS = [
  { label: 'El Colapso (28-A)', values: { penetration: 82, gfm: 0, ersPrice: 0 } },
  { label: 'Mercado ERS Activo', values: { penetration: 82, gfm: 0, ersPrice: 40 } },
  { label: 'GFM Obligatorio', values: { penetration: 82, gfm: 25, ersPrice: 0 } },
  { label: 'Red Tradicional', values: { penetration: 45, gfm: 0, ersPrice: 0 } },
];

const ZONE_COLORS = {
  'COLAPSO': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171' },
  'TENSIÓN': { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
  'EQUILIBRIO': { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#34d399' }
};

// ── COMPONENTES SECUNDARIOS ──────────────────────────────────────────────────

function TrilemmaTriangle({ coords, pointColor }) {
  const W = 450;
  const H = 390;
  const L = 400;
  const cx = W / 2;
  const cy = H * 0.55;

  const vTop = { x: cx, y: cy - L * Math.sin(Math.PI / 3) / 2 };
  const vLeft = { x: cx - L / 2, y: cy + L * Math.sin(Math.PI / 3) / 2 };
  const vRight = { x: cx + L / 2, y: cy + L * Math.sin(Math.PI / 3) / 2 };

  const point = {
    x: coords.a * vTop.x + coords.b * vLeft.x + coords.c * vRight.x,
    y: coords.a * vTop.y + coords.b * vLeft.y + coords.c * vRight.y,
  };

  return (
    <div className={styles.triangleContainer}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}>
        {/* Fondo del triángulo */}
        <polygon
          points={`${vTop.x},${vTop.y} ${vLeft.x},${vLeft.y} ${vRight.x},${vRight.y}`}
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Guías baricéntricas sutiles (medianas) */}
        <line x1={vTop.x} y1={vTop.y} x2={cx} y2={vLeft.y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
        <line x1={vLeft.x} y1={vLeft.y} x2={cx + L/4} y2={cy - L*Math.sin(Math.PI/3)/4} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
        <line x1={vRight.x} y1={vRight.y} x2={cx - L/4} y2={cy - L*Math.sin(Math.PI/3)/4} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

        {/* Punto móvil */}
        <circle
          cx={point.x}
          cy={point.y}
          r="9"
          fill={pointColor}
          stroke="#fff"
          strokeWidth="2.5"
          className={styles.animatedPoint}
          style={{ filter: `drop-shadow(0 0 10px ${pointColor})` }}
        />

        {/* Etiquetas de vértices */}
        <text x={vTop.x} y={vTop.y - 15} textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="600">
          Descarbonización
        </text>
        <text x={vLeft.x - 5} y={vLeft.y + 22} textAnchor="start" fill="#94a3b8" fontSize="13" fontWeight="600">
          Estabilidad Dinámica
        </text>
        <text x={vRight.x + 5} y={vRight.y + 22} textAnchor="end" fill="#94a3b8" fontSize="13" fontWeight="600">
          Asequibilidad
        </text>

        {/* Tensión lines desde el punto a los vértices (opcional visual effect) */}
        <line x1={point.x} y1={point.y} x2={vTop.x} y2={vTop.y} stroke={pointColor} strokeOpacity={coords.a * 0.6} strokeWidth="2" className={styles.animatedPoint}/>
        <line x1={point.x} y1={point.y} x2={vLeft.x} y2={vLeft.y} stroke={pointColor} strokeOpacity={coords.b * 0.6} strokeWidth="2" className={styles.animatedPoint}/>
        <line x1={point.x} y1={point.y} x2={vRight.x} y2={vRight.y} stroke={pointColor} strokeOpacity={coords.c * 0.6} strokeWidth="2" className={styles.animatedPoint}/>
      </svg>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function EnergyTrilemmaSimulator() {
  const [sliders, setSliders] = useState(PRESETS[0].values);

  const handleSlider = useCallback((name, value) => {
    setSliders(prev => ({ ...prev, [name]: value }));
  }, []);

  const coords = useMemo(() => computeCoords(sliders.penetration, sliders.gfm, sliders.ersPrice), [sliders]);
  const metrics = useMemo(() => computeMetrics(sliders.penetration, sliders.gfm, sliders.ersPrice), [sliders]);

  const zoneColor = ZONE_COLORS[metrics.zone];

  return (
    <div className={styles.wrapper}>
      {/* Columna Izquierda: Triángulo y Zona */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        
        <div 
          className={styles.zone} 
          style={{ background: zoneColor.bg, borderColor: zoneColor.border }}
        >
          <span style={{ fontSize: '1.1rem' }}>{metrics.zone === 'COLAPSO' ? '⚠️' : metrics.zone === 'TENSIÓN' ? '⚡' : '✅'}</span>
          <span className={styles.zoneLabel} style={{ color: zoneColor.text }}>
            ZONA DE {metrics.zone}
          </span>
        </div>

        <TrilemmaTriangle coords={coords} pointColor={zoneColor.text} />
      </div>

      {/* Columna Derecha: Controles y Métricas */}
      <div className={styles.controls}>
        
        <div className={styles.presetsSection}>
          <p className={styles.presetsLabel}>Escenarios Predefinidos</p>
          <div className={styles.presets}>
            {PRESETS.map(preset => (
              <button 
                key={preset.label} 
                className={styles.presetBtn}
                onClick={() => setSliders(preset.values)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.slidersSection}>
          {/* Slider: IBR */}
          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Penetración IBR (Renovables)</span>
              <span className={styles.sliderValue} style={{ color: '#0ea5e9' }}>{sliders.penetration}%</span>
            </div>
            <div className={styles.sliderTrack}>
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: '100%', background: 'rgba(255,255,255,0.1)', zIndex: 1
                }}
              />
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: `${sliders.penetration}%`, background: '#0ea5e9', zIndex: 1, transition: 'width 0.2s ease'
                }}
              />
              <input 
                type="range" min="0" max="100" step="1" 
                value={sliders.penetration} 
                onChange={e => handleSlider('penetration', Number(e.target.value))} 
                className={styles.sliderInput} 
                style={{ '--thumb-color': '#0ea5e9' }}
              />
            </div>
            <p className={styles.sliderTooltip}>Presiona hacia Descarbonización, pero reduce Inercia y SCR.</p>
          </div>

          {/* Slider: GFM */}
          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Obligación Grid-Forming (GFM)</span>
              <span className={styles.sliderValue} style={{ color: '#10b981' }}>{sliders.gfm}%</span>
            </div>
            <div className={styles.sliderTrack}>
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: '100%', background: 'rgba(255,255,255,0.1)', zIndex: 1
                }}
              />
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: `${sliders.gfm}%`, background: '#10b981', zIndex: 1, transition: 'width 0.2s ease'
                }}
              />
              <input 
                type="range" min="0" max="100" step="1" 
                value={sliders.gfm} 
                onChange={e => handleSlider('gfm', Number(e.target.value))} 
                className={styles.sliderInput}
              />
            </div>
            <p className={styles.sliderTooltip}>Mejora la Estabilidad, compensando la falta de síncronas.</p>
          </div>

          {/* Slider: ERS */}
          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Precio Mercado ERS</span>
              <span className={styles.sliderValue} style={{ color: '#f59e0b' }}>{sliders.ersPrice} €/MWh</span>
            </div>
            <div className={styles.sliderTrack}>
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: '100%', background: 'rgba(255,255,255,0.1)', zIndex: 1
                }}
              />
              <div 
                style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, height: '4px', borderRadius: '2px',
                  width: `${(sliders.ersPrice / 50) * 100}%`, background: '#f59e0b', zIndex: 1, transition: 'width 0.2s ease'
                }}
              />
              <input 
                type="range" min="0" max="50" step="1" 
                value={sliders.ersPrice} 
                onChange={e => handleSlider('ersPrice', Number(e.target.value))} 
                className={styles.sliderInput}
              />
            </div>
            <p className={styles.sliderTooltip}>Incentiva servicios de red, pero penaliza la Asequibilidad.</p>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <h4 className={styles.metricLabel}>Inercia (H)</h4>
            <div className={styles.metricValue} style={{ color: metrics.H_total < 2.5 ? '#f87171' : '#e2e8f0' }}>
              {metrics.H_total} <span className={styles.metricUnit}>GWs</span>
            </div>
            <p className={styles.metricNote}>Global sistema</p>
          </div>
          <div className={styles.metricCard}>
            <h4 className={styles.metricLabel}>SCR Promedio</h4>
            <div className={styles.metricValue} style={{ color: metrics.SCR < 1.5 ? '#f87171' : metrics.SCR < 2 ? '#fbbf24' : '#e2e8f0' }}>
              {metrics.SCR}
            </div>
            <p className={styles.metricNote}>Umbral MRSCR = 1.5</p>
          </div>
          <div className={styles.metricCard}>
            <h4 className={styles.metricLabel}>Precio Diario</h4>
            <div className={styles.metricValue} style={{ color: metrics.precio > 50 ? '#f87171' : metrics.precio > 35 ? '#fbbf24' : '#e2e8f0' }}>
              {metrics.precio} <span className={styles.metricUnit}>€/MWh</span>
            </div>
            <p className={styles.metricNote}>Estimación pool</p>
          </div>
        </div>

        <div className={styles.methodNote}>
          <strong>Nota Metodológica:</strong> El simulador ancla el estado del 28-A (82% IBR, 0% GFM, 0 €/MWh) en el centro de máxima tensión del trilema, y aproxima métricas del análisis forense.
        </div>

      </div>
    </div>
  );
}
