import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, Cell
} from 'recharts';

function getHydroReservoirPalette(isDark) {
  return {
    bgTabs: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(25, 24, 20, 0.045)',
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.10)' : 'rgba(25, 24, 20, 0.10)',
    axis: isDark ? '#C7D2E3' : '#6B6255',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.20)',

    accent: isDark ? '#7DCDE3' : '#1F6F78',
    accentText: isDark ? '#071326' : '#FFFCF5',

    hydro: isDark ? '#7DCDE3' : '#1F6F78',
    hydroFill: isDark ? 'rgba(125, 205, 227, 0.22)' : 'rgba(31, 111, 120, 0.18)',

    positive: isDark ? '#A6C67B' : '#2F6B4F',
    negative: isDark ? '#D98798' : '#A13D36',

    blackout: isDark ? '#E6B45C' : '#A96000',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function HydroReservoirChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getHydroReservoirPalette(isDark);
  const [data, setData] = useState([]);
  const [variationData, setVariationData] = useState([]);
  const [view, setView] = useState('area'); // 'area' or 'variation'

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/water_reservoirs_hydro_2025.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const rawData = json.data;
          setData(rawData);

          // Calculate weekly variation
          const variations = rawData.map((d, i) => {
            if (i === 0) return { ...d, variation: 0, isPositive: true };
            const diff = d.mwh - rawData[i-1].mwh;
            return { ...d, variation: diff, isPositive: diff >= 0 };
          });
          setVariationData(variations);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading hydro data:", err);
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

  const formatMWh = (value) => {
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)} TWh`;
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(0)} GWh`;
    return `${value} MWh`;
  };

  const blackoutWeek = data.find(d => d.week === 18);

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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '4px', background: palette.bgTabs, padding: '4px', borderRadius: '8px', width: '320px', border: `1px solid ${palette.border}` }}>
          <button
            onClick={() => setView('area')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `1px solid ${view === 'area' ? palette.accent : 'transparent'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              background: view === 'area' ? palette.accent : 'transparent',
              color: view === 'area' ? palette.accentText : palette.textSecondary,
              fontWeight: view === 'area' ? 'bold' : 'normal',
              transition: 'all 0.2s',
              fontSize: '0.85rem',
            }}
          >
            1. Área
          </button>
          <button
            onClick={() => setView('variation')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `1px solid ${view === 'variation' ? palette.accent : 'transparent'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              background: view === 'variation' ? palette.accent : 'transparent',
              color: view === 'variation' ? palette.accentText : palette.textSecondary,
              fontWeight: view === 'variation' ? 'bold' : 'normal',
              transition: 'all 0.2s',
              fontSize: '0.85rem',
            }}
          >
            2. Variación
          </button>
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'area' ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis
                dataKey="week"
                stroke={palette.axisLine}
                label={{
                  value: isEs ? 'Semana del año' : 'Week of the year',
                  position: 'bottom',
                  offset: 15,
                  fill: palette.axis,
                }}
                tickFormatter={(w) => `S${w}`}
                tick={tickStyle}
              />
              <YAxis
                tickFormatter={formatMWh}
                stroke={palette.axisLine}
                label={{
                  value: isEs ? 'Almacenamiento' : 'Storage',
                  angle: -90,
                  position: 'insideLeft',
                  dx: -30,
                  fill: palette.axis,
                }}
                domain={[0, 16000000]}
                tick={tickStyle}
              />
              <Tooltip
                formatter={(value) => formatMWh(value)}
                labelFormatter={(w) => `Semana ${w}`}
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: palette.textPrimary,
                  fontWeight: 700,
                }}
                itemStyle={{
                  color: palette.textSecondary,
                }}
              />
              <Area
                type="monotone"
                dataKey="mwh"
                name={isEs ? "Almacenamiento" : "Storage"}
                stroke={palette.hydro}
                fill={palette.hydroFill}
                fillOpacity={1}
                strokeWidth={2}
              />
              {blackoutWeek && (
                <ReferenceLine
                  x={blackoutWeek.week}
                  stroke={palette.blackout}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  label={
                    <Label
                      value={isEs ? "Apagón 28-A" : "28-A Blackout"}
                      position="top"
                      fill={palette.blackout}
                      fontSize={12}
                      fontWeight="bold"
                    />
                  }
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={variationData} margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis
                dataKey="week"
                stroke={palette.axisLine}
                label={{
                  value: isEs ? 'Semana del año' : 'Week of the year',
                  position: 'bottom',
                  offset: 15,
                  fill: palette.axis,
                }}
                tickFormatter={(w) => `S${w}`}
                tick={tickStyle}
              />
              <YAxis
                tickFormatter={formatMWh}
                stroke={palette.axisLine}
                label={{
                  value: isEs ? 'Variación' : 'Variation',
                  angle: -90,
                  position: 'insideLeft',
                  dx: -30,
                  fill: palette.axis,
                }}
                tick={tickStyle}
              />
              <Tooltip
                formatter={(value) => formatMWh(value)}
                labelFormatter={(w) => `Semana ${w}`}
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: palette.textPrimary,
                  fontWeight: 700,
                }}
                itemStyle={{
                  color: palette.textSecondary,
                }}
              />
              <Bar dataKey="variation" name={isEs ? "Variación Semanal" : "Weekly Variation"}>
                {variationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isPositive ? palette.positive : palette.negative} />
                ))}
              </Bar>
              {blackoutWeek && (
                <ReferenceLine
                  x={blackoutWeek.week}
                  stroke={palette.blackout}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  label={
                    <Label
                      value={isEs ? "Apagón 28-A" : "28-A Blackout"}
                      position="top"
                      fill={palette.blackout}
                      fontSize={12}
                      fontWeight="bold"
                    />
                  }
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
