import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import styles from './InertiaStackedBar.module.css';

const FALLBACK_INERTIA_DATA = [
  {
    id: 'NOROESTE',
    name: 'Noroeste',
    nuclear: 0,
    combined: 3714,
    coal: 1746,
    hydro: 6652,
    total: 12111,
    inertia_s: 3.84,
    status: 'adequate',
  },
  {
    id: 'NORTE',
    name: 'Norte',
    nuclear: 0,
    combined: 2995,
    coal: 0,
    hydro: 7843,
    total: 10837,
    inertia_s: 3.02,
    status: 'adequate',
  },
  {
    id: 'ESTE',
    name: 'Este',
    nuclear: 9642,
    combined: 0,
    coal: 0,
    hydro: 4105,
    total: 13747,
    inertia_s: 2.33,
    status: 'warning',
  },
  {
    id: 'CENTRO',
    name: 'Centro',
    nuclear: 2906,
    combined: 8875,
    coal: 0,
    hydro: 4204,
    total: 15984,
    inertia_s: 1.84,
    status: 'warning',
  },
  {
    id: 'SUR',
    name: 'Sur',
    nuclear: 0,
    combined: 2881,
    coal: 0,
    hydro: 1535,
    total: 4417,
    inertia_s: 1.30,
    status: 'critical',
  },
  {
    id: 'TOTAL',
    name: 'TOTAL SISTEMA',
    nuclear: 12547,
    combined: 18465,
    coal: 1746,
    hydro: 24339,
    total: 57097,
    inertia_s: 2.31,
    status: 'critical',
  },
];

const getInertiaColor = (status) => {
  switch (status) {
    case 'adequate':
      return 'hsl(140 60% 50%)';
    case 'warning':
      return 'hsl(38 100% 56%)';
    case 'critical':
      return 'hsl(0 75% 58%)';
    default:
      return 'hsl(190 100% 60%)';
  }
};

const getInertiaEmoji = (status) => {
  switch (status) {
    case 'adequate':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'critical':
      return '🔴';
    default:
      return '❓';
  }
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipLabel}>{data.name}</div>
      <div className={styles.tooltipValue}>
        Nuclear: {data.nuclear.toLocaleString()} MW ({((data.nuclear / data.total) * 100).toFixed(1)}%)
      </div>
      <div className={styles.tooltipValue}>
        Combined Cycle: {data.combined.toLocaleString()} MW ({((data.combined / data.total) * 100).toFixed(1)}%)
      </div>
      <div className={styles.tooltipValue}>
        Coal: {data.coal.toLocaleString()} MW ({((data.coal / data.total) * 100).toFixed(1)}%)
      </div>
      <div className={styles.tooltipValue}>
        Hydro: {data.hydro.toLocaleString()} MW ({((data.hydro / data.total) * 100).toFixed(1)}%)
      </div>
      <div className={styles.tooltipValue} style={{ marginTop: '6px', borderTop: '1px solid hsl(220 20% 18%)', paddingTop: '6px' }}>
        TOTAL: {data.total.toLocaleString()} MW
      </div>
      <div className={styles.tooltipValue} style={{ marginTop: '6px', color: getInertiaColor(data.status), fontWeight: 700 }}>
        Inertia: {data.inertia_s.toFixed(2)} s {getInertiaEmoji(data.status)}
      </div>
    </div>
  );
};

const InertiaStackedBar = React.memo(() => {
  const data = FALLBACK_INERTIA_DATA;

  const CustomShapeLabel = (props) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    const color = getInertiaColor(payload.status);
    return (
      <g>
        <rect x={x} y={y - 30} width={width} height={25} fill="hsl(220 40% 6% / 0.9)" rx={3} />
        <text
          x={x + width / 2}
          y={y - 15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: color, fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {payload.inertia_s.toFixed(2)}
        </text>
        <text
          x={x + width / 2}
          y={y - 3}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: color, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
        >
          s {getInertiaEmoji(payload.status)}
        </text>
      </g>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Distribución de Inercia Síncrona por Área</h2>
        <p className={styles.subtitle}>12:00 CEST, 28-A — Fuente: Informe ICAI, Tabla 4-1</p>
      </div>

      <div className={styles.alertBox}>
        ⚠️ CRÍTICO: Zona SUR operaba al 33% del mínimo de seguridad<br />
        La inercia total (2.31s) estaba por debajo del límite recomendado (≥3.5s)<br />
        El RoCoF alcanzó -1.85 Hz/s, disparando esquemas UFLS automáticos
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 50, right: 30, left: 60, bottom: 60 }}
          >
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
              domain={[0, 18000]}
              ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={4.0}
              stroke="hsl(0 75% 58% / 0.4)"
              strokeDasharray="5 5"
              label={{
                value: 'Safety threshold (4.0s)',
                position: 'right',
                fill: 'hsl(0 75% 58%)',
                fontSize: 9,
                offset: 10,
              }}
            />
            <Bar dataKey="hydro" stackId="a" fill="hsl(190 100% 60%)" opacity={0.9} shape={<CustomShapeLabel />} />
            <Bar dataKey="coal" stackId="a" fill="hsl(40 20% 40%)" opacity={0.85} />
            <Bar dataKey="combined" stackId="a" fill="hsl(30 100% 50%)" opacity={0.85} />
            <Bar dataKey="nuclear" stackId="a" fill="hsl(60 100% 50%)" opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(190 100% 60%)', borderRadius: '2px' }} />
          <span>Hydro</span>
        </div>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(40 20% 40%)', borderRadius: '2px' }} />
          <span>Coal</span>
        </div>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(30 100% 50%)', borderRadius: '2px' }} />
          <span>Combined Cycle</span>
        </div>
        <div className={styles.legendItem}>
          <div style={{ width: 12, height: 12, background: 'hsl(60 100% 50%)', borderRadius: '2px' }} />
          <span>Nuclear</span>
        </div>
      </div>
    </div>
  );
});

InertiaStackedBar.displayName = 'InertiaStackedBar';

export default InertiaStackedBar;
