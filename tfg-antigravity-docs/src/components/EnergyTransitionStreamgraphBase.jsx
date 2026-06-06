import { useDocLang } from '@site/src/hooks/useDocLang';
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
  carbon: 'var(--ets-carbon)',
  cicloCombinado: 'var(--ets-gas)',
  nuclear: 'var(--ets-nuclear)',
  hidraulica: 'var(--ets-hydro)',
  eolica: 'var(--ets-wind)',
  solar: 'var(--ets-solar)',
  emisiones: 'var(--ets-emissions)',
};

const CustomTooltip = ({ active, payload, label, strings }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <h4 className={styles.tooltipTitle}>{strings.year} {label}</h4>
        <div className={styles.tooltipGrid}>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'emisiones') {
              return (
                <p key={index} className={styles.emissionsLabel} style={{ color: entry.color }}>
                  <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                  {strings.emissionsLabel}: <strong>{entry.value} Mt</strong>
                </p>
              );
            }
            return (
              <p key={index} className={styles.techLabel} style={{ color: entry.color }}>
                <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                {strings.techs[entry.name] || entry.name}: <strong>{entry.value}%</strong>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function EnergyTransitionStreamgraph({}) {
  const lang = useDocLang();
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

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Transition Strata (1990 - 2025)', desc1: 'Generation Mix Evolution (%) vs. CO2 Emissions (Mt).', desc2: 'Click on the legend to toggle technologies.', year: 'Year', emissionsLabel: 'CO2 Emissions', techs: { "Carbón": "Coal", "Nuclear": "Nuclear", "Hidráulica": "Hydro", "Ciclo Combinado": "Combined Cycle", "Eólica": "Wind", "Solar FV": "Solar PV", "Emisiones CO2": "CO2 Emissions" } };
      case 'pt': return { title: 'Estratos de Transição (1990 - 2025)', desc1: 'Evolução do Mix de Geração (%) vs. Emissões de CO2 (Mt).', desc2: 'Clique na legenda para alternar as tecnologias.', year: 'Ano', emissionsLabel: 'Emissões CO2', techs: { "Carbón": "Carvão", "Nuclear": "Nuclear", "Hidráulica": "Hídrica", "Ciclo Combinado": "Ciclo Combinado", "Eólica": "Eólica", "Solar FV": "Solar FV", "Emisiones CO2": "Emissões CO2" } };
      case 'fr': return { title: 'Strates de Transition (1990 - 2025)', desc1: 'Évolution du mix de production (%) vs Émissions de CO2 (Mt).', desc2: 'Cliquez sur la légende pour basculer les technologies.', year: 'Année', emissionsLabel: 'Émissions CO2', techs: { "Carbón": "Charbon", "Nuclear": "Nucléaire", "Hidráulica": "Hydraulique", "Ciclo Combinado": "Cycle Combiné", "Eólica": "Éolien", "Solar FV": "Solaire PV", "Emisiones CO2": "Émissions CO2" } };
      case 'it': return { title: 'Strati di Transizione (1990 - 2025)', desc1: 'Evoluzione del mix di generazione (%) vs Emissioni di CO2 (Mt).', desc2: 'Fai clic sulla legenda per attivare/disattivare le tecnologie.', year: 'Anno', emissionsLabel: 'Emissioni CO2', techs: { "Carbón": "Carbone", "Nuclear": "Nucleare", "Hidráulica": "Idroelettrica", "Ciclo Combinado": "Ciclo Combinato", "Eólica": "Eolico", "Solar FV": "Solare FV", "Emisiones CO2": "Emissioni CO2" } };
      case 'de': return { title: 'Übergangsschichten (1990 - 2025)', desc1: 'Entwicklung des Erzeugungsmixes (%) vs. CO2-Emissionen (Mt).', desc2: 'Klicken Sie auf die Legende, um Technologien umzuschalten.', year: 'Jahr', emissionsLabel: 'CO2-Emissionen', techs: { "Carbón": "Kohle", "Nuclear": "Kernkraft", "Hidráulica": "Wasser", "Ciclo Combinado": "GuD-Kraftwerk", "Eólica": "Wind", "Solar FV": "Solar-PV", "Emisiones CO2": "CO2-Emissionen" } };
      default: return { title: 'Estratos de Transición (1990 - 2025)', desc1: 'Evolución del Mix de Generación (%) vs. Emisiones de CO2 (Mt).', desc2: 'Haz clic en la leyenda para activar/desactivar tecnologías.', year: 'Año', emissionsLabel: 'Emisiones CO2', techs: { "Carbón": "Carbón", "Nuclear": "Nuclear", "Hidráulica": "Hidráulica", "Ciclo Combinado": "Ciclo Combinado", "Eólica": "Eólica", "Solar FV": "Solar FV", "Emisiones CO2": "Emisiones CO2" } };
    }
  };
  const strings = getStrings(lang);

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
            <span className={styles.legendLabel}>{strings.techs[entry.value] || entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{strings.title}</h3>
        <p>{strings.desc1}<br/><em>{strings.desc2}</em></p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={680}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ets-grid)" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'var(--ets-axis)', fontSize: 11 }}
              tickLine={false}
            />
            
            {/* Eje Y Principal (Porcentajes) */}
            <YAxis 
              yAxisId="left" 
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: 'var(--ets-axis)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            
            {/* Eje Y Secundario (Emisiones) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={(val) => `${val} Mt`}
              tick={{ fill: 'var(--ets-emissions)', fontWeight: 700, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip strings={strings} />} cursor={{ stroke: 'var(--ets-axis-line)', strokeWidth: 2 }} />
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
                stroke={COLORS.emisiones} 
                strokeWidth={4} 
                dot={{ r: 6, fill: COLORS.emisiones, stroke: 'var(--ets-bg-card)', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: COLORS.emisiones, stroke: 'var(--ets-bg-card)', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
