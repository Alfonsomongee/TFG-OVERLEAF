import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './EsiosCharts.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipLabel} style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</div>
        {payload.map((p, index) => (
          <div key={index} className={styles.tooltipItem} style={{ color: p.color }}>
            <span>Valor:</span>
            <span>{p.value !== undefined && p.value !== null ? p.value.toLocaleString('es-ES', { maximumFractionDigits: 1 }) : 0} MWh</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgramacionChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/esios/programacion-mercado-produccion.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          if (json.length >= 1) {
            const day1 = json[0];
            const keys = Object.keys(day1).filter(k => k !== 'datetime');

            const formattedData = keys.map(k => {
              return {
                category: k.replace('Energía horaria', '').replace('comercializadores', 'Comercializ.').trim(),
                '28 Abril': day1[k] || 0
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
    <div className={styles.chartContainer} style={{ height: '500px' }}>
      <h3 className={styles.chartTitle}>{isEs ? 'Programación Mercado Producción (28 Abril)' : 'Production Market Schedule (Apr 28)'}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 200, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={true} vertical={true} />
          <XAxis type="number" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontFamily: 'Space Mono' }} unit=" MWh" />
          <YAxis 
            type="category" 
            dataKey="category" 
            stroke="rgba(255, 255, 255, 0.5)" 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontFamily: 'Inter' }} 
            width={190}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="28 Abril" fill="#4ae2a0" radius={[0, 4, 4, 0]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
