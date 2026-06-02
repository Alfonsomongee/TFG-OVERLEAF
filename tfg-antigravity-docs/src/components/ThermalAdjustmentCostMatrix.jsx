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
import Translate, { translate } from '@docusaurus/Translate';

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
function buildFallbackData() {
  const timePoints = [];
  const current = new Date('2025-04-26T00:00:00Z');
  for (let i = 0; i < 168; i++) {
    timePoints.push(current.toISOString().slice(0, 16).replace('T', ' '));
    current.setTime(current.getTime() + 3_600_000);
  }

  const SERVICES = [
    { name: 'Restricciones Técnicas PBF', baseMultiplier: 1.0 },
    { name: 'Reserva Secundaria (aFRR)',  baseMultiplier: 0.42 },
    { name: 'Gestión de Desvíos',        baseMultiplier: 0.18 },
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
function exportCSV(data) {
  const header = ['Servicio', 'Fecha/Hora', 'Coste (€/MWh)'].join(',');
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
        setPlotData(buildFallbackData());
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
                 justifyContent: 'center', color: 'var(--text-1, #64748b)',
                 fontFamily: 'monospace', fontSize: 13 }}
        aria-busy="true"
        aria-live="polite"
      >
        {loading ? translate({id: 'thermal.loading', message: 'Cargando matriz de costes…'}) : translate({id: 'thermal.init', message: 'Inicializando visualización…'})}
      </div>
    );
  }

  if (!displayData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
        {translate({id: 'thermal.noData', message: 'No hay datos disponibles.'})}
        <button onClick={fetchData} style={{ marginLeft: '1rem', padding: '0.4rem 0.9rem', cursor: 'pointer' }}>
          {translate({id: 'thermal.retry', message: 'Reintentar'})}
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
    colorscale: 'Magma',
    reversescale: false,
    showscale:  true,
    colorbar: {
      title:       '€/MWh',
      thickness:   18,
      tickformat:  ',.0f',
      titlefont:   { color: '#94a3b8', size: 12 },
      tickfont:    { color: '#94a3b8' },
    },
    hovertemplate: '<b>%{y}</b><br>%{x}<br><b>%{z:.2f} €/MWh</b><extra></extra>',
    // Anotación visual del 28-A
    zmin: 0,
    zmax: 60,
  };

  const layout = {
    title: {
      text: translate({id: 'thermal.title', message: 'Costes de Servicios de Ajuste — Semana del 28-A (€/MWh)'}),
      font: { size: 15, color: '#e0ddd5' },
    },
    xaxis: {
      title: translate({id: 'thermal.xaxis', message: 'Fecha y hora (CEST)'}),
      tickangle: -45,
      tickformat: '%d/%m %Hh',
      gridcolor: 'rgba(255,255,255,0.07)',
      tickfont: { color: 'var(--text-1, #64748b)', size: 10 },
    },
    yaxis: {
      automargin: true,
      gridcolor: 'rgba(255,255,255,0.07)',
      tickfont: { color: '#94a3b8', size: 11 },
    },
    // Anotación del 28-A
    shapes: [{
      type: 'rect',
      xref: 'x', yref: 'paper',
      x0: '2025-04-28 00:00', x1: '2025-04-29 00:00',
      y0: 0, y1: 1,
      fillcolor: 'rgba(239,68,68,0.06)',
      line: { color: 'rgba(239,68,68,0.4)', width: 1.5, dash: 'dot' },
    }],
    annotations: [{
      xref: 'x', yref: 'paper',
      x: '2025-04-28 13:00', y: 1.04,
      text: '⚡ 28-A',
      showarrow: false,
      font: { color: '#ef4444', size: 11, family: 'monospace' },
    }],
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font:   { color: '#a0a0b0', family: 'Inter, sans-serif' },
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
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 6,
          fontSize: 12, fontFamily: 'monospace', color: '#f59e0b',
        }} aria-live="polite">
          <Translate id="thermal.fallbackBanner">
            ⚠ API REData no disponible — datos estimados (fallback determinista). Los valores horarios son estimaciones coherentes con rangos verificados, no medidas directas de ESIOS. Ver nota metodológica.
          </Translate>
        </div>
      )}

      {/* Controles */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        {/* Selector de servicio */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}
             role="group" aria-label={translate({id: 'thermal.filterService', message: 'Filtrar por servicio de ajuste'})}>
          {[{ id: 'all', label: translate({id: 'thermal.all', message: 'Todos'}) }, ...(plotData?.y || []).map((n, i) => ({
            id: String(i), label: n.split(' ').slice(0, 2).join(' '),
          }))].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveService(opt.id)}
              aria-pressed={activeService === opt.id}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: 20,
                border: `1px solid ${activeService === opt.id ? '#00d9ff' : 'rgba(255,255,255,0.1)'}`,
                background: activeService === opt.id ? 'rgba(0,217,255,0.12)' : 'transparent',
                color:  activeService === opt.id ? '#00d9ff' : 'var(--text-1, #64748b)',
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
          onClick={() => exportCSV(plotData)}
          aria-label={translate({id: 'thermal.downloadCSV', message: 'Descargar datos como CSV'})}
          style={{
            padding: '0.25rem 0.7rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, color: 'var(--text-1, #64748b)',
            cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
          }}
        >
          ↓ CSV
        </button>
      </div>

      {/* Heatmap */}
      <div
        role="img"
        aria-label={translate({id: 'thermal.heatmapAria', message: 'Mapa de calor de costes de servicios de ajuste eléctrico durante la semana del 28-A. El pico de costes se concentra el 28 de abril de 2025 entre las 12:00 y las 15:00 CEST.'})}
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
        fontSize: '0.8rem', color: 'rgba(160,155,140,0.75)',
        borderLeft: '3px solid rgba(255,170,0,0.35)',
        padding: '0.5rem 1rem', lineHeight: 1.65,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{ margin: '0 0 0.4rem' }}>
          <Translate id="thermal.footerText" values={{ b: (chunks) => <strong>{chunks}</strong> }}>
            {`<b>Costes verificados (ISE-2025 REE / REE informe abril 2026):</b> El coste total de servicios de ajuste en 2025 se incrementó un <b>+43% respecto a 2024</b>, con restricciones técnicas acumulando entre <b>3.351 y 3.770 M€</b> por el despacho forzoso de ciclos combinados (\"Operación Reforzada\"). El coste acumulado de la Operación Reforzada hasta el 31 de marzo de 2026 fue de <b>666 M€</b> (REE, informe abril 2026 — dato verificado). En marzo de 2026, las restricciones representaron el <b>28% del término de energía en la factura PVPC</b>.`}
          </Translate>
        </p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(160,155,140,0.5)' }}>
          {isFallback
            ? translate({id: 'thermal.footerFallback', message: '⚠ Datos horarios: estimaciones deterministas coherentes con rangos ISE-2025 REE. No proceden de medidas directas ESIOS — los valores individuales son CUESTIÓN ABIERTA.'})
            : translate({id: 'thermal.footerSource', message: 'Fuente: ESIOS / REE (Indicadores 680, 71-74, 638) · Período: 26 abr – 02 may 2025.'})}
        </p>
      </div>
    </div>
  );
}

export default function ThermalAdjustmentCostMatrix() {
  return (
    <BrowserOnly fallback={
      <div style={{
        minHeight: 500, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-1, #64748b)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        Inicializando matriz termográfica…
      </div>
    }>
      {() => <ThermalAdjustmentCostMatrixInner />}
    </BrowserOnly>
  );
}
