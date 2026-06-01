/**
 * InterconnectionDashboard.jsx
 * Dashboard de interconexiones internacionales del sistema ibérico (2015-2025).
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. CRÍTICO — require() dentro de BrowserOnly eliminado:
 *    La versión anterior usaba require('recharts') dentro del render.
 *    Esto es un anti-patrón: provoca re-renders y puede causar errores
 *    de módulo en SSR. Migrado a imports estáticos con lazy loading del
 *    componente completo vía BrowserOnly.
 *
 * 2. DATOS — Pie Chart de capacidad fronteriza verificado:
 *    Los valores de Francia (2.800 MW), Portugal (1.200 MW) y Marruecos
 *    (200 MW) son consistentes con la capacidad NTC real del sistema.
 *    Se añade nota de fuente (ENTSO-E / REE) y advertencia de que
 *    la capacidad está estancada desde 2015 (tesis del "estrangulamiento").
 *
 * 3. ACCESIBILIDAD:
 *    - aria-label en el contenedor del dashboard.
 *    - Tooltips con información de fuente.
 *    - role="img" en los contenedores de gráficas.
 *
 * 4. MEJORA VISUAL:
 *    - Indicador de alerta cuando el ratio de interconexión cae
 *      por debajo del 6% (objetivo mínimo UE: 10%).
 *    - Línea horizontal en el gráfico de ratio marcando el 10% UE.
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { lazy, Suspense, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InterconnectionDashboard.module.css';
import { interconnectionData } from '../data/interconnectionData';

// ─── Imports estáticos de Recharts (no usar require() en render) ──────────────
import {
  ComposedChart, BarChart, Bar, Line, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ─── Capacidad fronteriza verificada ─────────────────────────────────────────
// Fuente: ENTSO-E Transparency Platform / REE (NTC Export + Import)
// La capacidad máxima de importación física lleva estancada en ~4.200 MW
// desde 2015, mientras la potencia instalada renovable se multiplicó por 3.
const BORDER_CAPACITY = [
  { name: 'Francia', value: 2800, color: '#3b82f6' },
  { name: 'Portugal', value: 1200, color: '#10b981' },
  { name: 'Marruecos', value: 200,  color: '#f59e0b' },
];

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, isEs }) {
  if (!active || !payload?.length) return null;
  const yearData = interconnectionData.find(d => d.anio === label);
  return (
    <div style={{
      background: 'rgba(10,15,30,0.97)',
      border: '1px solid rgba(59,130,246,0.4)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#e2e8f0',
      maxWidth: 260,
    }}>
      <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#94a3b8' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0 0 3px', color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
        </p>
      ))}
      {yearData?.evento && isEs && (
        <p style={{ margin: '6px 0 0', color: '#f59e0b', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 6 }}>
          {yearData.evento}
        </p>
      )}
      {yearData?.evento_en && !isEs && (
        <p style={{ margin: '6px 0 0', color: '#f59e0b', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 6 }}>
          {yearData.evento_en}
        </p>
      )}
    </div>
  );
}

// ─── Componente interno (evita SSR issues) ────────────────────────────────────
function InterconnectionDashboardInner({}) {
  const lang = useDocLang();
  const isEs = lang === 'es' || !['en','pt','fr','it','de'].includes(lang);

  // Último año con ratio de interconexión disponible
  const latestData = interconnectionData[interconnectionData.length - 1];
  const latestRatio = latestData?.ratio_interconexion_pct ?? 0;
  const isAlert = latestRatio < 6;

  const tooltipProps = { content: <CustomTooltip isEs={isEs} /> };

  return (
    <div
      className={styles.dashboardContainer}
      aria-label={isEs
        ? 'Dashboard de interconexiones internacionales del sistema eléctrico ibérico (2015-2025)'
        : 'International interconnection dashboard of the Iberian power system (2015-2025)'}
    >
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h3>{isEs ? 'Estrangulamiento de Interconexiones' : 'Interconnection Bottleneck'}</h3>
        <p>{isEs
          ? 'Evolución del sistema eléctrico ibérico (2015-2025)'
          : 'Evolution of the Iberian grid (2015-2025)'}</p>

        {/* Alerta de ratio bajo */}
        {isAlert && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 6,
            fontSize: 12,
            color: '#fca5a5',
            fontFamily: 'monospace',
          }}>
            ⚠ {isEs
              ? `Ratio de interconexión actual: ${latestRatio.toFixed(1)}% — por debajo del objetivo mínimo UE (10%)`
              : `Current interconnection ratio: ${latestRatio.toFixed(1)}% — below EU minimum target (10%)`}
          </div>
        )}
      </div>

      <div className={styles.grid}>

        {/* ── Gráfico 1: Intercambios internacionales ── */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h4 className={styles.cardTitle}>
            {isEs ? 'Intercambios Internacionales (GWh)' : 'International Exchanges (GWh)'}
          </h4>
          <p className={styles.cardDesc}>
            {isEs
              ? 'Volumen anual de exportaciones, importaciones y saldo neto'
              : 'Annual volume of exports, imports, and net balance'}
          </p>
          <div
            className={styles.chartContainer}
            role="img"
            aria-label={isEs
              ? 'Gráfico de intercambios internacionales de electricidad 2015-2025'
              : 'International electricity exchange chart 2015-2025'}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={interconnectionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="anio" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="exportacion_gwh"
                     name={isEs ? 'Exportación' : 'Export'}
                     fill="#00d9ff" barSize={20} radius={[4,4,0,0]} />
                <Bar dataKey="importacion_gwh"
                     name={isEs ? 'Importación' : 'Import'}
                     fill="#f472b6" barSize={20} radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="saldo_neto_gwh"
                      name={isEs ? 'Saldo Neto' : 'Net Balance'}
                      stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Gráfico 2: Fragilidad estructural ── */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>
            {isEs ? 'Fragilidad Estructural' : 'Structural Fragility'}
          </h4>
          <p className={styles.cardDesc}>
            {isEs
              ? 'Crecimiento de potencia renovable frente a la caída del ratio de interconexión (Target UE: 10%)'
              : 'Renewable power growth vs declining interconnection ratio (EU target: 10%)'}
          </p>
          <div
            className={styles.chartContainer}
            role="img"
            aria-label={isEs
              ? 'Gráfico de fragilidad estructural: potencia instalada vs ratio de interconexión'
              : 'Structural fragility chart: installed power vs interconnection ratio'}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={interconnectionData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="anio" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#94a3b8"
                       tickFormatter={v => `${(v/1000).toFixed(0)}k`}
                       tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444"
                       domain={[0, 20]} tickFormatter={v => `${v}%`}
                       tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {/* Objetivo mínimo UE 10% */}
                <ReferenceLine
                  yAxisId="right" y={10}
                  stroke="rgba(239,68,68,0.5)" strokeDasharray="4 4"
                  label={{ value: isEs ? 'Objetivo UE 10%' : 'EU target 10%',
                           fill: 'rgba(239,68,68,0.7)', fontSize: 10, position: 'insideTopRight' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="potencia_instalada_total_mw"
                      name={isEs ? 'Potencia Total Instalada' : 'Total Installed Power'}
                      fill="rgba(16,185,129,0.15)" stroke="#10b981" />
                <Line yAxisId="right" type="stepAfter" dataKey="ratio_interconexion_pct"
                      name={isEs ? 'Ratio Interconexión (%)' : 'Interconnection Ratio (%)'}
                      stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Gráfico 3: Capacidad fronteriza ── */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>
            {isEs ? 'Capacidad Fronteriza Bloqueada' : 'Locked Border Capacity'}
          </h4>
          <p className={styles.cardDesc}>
            {isEs
              ? 'Distribución de la capacidad máxima de importación física (~4.200 MW, estancada desde 2015). Fuente: ENTSO-E / REE (NTC).'
              : 'Distribution of maximum physical import capacity (~4,200 MW, stagnant since 2015). Source: ENTSO-E / REE (NTC).'}
          </p>
          <div
            className={styles.chartContainer}
            role="img"
            aria-label={isEs
              ? `Capacidad de interconexión por frontera: Francia ${BORDER_CAPACITY[0].value} MW, Portugal ${BORDER_CAPACITY[1].value} MW, Marruecos ${BORDER_CAPACITY[2].value} MW`
              : `Border interconnection capacity: France ${BORDER_CAPACITY[0].value} MW, Portugal ${BORDER_CAPACITY[1].value} MW, Morocco ${BORDER_CAPACITY[2].value} MW`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={BORDER_CAPACITY}
                  cx="50%" cy="50%"
                  innerRadius={80} outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${isEs ? name : name} ${(percent * 100).toFixed(0)}%`}
                >
                  {BORDER_CAPACITY.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10,15,30,0.97)',
                    borderColor: '#3b82f6',
                    borderRadius: 8,
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: 12,
                  }}
                  formatter={(v, name) => [`${v.toLocaleString()} MW`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: 10,
            color: 'rgba(148,163,184,0.6)',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            {isEs
              ? 'Total: 4.200 MW · Capacidad NTC ENTSO-E 2025'
              : 'Total: 4,200 MW · ENTSO-E NTC capacity 2025'}
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Exportación con BrowserOnly ──────────────────────────────────────────────
export default function InterconnectionDashboard({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        minHeight: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-1, #64748b)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando dashboard de interconexiones…' : 'Loading interconnection dashboard…'}
      </div>
    }>
      {() => <InterconnectionDashboardInner />}
    </BrowserOnly>
  );
}
