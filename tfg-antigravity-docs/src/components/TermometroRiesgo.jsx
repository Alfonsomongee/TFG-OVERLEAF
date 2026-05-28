// src/components/TermometroRiesgo.jsx
// Termómetro de penetración renovable + inercia estimada — gauges Plotly
// SSR-safe: BrowserOnly + dynamic Plotly import

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const BLACKOUT_PENETRACION = 84.5;
const BLACKOUT_INERCIA     = 2.3;

function TermometroRiesgoInner() {
  const [Plot, setPlot]   = useState(null);
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/esios-multi');
      setData(await res.json());
      setLastUpdate(new Date());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300000);
    return () => clearInterval(id);
  }, [fetchData]);

  if (!Plot || loading) return <div style={S.loading}>⟳ Cargando termómetro...</div>;

  const penetracion   = data?.penetracion_renovable ?? null;
  const inercia       = data?.inercia_estimada ?? null;

  const mkGauge = (value, ref, range, steps, unit, label) => ({
    type: 'indicator',
    mode: 'gauge+number+delta',
    value: value ?? 0,
    delta: { reference: ref, valueformat: '.1f', suffix: unit, font: { size: 13 } },
    number: { suffix: unit, font: { size: 22, color: '#e0ddd5' } },
    title: { text: label, font: { size: 13, color: '#a0a0b0' } },
    gauge: {
      axis: { range, tickcolor: '#a0a0b0', tickfont: { size: 10, color: '#a0a0b0' } },
      bar: { color: value !== null ? gaugeColor(value, steps) : '#a0a0b0', thickness: 0.25 },
      bgcolor: 'rgba(255,255,255,0.04)',
      borderwidth: 0,
      steps: steps.map(st => ({ range: st.range, color: st.bg })),
      threshold: {
        line: { color: '#ef4444', width: 3 },
        thickness: 0.75,
        value: ref,
      },
    },
  });

  const PENETRACION_STEPS = [
    { range: [0, 50],  bg: 'rgba(16,185,129,0.08)',  color: '#10b981' },
    { range: [50, 75], bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b' },
    { range: [75, 100], bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
  ];
  const INERCIA_STEPS = [
    { range: [0, 2],  bg: 'rgba(239,68,68,0.08)',   color: '#ef4444' },
    { range: [2, 4],  bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b' },
    { range: [4, 10], bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
  ];

  const sharedLayout = {
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 40, b: 20, l: 30, r: 30 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 260,
  };

  return (
    <div style={S.wrapper}>
      <div style={S.grid}>
        {/* Penetración renovable */}
        <div style={S.gaugeBox}>
          <Plot
            data={[mkGauge(penetracion, BLACKOUT_PENETRACION, [0, 100], PENETRACION_STEPS, '%', 'Penetración renovable')]}
            layout={{ ...sharedLayout }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
          <RiskBadge value={penetracion} thresholds={[{ max: 50, label: 'Normal', color: '#10b981' }, { max: 75, label: 'Atención', color: '#f59e0b' }]} dangerLabel="Riesgo alto" />
          <p style={S.ref}>Umbral 28-A: <strong style={{ color: '#ef4444' }}>84.5%</strong> · Línea roja = instante del colapso</p>
        </div>

        {/* Inercia estimada */}
        <div style={S.gaugeBox}>
          <Plot
            data={[mkGauge(inercia, BLACKOUT_INERCIA, [0, 10], INERCIA_STEPS, ' GW·s', 'Inercia estimada del sistema')]}
            layout={{ ...sharedLayout }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
          <RiskBadge value={inercia} thresholds={[{ max: 2, label: 'Crítico', color: '#ef4444' }, { max: 4, label: 'Bajo', color: '#f59e0b' }]} dangerLabel="Nominal" dangerInverted />
          <p style={S.ref}>Umbral 28-A: <strong style={{ color: '#ef4444' }}>~2.3 GW·s</strong> · Fórmula: Nuclear×6 + Hidro×3 + Gas×4</p>
        </div>
      </div>

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠️ Sin datos en tiempo real'}
      </p>
    </div>
  );
}

function gaugeColor(value, steps) {
  for (const st of steps) {
    if (value >= st.range[0] && value < st.range[1]) return st.color;
  }
  return steps[steps.length - 1].color;
}

function RiskBadge({ value, thresholds, dangerLabel, dangerInverted }) {
  if (value === null) return null;
  for (const t of thresholds) {
    if (value < t.max) {
      return <div style={{ ...S.badge, background: t.color + '22', color: t.color, borderColor: t.color + '44' }}>{t.label}</div>;
    }
  }
  return <div style={{ ...S.badge, background: (dangerInverted ? '#10b981' : '#ef4444') + '22', color: dangerInverted ? '#10b981' : '#ef4444', borderColor: (dangerInverted ? '#10b981' : '#ef4444') + '44' }}>{dangerLabel}</div>;
}

const S = {
  wrapper: { background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)', padding: '1.5rem', fontFamily: "'Inter', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  gaugeBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  badge: { marginTop: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  ref: { fontSize: '0.72rem', color: 'rgba(160,155,140,0.65)', textAlign: 'center', marginTop: '0.4rem', lineHeight: 1.4 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '1rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function TermometroRiesgo() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>⟳ Cargando...</div>}>
      {() => <TermometroRiesgoInner />}
    </BrowserOnly>
  );
}
