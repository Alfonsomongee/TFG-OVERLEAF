import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

function getCongestionCostPalette(isDark) {
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

    countertrading: isDark ? '#7DCDE3' : '#1F6F78',
    redispatching: isDark ? '#D98798' : '#A13D36',
    other: isDark ? '#A6C67B' : '#2F6B4F',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function CostCongestionChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getCongestionCostPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/cost_congestion_management.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          setData(json.data);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading cost congestion:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (!data || data.length === 0) {
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

  // Format tooltip currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
            <XAxis
              dataKey="month"
              stroke={palette.axisLine}
              tick={{ fill: palette.axis, fontSize: 12 }}
            />
            <YAxis
              stroke={palette.axisLine}
              tick={{ fill: palette.axis, fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M €`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: palette.bgTooltip,
                border: `1px solid ${palette.borderStrong}`,
                color: palette.textPrimary,
                boxShadow: palette.tooltipShadow,
                borderRadius: 8,
              }}
              labelStyle={{
                color: palette.textPrimary,
                fontWeight: 700,
              }}
              itemStyle={{
                color: palette.textSecondary,
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                color: palette.textSecondary,
              }}
              formatter={(value) => (
                <span style={{ color: palette.textSecondary }}>{value}</span>
              )}
            />
            
            <Bar
              dataKey="countertrading_costs_eur"
              name={isEs ? "Costes de Countertrading" : "Countertrading Costs"}
              stackId="a"
              fill={palette.countertrading}
            />
            <Bar
              dataKey="redispatching_costs_eur"
              name={isEs ? "Costes de Redespacho" : "Redispatching Costs"}
              stackId="a"
              fill={palette.redispatching}
            />
            <Bar
              dataKey="other_costs_eur"
              name={isEs ? "Otros Costes" : "Other Costs"}
              stackId="a"
              fill={palette.other}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
