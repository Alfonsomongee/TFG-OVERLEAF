import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

function getImbalancePalette(isDark) {
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

    deficitFill: isDark ? '#D98798' : '#A13D36',
    deficitStroke: isDark ? '#F0B4C0' : '#7F2E2A',

    surplusFill: isDark ? '#A6C67B' : '#2F6B4F',
    surplusStroke: isDark ? '#D3E7B0' : '#24583F',

    collapse: isDark ? '#E6B45C' : '#A96000',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function ImbalanceChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getImbalancePalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/imbalance_spain_28_29_april_2025.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.datetime.slice(11, 16); // "10:30"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;

              // Separamos por deficit y superavit para las áreas
              const deficit = d.situation === 'Deficit' ? d.imbalance_mwh : 0;
              const surplus = d.situation === 'Surplus' ? d.imbalance_mwh : 0;

              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                imbalance_mwh: d.imbalance_mwh,
                situation: d.situation,
                deficit: deficit,
                surplus: surplus
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
          console.error("Error loading imbalance data:", err);
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

  const customTooltipFormatter = (value, name, props) => {
    if (value === 0) return null; // Hide 0 values in tooltip
    const valStr = value.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' MWh';
    return [valStr, name];
  };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
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
              width={60}
              domain={[0, 1800]}
              label={{
                value: isEs ? 'Imbalance (MWh)' : 'Imbalance (MWh)',
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

            {/* We map deficit to red and surplus to green */}
            <Area
              type="step"
              dataKey="deficit"
              name={isEs ? "Déficit (Falta Generación)" : "Deficit (Lack of Generation)"}
              fill={palette.deficitFill}
              stroke={palette.deficitStroke}
              fillOpacity={0.36}
            />
            <Area
              type="step"
              dataKey="surplus"
              name={isEs ? "Superávit (Exceso Generación)" : "Surplus (Excess Generation)"}
              fill={palette.surplusFill}
              stroke={palette.surplusStroke}
              fillOpacity={0.36}
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
        * Imbalance (TR 17.1.G&H). Valores representan magnitud del desequilibrio horario en MWh.
      </div>
    </div>
  );
}
