// src/components/RadarVulnerabilidad.jsx
// Radar de vulnerabilidad multidimensional: Hoy vs 28-A (colapso)
// SSR-safe: BrowserOnly + dynamic Plotly import

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Valores del perfil de colapso normalizados (0–100 escala de riesgo)
// 100 = máximo riesgo conocido (28-A), 0 = mínimo riesgo
const BLACKOUT_NORMALIZED = {
  'Penetración renovable': 84.5,   // %
  'Inercia estimada (inv.)': 100 - (2.3 / 10 * 100), // invertida: menos inercia = más riesgo
  'Exportación neta':  68,          // % del máximo histórico
  'Precio negativo':   100,         // precio cayó a -2.5 → máximo riesgo
  'Demanda relativa':  60,          // demanda media del día
};

function RadarVulnerabilidadInner() {
  const [Plot, setPlot]     = useState(null);
  const [data, setData]     = useState(null);
  const [snapshot, setSnapshot] = useState(null);
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
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/esios-multi').then(r => r.json()).catch(() => null),
      fetch('/data/blackout_snapshot_28A.json').then(r => r.json()).catch(() => null),
    ]).then(([cur, snap]) => {
      setData(cur);
      setSnapshot(snap);
    }).finally(() => setLoading(false));

    const id = setInterval(fetchData, 300000);
    return () => clearInterval(id);
  }, [fetchData]);

  if (!Plot || loading) return <div style={S.loading}>⟳ Cargando radar...</div>;

  const categories = Object.keys(BLACKOUT_NORMALIZED);

  // Calcular dimensiones normalizadas del estado actual
  const calcHoy = () => {
    if (!data) return categories.map(() => 0);

    const penetracion = data.penetracion_renovable ?? 0;
    const inercia     = data.inercia_estimada ?? 5;
    const expNeta     = data.intercambio_neto !== null ? Math.max(0, -(data.intercambio_neto)) / 5000 * 100 : 0;
    const precio      = data.precio_spot !== null ? Math.max(0, (10 - data.precio_spot) / 10 * 100) : 50;
    const demRelativa = data.demanda !== null ? (data.demanda / 35000 * 100) : 50;

    return [
      Math.min(100, penetracion),
      Math.min(100, 100 - (inercia / 10 * 100)),
      Math.min(100, expNeta),
      Math.min(100, precio),
      Math.min(100, demRelativa),
    ];
  };

  const valHoy  = calcHoy();
  const val28A  = Object.values(BLACKOUT_NORMALIZED);

  // Índice de vulnerabilidad 0–100
  const vulnHoy  = (valHoy.reduce((a, b) => a + b, 0) / valHoy.length).toFixed(1);
  const vuln28A  = (val28A.reduce((a, b) => a + b, 0) / val28A.length).toFixed(1);

  const vulnColor = vulnHoy > 70 ? '#ef4444' : vulnHoy > 45 ? '#f59e0b' : '#10b981';
  const vulnLabel = vulnHoy > 70 ? 'RIESGO ALTO' : vulnHoy > 45 ? 'VIGILANCIA' : 'ESTABLE';

  const traces = [
    {
      type: 'scatterpolar',
      r: [...val28A, val28A[0]],
      theta: [...categories, categories[0]],
      fill: 'toself',
      name: '28-A (colapso)',
      fillcolor: 'rgba(239,68,68,0.12)',
      line: { color: '#ef4444', width: 2 },
      marker: { color: '#ef4444', size: 5 },
      hovertemplate: '<b>%{theta}</b><br>28-A: %{r:.1f}/100<extra></extra>',
    },
    {
      type: 'scatterpolar',
      r: [...valHoy, valHoy[0]],
      theta: [...categories, categories[0]],
      fill: 'toself',
      name: `Ahora (${lastUpdate?.toLocaleTimeString('es-ES') ?? '...'})`,
      fillcolor: 'rgba(6,182,212,0.12)',
      line: { color: '#06b6d4', width: 2.5 },
      marker: { color: '#06b6d4', size: 6 },
      hovertemplate: '<b>%{theta}</b><br>Ahora: %{r:.1f}/100<extra></extra>',
    },
  ];

  const layout = {
    polar: {
      radialaxis: {
        range: [0, 100],
        tickvals: [25, 50, 75, 100],
        ticktext: ['25', '50', '75', '100'],
        gridcolor: 'rgba(255,255,255,0.08)',
        color: '#a0a0b0',
        tickfont: { size: 9 },
      },
      angularaxis: {
        gridcolor: 'rgba(255,255,255,0.08)',
        color: '#a0a0b0',
        tickfont: { size: 10 },
      },
      bgcolor: 'rgba(0,0,0,0)',
    },
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    legend: { orientation: 'h', y: -0.15, font: { color: '#a0a0b0', size: 11 } },
    margin: { t: 30, b: 60, l: 40, r: 40 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 420,
  };

  return (
    <div style={S.wrapper}>
      {/* Índice de vulnerabilidad */}
      <div style={S.indexRow}>
        <div style={{ ...S.indexCard, borderColor: vulnColor + '44' }}>
          <span style={S.indexLabel}>Índice de vulnerabilidad ahora</span>
          <span style={{ ...S.indexVal, color: vulnColor }}>{vulnHoy}<small>/100</small></span>
          <span style={{ ...S.indexBadge, background: vulnColor + '22', color: vulnColor, borderColor: vulnColor + '44' }}>{vulnLabel}</span>
        </div>
        <div style={{ ...S.indexCard, borderColor: '#ef444444' }}>
          <span style={S.indexLabel}>Índice de vulnerabilidad 28-A</span>
          <span style={{ ...S.indexVal, color: '#ef4444' }}>{vuln28A}<small>/100</small></span>
          <span style={{ ...S.indexBadge, background: '#ef444422', color: '#ef4444', borderColor: '#ef444444' }}>COLAPSO</span>
        </div>
      </div>

      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />

      {/* Leyenda dimensiones */}
      <div style={S.dimGrid}>
        {categories.map((cat, i) => (
          <DimRow key={cat} label={cat} hoy={valHoy[i]} ref28A={val28A[i]} />
        ))}
      </div>

      <p style={S.note}>
        ℹ️ Cuanto más se aproxima el polígono azul al rojo, mayor es la similitud con las condiciones del colapso.
        100 = máximo riesgo conocido (perfil 28-A). Las dimensiones están normalizadas para comparabilidad.
      </p>

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠️ Sin datos en tiempo real'}
      </p>
    </div>
  );
}

