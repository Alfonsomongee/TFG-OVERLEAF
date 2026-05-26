import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, Cell
} from 'recharts';

export default function HydroReservoirChart() {
  const [data, setData] = useState([]);
  const [variationData, setVariationData] = useState([]);
  const [view, setView] = useState('area'); // 'area' or 'variation'

  useEffect(() => {
    fetch('/data/entsoe/water_reservoirs_hydro_2025.json')
      .then(res => res.json())
      .then(json => {
        const rawData = json.data;
        setData(rawData);
        
        // Calculate weekly variation
        const variations = rawData.map((d, i) => {
          if (i === 0) return { ...d, variation: 0, isPositive: true };
          const diff = d.mwh - rawData[i-1].mwh;
          return { ...d, variation: diff, isPositive: diff >= 0 };
        });
        setVariationData(variations);
      })
      .catch(err => console.error("Error loading hydro data:", err));
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const formatMWh = (value) => {
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)} TWh`;
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(0)} GWh`;
    return `${value} MWh`;
  };

  const blackoutWeek = data.find(d => d.week === 18);

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div>
          <strong>Vista: </strong>
          <select 
            value={view} 
            onChange={e => setView(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)', width: '320px' }}
          >
            <option value="area">1. Evolución Semanal (Área)</option>
            <option value="variation">2. Variación Semanal (Barras)</option>
          </select>
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'area' ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" label={{ value: 'Semana del año', position: 'insideBottom', offset: -5, fill: 'var(--ifm-font-color-base)' }} tickFormatter={(w) => `S${w}`} tick={tickStyle} />
              <YAxis tickFormatter={formatMWh} label={{ value: 'Almacenamiento', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} domain={[0, 16000000]} tick={tickStyle} />
              <Tooltip formatter={(value) => formatMWh(value)} labelFormatter={(w) => `Semana ${w}`} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="mwh" name="Almacenamiento" stroke="#1abc9c" fill="#1abc9c" fillOpacity={0.3} strokeWidth={2} />
              {blackoutWeek && (
                <ReferenceLine x={blackoutWeek.week} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6" label={<Label value="⚡ Apagón 28-A" position="top" fill="#ef4444" fontSize={12} fontWeight="bold" />} />
              )}
            </AreaChart>
          ) : (
            <BarChart data={variationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" label={{ value: 'Semana del año', position: 'insideBottom', offset: -5, fill: 'var(--ifm-font-color-base)' }} tickFormatter={(w) => `S${w}`} tick={tickStyle} />
              <YAxis tickFormatter={formatMWh} label={{ value: 'Variación', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} tick={tickStyle} />
              <Tooltip formatter={(value) => formatMWh(value)} labelFormatter={(w) => `Semana ${w}`} contentStyle={tooltipStyle} />
              <Bar dataKey="variation" name="Variación Semanal">
                {variationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isPositive ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
              {blackoutWeek && (
                <ReferenceLine x={blackoutWeek.week} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 6" label={<Label value="⚡ Apagón 28-A" position="top" fill="#f59e0b" fontSize={12} fontWeight="bold" />} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
