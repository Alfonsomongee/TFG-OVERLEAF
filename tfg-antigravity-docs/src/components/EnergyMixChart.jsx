import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { energyMixData } from '../data/forensicData';

export default function EnergyMixChart() {
  return (
    <div style={{ width: '100%', height: 400, marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Mix Energético Pre-Colapso vs Pérdida Abrupta (GW)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={energyMixData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="tecnologia" stroke="var(--ifm-color-content)" />
          <YAxis stroke="var(--ifm-color-content)" label={{ value: 'Potencia (GW)', angle: -90, position: 'insideLeft', offset: -10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--ifm-background-color)', borderColor: 'var(--ifm-color-emphasis-300)' }}
            itemStyle={{ color: 'var(--ifm-color-content)' }}
          />
          <Legend />
          <Bar dataKey="inyectadaGW" name="Potencia Inyectada (GW)" fill="#3b82f6" />
          <Bar dataKey="perdidaGW" name="Pérdida en Cascada (GW)" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
