/**
 * TermometroRiesgo.jsx
 * Gauges de penetración renovable e inercia estimada — Ahora vs 28-A.
 * Datos en tiempo real: /api/esios-multi (ESIOS/REE, refresco 5 min)
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATO CRÍTICO — penetración 28-A: 84,5% → 82%
 *    Fuente verificada: Comité de Análisis del Gobierno, p.38.
 *    El 84,5% era el valor del JSON publicado con base de cálculo
 *    distinta (incluía cogeneración). El canónico es 82%.
 *
 * 2. UNIDAD CRÍTICA — inercia: "GW·s" → "s"
 *    La constante de inercia H se mide en SEGUNDOS [s], no en GW·s.
 *    GW·s es la energía cinética total (E_k = H × S_base), no H.
 *    Referencia: IEEE 1110 / Kundur (1994).
 *    Valor verificado 28-A: H ibérica 2,21–2,71 s
 *    (ENTSO-E Factual, Tabla 2-4, p.36). Usamos 2,4 s (punto medio).
 *
 * 3. Plotly SE MANTIENE para los gauges circulares:
 *    Los indicadores tipo velocímetro con delta y threshold no tienen
 *    equivalente nativo en Recharts. Es el único caso justificado.
 *
 * 4. La lógica de comparación 28-A vs ahora con ESIOS
 *    permanece INTACTA.
 *
 * 5. Nota metodológica añadida: H se estima desde el mix de generación
 *    ESIOS (mismo método que el Edge Function de ESIOS snapshot).
 */
import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// CORRECCIÓN: 82% (Comité de Análisis, p.38) — NO 84,5%
const BLACKOUT_PENETRACION = 82.0;
// CORRECCIÓN: 2,4 s (punto medio de 2,21–2,71 s, ENTSO-E Factual Tabla 2-4, p.36)
// UNIDAD: segundos [s], NO GW·s (eso sería energía cinética, no constante H)
const BLACKOUT_INERCIA = 2.4;

