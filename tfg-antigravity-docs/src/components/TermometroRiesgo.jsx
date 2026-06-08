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
import { useColorMode } from '@docusaurus/theme-common';
import { useEsiosAnalysis } from '@site/src/hooks/useEsiosAnalysis';

// CORRECCIÓN: 82% (Comité de Análisis, p.38) — NO 84,5%
const BLACKOUT_PENETRACION = 82.0;
// CORRECCIÓN: 2,4 s (punto medio de 2,21–2,71 s, ENTSO-E Factual Tabla 2-4, p.36)
// UNIDAD: segundos [s], NO GW·s (eso sería energía cinética, no constante H)
const BLACKOUT_INERCIA = 2.4;

function TermometroRiesgoInner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { analysis, loading: analysisLoading } = useEsiosAnalysis('penetracion_renovable');

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    gaugeBg: 'rgba(16, 29, 53, 0.46)',
    axis: '#C7D2E3',

    safe: '#A6C67B',
    warning: '#E6B45C',
    danger: '#D98798',

    safeSoft: 'rgba(166, 198, 123, 0.10)',
    safeSoft2: 'rgba(166, 198, 123, 0.055)',
    warningSoft: 'rgba(230, 180, 92, 0.12)',
    dangerSoft: 'rgba(217, 135, 152, 0.12)',

    safeBorder: 'rgba(166, 198, 123, 0.34)',
    warningBorder: 'rgba(230, 180, 92, 0.34)',
    dangerBorder: 'rgba(217, 135, 152, 0.36)',

    badgeSafeBg: 'rgba(166, 198, 123, 0.12)',
    badgeWarningBg: 'rgba(230, 180, 92, 0.12)',
    badgeDangerBg: 'rgba(217, 135, 152, 0.12)',

    noteBg: 'rgba(16, 29, 53, 0.56)',
    noteText: '#C7D2E3',
    noteBorder: 'rgba(230, 180, 92, 0.34)',

    caption: '#91A4BC',
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    gaugeBg: 'rgba(255, 252, 245, 0.62)',
    axis: '#7A7062',

    safe: '#2F6B4F',
    warning: '#A96000',
    danger: '#A13D36',

    safeSoft: 'rgba(47, 107, 79, 0.10)',
    safeSoft2: 'rgba(47, 107, 79, 0.055)',
    warningSoft: 'rgba(169, 96, 0, 0.12)',
    dangerSoft: 'rgba(161, 61, 54, 0.10)',

    safeBorder: 'rgba(47, 107, 79, 0.34)',
    warningBorder: 'rgba(169, 96, 0, 0.30)',
    dangerBorder: 'rgba(161, 61, 54, 0.34)',

    badgeSafeBg: 'rgba(47, 107, 79, 0.10)',
    badgeWarningBg: 'rgba(169, 96, 0, 0.12)',
    badgeDangerBg: 'rgba(161, 61, 54, 0.10)',

    noteBg: 'rgba(255, 252, 245, 0.58)',
    noteText: '#3C3830',
    noteBorder: 'rgba(169, 96, 0, 0.30)',

    caption: '#9B9285',
  };

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
      <div style={{ ...S.loading, color: colors.textMuted }} aria-busy="true" aria-live="polite">
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
      font: { size: 13, color: colors.textSecondary },
      // Verde si mejora, rojo si empeora (lógica invertida según la variable)
    },
    number: { suffix: unit, font: { size: 22, color: colors.textPrimary } },
    title: {
      text: `${label}<br><span style="font-size:10px;color:${colors.textMuted}">${sourceNote}</span>`,
      font: { size: 13, color: colors.textSecondary },
    },
    gauge: {
      axis: {
        range,
        tickcolor: colors.axis,
        tickfont: { size: 10, color: colors.axis },
      },
      bar: {
        color: value !== null ? gaugeColor(value, steps) : colors.textMuted,
        thickness: 0.25,
      },
      bgcolor: colors.gaugeBg,
      borderwidth: 0,
      steps: steps.map(st => ({ range: st.range, color: st.bg })),
      threshold: {
        line: { color: colors.danger, width: 3 },
        thickness: 0.75,
        value: ref,
      },
    },
  });

  const PENETRACION_STEPS = [
    { range: [0,  50], bg: colors.safeSoft,    color: colors.safe },
    { range: [50, 75], bg: colors.warningSoft, color: colors.warning },
    { range: [75,100], bg: colors.dangerSoft,  color: colors.danger },
  ];

  // Inercia: más es mejor → colores invertidos respecto a penetración
  const INERCIA_STEPS = [
    { range: [0,   2], bg: colors.dangerSoft,  color: colors.danger },
    { range: [2,   4], bg: colors.warningSoft, color: colors.warning },
    { range: [4,  10], bg: colors.safeSoft,    color: colors.safe },
  ];

  const sharedLayout = {
    plot_bgcolor:  'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 60, b: 20, l: 30, r: 30 },
    font: { family: 'Inter, sans-serif', color: colors.textSecondary },
    height: 280,
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
              { max: 50, label: 'Normal', color: colors.safe, bg: colors.badgeSafeBg, border: colors.safeBorder },
              { max: 75, label: 'Atención', color: colors.warning, bg: colors.badgeWarningBg, border: colors.warningBorder },
            ]}
            colors={colors}
            dangerLabel="Riesgo alto"
          />
          <p style={{ ...S.ref, color: colors.caption }}>
            Umbral 28-A: <strong style={{ color: colors.danger }}>82%</strong>
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
              { max: 2, label: 'Crítico', color: colors.danger, bg: colors.badgeDangerBg, border: colors.dangerBorder },
              { max: 4, label: 'Bajo', color: colors.warning, bg: colors.badgeWarningBg, border: colors.warningBorder },
            ]}
            colors={colors}
            dangerLabel="Nominal"
            dangerInverted
          />
          <p style={{ ...S.ref, color: colors.caption }}>
            Umbral 28-A: <strong style={{ color: colors.danger }}>2,4 s</strong>
            {' '}(rango ibérico: 2,21–2,71 s)
            {' '}· H estimada desde mix ESIOS: Nuclear×6 + Hidro×3 + Gas×5
          </p>
        </div>
      </div>

      {/* Nota metodológica */}
      <div style={{
        ...S.nota,
        background: colors.noteBg,
        border: `1px solid ${colors.noteBorder}`,
        color: colors.noteText,
      }}>
        <strong style={{ color: colors.warning }}>Nota:</strong> H [s] = constante de inercia
        (IEEE 1110 / Kundur 1994). Es distinta de la energía cinética E_k [GWs] = H × S_base.
        A mayor H, más tiempo tiene el sistema para reaccionar ante una perturbación.
        El 28-A, H ibérica era 2,21–2,71 s — dentro del rango operativo, pero en el límite inferior.
      </div>

      {/* Análisis comparativo 28-A */}
      {analysis && (
        <div className="esios-analysis-block">
          <span className="esios-analysis-label">Análisis comparativo 28-A</span>
          <p className="esios-analysis-text">{analysis}</p>
        </div>
      )}
      {analysisLoading && !analysis && (
        <div className="esios-analysis-block esios-analysis-loading">
          <span className="esios-analysis-label">Análisis comparativo 28-A</span>
          <span className="esios-analysis-skeleton">Generando análisis...</span>
        </div>
      )}

      <p style={{ ...S.caption, color: colors.caption }}>
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

function RiskBadge({ value, thresholds, dangerLabel, dangerInverted, colors }) {
  if (value === null || value === undefined) return null;
  for (const t of thresholds) {
    if (value < t.max) {
      return (
        <div style={{ ...S.badge, background: t.bg, color: t.color, borderColor: t.border }}>
          {t.label}
        </div>
      );
    }
  }
  const c = dangerInverted ? colors.safe : colors.danger;
  const bg = dangerInverted ? colors.badgeSafeBg : colors.badgeDangerBg;
  const border = dangerInverted ? colors.safeBorder : colors.dangerBorder;
  return (
    <div style={{ ...S.badge, background: bg, color: c, borderColor: border }}>
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
  loading:    { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#6B6255', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' },
  caption:    { marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)', letterSpacing: '0.04em', fontFamily: 'monospace' },
};

export default function TermometroRiesgo() {
  return (
    <BrowserOnly fallback={<div style={S.loading}>Cargando…</div>}>
      {() => <TermometroRiesgoInner />}
    </BrowserOnly>
  );
}
