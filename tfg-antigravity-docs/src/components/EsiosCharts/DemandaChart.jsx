import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

function getDemandPalette(isDark) {
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

    real: isDark ? '#E6B45C' : '#A96000',
    scheduled: isDark ? '#7DCDE3' : '#1F6F78',
    forecast: isDark ? '#C4A5E8' : '#6E4D8B',

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
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES') : 0} MW</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function DemandaChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getDemandPalette(isDark);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/demanda_28_29_abril.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const formattedData = json.map(item => ({
            ...item,
            timeStr: new Date(item.datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            dateStr: new Date(item.datetime).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
          }));
          setData(formattedData);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando datos de demanda:', err);
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
  // El colapso total empieza a las 12:35 del 28.
  const blackoutStart = data.find(d => d.datetime.startsWith('2025-04-28T12:30'))?.datetime;
  
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
        {isEs ? 'Evolución de la Demanda (28-29 Abril)' : 'Demand Evolution (Apr 28-29)'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorDemandaReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={palette.real} stopOpacity={0.42}/>
              <stop offset="95%" stopColor={palette.real} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDemandaProg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={palette.scheduled} stopOpacity={0.18}/>
              <stop offset="95%" stopColor={palette.scheduled} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />

          <XAxis
            dataKey="datetime"
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes() === 0 ? '00' : d.getMinutes()}`;
            }}
            stroke={palette.axisLine}
            tick={{ fill: palette.axis, fontSize: 12, fontFamily: 'Space Mono' }}
            minTickGap={50}
          />
          <YAxis
            width={90}
            stroke={palette.axisLine}
            tick={{ fill: palette.axis, fontSize: 12, fontFamily: 'Space Mono' }}
            unit=" MW"
          />
          <Tooltip content={<CustomTooltip palette={palette} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontFamily: 'Inter',
              fontSize: '14px',
              paddingTop: '20px',
              color: palette.textSecondary,
            }}
          />

          {/* Marcador de Blackout */}
          {blackoutStart && (
            <ReferenceArea
              x1={blackoutStart}
              stroke={palette.blackoutStroke}
              strokeOpacity={0.8}
              fill={palette.blackoutFill}
            />
          )}

          <Area
            type="monotone"
            dataKey="Demanda prevista"
            stroke={palette.forecast}
            strokeDasharray="5 5"
            fillOpacity={0}
            strokeWidth={2}
            name={isEs ? "Demanda Prevista" : "Forecast Demand"}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="Demanda programada"
            stroke={palette.scheduled}
            fillOpacity={1}
            fill="url(#colorDemandaProg)"
            strokeWidth={2}
            name={isEs ? "Demanda Programada" : "Scheduled Demand"}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="Demanda real"
            stroke={palette.real}
            fillOpacity={1}
            fill="url(#colorDemandaReal)"
            strokeWidth={3}
            name={isEs ? "Demanda Real" : "Actual Demand"}
            isAnimationActive={true}
            activeDot={{ r: 6, fill: palette.real, stroke: palette.activeDotStroke, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
