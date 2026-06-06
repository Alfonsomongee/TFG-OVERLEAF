import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

function getForecastTransferPalette(isDark) {
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

    exportLine: isDark ? '#D98798' : '#A13D36',
    importFrance: isDark ? '#7DCDE3' : '#1F6F78',
    importPortugal: isDark ? '#A6C67B' : '#2F6B4F',

    blackout: isDark ? '#D98798' : '#A13D36',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function ForecastTransferChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getForecastTransferPalette(isDark);
  const [data, setData] = useState(null);
  const [activeDay, setActiveDay] = useState('dataset_1'); // dataset_1 = 28 Abril, dataset_2 = 29 Abril
  const [activeBorder, setActiveBorder] = useState('FR'); // FR or PT

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/forecast_transfer_capacities.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          setData(json);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading forecast capacities:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (!data) {
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

  const dataset = data.datasets.find(d => d.id === activeDay);
  if (!dataset) return null;

  // Process data to have hour labels instead of full strings
  const chartData = dataset.data.map(item => ({
    ...item,
    hour: item.mtu.split(' - ')[0]
  }));

  const isDay1 = activeDay === 'dataset_1';
  // ApagÃ³n fue a las 12:35 el 28 Abril, que cae en el MTU 12:00 - 13:00.
  const blackoutIndex = isDay1 ? chartData.findIndex(d => d.hour === '12:00') : -1;

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: palette.bgTabs, border: `1px solid ${palette.border}`, padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'dataset_1', label: '28 de Abril' },
            { id: 'dataset_2', label: '29 de Abril' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveDay(opt.id)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${activeDay === opt.id ? palette.accent : 'transparent'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                background: activeDay === opt.id ? palette.accent : 'transparent',
                color: activeDay === opt.id ? palette.accentText : palette.textSecondary,
                fontWeight: activeDay === opt.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                fontSize: '0.85rem',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', background: palette.bgTabs, border: `1px solid ${palette.border}`, padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'FR', label: 'EspaÃ±a - Francia' },
            { id: 'PT', label: 'EspaÃ±a - Portugal' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveBorder(opt.id)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${activeBorder === opt.id ? palette.accent : 'transparent'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                background: activeBorder === opt.id ? palette.accent : 'transparent',
                color: activeBorder === opt.id ? palette.accentText : palette.textSecondary,
                fontWeight: activeBorder === opt.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                fontSize: '0.85rem',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
            <XAxis
              dataKey="hour"
              stroke={palette.axisLine}
              tick={{ fill: palette.axis, fontSize: 12 }}
            />
            <YAxis
              stroke={palette.axisLine}
              tick={{ fill: palette.axis, fontSize: 12 }}
              label={{
                value: isEs ? 'Capacidad (MW)' : 'Capacity (MW)',
                angle: -90,
                position: 'insideLeft',
                dx: -30,
                fill: palette.axis,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: palette.bgTooltip,
                border: `1px solid ${palette.borderStrong}`,
                color: palette.textPrimary,
                boxShadow: palette.tooltipShadow,
                borderRadius: 8,
              }}
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
                paddingTop: '20px',
                color: palette.textSecondary,
              }}
              formatter={(value) => (
                <span style={{ color: palette.textSecondary }}>{value}</span>
              )}
            />
            
            {activeBorder === 'FR' ? (
              <>
                <Line
                  type="stepAfter"
                  dataKey="es_to_fr"
                  stroke={palette.exportLine}
                  strokeWidth={3}
                  dot={false}
                  name={isEs ? "ES âž FR (ExportaciÃ³n)" : "ES âž FR (Export)"}
                />
                <Line
                  type="stepAfter"
                  dataKey="fr_to_es"
                  stroke={palette.importFrance}
                  strokeWidth={3}
                  dot={false}
                  name={isEs ? "FR âž ES (ImportaciÃ³n)" : "FR âž ES (Import)"}
                />
              </>
            ) : (
              <>
                <Line
                  type="stepAfter"
                  dataKey="es_to_pt"
                  stroke={palette.exportLine}
                  strokeWidth={3}
                  dot={false}
                  name={isEs ? "ES âž PT (ExportaciÃ³n)" : "ES âž PT (Export)"}
                />
                <Line
                  type="stepAfter"
                  dataKey="pt_to_es"
                  stroke={palette.importPortugal}
                  strokeWidth={3}
                  dot={false}
                  name={isEs ? "PT âž ES (ImportaciÃ³n)" : "PT âž ES (Import)"}
                />
              </>
            )}

            {isDay1 && blackoutIndex !== -1 && (
              <ReferenceLine
                x={chartData[blackoutIndex]?.hour}
                stroke={palette.blackout}
                strokeDasharray="3 3"
                label={{
                  position: 'top',
                  value: isEs ? 'ApagÃ³n' : 'Blackout',
                  fill: palette.blackout,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
