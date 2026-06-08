import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './FinancialWaterfallChart.module.css';

/* ─── Data ──────────────────────────────────────────────────────────────────
   OPEX acumulado (REE/Redeia verificado + estimación auditora)
   CAPEX banda baja (860 M€ · 1.000 MW BESS) y alta (1.720 M€ · 2.000 MW)
   Referencia: proyecto Engie-Rolwind, 0,86 M€/MW
   ─────────────────────────────────────────────────────────────────────────── */
const DATA = [
  { mes: 'Abr 25', label: 'Mes 0',  opexOficial: 0,    opexAuditado: 0,    capexLow: 860,  capexHigh: 1720 },
  { mes: 'Jun 25', label: 'Mes 2',  opexOficial: 142,  opexAuditado: 200,  capexLow: 860,  capexHigh: 1720 },
  { mes: 'Ago 25', label: 'Mes 4',  opexOficial: 284,  opexAuditado: 400,  capexLow: 860,  capexHigh: 1720 },
  { mes: 'Oct 25', label: 'Mes 6',  opexOficial: 355,  opexAuditado: 500,  capexLow: 860,  capexHigh: 1720 },
  { mes: 'Dic 25', label: 'Mes 8',  opexOficial: 497,  opexAuditado: 700,  capexLow: 860,  capexHigh: 1720 },
  { mes: 'Feb 26', label: 'Mes 10', opexOficial: 610,  opexAuditado: 870,  capexLow: 860,  capexHigh: 1720 },
  { mes: 'Abr 26', label: 'Mes 12', opexOficial: 711,  opexAuditado: 1000, capexLow: 860,  capexHigh: 1720 },
  { mes: 'Oct 26', label: 'Mes 18', opexOficial: 1065, opexAuditado: 1500, capexLow: 860,  capexHigh: 1720 },
  { mes: 'Abr 27', label: 'Mes 24', opexOficial: 1422, opexAuditado: 2000, capexLow: 860,  capexHigh: 1720 },
];

/* ─── Palette ─────────────────────────────────────────────────────────────── */
function getPalette(isDark) {
  return {
    bg:           isDark ? 'rgba(16,29,53,0.92)'      : 'rgba(255,252,245,0.94)',
    surface:      isDark ? 'rgba(10,20,42,0.80)'      : 'rgba(250,247,240,0.90)',
    border:       isDark ? 'rgba(190,209,230,0.13)'   : 'rgba(58,49,35,0.13)',
    borderStrong: isDark ? 'rgba(190,209,230,0.22)'   : 'rgba(58,49,35,0.22)',
    grid:         isDark ? 'rgba(190,209,230,0.08)'   : 'rgba(58,49,35,0.07)',
    text1:        isDark ? '#f4f7fb'  : '#191814',
    text2:        isDark ? '#c7d2e3'  : '#4a4338',
    text3:        isDark ? '#91a4bc'  : '#7a7062',
    main:         isDark ? '#83bdc2'  : '#145c63',
    amber:        isDark ? '#d2a24d'  : '#9a7044',
    red:          isDark ? '#d86a64'  : '#963530',
    green:        isDark ? '#7ab89a'  : '#2e7a55',
    opexBar:      isDark ? 'rgba(131,189,194,0.55)' : 'rgba(20,92,99,0.55)',
    opexLine:     isDark ? '#d86a64'  : '#963530',
    capexLow:     isDark ? 'rgba(210,162,77,0.25)'  : 'rgba(154,112,68,0.20)',
    capexHigh:    isDark ? 'rgba(210,162,77,0.10)'  : 'rgba(154,112,68,0.08)',
    tooltipBg:    isDark ? '#0d1e38' : '#fffcf5',
    tooltipBorder:isDark ? 'rgba(190,209,230,0.30)' : 'rgba(58,49,35,0.22)',
  };
}

