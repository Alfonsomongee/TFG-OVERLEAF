import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

export default function TotalLoadChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/entsoe/total_load_day_ahead_actual_28A.json')
      .then(res => res.json())
      .then(json => {
        const processDay = (dayData, offsetHours) => {
          return dayData.map(d => {
            const timeStr = d.mtu.split(' - ')[0]; // "10:00"
            const [hours, mins] = timeStr.split(':').map(Number);
            const decimalTime = hours + mins / 60 + offsetHours;
            return {
              timeNum: decimalTime,
              timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
              es_forecast: d.es_forecast,
              es_actual: d.es_actual,
              pt_forecast: d.pt_forecast,
              pt_actual: d.pt_actual
            };
          });
        };
        const day28 = processDay(json.data['2025-04-28'], 0);
        const day29 = processDay(json.data['2025-04-29'], 24);
        setData([...day28, ...day29]);
      })
      .catch(err => console.error("Error loading total load data:", err));
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const formatTime = (decimalTime) => {
    const hours = Math.floor(decimalTime) % 24;
    const mins = Math.round((decimalTime % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="timeNum" type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} tick={tickStyle} tickCount={12} label={{ value: 'Hora (UTC)', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tick={tickStyle} width={80} label={{ value: 'Demanda (MW)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={(value, name) => [`${value?.toLocaleString() || 'N/A'} MW`, name]}
              labelFormatter={(t) => `Hora UTC: ${formatTime(t)}`} 
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <ReferenceLine x={10.55} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
              <Label value="⚡ Colapso (12:33 CEST)" position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
            </ReferenceLine>

            {/* Spain */}
            <Line type="monotone" dataKey="es_forecast" name="ES Previsión (Day-Ahead)" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line connectNulls={false} type="monotone" dataKey="es_actual" name="ES Real (Actual)" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            
            {/* Portugal */}
            <Line type="monotone" dataKey="pt_forecast" name="PT Previsión (Day-Ahead)" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line connectNulls={false} type="monotone" dataKey="pt_actual" name="PT Real (Actual)" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Valores nulos (ausencia de línea) en la demanda de España (ES) indican pérdida total de telemetría tras el cero de tensión.
      </div>
    </div>
  );
}
