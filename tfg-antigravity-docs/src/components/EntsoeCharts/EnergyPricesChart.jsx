import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea
} from 'recharts';

function getEnergyPricesPalette(isDark) {
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
    zeroLine: isDark ? 'rgba(244, 247, 251, 0.34)' : 'rgba(25, 24, 20, 0.30)',

    positive: isDark ? '#A6C67B' : '#2F6B4F',
    negative: isDark ? '#D98798' : '#A13D36',
    collapse: isDark ? '#D98798' : '#A13D36',

    negativeFill: isDark ? 'rgba(217, 135, 152, 0.10)' : 'rgba(161, 61, 54, 0.08)',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',
  };
}

export default function EnergyPricesChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getEnergyPricesPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/energy_prices_day_ahead_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const day28 = json.data.Spain['2025-04-28'].map(d => ({
            time: d.hour.split(' - ')[0],
            raw_time: d.hour,
            price: d.price_eur_per_mwh,
            date: '28/04'
          }));
          const day29 = json.data.Spain['2025-04-29'].map(d => ({
            time: d.hour.split(' - ')[0] + ' (29/04)',
            raw_time: d.hour,
            price: d.price_eur_per_mwh,
            date: '29/04'
          }));
          setData([...day28, ...day29]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading energy prices data:", err);
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

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
    borderRadius: 8,
  };

  const tickStyle = { fill: palette.axis };

  // Calculate gradient offset so negative values are colored differently (red)
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const gradientOffset = () => {
    if (maxPrice <= 0) return 0;
    if (minPrice >= 0) return 1;
    return maxPrice / (maxPrice - minPrice);
  };
  const off = gradientOffset();

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor={palette.positive} stopOpacity={1} />
                <stop offset={off} stopColor={palette.negative} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
            <XAxis
              dataKey="time"
              tick={tickStyle}
              stroke={palette.axisLine}
              minTickGap={30}
              label={{
                value: isEs ? 'Hora' : 'Time',
                position: 'insideBottom',
                offset: -10,
                fill: palette.axis,
              }}
            />
            <YAxis
              tickFormatter={(val) => `${val} €`}
              tick={tickStyle}
              stroke={palette.axisLine}
              width={60}
              label={{
                value: isEs ? 'Precio Diario OMIE (€/MWh)' : 'Daily OMIE Price (€/MWh)',
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
              formatter={(value) => [
                new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value),
                'Precio OMIE',
              ]}
              labelFormatter={(t) => `Hora: ${t}`}
            />
            
            <ReferenceLine y={0} stroke={palette.zeroLine} />
            
            <ReferenceLine x="12:00" stroke={palette.collapse} strokeWidth={2} strokeDasharray="6 6">
              <Label
                value="Colapso (12:33 CEST)"
                position="insideTopLeft"
                fill={palette.collapse}
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>

            {/* Zonas sombreadas para destacar precios negativos */}
            <ReferenceArea y1={minPrice} y2={0} fill={palette.negativeFill} />

            <Line
              type="monotone"
              dataKey="price"
              name={isEs ? "Precio Diario (€/MWh)" : "Daily Price (€/MWh)"}
              stroke="url(#colorPrice)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 8,
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
        * Precios casados 24 horas antes en el mercado diario ibérico (OMIE). Reflejan una señal económica previa de exceso de renovables, no las consecuencias del apagón.
      </div>
    </div>
  );
}
