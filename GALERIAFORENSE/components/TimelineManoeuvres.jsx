import React, { useMemo, useState, useCallback } from 'react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useRealData } from './hooks/useRealData';
import styles from './TimelineManoeuvres.module.css';

const FALLBACK_TIMELINE_DATA = [
  { hora: '09:02', elemento: 'LINE L-400 kV ALMARAZ — SAN SERVÁN 1', tipo: 'LINE', zona: 'SOUTH', movimiento: 'SWITCH ON' },
  { hora: '09:15', elemento: 'HVDC 320 kV STA. LLOGAIA — BAIXAS', tipo: 'HVDC', zona: 'NORTHEAST', movimiento: 'RAISE THE SETPOINT TO 413 kV' },
  { hora: '09:33', elemento: 'SHUNT REACTOR 220 kV CÓRDOBA', tipo: 'SHUNT', zona: 'SOUTH', movimiento: 'SWITCH OFF' },
  { hora: '10:05', elemento: 'CONDENSER 400 kV CASTEJÓN', tipo: 'CONDENSER', zona: 'CENTRE', movimiento: 'SWITCH ON' },
  { hora: '10:33', elemento: 'LINE L-220 kV JAÉN — CÓRDOBA', tipo: 'LINE', zona: 'SOUTH', movimiento: 'SWITCH ON' },
  { hora: '11:02', elemento: 'HVDC 320 kV RAISE POWER FLOW', tipo: 'HVDC', zona: 'NORTHEAST', movimiento: 'RAISE THE SETPOINT TO 425 kV' },
  { hora: '11:18', elemento: 'SHUNT REACTOR 400 kV BAILÉN', tipo: 'SHUNT', zona: 'CENTRE', movimiento: 'SWITCH OFF' },
  { hora: '11:45', elemento: 'CONDENSER 220 kV PUERTOLLANO', tipo: 'CONDENSER', zona: 'SOUTH', movimiento: 'SWITCH ON' },
  { hora: '12:02', elemento: 'HVDC 320 kV REDUCTION', tipo: 'HVDC', zona: 'NORTHEAST', movimiento: 'REDUCE THE SETPOINT TO 405 kV' },
  { hora: '12:16', elemento: 'LINE L-400 kV MÉRIDA — BADAJOZ 2', tipo: 'LINE', zona: 'SOUTH', movimiento: 'SWITCH ON' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipLabel}>⏱ {data.hora} CEST</div>
      <div className={styles.tooltipValue}>{data.elemento}</div>
      <div className={styles.tooltipValue} style={{ marginTop: '4px', fontSize: '10px', color: 'hsl(190 100% 60%)' }}>
        {data.tipo} • {data.zona}
      </div>
      <div className={styles.tooltipValue} style={{ marginTop: '4px', fontSize: '10px', color: 'hsl(38 100% 56%)' }}>
        {data.movimiento}
      </div>
    </div>
  );
};

