import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import styles from './EsiosCharts.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel} style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</div>
        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>{p.name}:</span>
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 1 }) : 0} MW</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PotenciaChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/potencia.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          if (json.length >= 2) {
            const day1 = json[0];
            const day2 = json[1];
            const keys = Object.keys(day1).filter(k => k !== 'datetime');

            const formattedData = keys.map(k => {
              let catName = k.replace('Potencia ', '').replace('horizonte horario', '').trim();
              catName = catName.charAt(0).toUpperCase() + catName.slice(1);
              return {
                category: catName,
                '28 Abril': day1[k] || 0,
                '29 Abril': day2[k] || 0
              };
            });
            formattedData.sort((a, b) => b['28 Abril'] - a['28 Abril']);
            setData(formattedData);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error cargando datos:', err);
        }
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) return <div style={{ color: '#ff4a4a', textAlign: 'center', fontFamily: 'Space Mono' }}>Analizando archivos locales...</div>;
  if (!data || data.length === 0) return <div style={{ color: '#ff4a4a', textAlign: 'center' }}>No hay datos.</div>;

  return (
    <div className={styles.chartContainer} style={{ height: '700px' }}>
      <h3 className={styles.chartTitle}>Comparativa de Potencia por Tecnología (28 vs 29 Abril)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={true} vertical={true} />
          <XAxis type="number" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }} unit=" MW" />
          <YAxis 
            type="category" 
            dataKey="category" 
            stroke="rgba(255, 255, 255, 0.5)" 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10, fontFamily: 'Inter' }} 
            width={280}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px', paddingTop: '10px' }} />
          <Bar dataKey="28 Abril" fill="#ff4a4a" radius={[0, 4, 4, 0]} barSize={12} />
          <Bar dataKey="29 Abril" fill="#4a90e2" radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
