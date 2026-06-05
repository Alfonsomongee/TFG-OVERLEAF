// src/components/BalanceIntercambios.jsx
// Balance de intercambios internacionales España ↔ Francia / Portugal
// SSR-safe: BrowserOnly + dynamic Plotly import

import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import datos28A from '@site/static/data/datos28A.json';
import { useColorMode } from '@docusaurus/theme-common';

// Valores del 28-A en el instante del colapso (positivo = exportación desde España)
const SNAPSHOT_28A = {
  Francia:  datos28A.intercambios_internacionales.exportacion_francia_MW,
  Portugal: datos28A.intercambios_internacionales.exportacion_portugal_MW,
};

function BalanceIntercambiosInner() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    wrapperBg: '#071326',
    wrapperBorder: 'rgba(226, 232, 240, 0.08)',
    title: '#F4F7FB',
    desc: '#E6EDF7',
    secondary: '#91A4BC',
    axes: '#C7D2E3',
    grid: 'rgba(244, 247, 251, 0.10)',
    zeroLine: 'rgba(244, 247, 251, 0.24)',
    bar28A: '#D98798',
    bar28AHover: '#C8798A',
    barNow: '#7DCDE3',
    barNowHover: '#8FB6FF',
    chipBg: 'rgba(16, 29, 53, 0.76)',
    chipBorder: 'rgba(230, 180, 92, 0.30)',
    chipShadow: '0 10px 28px rgba(0, 0, 0, 0.26)',
    chipLabel: '#91A4BC',
    valPositive: '#E6B45C',
    valNegative: '#7DCDE3',
  } : {
    wrapperBg: '#F6F0E3',
    wrapperBorder: 'transparent',
    title: '#2A2925',
    desc: '#191814',
    secondary: '#7A7062',
    axes: '#7A7062',
    grid: 'rgba(25, 24, 20, 0.10)',
    zeroLine: 'rgba(25, 24, 20, 0.22)',
    bar28A: '#A13D36',
    bar28AHover: '#7A263A',
    barNow: '#1F6F78',
    barNowHover: '#155E66',
    chipBg: 'rgba(230, 223, 209, 0.45)',
    chipBorder: 'rgba(161, 61, 54, 0.18)',
    chipShadow: 'none',
    chipLabel: '#7A7062',
    valPositive: '#1F6F78',
    valNegative: '#A13D36',
  };

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
      marker: { color: colors.bar28A, opacity: 0.95, line: { color: colors.bar28A, width: 1 } },
      hoverlabel: { bgcolor: isDark ? '#071326' : '#E6DFD1', font: { color: isDark ? '#F4F7FB' : '#2A2925' } },
      hovertemplate: '<b>%{x}</b><br>28-A: %{y:.0f} MW<extra></extra>',
    },
    {
      x: [isEs ? 'Francia' : 'France', isEs ? 'Portugal' : 'Portugal'],
      y: [franciaHoy, portugalHoy],
      type: 'bar', name: isEs ? 'Ahora' : 'Now',
      marker: { color: colors.barNow, opacity: 0.95, line: { color: colors.barNow, width: 1 } },
      hoverlabel: { bgcolor: isDark ? '#071326' : '#E6DFD1', font: { color: isDark ? '#F4F7FB' : '#2A2925' } },
      hovertemplate: '<b>%{x}</b><br>' + (isEs ? 'Ahora' : 'Now') + ': %{y:.0f} MW<extra></extra>',
    },
  ];

  const layout = {
    barmode: 'group',
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { gridcolor: colors.grid, color: colors.axes },
    yaxis: {
      title: isEs ? 'MW (positivo = exportación desde España)' : 'MW (positive = export from Spain)',
      gridcolor: colors.grid, color: colors.axes,
      zeroline: true, zerolinecolor: colors.zeroLine,
    },
    legend: { orientation: 'h', y: -0.22, font: { color: colors.axes, size: 11 } },
    margin: { t: 20, b: 80, l: 70, r: 20 },
    font: { family: 'Inter, sans-serif', color: colors.axes },
    height: 360,
    shapes: [{
      type: 'line', x0: -0.5, x1: 1.5, y0: 0, y1: 0,
      line: { color: colors.zeroLine, width: 1 },
    }],
    hovermode: 'closest',
  };

  const neto = data?.intercambio_neto ?? null;

  return (
    <div style={{ ...S.wrapper, backgroundColor: colors.wrapperBg, border: colors.wrapperBorder === 'transparent' ? 'none' : `1px solid ${colors.wrapperBorder}`, borderRadius: '12px', padding: '1.5rem' }}>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%' }}
      />

      {/* Métricas */}
      <div style={S.row}>
        <FlowChip country={isEs ? "Francia" : "France"} value={franciaHoy} ref28A={SNAPSHOT_28A.Francia} isEs={isEs} colors={colors} />
        <FlowChip country={isEs ? "Portugal" : "Portugal"} value={portugalHoy} ref28A={SNAPSHOT_28A.Portugal} isEs={isEs} colors={colors} />
        {neto !== null && (
          <div style={{ ...S.chip, backgroundColor: colors.chipBg, borderColor: colors.chipBorder, boxShadow: colors.chipShadow }}>
            <span style={{ ...S.chipLabel, color: colors.chipLabel }}>{isEs ? 'Saldo neto total' : 'Total net balance'}</span>
            <span style={{ ...S.chipVal, color: neto < 0 ? colors.valPositive : colors.valNegative }}>
              {neto > 0 ? '+' : ''}{neto.toFixed(0)} MW
            </span>
            <span style={{ ...S.chipSub, color: colors.secondary }}>{neto < 0 ? (isEs ? 'Exportador neto' : 'Net exporter') : (isEs ? 'Importador neto' : 'Net importer')}</span>
          </div>
        )}
      </div>

      <p style={{ ...S.note, color: colors.desc, borderLeft: `3px solid ${colors.valPositive}` }} dangerouslySetInnerHTML={{ __html: isEs 
        ? `El 28-A España era <b>exportador neto</b> hacia Francia y Portugal con 870 + 2.600 MW, vaciando sus propias reservas mientras el sistema oscilaba. Valores negativos = importación.`
        : `On 28-A Spain was a <b>net exporter</b> to France and Portugal with 870 + 2,600 MW, emptying its own reserves while the system oscillated. Negative values = import.` 
      }} />

      <p style={{ ...S.caption, color: colors.secondary }}>
        {lastUpdate
          ? (isEs ? 'Actualizado:' : 'Updated:') + ` ${lastUpdate.toLocaleTimeString()} · ` + (isEs ? 'Fuente: ESIOS (REE) · Refresco cada 5 min' : 'Source: ESIOS (REE) · Refreshed every 5 min')
          : (isEs ? 'Sin datos en tiempo real' : 'No real-time data')}
      </p>
    </div>
  );
}

function FlowChip({ country, value, ref28A, isEs, colors }) {
  const isExport = value > 0;
  const color = isExport ? colors.valPositive : colors.valNegative;
  return (
    <div style={{ ...S.chip, backgroundColor: colors.chipBg, borderColor: colors.chipBorder, boxShadow: colors.chipShadow }}>
      <span style={{ ...S.chipLabel, color: colors.chipLabel }}>{country} {isEs ? 'ahora' : 'now'}</span>
      <span style={{ ...S.chipVal, color }}>{value > 0 ? '+' : ''}{value.toFixed(0)} MW</span>
      <span style={{ ...S.chipSub, color: colors.secondary }}>28-A: +{ref28A} MW</span>
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
