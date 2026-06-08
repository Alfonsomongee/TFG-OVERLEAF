import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './RestorationLoadRampFigure.module.css';

/* ─── Dataset ────────────────────────────────────────────────────────────────
   Fuente: REE / ENTSO-E / Comité de Análisis
   hora: etiqueta del eje X
   propia: demanda cubierta menos aportación francesa (MW)
   francia: aportación desde Francia (MW) — cuando negativa = exportación ES→FR
   pct: % respecto a demanda prevista
   ─────────────────────────────────────────────────────────────────────────── */
const RAW = [
  { hora: '13:07', total: 31,    francia: 31,   pct: 0     },
  { hora: '16:30', total: 1905,  francia: 1375, pct: 8     },
  { hora: '17:30', total: 2812,  francia: 1100, pct: 12    },
  { hora: '18:30', total: 3943,  francia: 1685, pct: 16    },
  { hora: '19:30', total: 5508,  francia: 1654, pct: 22    },
  { hora: '20:30', total: 9146,  francia: 1685, pct: 35    },
  { hora: '21:30', total: 11211, francia: 1100, pct: 40    },
  { hora: '22:30', total: 12751, francia: 800,  pct: 48    },
  { hora: '23:30', total: 13039, francia: 525,  pct: 55    },
  { hora: '00:00', total: 14074, francia: 312,  pct: 61    },
  { hora: '01:00', total: 14549, francia: -102, pct: 67    },
  { hora: '02:00', total: 16118, francia: 20,   pct: 78    },
  { hora: '03:00', total: 16552, francia: 20,   pct: 82    },
  { hora: '04:00', total: 16552, francia: 26,   pct: 87    },
  { hora: '05:00', total: 18563, francia: 190,  pct: 92    },
  { hora: '07:05', total: 25794, francia: 1057, pct: 99.95 },
  { hora: '14:36*',total: 23088, francia: 80,   pct: 100   },
];

const DATA = RAW.map(d => ({
  ...d,
  propia: Math.max(0, d.total - Math.max(0, d.francia)),
  franciaPos: Math.max(0, d.francia),
  exportacion: d.francia < 0 ? Math.abs(d.francia) : 0,
}));

/* Hitos anotados */
const HITOS = [
  { hora: '13:07', label: 'Primer MW reinyectado' },
  { hora: '01:00', label: 'ES comienza a exportar a FR' },
  { hora: '07:05', label: '99,95 % restaurado' },
];

/* ─── Paleta ─────────────────────────────────────────────────────────────── */
function getPalette(isDark) {
  return {
    bg:            isDark ? 'rgba(16,29,53,0.92)'     : 'rgba(255,252,245,0.94)',
    surface:       isDark ? 'rgba(10,20,42,0.80)'     : 'rgba(250,247,240,0.90)',
    border:        isDark ? 'rgba(190,209,230,0.13)'  : 'rgba(58,49,35,0.13)',
    borderStrong:  isDark ? 'rgba(190,209,230,0.24)'  : 'rgba(58,49,35,0.22)',
    grid:          isDark ? 'rgba(190,209,230,0.07)'  : 'rgba(58,49,35,0.07)',
    text1:         isDark ? '#f4f7fb'  : '#191814',
    text2:         isDark ? '#c7d2e3'  : '#4a4338',
    text3:         isDark ? '#91a4bc'  : '#7a7062',
    main:          isDark ? '#83bdc2'  : '#145c63',
    mainSoft:      isDark ? 'rgba(131,189,194,0.18)' : 'rgba(20,92,99,0.14)',
    amber:         isDark ? '#d2a24d'  : '#9a7044',
    amberSoft:     isDark ? 'rgba(210,162,77,0.22)'  : 'rgba(154,112,68,0.16)',
    red:           isDark ? '#d86a64'  : '#963530',
    green:         isDark ? '#7ab89a'  : '#2e7a55',
    greenSoft:     isDark ? 'rgba(122,184,154,0.15)' : 'rgba(46,122,85,0.10)',
    tooltipBg:     isDark ? '#0d1e38'  : '#fffcf5',
    tooltipBorder: isDark ? 'rgba(190,209,230,0.30)' : 'rgba(58,49,35,0.22)',
    axisLine:      isDark ? 'rgba(190,209,230,0.20)' : 'rgba(58,49,35,0.18)',
    /* áreas */
    areaPropia:    isDark ? 'rgba(131,189,194,0.55)'  : 'rgba(20,92,99,0.52)',
    areaFrancia:   isDark ? 'rgba(210,162,77,0.50)'   : 'rgba(154,112,68,0.46)',
    linePct:       isDark ? '#d86a64'   : '#963530',
    refLine:       isDark ? 'rgba(122,184,154,0.50)'  : 'rgba(46,122,85,0.45)',
  };
}