/* ─── Custom Tooltip ──────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, palette }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <div
      style={{
        background: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        borderRadius: 6,
        padding: '0.7rem 0.9rem',
        fontSize: '0.76rem',
        fontFamily: 'Inter, Helvetica Neue, sans-serif',
        minWidth: 200,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ fontWeight: 700, color: palette.text1, marginBottom: '0.4rem' }}>
        {label} <span style={{ fontWeight: 400, color: palette.text3 }}>({row?.label})</span>
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', color: p.color, marginTop: '0.2rem' }}>
          <span style={{ color: palette.text2 }}>{p.name}</span>
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {p.value != null ? `${p.value.toLocaleString('es-ES')} M€` : '—'}
          </span>
        </div>
      ))}
      {row?.mes === 'Oct 25' && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: `1px solid ${palette.border}`, fontSize: '0.68rem', color: palette.amber }}>
          ⚠ La estimación auditada supera la banda baja del CAPEX
        </div>
      )}
      {row?.mes === 'Feb 26' && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: `1px solid ${palette.border}`, fontSize: '0.68rem', color: palette.red }}>
          → OPEX oficial verificado: 666 M€ acumulados a mar 2026
        </div>
      )}
      {row?.mes === 'Abr 26' && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: `1px solid ${palette.border}`, fontSize: '0.68rem', color: palette.red }}>
          → Redeia declara 711 M€ acumulados (12 meses)
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function FinancialWaterfallChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const p = getPalette(isDark);
  const [activeBreakEven, setActiveBreakEven] = useState(false);

  return (
    <figure className={styles.figure} style={{ background: p.bg, borderColor: p.border }}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker} style={{ color: p.main }}>Capítulo 7b · OPEX vs CAPEX</span>
        <h3 className={styles.title} style={{ color: p.text1 }}>
          OPEX tóxico frente al CAPEX de resiliencia
        </h3>
        <p className={styles.subtitle} style={{ color: p.text3 }}>
          Evolución del sobrecoste acumulado de la Operación Reforzada frente al coste
          teórico de instalar entre 1.000 y 2.000 MW de almacenamiento con inversores
          grid-forming. El cruce define el período de retorno de la inversión.
        </p>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: p.opexBar }} />
          <span style={{ color: p.text2 }}>OPEX acumulado · REE/Redeia (verificado)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: p.opexLine, borderRadius: 1 }} />
          <span style={{ color: p.text2 }}>OPEX acumulado · auditoría externa (PwC/NERA)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendBand} style={{ background: p.capexLow }} />
          <span style={{ color: p.text2 }}>Banda CAPEX de resiliencia (860–1.720 M€)</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={DATA} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fwcOpexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={p.opexBar} stopOpacity={0.9} />
                <stop offset="100%" stopColor={p.opexBar} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="fwcBandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={p.capexLow} stopOpacity={1} />
                <stop offset="100%" stopColor={p.capexHigh} stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={p.grid}
              vertical={false}
            />

            {/* CAPEX band — rendered as area between capexLow and capexHigh */}
            <Area
              type="stepAfter"
              dataKey="capexHigh"
              stroke="none"
              fill={`url(#fwcBandGrad)`}
              fillOpacity={1}
              isAnimationActive={false}
              legendType="none"
            />
            <Area
              type="stepAfter"
              dataKey="capexLow"
              stroke={p.amber}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill={p.bg}
              fillOpacity={1}
              isAnimationActive={false}
              legendType="none"
            />

            {/* OPEX bars */}
            <Bar
              dataKey="opexOficial"
              name="OPEX verificado"
              fill="url(#fwcOpexGrad)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />

            {/* OPEX auditado line */}
            <Line
              type="monotone"
              dataKey="opexAuditado"
              name="OPEX auditado"
              stroke={p.opexLine}
              strokeWidth={2}
              dot={{ fill: p.opexLine, r: 3, strokeWidth: 0 }}
              activeDot={{ fill: p.opexLine, r: 5, stroke: p.tooltipBg, strokeWidth: 2 }}
            />

            {/* Break-even reference lines */}
            <ReferenceLine
              y={860}
              stroke={p.amber}
              strokeWidth={1}
              strokeOpacity={0.6}
              label={{
                value: 'CAPEX mín · 860 M€',
                position: 'insideTopRight',
                fill: p.amber,
                fontSize: 10,
                fontFamily: 'Inter',
              }}
            />
            <ReferenceLine
              y={1720}
              stroke={p.amber}
              strokeWidth={1}
              strokeOpacity={0.4}
              strokeDasharray="4 3"
              label={{
                value: 'CAPEX máx · 1.720 M€',
                position: 'insideTopRight',
                fill: p.amber,
                fontSize: 10,
                fontFamily: 'Inter',
              }}
            />

            <XAxis
              dataKey="mes"
              tick={{ fill: p.text3, fontSize: 11, fontFamily: 'Inter' }}
              axisLine={{ stroke: p.borderStrong }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v} M€`}
              tick={{ fill: p.text3, fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={76}
            />
            <Tooltip content={<CustomTooltip palette={p} />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Break-even callout */}
      <button
        className={styles.callout}
        style={{
          background: activeBreakEven ? 'rgba(150,53,48,0.08)' : p.surface,
          borderColor: activeBreakEven ? p.red : p.border,
          color: p.text2,
        }}
        onClick={() => setActiveBreakEven(v => !v)}
        aria-expanded={activeBreakEven}
      >
        <span className={styles.calloutIcon} style={{ color: p.red }}>→</span>
        <span>
          <strong style={{ color: p.red }}>Período de retorno &lt; 3 años.</strong>{' '}
          Con la Operación Reforzada costando más de 1.000 M€/año en OPEX,
          el CAPEX estructural (≈ 3.010 M€) se amortiza antes de 2028.
          {activeBreakEven && (
            <span className={styles.calloutExpanded} style={{ color: p.text3 }}>
              {' '}Referencia paramétrica: proyecto Engie-Rolwind (Andalucía, 2026), 278 MW / 1,1 GWh,
              240 M€ → ratio 0,86 M€/MW. El modelo asume crecimiento lineal bajo hipótesis
              ceteris paribus. La proyección a partir de mes 12 es estimación académica;
              los datos hasta mes 12 están verificados por REE/Redeia.
            </span>
          )}
        </span>
      </button>

      {/* Method note */}
      <div className={styles.methodNote} style={{ color: p.text3, borderColor: p.border }}>
        <strong style={{ color: p.amber }}>Nota metodológica —</strong>{' '}
        El OPEX verificado (REE/Redeia) y el OPEX auditado (PwC/NERA) se refieren a
        conceptos temporales distintos y son compatibles entre sí, no alternativos.
        La banda CAPEX refleja incertidumbre en la proporción del parque que requiere
        hardware adicional vs actualización de firmware. Las proyecciones posteriores
        a abril de 2026 son lineales bajo precio de gas constante.
      </div>

      <figcaption className={styles.caption} style={{ color: p.text3, borderColor: p.border }}>
        Figura 37. OPEX acumulado de la Operación Reforzada frente a la banda de CAPEX
        estructural (BESS grid-forming, 1.000–2.000 MW). El cruce de la curva auditada
        con la banda baja se produce antes de los 18 meses. Referencia paramétrica:
        proyecto Engie-Rolwind (0,86 M€/MW). Elaboración propia a partir de REE/Redeia,
        PwC, NERA y CNMC.
      </figcaption>
    </figure>
  );
}
