import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function FrrCapacityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/entsoe/frr_actual_capacity_2025.json')
      .then(res => res.json())
      .then(json => {
        const formattedData = json.data.map(d => ({
          quarter: d.quarter,
          up_avg: d.up.actual_capacity_mw.avg,
          up_min: d.up.actual_capacity_mw.min,
          down_avg: d.down.actual_capacity_mw.avg,
          down_min: d.down.actual_capacity_mw.min,
          outlook: d.up.outlook_mw
        }));
        setData(formattedData);
      })
      .catch(err => console.error("Error loading FRR capacity data:", err));
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  const customTooltipFormatter = (value, name) => {
    let label = name;
    switch(name) {
      case 'up_avg': label = "Capacidad Media (Subida)"; break;
      case 'down_avg': label = "Capacidad Media (Bajada)"; break;
      case 'up_min': label = "Mínimo Registrado (Subida)"; break;
      case 'down_min': label = "Mínimo Registrado (Bajada)"; break;
      case 'outlook': label = "Previsión (Outlook)"; break;
      default: break;
    }
    return [`${value} MW`, label];
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="quarter" tick={tickStyle} label={{ value: 'Trimestre', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tick={tickStyle} width={60} domain={[0, 1800]} label={{ value: 'Capacidad FRR (MW)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip contentStyle={tooltipStyle} formatter={customTooltipFormatter} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <ReferenceLine y={1600} stroke="#f59e0b" strokeDasharray="5 5" label={{ position: 'top', value: 'Previsión / Outlook (1600 MW)', fill: '#f59e0b', fontSize: 12 }} />

            <Bar dataKey="up_avg" name="Capacidad Media (Subida)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="down_avg" name="Capacidad Media (Bajada)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            
            <Line type="monotone" dataKey="up_min" name="Mínimo Registrado (Subida)" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 6, fill: '#1d4ed8' }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="down_min" name="Mínimo Registrado (Bajada)" stroke="#047857" strokeWidth={3} dot={{ r: 6, fill: '#047857' }} activeDot={{ r: 8 }} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Reserva de Restauración de Frecuencia (FRR). Las barras muestran la media trimestral, las líneas el mínimo crítico disponible en el trimestre.
      </div>
    </div>
  );
}
