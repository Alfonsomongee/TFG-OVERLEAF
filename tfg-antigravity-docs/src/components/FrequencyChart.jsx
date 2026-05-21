import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import styles from './FrequencyChart.module.css';
import { timelineData } from '../data/forensicData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isCritical = dataPoint.frecuencia < 49.5;
    
    return (
      <div className={`${styles.tooltipContainer} ${isCritical ? styles.tooltipCritical : ''}`} style={{ maxWidth: '300px' }}>
        <p className={styles.tooltipTime}>T={dataPoint.tiempoS}s ({dataPoint.timestamp} CEST)</p>
        <p className={styles.tooltipFreq}>
          Frecuencia: <strong>{dataPoint.frecuencia.toFixed(3)} Hz</strong>
        </p>
        <p style={{ margin: '0', fontSize: '0.9rem' }}>RoCoF: {dataPoint.rocof !== null ? dataPoint.rocof.toFixed(3) : 'N/A'} Hz/s</p>
        <p style={{ margin: '0', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pérdida Acum.: {dataPoint.acumuladoMW} MW</p>
        {dataPoint.evento && (
          <div className={styles.tooltipNotes}>
            <span className={styles.badge} style={{ whiteSpace: 'normal', display: 'block', textAlign: 'left' }}>{dataPoint.evento}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function FrequencyChart() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>Colapso de Frecuencia Continental (12:32:57 - 12:33:24)</h3>
        <p>Evolución de la frecuencia, RoCoF y pérdida de generación en cascada.</p>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
            <XAxis 
              dataKey="tiempoS" 
              stroke="var(--ifm-color-emphasis-600)" 
              tick={{ fontSize: 12, fill: 'var(--ifm-color-emphasis-700)' }}
              tickMargin={10}
              label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              domain={[46, 50.1]} 
              stroke="var(--ifm-color-emphasis-600)"
              tick={{ fontSize: 12, fill: 'var(--ifm-color-emphasis-700)' }}
              unit=" Hz"
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Zona Segura */}
            <ReferenceArea y1={49.8} y2={50.1} fill="#10b981" fillOpacity={0.05} />
            
            {/* Zona Peligro UFLS */}
            <ReferenceArea y1={46} y2={49.5} fill="#ef4444" fillOpacity={0.05} />

            <ReferenceLine 
              y={49.5} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              label={{ position: 'insideTopRight', value: 'UFLS (49.5 Hz)', fill: '#ef4444', fontSize: 12, fontWeight: 700 }} 
            />
            <ReferenceLine 
              y={48.46} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              label={{ position: 'insideBottomRight', value: 'Aislamiento FR', fill: '#ef4444', fontSize: 12, fontWeight: 700 }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="frecuencia" 
              stroke="var(--ifm-color-primary)" 
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: 'var(--ifm-background-surface-color)' }}
              activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
