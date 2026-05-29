// src/components/ThermalAdjustmentCostMatrix.jsx
// Matriz termográfica de costes de servicios de ajuste (REData)
// Mapa de calor horario de costes de restricciones técnicas, balance, etc.
// SSR-safe: usa BrowserOnly y carga dinámica de Plotly

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const PROXY_URL = '/api/redata-proxy?url=';

// Fechas de interés: 26/04/2025 al 02/05/2025 (semana del colapso)
const START_DATE = '2025-04-26T00:00';
const END_DATE = '2025-05-02T23:59';

// Construir URL de REData para costes de servicios de ajuste (hora, peninsular)
const buildREDataUrl = () => {
  const base = 'https://apidatos.ree.es/es/datos/mercados/coste-servicios-ajuste';
  const params = new URLSearchParams({
    start_date: START_DATE,
    end_date: END_DATE,
    time_trunc: 'hour',
    geo_trunc: 'electric_system',
    geo_limit: 'peninsular',
    geo_ids: '8741'
  });
  return `${base}?${params.toString()}`;
};

// Componente interno (solo cliente)
function ThermalAdjustmentCostMatrixInner() {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const redataUrl = buildREDataUrl();
      const proxyUrl = `${PROXY_URL}${encodeURIComponent(redataUrl)}`;
      const res = await fetch(proxyUrl, { signal: abortControllerRef.current.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();

      // Procesar la respuesta JSONAPI para extraer matriz de costes
      const included = json.included || [];
      if (included.length === 0) {
        throw new Error('No se encontraron datos de costes de ajuste');
      }

      // Extraer categorías y series temporales
      const categories = [];       // nombres de los servicios (y axis)
      const timePoints = [];       // timestamps (x axis)
      const costMatrix = [];       // matriz 2D: [categoria][timeIndex]

      included.forEach((indicator, idx) => {
        const title = indicator.attributes.title;
        const values = indicator.attributes.values || [];
        if (!categories.includes(title)) {
          categories.push(title);
          // Inicializar fila para esta categoría
          costMatrix.push(new Array(values.length).fill(null));
        }
        const catIndex = categories.indexOf(title);
        values.forEach((point, pointIdx) => {
          const dt = point.datetime.substring(0, 16).replace('T', ' ');
          if (idx === 0) {
            timePoints.push(dt);
          }
          const cost = point.value !== undefined && point.value !== null ? parseFloat(point.value) : null;
          // Asegurar que la matriz tenga la misma longitud en todas las filas
          if (!costMatrix[catIndex]) costMatrix[catIndex] = [];
          costMatrix[catIndex][pointIdx] = cost;
        });
      });

      // Limpiar valores nulos para el heatmap (sustituir por 0 y mostrar warning)
      const cleanedMatrix = costMatrix.map(row =>
        row.map(v => (v === null || isNaN(v) ? 0 : v))
      );

      setPlotData({
        z: cleanedMatrix,
        x: timePoints,
        y: categories
      });
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching REData:', err);
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
      <div className="skeleton-chart" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Cargando matriz de costes de ajuste...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
        ⚠️ Error: {error}
        <button onClick={fetchData} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!plotData || !plotData.z.length) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron datos de costes para el período seleccionado.</div>;
  }

  // Configuración del heatmap Plotly
  const heatmapTrace = {
    z: plotData.z,
    x: plotData.x,
    y: plotData.y,
    type: 'heatmap',
    colorscale: 'Magma',
    reversescale: false,
    showscale: true,
    colorbar: {
      title: 'Coste (€/MWh)',
      thickness: 20,
      tickformat: ',.0f'
    },
    hoverongaps: false,
    hovertemplate: '<b>%{y}</b><br>%{x}<br>Coste: %{z:.2f} €/MWh<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Matriz termográfica de costes de servicios de ajuste (€/MWh)',
      font: { size: 16, color: '#e0ddd5' }
    },
    xaxis: {
      title: 'Fecha y hora',
      tickangle: -45,
      tickformat: '%d/%m %H:%M',
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    yaxis: {
      title: 'Servicio de ajuste',
      automargin: true,
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: 600,
    margin: { l: 220, r: 40, t: 80, b: 120 }
  };

  return (
    <div style={{ padding: '1rem', background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)' }}>
      <PlotlyChart data={[heatmapTrace]} layout={layout} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)' }}>
        <span>🟢 Datos históricos inmutables · Actualización única</span>
        <span>Fuente: REData (REE) · Proxy con caché</span>
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
  if (!Plot) return <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando gráfica...</div>;
  return <Plot data={data} layout={layout} config={{ responsive: true, displayModeBar: true }} style={{ width: '100%', height: '100%' }} useResizeHandler />;
}

export default function ThermalAdjustmentCostMatrix() {
  return (
    <BrowserOnly fallback={<div style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando componente...</div>}>
      {() => (
        <ThermalAdjustmentCostMatrixInner />
      )}
    </BrowserOnly>
  );
}
