import React, { useMemo } from 'react';
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
import styles from './PowerCapacityComparison.module.css';

const FALLBACK_CAPACITY_DATA = [
  {
    id: 'coal',
    name: 'Carbón',
    unavailable_mw: 903.5,
    installed_total_mw: 1820,
    pct_unavailable: 49.6,
    status: 'warning',
  },
  {
    id: 'combined',
    name: 'Ciclo Combinado',
    unavailable_mw: 7426.3,
    installed_total_mw: 24562,
    pct_unavailable: 30.2,
    status: 'critical',
  },
  {
    id: 'fuel',
    name: 'Fuel-gas',
    unavailable_mw: 0.0,
    installed_total_mw: 8,
    pct_unavailable: 0.0,
    status: 'ok',
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    unavailable_mw: 3078.6,
    installed_total_mw: 7117,
    pct_unavailable: 43.3,
    status: 'critical',
  },
  {
    id: 'pumped',
    name: 'Bombeo',
    unavailable_mw: 1392.1,
    installed_total_mw: 3331,
    pct_unavailable: 41.8,
    status: 'warning',
  },
];

const getStatusColor = (pct) => {
  if (pct > 40) return 'hsl(0 75% 58% / 0.08)';
  if (pct >= 20) return 'hsl(38 100% 56% / 0.08)';
  return 'hsl(140 60% 50% / 0.08)';
};

const getPercentColor = (pct) => {
  if (pct > 40) return 'hsl(0 75% 58%)';
  if (pct >= 20) return 'hsl(38 100% 56%)';
  return 'hsl(140 60% 50%)';
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const available = data.installed_total_mw - data.unavailable_mw;
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipLabel}>{data.name}</div>
      {payload.map((entry, idx) => (
        <div key={idx} className={styles.tooltipValue}>
          {entry.name}: {entry.value.toLocaleString()} MW
        </div>
      ))}
      <div className={styles.tooltipValue} style={{ marginTop: '6px', borderTop: '1px solid hsl(220 20% 18%)', paddingTop: '6px' }}>
        Availability: {((available / data.installed_total_mw) * 100).toFixed(1)}%
      </div>
      <div className={styles.tooltipValue} style={{ color: getPercentColor(data.pct_unavailable), fontWeight: 700 }}>
        Unavailability: {data.pct_unavailable.toFixed(1)}%
      </div>
    </div>
  );
};

const PowerCapacityComparison = React.memo(() => {
  const data = FALLBACK_CAPACITY_DATA;

  const totalInstalled = useMemo(
    () => data.reduce((acc, d) => acc + d.installed_total_mw, 0),
    [data]
  );

  const totalUnavailable = useMemo(
    () => data.reduce((acc, d) => acc + d.unavailable_mw, 0),
    [data]
  );

  const totalAvailable = totalInstalled - totalUnavailable;

  const transformedData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        available: d.installed_total_mw - d.unavailable_mw,
      })),
    [data]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Potencia Disponible vs Indisponible por Tecnología</h2>
        <p className={styles.subtitle}>28-A 12:00 CEST — Fuente: Informe del Gobierno</p>
      </div>

      <div className={styles.alertBox}>
        ⚠️ DÉFICIT CRÍTICO DE POTENCIA TÉRMICA<br />
        La indisponibilidad de ciclos combinados (7.4 GW) y nuclear (3.1 GW)<br />
        limitó la capacidad de Red Eléctrica para controlar tensión y frecuencia.
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
          >
            <defs>
              {transformedData.map((d, idx) => (
                <linearGradient key={`grad-${idx}`} id={`statusGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getStatusColor(d.pct_unavailable)} />
                  <stop offset="100%" stopColor={getStatusColor(d.pct_unavailable)} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18% / 0.3)" />
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              height={80}
              tick={{ fill: 'hsl(220 12% 48%)', fontSize: 11 }}
            />
            <YAxis
              label={{ value: 'MW', angle: -90, position: 'insideLeft', style: { fill: 'hsl(220 12% 48%)' } }}
              tick={{ fill: 'hsl(220 12% 48%)', fontSize: 10 }}
              domain={[0, 28000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="available" fill="hsl(190 100% 60%)" opacity={0.9} name="Available" />
            <Bar dataKey="unavailable_mw" fill="hsl(38 100% 56%)" opacity={0.85} name="Unavailable">
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  style={{
                    filter: entry.pct_unavailable > 40 ? 'drop-shadow(0 0 6px hsl(0 75% 58% / 0.3))' : 'none',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(190 100% 60%)', borderRadius: '2px' }} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(38 100% 56%)', borderRadius: '2px' }} />
          <span>Unavailable</span>
        </div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryTitle}>TOTAL SYSTEM CAPACITY (28-A 12:00)</div>
        <div className={styles.summaryRow}>
          <span>Installed:</span>
          <span className={styles.summaryValue}>{(totalInstalled / 1000).toFixed(1)} GW</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Available:</span>
          <span className={styles.summaryValue} style={{ color: 'hsl(140 60% 50%)' }}>
            {(totalAvailable / 1000).toFixed(1)} GW ({((totalAvailable / totalInstalled) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span>Unavailable:</span>
          <span className={styles.summaryValue} style={{ color: 'hsl(0 75% 58%)' }}>
            {(totalUnavailable / 1000).toFixed(1)} GW ({((totalUnavailable / totalInstalled) * 100).toFixed(1)}%) 🔴 CRITICAL
          </span>
        </div>
        <div className={styles.summaryRow} style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
          <span>Most critical:</span>
          <span className={styles.summaryValue}>Ciclo Combinado 7.4 GW down (30.2%)</span>
        </div>
      </div>
    </div>
  );
});

PowerCapacityComparison.displayName = 'PowerCapacityComparison';

export default PowerCapacityComparison;
