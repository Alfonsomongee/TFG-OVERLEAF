// src/components/ENTSOEDashboard/ENTSOEDashboard.jsx
// Dashboard de ENTSO-E Transparency Platform con integración directa
// Muestra: generación actual + demanda actual + comparativa 28-A
//
// Datos del 28-A proceden del Informe Factual ENTSO-E oficial
// Integrable en cualquier capítulo MDX: <ENTSOEDashboard />

import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import {
  useENTSOEData,
  getLatestValue,
  getTimeseries,
  getDelta,
  SNAPSHOT_28A,
} from '@site/src/hooks/useENTSOE';
import styles from './ENTSOEDashboard.module.css';

// ─── Componentes internos ───────────────────────────────────────────────

function KpiCard({ label, value, unit, sub, variant = 'cyan', loading, delta, note }) {
  const deltaColor = delta === null
    ? 'inherit'
    : delta.absolute >= 0
      ? 'hsl(0 75% 60%)'  // rojo = más que 28-A
      : 'hsl(150 60% 45%)'; // verde = menos

  return (
    <div className={`${styles.kpiCard} ${styles[`kpi--${variant}`]}`}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValueRow}>
        {loading ? (
          <span className={styles.kpiSkeleton} />
        ) : value !== null ? (
          <>
            <span className={styles.kpiValue}>
              {typeof value === 'number'
                ? value.toLocaleString('es-ES', { maximumFractionDigits: 0 })
                : value}
            </span>
            <span className={styles.kpiUnit}>{unit}</span>
            <span className={`${styles.kpiPulse} ${styles[`pulse--${variant}`]}`} />
          </>
        ) : (
          <span className={styles.kpiError}>—</span>
        )}
      </div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
      {delta !== null && (
        <div className={styles.kpiDelta} style={{ color: deltaColor }}>
          {delta.absolute >= 0 ? '▲' : '▼'} {Math.abs(delta.absolute).toLocaleString('es-ES', { maximumFractionDigits: 0 })} {unit}
          {' '}({delta.percent >= 0 ? '+' : ''}{delta.percent.toFixed(1)}% vs 28-A)
        </div>
      )}
      {note && <div className={styles.kpiNote}>{note}</div>}
    </div>
  );
}

