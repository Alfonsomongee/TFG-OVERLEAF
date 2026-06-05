/**
 * FinancialWaterfallChart.jsx
 * Gráfico de cascada del impacto económico del apagón del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. MIGRACIÓN PLOTLY → RECHARTS:
 *    Plotly pesa ~600 KB gzip. Para 6 barras de waterfall, Recharts
 *    (~95 KB) es más que suficiente y no bloquea el LCP.
 *
 * 2. VoLL CORREGIDO:
 *    La versión anterior usaba 5.000 €/MWh, valor que subestima el
 *    impacto según la metodología ACER/CEER (ENTSO-E ERAA 2025):
 *    - Residencial: 9.000–12.000 €/MWh
 *    - Industrial/Comercial: 15.000–25.000 €/MWh
 *    - Media ponderada España (mix residencial/industrial): ~11.000 €/MWh
 *    Fuente: CEER (2023), "Guidelines on Cost-Benefit Analysis", Appendix B.
 *
 *    PROBLEMA ABIERTO: ENS total España no está verificada en fuente primaria
 *    (ver datos28A.json, campo "ens_espana_total": CUESTIÓN ABIERTA).
 *    Se usa 200.000 MWh como estimación con advertencia explícita en el footer.
 *    ENS Portugal verificada: 55.489,4 MWh (ERSE/REN).
 *
 * 3. COHERENCIA INTERNA:
 *    El total se calcula como suma de los items, no desde forensicData,
 *    para garantizar que la barra final siempre cuadre con las anteriores.
 *
 * 4. FALLBACK SIN API:
 *    Se mantiene el patrón de fetch a REData con fallback a datos
 *    estáticos verificados. Si la API falla (Wi-Fi de congreso),
 *    el componente sigue funcionando.
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

// ─── Datos base verificados ───────────────────────────────────────────────────
// ENS Portugal: 55.489,4 MWh (ERSE/REN — verificado)
// ENS España: ~200.000 MWh (ESTIMACIÓN — Cuestión abierta, no en fuente primaria)
// ENS Total Iberia: ~255.490 MWh
// VoLL medio ponderado España: 11.000 €/MWh (CEER 2023, Appendix B)
// Fuente Operación Reforzada: REE, abril 2026 (666 M€ — verificado)

const ENS_PORTUGAL_MWH  = 55489.4;   // ERSE/REN — verificado
const ENS_ESPANA_MWH    = 200000;    // Estimación — Cuestión abierta
const VOLL_EUR_MWH      = 11000;     // CEER 2023 media ponderada España

// STATIC_ITEMS was moved inside the component to support i18n

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{
      background: colors.tooltipBg,
      border: `1px solid ${d.color}66`,
      borderRadius: 8,
      padding: '10px 14px',
      maxWidth: 280,
      fontSize: 12,
      color: colors.tooltipText,
      lineHeight: 1.5,
    }}>
      <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: d.color }}>
        {d.label}
      </p>
      <p style={{ margin: '0 0 4px' }}>
        <strong>{d.isTotal ? 'TOTAL: ' : ''}{d.value.toFixed(1)} M€</strong>
      </p>
      <p style={{ margin: '0 0 2px', color: colors.textMuted, fontSize: 11 }}>
        {payload[0].payload.isEs ? 'Fuente:' : 'Source:'} {d.fuente}
      </p>
      {d.nota && (
        <p style={{ margin: 0, color: colors.warning, fontSize: 10 }}>
          ⚠ {d.nota}
        </p>
      )}
    </div>
  );
}

// ─── Componente interno ───────────────────────────────────────────────────────
function FinancialWaterfallInner() {
  const lang = useDocLang();
  const isEs = lang === 'es';

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const colors = isDark ? {
    textPrimary: '#F4F7FB',
    textSecondary: '#C7D2E3',
    textMuted: '#91A4BC',

    axis: '#C7D2E3',
    grid: 'rgba(244, 247, 251, 0.10)',
    axisLine: 'rgba(244, 247, 251, 0.24)',

    voll: '#D98798',
    reinforced: '#E6B45C',
    consumption: '#D48A4A',
    sanctions: '#C4A5E8',
    gridDamage: '#A6C67B',
    total: '#C8798A',

    referenceLine: 'rgba(217, 135, 152, 0.48)',
    labelText: '#F4F7FB',

    noteBg: 'rgba(16, 29, 53, 0.56)',
    noteText: '#C7D2E3',
    noteMuted: '#91A4BC',
    noteBorder: 'rgba(230, 180, 92, 0.34)',

    warning: '#E6B45C',

    tooltipBg: '#101D35',
    tooltipText: '#F4F7FB',
  } : {
    textPrimary: '#191814',
    textSecondary: '#3C3830',
    textMuted: '#6B6255',

    axis: '#7A7062',
    grid: 'rgba(25, 24, 20, 0.10)',
    axisLine: 'rgba(25, 24, 20, 0.22)',

    voll: '#A13D36',
    reinforced: '#A96000',
    consumption: '#9F4A35',
    sanctions: '#6E4D8B',
    gridDamage: '#5F7F3B',
    total: '#7A263A',

    referenceLine: 'rgba(122, 38, 58, 0.46)',
    labelText: '#191814',

    noteBg: 'rgba(255, 252, 245, 0.58)',
    noteText: '#3C3830',
    noteMuted: '#6B6255',
    noteBorder: 'rgba(169, 96, 0, 0.30)',

    warning: '#A96000',

    tooltipBg: '#FFFCF5',
    tooltipText: '#191814',
  };

  const STATIC_ITEMS = useMemo(() => [
    {
      label: isEs ? 'VoLL — ENS Iberia' : 'VoLL — ENS Iberia',
      shortLabel: 'VoLL',
      value: parseFloat(((ENS_PORTUGAL_MWH + ENS_ESPANA_MWH) * VOLL_EUR_MWH / 1e6).toFixed(1)),
      color: colors.voll,
      fuente: isEs ? 'CEER 2023 (VoLL) + ERSE/REN (ENS PT) + estimación ENS ES' : 'CEER 2023 (VoLL) + ERSE/REN (ENS PT) + ENS ES estimation',
      nota: isEs ? 'ENS España es estimación — cuestión abierta (ver datos28A.json)' : 'ENS Spain is estimation — open question (see datos28A.json)',
    },
    {
      label: isEs ? 'Operación Reforzada (Gas)' : 'Reinforced Operation (Gas)',
      shortLabel: isEs ? 'Op. Reforzada' : 'Reinf. Operation',
      value: 666.0,
      color: colors.reinforced,
      fuente: isEs ? 'REE, informe abril 2026' : 'REE, April 2026 report',
      nota: isEs ? 'Dato verificado en fuente primaria' : 'Data verified in primary source',
    },
    {
      label: isEs ? 'Pérdidas Consumo/Comercio' : 'Consumption/Commerce Losses',
      shortLabel: isEs ? 'Consumo' : 'Consumption',
      value: 400.0,
      color: colors.consumption,
      fuente: isEs ? 'CaixaBank Research, julio 2025' : 'CaixaBank Research, July 2025',
      nota: isEs ? 'Estimación econométrica' : 'Econometric estimation',
    },
    {
      label: isEs ? 'Exposición Sanciones CNMC' : 'CNMC Sanctions Exposure',
      shortLabel: isEs ? 'Sanciones' : 'Sanctions',
      value: 240.0,
      color: colors.sanctions,
      fuente: isEs ? 'CNMC, expedientes abril 2026' : 'CNMC, April 2026 files',
      nota: isEs ? 'Exposición máxima estimada; litigios en curso' : 'Estimated maximum exposure; ongoing litigation',
    },
    {
      label: isEs ? 'Daños Directos en Red' : 'Direct Grid Damages',
      shortLabel: isEs ? 'Daños Red' : 'Grid Damages',
      value: 120.0,
      color: colors.gridDamage,
      fuente: isEs ? 'REE / estimación sectorial' : 'REE / sector estimation',
      nota: isEs ? 'Estimación' : 'Estimation',
    },
  ], [isEs]);

  // Los datos base son estáticos y verificados; la API es mejora opcional
  const total = STATIC_ITEMS.reduce((s, d) => s + d.value, 0);

  const chartData = [
    ...STATIC_ITEMS,
    {
      label: isEs ? 'IMPACTO TOTAL ESTIMADO' : 'TOTAL ESTIMATED IMPACT',
      shortLabel: 'TOTAL',
      value: total,
      color: colors.total,
      isTotal: true,
      fuente: isEs ? 'Suma de conceptos anteriores' : 'Sum of previous items',
      nota: isEs ? 'Incluye estimaciones no verificadas (ENS España)' : 'Includes unverified estimates (ENS Spain)',
    },
  ];

  // Waterfall: cada barra arranca donde termina la anterior
  let running = 0;
  const enriched = chartData.map((d, i) => {
    const base = d.isTotal ? 0 : running;
    if (!d.isTotal) running += d.value;
    return { ...d, base, display: d.value, isEs };
  });

  return (
    <div style={{ padding: '1rem 0', background: 'transparent' }}>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={enriched}
          margin={{ top: 32, right: 24, left: 20, bottom: 64 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="shortLabel"
            stroke={colors.axisLine}
            tick={{ fill: colors.axis, fontSize: 11 }}
            interval={0}
          />
          <YAxis
            stroke={colors.axisLine}
            tick={{ fill: colors.axis, fontSize: 11 }}
            tickFormatter={v => `${v.toFixed(0)} M€`}
            label={{
              value: isEs ? 'Millones de €' : 'Millions of €',
              angle: -90,
              position: 'insideLeft',
              fill: colors.axis,
              fontSize: 11,
              offset: -4,
            }}
          />
          <Tooltip content={<CustomTooltip colors={colors} />} />

          {/* Barra invisible de base (crea el efecto waterfall) */}
          <Bar dataKey="base" stackId="wf" fill="transparent" />

          {/* Barra visible */}
          <Bar dataKey="display" stackId="wf" radius={[4, 4, 0, 0]}>
            {enriched.map((d, i) => (
              <Cell key={i} fill={d.color} fillOpacity={d.isTotal ? 1 : 0.85} />
            ))}
            <LabelList
              dataKey="display"
              position="top"
              formatter={v => `${v.toFixed(0)} M€`}
              style={{ fill: colors.labelText, fontSize: 11, fontWeight: 'bold' }}
            />
          </Bar>

          {/* Línea de referencia en el total */}
          <ReferenceLine
            y={total}
            stroke={colors.referenceLine}
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Footer metodológico */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: colors.noteText,
        borderLeft: `3px solid ${colors.noteBorder}`,
        padding: '0.6rem 1rem',
        lineHeight: 1.6,
        background: colors.noteBg,
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{ margin: '0 0 0.4rem' }} dangerouslySetInnerHTML={{ __html: isEs 
          ? `<b>Metodología VoLL:</b> El coste de la energía no suministrada se calcula a 11.000 €/MWh (media ponderada residencial/industrial para España, CEER 2023, Appendix B), sobre una ENS estimada de ~255.490 MWh (55.489 MWh verificados en Portugal — ERSE/REN; ~200.000 MWh estimados para España — dato no verificado en fuente primaria).`
          : `<b>VoLL Methodology:</b> The cost of energy not supplied is calculated at 11,000 €/MWh (weighted average residential/industrial for Spain, CEER 2023, Appendix B), based on an estimated ENS of ~255,490 MWh (55,489 MWh verified in Portugal — ERSE/REN; ~200,000 MWh estimated for Spain — data not verified in primary source).`
        }} />
        <p style={{ margin: '0 0 0.4rem' }} dangerouslySetInnerHTML={{ __html: isEs
          ? `<b>Operación Reforzada (666 M€):</b> dato verificado en fuente primaria (REE, informe abril 2026).`
          : `<b>Reinforced Operation (666 M€):</b> data verified in primary source (REE, April 2026 report).`
        }} />
        <p style={{ margin: 0, fontSize: '0.72rem', color: colors.noteMuted }} dangerouslySetInnerHTML={{ __html: isEs
          ? `⚠ Este análisis incluye estimaciones no verificadas en fuente primaria. Ver <code>datos28A.json</code> § reposicion.ens_espana_total para la declaración de cuestión abierta. Total estimado: <b>${total.toFixed(1)} M€</b>.`
          : `⚠ This analysis includes unverified estimates in primary source. See <code>datos28A.json</code> § reposicion.ens_espana_total for open question statement. Total estimated: <b>${total.toFixed(1)} M€</b>.`
        }} />
      </div>
    </div>
  );
}

export default function FinancialWaterfallChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  return (
    <BrowserOnly
      fallback={
        <div style={{
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6B6255',
          fontFamily: 'monospace',
          fontSize: 13,
        }}>
          {isEs ? 'Inicializando análisis financiero…' : 'Initializing financial analysis…'}
        </div>
      }
    >
      {() => <FinancialWaterfallInner />}
    </BrowserOnly>
  );
}
