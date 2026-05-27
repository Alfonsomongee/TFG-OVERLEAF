import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

const PALETTE = ['#ffaa00', '#ff4a4a', '#4a90e2', '#00ffcc', '#e2a04a', '#a04ae2', '#e24a90'];

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel}>{new Date(label).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</div>
        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : 0} {unit}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GenericEsiosChart({ dataUrl, title, unit = '', includeKeys = null }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        if (json.length > 0) {
          // Extract all unique keys except 'datetime'
          const allKeys = new Set();
          json.forEach(item => {
            Object.keys(item).forEach(k => {
              if (k !== 'datetime') {
                if (!includeKeys || includeKeys.includes(k)) {
                  allKeys.add(k);
                }
              }
            });
          });
          setKeys(Array.from(allKeys));
          
          // Filter data to only keep includeKeys if provided, to ensure tooltip is clean
          if (includeKeys) {
             const filtered = json.map(item => {
                const newItem = { datetime: item.datetime };
                includeKeys.forEach(k => {
                   if (item[k] !== undefined) newItem[k] = item[k];
                });
                return newItem;
             });
             setData(filtered);
          } else {
             setData(json);
          }
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando datos:', err);
        setLoading(false);
      });
  }, [dataUrl, includeKeys]);

  if (loading) return <div style={{ color: '#ff4a4a', textAlign: 'center', fontFamily: 'Space Mono' }}>Analizando archivos locales...</div>;
  if (!data || data.length === 0) return <div style={{ color: '#ff4a4a', textAlign: 'center' }}>No hay datos.</div>;

  const isBarChart = data.length < 5;

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        {isBarChart ? (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="datetime" 
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('es-ES')}
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }}
            />
            <YAxis width={90} stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }} unit={` ${unit}`} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {keys.length <= 6 && <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px', paddingTop: '20px' }} />}
            {keys.map((k, idx) => (
              <Bar key={k} dataKey={k} name={k} fill={PALETTE[idx % PALETTE.length]} radius={[2, 2, 0, 0]} stackId="a" />
            ))}
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <defs>
              {keys.map((k, idx) => (
                <linearGradient key={`grad-${idx}`} id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE[idx % PALETTE.length]} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={PALETTE[idx % PALETTE.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
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
              minTickGap={40}
            />
            <YAxis width={90} stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }} unit={` ${unit}`} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            {keys.length <= 6 && <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px', paddingTop: '20px' }} />}
            {keys.map((k, idx) => (
              <Area 
                key={k} 
                type="monotone" 
                dataKey={k} 
                name={k} 
                stroke={PALETTE[idx % PALETTE.length]} 
                fillOpacity={1} 
                fill={`url(#color-${idx})`} 
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 1 }}
                isAnimationActive={true}
                connectNulls={true}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
