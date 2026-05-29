// src/components/PrecioSpotScatter.jsx
// Precio SPOT vs Demanda — scatter con punto actual destacado
// SSR-safe: BrowserOnly + dynamic Plotly import

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Puntos horarios representativos del 28-A (00:00 → 12:33 CEST)
// [demanda_MW, precio_SPOT_EUR/MWh]
const HISTORICAL_28A = [
  [22400, 38],  [21800, 32],  [21200, 28],  [20800, 22],
  [20600, 18],  [21000, 15],  [22400, 10],  [24200, 5],
  [25900, 2],   [27100, -1],  [27800, -2],  [25184, -2.5], // colapso
];

function PrecioSpotScatterInner() {
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

  if (!Plot || loading) return <div style={S.loading}>Cargando precio SPOT...</div>;

  const demandaHoy  = data?.demanda    ?? null;
  const precioHoy   = data?.precio_spot ?? null;
  const renovHoy    = data?.penetracion_renovable ?? null;

  const traces = [
    // Nube histórica 28-A
    {
      x: HISTORICAL_28A.map(p => p[0]),
      y: HISTORICAL_28A.map(p => p[1]),
      mode: 'markers+lines',
      type: 'scatter',
      name: 'Trayectoria 28-A (00:00 → colapso)',
      marker: { color: '#ef4444', size: 7, opacity: 0.65, line: { color: '#ef4444', width: 1 } },
      line: { color: '#ef4444', width: 1, dash: 'dot' },
      hovertemplate: 'Demanda: %{x:.0f} MW<br>Precio: %{y:.2f} €/MWh<extra>28-A</extra>',
    },
    // Punto del colapso
    {
      x: [25184],
      y: [-2.5],
      mode: 'markers',
      type: 'scatter',
      name: 'Colapso 12:33',
      marker: { color: '#dc2626', size: 14, symbol: 'x', line: { color: '#fff', width: 2 } },
      hovertemplate: 'COLAPSO<br>Demanda: 25.184 MW<br>Precio: −2,5 €/MWh<extra></extra>',
    },
  ];

  // Punto actual
  if (demandaHoy !== null && precioHoy !== null) {
    const penColor = renovHoy > 80 ? '#ef4444' : renovHoy > 60 ? '#f59e0b' : '#10b981';
    traces.push({
      x: [demandaHoy],
      y: [precioHoy],
      mode: 'markers',
      type: 'scatter',
      name: `Ahora (${lastUpdate?.toLocaleTimeString('es-ES') ?? '...'})`,
      marker: { color: penColor, size: 16, symbol: 'circle', line: { color: '#fff', width: 2 } },
      hovertemplate: `Demanda: ${demandaHoy.toFixed(0)} MW<br>Precio: ${precioHoy.toFixed(2)} €/MWh<br>Renovable: ${renovHoy?.toFixed(1) ?? '?'}%<extra>AHORA</extra>`,
    });
  }

  const layout = {
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { title: 'Demanda (MW)', gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0' },
    yaxis: { title: 'Precio SPOT (€/MWh)', gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0',
             zeroline: true, zerolinecolor: 'rgba(255,170,0,0.3)' },
    legend: { orientation: 'h', y: -0.22, font: { color: '#a0a0b0', size: 11 } },
    margin: { t: 20, b: 80, l: 70, r: 20 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 380,
    // Zona de peligro (precio negativo)
    shapes: [{
      type: 'rect', x0: 18000, x1: 30000, y0: -15, y1: 0,
      fillcolor: 'rgba(239,68,68,0.05)', line: { width: 0 },
    }],
    annotations: [{
      x: 24000, y: -8, text: 'Zona precio negativo (exceso renovable)',
      showarrow: false, font: { size: 10, color: 'rgba(239,68,68,0.5)' },
    }],
  };

  return (
    <div style={S.wrapper}>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />

      {demandaHoy && precioHoy && (
        <div style={S.row}>
          <Chip label="Precio SPOT actual" value={`${precioHoy.toFixed(2)} €/MWh`}
            color={precioHoy < 0 ? '#ef4444' : precioHoy < 20 ? '#f59e0b' : '#10b981'} />
          <Chip label="Demanda actual" value={`${(demandaHoy / 1000).toFixed(1)} GW`} color="#06b6d4" />
          {renovHoy && (
            <Chip label="% Renovable" value={`${renovHoy.toFixed(1)}%`}
              color={renovHoy > 80 ? '#ef4444' : renovHoy > 60 ? '#f59e0b' : '#10b981'} />
          )}
        </div>
      )}

      <p style={S.note}>
        El 28-A el precio SPOT cayó a <strong style={{ color: '#ef4444' }}>−2,5 €/MWh</strong> porque la
        sobreproducción renovable superaba la demanda. El precio negativo es señal de estrés sistémico extremo.
        La trayectoria roja muestra las horas del 28-A desde medianoche hasta el colapso.
      </p>

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : 'Sin datos en tiempo real'}
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
  wrapper: { background: 'transparent', padding: '1rem 0', fontFamily: "'Inter', sans-serif" },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
  chip: { flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '8px', padding: '0.6rem 1rem', textAlign: 'center' },
  chipLabel: { display: 'block', fontSize: '0.6rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' },
  chipVal: { fontSize: '1rem', fontWeight: 700 },
  note: { marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(160,155,140,0.7)', borderLeft: '3px solid rgba(255,170,0,0.3)', padding: '0.5rem 1rem', lineHeight: 1.6 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function PrecioSpotScatter() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>Cargando...</div>}>
      {() => <PrecioSpotScatterInner />}
    </BrowserOnly>
  );
}