/* ─── Tooltip ────────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, palette: p }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const isExport = d.exportacion > 0;

  return (
    <div style={{
      background: p.tooltipBg,
      border: `1px solid ${p.tooltipBorder}`,
      borderRadius: 7,
      padding: '0.75rem 1rem',
      minWidth: 210,
      boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    }}>
      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: p.text1, marginBottom: '0.5rem', fontFamily: 'inherit' }}>
        {label}
        {label === '14:36*' && (
          <span style={{ fontWeight: 400, fontSize: '0.65rem', color: p.text3, marginLeft: '0.4rem' }}>
            29 abr — referencia
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Row label="Demanda cubierta" value={`${d.total.toLocaleString('es-ES')} MW`} color={p.main} p={p} />
        <Row label="Generación propia" value={`${d.propia.toLocaleString('es-ES')} MW`} color={p.main} p={p} dim />
        {isExport
          ? <Row label="Exportación a Francia" value={`${d.exportacion.toLocaleString('es-ES')} MW`} color={p.green} p={p} />
          : <Row label="Importación de Francia" value={`${d.franciaPos.toLocaleString('es-ES')} MW`} color={p.amber} p={p} />
        }
        <div style={{ marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: `1px solid ${p.border}` }}>
          <Row label="Recuperación" value={`${d.pct} %`} color={p.red} p={p} bold />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color, p, dim, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', opacity: dim ? 0.7 : 1 }}>
      <span style={{ fontSize: '0.71rem', color: p.text3 }}>{label}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: bold ? 700 : 600, color, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Tick personalizado eje X ───────────────────────────────────────────── */
