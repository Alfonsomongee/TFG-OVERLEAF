// src/components/MixGeneracion.jsx
// Mix de generación "Ahora vs 28-A" — donut charts comparativos
// SSR-safe: BrowserOnly + dynamic Plotly import

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const BLACKOUT = {
  Solar:      19155,
  Eólica:     3540,
  Nuclear:    3870,
  'C. Combinado': 990,
  Hidráulica: 2000,
};

const COLORS = ['#f59e0b', '#06b6d4', '#ef4444', '#8b5cf6', '#10b981'];

const BLACKOUT_PENETRACION = 84.5;

function MixGeneracionInner() {
  const [Plot, setPlot]     = useState(null);
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch('/api/esios-multi');
      const json = await res.json();
      setData(json);
      setError(false);
      setLastUpdate(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300000); // 5 min
    return () => clearInterval(id);
  }, [fetchData]);

  if (!Plot || loading) return <div style={S.loading}>⟳ Cargando mix de generación...</div>;

  const hoy = data ? {
    Solar:      data.solar   ?? 0,
    Eólica:     data.eolica  ?? 0,
    Nuclear:    data.nuclear ?? 0,
    'C. Combinado': data.gas ?? 0,
    Hidráulica: (data.hidro > 0 ? data.hidro : 0),
  } : BLACKOUT;

  const penetracionHoy = data?.penetracion_renovable ?? null;
  const delta = penetracionHoy !== null ? penetracionHoy - BLACKOUT_PENETRACION : null;

  const layout28A = {
    title: { text: '28 de abril de 2025 — Instante del colapso', font: { color: '#e0ddd5', size: 13 } },
    showlegend: false,
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, b: 10, l: 10, r: 10 },
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: 340,
  };
  const layoutHoy = {
    title: {
      text: `Ahora · ${lastUpdate ? lastUpdate.toLocaleTimeString('es-ES') : '...'}`,
      font: { color: '#e0ddd5', size: 13 },
    },
    showlegend: true,
    legend: { orientation: 'v', font: { color: '#a0a0b0', size: 11 } },
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, b: 10, l: 10, r: 10 },
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: 340,
  };

  const traceBase = (values, labels) => ({
    values, labels, type: 'pie', hole: 0.45,
    marker: { colors: COLORS, line: { color: 'rgba(0,0,0,0.3)', width: 1 } },
    textfont: { color: '#fff', size: 11 },
    hovertemplate: '<b>%{label}</b><br>%{value:.0f} MW<br>%{percent}<extra></extra>',
  });

  return (
    <div style={S.wrapper}>
      <div style={S.grid}>
        <div>
          <Plot
            data={[traceBase(Object.values(BLACKOUT), Object.keys(BLACKOUT))]}
            layout={layout28A}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <Plot
            data={[traceBase(Object.values(hoy), Object.keys(hoy))]}
            layout={layoutHoy}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Métrica penetración renovable */}
      {penetracionHoy !== null && (
        <div style={S.metricRow}>
          <MetricPill label="Penetración renovable hoy" value={`${penetracionHoy.toFixed(1)}%`} />
          <MetricPill label="28-A (colapso)" value="84.5%" accent="#ef4444" />
          <MetricPill
            label="Diferencia"
            value={`${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`}
            accent={Math.abs(delta) < 5 ? '#f59e0b' : delta > 0 ? '#ef4444' : '#10b981'}
          />
        </div>
      )}

      <p style={S.caption}>
        {error
          ? '⚠️ Sin datos en tiempo real — mostrando solo histórico 28-A'
          : lastUpdate
            ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE)`
            : 'Conectando con ESIOS...'}
      </p>
    </div>
  );
}

function MetricPill({ label, value, accent = '#06b6d4' }) {
  return (
    <div style={{ ...S.pill, borderColor: accent + '44' }}>
      <span style={S.pillLabel}>{label}</span>
      <span style={{ ...S.pillValue, color: accent }}>{value}</span>
    </div>
  );
}

const S = {
  wrapper: { background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)', padding: '1.5rem', fontFamily: "'Inter', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  metricRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
  pill: { flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '8px', padding: '0.6rem 1rem', textAlign: 'center' },
  pillLabel: { display: 'block', fontSize: '0.62rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' },
  pillValue: { fontSize: '1.1rem', fontWeight: 700 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function MixGeneracion() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>⟳ Cargando...</div>}>
      {() => <MixGeneracionInner />}
    </BrowserOnly>
  );
}
