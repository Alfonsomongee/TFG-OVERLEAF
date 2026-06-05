/**
 * DemandaRenovableTrend.jsx
 * Barras comparativas: mix de generación Ahora vs 28-A.
 * Datos en tiempo real: /api/esios-multi (ESIOS/REE, refresco 5 min)
 * Datos históricos 28-A: /data/blackout_snapshot_28A.json
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. MIGRACIÓN Plotly → Recharts (barras agrupadas):
 *    El gráfico de barras agrupadas es el caso más claro donde
 *    Recharts reemplaza a Plotly sin pérdida de funcionalidad.
 *    Reducción: ~550 KB gzip eliminados de este chunk.
 *
 * 2. La lógica de comparación 28-A vs ahora con ESIOS
 *    permanece INTACTA — es el propósito central del componente.
 *
 * 3. Fallback 28-A hardcodeado si el JSON no carga:
 *    Los valores del snapshot deben ser coherentes con:
 *    - Demanda peninsular: 25.184 MW (Comité de Análisis, p.38)
 *    - Solar FV: ~13.400 MW (~53,3% del mix)
 *    - Nuclear: ~2.518 MW (~10%)
 *    - Gas: ~756 MW (~3%)
 *    Si blackout_snapshot_28A.json tiene datos distintos,
 *    prevalecen los del JSON (fuente de datos externa).
 *
 * 4. Accesibilidad: role="img" + aria-label en el contenedor.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Fallback 28-A si el JSON no carga
// Fuente: Comité de Análisis del Gobierno, p.38 (MW estimados proporcionales)
const FALLBACK_28A = {
  demanda:         25184,
  renovable_total: 20651,  // ~82% de 25184
  eolica:          3022,   // ~12%
  solar:           13428,  // ~53,3%
  nuclear:         2518,   // ~10%
  gas:             756,    // ~3%
};

const VARS = [
  { key: 'demanda',         label: 'Demanda',      color28A: '#ef4444', colorHoy: '#06b6d4' },
  { key: 'renovable_total', label: 'Renovable',    color28A: '#f87171', colorHoy: '#10b981' },
  { key: 'solar',           label: 'Solar FV',     color28A: '#fca5a5', colorHoy: '#f59e0b' },
  { key: 'eolica',          label: 'Eólica',       color28A: '#fca5a5', colorHoy: '#a78bfa' },
  { key: 'nuclear',         label: 'Nuclear',      color28A: '#fca5a5', colorHoy: '#60a5fa' },
  { key: 'gas',             label: 'C. Combinado', color28A: '#fca5a5', colorHoy: '#9ca3af' },
];

// Tooltip personalizado
function CustomTooltip({ active, payload, label, colors }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: colors.tooltipBg,
      border: `1px solid ${colors.tooltipBorder}`,
      borderRadius: 6,
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: colors.tooltipText,
    }}>
      <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: colors.textMuted }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0 0 2px', color: p.fill }}>
          {p.name}: {p.value?.toLocaleString('es-ES')} MW
        </p>
      ))}
    </div>
  );
}

function Chip({ label, value, color, colors }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 160,
      background: colors.chipBg,
      border: `1px solid ${colors.chipBorder}`,
      borderRadius: 8,
      padding: '0.5rem 0.8rem',
      textAlign: 'center',
    }}>
      <span style={{
        display: 'block', fontSize: '0.6rem', color: colors.chipLabel,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem',
        fontFamily: 'monospace',
      }}>
        {label}
      </span>
      <span style={{ fontSize: '1rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function DemandaRenovableTrendInner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    axis: '#C7D2E3',
    grid: 'rgba(244, 247, 251, 0.10)',
    axisLine: 'rgba(244, 247, 251, 0.24)',

    bar28A: '#D98798',
    barNow: '#7DCDE3',

    danger: '#D98798',
    success: '#A6C67B',
    warning: '#E6B45C',

    warningSoft: 'rgba(230, 180, 92, 0.11)',
    warningBorder: 'rgba(230, 180, 92, 0.34)',

    chipBg: 'rgba(16, 29, 53, 0.72)',
    chipBorder: 'rgba(226, 232, 240, 0.14)',
    chipLabel: '#91A4BC',

    tooltipBg: '#101D35',
    tooltipBorder: 'rgba(226, 232, 240, 0.16)',
    tooltipText: '#F4F7FB',

    footer: '#91A4BC',
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    axis: '#7A7062',
    grid: 'rgba(25, 24, 20, 0.10)',
    axisLine: 'rgba(25, 24, 20, 0.22)',

    bar28A: '#A13D36',
    barNow: '#1F6F78',

    danger: '#A13D36',
    success: '#2F6B4F',
    warning: '#A96000',

    warningSoft: 'rgba(169, 96, 0, 0.10)',
    warningBorder: 'rgba(169, 96, 0, 0.30)',

    chipBg: 'rgba(255, 252, 245, 0.78)',
    chipBorder: 'rgba(25, 24, 20, 0.14)',
    chipLabel: '#8A7C6A',

    tooltipBg: '#FFFCF5',
    tooltipBorder: 'rgba(25, 24, 20, 0.16)',
    tooltipText: '#191814',

    footer: '#9B9285',
  };

  const [current,    setCurrent]    = useState(null);
  const [snapshot,   setSnapshot]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [apiError,   setApiError]   = useState(false);

  const fetchCurrent = useCallback(async () => {
    try {
      const res = await fetch('/api/esios-multi');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setCurrent(await res.json());
      setLastUpdate(new Date());
      setApiError(false);
    } catch {
      setApiError(true);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/esios-multi').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/data/blackout_snapshot_28A.json').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([cur, snap]) => {
      setCurrent(cur);
      setSnapshot(snap || FALLBACK_28A);
      if (cur) setLastUpdate(new Date());
      if (!cur) setApiError(true);
    }).finally(() => setLoading(false));

    const id = setInterval(fetchCurrent, 300_000);
    return () => clearInterval(id);
  }, [fetchCurrent]);

  // Datos para el gráfico
  const chartData = useMemo(() => {
    const snap = snapshot || FALLBACK_28A;
    return VARS.map(v => ({
      name:  v.label,
      '28-A': snap[v.key]    ?? 0,
      'Ahora': current?.[v.key] ?? 0,
    }));
  }, [current, snapshot]);

  // Chips de comparación
  const snap = snapshot || FALLBACK_28A;
  const demandaDelta = current?.demanda && snap?.demanda
    ? ((current.demanda - snap.demanda) / snap.demanda * 100).toFixed(1)
    : null;
  const renovDelta = current?.renovable_total && snap?.renovable_total
    ? ((current.renovable_total - snap.renovable_total) / snap.renovable_total * 100).toFixed(1)
    : null;
  const penetracion = current?.penetracion_renovable ?? null;

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 300, color: colors.textMuted,
        fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'monospace',
      }}
        aria-busy="true" aria-live="polite"
      >
        Cargando tendencia…
      </div>
    );
  }

  return (
    <div style={{ background: 'transparent', padding: '1rem 0' }}>

      {/* Banner API caída */}
      {apiError && (
        <div style={{
          marginBottom: '0.75rem', padding: '0.4rem 0.9rem',
          background: colors.warningSoft,
          border: `1px solid ${colors.warningBorder}`,
          borderRadius: 6, fontSize: 11,
          color: colors.warning, fontFamily: 'monospace',
        }} aria-live="polite">
          ⚠ API ESIOS no disponible — columna "Ahora" mostrará ceros
        </div>
      )}

      {/* Gráfico de barras */}
      <div
        role="img"
        aria-label="Gráfico comparativo de mix de generación: 28-A vs sistema actual"
        style={{ height: 380 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 20, left: 8, bottom: 40 }}
                    barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: colors.axis, fontSize: 11, fontFamily: 'monospace' }}
              stroke={colors.axisLine}
            />
            <YAxis
              tick={{ fill: colors.axis, fontSize: 10, fontFamily: 'monospace' }}
              stroke={colors.axisLine}
              tickFormatter={v => `${(v/1000).toFixed(0)}k`}
              label={{ value: 'MW', angle: -90, position: 'insideLeft',
                       fill: colors.axis, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip colors={colors} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'monospace', paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: value === '28-A' ? colors.bar28A : colors.barNow }}>
                  {value === '28-A' ? '28-A (colapso, 12:30 CEST)' : `Ahora${lastUpdate ? ` · ${lastUpdate.toLocaleTimeString('es-ES')}` : ''}`}
                </span>
              )}
            />
            <Bar dataKey="28-A" fill={colors.bar28A} opacity={0.82} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Ahora" fill={colors.barNow} opacity={0.88} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chips de comparación */}
      {(demandaDelta || renovDelta || penetracion) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {demandaDelta && (
            <Chip
              label="Δ Demanda vs 28-A"
              value={`${Number(demandaDelta) > 0 ? '+' : ''}${demandaDelta}%`}
              color={Math.abs(Number(demandaDelta)) < 5 ? colors.success : colors.warning}
              colors={colors}
            />
          )}
          {renovDelta && (
            <Chip
              label="Δ Renovable vs 28-A"
              value={`${Number(renovDelta) > 0 ? '+' : ''}${renovDelta}%`}
              color={Number(renovDelta) > 10 ? colors.danger : Number(renovDelta) < -10 ? colors.success : colors.warning}
              colors={colors}
            />
          )}
          {penetracion && (
            <Chip
              label="Penetración renovable"
              value={`${penetracion.toFixed(1)}%`}
              color={penetracion > 80 ? colors.danger : colors.success}
              colors={colors}
            />
          )}
        </div>
      )}

      <p style={{
        marginTop: '1.25rem', fontSize: '0.7rem',
        color: colors.footer,
        letterSpacing: '0.04em', fontFamily: 'monospace',
      }}>
        {lastUpdate
          ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · Fuente: ESIOS (REE) · Refresco cada 5 min`
          : '⚠ Sin datos en tiempo real · datos 28-A: Comité de Análisis del Gobierno, p.38'}
      </p>
    </div>
  );
}

export default function DemandaRenovableTrend() {
  return (
    <BrowserOnly fallback={
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 300, color: '#6B6255',
        fontSize: '0.8rem', fontFamily: 'monospace',
      }}>
        Cargando…
      </div>
    }>
      {() => <DemandaRenovableTrendInner />}
    </BrowserOnly>
  );
}
