import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from './LinesAvailability.module.css';

const FALLBACK_LINES_DATA = [
  {
    id: 'NOROESTE',
    name: 'Noroeste',
    control_tension_220: 7,
    control_tension_400: 7,
    indisponibilidades_220: 1,
    indisponibilidades_400: 1,
    trabajos_previstos_220: 2,
    trabajos_previstos_400: 2,
    pct_km_control: 11.62,
    criticality: 'warning',
  },
  {
    id: 'NORTE',
    name: 'Norte',
    control_tension_220: 5,
    control_tension_400: 4,
    indisponibilidades_220: 0,
    indisponibilidades_400: 1,
    trabajos_previstos_220: 1,
    trabajos_previstos_400: 1,
    pct_km_control: 8.45,
    criticality: 'warning',
  },
  {
    id: 'ESTE',
    name: 'Este',
    control_tension_220: 3,
    control_tension_400: 2,
    indisponibilidades_220: 1,
    indisponibilidades_400: 0,
    trabajos_previstos_220: 0,
    trabajos_previstos_400: 1,
    pct_km_control: 5.22,
    criticality: 'warning',
  },
  {
    id: 'CENTRO',
    name: 'Centro',
    control_tension_220: 8,
    control_tension_400: 5,
    indisponibilidades_220: 2,
    indisponibilidades_400: 1,
    trabajos_previstos_220: 1,
    trabajos_previstos_400: 2,
    pct_km_control: 26.73,
    criticality: 'critical',
  },
  {
    id: 'SUR',
    name: 'Sur',
    control_tension_220: 10,
    control_tension_400: 8,
    indisponibilidades_220: 3,
    indisponibilidades_400: 2,
    trabajos_previstos_220: 2,
    trabajos_previstos_400: 1,
    pct_km_control: 18.4,
    criticality: 'critical',
  },
];

const getCriticalityEmoji = (crit) => {
  if (crit === 'critical') return '🔴';
  if (crit === 'warning') return '🟡';
  return '🟢';
};

const getCriticalityColor = (crit) => {
  if (crit === 'critical') return 'hsl(0 75% 58%)';
  if (crit === 'warning') return 'hsl(38 100% 56%)';
  return 'hsl(140 60% 50%)';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((entry, idx) => (
        <div key={idx} className={styles.tooltipValue}>
          {entry.name}: {entry.value} líneas
        </div>
      ))}
      <div className={styles.tooltipValue} style={{ marginTop: '6px', borderTop: '1px solid hsl(220 20% 18%)', paddingTop: '6px' }}>
        Criticality: <span style={{ color: getCriticalityColor(data.criticality), fontWeight: 700 }}>{getCriticalityEmoji(data.criticality)} {data.criticality.toUpperCase()}</span>
      </div>
    </div>
  );
};

const ChartSection = ({ title, subtitle, data, dataKeyFor220, dataKeyFor400 }) => (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <p className={styles.sectionSubtitle}>{subtitle}</p>
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18% / 0.3)" />
          <XAxis
            dataKey="name"
            angle={-20}
            textAnchor="end"
            height={80}
            tick={{ fill: 'hsl(220 12% 48%)', fontSize: 11 }}
          />
          <YAxis
            label={{ value: '# of lines', angle: -90, position: 'insideLeft', style: { fill: 'hsl(220 12% 48%)' } }}
            tick={{ fill: 'hsl(220 12% 48%)', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKeyFor220} fill="hsl(190 100% 60%)" opacity={0.85} name="220 kV" />
          <Bar dataKey={dataKeyFor400} fill="hsl(38 100% 56%)" opacity={0.85} name="400 kV">
            {data.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                style={{
                  opacity: entry.criticality === 'critical' ? 1 : 0.85,
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LinesAvailability = React.memo(() => {
  const data = FALLBACK_LINES_DATA;

  const totalControlTension = useMemo(
    () => data.reduce((acc, d) => acc + d.control_tension_220 + d.control_tension_400, 0),
    [data]
  );

  const totalIndisponibilidades = useMemo(
    () => data.reduce((acc, d) => acc + d.indisponibilidades_220 + d.indisponibilidades_400, 0),
    [data]
  );

  const totalTrabajos = useMemo(
    () => data.reduce((acc, d) => acc + d.trabajos_previstos_220 + d.trabajos_previstos_400, 0),
    [data]
  );

  const maxKmAffected = useMemo(
    () => Math.max(...data.map((d) => d.pct_km_control)),
    [data]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Análisis de Disponibilidad de Red — Topología Frágil</h2>
        <p className={styles.subtitle}>28-A 09:00-12:16 CEST — Control de Tensión e Indisponibilidades</p>
      </div>

      <div className={styles.alertBox}>
        ⚠️ CONFIGURACIÓN DE RED CRÍTICA<br />
        La apertura progresiva de líneas (09:00-12:16) redujo la redundancia N-1,<br />
        dejando el sistema vulnerable a cualquier perturbación adicional.
      </div>

      <ChartSection
        title="Líneas Abiertas por Control de Tensión (09:00-12:16)"
        subtitle="Red Eléctrica — Operación de estabilización de voltaje"
        data={data}
        dataKeyFor220="control_tension_220"
        dataKeyFor400="control_tension_400"
      />

      <ChartSection
        title="Líneas Indisponibles por Avería o Mantenimiento"
        subtitle="Fallos, trabajos de emergencia, o falta de capacidad"
        data={data}
        dataKeyFor220="indisponibilidades_220"
        dataKeyFor400="indisponibilidades_400"
      />

      <ChartSection
        title="Líneas con Trabajos Previstos Comenzar 28-A Antes 09:00"
        subtitle="Mantenimiento preventivo simultaneo con crisis operativa"
        data={data}
        dataKeyFor220="trabajos_previstos_220"
        dataKeyFor400="trabajos_previstos_400"
      />

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(190 100% 60%)', borderRadius: '2px' }} />
          <span>220 kV</span>
        </div>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(38 100% 56%)', borderRadius: '2px' }} />
          <span>400 kV (más crítico)</span>
        </div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryTitle}>RESUMEN TOPOLOGÍA SISTEMA (28-A 09:00-12:16)</div>
        <div className={styles.summaryRow}>
          <span>Total líneas abiertas por control de tensión:</span>
          <span className={styles.summaryValue}>{totalControlTension} líneas</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total líneas indisponibles:</span>
          <span className={styles.summaryValue}>{totalIndisponibilidades} líneas</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total líneas con trabajos previstos:</span>
          <span className={styles.summaryValue}>{totalTrabajos} líneas</span>
        </div>
        <div className={styles.summaryRow} style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
          <span>% km afectados (máximo por zona):</span>
          <span className={styles.summaryValue} style={{ color: 'hsl(0 75% 58%)' }}>
            {maxKmAffected.toFixed(1)}% (400 kV) — CRÍTICO
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span style={{ fontSize: '11px', color: 'hsl(220 12% 48%)' }}>Implicación: Red operaba sin margen N-1 en varias zonas.<br />Una línea adicional → cascada de disparos.</span>
        </div>
      </div>
    </div>
  );
});

LinesAvailability.displayName = 'LinesAvailability';

export default LinesAvailability;
