import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, ReferenceArea
} from 'recharts';

function getImbalancePricesPalette(isDark) {
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

    lowZone: isDark ? 'rgba(166, 198, 123, 0.08)' : 'rgba(47, 107, 79, 0.07)',
    mediumZone: isDark ? 'rgba(230, 180, 92, 0.09)' : 'rgba(169, 96, 0, 0.07)',
    highZone: isDark ? 'rgba(217, 135, 152, 0.10)' : 'rgba(161, 61, 54, 0.08)',

    maxPrice: isDark ? '#D98798' : '#A13D36',
    positivePrice: isDark ? '#7DCDE3' : '#1F6F78',
    negativePrice: isDark ? '#E6B45C' : '#A96000',

    collapse: isDark ? '#D98798' : '#A13D36',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',
  };
}

export default function ImbalancePricesChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getImbalancePricesPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/imbalance_prices_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const formattedData = json.data['2025-04-28'].map(d => {
            const startTime = d.time_interval.split(' - ')[0]; // Ej: "10:15"
            return {
              time: startTime,
              raw_time: startTime,
              price_positive: d.positive_imbalance_price_eur_mwh,
              price_negative: d.negative_imbalance_price_eur_mwh,
              // Tomamos el mayor de los dos como el precio más representativo de la tensión del sistema
              price_eur_mwh: Math.max(d.positive_imbalance_price_eur_mwh, d.negative_imbalance_price_eur_mwh),
              situation: d.situation
            };
          });
          setData(formattedData);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading imbalance prices:", err);
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
          color: palette.textMuted,
          fontFamily: 'Space Mono, monospace',
        }}
      >
        {isEs ? 'Cargando datos...' : 'Loading data...'}
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
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
              dataKey="time"
              tick={tickStyle}
              stroke={palette.axisLine}
              minTickGap={30}
              label={{
                value: isEs ? 'Hora (UTC)' : 'Time (UTC)',
                position: 'insideBottom',
                offset: -10,
                fill: palette.axis,
              }}
            />
            <YAxis
              tickFormatter={(val) => `${val} €`}
              tick={tickStyle}
              stroke={palette.axisLine}
              width={80}
              domain={['auto', 'auto']}
              allowDataOverflow
              label={{
                value: isEs ? 'Precio Imbalance (€/MWh)' : 'Imbalance Price (€/MWh)',
                angle: -90,
                position: 'insideLeft',
                fill: palette.axis,
              }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(t) => `Hora UTC: ${t}`}
              contentStyle={tooltipStyle}
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
                paddingTop: '10px',
                color: palette.textSecondary,
              }}
              formatter={(value) => (
                <span style={{ color: palette.textSecondary }}>{value}</span>
              )}
            />
            
            {/* Zonas de color para marcar el nivel de severidad */}
            <ReferenceArea y1={0} y2={100} fill={palette.lowZone} />
            <ReferenceArea y1={100} y2={500} fill={palette.mediumZone} />
            <ReferenceArea y1={500} fill={palette.highZone} />

            <Line
              type="stepAfter"
              dataKey="price_eur_mwh"
              name={isEs ? "Precio Imbalance (Máx)" : "Imbalance Price (Max)"}
              stroke={palette.maxPrice}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 8,
                fill: palette.maxPrice,
                stroke: palette.activeDotStroke,
                strokeWidth: 2,
              }}
            />
            <Line
              type="stepAfter"
              dataKey="price_positive"
              name={isEs ? "Precio (+) Surplus" : "Price (+) Surplus"}
              stroke={palette.positivePrice}
              strokeWidth={1}
              dot={false}
              strokeDasharray="3 3"
            />
            <Line
              type="stepAfter"
              dataKey="price_negative"
              name={isEs ? "Precio (-) Deficit" : "Price (-) Deficit"}
              stroke={palette.negativePrice}
              strokeWidth={1}
              dot={false}
              strokeDasharray="3 3"
            />
            
            <ReferenceLine x="10:30" stroke={palette.collapse} strokeWidth={2} strokeDasharray="6 6">
              <Label
                value="Colapso (12:33 CEST)"
                position="insideTopLeft"
                fill={palette.collapse}
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
