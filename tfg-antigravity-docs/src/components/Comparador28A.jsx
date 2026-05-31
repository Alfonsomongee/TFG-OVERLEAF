/**
 * Comparador28A.jsx
 * Comparador en tiempo real "Sistema ahora vs 28-A".
 *
 * ARQUITECTURA:
 * - SWR sobre /api/esios/snapshot (proxy Vercel con caché edge).
 * - Si la API falla, muestra los datos del 28-A en ambas columnas
 *   con aviso explícito — el componente NUNCA queda en blanco.
 * - RiskGauge: indicador semafórico por dimensión (inercia, IBR%, SCR).
 * - Umbrales calibrados con datos28A.json y ENTSO-E Factual, p.36.
 *
 * UMBRALES DE RIESGO (justificación):
 *   Inercia H [s]:
 *     < 2,5  → CRÍTICO  (por debajo del valor ibérico del 28-A: 2,21–2,71 s)
 *     2,5–4  → ALERTA   (rango de operación habitual en transición)
 *     > 4    → SEGURO
 *   IBR% (penetración no-síncrona):
 *     > 75   → CRÍTICO  (por encima del 82% del 28-A con margen)
 *     60–75  → ALERTA
 *     < 60   → SEGURO
 *   SCR estimado:
 *     < 2    → CRÍTICO  (red débil según IEEE 1204)
 *     2–3    → ALERTA
 *     > 3    → SEGURO
 *
 * DATOS DEL 28-A (fuente: datos28A.json / ENTSO-E Factual, p.36):
 *   H_iberia = 2,21–2,71 s → usamos 2,4 s (punto medio)
 *   IBR% = 82% (Comité de Análisis, p.38)
 *   SCR estimado zona sur = 1,8 (estimación literatura)
 */
