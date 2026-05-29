// src/components/EmissionsVsRenewablesChart.jsx
// Gráfico de doble eje: Emisiones de CO₂ vs Penetración renovable
// Muestra la paradoja: el sistema colapsó en su punto más limpio
// Datos: REData (emisiones) + JSON estático (penetración renovable)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const PROXY_URL = '/api/redata-proxy?url=';

// Fechas de la semana del colapso (incluye días previos y posteriores)
const START_DATE = '2025-04-25T00:00';
const END_DATE = '2025-05-01T23:59';

// Construir URL para emisiones de CO₂ asociadas a la generación (REData)
function buildEmissionsUrl() {
  const base = 'https://apidatos.ree.es/es/datos/generacion/estructura-generacion-emisiones-asociadas';
  const params = new URLSearchParams({
    start_date: START_DATE,
    end_date: END_DATE,
    time_trunc: 'day',
    geo_trunc: 'electric_system',
    geo_limit: 'peninsular',
    geo_ids: '8741'
  });
  return `${base}?${params.toString()}`;
}

// Componente interno
function EmissionsVsRenewablesChartInner() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      // 1. Obtener emisiones de CO₂ desde REData
      const emissionsUrl = buildEmissionsUrl();
      const emissionsProxy = `${PROXY_URL}${encodeURIComponent(emissionsUrl)}`;
      const emissionsRes = await fetch(emissionsProxy, { signal: abortControllerRef.current.signal });
      if (!emissionsRes.ok) throw new Error(`Emissions API error: ${emissionsRes.status}`);
      const emissionsJson = await emissionsRes.json();

      let emissionsData = [];
      if (emissionsJson.included && emissionsJson.included.length) {
        // Buscar el indicador de emisiones (suele ser el primero)
        const emissionIndicator = emissionsJson.included.find(ind => 
          ind.attributes.title?.toLowerCase().includes('emisión') || 
          ind.attributes.title?.toLowerCase().includes('co2')
        ) || emissionsJson.included[0];
        
        const values = emissionIndicator?.attributes?.values || [];
        emissionsData = values.map(v => ({
          date: v.datetime.substring(0, 10), // YYYY-MM-DD
          emissions: v.value !== undefined && v.value !== null ? parseFloat(v.value) : null
        })).filter(d => d.emissions !== null);
      }

      // 2. Obtener penetración renovable desde JSON estático (datos reales de informes)
      const penetrationRes = await fetch('/data/penetracion_renovable_28A_semana.json');
      if (!penetrationRes.ok) throw new Error('Failed to load penetration data');
      const penetrationData = await penetrationRes.json();

      // Integrar emisiones y penetración por fecha
      const combined = emissionsData.map(em => {
        const penetration = penetrationData[em.date];
        return {
          date: em.date,
          emissions: em.emissions,
          penetration: penetration !== undefined ? penetration : null
        };
      }).filter(d => d.penetration !== null);

      if (combined.length === 0) {
        throw new Error('No se encontraron datos combinados de emisiones y penetración');
      }

      setChartData(combined);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching emissions/penetration data:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(7,9,15,0.6)', borderRadius: '12px' }}>
        <span>Cargando datos de emisiones y penetración renovable...</span>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem', color: '#ef4444', background: 'rgba(7,9,15,0.6)', borderRadius: '12px' }}>
        ⚠️ Error: {error || 'No se pudieron cargar los datos'}
        <button onClick={fetchData} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Reintentar</button>
      </div>
    );
  }

  // Preparar trazas para Plotly (doble eje)
  const dates = chartData.map(d => d.date);
  const emissionsValues = chartData.map(d => d.emissions);
  const penetrationValues = chartData.map(d => d.penetration);

  // Identificar el día del colapso (28 de abril) para resaltarlo
  const collapseIndex = dates.findIndex(d => d === '2025-04-28');
  const collapseAnnotation = collapseIndex !== -1 ? {
    x: dates[collapseIndex],
    y: emissionsValues[collapseIndex],
    text: '⚡ COLAPSO 28-A',
    showarrow: true,
    arrowhead: 2,
    arrowcolor: '#ef4444',
    font: { color: '#ef4444', size: 11 }
  } : null;

  const traceEmissions = {
    x: dates,
    y: emissionsValues,
    name: 'Emisiones de CO₂ (gCO₂/kWh)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#ef4444', width: 2.5 },
    marker: { size: 6, color: '#ef4444' },
    yaxis: 'y',
    hovertemplate: '<b>%{x}</b><br>Emisiones: %{y:.1f} gCO₂/kWh<extra></extra>'
  };

  const tracePenetration = {
    x: dates,
    y: penetrationValues,
    name: 'Penetración renovable (%)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#06b6d4', width: 2.5, dash: 'dot' },
    marker: { size: 6, color: '#06b6d4' },
    yaxis: 'y2',
    hovertemplate: '<b>%{x}</b><br>Penetración renovable: %{y:.1f}%<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Emisiones de CO₂ vs Penetración renovable durante la semana del colapso',
      font: { size: 16, color: '#e0ddd5' }
    },
    xaxis: {
      title: 'Fecha',
      tickangle: -30,
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    yaxis: {
      title: 'Emisiones (gCO₂/kWh)',
      gridcolor: 'rgba(255,255,255,0.1)',
      color: '#ef4444',
      tickformat: ',.0f'
    },
    yaxis2: {
      title: 'Penetración renovable (%)',
      overlaying: 'y',
      side: 'right',
      gridcolor: 'rgba(0,0,0,0)',
      color: '#06b6d4',
      tickformat: ',.1f',
      range: [0, 100]
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: 450,
    margin: { l: 70, r: 80, t: 80, b: 60 },
    legend: { orientation: 'h', y: -0.2 },
    annotations: collapseAnnotation ? [collapseAnnotation] : []
  };

  return (
    <div style={{ padding: '1rem', background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)' }}>
      <PlotlyChart data={[traceEmissions, tracePenetration]} layout={layout} />
      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(160,155,140,0.7)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
        <p>📉 <strong>Paradoja ambiental:</strong> El sistema eléctrico colapsó el 28 de abril alcanzando su <strong>máxima penetración renovable (84,5%)</strong> y <strong>mínimas emisiones de CO₂</strong> del período. La crisis no fue por falta de energía limpia, sino por <strong>falta de inercia síncrona y control dinámico de tensión</strong>.</p>
        <p>ℹ️ Datos de emisiones: REData (REE). Penetración renovable: datos reales basados en informes técnicos del 28-A.</p>
      </div>
    </div>
  );
}

// Envoltorio con import dinámico de Plotly (SSR-safe)
let PlotlyChart = null;
function DynamicPlotlyWrapper({ data, layout }) {
  const [Plot, setPlot] = useState(null);
  useEffect(() => {
    import('react-plotly.js').then(mod => setPlot(() => mod.default));
  }, []);
  if (!Plot) return <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando gráfica...</div>;
  return <Plot data={data} layout={layout} config={{ responsive: true, displayModeBar: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />;
}

export default function EmissionsVsRenewablesChart() {
  return (
    <BrowserOnly fallback={<div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando componente...</div>}>
      {() => (
        <EmissionsVsRenewablesChartInner />
      )}
    </BrowserOnly>
  );
}
