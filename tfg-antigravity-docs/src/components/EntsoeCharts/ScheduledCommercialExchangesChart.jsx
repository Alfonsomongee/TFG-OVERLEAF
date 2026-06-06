import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

function getScheduledCommercialPalette(isDark) {
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

    france: isDark ? '#7DCDE3' : '#1F6F78',
    portugal: isDark ? '#A6C67B' : '#2F6B4F',

    blackout: isDark ? '#D98798' : '#A13D36',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function ScheduledCommercialExchangesChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getScheduledCommercialPalette(isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/scheduled_commercial_exchanges_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.mtu_start.split(' ')[1]; // "10:00"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;
              const net_fr = d.es_to_fr_total - d.fr_to_es_total;
              const net_pt = d.es_to_pt_total - d.pt_to_es_total;
              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                net_fr: net_fr,
                net_pt: net_pt
              };
            });
          };
          const day28 = processDay(
            json.data.filter(d => d.datetime.startsWith('2025-04-28')),
            0
          );
          setData(day28);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading commercial exchanges:", err);
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

  const customTooltipFormatter = (value, name) => {
    const valStr = Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' MW';
    if (name === "Saldo Francia (ES -> FR)") {
      return [valStr, value >= 0 ? "Exportación Programada a FR" : "Importación Programada de FR"];
    }
    if (name === "Saldo Portugal (ES -> PT)") {
      return [valStr, value >= 0 ? "Exportación Programada a PT" : "Importación Programada de PT"];
    }
    return [valStr, name];
  };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
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
                value: isEs ? 'Intercambio Neto Programado (MW)' : 'Scheduled Net Exchange (MW)',
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

            <Bar
              dataKey="net_fr"
              stackId="a"
              name={isEs ? "Saldo Francia (ES -> FR)" : "France Balance (ES -> FR)"}
              fill={palette.france}
            />
            <Bar
              dataKey="net_pt"
              stackId="a"
              name={isEs ? "Saldo Portugal (ES -> PT)" : "Portugal Balance (ES -> PT)"}
              fill={palette.portugal}
            />
          </BarChart>
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
        * Valores positivos = Exportación neta desde España. Valores negativos = Importación neta a España.
      </div>
    </div>
  );
}
