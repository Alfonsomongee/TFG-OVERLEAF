import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

function getGenericEsiosPalette(isDark) {
  return {
    bgCard: isDark ? 'rgba(16, 29, 53, 0.76)' : 'rgba(255, 252, 245, 0.88)',
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    borderSoft: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.10)' : 'rgba(25, 24, 20, 0.10)',
    axis: isDark ? '#C7D2E3' : '#6B6255',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.22)',

    title: isDark ? '#7DCDE3' : '#1F6F78',
    loading: isDark ? '#D98798' : '#A13D36',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',

    shadow: isDark
      ? '0 10px 28px rgba(0, 0, 0, 0.24)'
      : '0 8px 24px rgba(25, 24, 20, 0.07)',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    series: isDark
      ? [
          '#7DCDE3',
          '#D98798',
          '#E6B45C',
          '#A6C67B',
          '#C4A5E8',
          '#91D7EA',
          '#A7ADB6',
        ]
      : [
          '#1F6F78',
          '#A13D36',
          '#A96000',
          '#2F6B4F',
          '#6E4D8B',
          '#2A7F88',
          '#5F5B54',
        ],
  };
}

const CustomTooltip = ({ active, payload, label, unit, palette }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={styles.customTooltip}
        style={{
          background: palette.bgTooltip,
          border: `1px solid ${palette.borderStrong}`,
          color: palette.textPrimary,
          boxShadow: palette.tooltipShadow,
          borderRadius: 8,
        }}
      >
        <div
          className={styles.tooltipLabel}
          style={{
            color: palette.textPrimary,
            borderBottom: `1px solid ${palette.borderSoft}`,
          }}
        >
          {new Date(label).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
        </div>
        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : 0} {unit}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GenericEsiosChart({ dataUrl, title, unit = '', includeKeys = null }) {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getGenericEsiosPalette(isDark);
  const chartColors = palette.series;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(dataUrl, { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          if (json.length > 0) {
            const allKeys = new Set();
            json.forEach(item => {
              Object.keys(item).forEach(k => {
                if (k !== 'datetime') {
                  if (!includeKeys || includeKeys.includes(k)) {
                    allKeys.add(k);
                  }
                }
              });
            });
            setKeys(Array.from(allKeys));

            if (includeKeys) {
               const filtered = json.map(item => {
                  const newItem = { datetime: item.datetime };
                  includeKeys.forEach(k => {
                     if (item[k] !== undefined) newItem[k] = item[k];
                  });
                  return newItem;
               });
               setData(filtered);
            } else {
               setData(json);
            }
          } else {
            setData(json);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando datos:', err);
        }
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [dataUrl, includeKeys]);

  if (loading) {
    return (
      <div
        style={{
          color: palette.loading,
          textAlign: 'center',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        Analizando archivos locales...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          color: palette.loading,
          textAlign: 'center',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        No hay datos.
      </div>
    );
  }

  const isBarChart = data.length < 5;

  return (
    <div
      className={styles.chartContainer}
      style={{
        background: palette.bgCard,
        border: `1px solid ${palette.borderSoft}`,
        boxShadow: palette.shadow,
        color: palette.textPrimary,
      }}
    >
      <h3
        className={styles.chartTitle}
        style={{
          color: palette.title,
          textShadow: 'none',
        }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        {isBarChart ? (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="datetime"
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('es-ES')}
              stroke={palette.axisLine}
              tick={{
                fill: palette.axis,
                fontSize: 12,
                fontFamily: 'Space Mono, monospace',
              }}
            />
            <YAxis
              width={90}
              stroke={palette.axisLine}
              tick={{
                fill: palette.axis,
                fontSize: 12,
                fontFamily: 'Space Mono, monospace',
              }}
              unit={` ${unit}`}
            />
            <Tooltip content={<CustomTooltip unit={unit} palette={palette} />} />
            {keys.length <= 6 && (
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  paddingTop: '20px',
                  color: palette.textSecondary,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
            )}
            {keys.map((k, idx) => (
              <Bar
                key={k}
                dataKey={k}
                name={k}
                fill={chartColors[idx % chartColors.length]}
                radius={[2, 2, 0, 0]}
                stackId="a"
              />
            ))}
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <defs>
              {keys.map((k, idx) => (
                <linearGradient key={`grad-${idx}`} id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[idx % chartColors.length]} stopOpacity={isDark ? 0.34 : 0.24} />
                  <stop offset="95%" stopColor={chartColors[idx % chartColors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="datetime"
              tickFormatter={(tick) => {
                const d = new Date(tick);
                return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes() === 0 ? '00' : d.getMinutes()}`;
              }}
              stroke={palette.axisLine}
              tick={{
                fill: palette.axis,
                fontSize: 12,
                fontFamily: 'Space Mono, monospace',
              }}
              minTickGap={40}
            />
            <YAxis
              width={90}
              stroke={palette.axisLine}
              tick={{
                fill: palette.axis,
                fontSize: 12,
                fontFamily: 'Space Mono, monospace',
              }}
              unit={` ${unit}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip unit={unit} palette={palette} />} />
            {keys.length <= 6 && (
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  paddingTop: '20px',
                  color: palette.textSecondary,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
            )}
            {keys.map((k, idx) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                name={k}
                stroke={chartColors[idx % chartColors.length]}
                fillOpacity={1}
                fill={`url(#color-${idx})`}
                strokeWidth={2}
                activeDot={{
                  r: 4,
                  fill: chartColors[idx % chartColors.length],
                  stroke: palette.activeDotStroke,
                  strokeWidth: 1,
                }}
                isAnimationActive={true}
                connectNulls={true}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
