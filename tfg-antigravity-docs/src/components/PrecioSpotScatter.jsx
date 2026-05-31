/**
 * PrecioSpotScatter.jsx
 * Precio SPOT vs Demanda — scatter con trayectoria 28-A y punto actual.
 * Datos en tiempo real: /api/esios-multi (ESIOS/REE, refresco 5 min)
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATOS — punto de colapso verificado:
 *    Demanda en el colapso: 25.184 MW (Comité de Análisis, p.38) ✅
 *    Precio SPOT en el colapso: −2,5 €/MWh — ESTIMACIÓN.
 *    El precio negativo en la mañana del 28-A está documentado
 *    cualitativamente (~5,79 €/MWh a las 12:30 según datos08b),
 *    pero el valor exacto en el instante del colapso no está en
 *    fuente primaria disponible. Se mantiene como estimación visual.
 *
 * 2. DATOS — trayectoria histórica 28-A marcada como estimación:
 *    Los puntos horarios de la nube son interpolaciones plausibles
 *    basadas en el perfil típico de un día solar de primavera con
 *    alta penetración FV. No son datos OMIE verificados hora a hora.
 *    Se indica explícitamente en el footer.
 *
 * 3. Plotly SE MANTIENE para el scatter:
 *    El zoom/pan interactivo del scatter y el hover detallado
 *    justifican Plotly en este caso específico.
 *    webpackChunkName para lazy loading correcto.
 *
 * 4. La lógica de comparación 28-A vs ahora con ESIOS
 *    permanece INTACTA.
 *
 * 5. Banner de fallback si la API falla.
 *
 * 6. Nota de estimación visible en el footer.
 */
import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Trayectoria horaria 28-A (00:00 → 12:33 CEST)
// [demanda_MW, precio_SPOT_EUR/MWh]
// ESTIMACIÓN: interpolación basada en perfil solar típico + datos cualitativos
// No son datos OMIE verificados hora a hora — se declara como estimación
const HISTORICAL_28A = [
  [22400, 38],  [21800, 32],  [21200, 28],  [20800, 22],
  [20600, 18],  [21000, 15],  [22400, 10],  [24200, 5],
  [25900, 2],   [27100, -1],  [27800, -2],
  [25184, -2.5], // punto de colapso — demanda verificada (Comité p.38), precio estimado
];

