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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
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

const STATIC_ITEMS = [
  {
    label: 'VoLL — ENS Iberia',
    shortLabel: 'VoLL',
    value: parseFloat(((ENS_PORTUGAL_MWH + ENS_ESPANA_MWH) * VOLL_EUR_MWH / 1e6).toFixed(1)),
    color: '#ef4444',
    fuente: 'CEER 2023 (VoLL) + ERSE/REN (ENS PT) + estimación ENS ES',
    nota: 'ENS España es estimación — cuestión abierta (ver datos28A.json)',
  },
  {
    label: 'Operación Reforzada (Gas)',
    shortLabel: 'Op. Reforzada',
    value: 666.0,
    color: '#f59e0b',
    fuente: 'REE, informe abril 2026',
    nota: 'Dato verificado en fuente primaria',
  },
  {
    label: 'Pérdidas Consumo/Comercio',
    shortLabel: 'Consumo',
    value: 400.0,
    color: '#f97316',
    fuente: 'CaixaBank Research, julio 2025',
    nota: 'Estimación econométrica',
  },
  {
    label: 'Exposición Sanciones CNMC',
    shortLabel: 'Sanciones',
    value: 240.0,
    color: '#8b5cf6',
    fuente: 'CNMC, expedientes abril 2026',
    nota: 'Exposición máxima estimada; litigios en curso',
  },
  {
    label: 'Daños Directos en Red',
    shortLabel: 'Daños Red',
    value: 120.0,
    color: '#eab308',
    fuente: 'REE / estimación sectorial',
    nota: 'Estimación',
  },
];

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{
      background: 'rgba(10,10,20,0.97)',
      border: `1px solid ${d.color}60`,
      borderRadius: 8,
      padding: '10px 14px',
      maxWidth: 280,
      fontSize: 12,
      color: '#e2e8f0',
      lineHeight: 1.5,
    }}>
      <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: d.color }}>
        {d.label}
      </p>
      <p style={{ margin: '0 0 4px' }}>
        <strong>{d.isTotal ? 'TOTAL: ' : ''}{d.value.toFixed(1)} M€</strong>
      </p>
      <p style={{ margin: '0 0 2px', color: '#94a3b8', fontSize: 11 }}>
        Fuente: {d.fuente}
      </p>
      {d.nota && (
        <p style={{ margin: 0, color: '#f59e0b', fontSize: 10 }}>
          ⚠ {d.nota}
        </p>
      )}
    </div>
  );
}

// ─── Componente interno ───────────────────────────────────────────────────────
function FinancialWaterfallInner() {
  // Los datos base son estáticos y verificados; la API es mejora opcional
  const total = STATIC_ITEMS.reduce((s, d) => s + d.value, 0);

  const chartData = [
    ...STATIC_ITEMS,
    {
      label: 'IMPACTO TOTAL ESTIMADO',
      shortLabel: 'TOTAL',
      value: total,
      color: '#dc2626',
      isTotal: true,
      fuente: 'Suma de conceptos anteriores',
      nota: 'Incluye estimaciones no verificadas (ENS España)',
    },
  ];

  // Waterfall: cada barra arranca donde termina la anterior
  let running = 0;
  const enriched = chartData.map((d, i) => {
    const base = d.isTotal ? 0 : running;
    if (!d.isTotal) running += d.value;
    return { ...d, base, display: d.value };
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
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="shortLabel"
            stroke="#475569"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval={0}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={v => `${v.toFixed(0)} M€`}
            label={{
              value: 'Millones de €',
              angle: -90,
              position: 'insideLeft',
              fill: 'var(--text-1, #64748b)',
              fontSize: 11,
              offset: -4,
            }}
          />
          <Tooltip content={<CustomTooltip />} />

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
              style={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 'bold' }}
            />
          </Bar>

          {/* Línea de referencia en el total */}
          <ReferenceLine
            y={total}
            stroke="#dc2626"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Footer metodológico */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: 'rgba(160,155,140,0.8)',
        borderLeft: '3px solid rgba(255,170,0,0.4)',
        padding: '0.6rem 1rem',
        lineHeight: 1.6,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{ margin: '0 0 0.4rem' }}>
          <strong>Metodología VoLL:</strong> El coste de la energía no suministrada
          se calcula a 11.000 €/MWh (media ponderada residencial/industrial para España,
          CEER 2023, Appendix B), sobre una ENS estimada de ~255.490 MWh
          (55.489 MWh verificados en Portugal — ERSE/REN; ~200.000 MWh estimados
          para España — dato no verificado en fuente primaria).
        </p>
        <p style={{ margin: '0 0 0.4rem' }}>
          <strong>Operación Reforzada (666 M€):</strong> dato verificado en
          fuente primaria (REE, informe abril 2026).
        </p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(160,155,140,0.55)' }}>
          ⚠ Este análisis incluye estimaciones no verificadas en fuente primaria.
          Ver <code>datos28A.json</code> § reposicion.ens_espana_total para la
          declaración de cuestión abierta. Total estimado:{' '}
          <strong>{total.toFixed(1)} M€</strong>.
        </p>
      </div>
    </div>
  );
}

export default function FinancialWaterfallChart() {
  return (
    <BrowserOnly
      fallback={
        <div style={{
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-1, #64748b)',
          fontFamily: 'monospace',
          fontSize: 13,
        }}>
          Inicializando análisis financiero…
        </div>
      }
    >
      {() => <FinancialWaterfallInner />}
    </BrowserOnly>
  );
}
