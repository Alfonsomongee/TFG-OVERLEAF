/**
 * ThermalAdjustmentCostMatrix.jsx
 * Matriz termográfica de costes de servicios de ajuste (€/MWh).
 * Período: 26 abril – 2 mayo 2025 (semana del colapso del 28-A).
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATOS — fallback determinista:
 *    La versión anterior usaba Math.random() en el fallback, produciendo
 *    valores distintos en cada render (rompe hidratación React + engaña
 *    al lector con datos que cambian solos).
 *    Sustituido por un generador LCG con semilla (mismo algoritmo que
 *    SynchrophasorPlot) — los valores son siempre los mismos, reproducibles
 *    y coherentes con las fuentes primarias disponibles.
 *
 * 2. DATOS — valores verificados en fuente primaria:
 *    Los valores de pico del 28-A (11:00–15:00 CEST) son estimaciones
 *    marcadas explícitamente como tales. Solo el coste total está verificado:
 *    - Operación Reforzada 2025: 666 M€ hasta 31 mar 2026 (REE, abr 2026)
 *    - Costes servicios ajuste 2025: +43% respecto a 2024 (ISE-2025 REE)
 *    Los valores horarios individuales son CUESTIÓN ABIERTA (no en fuente
 *    primaria disponible). El footer lo indica explícitamente.
 *
 * 3. RENDIMIENTO — Plotly lazy correcto:
 *    La versión anterior declaraba `let PlotlyChart = null` como variable
 *    de módulo (anti-patrón). Ahora el import dinámico está dentro del
 *    componente con useState + useEffect (patrón correcto SSR-safe).
 *    JUSTIFICACIÓN para mantener Plotly: el heatmap 2D con escala de color
 *    continua (Magma) no tiene equivalente en Recharts sin D3 completo.
 *    Para este componente específico, Plotly es la herramienta correcta.
 *
 * 4. UX — selector de servicio:
 *    Botones para mostrar uno o todos los servicios de ajuste.
 *    Reduce el ruido visual cuando solo interesa un servicio.
 *
 * 5. UX — exportación CSV:
 *    Botón para descargar los datos de la matriz como CSV.
 *
 * 6. ACCESIBILIDAD:
 *    role="img" + aria-label descriptivo en el contenedor del heatmap.
 *    Skeleton con aria-busy durante la carga.
 *
 * DATO CLAVE VERIFICADO (usar en el footer y en el tooltip):
 *   Coste Operación Reforzada: 666 M€ (REE, informe abril 2026)
 *   Incremento servicios ajuste 2025 vs 2024: +43% (ISE-2025 REE)
 *   Restricciones técnicas 2025: 3.351–3.770 M€ (ISE-2025 REE)
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';

const PROXY_URL  = '/api/redata-proxy?url=';
const START_DATE = '2025-04-26T00:00';
const END_DATE   = '2025-05-02T23:59';

// ─── LCG determinista (mismo algoritmo que SynchrophasorPlot) ────────────────
function lcg(seed) {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Fallback determinista basado en rangos verificados ───────────────────────
/**
 * Rangos de referencia (fuente: ISE-2025 REE / REE informes 2025-2026):
 *   Pre-28A (26-27 abr):  media ~9 €/MWh de coste de ajuste total
 *   28-A pico (11-15h):   estimado ~50-60 €/MWh restricciones (CUESTIÓN ABIERTA)
 *   28-A noche:           ~22 €/MWh (inicio Operación Reforzada)
 *   Post-28A (29 abr-):   ~26,2 €/MWh media de la Operación Reforzada
 *
 * Los valores individuales son estimaciones coherentes con los rangos
 * verificados. No proceden de datos horarios de fuente primaria.
 */