function PrecioSpotScatterInner() {
  const [Plot,       setPlot]      = useState(null);
  const [data,       setData]      = useState(null);
  const [loading,    setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [apiError,   setApiError]  = useState(false);

  useEffect(() => {
    import(/* webpackChunkName: "plotly-scatter" */ 'react-plotly.js')
      .then(m => setPlot(() => m.default));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/esios-multi');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setLastUpdate(new Date());
      setApiError(false);
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  if (!Plot || loading) {
    return (
      <div style={S.loading} aria-busy="true" aria-live="polite">
        Cargando precio SPOT…
      </div>
    );
  }

  const demandaHoy = data?.demanda     ?? null;
  const precioHoy  = data?.precio_spot  ?? null;
  const renovHoy   = data?.penetracion_renovable ?? null;

  const traces = [
    // Trayectoria histórica 28-A
    {
      x: HISTORICAL_28A.map(p => p[0]),
      y: HISTORICAL_28A.map(p => p[1]),
      mode: 'markers+lines',
      type: 'scatter',
      name: '28-A (00:00 → colapso) — estimación',
      marker: { color: '#ef4444', size: 7, opacity: 0.6,
                line: { color: '#ef4444', width: 1 } },
      line: { color: '#ef4444', width: 1.5, dash: 'dot' },
      hovertemplate: 'Demanda: %{x:.0f} MW<br>Precio: %{y:.2f} €/MWh<extra>28-A (estimación)</extra>',
    },
    // Punto del colapso (demanda verificada, precio estimado)
    {
      x: [25184],
      y: [-2.5],
      mode: 'markers',
      type: 'scatter',
      name: 'Colapso 12:33 CEST',
      marker: { color: '#dc2626', size: 14, symbol: 'x',
                line: { color: '#fff', width: 2 } },
      hovertemplate: 'COLAPSO (12:33 CEST)<br>Demanda: 25.184 MW ✓ verificado<br>Precio: −2,5 €/MWh ⚠ estimado<extra></extra>',
    },
  ];

  // Punto actual si API disponible
  if (demandaHoy !== null && precioHoy !== null) {
    const penColor = renovHoy > 80 ? '#ef4444' : renovHoy > 60 ? '#f59e0b' : '#10b981';
    traces.push({
      x: [demandaHoy],
      y: [precioHoy],
      mode: 'markers',
      type: 'scatter',
      name: `Ahora · ${lastUpdate?.toLocaleTimeString('es-ES') ?? '...'}`,
      marker: { color: penColor, size: 16, symbol: 'circle',
                line: { color: '#fff', width: 2 } },
      hovertemplate:
        `Demanda: ${demandaHoy.toFixed(0)} MW<br>` +
        `Precio: ${precioHoy.toFixed(2)} €/MWh<br>` +
        `Renovable: ${renovHoy?.toFixed(1) ?? '?'}%` +
        `<extra>AHORA</extra>`,
    });
  }

  const layout = {
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      title: 'Demanda (MW)',
      gridcolor: 'rgba(255,255,255,0.06)',
      color: '#a0a0b0',
      tickformat: ',.0f',
    },
    yaxis: {
      title: 'Precio SPOT (€/MWh)',
      gridcolor: 'rgba(255,255,255,0.06)',
      color: '#a0a0b0',
      zeroline: true,
      zerolinecolor: 'rgba(255,170,0,0.3)',
      zerolinewidth: 1.5,
    },
    legend: {
      orientation: 'h', y: -0.22,
      font: { color: '#a0a0b0', size: 11 },
    },
    margin: { t: 20, b: 80, l: 70, r: 20 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 380,
    shapes: [{
      type: 'rect', x0: 18000, x1: 30000, y0: -15, y1: 0,
      fillcolor: 'rgba(239,68,68,0.04)', line: { width: 0 },
    }],
    annotations: [{
      x: 24000, y: -9,
      text: 'Zona precio negativo (exceso renovable)',
      showarrow: false,
      font: { size: 10, color: 'rgba(239,68,68,0.45)' },
    }],
  };

  return (
    <div style={S.wrapper}>

      {apiError && (
        <div style={S.apiWarning} aria-live="polite">
          ⚠ API ESIOS no disponible — solo se muestra la trayectoria histórica del 28-A
        </div>
      )}

      <div
        role="img"
        aria-label="Scatter de precio SPOT vs demanda. Trayectoria del 28-A en rojo, punto actual en cian o ámbar según penetración renovable."
      >
        <Plot
          data={traces}
          layout={layout}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      </div>

      {/* Chips solo si hay datos en tiempo real */}
      {demandaHoy && precioHoy && (
        <div style={S.row}>
          <Chip
            label="Precio SPOT actual"
            value={`${precioHoy.toFixed(2)} €/MWh`}
            color={precioHoy < 0 ? '#ef4444' : precioHoy < 20 ? '#f59e0b' : '#10b981'}
          />
          <Chip
            label="Demanda actual"
            value={`${(demandaHoy / 1000).toFixed(1)} GW`}
            color="#06b6d4"
          />
          {renovHoy && (
            <Chip
              label="% Renovable"
              value={`${renovHoy.toFixed(1)}%`}
              color={renovHoy > 80 ? '#ef4444' : renovHoy > 60 ? '#f59e0b' : '#10b981'}
            />
          )}
        </div>
      )}

      <p style={S.note}>
        El 28-A el precio SPOT cayó a valores mínimos por la sobreproducción renovable
        (media matutina ~5,79 €/MWh antes del colapso, con tramos negativos registrados).
        El precio negativo es señal de estrés sistémico: el sistema paga para que alguien
        consuma energía. La trayectoria roja es una{' '}
        <strong style={{ color: '#f59e0b' }}>estimación</strong> del perfil horario 28-A
        basada en datos cualitativos — los datos OMIE verificados hora a hora no están
        disponibles en fuente primaria consultada.
      </p>

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠ Sin datos en tiempo real'}
        {' · '}Demanda 28-A verificada: Comité de Análisis del Gobierno, p.38.
      </p>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 150,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}44`,
      borderRadius: 8, padding: '0.6rem 1rem', textAlign: 'center',
    }}>
      <span style={{
        display: 'block', fontSize: '0.6rem', color: '#a0a0b0',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: '0.2rem', fontFamily: 'monospace',
      }}>
        {label}
      </span>
      <span style={{ fontSize: '1rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

const S = {
  wrapper:    { background: 'transparent', padding: '1rem 0' },
  row:        { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
  note:       { marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(160,155,140,0.7)', borderLeft: '3px solid rgba(255,170,0,0.3)', padding: '0.5rem 1rem', lineHeight: 1.6 },
  apiWarning: { marginBottom: '0.75rem', padding: '0.4rem 0.9rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, fontSize: 11, color: '#f59e0b', fontFamily: 'monospace' },
  loading:    { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' },
  caption:    { marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: 'monospace' },
};

export default function PrecioSpotScatter() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>Cargando…</div>}>
      {() => <PrecioSpotScatterInner />}
    </BrowserOnly>
  );
}
