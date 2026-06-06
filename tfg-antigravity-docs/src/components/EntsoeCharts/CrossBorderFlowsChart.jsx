import React, { useState, useEffect } from 'react';
import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

function getCrossBorderPalette(isDark) {
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

    zeroLine: isDark ? 'rgba(244, 247, 251, 0.34)' : 'rgba(25, 24, 20, 0.28)',

    franceFill: isDark ? '#7DCDE3' : '#1F6F78',
    franceStroke: isDark ? '#B7EAF4' : '#155862',

    portugalFill: isDark ? '#A6C67B' : '#2F6B4F',
    portugalStroke: isDark ? '#D3E7B0' : '#24583F',

    blackout: isDark ? '#D98798' : '#A13D36',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function CrossBorderFlowsChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getCrossBorderPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/cross_border_physical_flows_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.mtu.split(' - ')[0]; // "10:00"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;
              const net_fr = d.es_to_fr_mw - d.fr_to_es_mw;
              const net_pt = d.es_to_pt_mw - d.pt_to_es_mw;
              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                net_fr: net_fr,
                net_pt: net_pt
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
          console.error("Error loading cross border flows:", err);
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

  const customTooltipFormatter = (value, name) => {
    const valStr = Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' MW';
    if (name === (isEs ? "Flujo Francia" : "France Flow")) {
      return [valStr, value >= 0 ? (isEs ? "Exportación a FR" : "Export to FR") : (isEs ? "Importación de FR" : "Import from FR")];
    }
    if (name === (isEs ? "Flujo Portugal" : "Portugal Flow")) {
      return [valStr, value >= 0 ? (isEs ? "Exportación a PT" : "Export to PT") : (isEs ? "Importación de PT" : "Import from PT")];
    }
    return [valStr, name];
  };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
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
                value: isEs ? 'Flujo Físico Neto (MW)' : 'Net Physical Flow (MW)',
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
              labelFormatter={(t) => (isEs ? 'Hora UTC: ' : 'Time UTC: ') + formatTime(t)}
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
            
            <ReferenceLine y={0} stroke={palette.zeroLine} />
            
            <ReferenceLine x={10.55} stroke={palette.blackout} strokeWidth={2} strokeDasharray="6 6">
              <Label
                value={isEs ? "Apagón (12:33 CEST)" : "Blackout (12:33 CEST)"}
                position="insideTopLeft"
                fill={palette.blackout}
                fontSize={12}
                fontWeight="bold"
              />
            </ReferenceLine>

            {/* Utilizamos Area para los flujos físicos para mostrar el "volumen" de energía */}
            <Area
              type="monotone"
              dataKey="net_fr"
              name={isEs ? "Flujo Francia" : "France Flow"}
              fill={palette.franceFill}
              stroke={palette.franceStroke}
              fillOpacity={0.32}
            />
            <Area
              type="monotone"
              dataKey="net_pt"
              name={isEs ? "Flujo Portugal" : "Portugal Flow"}
              fill={palette.portugalFill}
              stroke={palette.portugalStroke}
              fillOpacity={0.32}
            />

          </AreaChart>
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
        {isEs 
          ? '* Flujos físicos netos. Valores positivos indican exportación desde España. Se aprecia el cero absoluto (0 MW) al entrar en "isla eléctrica".'
          : '* Net physical flows. Positive values indicate exports from Spain. The absolute zero (0 MW) is visible upon entering "electrical island" mode.'}
      </div>
    </div>
  );
}
