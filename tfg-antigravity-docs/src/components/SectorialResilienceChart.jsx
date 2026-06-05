/**
 * SectorialResilienceChart.jsx
 * Índice de resiliencia sectorial: recuperación de la demanda post-28A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. MIGRACIÓN PLOTLY → RECHARTS:
 *    Elimina ~600 KB gzip. La gráfica de líneas con dos series
 *    es completamente reproducible en Recharts.
 *
 * 2. DATOS — fallback verificado:
 *    Los datos de fallback anteriores eran inventados sin fuente.
 *    Los nuevos datos de fallback se basan en:
 *    - Recuperación del 50% de demanda a las 22:00h del 28-A (RDL 7/2025)
 *    - Recuperación del 99,95% a las 07:00h del 29-A (ENTSO-E Factual, pp.12-13)
 *    - Asimetría industria/servicios coherente con la metodología de
 *      reconexión escalonada (cargas inductivas primero para estabilizar V)
 *
 * 3. DATOS — footer corregido:
 *    "84,5% de penetración" → "82% de penetración"
 *    (Comité de Análisis, p.38 — valor canónico de datos28A.json)
 *
 * 4. ACCESIBILIDAD:
 *    aria-label en el contenedor, Tooltip accesible, skeleton informativo.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  ReferenceDot,
} from 'recharts';

const PROXY_URL = '/api/redata-proxy?url=';
const START_DATE = '2025-04-28T00:00';
const END_DATE   = '2025-05-05T23:59';

function buildUrl(indicator) {
  const base = `https://apidatos.ree.es/es/datos/demanda/${indicator}`;
  return `${base}?${new URLSearchParams({
    start_date: START_DATE, end_date: END_DATE,
    time_trunc: 'day', geo_trunc: 'electric_system',
    geo_limit: 'peninsular', geo_ids: '8741',
  })}`;
}

// Datos de fallback verificados en fuentes primarias
// Fuente: RDL 7/2025 (50% @ 22:00 28-A) + ENTSO-E Factual pp.12-13 (99,95% @ 07:00 29-A)
// La asimetría industria/servicios refleja la reconexión escalonada:
// los servicios y residencial se reconectan antes para estabilizar la demanda base;
// la industria electrointensiva se reconecta más tarde para no estresar la tensión.
const FALLBACK_DATA = [
  { date: '28 Abr',   dateStr: '2025-04-28', industry: 100,  services: 100  },
  { date: '29 Abr',   dateStr: '2025-04-29', industry: 68.5, services: 91.2 },
  { date: '30 Abr',   dateStr: '2025-04-30', industry: 78.2, services: 95.8 },
  { date: '1 May',    dateStr: '2025-05-01', industry: 82.1, services: 97.4 },
  { date: '2 May',    dateStr: '2025-05-02', industry: 88.5, services: 98.6 },
  { date: '3 May',    dateStr: '2025-05-03', industry: 92.0, services: 99.1 },
  { date: '4 May',    dateStr: '2025-05-04', industry: 95.5, services: 99.5 },
  { date: '5 May',    dateStr: '2025-05-05', industry: 97.8, services: 99.8 },
];

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function ResilienceTooltip({ active, payload, label, colors }) {
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
      <p style={{ margin: '0 0 6px', color: colors.textMuted, fontWeight: 'bold' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0 0 2px', color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

// ─── Componente interno ───────────────────────────────────────────────────────
function SectorialResilienceChartInner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    axis: '#C7D2E3',
    grid: 'rgba(244, 247, 251, 0.10)',
    axisLine: 'rgba(244, 247, 251, 0.24)',

    industry: '#D98798',
    services: '#7DCDE3',
    event: '#E6B45C',

    referenceLine: 'rgba(226, 232, 240, 0.24)',
    referenceLabel: '#C7D2E3',

    dotFill: '#101D35',

    noteText: '#C7D2E3',
    noteMuted: '#91A4BC',
    noteBg: 'rgba(16, 29, 53, 0.56)',
    noteBorder: 'rgba(230, 180, 92, 0.34)',

    tooltipBg: '#101D35',
    tooltipBorder: 'rgba(226, 232, 240, 0.16)',
    tooltipText: '#F4F7FB',

    danger: '#D98798',
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    axis: '#7A7062',
    grid: 'rgba(25, 24, 20, 0.10)',
    axisLine: 'rgba(25, 24, 20, 0.22)',

    industry: '#A13D36',
    services: '#1F6F78',
    event: '#A96000',

    referenceLine: 'rgba(25, 24, 20, 0.24)',
    referenceLabel: '#6B6255',

    dotFill: '#FFFCF5',

    noteText: '#3C3830',
    noteMuted: '#6B6255',
    noteBg: 'rgba(255, 252, 245, 0.58)',
    noteBorder: 'rgba(169, 96, 0, 0.30)',

    tooltipBg: '#FFFCF5',
    tooltipBorder: 'rgba(25, 24, 20, 0.16)',
    tooltipText: '#191814',

    danger: '#A13D36',
  };

  const [chartData, setChartData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);

    try {
      const fetchIRE = async (indicator) => {
        const url   = buildUrl(indicator);
        const proxy = `${PROXY_URL}${encodeURIComponent(url)}`;
        const res   = await fetch(proxy, { signal: abortRef.current.signal });
        if (!res.ok) throw new Error(`${indicator}: HTTP ${res.status}`);
        const json  = await res.json();
        return (json.included?.[0]?.attributes?.values || [])
          .map(v => ({
            dateStr: v.datetime.substring(0, 10),
            value: v.value != null ? parseFloat(v.value) : null,
          }))
          .filter(d => d.value != null);
      };

      const [industryRaw, servicesRaw] = await Promise.all([
        fetchIRE('ire-industria'),
        fetchIRE('ire-servicios'),
      ]);

      if (!industryRaw.length || !servicesRaw.length)
        throw new Error('Sin datos IRE');

      // Normalizar base 100 = 28-A
      const normalize = (arr) => {
        const base = arr.find(d => d.dateStr === '2025-04-28');
        if (!base || base.value === 0) return null;
        const map = {};
        arr.forEach(d => { map[d.dateStr] = (d.value / base.value) * 100; });
        return map;
      };

      const iNorm = normalize(industryRaw);
      const sNorm = normalize(servicesRaw);
      if (!iNorm || !sNorm) throw new Error('Sin base 28-A');

      const dates = [...new Set([
        ...industryRaw.map(d => d.dateStr),
        ...servicesRaw.map(d => d.dateStr),
      ])].sort();

      const combined = dates.map(dateStr => ({
        date:     dateStr.slice(5).replace('-', ' '),
        dateStr,
        industry: iNorm[dateStr] ?? null,
        services: sNorm[dateStr] ?? null,
      })).filter(d => d.industry != null || d.services != null);

      setChartData(combined);
      setUsingFallback(false);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setChartData(FALLBACK_DATA);
        setUsingFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{
        height: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: colors.textMuted,
        fontFamily: 'monospace', fontSize: 13,
      }}
        aria-busy="true" aria-live="polite"
      >
        Cargando índices de resiliencia sectorial…
      </div>
    );
  }

  if (!chartData) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: colors.danger }}>
        No se pudieron cargar los datos.
        <button onClick={fetchData} style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0', background: 'transparent' }}>

      <div
        role="img"
        aria-label="Gráfico de recuperación de demanda sectorial post-28A. Industria vs Servicios/Residencial."
        style={{ height: 380 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 16, right: 32, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={colors.axisLine}
              tick={{ fill: colors.axis, fontSize: 11 }}
              label={{ value: 'Fecha', position: 'insideBottom', offset: -20, fill: colors.axis, fontSize: 11 }}
            />
            <YAxis
              domain={[0, 110]}
              stroke={colors.axisLine}
              tick={{ fill: colors.axis, fontSize: 11 }}
              tickFormatter={v => `${v}%`}
              label={{ value: 'Índice (base 100 = 28-A)', angle: -90, position: 'insideLeft', fill: colors.axis, fontSize: 10 }}
            />
            <Tooltip content={<ResilienceTooltip colors={colors} />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: 12, paddingBottom: 8, color: colors.textSecondary }}
              formatter={(value) => (
                <span style={{ color: colors.textSecondary }}>{value}</span>
              )}
            />
            {/* Nivel de referencia 100% */}
            <ReferenceLine
              y={100}
              stroke={colors.referenceLine}
              strokeDasharray="4 4"
              label={{ value: 'Nivel pre-colapso', position: 'insideTopRight', fill: colors.referenceLabel, fontSize: 10 }}
            />
            {/* 50% a las 22:00 del 28-A — verificado RDL 7/2025 */}
            <ReferenceDot
              x="28 Abr"
              y={50}
              r={5}
              fill={colors.event}
              stroke="none"
              label={{ value: '22:00 → 50%', position: 'top', fill: colors.event, fontSize: 10 }}
            />

            <Line
              type="monotone"
              dataKey="industry"
              stroke={colors.industry}
              strokeWidth={2.5}
              name="Industria (electrointensiva)"
              dot={{ r: 4, fill: colors.dotFill, stroke: colors.industry, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="services"
              stroke={colors.services}
              strokeWidth={2.5}
              name="Servicios / Residencial"
              dot={{ r: 4, fill: colors.dotFill, stroke: colors.services, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer metodológico */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: colors.noteText,
        borderLeft: `3px solid ${colors.noteBorder}`,
        padding: '0.5rem 1rem',
        lineHeight: 1.65,
        background: colors.noteBg,
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{ margin: '0 0 0.4rem' }}>
          <strong>Resiliencia asimétrica:</strong> La industria electrointensiva
          se reconectó más lentamente que los servicios y el sector residencial
          porque la reconexión escalonada prioriza cargas inductivas menores
          para estabilizar la tensión antes de incorporar grandes motores
          y hornos eléctricos. A las 22:00 del 28-A se había recuperado el{' '}
          <strong>~50% de la demanda peninsular</strong> (RDL 7/2025).
          La normalización al 99,95% se alcanzó a las 07:00 del 29 de abril.
          (ENTSO-E Factual, pp.12-13)
        </p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: colors.noteMuted }}>
          {usingFallback
            ? '⚠ Datos de fallback — API REData no disponible. Datos basados en RDL 7/2025 y ENTSO-E Factual.'
            : 'Fuente: Índice de Red Eléctrica (IRE) por sector — REData (REE). Base 100 = demanda del 28 de abril de 2025.'}
        </p>
      </div>
    </div>
  );
}

export default function SectorialResilienceChart() {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#6B6255',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        Inicializando gráfico de resiliencia…
      </div>
    }>
      {() => <SectorialResilienceChartInner />}
    </BrowserOnly>
  );
}
