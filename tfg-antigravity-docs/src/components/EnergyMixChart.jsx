import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { energyMixData } from '../data/forensicData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function EnergyMixChart({ lang }) {
  const { i18n } = useDocusaurusContext();
  const currentLang = lang || i18n?.currentLocale || 'es';

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Pre-Collapse Energy Mix vs Abrupt Loss (GW)', yaxis: 'Power (GW)', inyectada: 'Injected Power (GW)', perdida: 'Cascading Loss (GW)', 
        techs: { "Solar": "Solar", "Hidráulica": "Hydro", "Eólica": "Wind", "Nuclear": "Nuclear", "Cogeneración": "Cogeneration", "C. Combinado": "Combined Cycle", "Carbón": "Coal" } };
      case 'pt': return { title: 'Mix Energético Pré-Colapso vs Perda Abrupta (GW)', yaxis: 'Potência (GW)', inyectada: 'Potência Injetada (GW)', perdida: 'Perda em Cascata (GW)',
        techs: { "Solar": "Solar", "Hidráulica": "Hídrica", "Eólica": "Eólica", "Nuclear": "Nuclear", "Cogeneración": "Cogeração", "C. Combinado": "Ciclo Combinado", "Carbón": "Carvão" } };
      case 'fr': return { title: 'Mix Énergétique Pré-Effondrement vs Perte Abrupte (GW)', yaxis: 'Puissance (GW)', inyectada: 'Puissance Injectée (GW)', perdida: 'Perte en Cascade (GW)',
        techs: { "Solar": "Solaire", "Hidráulica": "Hydraulique", "Eólica": "Éolien", "Nuclear": "Nucléaire", "Cogeneración": "Cogénération", "C. Combinado": "Cycle Combiné", "Carbón": "Charbon" } };
      case 'it': return { title: 'Mix Energetico Pre-Collasso vs Perdita Improvvisa (GW)', yaxis: 'Potenza (GW)', inyectada: 'Potenza Iniettata (GW)', perdida: 'Perdita a Cascata (GW)',
        techs: { "Solar": "Solare", "Hidráulica": "Idroelettrica", "Eólica": "Eolico", "Nuclear": "Nucleare", "Cogeneración": "Cogenerazione", "C. Combinado": "Ciclo Combinato", "Carbón": "Carbone" } };
      case 'de': return { title: 'Energie-Mix vor Kollaps vs. Abrupter Verlust (GW)', yaxis: 'Leistung (GW)', inyectada: 'Eingespeiste Leistung (GW)', perdida: 'Kaskadenverlust (GW)',
        techs: { "Solar": "Solar", "Hidráulica": "Wasser", "Eólica": "Wind", "Nuclear": "Kernkraft", "Cogeneración": "Kraft-Wärme-Kopplung", "C. Combinado": "GuD-Kraftwerk", "Carbón": "Kohle" } };
      default: return { title: 'Mix Energético Pre-Colapso vs Pérdida Abrupta (GW)', yaxis: 'Potencia (GW)', inyectada: 'Potencia Inyectada (GW)', perdida: 'Pérdida en Cascada (GW)',
        techs: { "Solar": "Solar", "Hidráulica": "Hidráulica", "Eólica": "Eólica", "Nuclear": "Nuclear", "Cogeneración": "Cogeneración", "C. Combinado": "C. Combinado", "Carbón": "Carbón" } };
    }
  };

  const strings = getStrings(currentLang);
  const localizedData = energyMixData.map(d => ({
    ...d,
    tecnologia: strings.techs[d.tecnologia] || d.tecnologia
  }));

  return (
    <div style={{ width: '100%', height: 400, marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{strings.title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={localizedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="tecnologia" stroke="var(--ifm-color-content)" />
          <YAxis stroke="var(--ifm-color-content)" label={{ value: strings.yaxis, angle: -90, position: 'insideLeft', offset: -10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--ifm-background-color)', borderColor: 'var(--ifm-color-emphasis-300)' }}
            itemStyle={{ color: 'var(--ifm-color-content)' }}
          />
          <Legend />
          <Bar dataKey="inyectadaGW" name={strings.inyectada} fill="#3b82f6" />
          <Bar dataKey="perdidaGW" name={strings.perdida} fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