import React, { useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useSWR from 'swr';

// ─── Datos fijos del 28-A (fuente única de verdad) ───────────────────────────
const BLACKOUT_SNAPSHOT = {
  timestamp:  '2025-04-28T12:30:00+02:00',
  H_eq:       2.4,   // s — media ibérica ENTSO-E Factual Tabla 2-4 p.36
  ibr_pct:    82.0,  // % — Comité de Análisis p.38
  scr_est:    1.8,   // adimensional — estimación zona sur
  label:      '28 de abril de 2025, 12:30 CEST',
  labelEn:    'April 28, 2025, 12:30 CEST',
};

// ─── Umbrales de riesgo ───────────────────────────────────────────────────────
const THRESHOLDS = {
  H_eq:    { critical: 2.5,  warning: 4.0,  higherIsBetter: true  },
  ibr_pct: { critical: 75.0, warning: 60.0, higherIsBetter: false },
  scr_est: { critical: 2.0,  warning: 3.0,  higherIsBetter: true  },
};

function getRiskLevel(key, value) {
  const t = THRESHOLDS[key];
  if (!t || value == null) return 'unknown';
  if (t.higherIsBetter) {
    if (value < t.critical) return 'critical';
    if (value < t.warning)  return 'warning';
    return 'safe';
  } else {
    if (value > t.critical) return 'critical';
    if (value > t.warning)  return 'warning';
    return 'safe';
  }
}

const RISK_COLORS = {
  critical: '#ef4444',
  warning:  '#f59e0b',
  safe:     '#10b981',
  unknown:  '#64748b',
};

const RISK_LABELS = {
  es: { critical: 'CRÍTICO', warning: 'ALERTA', safe: 'SEGURO', unknown: '—' },
  en: { critical: 'CRITICAL', warning: 'WARNING', safe: 'SAFE', unknown: '—' },
};

// ─── RiskGauge ────────────────────────────────────────────────────────────────
function RiskGauge({ label, value, unit, metricKey, lang = 'es', source, readonly = false }) {
  const level = getRiskLevel(metricKey, value);
  const color = RISK_COLORS[level];
  const riskLabel = (RISK_LABELS[lang] || RISK_LABELS.es)[level];
  const displayValue = value != null ? `${value.toFixed(2)} ${unit}` : '—';
  const pct = value != null
    ? Math.min(100, Math.max(0, metricKey === 'ibr_pct'
        ? value
        : metricKey === 'H_eq'
          ? (value / 8) * 100
          : (value / 6) * 100))
    : 0;

  return (
    <div style={{
      padding: '0.85rem 1rem',
      background: `${color}0d`,
      border: `1px solid ${color}40`,
      borderRadius: 8,
      marginBottom: '0.6rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{label}</span>
        <span style={{
          fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold',
          color, background: `${color}22`, padding: '1px 6px', borderRadius: 10,
        }}>
          {riskLabel}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 'bold', color, fontFamily: 'monospace', marginBottom: 6 }}>
        {displayValue}
      </div>
      {/* Barra de progreso */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          transition: 'width 0.4s ease',
        }} />
      </div>
      {source && (
        <div style={{ marginTop: 4, fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
          {source}
        </div>
      )}
    </div>
  );
}

// ─── Fetcher SWR ──────────────────────────────────────────────────────────────
const fetcher = (url) =>
  fetch(url).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

// ─── Indicador de frescura ────────────────────────────────────────────────────
function FreshnessIndicator({ timestamp, lang }) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  const ageMin = Math.round((Date.now() - d) / 60000);
  const isEs = lang === 'es';
  const isStale = ageMin > 10;
  return (
    <div style={{
      fontSize: 11, fontFamily: 'monospace',
      color: isStale ? '#f59e0b' : '#10b981',
      marginTop: 8, textAlign: 'center',
    }}>
      {isStale ? '⚠' : '●'}{' '}
      {isEs
        ? `Actualizado hace ${ageMin} min · ESIOS (REE)`
        : `Updated ${ageMin} min ago · ESIOS (REE)`}
    </div>
  );
}

// ─── Columna de datos ─────────────────────────────────────────────────────────
function DataColumn({ title, data, lang, isBlackout = false, source }) {
  const isEs = lang === 'es';
  return (
    <div style={{
      flex: 1,
      padding: '1rem',
      background: isBlackout ? 'rgba(239,68,68,0.04)' : 'rgba(16,185,129,0.04)',
      border: `1px solid ${isBlackout ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
      borderRadius: 10,
    }}>
      <h4 style={{
        margin: '0 0 1rem',
        fontSize: 13, fontFamily: 'monospace',
        color: isBlackout ? '#ef4444' : '#10b981',
        borderBottom: `1px solid ${isBlackout ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
        paddingBottom: '0.5rem',
      }}>
        {isBlackout ? '⚡ ' : '📡 '}{title}
      </h4>

      <RiskGauge
        label={isEs ? 'Inercia equivalente H' : 'Equivalent inertia H'}
        value={data?.H_eq}
        unit="s"
        metricKey="H_eq"
        lang={lang}
        source={isBlackout ? 'ENTSO-E Factual, Tabla 2-4, p.36' : source}
      />
      <RiskGauge
        label={isEs ? 'Penetración IBR (no-síncrona)' : 'IBR penetration (non-synchronous)'}
        value={data?.ibr_pct}
        unit="%"
        metricKey="ibr_pct"
        lang={lang}
        source={isBlackout ? 'Comité de Análisis, p.38' : source}
      />
      <RiskGauge
        label={isEs ? 'SCR estimado (zona crítica)' : 'Estimated SCR (critical zone)'}
        value={data?.scr_est}
        unit=""
        metricKey="scr_est"
        lang={lang}
        source={isBlackout ? 'Estimación literatura (zona sur)' : source}
      />
    </div>
  );
}

// ─── Componente interno ───────────────────────────────────────────────────────
function Comparador28AInner({ lang = 'es' }) {
  const isEs = lang === 'es';

  const { data, error, isLoading } = useSWR(
    '/api/esios/snapshot',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,   // 5 min
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 30000,
      keepPreviousData: true,
    },
  );

  const isApiDown = error && !data;

  return (
    <div>
      {/* Banner de API caída */}
      {isApiDown && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.5rem 1rem',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 6,
          fontSize: 12, fontFamily: 'monospace', color: '#f59e0b',
        }} aria-live="polite">
          ⚠ {isEs
            ? 'API ESIOS no disponible — mostrando datos del 28-A como referencia'
            : 'ESIOS API unavailable — showing April 28 data as reference'}
        </div>
      )}

      {/* Skeleton durante carga inicial */}
      {isLoading && !data && (
        <div style={{
          display: 'flex', gap: '1rem', marginBottom: '0.75rem',
        }} aria-busy="true" aria-live="polite">
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: 1, height: 240,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
        </div>
      )}

      {/* Columnas comparativas */}
      {(!isLoading || data) && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <DataColumn
            title={isEs ? 'Sistema ahora' : 'System now'}
            data={isApiDown ? BLACKOUT_SNAPSHOT : (data || BLACKOUT_SNAPSHOT)}
            lang={lang}
            isBlackout={false}
            source={isApiDown
              ? (isEs ? 'Sin datos en tiempo real' : 'No real-time data')
              : (isEs ? 'ESIOS (REE) · Tiempo real' : 'ESIOS (REE) · Real-time')}
          />
          <DataColumn
            title={isEs
              ? BLACKOUT_SNAPSHOT.label
              : BLACKOUT_SNAPSHOT.labelEn}
            data={BLACKOUT_SNAPSHOT}
            lang={lang}
            isBlackout={true}
          />
        </div>
      )}

      {data && <FreshnessIndicator timestamp={data.timestamp} lang={lang} />}

      {/* Footer metodológico */}
      <div style={{
        marginTop: '1rem',
        fontSize: 11, color: '#475569',
        fontFamily: 'monospace', lineHeight: 1.6,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '0.75rem',
      }}>
        {isEs
          ? 'H estimada desde mix de generación ESIOS (generación síncrona × H_típico). SCR estimado desde ratio IBR/potencia de cortocircuito. Los valores son indicativos, no medidas PMU directas.'
          : 'H estimated from ESIOS generation mix (synchronous generation × typical_H). SCR estimated from IBR/short-circuit power ratio. Values are indicative, not direct PMU measurements.'}
      </div>
    </div>
  );
}

export default function Comparador28A({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 280, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#64748b',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando comparador…' : 'Loading comparator…'}
      </div>
    }>
      {() => <Comparador28AInner lang={lang} />}
    </BrowserOnly>
  );
}
