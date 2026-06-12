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
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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

const MONTHS_MAP = {
  es: { 'Abr': 'Abr', 'Jun': 'Jun', 'Ago': 'Ago', 'Oct': 'Oct', 'Dic': 'Dic', 'Feb': 'Feb' },
  en: { 'Abr': 'Apr', 'Jun': 'Jun', 'Ago': 'Aug', 'Oct': 'Oct', 'Dic': 'Dec', 'Feb': 'Feb' },
  de: { 'Abr': 'Apr', 'Jun': 'Jun', 'Ago': 'Aug', 'Oct': 'Okt', 'Dic': 'Dez', 'Feb': 'Feb' },
  'zh-Hans': { 'Abr': '4月', 'Jun': '6月', 'Ago': '8月', 'Oct': '10月', 'Dic': '12月', 'Feb': '2月' },
};

const TRANSLATIONS = {
  es: {
    kicker: 'Capítulo 7b · OPEX vs CAPEX',
    title: 'OPEX tóxico frente al CAPEX de resiliencia',
    subtitle: 'Evolución del sobrecoste acumulado de la Operación Reforzada frente al coste teórico de instalar entre 1.000 y 2.000 MW de almacenamiento con inversores grid-forming. El cruce define el período de retorno de la inversión.',
    legendOpexOficial: 'OPEX acumulado · REE/Redeia (verificado)',
    legendOpexAuditado: 'OPEX acumulado · auditoría externa (PwC/NERA)',
    legendCapex: 'Banda CAPEX de resiliencia (860–1.720 M€)',
    opexVerificado: 'OPEX verificado',
    opexAuditado: 'OPEX auditado',
    capexMin: 'CAPEX mín · 860 M€',
    capexMax: 'CAPEX máx · 1.720 M€',
    paybackTitle: 'Período de retorno < 3 años.',
    paybackText: 'Con la Operación Reforzada costando más de 1.000 M€/año en OPEX, el CAPEX estructural (≈ 3.010 M€) se amortiza antes de 2028.',
    paybackRef: ' Referencia paramétrica: proyecto Engie-Rolwind (Andalucía, 2026), 278 MW / 1,1 GWh, 240 M€ → ratio 0,86 M€/MW. El modelo asume crecimiento lineal bajo hipótesis ceteris paribus. La proyección a partir de mes 12 es estimación académica; los datos hasta mes 12 están verificados por REE/Redeia.',
    methodTitle: 'Nota metodológica —',
    methodText: 'El OPEX verificado (REE/Redeia) y el OPEX auditado (PwC/NERA) se refieren a conceptos temporales distintos y son compatibles entre sí, no alternativos. La banda CAPEX refleja incertidumbre en la proporción del parque que requiere hardware adicional vs actualización de firmware. Las proyecciones posteriores a abril de 2026 son lineales bajo precio de gas constante.',
    figCaption: 'Figura 37. OPEX acumulado de la Operación Reforzada frente a la banda de CAPEX estructural (BESS grid-forming, 1.000–2.000 MW). El cruce de la curva auditada con la banda baja se produce antes de los 18 meses. Referencia paramétrica: proyecto Engie-Rolwind (0,86 M€/MW). Elaboración propia a partir de REE/Redeia, PwC, NERA y CNMC.',
    tooltipAuditExceeds: '⚠ La estimación auditada supera la banda baja del CAPEX',
    tooltipOpexVerified: '→ OPEX oficial verificado: 666 M€ acumulados a mar 2026',
    tooltipRedeiaDeclares: '→ Redeia declara 711 M€ acumulados (12 meses)',
  },
  en: {
    kicker: 'Chapter 7b · OPEX vs CAPEX',
    title: 'Toxic OPEX vs. Resilience CAPEX',
    subtitle: 'Evolution of the cumulative overcost of the Reinforced Operation vs. the theoretical cost of installing between 1,000 and 2,000 MW of storage with grid-forming inverters. The crossover defines the investment payback period.',
    legendOpexOficial: 'Cumulative OPEX · REE/Redeia (verified)',
    legendOpexAuditado: 'Cumulative OPEX · external audit (PwC/NERA)',
    legendCapex: 'Resilience CAPEX band (€860–1,720 M)',
    opexVerificado: 'Verified OPEX',
    opexAuditado: 'Audited OPEX',
    capexMin: 'Min CAPEX · €860 M',
    capexMax: 'Max CAPEX · €1,720 M',
    paybackTitle: 'Payback period < 3 years.',
    paybackText: 'With the Reinforced Operation costing more than €1,000 M/year in OPEX, the structural CAPEX (≈ €3,010 M) is amortized before 2028.',
    paybackRef: ' Parametric reference: Engie-Rolwind project (Andalusia, 2026), 278 MW / 1.1 GWh, €240 M → ratio €0.86 M/MW. The model assumes linear growth under ceteris paribus hypothesis. The projection from month 12 is an academic estimate; data up to month 12 are verified by REE/Redeia.',
    methodTitle: 'Methodological note —',
    methodText: 'The verified OPEX (REE/Redeia) and the audited OPEX (PwC/NERA) refer to different temporal concepts and are compatible with each other, not alternatives. The CAPEX band reflects uncertainty in the proportion of the fleet requiring additional hardware vs. firmware updates. Projections after April 2026 are linear under a constant gas price.',
    figCaption: 'Figure 37. Cumulative OPEX of the Reinforced Operation vs. the structural CAPEX band (grid-forming BESS, 1,000–2,000 MW). The crossover of the audited curve with the low band occurs before 18 months. Parametric reference: Engie-Rolwind project (€0.86 M/MW). Own elaboration based on REE/Redeia, PwC, NERA, and CNMC.',
    tooltipAuditExceeds: '⚠ The audited estimate exceeds the low CAPEX band',
    tooltipOpexVerified: '→ Official verified OPEX: €666 M cumulative to March 2026',
    tooltipRedeiaDeclares: '→ Redeia declares €711 M cumulative (12 months)',
  },
  de: {
    kicker: 'Kapitel 7b · OPEX vs. CAPEX',
    title: 'Toxische OPEX vs. Resilienz-CAPEX',
    subtitle: 'Entwicklung der kumulierten Mehrkosten des verstärkten Betriebs im Vergleich zu den theoretischen Kosten für die Installation von 1.000 bis 2.000 MW Speicherkapazität mit netzbildenden Wechselrichtern. Der Schnittpunkt definiert die Amortisationszeit der Investition.',
    legendOpexOficial: 'Kumulierte OPEX · REE/Redeia (verifiziert)',
    legendOpexAuditado: 'Kumulierte OPEX · externe Prüfung (PwC/NERA)',
    legendCapex: 'Resilienz-CAPEX-Band (860–1.720 Mio. €)',
    opexVerificado: 'Verifizierte OPEX',
    opexAuditado: 'Geprüfte OPEX',
    capexMin: 'Min. CAPEX · 860 Mio. €',
    capexMax: 'Max. CAPEX · 1.720 Mio. €',
    paybackTitle: 'Amortisationszeit < 3 Jahre.',
    paybackText: 'Da der verstärkte Betrieb in den OPEX mehr als 1.000 Mio. €/Jahr kostet, amortisieren sich die strukturellen CAPEX (≈ 3.010 Mio. €) vor 2028.',
    paybackRef: ' Parametrische Referenz: Engie-Rolwind-Projekt (Andalusien, 2026), 278 MW / 1,1 GWh, 240 Mio. € → Verhältnis 0,86 Mio. €/MW. Das Modell nimmt ein lineares Wachstum unter Ceteris-paribus-Bedingungen an. Die Projektion ab Monat 12 ist eine akademische Schätzung; die Daten bis Monat 12 wurden von REE/Redeia verifiziert.',
    methodTitle: 'Methodischer Hinweis —',
    methodText: 'Die verifizierten OPEX (REE/Redeia) und die geprüften OPEX (PwC/NERA) beziehen sich auf unterschiedliche zeitliche Konzepte und sind miteinander vereinbar, nicht alternativ. Das CAPEX-Band spiegelt die Unsicherheit wider, welcher Anteil des Parks zusätzliche Hardware vs. Firmware-Updates benötigt. Die Projektionen nach April 2026 verlaufen linear unter der Annahme eines konstanten Gaspreises.',
    figCaption: 'Abbildung 37. Kumulierte OPEX des verstärkten Betriebs im Vergleich zum strukturellen CAPEX-Band (netzbildende BESS, 1.000–2.000 MW). Der Schnittpunkt der geprüften Kurve mit dem unteren Band liegt vor 18 Monaten. Parametrische Referenz: Engie-Rolwind-Projekt (0,86 Mio. €/MW). Eigene Erstellung auf Grundlage von REE/Redeia, PwC, NERA und CNMC.',
    tooltipAuditExceeds: '⚠ Die geprüfte Schätzung überschreitet das untere CAPEX-Band',
    tooltipOpexVerified: '→ Offiziell verifizierte OPEX: kumuliert 666 Mio. € bis März 2026',
    tooltipRedeiaDeclares: '→ Redeia meldet kumuliert 711 Mio. € (12 Monate)',
  },
  'zh-Hans': {
    kicker: '第 7b 章 · 运营成本与建设成本',
    title: '高昂的系统维持成本 vs. 一次性构网改造投资',
    subtitle: '强化运营模式的累计额外运营成本（OPEX）与安装1000至2000兆瓦构网型逆变器储能（BESS-GFM）的理论建设成本（CAPEX）对比。交叉点决定了投资回收期。',
    legendOpexOficial: '累计运营成本 · REE/Redeia (已核实)',
    legendOpexAuditado: '累计运营成本 · 外部审计 (PwC/NERA)',
    legendCapex: '系统安全重构建设成本区间 (8.6亿–17.2亿欧元)',
    opexVerificado: '已核实运营成本',
    opexAuditado: '审计运营成本',
    capexMin: '最低建设成本 · 8.6亿欧元',
    capexMax: '最高建设成本 · 17.2亿欧元',
    paybackTitle: '投资回收期小于3年。',
    paybackText: '由于强化运营模式每年造成的额外OPEX超过10亿欧元，系统构网型储能改造的CAPEX（约30.1亿欧元）在2028年之前即可实现完全折旧回收。',
    paybackRef: ' 边界项目参考：Engie-Rolwind项目（安达卢西亚，2026年），278兆瓦 / 1.1吉瓦时，2.4亿欧元 → 相当于0.86M€/MW。本模型在同等条件下假设线性增长。第12个月之后的预测为学术估算；前12个月的数据经由系统运营商核实。',
    methodTitle: '研究方法说明 —',
    methodText: '经运营商核实的OPEX与PwC/NERA审计 of OPEX在统计时间跨度上存在差异，二者互为补充，而非对立。CAPEX区间反映了需要加装额外硬件与仅需更新逆变器固件的机组比例的不确定性。2026年4月后的预测在天然气价格恒定的假设下呈线性。',
    figCaption: '图 37. 强化运营累计运营成本（OPEX）与构网型储能（BESS-GFM）建设成本（CAPEX）区间对比。审计曲线在18个月内即与下限相交。项目参考：Engie-Rolwind项目。根据REE/Redeia、PwC、NERA及CNMC数据自主编制。',
    tooltipAuditExceeds: '⚠ 审计估算值已超出最低CAPEX限值',
    tooltipOpexVerified: '→ 官方核实累计OPEX：截至2026年3月累计6.66亿欧元',
    tooltipRedeiaDeclares: '→ Redeia申报前12个月累计7.11亿欧元',
  }
};

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
function CustomTooltip({ active, payload, label, palette, t }) {
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
          {t.tooltipAuditExceeds}
        </div>
      )}
      {row?.mes === 'Feb 26' && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: `1px solid ${palette.border}`, fontSize: '0.68rem', color: palette.red }}>
          {t.tooltipOpexVerified}
        </div>
      )}
      {row?.mes === 'Abr 26' && (
        <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: `1px solid ${palette.border}`, fontSize: '0.68rem', color: palette.red }}>
          {t.tooltipRedeiaDeclares}
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function FinancialWaterfallChart() {
  const { colorMode } = useColorMode();
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;
  const isDark = colorMode === 'dark';
  const p = getPalette(isDark);
  const [activeBreakEven, setActiveBreakEven] = useState(false);

  const translatedData = DATA.map(d => {
    const split = d.mes.split(' ');
    const month = MONTHS_MAP[currentLocale]?.[split[0]] || split[0];
    const year = split[1] || '';
    return {
      ...d,
      mes: `${month} ${year}`.trim()
    };
  });

  return (
    <figure className={styles.figure} style={{ background: p.bg, borderColor: p.border }}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker} style={{ color: p.main }}>{t.kicker}</span>
        <h3 className={styles.title} style={{ color: p.text1 }}>
          {t.title}
        </h3>
        <p className={styles.subtitle} style={{ color: p.text3 }}>
          {t.subtitle}
        </p>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: p.opexBar }} />
          <span style={{ color: p.text2 }}>{t.legendOpexOficial}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: p.opexLine, borderRadius: 1 }} />
          <span style={{ color: p.text2 }}>{t.legendOpexAuditado}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendBand} style={{ background: p.capexLow }} />
          <span style={{ color: p.text2 }}>{t.legendCapex}</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={translatedData} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
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
              name={t.opexVerificado}
              fill="url(#fwcOpexGrad)"
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />

            {/* OPEX auditado line */}
            <Line
              type="monotone"
              dataKey="opexAuditado"
              name={t.opexAuditado}
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
                value: t.capexMin,
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
                value: t.capexMax,
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
            <Tooltip content={<CustomTooltip palette={p} t={t} />} />
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
          <strong style={{ color: p.red }}>{t.paybackTitle}</strong>{' '}
          {t.paybackText}
          {activeBreakEven && (
            <span className={styles.calloutExpanded} style={{ color: p.text3 }}>
              {t.paybackRef}
            </span>
          )}
        </span>
      </button>

      {/* Method note */}
      <div className={styles.methodNote} style={{ color: p.text3, borderColor: p.border }}>
        <strong style={{ color: p.amber }}>{t.methodTitle}</strong>{' '}
        {t.methodText}
      </div>

      <figcaption className={styles.caption} style={{ color: p.text3, borderColor: p.border }}>
        {t.figCaption}
      </figcaption>
    </figure>
  );
}
