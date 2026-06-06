import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

function getAuctionsPalette(isDark) {
  return {
    bgCard: isDark ? 'rgba(16, 29, 53, 0.76)' : 'rgba(255, 252, 245, 0.84)',
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.10)' : 'rgba(25, 24, 20, 0.10)',
    axis: isDark ? '#C7D2E3' : '#6B6255',
    axisMuted: isDark ? '#91A4BC' : '#7A7062',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.20)',

    title: isDark ? '#7DCDE3' : '#1F6F78',

    april28: isDark ? '#7DCDE3' : '#1F6F78',
    april29: isDark ? '#C4A5E8' : '#6E4D8B',

    shadow: isDark
      ? '0 10px 28px rgba(0, 0, 0, 0.24)'
      : '0 8px 24px rgba(25, 24, 20, 0.055)',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

const CustomTooltip = ({ active, payload, label, palette }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={styles.customTooltip}
        style={{
          backgroundColor: palette.bgTooltip,
          border: `1px solid ${palette.borderStrong}`,
          boxShadow: palette.tooltipShadow,
          color: palette.textPrimary,
        }}
      >
        <div
          className={styles.tooltipLabel}
          style={{
            fontWeight: 'bold',
            marginBottom: '5px',
            color: palette.textPrimary,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          {label}
        </div>

        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>
              {p.value !== undefined && p.value !== null
                ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 1 })
                : 0}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

function CategoryAxisTick({ x, y, payload, palette, maxChars = 34 }) {
  const fullLabel = String(payload?.value ?? '');
  const shortLabel =
    fullLabel.length > maxChars
      ? `${fullLabel.slice(0, maxChars - 1)}…`
      : fullLabel;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{fullLabel}</title>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill={palette.axisMuted || palette.axis || '#6B6255'}
        fontSize={11}
        fontFamily="Inter, sans-serif"
      >
        {shortLabel}
      </text>
    </g>
  );
}

export default function SubastasChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getAuctionsPalette(isDark);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/subastas-explicitas-capacidad.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          if (json.length >= 2) {
            const day1 = json[0];
            const day2 = json[1];
            const keys = Object.keys(day1).filter(k => k !== 'datetime');

            const formattedData = keys.map(k => {
              return {
                category: k.replace('en subasta explícita', '').replace('sentido', '').trim(),
                '28 Abril': day1[k] || 0,
                '29 Abril': day2[k] || 0
              };
            });
            formattedData.sort((a, b) => b['28 Abril'] - a['28 Abril']);
            setData(formattedData);
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
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: '#7A7062',
          textAlign: 'center',
          fontFamily: 'Space Mono',
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
          color: '#7A7062',
          textAlign: 'center',
        }}
      >
        No hay datos.
      </div>
    );
  }

  return (
    <div
      className={styles.chartContainer}
      style={{
        height: '700px',
        background: palette.bgCard,
        borderColor: palette.border,
        boxShadow: palette.shadow,
      }}
    >
      <h3
        className={styles.chartTitle}
        style={{
          color: palette.title,
          textShadow: 'none',
        }}
      >
        {isEs ? 'Subastas Explícitas de Capacidad' : 'Explicit Capacity Auctions'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 36, left: 8, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} horizontal={true} vertical={true} />
          <XAxis type="number" stroke={palette.axisLine} tick={{ fill: palette.axis, fontSize: 12, fontFamily: 'Space Mono' }} />
          <YAxis
            type="category"
            dataKey="category"
            stroke={palette.axisLine}
            tick={<CategoryAxisTick palette={palette} maxChars={34} />}
            width={220}
          />
          <Tooltip content={<CustomTooltip palette={palette} />} />
          <Legend
            wrapperStyle={{
              fontFamily: 'Inter',
              fontSize: '14px',
              paddingTop: '10px',
              color: palette.textSecondary,
            }}
            formatter={(value) => (
              <span style={{ color: palette.textSecondary }}>{value}</span>
            )}
          />
          <Bar dataKey="28 Abril" fill={palette.april28} radius={[0, 4, 4, 0]} barSize={8} />
          <Bar dataKey="29 Abril" fill={palette.april29} radius={[0, 4, 4, 0]} barSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
