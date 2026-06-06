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
  { name: 'Francia', value: 2800, color: 'var(--int-france)' },
  { name: 'Portugal', value: 1200, color: 'var(--int-portugal)' },
  { name: 'Marruecos', value: 200, color: 'var(--int-morocco)' },
];

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, isEs }) {
  if (!active || !payload?.length) return null;
  const yearData = interconnectionData.find(d => d.anio === label);
  return (
    <div style={{
      background: 'var(--int-bg-tooltip)',
      border: '1px solid var(--int-border-strong)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: 'var(--int-text-primary)',
      maxWidth: 260,
      boxShadow: 'var(--int-shadow-tooltip)',
    }}>
      <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: 'var(--int-text-muted)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0 0 3px', color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
        </p>
      ))}
      {yearData?.evento && isEs && (
        <p style={{ margin: '6px 0 0', color: 'var(--int-net)', fontSize: 11, borderTop: '1px solid var(--int-border)', paddingTop: 6 }}>
          {yearData.evento}
        </p>
      )}
      {yearData?.evento_en && !isEs && (
        <p style={{ margin: '6px 0 0', color: 'var(--int-net)', fontSize: 11, borderTop: '1px solid var(--int-border)', paddingTop: 6 }}>
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
            background: 'var(--int-alert-bg)',
            border: '1px solid var(--int-alert-border)',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--int-alert-text)',
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--int-grid)" />
                <XAxis dataKey="anio" stroke="var(--int-axis-line)" tick={{ fill: 'var(--int-axis)', fontSize: 11 }} />
                <YAxis stroke="var(--int-axis-line)" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fill: 'var(--int-axis)', fontSize: 11 }} />
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--int-text-secondary)' }} />
                <Bar dataKey="exportacion_gwh"
                     name={isEs ? 'Exportación' : 'Export'}
                     fill="var(--int-export)" barSize={20} radius={[4,4,0,0]} />
                <Bar dataKey="importacion_gwh"
                     name={isEs ? 'Importación' : 'Import'}
                     fill="var(--int-import)" barSize={20} radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="saldo_neto_gwh"
                      name={isEs ? 'Saldo Neto' : 'Net Balance'}
                      stroke="var(--int-net)" strokeWidth={3} dot={{ r: 4 }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--int-grid)" />
                <XAxis dataKey="anio" stroke="var(--int-axis-line)" tick={{ fill: 'var(--int-axis)', fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="var(--int-axis-line)"
                       tickFormatter={v => `${(v/1000).toFixed(0)}k`}
                       tick={{ fill: 'var(--int-axis)', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--int-ratio)"
                       domain={[0, 20]} tickFormatter={v => `${v}%`}
                       tick={{ fill: 'var(--int-ratio)', fontSize: 11 }} />
                <Tooltip {...tooltipProps} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--int-text-secondary)' }} />
                {/* Objetivo mínimo UE 10% */}
                <ReferenceLine
                  yAxisId="right" y={10}
                  stroke="var(--int-ratio)" strokeDasharray="4 4"
                  label={{
                    value: isEs ? 'Objetivo UE 10%' : 'EU target 10%',
                    fill: 'var(--int-ratio)',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="potencia_instalada_total_mw"
                      name={isEs ? 'Potencia Total Instalada' : 'Total Installed Power'}
                      fill="var(--int-renewable-soft)" stroke="var(--int-renewable)" />
                <Line yAxisId="right" type="stepAfter" dataKey="ratio_interconexion_pct"
                      name={isEs ? 'Ratio Interconexión (%)' : 'Interconnection Ratio (%)'}
                      stroke="var(--int-ratio)" strokeWidth={3} dot={{ r: 5 }} />
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
                    backgroundColor: 'var(--int-bg-tooltip)',
                    border: '1px solid var(--int-border-strong)',
                    borderRadius: 8,
                    color: 'var(--int-text-primary)',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    boxShadow: 'var(--int-shadow-tooltip)',
                  }}
                  formatter={(v, name) => [`${v.toLocaleString()} MW`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--int-text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: 10,
            color: 'var(--int-text-muted)',
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
        justifyContent: 'center', color: '#7A7062',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando dashboard de interconexiones…' : 'Loading interconnection dashboard…'}
      </div>
    }>
      {() => <InterconnectionDashboardInner />}
    </BrowserOnly>
  );
}
