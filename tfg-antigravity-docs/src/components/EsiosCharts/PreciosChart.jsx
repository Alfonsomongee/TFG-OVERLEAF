import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

function getPricesPalette(isDark) {
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
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.20)',

    title: isDark ? '#7DCDE3' : '#1F6F78',

    pvpc: isDark ? '#7DCDE3' : '#1F6F78',
    spot: isDark ? '#E6B45C' : '#A96000',

    blackoutFill: isDark ? 'rgba(217, 135, 152, 0.12)' : 'rgba(161, 61, 54, 0.10)',
    blackoutStroke: isDark ? 'rgba(217, 135, 152, 0.34)' : 'rgba(161, 61, 54, 0.30)',

    shadow: isDark
      ? '0 10px 28px rgba(0, 0, 0, 0.24)'
      : '0 8px 24px rgba(25, 24, 20, 0.055)',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',

    activeDotStroke: isDark ? '#101D35' : '#FFFCF5',
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
            color: palette.textPrimary,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          {new Date(label).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
        </div>

        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>
              {p.value !== undefined && p.value !== null
                ? p.value.toLocaleString('es-ES', { minimumFractionDigits: 2 })
                : 0} €/MWh
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function PreciosChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getPricesPalette(isDark);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/precios_28_29_abril.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando datos de precios:', err);
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
        Iniciando extracción de datos forenses...
      </div>
    );
  }

  // Rango del Blackout para sombrear: 28 abril 12:30 a 29 abril 08:00 (aprox)
  const blackoutStart = data.find(d => d.datetime.startsWith('2025-04-28T12:00'))?.datetime; // Precios son horarios
  const blackoutEnd = data.find(d => d.datetime.startsWith('2025-04-29T08:00'))?.datetime;
  
  return (
    <div
      className={styles.chartContainer}
      style={{
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
        {isEs ? 'Impacto en Mercados y Precios (28-29 Abril)' : 'Market & Price Impact (Apr 28-29)'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
          
          <XAxis
            dataKey="datetime"
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:00`;
            }}
            stroke={palette.axisLine}
            tick={{ fill: palette.axis, fontSize: 12, fontFamily: 'Space Mono' }}
            minTickGap={30}
          />
          <YAxis
            stroke={palette.axisLine}
            tick={{ fill: palette.axis, fontSize: 12, fontFamily: 'Space Mono' }}
            unit=" €"
            domain={['auto', 'auto']}
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

          {/* Marcador de Blackout */}
          {blackoutStart && blackoutEnd && (
            <ReferenceArea
              x1={blackoutStart}
              x2={blackoutEnd}
              stroke={palette.blackoutStroke}
              strokeOpacity={0.8}
              fill={palette.blackoutFill}
            />
          )}

          <Line
            type="monotone"
            dataKey="PVPC T. 2.0TD"
            stroke={palette.pvpc}
            strokeWidth={2}
            name={isEs ? "Precio PVPC (Minorista)" : "PVPC Price (Retail)"}
            dot={{ r: 3, fill: palette.pvpc }}
            activeDot={{ r: 6, fill: palette.pvpc, stroke: palette.activeDotStroke, strokeWidth: 2 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="Mercado SPOT"
            stroke={palette.spot}
            strokeWidth={2}
            name={isEs ? "Mercado Mayorista (SPOT)" : "Wholesale Market (SPOT)"}
            dot={{ r: 3, fill: palette.spot }}
            activeDot={{ r: 6, fill: palette.spot, stroke: palette.activeDotStroke, strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