function StatusBadge({ loading, error, lastUpdate, label }) {
  if (error)   return <span className={`${styles.badge} ${styles.badgeError}`}>⚠ {error}</span>;
  if (loading) return <span className={`${styles.badge} ${styles.badgeLoading}`}>⟳ Cargando…</span>;
  return (
    <span className={`${styles.badge} ${styles.badgeLive}`}>
      ● EN VIVO · {label}
      {lastUpdate && (
        <span className={styles.badgeTime}>
          {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC
        </span>
      )}
    </span>
  );
}

function ForensicTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow} style={{ color: p.color }}>
          <span className={styles.tooltipLabel}>{p.name}:</span>
          <span className={styles.tooltipValue}>
            {typeof p.value === 'number'
              ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 1 })
              : p.value}{' '}{unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Panel 1: Generación España ─────────────────────────────────────────

function GenerationPanel() {
  // ENTSO-E indicador A65 — generación actual por tipo
  const { data, loading, error, lastUpdate } = useENTSOEData('generation', 'ES', 300_000, 24);

  const currentMW = getLatestValue(data);
  const series    = getTimeseries(data, 48);
  const ref28A    = SNAPSHOT_28A.generation_es.total_mw;
  const delta     = currentMW !== null ? getDelta(currentMW, ref28A) : null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>GENERACIÓN ESPAÑA</span>
        <StatusBadge loading={loading} error={error} lastUpdate={lastUpdate} label="ENTSO-E A65" />
      </div>
      <div className={styles.panelBody}>
        <KpiCard
          label="Generación total"
          value={currentMW}
          unit="MW"
          variant="cyan"
          loading={loading}
          delta={delta}
          note="Indicador ENTSO-E A65: Actual Generation per Production Type"
        />
        {series.length > 0 && (
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={series} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(190 100% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(190 100% 60%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(220 12% 55%)' }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220 12% 55%)' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
                <Tooltip content={<ForensicTooltip unit="MW" />} />
                <ReferenceLine
                  y={ref28A}
                  stroke="hsl(38 100% 56%)"
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{ value: '28-A', fill: 'hsl(38 100% 56%)', fontSize: 9 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Generación"
                  stroke="hsl(190 100% 60%)"
                  strokeWidth={2}
                  fill="url(#genGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className={styles.chartCaption}>
              Generación total (MW) en España. Línea ámbar: valor al momento del 28-A (29,6 GW).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel 2: Demanda España ────────────────────────────────────────────

function DemandPanel() {
  // ENTSO-E indicador A71 — demanda actual
  const { data, loading, error, lastUpdate } = useENTSOEData('demand', 'ES', 300_000, 24);

  const currentMW = getLatestValue(data);
  const series    = getTimeseries(data, 48);
  const ref28A    = SNAPSHOT_28A.demand_es.total_mw;
  const delta     = currentMW !== null ? getDelta(currentMW, ref28A) : null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>DEMANDA ESPAÑA</span>
        <StatusBadge loading={loading} error={error} lastUpdate={lastUpdate} label="ENTSO-E A71" />
      </div>
      <div className={styles.panelBody}>
        <KpiCard
          label="Demanda actual"
          value={currentMW}
          unit="MW"
          variant="amber"
          loading={loading}
          delta={delta}
          note="Indicador ENTSO-E A71: Total Load - Day Ahead / Actual"
        />
        {series.length > 0 && (
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={series} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(220 12% 55%)' }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220 12% 55%)' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
                <Tooltip content={<ForensicTooltip unit="MW" />} />
                <ReferenceLine
                  y={ref28A}
                  stroke="hsl(38 100% 56%)"
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{ value: '28-A', fill: 'hsl(38 100% 56%)', fontSize: 9 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Demanda"
                  stroke="hsl(38 100% 56%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className={styles.chartCaption}>
              Demanda total (MW) en España. Línea ámbar: valor al momento del 28-A (25,8 GW).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel 3: Comparativa Ahora vs. 28-A ────────────────────────────────

function ComparisonPanel() {
  const { data: genData, loading: genLoading } = useENTSOEData('generation', 'ES', 300_000, 24);
  const { data: demandData, loading: demandLoading } = useENTSOEData('demand', 'ES', 300_000, 24);

  const genNow    = getLatestValue(genData);
  const demandNow = getLatestValue(demandData);

  const gen28A    = SNAPSHOT_28A.generation_es.total_mw;
  const demand28A = SNAPSHOT_28A.demand_es.total_mw;

  // Ratio carga/generación (margen de estabilidad simplificado)
  const ratioNow = genNow && demandNow ? (demandNow / genNow) : null;
  const ratio28A = demand28A / gen28A;

  const loading = genLoading || demandLoading;

  return (
    <div className={`${styles.panel} ${styles.panelWide}`}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>AHORA vs. 28-A (12:30 CEST)</span>
        {!loading && <span className={`${styles.badge} ${styles.badgeLive}`}>● TIEMPO REAL</span>}
      </div>
      <div className={styles.panelBody}>
        <div className={styles.compGrid}>
          <CompRow
            metric="Generación"
            now={genNow}
            ref={gen28A}
            unit="MW"
            loading={genLoading}
          />
          <CompRow
            metric="Demanda"
            now={demandNow}
            ref={demand28A}
            unit="MW"
            loading={demandLoading}
          />
          <CompRow
            metric="Ratio demanda/generación"
            now={ratioNow}
            ref={ratio28A}
            unit="—"
            loading={loading}
            isPercent={true}
          />
        </div>

        <div className={styles.compLegend}>
          <span className={styles.legendDot} style={{ background: 'hsl(190 100% 60%)' }} />
          <span>Ahora (en vivo)</span>
          <span className={styles.legendDot} style={{ background: 'hsl(38 100% 56%)' }} />
          <span>28-A · 12:30 CEST (Informe Factual ENTSO-E)</span>
        </div>

        <p className={styles.compNote}>
          El ratio demanda/generación indica la carga relativa del sistema.
          Un ratio cercano a 0,9+ indica operación en "red ligera" — condición que precede a inestabilidad de tensión.
          El 28-A operaba a ratio 0,87 en un escenario de muy baja inercia (H=2,3s) y SCR degradado.
        </p>
      </div>
    </div>
  );
}

function CompRow({ metric, now, ref, unit, loading, isPercent }) {
  const nowFmt = now !== null && !loading
    ? isPercent
      ? (now * 100).toFixed(2) + '%'
      : now.toLocaleString('es-ES', { maximumFractionDigits: 0 })
    : '—';
  const refFmt = isPercent ? (ref * 100).toFixed(2) + '%' : ref.toLocaleString('es-ES', { maximumFractionDigits: 0 });
  const pct = now !== null ? Math.min((now / ref) * 100, 200) : 0;
  const diff = now !== null ? now - ref : null;

  return (
    <div className={styles.compRow}>
      <div className={styles.compLabel}>{metric}</div>
      <div className={styles.compBars}>
        <div className={styles.compBarRef}>
          <div className={styles.compBarFill} style={{ width: '100%', background: 'hsl(38 100% 56% / 0.4)' }} />
          <span className={styles.compBarLabel}>{refFmt} {unit}</span>
        </div>
        <div className={styles.compBarNow}>
          {loading ? (
            <div className={styles.compBarSkeleton} />
          ) : (
            <>
              <div
                className={styles.compBarFill}
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: pct > 110 ? 'hsl(0 75% 56%)' : pct > 90 ? 'hsl(38 100% 56%)' : 'hsl(190 100% 60%)',
                }}
              />
              <span className={styles.compBarLabel}>{nowFmt} {unit}</span>
            </>
          )}
        </div>
      </div>
      {diff !== null && (
        <div className={`${styles.compDiff} ${diff >= 0 ? styles.diffPos : styles.diffNeg}`}>
          {diff >= 0 ? '+' : ''}{isPercent ? (diff * 100).toFixed(2) : diff.toLocaleString('es-ES', { maximumFractionDigits: 0 })} {unit}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────────────

function ENTSOEDashboardInner() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashHeader}>
        <div className={styles.dashTitleRow}>
          <span className={styles.dashIcon}>⚡</span>
          <div>
            <h3 className={styles.dashTitle}>ENTSO-E Transparency Platform — Sistema Ibérico en Vivo</h3>
            <p className={styles.dashSub}>
              European Network of Transmission System Operators for Electricity ·
              Datos España + Portugal · Indicadores A65 (generación) · A71 (demanda)
            </p>
          </div>
        </div>
        <div className={styles.tabs}>
          {[
            { id: 'overview',   label: 'Vista general' },
            { id: 'generation', label: 'Generación' },
            { id: 'demand',     label: 'Demanda' },
            { id: 'comparison', label: 'Ahora vs. 28-A' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className={styles.dashContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <GenerationPanel />
            <DemandPanel />
            <ComparisonPanel />
          </div>
        )}
        {activeTab === 'generation'  && <GenerationPanel />}
        {activeTab === 'demand'      && <DemandPanel />}
        {activeTab === 'comparison'  && <ComparisonPanel />}
      </div>

      {/* Footer */}
      <div className={styles.dashFooter}>
        Fuente: ENTSO-E Transparency Platform · 
        Red Eléctrica de España (REE) · REN Portugal ·
        Datos del 28-A: Informe Factual ENTSO-E · Período 28 de abril de 2025
      </div>
    </div>
  );
}

export default function ENTSOEDashboard() {
  return (
    <BrowserOnly fallback={
      <div style={{
        padding: '2rem',
        border: '1px solid hsl(190 100% 60% / 0.2)',
        borderRadius: '12px',
        color: 'hsl(220 12% 55%)',
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
      }}>
        Cargando datos en vivo de ENTSO-E…
      </div>
    }>
      {() => <ENTSOEDashboardInner />}
    </BrowserOnly>
  );
}
