import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend
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
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES') : 0} MW</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DemandaChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/demanda_28_29_abril.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const formattedData = json.map(item => ({
            ...item,
            timeStr: new Date(item.datetime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            dateStr: new Date(item.datetime).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
          }));
          setData(formattedData);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando datos de demanda:', err);
        }
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) return <div style={{ color: '#ff4a4a', textAlign: 'center', fontFamily: 'Space Mono' }}>Iniciando extracción de datos forenses...</div>;

  // Rango del Blackout para sombrear: 28 abril 12:30 a 29 abril 08:00 (aprox)
  // El colapso total empieza a las 12:35 del 28.
  const blackoutStart = data.find(d => d.datetime.startsWith('2025-04-28T12:30'))?.datetime;
  
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Evolución de la Demanda (28-29 Abril)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorDemandaReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDemandaProg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          
          <XAxis 
            dataKey="datetime" 
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes() === 0 ? '00' : d.getMinutes()}`;
            }}
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }}
            minTickGap={50}
          />
          <YAxis 
            width={90}
            stroke="rgba(255, 255, 255, 0.5)" 
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }}
            unit=" MW"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px', paddingTop: '20px' }} />

          {/* Marcador de Blackout */}
          {blackoutStart && (
            <ReferenceArea 
              x1={blackoutStart} 
              strokeOpacity={0.3} 
              fill="rgba(255, 0, 0, 0.15)" 
            />
          )}

          <Area 
            type="monotone" 
            dataKey="Demanda prevista" 
            stroke="#8884d8" 
            strokeDasharray="5 5"
            fillOpacity={0} 
            strokeWidth={2}
            name="Demanda Prevista"
            isAnimationActive={true}
          />
          <Area 
            type="monotone" 
            dataKey="Demanda programada" 
            stroke="#4a90e2" 
            fillOpacity={1} 
            fill="url(#colorDemandaProg)" 
            strokeWidth={2}
            name="Demanda Programada"
            isAnimationActive={true}
          />
          <Area 
            type="monotone" 
            dataKey="Demanda real" 
            stroke="#ffaa00" 
            fillOpacity={1} 
            fill="url(#colorDemandaReal)" 
            strokeWidth={3}
            name="Demanda Real"
            isAnimationActive={true}
            activeDot={{ r: 6, fill: '#ffaa00', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
