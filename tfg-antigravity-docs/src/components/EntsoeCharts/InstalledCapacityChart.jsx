import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector
} from 'recharts';

function getInstalledCapacityPalette(isDark) {
  return {
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    activeRingStroke: isDark ? '#101D35' : '#FFFCF5',

    colors: {
      'Wind Onshore': isDark ? '#A6C67B' : '#2F6B4F',
      Solar: isDark ? '#D9C77C' : '#8A6A12',
      'Fossil Gas': isDark ? '#E6B45C' : '#A96000',
      'Hydro Water Reservoir': isDark ? '#7DCDE3' : '#1F6F78',
      Nuclear: isDark ? '#C4A5E8' : '#6E4D8B',
      'Hydro Pumped Storage': isDark ? '#91D7EA' : '#2A7F88',
      'Fossil Hard coal': isDark ? '#A7ADB6' : '#5F5B54',
      'Hydro Run-of-river and pondage': isDark ? '#B7EAF4' : '#4F8E98',
      'Fossil Oil': isDark ? '#D98798' : '#A13D36',
      Biomass: isDark ? '#C6D989' : '#637A25',
      Waste: isDark ? '#91A4BC' : '#7A7062',
      'Other renewable': isDark ? '#7DCDE3' : '#1F6F78',
      Other: isDark ? '#A7ADB6' : '#5F5B54',
    },

    fallbackSlice: isDark ? '#91A4BC' : '#7A7062',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function InstalledCapacityChart({ hideFooter = false }) {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getInstalledCapacityPalette(isDark);
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/installed_capacity_2025.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          // Filtrar datos válidos mayores a 0
          const validData = json.data.filter(d => typeof d.capacity_mw === 'number' && d.capacity_mw > 0);
          // Ordenar por categoría (IBR vs Síncrona) y luego por capacidad
          const sorted = validData.sort((a, b) => {
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category);
            }
            return b.capacity_mw - a.capacity_mw;
          });
          setData(sorted);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading installed capacity:", err);
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

  const COLORS = palette.colors;

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
          {payload.fuel_type}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={palette.textPrimary} fontSize={14}>
          {value.toLocaleString()} MW
        </text>
        <text x={cx} y={cy + 35} dy={8} textAnchor="middle" fill={palette.textMuted} fontSize={12}>
          ({(percent * 100).toFixed(1)}%)
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '500px', color: palette.textPrimary }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={140}
            paddingAngle={2}
            dataKey="capacity_mw"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.fuel_type] || palette.fallbackSlice} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value.toLocaleString()} MW`, `${props.payload.category}`]}
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
        </PieChart>
      </ResponsiveContainer>
      {!hideFooter && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: palette.textMuted,
            marginTop: '1rem',
          }}
        >
          {isEs
            ? '* Capacidad Instalada (MW). Pasa el ratón sobre los segmentos para ver el desglose. El color base distingue tecnologías.'
            : '* Installed Capacity (MW). Hover over segments to see the breakdown. Colors distinguish technologies.'
          }
        </div>
      )}
    </div>
  );
}
