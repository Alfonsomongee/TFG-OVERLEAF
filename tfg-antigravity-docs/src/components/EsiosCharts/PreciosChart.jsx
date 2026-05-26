import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel}>{new Date(label).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</div>
        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES', { minimumFractionDigits: 2 }) : 0} €/MWh</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PreciosChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/esios/precios_28_29_abril.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando datos de precios:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: '#ff4a4a', textAlign: 'center', fontFamily: 'Space Mono' }}>Iniciando extracción de datos forenses...</div>;

  // Rango del Blackout para sombrear: 28 abril 12:30 a 29 abril 08:00 (aprox)
  const blackoutStart = data.find(d => d.datetime.startsWith('2025-04-28T12:00'))?.datetime; // Precios son horarios
  const blackoutEnd = data.find(d => d.datetime.startsWith('2025-04-29T08:00'))?.datetime;
  
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Impacto en Mercados y Precios (28-29 Abril)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
          
          <XAxis 
            dataKey="datetime" 
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:00`;
            }}
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }}
            minTickGap={30}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.5)" 
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }}
            unit=" €"
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px', paddingTop: '10px' }} />

          {/* Marcador de Blackout */}
          {blackoutStart && blackoutEnd && (
            <ReferenceArea 
              x1={blackoutStart} 
              x2={blackoutEnd}
              strokeOpacity={0.3} 
              fill="rgba(255, 0, 0, 0.15)" 
            />
          )}

          <Line 
            type="monotone" 
            dataKey="PVPC T. 2.0TD" 
            stroke="#00ffcc" 
            strokeWidth={2}
            name="Precio PVPC (Minorista)"
            dot={{ r: 3, fill: '#00ffcc' }}
            activeDot={{ r: 6, fill: '#00ffcc', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="Mercado SPOT" 
            stroke="#e2a04a" 
            strokeWidth={2}
            name="Mercado Mayorista (SPOT)"
            dot={{ r: 3, fill: '#e2a04a' }}
            activeDot={{ r: 6, fill: '#e2a04a', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