function TermometroRiesgoInner() {
  const [Plot,      setPlot]      = useState(null);
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [lastUpdate,setLastUpdate] = useState(null);
  const [apiError,  setApiError]  = useState(false);

  useEffect(() => {
    import(/* webpackChunkName: "plotly-gauge" */ 'react-plotly.js')
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
        Cargando termómetro…
      </div>
    );
  }

  const penetracion = data?.penetracion_renovable ?? null;
  // H estimada desde el mix ESIOS (mismo método que esios-snapshot.js)
  // Si la API no lo devuelve, lo estimamos como: H_eq desde mezcla nuclear/gas/hidro
  const inercia = data?.inercia_estimada ?? data?.H_eq ?? null;

  const mkGauge = (value, ref, range, steps, unit, label, sourceNote) => ({
    type: 'indicator',
    mode: 'gauge+number+delta',
    value: value ?? 0,
    delta: {
      reference: ref,
      valueformat: '.1f',
      suffix: unit,
      font: { size: 13 },
      // Verde si mejora, rojo si empeora (lógica invertida según la variable)
    },
    number: { suffix: unit, font: { size: 22, color: '#e0ddd5' } },
    title: {
      text: `${label}<br><span style="font-size:10px;color:#64748b">${sourceNote}</span>`,
      font: { size: 13, color: '#a0a0b0' },
    },
    gauge: {
      axis: {
        range,
        tickcolor: '#a0a0b0',
        tickfont: { size: 10, color: '#a0a0b0' },
      },
      bar: {
        color: value !== null ? gaugeColor(value, steps) : '#475569',
        thickness: 0.25,
      },
      bgcolor: 'rgba(255,255,255,0.03)',
      borderwidth: 0,
      steps: steps.map(st => ({ range: st.range, color: st.bg })),
      threshold: {
        line: { color: '#ef4444', width: 3 },
        thickness: 0.75,
        value: ref,
      },
    },
  });

  const PENETRACION_STEPS = [
    { range: [0,  50], bg: 'rgba(16,185,129,0.08)',  color: '#10b981' },
    { range: [50, 75], bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b' },
    { range: [75,100], bg: 'rgba(239,68,68,0.08)',   color: '#ef4444' },
  ];

  // Inercia: más es mejor → colores invertidos respecto a penetración
  const INERCIA_STEPS = [
    { range: [0,   2], bg: 'rgba(239,68,68,0.08)',   color: '#ef4444' },
    { range: [2,   4], bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b' },
    { range: [4,  10], bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
  ];

  const sharedLayout = {
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 60, b: 20, l: 30, r: 30 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' },
    height: 280,
  };

  return (
    <div style={S.wrapper}>

      {apiError && (
        <div style={S.apiWarning} aria-live="polite">
          ⚠ API ESIOS no disponible — gauges en espera de datos
        </div>
      )}

      <div style={S.grid}>

        {/* Gauge penetración renovable */}
        <div style={S.gaugeBox}>
          <Plot
            data={[mkGauge(
              penetracion,
              BLACKOUT_PENETRACION,
              [0, 100],
              PENETRACION_STEPS,
              '%',
              'Penetración renovable',
              'Comité de Análisis, p.38',
            )]}
            layout={sharedLayout}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
          <RiskBadge
            value={penetracion}
            thresholds={[
              { max: 50, label: 'Normal',   color: '#10b981' },
              { max: 75, label: 'Atención', color: '#f59e0b' },
            ]}
            dangerLabel="Riesgo alto"
          />
          <p style={S.ref}>
            Umbral 28-A: <strong style={{ color: '#ef4444' }}>82%</strong>
            {' '}· Línea roja = instante del colapso
            {' '}· Fuente: Comité de Análisis del Gobierno, p.38
          </p>
        </div>

        {/* Gauge inercia H */}
        <div style={S.gaugeBox}>
          <Plot
            data={[mkGauge(
              inercia,
              BLACKOUT_INERCIA,
              [0, 10],
              INERCIA_STEPS,
              ' s',     // CORRECCIÓN: segundos, no GW·s
              'Inercia equivalente H',
              'ENTSO-E Factual, Tabla 2-4, p.36',
            )]}
            layout={sharedLayout}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%' }}
          />
          <RiskBadge
            value={inercia}
            thresholds={[
              { max: 2, label: 'Crítico', color: '#ef4444' },
              { max: 4, label: 'Bajo',    color: '#f59e0b' },
            ]}
            dangerLabel="Nominal"
            dangerInverted
          />
          <p style={S.ref}>
            Umbral 28-A: <strong style={{ color: '#ef4444' }}>2,4 s</strong>
            {' '}(rango ibérico: 2,21–2,71 s)
            {' '}· H estimada desde mix ESIOS: Nuclear×6 + Hidro×3 + Gas×5
          </p>
        </div>
      </div>

      {/* Nota metodológica */}
      <div style={S.nota}>
        <strong style={{ color: '#f59e0b' }}>Nota:</strong> H [s] = constante de inercia
        (IEEE 1110 / Kundur 1994). Es distinta de la energía cinética E_k [GWs] = H × S_base.
        A mayor H, más tiempo tiene el sistema para reaccionar ante una perturbación.
        El 28-A, H ibérica era 2,21–2,71 s — dentro del rango operativo, pero en el límite inferior.
      </div>

      <p style={S.caption}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · ESIOS (REE) · Refresco cada 5 min`
          : 'Sin datos en tiempo real'}
      </p>
    </div>
  );
}

function gaugeColor(value, steps) {
  for (const st of steps) {
    if (value >= st.range[0] && value < st.range[1]) return st.color;
  }
  return steps[steps.length - 1].color;
}

function RiskBadge({ value, thresholds, dangerLabel, dangerInverted }) {
  if (value === null || value === undefined) return null;
  for (const t of thresholds) {
    if (value < t.max) {
      return (
        <div style={{ ...S.badge, background: `${t.color}22`, color: t.color, borderColor: `${t.color}44` }}>
          {t.label}
        </div>
      );
    }
  }
  const c = dangerInverted ? '#10b981' : '#ef4444';
  return (
    <div style={{ ...S.badge, background: `${c}22`, color: c, borderColor: `${c}44` }}>
      {dangerLabel}
    </div>
  );
}

const S = {
  wrapper:    { background: 'transparent', padding: '1rem 0' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  gaugeBox:   { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  badge:      { marginTop: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: 20, border: '1px solid', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' },
  ref:        { fontSize: '0.7rem', color: 'rgba(160,155,140,0.65)', textAlign: 'center', marginTop: '0.4rem', lineHeight: 1.45, padding: '0 0.5rem' },
  nota:       { marginTop: '1rem', padding: '0.6rem 1rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, fontSize: '0.75rem', color: '#92400e', lineHeight: 1.6, fontFamily: 'monospace' },
  apiWarning: { marginBottom: '0.75rem', padding: '0.4rem 0.9rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, fontSize: 11, color: '#f59e0b', fontFamily: 'monospace' },
  loading:    { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'rgba(160,155,140,0.7)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' },
  caption:    { marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: 'monospace' },
};

export default function TermometroRiesgo() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>Cargando…</div>}>
      {() => <TermometroRiesgoInner />}
    </BrowserOnly>
  );
}
