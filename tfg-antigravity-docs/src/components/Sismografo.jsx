// src/components/Sismografo.jsx
// Sismógrafo de frecuencia: tiempo real (ENTSO-E) vs histórico 28-A
// Se refresca cada 30 segundos automáticamente.

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ── Eventos críticos del 28-A (hora HH:MM en CEST) ──────────────────────────
const EVENTOS_28A = [
  { time: '12:03', label: 'Oscilación forzada 0.63 Hz',   color: '#f59e0b' },
  { time: '12:09', label: 'HVDC modo P constante',         color: '#f59e0b' },
  { time: '12:19', label: 'Modo inter-área 0.2 Hz',        color: '#f59e0b' },
  { time: '12:32', label: 'Disparo transformador Granada', color: '#ef4444' },
  { time: '12:33', label: 'Desconexión Badajoz',           color: '#ef4444' },
  { time: '12:33', label: 'Apertura AC Francia',           color: '#d946ef' },
  { time: '12:33', label: '⚡ CERO ELÉCTRICO',             color: '#dc2626' },
];

// ── Convierte ISO UTC → HH:MM en hora española (CEST/CET) ──────────────────
function toSpanishHHMM(isoStr) {
  const d = new Date(isoStr);
  const month = d.getUTCMonth() + 1;
  const offset = (month >= 4 && month <= 10) ? 2 : 1; // CEST=+2, CET=+1
  const local = new Date(d.getTime() + offset * 3600000);
  return local.toISOString().slice(11, 16); // HH:MM
}

