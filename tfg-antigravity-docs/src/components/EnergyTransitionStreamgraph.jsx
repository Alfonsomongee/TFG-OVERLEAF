import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './EnergyTransitionStreamgraph.module.css';

const data = [
  { year: 1990, carbon: 40.0, cicloCombinado: 0.0, nuclear: 35.0, hidraulica: 23.0, eolica: 0.0, solar: 0.0, emisiones: 280 },
  { year: 2007, carbon: 24.0, cicloCombinado: 25.0, nuclear: 20.0, hidraulica: 9.0, eolica: 10.0, solar: 0.5, emisiones: 444 },
  { year: 2015, carbon: 20.0, cicloCombinado: 10.0, nuclear: 21.0, hidraulica: 11.0, eolica: 19.0, solar: 3.0, emisiones: 270 },
  { year: 2021, carbon: 1.5, cicloCombinado: 17.0, nuclear: 21.0, hidraulica: 11.5, eolica: 23.0, solar: 8.0, emisiones: 110 },
  { year: 2023, carbon: 1.5, cicloCombinado: 14.0, nuclear: 20.0, hidraulica: 13.0, eolica: 23.5, solar: 14.0, emisiones: 32 },
  { year: 2024, carbon: 1.2, cicloCombinado: 13.6, nuclear: 20.0, hidraulica: 13.3, eolica: 23.2, solar: 17.0, emisiones: 27 },
  { year: 2025, carbon: 0.8, cicloCombinado: 16.8, nuclear: 20.0, hidraulica: 10.0, eolica: 22.3, solar: 18.0, emisiones: 24 },
];

const COLORS = {
  carbon: '#4a4a4a',          // Gris oscuro/antracita
  cicloCombinado: '#e67e22',  // Naranja gas
  nuclear: '#9b59b6',         // Púrpura
  hidraulica: '#1abc9c',      // Verde turquesa
  eolica: '#3498db',          // Azul eólica
  solar: '#f1c40f'            // Amarillo solar
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <h4 className={styles.tooltipTitle}>Año {label}</h4>
        <div className={styles.tooltipGrid}>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'emisiones') {
              return (
                <p key={index} className={styles.emissionsLabel} style={{ color: entry.color }}>
                  <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                  Emisiones CO2: <strong>{entry.value} Mt</strong>
                </p>
              );
            }
            return (
              <p key={index} className={styles.techLabel} style={{ color: entry.color }}>
                <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                {entry.name}: <strong>{entry.value}%</strong>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function EnergyTransitionStreamgraph() {
  const [activeSeries, setActiveSeries] = useState({
    carbon: true,
    cicloCombinado: true,
    nuclear: true,
    hidraulica: true,
    eolica: true,
    solar: true,
    emisiones: true,
  });

  const toggleSeries = (dataKey) => {
    setActiveSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className={styles.customLegend}>
        {payload.map((entry, index) => (
          <div 
            key={`item-${index}`} 
            className={`${styles.legendItem} ${!activeSeries[entry.dataKey] ? styles.inactive : ''}`}
            onClick={() => toggleSeries(entry.dataKey)}
            style={{ '--item-color': entry.color }}
          >
            <span className={styles.legendColor} style={{ backgroundColor: entry.color }}></span>
            <span className={styles.legendLabel}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Estratos de Transición (1990 - 2025)</h3>
        <p>Evolución del Mix de Generación (%) vs. Emisiones de CO2 (Mt).<br/><em>Haz clic en la leyenda para activar/desactivar tecnologías.</em></p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
            />
            
            {/* Eje Y Principal (Porcentajes) */}
            <YAxis 
              yAxisId="left" 
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
              axisLine={false}
            />
            
            {/* Eje Y Secundario (Emisiones) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={(val) => `${val} Mt`}
              tick={{ fill: '#ff4757', fontWeight: 'bold' }}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} />
            <Legend content={renderLegend} verticalAlign="bottom" height={36}/>

            {/* Áreas Apiladas (Streamgraph) */}
            {activeSeries.carbon && (
              <Area yAxisId="left" type="monotone" dataKey="carbon" name="Carbón" stackId="1" stroke={COLORS.carbon} fill={COLORS.carbon} fillOpacity={0.8} />
            )}
            {activeSeries.nuclear && (
              <Area yAxisId="left" type="monotone" dataKey="nuclear" name="Nuclear" stackId="1" stroke={COLORS.nuclear} fill={COLORS.nuclear} fillOpacity={0.8} />
            )}
            {activeSeries.hidraulica && (
              <Area yAxisId="left" type="monotone" dataKey="hidraulica" name="Hidráulica" stackId="1" stroke={COLORS.hidraulica} fill={COLORS.hidraulica} fillOpacity={0.8} />
            )}
            {activeSeries.cicloCombinado && (
              <Area yAxisId="left" type="monotone" dataKey="cicloCombinado" name="Ciclo Combinado" stackId="1" stroke={COLORS.cicloCombinado} fill={COLORS.cicloCombinado} fillOpacity={0.8} />
            )}
            {activeSeries.eolica && (
              <Area yAxisId="left" type="monotone" dataKey="eolica" name="Eólica" stackId="1" stroke={COLORS.eolica} fill={COLORS.eolica} fillOpacity={0.8} />
            )}
            {activeSeries.solar && (
              <Area yAxisId="left" type="monotone" dataKey="solar" name="Solar FV" stackId="1" stroke={COLORS.solar} fill={COLORS.solar} fillOpacity={0.8} />
            )}

            {/* Línea de Emisiones */}
            {activeSeries.emisiones && (
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="emisiones" 
                name="Emisiones CO2" 
                stroke="#ff4757" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#ff4757', stroke: 'var(--ifm-background-color)' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