function CustomXTick({ x, y, payload, palette: p }) {
  const isHito = HITOS.some(h => h.hora === payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0} y={0} dy={14}
        textAnchor="middle"
        fill={isHito ? p.main : p.text3}
        fontSize={isHito ? 11 : 10}
        fontWeight={isHito ? 700 : 400}
        fontFamily="'IBM Plex Mono', monospace"
      >
        {payload.value}
      </text>
    </g>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function RestorationLoadRampFigure() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const p = getPalette(isDark);
  const [showNote, setShowNote] = useState(false);

  return (
    <figure className={styles.figure} style={{ background: p.bg, borderColor: p.border }}>

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker} style={{ color: p.main }}>
          Capítulo 4 · Reposición del sistema
        </span>
        <h3 className={styles.title} style={{ color: p.text1 }}>
          Rampa de recuperación de la demanda peninsular
        </h3>
        <p className={styles.subtitle} style={{ color: p.text3 }}>
          28 de abril 13:07 CEST → 29 de abril 07:05 CEST.
          Generación propia + importación desde Francia. Línea: porcentaje de recuperación.
        </p>
      </div>

      {/* Leyenda visual inline */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: p.areaPropia }} />
          <span style={{ color: p.text2 }}>Generación propia reestablecida</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: p.areaFrancia }} />
          <span style={{ color: p.text2 }}>Importación desde Francia</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLine} style={{ background: p.linePct }} />
          <span style={{ color: p.text2 }}>% recuperación (eje dcho.)</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={DATA} margin={{ top: 12, right: 52, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="rlr-propia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={p.areaPropia} stopOpacity={1} />
                <stop offset="100%" stopColor={p.areaPropia} stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="rlr-francia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={p.areaFrancia} stopOpacity={0.9} />
                <stop offset="100%" stopColor={p.areaFrancia} stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={p.grid} vertical={false} />

            {/* Hito: España empieza a exportar */}
            <ReferenceLine
              x="01:00"
              stroke={p.green}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              label={{
                value: '↺ ES → FR',
                position: 'insideTopLeft',
                fill: p.green,
                fontSize: 10,
                fontFamily: "'IBM Plex Mono', monospace",
                dy: -4,
              }}
            />

            {/* Hito: 99,95% */}
            <ReferenceLine
              x="07:05"
              stroke={p.main}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              label={{
                value: '99,95 %',
                position: 'insideTopRight',
                fill: p.main,
                fontSize: 10,
                fontFamily: "'IBM Plex Mono', monospace",
                dy: -4,
              }}
            />

            {/* Área Francia (encima — se apila visualmente) */}
            <Area
              type="monotone"
              dataKey="franciaPos"
              stackId="demand"
              stroke="none"
              fill="url(#rlr-francia)"
            />

            {/* Área propia (base de la pila) */}
            <Area
              type="monotone"
              dataKey="propia"
              stackId="demand"
              stroke={p.main}
              strokeWidth={1.5}
              fill="url(#rlr-propia)"
            />

            {/* Línea % recuperación — eje derecho */}
            <Line
              type="monotone"
              dataKey="pct"
              yAxisId="pct"
              stroke={p.linePct}
              strokeWidth={2}
              dot={{ fill: p.linePct, r: 3, strokeWidth: 0 }}
              activeDot={{ fill: p.linePct, r: 5, stroke: p.tooltipBg, strokeWidth: 2 }}
            />

            <XAxis
              dataKey="hora"
              tick={<CustomXTick palette={p} />}
              axisLine={{ stroke: p.axisLine }}
              tickLine={false}
              interval={0}
            />

            {/* Eje izquierdo — MW */}
            <YAxis
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
              tick={{ fill: p.text3, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              width={38}
              unit=" MW"
              tickCount={6}
            />

            {/* Eje derecho — % */}
            <YAxis
              yAxisId="pct"
              orientation="right"
              domain={[0, 110]}
              tickFormatter={v => `${v}%`}
              tick={{ fill: p.linePct, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              width={42}
              tickCount={6}
            />

            <Tooltip content={<CustomTooltip palette={p} />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Nota metodológica expandible */}
      <button
        className={styles.methodBtn}
        style={{
          color: p.text3,
          borderColor: p.border,
          background: showNote ? p.surface : 'transparent',
        }}
        onClick={() => setShowNote(v => !v)}
        aria-expanded={showNote}
      >
        <span style={{ color: p.amber }}>⚠</span>
        <span>Nota metodológica</span>
        <span className={styles.methodBtnChevron} style={{ transform: showNote ? 'rotate(180deg)' : 'none' }}>
          ▾
        </span>
      </button>

      {showNote && (
        <div
          className={styles.methodNote}
          style={{ background: p.surface, borderColor: p.border, color: p.text3 }}
        >
          El punto 14:36* corresponde al día siguiente (29 de abril) y se incluye como referencia
          de operación normalizada, no como parte de la rampa de reposición. La «aportación de Francia»
          negativa en 01:00 (−102 MW) indica que España comenzó a exportar energía hacia Francia —
          señal de que la red peninsular había recuperado excedente. Los datos de porcentaje se refieren
          a la demanda prevista original para esa franja horaria del 28-A, no a la demanda real post-apagón.
          Fuente: REE / ENTSO-E / Comité de Análisis del Gobierno.
        </div>
      )}

    </figure>
  );
}
