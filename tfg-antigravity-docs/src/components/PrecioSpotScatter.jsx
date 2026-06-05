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
import { useColorMode } from '@docusaurus/theme-common';

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    axis: '#C7D2E3',
    grid: 'rgba(244, 247, 251, 0.10)',
    axisLine: 'rgba(244, 247, 251, 0.24)',
    zeroLine: 'rgba(230, 180, 92, 0.34)',

    historical: '#D98798',
    historicalSoft: 'rgba(217, 135, 152, 0.34)',
    collapse: '#C8798A',
    collapseStroke: '#F4F7FB',

    current: '#7DCDE3',
    success: '#A6C67B',
    warning: '#E6B45C',
    danger: '#D98798',

    negativeZone: 'rgba(217, 135, 152, 0.08)',
    negativeZoneLabel: 'rgba(217, 135, 152, 0.78)',

    chipBg: 'rgba(16, 29, 53, 0.72)',
    chipBorder: 'rgba(226, 232, 240, 0.14)',
    chipLabel: '#91A4BC',

    warningSoft: 'rgba(230, 180, 92, 0.11)',
    warningBorder: 'rgba(230, 180, 92, 0.34)',

    noteText: '#C7D2E3',
    noteMuted: '#91A4BC',
    noteBg: 'rgba(16, 29, 53, 0.56)',

    tooltipBg: '#101D35',
    tooltipBorder: 'rgba(226, 232, 240, 0.16)',
    tooltipText: '#F4F7FB',
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    axis: '#7A7062',
    grid: 'rgba(25, 24, 20, 0.10)',
    axisLine: 'rgba(25, 24, 20, 0.22)',
    zeroLine: 'rgba(169, 96, 0, 0.34)',

    historical: '#A13D36',
    historicalSoft: 'rgba(161, 61, 54, 0.34)',
    collapse: '#7A263A',
    collapseStroke: '#FFFCF5',

    current: '#1F6F78',
    success: '#2F6B4F',
    warning: '#A96000',
    danger: '#A13D36',

    negativeZone: 'rgba(161, 61, 54, 0.06)',
    negativeZoneLabel: 'rgba(161, 61, 54, 0.78)',

    chipBg: 'rgba(255, 252, 245, 0.78)',
    chipBorder: 'rgba(25, 24, 20, 0.14)',
    chipLabel: '#8A7C6A',

    warningSoft: 'rgba(169, 96, 0, 0.10)',
    warningBorder: 'rgba(169, 96, 0, 0.30)',

    noteText: '#3C3830',
    noteMuted: '#6B6255',
    noteBg: 'rgba(255, 252, 245, 0.58)',

    tooltipBg: '#FFFCF5',
    tooltipBorder: 'rgba(25, 24, 20, 0.16)',
    tooltipText: '#191814',
  };

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
      <div style={{ ...S.loading, color: colors.textMuted }} aria-busy="true" aria-live="polite">
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
      marker: {
        color: colors.historical,
        size: 7,
        opacity: 0.68,
        line: { color: colors.historical, width: 1 },
      },
      line: { color: colors.historical, width: 1.5, dash: 'dot' },
      hoverlabel: {
        bgcolor: colors.tooltipBg,
        bordercolor: colors.tooltipBorder,
        font: { color: colors.tooltipText, family: 'Inter, sans-serif', size: 12 },
      },
      hovertemplate: 'Demanda: %{x:.0f} MW<br>Precio: %{y:.2f} €/MWh<extra>28-A (estimación)</extra>',
    },
    // Punto del colapso (demanda verificada, precio estimado)
    {
      x: [25184],
      y: [-2.5],
      mode: 'markers',
      type: 'scatter',
      name: 'Colapso 12:33 CEST',
      marker: {
        color: colors.collapse,
        size: 14,
        symbol: 'x',
        line: { color: colors.collapseStroke, width: 2 },
      },
      hoverlabel: {
        bgcolor: colors.tooltipBg,
        bordercolor: colors.tooltipBorder,
        font: { color: colors.tooltipText, family: 'Inter, sans-serif', size: 12 },
      },
      hovertemplate: 'COLAPSO (12:33 CEST)<br>Demanda: 25.184 MW ✓ verificado<br>Precio: −2,5 €/MWh ⚠ estimado<extra></extra>',
    },
  ];

  // Punto actual si API disponible
  if (demandaHoy !== null && precioHoy !== null) {
    const penColor = renovHoy > 80 ? colors.danger : renovHoy > 60 ? colors.warning : colors.success;
    traces.push({
      x: [demandaHoy],
      y: [precioHoy],
      mode: 'markers',
      type: 'scatter',
      name: `Ahora · ${lastUpdate?.toLocaleTimeString('es-ES') ?? '...'}`,
      marker: { color: penColor, size: 16, symbol: 'circle',
                line: { color: colors.collapseStroke, width: 2 } },
      hoverlabel: {
        bgcolor: colors.tooltipBg,
        bordercolor: colors.tooltipBorder,
        font: { color: colors.tooltipText, family: 'Inter, sans-serif', size: 12 },
      },
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
      gridcolor: colors.grid,
      linecolor: colors.axisLine,
      color: colors.axis,
      tickformat: ',.0f',
    },
    yaxis: {
      title: 'Precio SPOT (€/MWh)',
      gridcolor: colors.grid,
      linecolor: colors.axisLine,
      color: colors.axis,
      zeroline: true,
      zerolinecolor: colors.zeroLine,
      zerolinewidth: 1.5,
    },
    legend: {
      orientation: 'h', y: -0.22,
      font: { color: colors.textSecondary, size: 11 },
    },
    margin: { t: 20, b: 80, l: 70, r: 20 },
    font: { family: 'Inter, sans-serif', color: colors.textSecondary },
    height: 380,
    shapes: [{
      type: 'rect', x0: 18000, x1: 30000, y0: -15, y1: 0,
      fillcolor: colors.negativeZone, line: { width: 0 },
    }],
    annotations: [{
      x: 24000, y: -9,
      text: 'Zona precio negativo (exceso renovable)',
      showarrow: false,
      font: { size: 10, color: colors.negativeZoneLabel },
    }],
  };

  return (
    <div style={S.wrapper}>

      {apiError && (
        <div style={{
          ...S.apiWarning,
          background: colors.warningSoft,
          border: `1px solid ${colors.warningBorder}`,
          color: colors.warning,
        }} aria-live="polite">
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
            color={precioHoy < 0 ? colors.danger : precioHoy < 20 ? colors.warning : colors.success}
            colors={colors}
          />
          <Chip
            label="Demanda actual"
            value={`${(demandaHoy / 1000).toFixed(1)} GW`}
            color={colors.current}
            colors={colors}
          />
          {renovHoy && (
            <Chip
              label="% Renovable"
              value={`${renovHoy.toFixed(1)}%`}
              color={renovHoy > 80 ? colors.danger : renovHoy > 60 ? colors.warning : colors.success}
              colors={colors}
            />
          )}
        </div>
      )}

      <p style={{
        ...S.note,
        color: colors.noteText,
        borderLeft: `3px solid ${colors.warningBorder}`,
        background: colors.noteBg,
      }}>
        El 28-A el precio SPOT cayó a valores mínimos por la sobreproducción renovable
        (media matutina ~5,79 €/MWh antes del colapso, con tramos negativos registrados).
        El precio negativo es señal de estrés sistémico: el sistema paga para que alguien
        consuma energía. La trayectoria roja es una{' '}
        <strong style={{ color: colors.warning }}>estimación</strong> del perfil horario 28-A
        basada en datos cualitativos — los datos OMIE verificados hora a hora no están
        disponibles en fuente primaria consultada.
      </p>

      <p style={{ ...S.caption, color: colors.noteMuted }}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠ Sin datos en tiempo real'}
        {' · '}Demanda 28-A verificada: Comité de Análisis del Gobierno, p.38.
      </p>
    </div>
  );
}

function Chip({ label, value, color, colors }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 150,
      background: colors.chipBg,
      border: `1px solid ${colors.chipBorder}`,
      borderRadius: 8,
      padding: '0.6rem 1rem',
      textAlign: 'center',
    }}>
      <span style={{
        display: 'block', fontSize: '0.6rem', color: colors.chipLabel,
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
  note:       { marginTop: '1.25rem', fontSize: '0.8rem', color: '#6B6255', borderLeft: '3px solid rgba(169, 96, 0, 0.30)', padding: '0.5rem 1rem', lineHeight: 1.6 },
  apiWarning: { marginBottom: '0.75rem', padding: '0.4rem 0.9rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, fontSize: 11, color: '#f59e0b', fontFamily: 'monospace' },
  loading:    { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#6B6255', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' },
  caption:    { marginTop: '1.25rem', fontSize: '0.7rem', color: '#6B6255', letterSpacing: '0.04em', fontFamily: 'monospace' },
};

export default function PrecioSpotScatter() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>Cargando…</div>}>
      {() => <PrecioSpotScatterInner />}
    </BrowserOnly>
  );
}
