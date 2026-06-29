import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

function getTotalLoadPalette(isDark) {
  return {
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.10)' : 'rgba(25, 24, 20, 0.10)',
    axis: isDark ? '#C7D2E3' : '#6B6255',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.20)',

    collapse: isDark ? '#D98798' : '#A13D36',

    esForecast: isDark ? '#91A4BC' : '#7A7062',
    esActual: isDark ? '#E6B45C' : '#A96000',

    ptForecast: isDark ? '#A7ADB6' : '#8A8173',
    ptActual: isDark ? '#7DCDE3' : '#1F6F78',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',
  };
}

export default function TotalLoadChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getTotalLoadPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/total_load_day_ahead_actual_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.mtu.split(' - ')[0]; // "10:00"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;
              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                es_forecast: d.es_forecast,
                es_actual: d.es_actual,
                pt_forecast: d.pt_forecast,
                pt_actual: d.pt_actual
              };
            });
          };
          const day28 = processDay(json.data['2025-04-28'], 0);
          const day29 = processDay(json.data['2025-04-29'], 24);
          setData([...day28, ...day29]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading total load data:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (data.length === 0) {
    return (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#7A7062',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        {isEs ? 'Cargando datos...' : 'Loading data...'}
      </div>
    );
  }

  const formatTime = (decimalTime) => {
    const hours = Math.floor(decimalTime) % 24;
    const mins = Math.round((decimalTime % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
    borderRadius: 8,
  };

  const tickStyle = { fill: palette.axis };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
            <XAxis
              dataKey="timeNum"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTime}
              tick={tickStyle}
              stroke={palette.axisLine}
              tickCount={12}
              label={{
                value: isEs ? 'Hora (UTC)' : 'Time (UTC)',
                position: 'insideBottom',
                offset: -10,
                fill: palette.axis,
              }}
            />
            <YAxis
              tick={tickStyle}
              stroke={palette.axisLine}
              width={80}
              label={{
                value: isEs ? 'Demanda (MW)' : 'Demand (MW)',
                angle: -90,
                position: 'insideLeft',
                fill: palette.axis,
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{
                color: palette.textPrimary,
                fontWeight: 700,
              }}
              itemStyle={{
                color: palette.textSecondary,
              }}
              formatter={(value, name) => [`${value?.toLocaleString() || 'N/A'} MW`, name]}
              labelFormatter={(t) => `Hora UTC: ${formatTime(t)}`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                color: palette.textSecondary,
              }}
              formatter={(value) => (
                <span style={{ color: palette.textSecondary }}>{value}</span>
              )}
            />
            
            <ReferenceLine x={10.55} stroke={palette.collapse} strokeWidth={2} strokeDasharray="6 6">
              <Label
                value="Colapso (12:33 CEST)"
                position="insideTopLeft"
                fill={palette.collapse}
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>

            {/* Spain */}
            <Line
              type="monotone"
              dataKey="es_forecast"
              name={isEs ? "ES Previsión (Day-Ahead)" : "ES Forecast (Day-Ahead)"}
              stroke={palette.esForecast}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              connectNulls={false}
              type="monotone"
              dataKey="es_actual"
              name={isEs ? "ES Real (Actual)" : "ES Actual"}
              stroke={palette.esActual}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 8,
                fill: palette.esActual,
                stroke: palette.activeDotStroke,
                strokeWidth: 2,
              }}
            />
            
            {/* Portugal */}
            <Line
              type="monotone"
              dataKey="pt_forecast"
              name={isEs ? "PT Previsión (Day-Ahead)" : "PT Forecast (Day-Ahead)"}
              stroke={palette.ptForecast}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              connectNulls={false}
              type="monotone"
              dataKey="pt_actual"
              name={isEs ? "PT Real (Actual)" : "PT Actual"}
              stroke={palette.ptActual}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 8,
                fill: palette.ptActual,
                stroke: palette.activeDotStroke,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: palette.textMuted,
          marginTop: '0.5rem',
        }}
      >
        * Valores nulos (ausencia de línea) en la demanda de España (ES) indican pérdida total de telemetría tras el cero de tensión.
      </div>
    </div>
  );
}