function DimRow({ label, hoy, ref28A }) {
  const pct  = Math.round(hoy);
  const diff = (hoy - ref28A).toFixed(1);
  const color = pct > 75 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981';
  return (
    <div style={S.dimRow}>
      <span style={S.dimLabel}>{label}</span>
      <div style={S.dimBar}>
        <div style={{ ...S.dimFill, width: `${pct}%`, background: color }} />
        <div style={{ ...S.dimRef, left: `${ref28A}%` }} />
      </div>
      <span style={{ ...S.dimVal, color }}>{pct}</span>
      <span style={{ ...S.dimDiff, color: diff > 0 ? '#ef4444' : '#10b981' }}>
        {diff > 0 ? '+' : ''}{diff}
      </span>
    </div>
  );
}

const S = {
  wrapper: { background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)', padding: '1.5rem', fontFamily: "'Inter', sans-serif" },
  indexRow: { display: 'flex', gap: '1rem', marginBottom: '1.25rem' },
  indexCard: { flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  indexLabel: { fontSize: '0.6rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' },
  indexVal: { fontSize: '2rem', fontWeight: 800, lineHeight: 1 },
  indexBadge: { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.15rem 0.6rem', borderRadius: '20px', border: '1px solid', fontFamily: "'JetBrains Mono', monospace" },
  dimGrid: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' },
  dimRow: { display: 'grid', gridTemplateColumns: '1fr 2fr 2.5rem 3rem', alignItems: 'center', gap: '0.5rem' },
  dimLabel: { fontSize: '0.68rem', color: '#a0a0b0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  dimBar: { height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', position: 'relative', overflow: 'visible' },
  dimFill: { height: '100%', borderRadius: '3px', transition: 'width 0.6s ease' },
  dimRef: { position: 'absolute', top: '-3px', width: '2px', height: '12px', background: '#ef4444', borderRadius: '1px' },
  dimVal: { fontSize: '0.75rem', fontWeight: 700, textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" },
  dimDiff: { fontSize: '0.65rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" },
  note: { marginTop: '1rem', fontSize: '0.78rem', color: 'rgba(160,155,140,0.7)', background: 'rgba(255,170,0,0.04)', border: '1px solid rgba(255,170,0,0.08)', borderRadius: '8px', padding: '0.75rem 1rem', lineHeight: 1.6 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function RadarVulnerabilidad() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>⟳ Cargando...</div>}>
      {() => <RadarVulnerabilidadInner />}
    </BrowserOnly>
  );
}
