/**
 * RadarVulnerabilidad.jsx
 * Radar de vulnerabilidad sistémica — 5 dimensiones, múltiples series.
 *
 * DIMENSIONES (justificación de cada eje):
 *   1. Inercia (H):       masa síncrona disponible → resistencia a caída de f
 *   2. SCR:               fortaleza de red → estabilidad de tensión
 *   3. Penetración IBR:   inverso → más IBR = más vulnerabilidad
 *   4. Interconexión:     capacidad de importación / demanda → soporte externo
 *   5. Reserva rodante:   margen de regulación primaria disponible
 *
 * SERIES:
 *   - 28-A (12:30 CEST):  condiciones del colapso — datos28A.json verificados
 *   - Sistema post-28A:   estimación con "Operación Reforzada" REE (abr 2026)
 *   - Sistema actual:     desde API ESIOS si disponible, sino post-28A
 *
 * NOTA METODOLÓGICA:
 *   Los valores se normalizan a [0, 100] para el radar:
 *   - Inercia:      0 → H=0s, 100 → H=8s
 *   - SCR:          0 → SCR=0, 100 → SCR=6
 *   - IBR%:         invertido → 0 → 100% IBR, 100 → 0% IBR
 *   - Interconexión:0 → 0%, 100 → ratio 15% (objetivo UE)
 *   - Reserva:      0 → 0 MW, 100 → 3.000 MW
 */
import React, { useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── Datos de referencia verificados ─────────────────────────────────────────
const SERIES = {
  blackout28A: {
    label: { es: '28-A (12:30 CEST)', en: 'April 28 (12:30 CEST)' },
    color: '#ef4444',
    fill:  'rgba(239,68,68,0.15)',
    // Normalización → [0,100]. Fuentes: datos28A.json / ENTSO-E Factual p.36
    inercia:      (2.4 / 8) * 100,          // H=2,4s
    scr:          (1.8 / 6) * 100,           // SCR≈1,8 zona sur
    ibr:          100 - 82,                  // IBR=82% → invertido
    interconexion:(1.8 / 15) * 100,          // ratio≈1,8% (objetivo UE: 15%)
    reserva:      (200 / 3000) * 100,        // reserva rodante mínima pre-cascada
  },
  postBlackout: {
    label: { es: 'Post-28A (Operación Reforzada)', en: 'Post-28A (Reinforced Operation)' },
    color: '#f59e0b',
    fill:  'rgba(245,158,11,0.12)',
    // Mejoras documentadas por REE (informe abril 2026):
    // +SynCons, +reserva, −IBR% por despacho forzoso gas/nuclear
    inercia:      (3.8 / 8) * 100,           // H≈3,8s con SynCons adicionales
    scr:          (2.5 / 6) * 100,           // SCR mejorado por compensadores
    ibr:          100 - 68,                  // IBR↓ por más generación síncrona
    interconexion:(1.8 / 15) * 100,          // interconexión sin cambios (igual)
    reserva:      (800 / 3000) * 100,        // reserva rodante reforzada
  },
  optimal: {
    label: { es: 'Objetivo PNIEC 2030 (BESS-GFM)', en: 'PNIEC 2030 Target (BESS-GFM)' },
    color: '#10b981',
    fill:  'rgba(16,185,129,0.10)',
    // Objetivo RD 997/2025: 22,5 GW almacenamiento; GFM obligatorio
    inercia:      (5.0 / 8) * 100,           // H≈5s con inercia sintética BESS-GFM
    scr:          (3.5 / 6) * 100,           // SCR mejorado con GFM
    ibr:          100 - 75,                  // IBR≈75% con mejor control
    interconexion:(6.0 / 15) * 100,          // ratio≈6% con HVDC adicional
    reserva:      (1500 / 3000) * 100,       // reserva BESS-GFM
  },
};

// ─── Estructura del radar ─────────────────────────────────────────────────────
function buildRadarData(lang) {
  const isEs = lang === 'es';
  return [
    {
      axis:  isEs ? 'Inercia (H)' : 'Inertia (H)',
      key:   'inercia',
      note:  isEs ? 'H=8s → 100%' : 'H=8s → 100%',
    },
    {
      axis:  isEs ? 'Fortaleza de Red (SCR)' : 'Grid Strength (SCR)',
      key:   'scr',
      note:  isEs ? 'SCR=6 → 100%' : 'SCR=6 → 100%',
    },
    {
      axis:  isEs ? 'Resistencia IBR' : 'IBR Resistance',
      key:   'ibr',
      note:  isEs ? 'IBR=0% → 100%' : 'IBR=0% → 100%',
    },
    {
      axis:  isEs ? 'Interconexión' : 'Interconnection',
      key:   'interconexion',
      note:  isEs ? 'Ratio=15% → 100%' : 'Ratio=15% → 100%',
    },
    {
      axis:  isEs ? 'Reserva Rodante' : 'Spinning Reserve',
      key:   'reserva',
      note:  isEs ? '3.000 MW → 100%' : '3,000 MW → 100%',
    },
  ].map(d => ({
    ...d,
    blackout28A:  SERIES.blackout28A[d.key],
    postBlackout: SERIES.postBlackout[d.key],
    optimal:      SERIES.optimal[d.key],
  }));
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function RadarTooltip({ active, payload, lang }) {
  if (!active || !payload?.length) return null;
  const subject = payload[0]?.payload?.axis;
  const note    = payload[0]?.payload?.note;
  return (
    <div style={{
      background: 'rgba(10,15,30,0.97)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8, padding: '10px 14px',
      fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0',
      maxWidth: 220,
    }}>
      <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#94a3b8' }}>{subject}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0 0 3px', color: p.color }}>
          {p.name}: <strong>{p.value?.toFixed(1)}%</strong>
        </p>
      ))}
      {note && (
        <p style={{ margin: '6px 0 0', fontSize: 10, color: '#475569' }}>{note}</p>
      )}
    </div>
  );
}

