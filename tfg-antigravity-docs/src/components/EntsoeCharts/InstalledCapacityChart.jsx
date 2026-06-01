import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector
} from 'recharts';

export default function InstalledCapacityChart() {
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
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const COLORS = {
    'Wind Onshore': '#10b981',
    'Solar': '#f59e0b',
    'Fossil Gas': 'var(--text-1, #64748b)',
    'Hydro Water Reservoir': '#3b82f6',
    'Nuclear': '#8b5cf6',
    'Hydro Pumped Storage': '#2563eb',
    'Fossil Hard coal': '#475569',
    'Hydro Run-of-river and pondage': '#60a5fa',
    'Fossil Oil': '#334155',
    'Biomass': '#84cc16',
    'Waste': '#a1a1aa',
    'Other renewable': '#14b8a6',
    'Other': '#71717a'
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
          {payload.fuel_type}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="var(--ifm-font-color-base)" fontSize={14}>
          {value.toLocaleString()} MW
        </text>
        <text x={cx} y={cy + 35} dy={8} textAnchor="middle" fill="var(--ifm-color-emphasis-500)" fontSize={12}>
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
    <div style={{ width: '100%', height: '500px' }}>
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
              <Cell key={`cell-${index}`} fill={COLORS[entry.fuel_type] || '#ccc'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [`${value.toLocaleString()} MW`, `${props.payload.category}`]}
            contentStyle={{ backgroundColor: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-300)', color: 'var(--ifm-font-color-base)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
        * Capacidad Instalada (MW). Pasa el ratón sobre los segmentos para ver el desglose. El color base distingue tecnologías.
      </div>
    </div>
  );
}