function buildFallbackData(isEs) {
  const timePoints = [];
  const current = new Date('2025-04-26T00:00:00Z');
  for (let i = 0; i < 168; i++) {
    timePoints.push(current.toISOString().slice(0, 16).replace('T', ' '));
    current.setTime(current.getTime() + 3_600_000);
  }

  const SERVICES = [
    { name: isEs ? 'Restricciones Técnicas PBF' : 'PBF Technical Constraints', baseMultiplier: 1.0 },
    { name: isEs ? 'Reserva Secundaria (aFRR)' : 'Secondary Reserve (aFRR)',  baseMultiplier: 0.42 },
    { name: isEs ? 'Gestión de Desvíos' : 'Imbalance Management',        baseMultiplier: 0.18 },
  ];

  const matrix = SERVICES.map(({ baseMultiplier }, sIdx) => {
    const rand = lcg(42 + sIdx * 1000); // semilla distinta por servicio
    return timePoints.map((tp, tIdx) => {
      const hour = parseInt(tp.slice(11, 13), 10);
      const day  = tp.slice(0,  10);
      const r    = rand() * 0.3; // ruido ±15% determinista

      const isPre = day === '2025-04-26' || day === '2025-04-27';
      const is28A = day === '2025-04-28';

      if (isPre) {
        // Media ~9 €/MWh repartida por servicio
        return parseFloat(((9.0 * baseMultiplier) * (1 + r - 0.15)).toFixed(2));
      }
      if (is28A) {
        if (hour >= 12 && hour <= 15) {
          // Pico del colapso — estimación (CUESTIÓN ABIERTA)
          return parseFloat(((55.0 * baseMultiplier) * (1 + r - 0.15)).toFixed(2));
        }
        if (hour > 15) {
          // Inicio Operación Reforzada (~22 €/MWh total)
          return parseFloat(((22.0 * baseMultiplier) * (1 + r - 0.15)).toFixed(2));
        }
        return parseFloat(((9.0 * baseMultiplier) * (1 + r - 0.15)).toFixed(2));
      }
      // Post-28A: Operación Reforzada (~26 €/MWh total verificado)
      return parseFloat(((26.2 * baseMultiplier) * (1 + r - 0.15)).toFixed(2));
    });
  });

  return {
    z:    matrix,
    x:    timePoints,
    y:    SERVICES.map(s => s.name),
    isFallback: true,
  };
}

// ─── Construcción de URL ESIOS ────────────────────────────────────────────────
function buildREDataUrl() {
  const base = 'https://apidatos.ree.es/es/datos/mercados/coste-servicios-ajuste';
  return `${base}?${new URLSearchParams({
    start_date: START_DATE, end_date: END_DATE,
    time_trunc: 'hour', geo_trunc: 'electric_system',
    geo_limit: 'peninsular', geo_ids: '8741',
  })}`;
}