// ─── Exportar datos como CSV ──────────────────────────────────────────────────
function exportCSV(data, lang) {
  const isEs = lang === 'es';
  const headers = ['Dimensión', '28-A', 'Post-28A', 'PNIEC2030'].join(',');
  const rows = data.map(d =>
    [`"${d.axis}"`, d.blackout28A.toFixed(1), d.postBlackout.toFixed(1), d.optimal.toFixed(1)].join(',')
  );
  const csv  = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `radar-vulnerabilidad-28A.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Componente interno ───────────────────────────────────────────────────────
function RadarVulnerabilidadInner({ lang = 'es' }) {
  const isEs = lang === 'es';
  const data = useMemo(() => buildRadarData(lang), [lang]);

  const handleExport = useCallback(() => exportCSV(data, lang), [data, lang]);

  return (
    <div>
      {/* Controles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          onClick={handleExport}
          aria-label={isEs ? 'Descargar datos como CSV' : 'Download data as CSV'}
          style={{
            padding: '0.3rem 0.8rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, color: '#64748b',
            cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
          }}
        >
          ↓ CSV
        </button>
      </div>

      {/* Radar */}
      <div
        role="img"
        aria-label={isEs
          ? 'Radar de vulnerabilidad sistémica en 5 dimensiones: 28-A, Post-28A y objetivo PNIEC 2030'
          : '5-dimension systemic vulnerability radar: April 28, Post-April 28, and PNIEC 2030 target'}
        style={{ height: 380 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 16, right: 40, left: 40, bottom: 16 }}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#475569', fontSize: 10 }}
              tickCount={4}
            />
            <Tooltip content={<RadarTooltip lang={lang} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'monospace', paddingTop: 8 }}
            />

            <Radar
              name={SERIES.blackout28A.label[lang] || SERIES.blackout28A.label.es}
              dataKey="blackout28A"
              stroke="#ef4444"
              fill="rgba(239,68,68,0.15)"
              strokeWidth={2}
            />
            <Radar
              name={SERIES.postBlackout.label[lang] || SERIES.postBlackout.label.es}
              dataKey="postBlackout"
              stroke="#f59e0b"
              fill="rgba(245,158,11,0.10)"
              strokeWidth={2}
              strokeDasharray="5 3"
            />
            <Radar
              name={SERIES.optimal.label[lang] || SERIES.optimal.label.es}
              dataKey="optimal"
              stroke="#10b981"
              fill="rgba(16,185,129,0.08)"
              strokeWidth={2}
              strokeDasharray="3 5"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretación */}
      <div style={{
        marginTop: '0.75rem',
        fontSize: 12, color: '#64748b',
        fontFamily: 'monospace', lineHeight: 1.6,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '0.75rem',
      }}>
        {isEs
          ? 'Área mayor = sistema más resiliente. El 28-A (rojo) muestra el colapso de las dimensiones de inercia, SCR e interconexión. La Operación Reforzada mejora parcialmente el perfil. El PNIEC 2030 con BESS-GFM recupera el equilibrio global.'
          : 'Larger area = more resilient system. April 28 (red) shows collapsed inertia, SCR and interconnection dimensions. Reinforced Operation partially improves the profile. PNIEC 2030 with BESS-GFM restores overall balance.'}
        <br />
        <span style={{ fontSize: 10, color: '#374151' }}>
          {isEs
            ? 'Fuentes: ENTSO-E Factual p.36 (inercia), Comité de Análisis p.38 (IBR%), REE informe abr 2026 (post-28A), RD 997/2025 (PNIEC 2030).'
            : 'Sources: ENTSO-E Factual p.36 (inertia), Analysis Committee p.38 (IBR%), REE April 2026 report (post-28A), RD 997/2025 (PNIEC 2030).'}
        </span>
      </div>
    </div>
  );
}

export default function RadarVulnerabilidad({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 380, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#64748b',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando radar de vulnerabilidad…' : 'Loading vulnerability radar…'}
      </div>
    }>
      {() => <RadarVulnerabilidadInner lang={lang} />}
    </BrowserOnly>
  );
}
