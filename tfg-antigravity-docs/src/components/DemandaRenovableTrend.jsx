// src/components/DemandaRenovableTrend.jsx
// Barras comparativas: Demanda + Generación renovable → Hoy vs 28-A
// SSR-safe: BrowserOnly + dynamic Plotly import

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function DemandaRenovableTrendInner() {
  const [Plot, setPlot]         = useState(null);
  const [current, setCurrent]   = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  const fetchCurrent = useCallback(async () => {
    try {
      const res = await fetch('/api/esios-multi');
      setCurrent(await res.json());
      setLastUpdate(new Date());
    } catch {}
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/esios-multi').then(r => r.json()).catch(() => null),
      fetch('/data/blackout_snapshot_28A.json').then(r => r.json()).catch(() => null),
    ]).then(([cur, snap]) => {
      setCurrent(cur);
      setSnapshot(snap);
      if (cur) setLastUpdate(new Date());
    }).finally(() => setLoading(false));

    const id = setInterval(fetchCurrent, 300000);
    return () => clearInterval(id);
  }, [fetchCurrent]);

  if (!Plot || loading) return <div style={S.loading}>⟳ Cargando tendencia...</div>;
  if (!snapshot) return <div style={S.loading}>⚠ Sin datos históricos</div>;

  const VARS = [
    { key: 'demanda',          label: 'Demanda',       unit: 'MW', color: '#06b6d4' },
    { key: 'renovable_total',  label: 'Renovable',     unit: 'MW', color: '#10b981' },
    { key: 'eolica',           label: 'Eólica',        unit: 'MW', color: '#a78bfa' },
    { key: 'solar',            label: 'Solar FV',      unit: 'MW', color: '#f59e0b' },
    { key: 'nuclear',          label: 'Nuclear',       unit: 'MW', color: '#ef4444' },
    { key: 'gas',              label: 'C. Combinado',  unit: 'MW', color: '#6b7280' },
  ];

  const labels = VARS.map(v => v.label);
  const valHoy = VARS.map(v => current?.[v.key] ?? 0);
  const val28A = VARS.map(v => snapshot[v.key] ?? 0);

  const traces = [
    {
      x: labels, y: val28A, type: 'bar', name: '28-A (colapso)',
      marker: { color: '#ef4444', opacity: 0.7, line: { color: '#ef4444', width: 1 } },
      hovertemplate: '<b>%{x}</b><br>28-A: %{y:.0f} MW<extra></extra>',
    },
    {
      x: labels, y: valHoy, type: 'bar', name: 'Ahora',
      marker: { color: '#06b6d4', opacity: 0.85, line: { color: '#06b6d4', width: 1 } },
      hovertemplate: '<b>%{x}</b><br>Ahora: %{y:.0f} MW<extra></extra>',
    },
  ];

  const layout = {
    barmode: 'group',
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0' },
    yaxis: { title: 'MW', gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0' },
    legend: { orientation: 'h', y: -0.18, font: { color: '#a0a0b0', size: 11 } },
    margin: { t: 20, b: 80, l: 60, r: 20 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 380,
  };

  // Demanda actual vs 28-A
  const demandaDelta = current?.demanda && snapshot?.demanda
    ? ((current.demanda - snapshot.demanda) / snapshot.demanda * 100).toFixed(1)
    : null;
  const renovDelta = current?.renovable_total && snapshot?.renovable_total
    ? ((current.renovable_total - snapshot.renovable_total) / snapshot.renovable_total * 100).toFixed(1)
    : null;

  return (
    <div style={S.wrapper}>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />

      {(demandaDelta || renovDelta) && (
        <div style={S.row}>
          {demandaDelta && (
            <Chip label="Δ Demanda vs 28-A" value={`${demandaDelta > 0 ? '+' : ''}${demandaDelta}%`}
              color={Math.abs(demandaDelta) < 5 ? '#10b981' : '#f59e0b'} />
          )}
          {renovDelta && (
            <Chip label="Δ Renovable vs 28-A" value={`${renovDelta > 0 ? '+' : ''}${renovDelta}%`}
              color={renovDelta > 10 ? '#ef4444' : renovDelta < -10 ? '#10b981' : '#f59e0b'} />
          )}
          {current?.penetracion_renovable && (
            <Chip label="Penetración renovable" value={`${current.penetracion_renovable.toFixed(1)}%`}
              color={current.penetracion_renovable > 80 ? '#ef4444' : '#10b981'} />
          )}
        </div>
      )}

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠️ Sin datos en tiempo real'}
      </p>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ ...S.chip, borderColor: color + '44' }}>
      <span style={S.chipLabel}>{label}</span>
      <span style={{ ...S.chipVal, color }}>{value}</span>
    </div>
  );
}

const S = {
  wrapper: { background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)', padding: '1.5rem', fontFamily: "'Inter', sans-serif" },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' },
  chip: { flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '8px', padding: '0.5rem 0.8rem', textAlign: 'center' },
  chipLabel: { display: 'block', fontSize: '0.6rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' },
  chipVal: { fontSize: '1rem', fontWeight: 700 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function DemandaRenovableTrend() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>⟳ Cargando...</div>}>
      {() => <DemandaRenovableTrendInner />}
    </BrowserOnly>
  );
}
