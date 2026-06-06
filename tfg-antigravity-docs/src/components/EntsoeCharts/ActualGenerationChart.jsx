import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

function getActualGenerationPalette(isDark) {
  return {
    bgCard: isDark ? 'rgba(16, 29, 53, 0.76)' : 'rgba(255, 252, 245, 0.84)',
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

    success: isDark ? '#A6C67B' : '#2F6B4F',
    warning: isDark ? '#E6B45C' : '#A96000',
    danger: isDark ? '#D98798' : '#A13D36',

    forecast: isDark ? '#7DCDE3' : '#1F6F78',
    actual: isDark ? '#D98798' : '#A13D36',

    fuelColors: {
      Nuclear: isDark ? '#D98798' : '#A13D36',
      'Fossil Gas': isDark ? '#E6B45C' : '#A96000',
      'Hydro Water Reservoir': isDark ? '#7DCDE3' : '#1F6F78',
      'Hydro Pumped Storage': isDark ? '#91D7EA' : '#2A7F88',
      'Wind Onshore': isDark ? '#A6C67B' : '#2F6B4F',
      Solar: isDark ? '#D9C77C' : '#8A6A12',
      'Fossil Hard coal': isDark ? '#A7ADB6' : '#5F5B54',
    },

    syncColors: isDark
      ? ['#7DCDE3', '#D98798']
      : ['#1F6F78', '#A13D36'],

    shadow: isDark
      ? '0 10px 28px rgba(0, 0, 0, 0.24)'
      : '0 8px 24px rgba(25, 24, 20, 0.055)',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function ActualGenerationChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getActualGenerationPalette(isDark);
  const [activeUnits, setActiveUnits] = useState(null);
  const [expectedGen, setExpectedGen] = useState(null);
  const [genByFuel, setGenByFuel] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [syncVsIbr, setSyncVsIbr] = useState(null);
  const [view, setView] = useState('fuel');

  useEffect(() => {
    const controller = new AbortController();
    const opts = { signal: controller.signal };

    Promise.all([
      fetch('/data/entsoe/active_units_top20.json', opts).then(r => r.json()),
      fetch('/data/entsoe/generation_by_fuel_type_with_expected.json', opts).then(r => r.json()),
      fetch('/data/entsoe/generation_by_fuel_type.json', opts).then(r => r.json()),
      fetch('/data/entsoe/technology_status_summary.json', opts).then(r => r.json()),
      fetch('/data/entsoe/sync_vs_ibr.json', opts).then(r => r.json()),
    ])
      .then(([d1, d2, d3, d4, d5]) => {
        if (!controller.signal.aborted) {
          setActiveUnits(d1.data);
          setExpectedGen(d2.data);
          setGenByFuel(d3.data);
          setStatusSummary(d4.data);
          setSyncVsIbr(d5.data);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching generation data:', err);
        }
      });

    return () => controller.abort();
  }, []);

  const loaded = activeUnits && expectedGen && genByFuel && statusSummary && syncVsIbr;

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1rem',
          color: palette.textMuted,
        }}
      >
        Cargando datos...
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
  };

  const tickStyle = { fill: palette.axis };

  const isTall = view === 'top20' || view === 'status';

  return (
    <div
      style={{
        width: '100%',
        color: palette.textPrimary,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: palette.bgTabs, border: `1px solid ${palette.border}`, padding: '4px', borderRadius: '8px', maxWidth: '800px', justifyContent: 'center' }}>
          {[
            { id: 'fuel', label: '1. Mix Real' },
            { id: 'top20', label: '2. Top 20' },
            { id: 'status', label: '3. Estado' },
            { id: 'sync', label: '4. Inercia' },
            { id: 'expected', label: '5. Real vs Previsto' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setView(opt.id)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${view === opt.id ? palette.accent : 'transparent'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                background: view === opt.id ? palette.accent : 'transparent',
                color: view === opt.id ? palette.accentText : palette.textSecondary,
                fontWeight: view === opt.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                fontSize: '0.85rem',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart: Mix de Generación Real */}
      {view === 'fuel' && (
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={genByFuel} margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis type="number" tick={tickStyle} stroke={palette.axisLine} />
              <YAxis type="category" dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 12 }} width={130} stroke={palette.axisLine} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  color: palette.textSecondary,
                  fontSize: 13,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
              <Bar dataKey="total_mw" name={isEs ? "Potencia Real Agregada (MW)" : "Aggregated Actual Power (MW)"}>
                {genByFuel.map((entry, i) => <Cell key={i} fill={palette.fuelColors[entry.fuel_type] || palette.textMuted} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Top 20 */}
      {view === 'top20' && (
        <div style={{ height: 620 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={activeUnits} margin={{ top: 10, right: 30, left: 90, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis type="number" tick={tickStyle} stroke={palette.axisLine} />
              <YAxis type="category" dataKey="name" tick={{ ...tickStyle, fontSize: 11 }} width={90} stroke={palette.axisLine} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  color: palette.textSecondary,
                  fontSize: 13,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
              <Bar dataKey="power_mw" name={isEs ? "Potencia Real (MW)" : "Actual Power (MW)"}>
                {activeUnits.map((entry, i) => <Cell key={i} fill={palette.fuelColors[entry.fuel_type] || palette.textMuted} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Estado de Unidades */}
      {view === 'status' && (
        <div style={{ height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={statusSummary} margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis type="number" tick={tickStyle} stroke={palette.axisLine} />
              <YAxis type="category" dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 12 }} width={130} stroke={palette.axisLine} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  color: palette.textSecondary,
                  fontSize: 13,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
              <Bar dataKey="active_units" stackId="a" name={isEs ? "Activas (>0 MW)" : "Active (>0 MW)"} fill={palette.success} />
              <Bar dataKey="zero_units" stackId="a" name={isEs ? "Caídas (0 MW)" : "Tripped (0 MW)"} fill={palette.danger} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Síncrona vs IBR */}
      {view === 'sync' && (
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={syncVsIbr}
                cx="50%" cy="45%"
                innerRadius={80} outerRadius={150}
                dataKey="total_mw" nameKey="type"
                labelLine={{ stroke: palette.axisLine }}
                label={({ cx, cy, midAngle, outerRadius, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 22;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={palette.textSecondary}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={12}
                      fontFamily="Inter"
                    >
                      {`${(percent * 100).toFixed(1)}%`}
                    </text>
                  );
                }}
              >
                {syncVsIbr.map((entry, i) => <Cell key={i} fill={palette.syncColors[i % palette.syncColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v => `${v.toLocaleString()} MW`} />
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
      )}

      {/* Chart: Real vs Previsto */}
      {view === 'expected' && (
        <div style={{ height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expectedGen} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 11 }} angle={-30} textAnchor="end" interval={0} stroke={palette.axisLine} />
              <YAxis tick={tickStyle} stroke={palette.axisLine} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  color: palette.textSecondary,
                  fontSize: 13,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.textSecondary }}>{value}</span>
                )}
              />
              <Bar dataKey="real_mw" name={isEs ? "Real (MW)" : "Actual (MW)"} fill={palette.actual} />
              <Bar dataKey="expected_mw" name={isEs ? "Previsto (MW)" : "Forecast (MW)"} fill={palette.forecast} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