// ── Inner component (only rendered client-side) ─────────────────────────────
function SismografoInner() {
  const [Plot, setPlot]           = useState(null);
  const [historical, setHistorical] = useState([]);
  const [realtime, setRealtime]   = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [rtError, setRtError]     = useState(false);

  // Cargar Plotly dinámicamente (evita SSR issues)
  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  // Cargar histórico del 28-A (solo una vez)
  useEffect(() => {
    fetch('/data/frequency_28A.json')
      .then(r => r.json())
      .then(data => {
        // Formato del JSON: [{time: "12:03:00", freq: 50.00, event: "...", ...}]
        const formatted = data
          .filter(d => d.freq != null)
          .map(d => ({
            hhmm: d.time.slice(0, 5), // "HH:MM"
            freq: d.freq,
            event: d.event || null,
          }));
        setHistorical(formatted);
      })
      .catch(err => console.error('[Sismografo] Error histórico:', err));
  }, []);

  // Cargar frecuencia en tiempo real
  const fetchRealtime = useCallback(async () => {
    try {
      const res  = await fetch('/api/entsoe-frequency');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(d => ({
          hhmm: toSpanishHHMM(d.time),
          freq: d.frequency,
        }));
        setRealtime(formatted);
        setRtError(false);
      } else {
        setRtError(true);
      }
    } catch {
      setRtError(true);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    fetchRealtime();
    const id = setInterval(fetchRealtime, 30000);
    return () => clearInterval(id);
  }, [fetchRealtime]);

  if (!Plot || (loading && historical.length === 0)) {
    return (
      <div style={styles.loading}>
        <span style={{ fontSize: '1.5rem' }}>⟳</span>
        <span>Cargando sismógrafo...</span>
      </div>
    );
  }

  // ── Construir trazas Plotly ─────────────────────────────────────────────
  const traceHistorico = {
    x: historical.map(d => d.hhmm),
    y: historical.map(d => d.freq),
    type: 'scatter',
    mode: 'lines',
    name: '28-A (histórico)',
    line: { color: '#ef4444', width: 2, dash: 'dot' },
    hovertemplate: '%{x}<br><b>%{y:.3f} Hz</b><extra>28-A</extra>',
  };

  const traceActual = realtime.length > 0 ? {
    x: realtime.map(d => d.hhmm),
    y: realtime.map(d => d.freq),
    type: 'scatter',
    mode: 'lines',
    name: 'Frecuencia actual',
    line: { color: '#06b6d4', width: 2.5 },
    hovertemplate: '%{x}<br><b>%{y:.3f} Hz</b><extra>Actual</extra>',
  } : null;

  const traces = [traceHistorico, ...(traceActual ? [traceActual] : [])];

  // Líneas verticales de eventos + umbrales horizontales
  const shapes = [
    // Nominal 50 Hz
    { type: 'line', x0: '00:00', x1: '24:00', y0: 50.0, y1: 50.0,
      line: { color: '#10b981', width: 1, dash: 'dot' } },
    // UFLS 1er escalón
    { type: 'line', x0: '00:00', x1: '24:00', y0: 49.5, y1: 49.5,
      line: { color: '#f59e0b', width: 1, dash: 'dash' } },
    // UFLS 2º escalón
    { type: 'line', x0: '00:00', x1: '24:00', y0: 49.0, y1: 49.0,
      line: { color: '#ef4444', width: 1, dash: 'dash' } },
    // Eventos del 28-A
    ...EVENTOS_28A.map(ev => ({
      type: 'line',
      x0: ev.time, x1: ev.time,
      y0: 47.5,    y1: 50.5,
      line: { color: ev.color, width: 1.5, dash: 'dash' },
    })),
  ];

  const annotations = EVENTOS_28A.map(ev => ({
    x: ev.time, y: 50.45,
    xanchor: 'left', yanchor: 'top',
    text: ev.label,
    showarrow: false,
    font: { size: 9, color: ev.color },
    textangle: -45,
  }));

  const layout = {
    title: {
      text: '📊 Sismógrafo de frecuencia — Hoy vs 28 de abril de 2025',
      font: { size: 15, color: '#e0ddd5', family: 'Inter, sans-serif' },
    },
    xaxis: {
      title: 'Hora (CEST)',
      type: 'category',
      tickangle: -30,
      gridcolor: 'rgba(255,255,255,0.07)',
      color: '#a0a0b0',
    },
    yaxis: {
      title: 'Frecuencia (Hz)',
      range: [47.5, 50.55],
      gridcolor: 'rgba(255,255,255,0.07)',
      color: '#a0a0b0',
    },
    shapes,
    annotations,
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode:     'x unified',
    legend: {
      orientation: 'h',
      y: -0.18,
      font: { color: '#a0a0b0', size: 11 },
    },
    margin: { t: 60, b: 80, l: 60, r: 20 },
    font:   { family: 'JetBrains Mono, monospace', color: '#a0a0b0' },
  };

  // ── Métricas de la última muestra actual ────────────────────────────────
  const ultimaFreq = realtime.length > 0 ? realtime[realtime.length - 1].freq : null;

  return (
    <div style={styles.wrapper}>
      {/* Gráfico */}
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '480px' }}
      />

      {/* Métricas */}
      {ultimaFreq && (
        <div style={styles.metricsRow}>
          <MetricCard
            label="Frecuencia actual"
            value={`${ultimaFreq.toFixed(3)} Hz`}
            delta={`${(ultimaFreq - 50).toFixed(3)} Hz`}
            color={ultimaFreq < 49.5 ? '#ef4444' : ultimaFreq < 49.8 ? '#f59e0b' : '#10b981'}
          />
          <MetricCard
            label="Desviación de 50 Hz"
            value={`${Math.abs(ultimaFreq - 50).toFixed(3)} Hz`}
            color={ultimaFreq < 49.5 ? '#ef4444' : '#a0a0b0'}
          />
          <MetricCard
            label="Estado"
            value={ultimaFreq < 49.5 ? '⚠️ Crítico' : ultimaFreq < 49.8 ? '⚡ Vigilancia' : '✅ Estable'}
            color={ultimaFreq < 49.5 ? '#ef4444' : ultimaFreq < 49.8 ? '#f59e0b' : '#10b981'}
          />
        </div>
      )}

      {/* Leyenda umbrales */}
      <div style={styles.legend}>
        <span style={{ color: '#10b981' }}>── 50 Hz nominal</span>
        <span style={{ color: '#f59e0b' }}>╌╌ UFLS 1er escalón (49.5 Hz)</span>
        <span style={{ color: '#ef4444' }}>╌╌ UFLS 2º escalón (49.0 Hz)</span>
      </div>

      {/* Estado / última actualización */}
      <p style={styles.caption}>
        {rtError
          ? '⚠️ Datos en tiempo real no disponibles (ENTSO-E latencia) — mostrando solo histórico 28-A'
          : lastUpdate
            ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Refresco cada 30 s`
            : 'Conectando con ENTSO-E...'}
      </p>
    </div>
  );
}

function MetricCard({ label, value, delta, color }) {
  return (
    <div style={{ ...styles.metricCard, borderColor: color + '44' }}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={{ ...styles.metricValue, color }}>{value}</div>
      {delta && <div style={styles.metricDelta}>{delta}</div>}
    </div>
  );
}

// ── Estilos inline ──────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    background: 'rgba(7,9,15,0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255,170,0,0.1)',
    padding: '1.5rem',
    fontFamily: "'JetBrains Mono', monospace",
  },
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.75rem', minHeight: '300px',
    color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace",
  },
  metricsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
    marginTop: '1.25rem',
  },
  metricCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    textAlign: 'center',
  },
  metricLabel: { fontSize: '0.62rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' },
  metricValue: { fontSize: '1.1rem', fontWeight: 700 },
  metricDelta: { fontSize: '0.72rem', color: '#a0a0b0', marginTop: '0.2rem' },
  legend: {
    display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
    marginTop: '0.75rem', fontSize: '0.68rem', color: '#a0a0b0',
  },
  caption: {
    marginTop: '0.75rem', fontSize: '0.7rem',
    color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em',
  },
};

// ── Exportación — wrapeada en BrowserOnly (SSR-safe) ────────────────────────
export default function Sismografo() {
  return (
    <BrowserOnly fallback={
      <div style={styles.loading}>⟳ Cargando sismógrafo...</div>
    }>
      {() => <SismografoInner />}
    </BrowserOnly>
  );
}