const TimelineManoeuvres = React.memo(() => {
  const { ready, errors } = useRealData();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const timelineData = useMemo(() => {
    const data = FALLBACK_TIMELINE_DATA.map((event, idx) => ({
      ...event,
      index: idx,
      y: idx,
      // Parse time to minutes for X-axis
      minutes: parseInt(event.hora.split(':')[0]) * 60 + parseInt(event.hora.split(':')[1]),
    }));
    return data;
  }, []);

  const getShapeColor = (movimiento) => {
    if (movimiento.includes('SWITCH ON')) return 'hsl(140 60% 50%)';
    if (movimiento.includes('SWITCH OFF')) return 'hsl(38 100% 56%)';
    if (movimiento.includes('RAISE')) return 'hsl(190 100% 60%)';
    if (movimiento.includes('REDUCE')) return 'hsl(190 100% 60%)';
    return 'hsl(190 100% 60%)';
  };

  const getShapeShape = (movimiento) => {
    if (movimiento.includes('SWITCH ON')) return 'circle';
    if (movimiento.includes('SWITCH OFF')) return 'circle';
    if (movimiento.includes('RAISE')) return 'triangle';
    if (movimiento.includes('REDUCE')) return 'triangle';
    return 'circle';
  };

  if (!ready) {
    return <div className={styles.container}>Cargando datos...</div>;
  }

  if (errors.length > 0) {
    console.warn('useRealData errors:', errors);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Timeline de Maniobras de Control de Tensión</h2>
        <p className={styles.subtitle}>Red Eléctrica — 09:00 a 12:32 CEST, 28-A</p>
      </div>

      <div className={styles.alertBox}>
        ⚠️ Cascada de maniobras indica operación al límite. Cada ajuste incrementa fragilidad.
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendSymbol} style={{ background: 'hsl(140 60% 50%)' }} />
          <span>● SWITCH ON</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendSymbol} style={{ background: 'hsl(38 100% 56%)', border: '2px solid hsl(38 100% 56%)' }} />
          <span>○ SWITCH OFF</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendSymbol} style={{ background: 'hsl(190 100% 60%)' }} />
          <span>▲ HVDC Raise</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendSymbol} style={{ background: 'hsl(190 100% 60%)' }} />
          <span>▼ HVDC Reduce</span>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
          >
            <defs>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(220 20% 18% / 0.3)" />
                <stop offset="100%" stopColor="hsl(220 20% 18% / 0.1)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 20% 18% / 0.3)"
              verticalPoints={timelineData.map((d) => d.minutes)}
            />
            <XAxis
              dataKey="hora"
              angle={0}
              textAnchor="middle"
              height={60}
              tick={{ fill: 'hsl(220 12% 48%)', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={12 * 60 + 32}
              stroke="hsl(0 75% 58%)"
              strokeDasharray="5 5"
              label={{
                value: '12:32:57 — CASCADA INICIA',
                position: 'top',
                fill: 'hsl(0 75% 58%)',
                fontSize: 11,
              }}
            />
            <Scatter
              name="Maneuvers"
              data={timelineData}
              fill="hsl(190 100% 60%)"
              shape={({ cx, cy, payload }) => {
                const color = getShapeColor(payload.movimiento);
                const isOn = payload.movimiento.includes('SWITCH ON');
                const isRaise = payload.movimiento.includes('RAISE');

                if (isOn) {
                  // Filled circle
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={color}
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.9}
                      onMouseEnter={() => setHoveredIndex(payload.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        filter: hoveredIndex === payload.index ? `drop-shadow(0 0 8px ${color})` : 'none',
                        cursor: 'pointer',
                        transition: 'filter 200ms ease-out',
                      }}
                    />
                  );
                } else if (payload.movimiento.includes('SWITCH OFF')) {
                  // Unfilled circle
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="transparent"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.85}
                      onMouseEnter={() => setHoveredIndex(payload.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        filter: hoveredIndex === payload.index ? `drop-shadow(0 0 8px ${color})` : 'none',
                        cursor: 'pointer',
                        transition: 'filter 200ms ease-out',
                      }}
                    />
                  );
                } else if (isRaise || payload.movimiento.includes('REDUCE')) {
                  // Triangle
                  const size = 8;
                  const points = isRaise
                    ? `${cx},${cy - size} ${cx + size},${cy + size} ${cx - size},${cy + size}`
                    : `${cx},${cy + size} ${cx + size},${cy - size} ${cx - size},${cy - size}`;
                  return (
                    <polygon
                      points={points}
                      fill={color}
                      opacity={0.85}
                      onMouseEnter={() => setHoveredIndex(payload.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        filter: hoveredIndex === payload.index ? `drop-shadow(0 0 8px ${color})` : 'none',
                        cursor: 'pointer',
                        transition: 'filter 200ms ease-out',
                      }}
                    />
                  );
                }
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.counter}>
        {timelineData.length} maneuvers en 3h 32min
      </div>
    </div>
  );
});

TimelineManoeuvres.displayName = 'TimelineManoeuvres';

export default TimelineManoeuvres;
