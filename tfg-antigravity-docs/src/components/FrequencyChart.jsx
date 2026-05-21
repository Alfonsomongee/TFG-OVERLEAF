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

const data = [
  { time: '12:33:17', freq: 49.98, notes: 'Frecuencia nominal' },
  { time: '12:33:18', freq: 49.85, notes: 'Inicio Cascada' },
  { time: '12:33:19', freq: 49.70, notes: 'Desconexión IBR' },
  { time: '12:33:20', freq: 49.48, notes: 'Caída < 49.5 Hz' },
  { time: '12:33:21', freq: 49.15, notes: 'Pérdida Sincronismo (Francia)' },
  { time: '12:33:22', freq: 48.95, notes: '' },
  { time: '12:33:23', freq: 48.75, notes: '' },
  { time: '12:33:24', freq: 48.50, notes: 'Pérdida > 15 GW' },
  { time: '12:33:25', freq: 48.35, notes: '' },
  { time: '12:33:26', freq: 48.20, notes: '' },
  { time: '12:33:27', freq: 48.05, notes: '' },
  { time: '12:33:28', freq: 47.90, notes: 'Colapso Inminente' },
  { time: '12:33:29', freq: 47.70, notes: 'Cero de Tensión Definitivo' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isCritical = dataPoint.freq < 49.5;
    
    return (
      <div className={`${styles.tooltipContainer} ${isCritical ? styles.tooltipCritical : ''}`}>
        <p className={styles.tooltipTime}>{label} CEST</p>
        <p className={styles.tooltipFreq}>
          Frecuencia: <strong>{dataPoint.freq} Hz</strong>
        </p>
        {dataPoint.notes && (
          <div className={styles.tooltipNotes}>
            <span className={styles.badge}>{dataPoint.notes}</span>
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
        <h3>Desplome de Frecuencia Continental (Fase 3)</h3>
        <p>Evolución de la frecuencia y actuación del esquema UFLS entre las 12:33:17 y 12:33:29.</p>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--ifm-color-emphasis-600)" 
              tick={{ fontSize: 12, fill: 'var(--ifm-color-emphasis-700)' }}
              tickMargin={10}
            />
            <YAxis 
              domain={[47.5, 50.1]} 
              stroke="var(--ifm-color-emphasis-600)"
              tick={{ fontSize: 12, fill: 'var(--ifm-color-emphasis-700)' }}
              unit=" Hz"
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Zona Segura */}
            <ReferenceArea y1={49.8} y2={50.1} fill="#10b981" fillOpacity={0.05} />
            
            {/* Zona Peligro UFLS */}
            <ReferenceArea y1={47.5} y2={49.5} fill="#ef4444" fillOpacity={0.05} />

            <ReferenceLine 
              y={49.5} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              label={{ position: 'insideTopLeft', value: 'Umbral UFLS (49.5 Hz)', fill: '#ef4444', fontSize: 12, fontWeight: 700 }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="freq" 
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