// ─── Exportar CSV ─────────────────────────────────────────────────────────────
function exportCSV(data, isEs) {
  const header = [
    isEs ? 'Servicio' : 'Service', 
    isEs ? 'Fecha/Hora' : 'Date/Time', 
    isEs ? 'Coste (€/MWh)' : 'Cost (€/MWh)'
  ].join(',');
  const rows   = [];
  data.y.forEach((service, si) => {
    data.x.forEach((time, ti) => {
      rows.push([`"${service}"`, `"${time}"`, data.z[si][ti]].join(','));
    });
  });
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'costes-ajuste-28A.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Componente interno ───────────────────────────────────────────────────────
function ThermalAdjustmentCostMatrixInner() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',
    panelBg: '#071326',
    cardBg: 'rgba(16, 29, 53, 0.72)',
    cardBorder: 'rgba(226, 232, 240, 0.14)',
    grid: 'rgba(244, 247, 251, 0.10)',
    axis: '#C7D2E3',
    warning: '#E6B45C',
    warningSoft: 'rgba(230, 180, 92, 0.11)',
    warningBorder: 'rgba(230, 180, 92, 0.34)',
    danger: '#D98798',
    dangerSoft: 'rgba(217, 135, 152, 0.10)',
    dangerBorder: 'rgba(217, 135, 152, 0.42)',
    active: '#7DCDE3',
    activeSoft: 'rgba(125, 205, 227, 0.12)',
    activeBorder: 'rgba(125, 205, 227, 0.42)',
    buttonBorder: 'rgba(226, 232, 240, 0.16)',
    noteBg: 'rgba(16, 29, 53, 0.56)',
    heatmapScale: [
      [0.00, '#101D35'],
      [0.25, '#5E7FA8'],
      [0.50, '#E6B45C'],
      [0.75, '#D48A4A'],
      [1.00, '#D98798'],
    ],
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',
    panelBg: '#F6F0E3',
    cardBg: 'rgba(255, 252, 245, 0.78)',
    cardBorder: 'rgba(25, 24, 20, 0.14)',
    grid: 'rgba(25, 24, 20, 0.10)',
    axis: '#7A7062',
    warning: '#A96000',
    warningSoft: 'rgba(169, 96, 0, 0.10)',
    warningBorder: 'rgba(169, 96, 0, 0.30)',
    danger: '#A13D36',
    dangerSoft: 'rgba(161, 61, 54, 0.08)',
    dangerBorder: 'rgba(161, 61, 54, 0.36)',
    active: '#1F6F78',
    activeSoft: 'rgba(31, 111, 120, 0.10)',
    activeBorder: 'rgba(31, 111, 120, 0.36)',
    buttonBorder: 'rgba(25, 24, 20, 0.16)',
    noteBg: 'rgba(255, 252, 245, 0.58)',
    heatmapScale: [
      [0.00, '#FFFCF5'],
      [0.25, '#DDE8C5'],
      [0.50, '#D9A441'],
      [0.75, '#A96000'],
      [1.00, '#A13D36'],
    ],
  };

  const [plotData,     setPlotData]     = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isFallback,   setIsFallback]   = useState(false);
  const [Plot,         setPlot]         = useState(null);
  const [activeService, setActiveService] = useState('all'); // 'all' | índice
  const abortRef = useRef(null);

  // Cargar Plotly dinámicamente (lazy, SSR-safe)
  useEffect(() => {
    import(/* webpackChunkName: "plotly-heatmap" */ 'react-plotly.js')
      .then(mod => setPlot(() => mod.default));
  }, []);

  // Fetch de datos
  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    try {
      const url   = `${PROXY_URL}${encodeURIComponent(buildREDataUrl())}`;
      const res   = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json  = await res.json();

      const included = json.included || [];
      if (!included.length) throw new Error('Sin datos ESIOS');

      const categories = [];
      const timePoints = [];
      const matrix     = [];

      included.forEach((ind, idx) => {
        const title  = ind.attributes.title;
        const values = ind.attributes.values || [];
        if (!categories.includes(title)) {
          categories.push(title);
          matrix.push([]);
        }
        const ci = categories.indexOf(title);
        values.forEach((pt, pi) => {
          const dt = pt.datetime.slice(0, 16).replace('T', ' ');
          if (idx === 0) timePoints.push(dt);
          matrix[ci][pi] = pt.value != null ? parseFloat(pt.value) : 0;
        });
      });

      setPlotData({ z: matrix, x: timePoints, y: categories, isFallback: false });
      setIsFallback(false);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setPlotData(buildFallbackData(isEs));
        setIsFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [fetchData]);

  // Datos filtrados según servicio activo
  const displayData = useMemo(() => {
    if (!plotData) return null;
    if (activeService === 'all') return plotData;
    const idx = parseInt(activeService, 10);
    return {
      ...plotData,
      z: [plotData.z[idx]],
      y: [plotData.y[idx]],
    };
  }, [plotData, activeService]);

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading || !Plot) {
    return (
      <div
        style={{ height: 500, display: 'flex', alignItems: 'center',
                 justifyContent: 'center', color: colors.textMuted,
                 fontFamily: 'monospace', fontSize: 13 }}
        aria-busy="true"
        aria-live="polite"
      >
        {loading 
          ? (isEs ? 'Cargando matriz de costes…' : 'Loading cost matrix…') 
          : (isEs ? 'Inicializando visualización…' : 'Initializing visualization…')}
      </div>
    );
  }

  if (!displayData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: colors.danger }}>
        {isEs ? 'No hay datos disponibles.' : 'No data available.'}
        <button onClick={fetchData} style={{ marginLeft: '1rem', padding: '0.4rem 0.9rem', cursor: 'pointer' }}>
          {isEs ? 'Reintentar' : 'Retry'}
        </button>
      </div>
    );
  }

  // ── Configuración Plotly ──────────────────────────────────────────────────
  const heatmapTrace = {
    z:          displayData.z,
    x:          displayData.x,
    y:          displayData.y,
    type:       'heatmap',
    colorscale: colors.heatmapScale,
    reversescale: false,
    showscale:  true,
    colorbar: {
      title:       '€/MWh',
      thickness:   18,
      tickformat:  ',.0f',
      titlefont:   { color: colors.textSecondary, size: 12 },
      tickfont:    { color: colors.textSecondary },
    },
    hovertemplate: '<b>%{y}</b><br>%{x}<br><b>%{z:.2f} €/MWh</b><extra></extra>',
    // Anotación visual del 28-A
    zmin: 0,
    zmax: 60,
  };

  const layout = {
    title: {
      text: isEs ? 'Costes de Servicios de Ajuste — Semana del 28-A (€/MWh)' : 'Adjustment Services Costs — April 28 Week (€/MWh)',
      font: { size: 15, color: colors.textPrimary },
    },
    xaxis: {
      title: isEs ? 'Fecha y hora (CEST)' : 'Date and time (CEST)',
      tickangle: -45,
      tickformat: '%d/%m %Hh',
      gridcolor: colors.grid,
      linecolor: colors.grid,
      tickfont: { color: colors.axis, size: 10 },
      titlefont: { color: colors.axis, size: 11 },
    },
    yaxis: {
      automargin: true,
      gridcolor: colors.grid,
      linecolor: colors.grid,
      tickfont: { color: colors.axis, size: 11 },
    },
    // Anotación del 28-A
    shapes: [{
      type: 'rect',
      xref: 'x', yref: 'paper',
      x0: '2025-04-28 00:00', x1: '2025-04-29 00:00',
      y0: 0, y1: 1,
      fillcolor: colors.dangerSoft,
      line: { color: colors.dangerBorder, width: 1.5, dash: 'dot' },
    }],
    annotations: [{
      xref: 'x', yref: 'paper',
      x: '2025-04-28 13:00', y: 1.04,
      text: '⚡ 28-A',
      showarrow: false,
      font: { color: colors.danger, size: 11, family: 'monospace' },
    }],
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font:   { color: colors.textSecondary, family: 'Inter, sans-serif' },
    height: activeService === 'all' ? 520 : 280,
    margin: { l: 220, r: 40, t: 72, b: 120 },
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>

      {/* Banner de fallback */}
      {isFallback && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.5rem 1rem',
          background: colors.warningSoft,
          border: `1px solid ${colors.warningBorder}`,
          borderRadius: 6,
          fontSize: 12, fontFamily: 'monospace', color: colors.warning,
        }} aria-live="polite">
          {isEs 
            ? "⚠ API REData no disponible — datos estimados (fallback determinista). Los valores horarios son estimaciones coherentes con rangos verificados, no medidas directas de ESIOS. Ver nota metodológica."
            : "⚠ REData API unavailable — estimated data (deterministic fallback). Hourly values are estimates consistent with verified ranges, not direct ESIOS measurements. See methodological note."}
        </div>
      )}

      {/* Controles */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        {/* Selector de servicio */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}
             role="group" aria-label={isEs ? 'Filtrar por servicio de ajuste' : 'Filter by adjustment service'}>
          {[{ id: 'all', label: isEs ? 'Todos' : 'All' }, ...(plotData?.y || []).map((n, i) => ({
            id: String(i), label: n.split(' ').slice(0, 2).join(' '),
          }))].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveService(opt.id)}
              aria-pressed={activeService === opt.id}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: 20,
                border: `1px solid ${activeService === opt.id ? colors.activeBorder : colors.buttonBorder}`,
                background: activeService === opt.id ? colors.activeSoft : 'transparent',
                color:  activeService === opt.id ? colors.active : colors.textMuted,
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
                fontWeight: activeService === opt.id ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Exportar CSV */}
        <button
          onClick={() => exportCSV(plotData, isEs)}
          aria-label={isEs ? 'Descargar datos como CSV' : 'Download data as CSV'}
          style={{
            padding: '0.25rem 0.7rem',
            background: 'transparent',
            border: `1px solid ${colors.buttonBorder}`,
            borderRadius: 6, color: colors.textMuted,
            cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
          }}
        >
          ↓ CSV
        </button>
      </div>

      {/* Heatmap */}
      <div
        role="img"
        aria-label={isEs ? 'Mapa de calor de costes de servicios de ajuste eléctrico durante la semana del 28-A. El pico de costes se concentra el 28 de abril de 2025 entre las 12:00 y las 15:00 CEST.' : 'Heatmap of electrical adjustment service costs during the week of April 28. The cost peak is concentrated on April 28, 2025 between 12:00 and 15:00 CEST.'}
      >
        <Plot
          data={[heatmapTrace]}
          layout={layout}
          config={{
            responsive:     true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            toImageButtonOptions: {
              format:   'png',
              filename: 'costes-ajuste-28A',
              scale:    2,
            },
          }}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      {/* Footer metodológico */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem', color: colors.textSecondary,
        borderLeft: `3px solid ${colors.warningBorder}`,
        padding: '0.5rem 1rem', lineHeight: 1.65,
        background: colors.noteBg,
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{ margin: '0 0 0.4rem' }} dangerouslySetInnerHTML={{ __html: isEs 
          ? `<b>Costes verificados (ISE-2025 REE / REE informe abril 2026):</b> El coste total de servicios de ajuste en 2025 se incrementó un <b>+43% respecto a 2024</b>, con restricciones técnicas acumulando entre <b>3.351 y 3.770 M€</b> por el despacho forzoso de ciclos combinados ("Operación Reforzada"). El coste acumulado de la Operación Reforzada hasta el 31 de marzo de 2026 fue de <b>666 M€</b> (REE, informe abril 2026 — dato verificado). En marzo de 2026, las restricciones representaron el <b>28% del término de energía en la factura PVPC</b>.`
          : `<b>Verified costs (ISE-2025 REE / REE April 2026 report):</b> Total adjustment service costs in 2025 increased by <b>+43% compared to 2024</b>, with technical constraints accumulating between <b>3,351 and 3,770 M€</b> due to the forced dispatch of combined cycles ("Reinforced Operation"). The cumulative cost of the Reinforced Operation up to March 31, 2026 was <b>666 M€</b> (REE, April 2026 report — verified data). In March 2026, constraints represented <b>28% of the energy term in the PVPC bill</b>.`
        }} />
        <p style={{ margin: 0, fontSize: '0.72rem', color: colors.textMuted }}>
          {isFallback
            ? (isEs ? '⚠ Datos horarios: estimaciones deterministas coherentes con rangos ISE-2025 REE. No proceden de medidas directas ESIOS — los valores individuales son CUESTIÓN ABIERTA.' : '⚠ Hourly data: deterministic estimates consistent with ISE-2025 REE ranges. Not from direct ESIOS measurements — individual values are an OPEN QUESTION.')
            : (isEs ? 'Fuente: ESIOS / REE (Indicadores 680, 71-74, 638) · Período: 26 abr – 02 may 2025.' : 'Source: ESIOS / REE (Indicators 680, 71-74, 638) · Period: Apr 26 – May 02, 2025.')}
        </p>
      </div>
    </div>
  );
}

export default function ThermalAdjustmentCostMatrix() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  return (
    <BrowserOnly fallback={
      <div style={{
        minHeight: 500, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#6B6255',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {isEs ? 'Inicializando matriz termográfica…' : 'Initializing thermographic matrix…'}
      </div>
    }>
      {() => <ThermalAdjustmentCostMatrixInner />}
    </BrowserOnly>
  );
}
