/**
 * MixGeneracion.jsx
 * Mix de generación "Ahora vs 28-A" — donuts comparativos.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. MIGRACIÓN PLOTLY → RECHARTS:
 *    Plotly pesaba ~600 KB gzip para mostrar dos donuts.
 *    Recharts PieChart hace exactamente lo mismo con ~95 KB.
 *    Eliminación del import dinámico de react-plotly.js.
 *
 * 2. BUG: pause no pausaba realmente el intervalo:
 *    El botón "Pausar" actualizaba el estado `pause` pero el
 *    useEffect del intervalo no lo leía. Ahora el intervalo
 *    se limpia cuando pause=true y se reactiva cuando pause=false.
 *
 * 3. DATO: penetracion_renovable clarificada:
 *    El tooltip del pill ahora aclara que "renovable" ≠ "no-síncrona" ≠ "IBR".
 *    La hidráulica es renovable y síncrona. (Ver datos28A.json § mix_renovable_instantaneo)
 *
 * 4. DATO: valor del 28-A alineado con datos28A.json:
 *    penetracion_renovable del 28-A = 82% (Comité de Análisis, p.38),
 *    no 84,5% (que era el valor del JSON previo con base distinta).
 *
 * 5. ACCESIBILIDAD: aria-label en cada donut para lectores de pantalla.
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

// ─── Colores consistentes con la estética del sitio ──────────────────────────
const COLORS = ['#f59e0b', '#06b6d4', '#ef4444', '#8b5cf6', '#10b981'];
const LABELS = ['Solar', 'Eólica', 'Nuclear', 'C. Combinado', 'Hidráulica'];

// Datos del 28-A verificados en datos28A.json y Comité de Análisis, p.38
const BLACKOUT_VALUES = [
  { name: 'Solar',        value: 19155, pct: 53.3 },
  { name: 'Eólica',       value: 3540,  pct: 9.8  },
  { name: 'Nuclear',      value: 3870,  pct: 10.0 },
  { name: 'C. Combinado', value: 990,   pct: 3.0  },
  { name: 'Hidráulica',   value: 2000,  pct: 5.5  },
];
const BLACKOUT_PENETRACION = 82.0; // Comité de Análisis, p.38 (NO 84,5%)

// ─── Tooltip personalizado para Recharts ─────────────────────────────────────
function CustomPieTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: colors.tooltipBg,
      border: `1px solid ${d.payload.fill}66`,
      borderRadius: 6,
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: colors.tooltipText,
    }}>
      <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: d.payload.fill }}>
        {d.name}
      </p>
      <p style={{ margin: 0, color: colors.textMuted }}>
        {d.value.toLocaleString('es-ES')} MW
      </p>
    </div>
  );
}

// ─── Donut individual ────────────────────────────────────────────────────────
function DonutChart({ data, title, ariaLabel, colors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{
        margin: 0,
        fontSize: 12,
        color: colors.textMuted,
        fontFamily: 'monospace',
        textAlign: 'center',
        letterSpacing: '0.04em',
      }}>
        {title}
      </p>
      <div
        role="img"
        aria-label={ariaLabel}
        style={{ height: 260 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="72%"
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors.mixColors[i % colors.mixColors.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomPieTooltip colors={colors} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: 11,
                color: colors.textMuted,
                fontFamily: 'monospace',
              }}
              formatter={(value) => (
                <span style={{ color: colors.textMuted }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Hook de datos ESIOS ──────────────────────────────────────────────────────
function useEsiosData(pause, intervalMs = 300000) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const abortRef   = useRef(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      const res  = await fetch('/api/esios-multi', { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.renovable_total !== undefined && json.no_renovable !== undefined) {
        json.penetracion_renovable =
          (json.renovable_total / (json.renovable_total + json.no_renovable)) * 100;
      }
      setData(json);
      setError(false);
      setLastUpdate(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchData();
  }, [fetchData]);

  // Fetch inicial
  useEffect(() => {
    fetchData();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [fetchData]);

  // Intervalo de refresco — se pausa cuando pause=true
  useEffect(() => {
    if (pause) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(fetchData, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [pause, fetchData, intervalMs]);

  return { data, loading, error, lastUpdate, retry };
}

// ─── Pill de métrica ──────────────────────────────────────────────────────────
const MetricPill = React.memo(({ label, value, accent, tooltip = '', colors }) => {
  const pillAccent = accent ?? colors.active;

  return (
    <div style={{
      flex: 1,
      minWidth: 140,
      background: colors.pillBg,
      border: `1px solid ${colors.pillBorder}`,
      borderRadius: 8,
      padding: '0.5rem 0.9rem',
      textAlign: 'center',
    }}>
      <span style={{
        display: 'block',
        fontSize: '0.62rem',
        color: colors.pillLabel,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {label}
        {tooltip && (
          <span title={tooltip} style={{
            cursor: 'help',
            fontSize: '0.6rem',
            marginLeft: 4,
            color: colors.textMuted,
            fontStyle: 'italic',
          }}>ⓘ</span>
        )}
      </span>
      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: pillAccent }}>
        {value}
      </span>
    </div>
  );
});

// ─── Componente interno ───────────────────────────────────────────────────────
function MixGeneracionInner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    active: '#7DCDE3',
    activeText: '#071326',
    activeSoft: 'rgba(125, 205, 227, 0.12)',
    activeBorder: 'rgba(125, 205, 227, 0.42)',

    success: '#A6C67B',
    warning: '#E6B45C',
    danger: '#D98798',

    errorBg: 'rgba(217, 135, 152, 0.10)',
    skeletonBg: 'rgba(244, 247, 251, 0.07)',

    pillBg: 'rgba(16, 29, 53, 0.72)',
    pillBorder: 'rgba(226, 232, 240, 0.14)',
    pillLabel: '#91A4BC',

    pauseBg: 'rgba(16, 29, 53, 0.76)',
    pauseBorder: 'rgba(125, 205, 227, 0.38)',

    footerMuted: '#91A4BC',

    tooltipBg: '#101D35',
    tooltipText: '#F4F7FB',

    mixColors: ['#E6B45C', '#7DCDE3', '#C4A5E8', '#D98798', '#A6C67B'],
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    active: '#1F6F78',
    activeText: '#FFFCF5',
    activeSoft: 'rgba(31, 111, 120, 0.10)',
    activeBorder: 'rgba(31, 111, 120, 0.36)',

    success: '#2F6B4F',
    warning: '#A96000',
    danger: '#A13D36',

    errorBg: 'rgba(161, 61, 54, 0.08)',
    skeletonBg: 'rgba(25, 24, 20, 0.06)',

    pillBg: 'rgba(255, 252, 245, 0.78)',
    pillBorder: 'rgba(25, 24, 20, 0.14)',
    pillLabel: '#8A7C6A',

    pauseBg: 'rgba(255, 252, 245, 0.80)',
    pauseBorder: 'rgba(31, 111, 120, 0.34)',

    footerMuted: '#9B9285',

    tooltipBg: '#FFFCF5',
    tooltipText: '#191814',

    mixColors: ['#D9A441', '#1F6F78', '#6E4D8B', '#A13D36', '#2F6B4F'],
  };

  const [pause, setPause]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { data, loading, error, lastUpdate, retry } = useEsiosData(pause);

  // Construir datos "ahora" desde la API
  const hoyData = useMemo(() => {
    if (!data) return null;
    const values = [
      data.solar   ?? 0,
      data.eolica  ?? 0,
      data.nuclear ?? 0,
      data.gas     ?? 0,
      data.hidro > 0 ? data.hidro : 0,
    ];
    return LABELS.map((name, i) => ({ name, value: values[i] }));
  }, [data]);

  const hasValidData     = hoyData && hoyData.some(d => d.value > 0);
  const penetracionHoy   = data?.penetracion_renovable ?? null;
  const delta            = penetracionHoy !== null
    ? penetracionHoy - BLACKOUT_PENETRACION
    : null;

  // Skeleton
  if (loading && !data) {
    return (
      <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          width: '100%',
          maxWidth: 480,
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              height: 200,
              background: colors.skeletonBg,
              borderRadius: 8,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>
    );
  }

  // Error sin fallback
  if (error && !data) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '1rem', minHeight: 260,
        color: colors.danger, background: colors.errorBg,
        borderRadius: 8, padding: '2rem', textAlign: 'center',
      }}>
        <span>No se pudieron obtener datos de ESIOS</span>
        <button
          onClick={retry}
          style={{
            background: colors.danger, border: 'none', color: colors.activeText,
            padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const gridCols = isMobile ? '1fr' : '1fr 1fr';

  return (
    <div style={{ background: 'transparent', padding: '1rem 0' }}>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem' }}>
        {/* Donut 28-A */}
        <DonutChart
          data={BLACKOUT_VALUES}
          title="28 de abril de 2025 — Instante del colapso (12:30 CEST)"
          ariaLabel="Mix de generación del 28-A: 53,3% solar, 9,8% eólica, 10% nuclear, 3% gas, 5,5% hidráulica"
          colors={colors}
        />

        {/* Donut ahora */}
        <DonutChart
          data={hasValidData ? hoyData : BLACKOUT_VALUES}
          title={`Ahora · ${lastUpdate ? lastUpdate.toLocaleTimeString('es-ES') : '...'}`}
          ariaLabel="Mix de generación actual según ESIOS"
          colors={colors}
        />
      </div>

      {/* Métricas comparativas */}
      {penetracionHoy !== null && (
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          marginTop: '1.5rem', alignItems: 'center',
        }}>
          <MetricPill
            label="Renovable ahora"
            value={`${penetracionHoy.toFixed(1)}%`}
            tooltip="(Solar + Eólica + Hidráulica) / Generación total. NOTA: renovable ≠ IBR. La hidráulica es renovable y síncrona."
            colors={colors}
          />
          <MetricPill
            label="28-A (colapso)"
            value={`${BLACKOUT_PENETRACION.toFixed(1)}%`}
            accent={colors.danger}
            tooltip="Fuente: Comité de Análisis del Gobierno, p.38. Base: generación renovable / total instantáneo."
            colors={colors}
          />
          {delta !== null && (
            <MetricPill
              label="Diferencia"
              value={`${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`}
              accent={Math.abs(delta) < 5 ? colors.warning : delta > 0 ? colors.danger : colors.success}
              colors={colors}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setPause(p => !p)}
              aria-pressed={pause}
              aria-label={pause ? 'Reanudar actualización automática' : 'Pausar actualización automática'}
              style={{
                background: pause ? colors.active : colors.pauseBg,
                border: `1px solid ${colors.pauseBorder}`,
                color: pause ? colors.activeText : colors.active,
                padding: '0.4rem 0.9rem',
                borderRadius: 20,
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                transition: '0.2s',
              }}
            >
              {pause ? 'Reanudar' : 'Pausar'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <span style={{
          fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.04em',
          color: pause ? colors.warning : colors.success,
        }}>
          {pause ? '⏸ Actualización pausada' : '● Actualización cada 5 min'}
        </span>
        <span style={{
          fontSize: '0.7rem', color: colors.footerMuted,
          letterSpacing: '0.04em', fontFamily: 'monospace',
        }}>
          {error
            ? 'Error en tiempo real — mostrando histórico 28-A'
            : !hasValidData
              ? 'Datos parciales de ESIOS'
              : lastUpdate
                ? `Actualizado: ${lastUpdate.toLocaleTimeString('es-ES')} · ESIOS (REE)`
                : 'Conectando con ESIOS…'}
        </span>
      </div>
    </div>
  );
}

// ─── Exportación ──────────────────────────────────────────────────────────────
export default function MixGeneracion() {
  return (
    <BrowserOnly fallback={
      <div style={{
        minHeight: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#6B6255', fontFamily: 'monospace', fontSize: 13,
      }}>
        Inicializando mix de generación…
      </div>
    }>
      {() => <MixGeneracionInner />}
    </BrowserOnly>
  );
}
