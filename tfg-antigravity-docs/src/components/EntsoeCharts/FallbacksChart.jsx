import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function getFallbacksPalette(isDark) {
  return {
    bgCard: isDark ? 'rgba(16, 29, 53, 0.76)' : 'rgba(255, 252, 245, 0.84)',
    bgTableHead: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(25, 24, 20, 0.045)',
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    title: isDark ? '#7DCDE3' : '#1F6F78',

    danger: isDark ? '#D98798' : '#A13D36',
    dangerSoft: isDark ? 'rgba(217, 135, 152, 0.10)' : 'rgba(161, 61, 54, 0.08)',
    dangerBorder: isDark ? 'rgba(217, 135, 152, 0.36)' : 'rgba(161, 61, 54, 0.30)',

    success: isDark ? '#A6C67B' : '#2F6B4F',
    successSoft: isDark ? 'rgba(166, 198, 123, 0.10)' : 'rgba(47, 107, 79, 0.10)',
    successBorder: isDark ? 'rgba(166, 198, 123, 0.34)' : 'rgba(47, 107, 79, 0.30)',

    warning: isDark ? '#E6B45C' : '#A96000',
    warningSoft: isDark ? 'rgba(230, 180, 92, 0.11)' : 'rgba(169, 96, 0, 0.10)',
    warningBorder: isDark ? 'rgba(230, 180, 92, 0.34)' : 'rgba(169, 96, 0, 0.30)',

    series: isDark
      ? ['#D98798', '#E6B45C', '#7DCDE3', '#A6C67B', '#C4A5E8']
      : ['#A13D36', '#A96000', '#1F6F78', '#2F6B4F', '#6E4D8B'],

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function FallbacksChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getFallbacksPalette(isDark);
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/fallbacks.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          // Ordenar por fecha reciente
          const sorted = [...json].sort((a, b) => {
            const dateA = a.time_period.split(' ')[0].split('/').reverse().join('-');
            const dateB = b.time_period.split(' ')[0].split('/').reverse().join('-');
            return dateB.localeCompare(dateA);
          });
          setData(sorted);

          // Agrupar por event_type para el gráfico de torta
          const counts = {};
          json.forEach(item => {
            counts[item.event_type] = (counts[item.event_type] || 0) + 1;
          });
          const summary = Object.keys(counts).map(key => ({
            name: key,
            value: counts[key]
          }));
          setSummaryData(summary);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading fallbacks:", err);
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

  const COLORS = palette.series;

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
    borderRadius: 8,
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        color: palette.textPrimary,
      }}
    >
      
      {/* Gráfico de Resumen */}
      <div style={{ height: '300px', width: '100%' }}>
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: palette.title,
          }}
        >
          Distribución de Tipos de Contingencia (Fallbacks)
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summaryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent, x, y, cx }) => (
                <text
                  x={x}
                  y={y}
                  fill={palette.textSecondary}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  fontSize={12}
                  fontFamily="Inter"
                >
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              )}
              labelLine={{ stroke: palette.borderStrong }}
            >
              {summaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
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
                color: palette.textSecondary,
                fontSize: 13,
              }}
              formatter={(value) => (
                <span style={{ color: palette.textSecondary }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Eventos */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: '8px',
          border: `1px solid ${palette.border}`,
          background: palette.bgCard,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: palette.textPrimary,
          }}
        >
          <thead
            style={{
              backgroundColor: palette.bgTableHead,
              color: palette.textSecondary,
            }}
          >
            <tr>
              <th style={{ padding: '12px' }}>Periodo (UTC)</th>
              <th style={{ padding: '12px' }}>Área</th>
              <th style={{ padding: '12px' }}>Proceso</th>
              <th style={{ padding: '12px' }}>Tipo de Evento</th>
              <th style={{ padding: '12px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 15).map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: `1px solid ${palette.border}`,
                  backgroundColor: row.status === 'Cancelled' ? palette.dangerSoft : 'transparent',
                }}
              >
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{row.time_period}</td>
                <td style={{ padding: '10px 12px' }}><strong>{row.area}</strong></td>
                <td style={{ padding: '10px 12px' }}>{row.process_type}</td>
                <td style={{ padding: '10px 12px' }}>
                  {row.event_type.includes('disconnected') || row.event_type.includes('Failure') ? (
                    <span style={{ color: palette.danger, fontWeight: 'bold' }}>{row.event_type}</span>
                  ) : (
                    row.event_type
                  )}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      backgroundColor: row.status === 'Final' ? palette.successSoft : palette.warningSoft,
                      border: `1px solid ${row.status === 'Final' ? palette.successBorder : palette.warningBorder}`,
                      color: row.status === 'Final' ? palette.success : palette.warning,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: palette.textMuted,
        }}
      >
        * Mostrando los últimos 15 eventos registrados en el sistema.
      </div>
    </div>
  );
}
