// src/components/SectorialResilienceChart.jsx
// Índice de resiliencia sectorial: comparativa de recuperación de la demanda
// Industria vs Servicios / Residencial tras el apagón del 28-A
// Datos desde REData: IRE industria, IRE servicios

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const PROXY_URL = '/api/redata-proxy?url=';

// Período: desde el día del colapso hasta una semana después
const START_DATE = '2025-04-28T00:00';
const END_DATE = '2025-05-05T23:59';

function buildIndustryUrl() {
  const base = 'https://apidatos.ree.es/es/datos/demanda/ire-industria';
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

function buildServicesUrl() {
  const base = 'https://apidatos.ree.es/es/datos/demanda/ire-servicios';
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
function SectorialResilienceChartInner() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      // 1. Obtener IRE industria
      const industryUrl = buildIndustryUrl();
      const industryProxy = `${PROXY_URL}${encodeURIComponent(industryUrl)}`;
      const industryRes = await fetch(industryProxy, { signal: abortControllerRef.current.signal });
      if (!industryRes.ok) throw new Error(`Industry API error: ${industryRes.status}`);
      const industryJson = await industryRes.json();

      let industryData = [];
      if (industryJson.included && industryJson.included.length) {
        const values = industryJson.included[0]?.attributes?.values || [];
        industryData = values.map(v => ({
          date: v.datetime.substring(0, 10),
          value: v.value !== undefined && v.value !== null ? parseFloat(v.value) : null
        })).filter(d => d.value !== null);
      }

      // 2. Obtener IRE servicios
      const servicesUrl = buildServicesUrl();
      const servicesProxy = `${PROXY_URL}${encodeURIComponent(servicesUrl)}`;
      const servicesRes = await fetch(servicesProxy, { signal: abortControllerRef.current.signal });
      if (!servicesRes.ok) throw new Error(`Services API error: ${servicesRes.status}`);
      const servicesJson = await servicesRes.json();

      let servicesData = [];
      if (servicesJson.included && servicesJson.included.length) {
        const values = servicesJson.included[0]?.attributes?.values || [];
        servicesData = values.map(v => ({
          date: v.datetime.substring(0, 10),
          value: v.value !== undefined && v.value !== null ? parseFloat(v.value) : null
        })).filter(d => d.value !== null);
      }

      if (industryData.length === 0 || servicesData.length === 0) {
        throw new Error('No se encontraron datos de IRE para el período seleccionado');
      }

      // Combinar por fecha (normalizar a base 100 para comparar resiliencia)
      const datesSet = new Set([...industryData.map(d => d.date), ...servicesData.map(d => d.date)]);
      const dates = Array.from(datesSet).sort();

      // Normalizar: el valor del 28 de abril como base 100 (punto de partida de la recuperación)
      const getNormalized = (data, baseDate = '2025-04-28') => {
        const baseItem = data.find(d => d.date === baseDate);
        if (!baseItem || baseItem.value === 0) return null;
        const baseValue = baseItem.value;
        const normalized = {};
        data.forEach(d => {
          normalized[d.date] = (d.value / baseValue) * 100;
        });
        return normalized;
      };

      const industryNorm = getNormalized(industryData);
      const servicesNorm = getNormalized(servicesData);

      if (!industryNorm || !servicesNorm) throw new Error('No se pudo normalizar los datos (falta base 28-A)');

      // Construir array de salida
      const combined = dates.map(date => ({
        date,
        industry: industryNorm[date] || null,
        services: servicesNorm[date] || null
      })).filter(d => d.industry !== null || d.services !== null);

      setChartData(combined);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching sectorial resilience data:', err);
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
        <span>Cargando índices de resiliencia sectorial...</span>
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

  const dates = chartData.map(d => d.date);
  const industryValues = chartData.map(d => d.industry);
  const servicesValues = chartData.map(d => d.services);

  const traceIndustry = {
    x: dates,
    y: industryValues,
    name: 'Industria (consumo pesado)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#ef4444', width: 2.5 },
    marker: { size: 6, color: '#ef4444' },
    hovertemplate: '<b>%{x}</b><br>Industria: %{y:.1f}%<extra></extra>'
  };

  const traceServices = {
    x: dates,
    y: servicesValues,
    name: 'Servicios / Residencial',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#06b6d4', width: 2.5 },
    marker: { size: 6, color: '#06b6d4' },
    hovertemplate: '<b>%{x}</b><br>Servicios: %{y:.1f}%<extra></extra>'
  };

  // Línea de referencia en 100 (nivel pre-colapso)
  const layout = {
    title: {
      text: 'Resiliencia sectorial: recuperación de la demanda (Base 100 = 28-A)',
      font: { size: 16, color: '#e0ddd5' }
    },
    xaxis: {
      title: 'Fecha',
      tickangle: -30,
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    yaxis: {
      title: 'Índice de demanda (base 100 = día del colapso)',
      gridcolor: 'rgba(255,255,255,0.1)',
      tickformat: ',.0f'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: 450,
    margin: { l: 80, r: 40, t: 80, b: 80 },
    legend: { orientation: 'h', y: -0.2 },
    shapes: [{
      type: 'line',
      x0: dates[0],
      x1: dates[dates.length - 1],
      y0: 100,
      y1: 100,
      line: { color: 'rgba(255,255,255,0.3)', width: 1, dash: 'dash' },
      annotation_text: 'Nivel pre-colapso'
    }]
  };

  return (
    <div style={{ padding: '1rem', background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)' }}>
      <PlotlyChart data={[traceIndustry, traceServices]} layout={layout} />
      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(160,155,140,0.7)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
        <p>📈 <strong>Resiliencia asimétrica:</strong> El sector servicios/residencial recuperó la demanda más rápidamente, mientras que la industria pesada (electrointensiva) fue reconectada de forma más lenta por razones de estabilidad de red, priorizando cargas críticas.</p>
        <p>ℹ️ Datos: Índice de Red Eléctrica (IRE) por sector desde REData. Normalizado a base 100 el día del colapso (28 de abril de 2025).</p>
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

export default function SectorialResilienceChart() {
  return (
    <BrowserOnly fallback={<div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando componente...</div>}>
      {() => (
        <SectorialResilienceChartInner />
      )}
    </BrowserOnly>
  );
}
