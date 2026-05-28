// src/components/MixGeneracion.jsx
// Mix de generación "Ahora vs 28-A" — donut charts comparativos
// SSR-safe: BrowserOnly + dynamic Plotly import
// Mejoras: skeleton loader, abort controller, responsive, hook personalizado, memo, tooltip, freshness indicator, pause toggle, blackout JSON, transiciones suaves

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ----------------------------------------------
// Hook personalizado para datos ESIOS
// ----------------------------------------------
function useEsiosData(intervalMs = 300000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (signal) => {
    try {
      const res = await fetch('/api/esios-multi', { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.renovable_total !== undefined && json.no_renovable !== undefined) {
        json.penetracion_renovable = (json.renovable_total / (json.renovable_total + json.no_renovable)) * 100;
      }
      setData(json);
      setError(false);
      setLastUpdate(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('ESIOS fetch error:', err);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);
  }, [fetchData]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);

    intervalRef.current = setInterval(() => {
      abortControllerRef.current = new AbortController();
      fetchData(abortControllerRef.current.signal);
    }, intervalMs);

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, intervalMs]);

  return { data, loading, error, lastUpdate, retry };
}

// ----------------------------------------------
// Componente interno con toda la lógica y UI
// ----------------------------------------------
function MixGeneracionInner() {
  const { data, loading, error, lastUpdate, retry } = useEsiosData(300000);
  const [pause, setPause] = useState(false);
  const [blackout, setBlackout] = useState(null);
  const [blackoutLoading, setBlackoutLoading] = useState(true);
  const [Plot, setPlot] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Inyectar keyframes de pulso (solo client-side, dentro del componente)
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mix-generacion-pulse';
    if (!document.getElementById('mix-generacion-pulse')) {
      styleSheet.textContent = `
        @keyframes mix-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
    return () => {
      const el = document.getElementById('mix-generacion-pulse');
      if (el) el.remove();
    };
  }, []);

  // Cargar Plotly dinámicamente
  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  // Cargar datos históricos del 28-A desde JSON
  useEffect(() => {
    fetch('/data/blackout_snapshot_28A.json')
      .then(res => res.json())
      .then(json => {
        setBlackout(json);
        setBlackoutLoading(false);
      })
      .catch(err => {
        console.error('Error loading blackout data:', err);
        setBlackoutLoading(false);
      });
  }, []);

  // Detectar tamaño de pantalla para responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const COLORS = ['#f59e0b', '#06b6d4', '#ef4444', '#8b5cf6', '#10b981'];

  // Memoizar layouts
  const layout28A = useMemo(() => ({
    title: { text: '28 de abril de 2025 — Instante del colapso', font: { color: '#e0ddd5', size: 13 } },
    showlegend: false,
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, b: 10, l: 10, r: 10 },
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: isMobile ? 300 : 340,
  }), [isMobile]);

  const layoutHoy = useMemo(() => ({
    title: {
      text: `Ahora · ${lastUpdate ? lastUpdate.toLocaleTimeString('es-ES') : '...'}`,
      font: { color: '#e0ddd5', size: 13 },
    },
    showlegend: true,
    legend: { orientation: isMobile ? 'h' : 'v', font: { color: '#a0a0b0', size: 11 } },
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, b: 10, l: 10, r: 10 },
    font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
    height: isMobile ? 300 : 340,
  }), [lastUpdate, isMobile]);

  // Helper para traza base
  const traceBase = (values, labels) => ({
    values, labels, type: 'pie', hole: 0.45,
    marker: { colors: COLORS, line: { color: 'rgba(0,0,0,0.3)', width: 1 } },
    textfont: { color: '#fff', size: 11 },
    hovertemplate: '<b>%{label}</b><br>%{value:.0f} MW<br>%{percent}<extra></extra>',
  });

  // Construir objeto "hoy" a partir de data
  const hoy = data ? {
    Solar:          data.solar   ?? 0,
    Eólica:         data.eolica  ?? 0,
    Nuclear:        data.nuclear ?? 0,
    'C. Combinado': data.gas     ?? 0,
    Hidráulica:     (data.hidro > 0 ? data.hidro : 0),
  } : {};

  const hasValidData = data && Object.values(hoy).some(v => v > 0);
  const penetracionHoy = data?.penetracion_renovable ?? null;
  const delta = penetracionHoy !== null && blackout ? penetracionHoy - blackout.penetracion_renovable : null;

  // Datos históricos del 28-A
  const blackoutValues = blackout
    ? [blackout.solar, blackout.eolica, blackout.nuclear, blackout.gas, blackout.hidro > 0 ? blackout.hidro : 0]
    : [19155, 3540, 3870, 990, 2000];
  const blackoutLabels = ['Solar', 'Eólica', 'Nuclear', 'C. Combinado', 'Hidráulica'];

  const hoyValues = hasValidData ? Object.values(hoy) : blackoutValues;
  const hoyLabels = hasValidData ? Object.keys(hoy) : blackoutLabels;
  const showPartialWarning = data && !hasValidData;
  const gridStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' };

  // --- SKELETON ---
  if ((loading || blackoutLoading) && !data) {
    return (
      <div style={S.skeletonWrapper}>
        <div style={S.skeletonGrid}>
          <div style={{ ...S.skeletonDonut, animation: 'mix-pulse 1.5s infinite' }} />
          <div style={{ ...S.skeletonDonut, animation: 'mix-pulse 1.5s infinite' }} />
        </div>
        <div style={{ ...S.skeletonText, animation: 'mix-pulse 1.5s infinite' }} />
      </div>
    );
  }

  // --- ERROR ---
  if (error && !data) {
    return (
      <div style={S.errorBox}>
        <span>No se pudieron obtener datos de ESIOS</span>
        <button onClick={retry} style={S.retryBtn}>Reintentar</button>
      </div>
    );
  }

  if (!Plot || !blackout) return <div style={S.loading}>⟳ Cargando...</div>;

  return (
    <div style={S.wrapper}>
      <div style={gridStyle}>
        <div>
          <Plot
            data={[traceBase(blackoutValues, blackoutLabels)]}
            layout={layout28A}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
            revision={1}
          />
        </div>
        <div>
          <Plot
            data={[traceBase(hoyValues, hoyLabels)]}
            layout={layoutHoy}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
            revision={lastUpdate?.getTime()}
            transition={{ duration: 500 }}
          />
        </div>
      </div>

      {/* Métricas */}
      {penetracionHoy !== null && blackout && (
        <div style={S.metricRow}>
          <MetricPill
            label="Penetración renovable hoy"
            value={`${penetracionHoy.toFixed(1)}%`}
            tooltip="(Solar + Eólica + Hidráulica + Otras renovables) / Generación total × 100"
          />
          <MetricPill
            label="28-A (colapso)"
            value={`${blackout.penetracion_renovable.toFixed(1)}%`}
            accent="#ef4444"
          />
          <MetricPill
            label="Diferencia"
            value={`${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`}
            accent={Math.abs(delta) < 5 ? '#f59e0b' : delta > 0 ? '#ef4444' : '#10b981'}
          />
          <div style={S.toggleContainer}>
            <button onClick={() => setPause(!pause)} style={pause ? S.pauseBtnActive : S.pauseBtn}>
              {pause ? 'Reanudar' : 'Pausar'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={S.footer}>
        <span style={S.freshnessIndicator}>
          {lastUpdate && (new Date() - lastUpdate) < 360000 ? '● Datos frescos' : '● Datos desactualizados'}
        </span>
        <span style={S.caption}>
          {error
            ? 'Error en tiempo real — mostrando histórico 28-A'
            : showPartialWarning
              ? 'Datos parciales de ESIOS — algunos valores no disponibles'
              : lastUpdate
                ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE)`
                : 'Conectando con ESIOS...'}
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------
// MetricPill memoizado con tooltip
// ----------------------------------------------
const MetricPill = React.memo(({ label, value, accent = '#06b6d4', tooltip = '' }) => (
  <div style={{ ...S.pill, borderColor: accent + '44' }}>
    <span style={S.pillLabel}>
      {label}
      {tooltip && <span title={tooltip} style={S.infoIcon}> i</span>}
    </span>
    <span style={{ ...S.pillValue, color: accent }}>{value}</span>
  </div>
));

// ----------------------------------------------
// Estilos
// ----------------------------------------------
const S = {
  wrapper: { background: 'rgba(7,9,15,0.6)', borderRadius: '12px', border: '1px solid rgba(255,170,0,0.1)', padding: '1.5rem', fontFamily: "'Inter', sans-serif" },
  skeletonWrapper: { minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', background: 'rgba(7,9,15,0.6)', borderRadius: '12px', padding: '1.5rem' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' },
  skeletonDonut: { background: '#2a2a2e', borderRadius: '50%', width: '200px', height: '200px', margin: '0 auto' },
  skeletonText: { width: '80%', height: '20px', background: '#2a2a2e', margin: '0 auto', borderRadius: '4px' },
  errorBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', minHeight: '300px', color: '#ef4444', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', padding: '2rem', textAlign: 'center' },
  retryBtn: { background: '#ef4444', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  metricRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'center' },
  pill: { flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.03)', border: '1px solid', borderRadius: '8px', padding: '0.6rem 1rem', textAlign: 'center' },
  pillLabel: { display: 'block', fontSize: '0.62rem', color: '#a0a0b0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' },
  pillValue: { fontSize: '1.1rem', fontWeight: 700 },
  infoIcon: { cursor: 'help', fontSize: '0.65rem', marginLeft: '4px', color: '#a0a0b0', fontStyle: 'italic', fontFamily: 'Georgia, serif' },
  toggleContainer: { display: 'flex', alignItems: 'center' },
  pauseBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(6,182,212,0.4)', color: '#06b6d4', padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.06em', transition: '0.2s' },
  pauseBtnActive: { background: '#06b6d4', border: '1px solid #06b6d4', color: '#000', padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.06em' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' },
  freshnessIndicator: { fontSize: '0.68rem', color: '#10b981', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' },
  caption: { fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: "'JetBrains Mono', monospace" },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" },
};

// ----------------------------------------------
// Exportación principal con BrowserOnly
// ----------------------------------------------
export default function MixGeneracion() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>⟳ Cargando...</div>}>
      {() => <MixGeneracionInner />}
    </BrowserOnly>
  );
}
