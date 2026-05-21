import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { timelineData } from '../data/forensicData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--ifm-background-color)',
        padding: '1rem',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>T={data.tiempoS}s ({data.timestamp})</p>
        <p style={{ margin: '0', color: '#ef4444', fontWeight: 'bold' }}>Frecuencia: {data.frecuencia.toFixed(3)} Hz</p>
        <p style={{ margin: '0' }}>RoCoF: {data.rocof !== null ? data.rocof.toFixed(3) : 'N/A'} Hz/s</p>
        <p style={{ margin: '0' }}>Pérdida Acumulada: {data.acumuladoMW} MW</p>
        <hr style={{ margin: '0.5rem 0' }} />
        <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>{data.evento}</p>
      </div>
    );
  }
  return null;
};

export default function CollapseTimelineChart() {
  return (
    <div style={{ width: '100%', height: 450, marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Evolución de Frecuencia y Cascada (12:32:57 - 12:33:24)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={timelineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="tiempoS" 
            stroke="var(--ifm-color-content)"
            label={{ value: 'Tiempo transcurrido (s)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="var(--ifm-color-content)"
            domain={[45, 51]} 
            label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', offset: -10 }}
          />
          <ReferenceLine y={50} yAxisId="left" stroke="#10b981" strokeDasharray="3 3" />
          <ReferenceLine y={49.5} yAxisId="left" stroke="#f59e0b" strokeDasharray="3 3" label="UFLS 1" />
          <ReferenceLine y={48.46} yAxisId="left" stroke="#ef4444" strokeDasharray="3 3" label="Aislamiento" />
          
          <Tooltip content={<CustomTooltip />} />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="frecuencia" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#ef4444' }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
