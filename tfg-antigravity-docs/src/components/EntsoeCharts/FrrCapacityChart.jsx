import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

function getFrrCapacityPalette(isDark) {
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

    upAvg: isDark ? '#7DCDE3' : '#1F6F78',
    downAvg: isDark ? '#A6C67B' : '#2F6B4F',

    upMin: isDark ? '#B7EAF4' : '#155862',
    downMin: isDark ? '#D3E7B0' : '#24583F',

    outlook: isDark ? '#E6B45C' : '#A96000',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',
  };
}

export default function FrrCapacityChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getFrrCapacityPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/frr_actual_capacity_2025.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const formattedData = json.data.map(d => ({
            quarter: d.quarter,
            up_avg: d.up.actual_capacity_mw.avg,
            up_min: d.up.actual_capacity_mw.min,
            down_avg: d.down.actual_capacity_mw.avg,
            down_min: d.down.actual_capacity_mw.min,
            outlook: d.up.outlook_mw
          }));
          setData(formattedData);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading FRR capacity data:", err);
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

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
    borderRadius: 8,
  };

  const tickStyle = { fill: palette.axis };

  const customTooltipFormatter = (value, name) => {
    let label = name;
    switch(name) {
      case 'up_avg': label = "Capacidad Media (Subida)"; break;
      case 'down_avg': label = "Capacidad Media (Bajada)"; break;
      case 'up_min': label = "Mínimo Registrado (Subida)"; break;
      case 'down_min': label = "Mínimo Registrado (Bajada)"; break;
      case 'outlook': label = "Previsión (Outlook)"; break;
      default: break;
    }
    return [`${value} MW`, label];
  };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="quarter"
              tick={tickStyle}
              stroke={palette.axisLine}
              label={{
                value: isEs ? 'Trimestre' : 'Quarter',
                position: 'insideBottom',
                offset: -10,
                fill: palette.axis,
              }}
            />
            <YAxis
              tick={tickStyle}
              stroke={palette.axisLine}
              width={60}
              domain={[0, 1800]}
              label={{
                value: isEs ? 'Capacidad FRR (MW)' : 'FRR Capacity (MW)',
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
              formatter={customTooltipFormatter}
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
            
            <ReferenceLine
              y={1600}
              stroke={palette.outlook}
              strokeDasharray="5 5"
              label={{
                position: 'top',
                value: 'Previsión / Outlook (1600 MW)',
                fill: palette.outlook,
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <Bar
              dataKey="up_avg"
              name={isEs ? "Capacidad Media (Subida)" : "Avg Capacity (Up)"}
              fill={palette.upAvg}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            <Bar
              dataKey="down_avg"
              name={isEs ? "Capacidad Media (Bajada)" : "Avg Capacity (Down)"}
              fill={palette.downAvg}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            
            <Line
              type="monotone"
              dataKey="up_min"
              name={isEs ? "Mínimo Registrado (Subida)" : "Min Registered (Up)"}
              stroke={palette.upMin}
              strokeWidth={3}
              dot={{ r: 6, fill: palette.upMin }}
              activeDot={{
                r: 8,
                fill: palette.upMin,
                stroke: palette.activeDotStroke,
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="down_min"
              name={isEs ? "Mínimo Registrado (Bajada)" : "Min Registered (Down)"}
              stroke={palette.downMin}
              strokeWidth={3}
              dot={{ r: 6, fill: palette.downMin }}
              activeDot={{
                r: 8,
                fill: palette.downMin,
                stroke: palette.activeDotStroke,
                strokeWidth: 2,
              }}
            />
            
          </ComposedChart>
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
        * Reserva de Restauración de Frecuencia (FRR). Las barras muestran la media trimestral, las líneas el mínimo crítico disponible en el trimestre.
      </div>
    </div>
  );
}
