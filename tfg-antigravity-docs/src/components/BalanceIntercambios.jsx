// src/components/BalanceIntercambios.jsx
// Balance de intercambios internacionales España ↔ Francia / Portugal
// SSR-safe: BrowserOnly + dynamic Plotly import

import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import datos28A from '@site/static/data/datos28A.json';

// Valores del 28-A en el instante del colapso (positivo = exportación desde España)
const SNAPSHOT_28A = {
  Francia:  datos28A.intercambios_internacionales.exportacion_francia_MW,
  Portugal: datos28A.intercambios_internacionales.exportacion_portugal_MW,
};

function BalanceIntercambiosInner() {
  const lang = useDocLang();
  const isEs = lang === 'es';

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

  if (!Plot || loading) return <div style={S.loading}>{isEs ? 'Cargando intercambios...' : 'Loading exchanges...'}</div>;

  // ESIOS devuelve export_francia negativo cuando España exporta (convención de flujos)
  const franciaHoy  = data ? -(data.export_francia ?? 0)  : 0;
  const portugalHoy = data ? -(data.export_portugal ?? 0) : 0;

  const traces = [
    {
      x: [isEs ? 'Francia' : 'France', isEs ? 'Portugal' : 'Portugal'],
      y: [SNAPSHOT_28A.Francia, SNAPSHOT_28A.Portugal],
      type: 'bar', name: isEs ? '28-A (colapso)' : '28-A (collapse)',
      marker: { color: '#ef4444', opacity: 0.75, line: { color: '#ef4444', width: 1 } },
      hovertemplate: '<b>%{x}</b><br>28-A: %{y:.0f} MW<extra></extra>',
    },
    {
      x: [isEs ? 'Francia' : 'France', isEs ? 'Portugal' : 'Portugal'],
      y: [franciaHoy, portugalHoy],
      type: 'bar', name: isEs ? 'Ahora' : 'Now',
      marker: { color: '#06b6d4', opacity: 0.85, line: { color: '#06b6d4', width: 1 } },
      hovertemplate: '<b>%{x}</b><br>' + (isEs ? 'Ahora' : 'Now') + ': %{y:.0f} MW<extra></extra>',
    },
  ];

  const layout = {
    barmode: 'group',
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0' },
    yaxis: {
      title: isEs ? 'MW (positivo = exportación desde España)' : 'MW (positive = export from Spain)',
      gridcolor: 'rgba(255,255,255,0.06)', color: '#a0a0b0',
      zeroline: true, zerolinecolor: 'rgba(255,255,255,0.15)',
    },
    legend: { orientation: 'h', y: -0.22, font: { color: '#a0a0b0', size: 11 } },
    margin: { t: 20, b: 80, l: 70, r: 20 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 360,
    shapes: [{
      type: 'line', x0: -0.5, x1: 1.5, y0: 0, y1: 0,
      line: { color: 'rgba(255,255,255,0.2)', width: 1 },
    }],
  };

  const neto = data?.intercambio_neto ?? null;

  return (
    <div style={S.wrapper}>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />

      {/* Métricas */}
      <div style={S.row}>
        <FlowChip country={isEs ? "Francia" : "France"} value={franciaHoy} ref28A={SNAPSHOT_28A.Francia} isEs={isEs} />
        <FlowChip country={isEs ? "Portugal" : "Portugal"} value={portugalHoy} ref28A={SNAPSHOT_28A.Portugal} isEs={isEs} />
        {neto !== null && (
          <div style={{ ...S.chip, borderColor: 'rgba(255,170,0,0.2)' }}>
            <span style={S.chipLabel}>{isEs ? 'Saldo neto total' : 'Total net balance'}</span>
            <span style={{ ...S.chipVal, color: neto < 0 ? '#10b981' : '#ef4444' }}>
              {neto > 0 ? '+' : ''}{neto.toFixed(0)} MW
            </span>
            <span style={S.chipSub}>{neto < 0 ? (isEs ? 'Exportador neto' : 'Net exporter') : (isEs ? 'Importador neto' : 'Net importer')}</span>
          </div>
        )}
      </div>

      <p style={S.note} dangerouslySetInnerHTML={{ __html: isEs 
        ? `El 28-A España era <b>exportador neto</b> hacia Francia y Portugal con 870 + 2.600 MW, vaciando sus propias reservas mientras el sistema oscilaba. Valores negativos = importación.`
        : `On 28-A Spain was a <b>net exporter</b> to France and Portugal with 870 + 2,600 MW, emptying its own reserves while the system oscillated. Negative values = import.` 
      }} />

      <p style={S.caption}>
        {lastUpdate
          ? (isEs ? 'Actualizado:' : 'Updated:') + ` ${lastUpdate.toLocaleTimeString()} · ` + (isEs ? 'Fuente: ESIOS (REE) · Refresco cada 5 min' : 'Source: ESIOS (REE) · Refreshed every 5 min')
          : (isEs ? 'Sin datos en tiempo real' : 'No real-time data')}
      </p>
    </div>
  );
}

function FlowChip({ country, value, ref28A, isEs }) {
  const isExport = value > 0;
  const color = isExport ? '#f59e0b' : '#10b981';
  return (
    <div style={{ ...S.chip, borderColor: color + '44' }}>
      <span style={S.chipLabel}>{country} {isEs ? 'ahora' : 'now'}</span>
      <span style={{ ...S.chipVal, color }}>{value > 0 ? '+' : ''}{value.toFixed(0)} MW</span>
      <span style={S.chipSub}>28-A: +{ref28A} MW</span>
    </div>
  );
}

const S = {
  wrapper: { background: 'transparent', padding: '1rem 0', fontFamily: "'Inter', sans-serif" },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
  chip: { flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '8px', padding: '0.6rem 1rem', textAlign: 'center' },
  chipLabel: { display: 'block', fontSize: '0.6rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' },
  chipVal: { display: 'block', fontSize: '1rem', fontWeight: 700 },
  chipSub: { display: 'block', fontSize: '0.65rem', color: '#a0a0b0', marginTop: '0.15rem' },
  note: { marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(160,155,140,0.7)', borderLeft: '3px solid rgba(255,170,0,0.3)', padding: '0.5rem 1rem', lineHeight: 1.6 },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
  caption: { marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
};

export default function BalanceIntercambios() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  return (
    <BrowserOnly fallback={<div style={S.loading}>{isEs ? 'Cargando...' : 'Loading...'}</div>}>
      {() => <BalanceIntercambiosInner />}
    </BrowserOnly>
  );
}
