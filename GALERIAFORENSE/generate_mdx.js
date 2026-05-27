const fs = require('fs');

const parsed = JSON.parse(fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\GALERIAFORENSE\\parsed_desc.json', 'utf8'));

const esiosSections = parsed.filter(p => p.id.startsWith('ESIOS'));
const entsoSections = parsed.filter(p => p.id.startsWith('ENTSO'));

const esiosComponentMap = {
  'ESIOS-01': '<DemandaChart />',
  'ESIOS-02': '<ProgramacionChart />',
  'ESIOS-03': '<PreciosChart />',
  'ESIOS-04': '<PrecioEnergiaChart />',
  'ESIOS-05': '<GenericEsiosChart dataUrl="/data/esios/precios-desvios-tiempo-real.json" title="Precios de Desvíos Tiempo Real (28-29 Abril)" unit="€/MWh" />',
  'ESIOS-06': '<PotenciaChart />',
  'ESIOS-07': '<GenericEsiosChart dataUrl="/data/esios/otros-indicadores.json" title="Previsiones Renovables (28-29 Abril)" unit="MW" includeKeys={["Previsión de la producción eólica peninsular", "Generación prevista Solar"]} />',
  'ESIOS-08': '<GenericEsiosChart dataUrl="/data/esios/otros-indicadores.json" title="Generación libre de CO2" unit="%" includeKeys={["Porcentaje de generación libre de CO2"]} />',
  'ESIOS-09': '<GenericEsiosChart dataUrl="/data/esios/saldos-horarios-por-frontera.json" title="Saldos Horarios por Frontera (28-29 Abril)" unit="MW" />',
  'ESIOS-10': '<SubastasChart />'
};

const entsoComponentMap = {
  'ENTSO-01': '<ForecastTransferChart />',
  'ENTSO-02': '<CostCongestionChart />',
  'ENTSO-03': '<ActualGenerationChart />',
  'ENTSO-04': '<HydroReservoirChart />',
  'ENTSO-05': '<CurrentBalancingStateChart />',
  'ENTSO-06': '<FallbacksChart />',
  'ENTSO-07': '<InstalledCapacityChart />',
  'ENTSO-08': '<TotalLoadChart />',
  'ENTSO-09': '<EnergyPricesChart />',
  'ENTSO-10': '<CrossBorderFlowsChart />',
  'ENTSO-11': '<ScheduledCommercialExchangesChart />',
  'ENTSO-12': '<ImbalanceChart />',
  'ENTSO-13': '<FrrCapacityChart />'
};

const generateMdx = (sections, componentMap, headerImports) => {
  let mdx = headerImports + '\n\n';
  mdx += '<Tabs defaultValue="' + sections[0].id.toLowerCase() + '" className="forensic-tabs">\n';
  
  sections.forEach(s => {
    mdx += `  <TabItem value="${s.id.toLowerCase()}" label="${s.id.split('-')[1]}">\n`;
    mdx += `    <div className="forensic-chart-container">\n`;
    mdx += `      <h3 style={{ borderBottom: '2px solid var(--ifm-color-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>${s.title}</h3>\n`;
    mdx += `      <div style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginBottom: '1.5rem', fontFamily: 'monospace' }}>FUENTE: ${s.source}</div>\n`;
    mdx += `      <div style={{ marginBottom: '2rem' }}>\n`;
    mdx += `        ${componentMap[s.id] || ''}\n`;
    mdx += `      </div>\n`;
    
    // Add missing ImbalancePricesChart to ENTSO-12 if Imbalance Volume is ENTSO-12
    if (s.id === 'ENTSO-12') {
        mdx += `      <div style={{ marginBottom: '2rem' }}>\n`;
        mdx += `        <ImbalancePricesChart />\n`;
        mdx += `      </div>\n`;
    }
    
    mdx += `      <div className="forensic-description">\n`;
    
    // Convert descriptions to separate paragraphs
    const paragraphs = s.desc.split(/\n\s*\n/);
    paragraphs.forEach(p => {
        if(p.trim().length > 0) mdx += `        <p>${p.trim()}</p>\n`;
    });
    
    mdx += `      </div>\n`;
    mdx += `      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>\n`;
    mdx += `        <Admonition type="caution" title="Relevancia Forense">\n`;
    const relPars = s.rel.split(/\n\s*\n/);
    relPars.forEach(p => {
        if(p.trim().length > 0) mdx += `        <p>${p.trim()}</p>\n`;
    });
    mdx += `        </Admonition>\n`;
    mdx += `      </div>\n`;
    mdx += `    </div>\n`;
    mdx += `  </TabItem>\n`;
  });
  
  mdx += '</Tabs>\n';
  return mdx;
};

const esiosHeader = `---
title: Análisis Forense ESIOS
sidebar_position: 16
hide_title: true
---

import DemandaChart from '@site/src/components/EsiosCharts/DemandaChart';
import ProgramacionChart from '@site/src/components/EsiosCharts/ProgramacionChart';
import PrecioEnergiaChart from '@site/src/components/EsiosCharts/PrecioEnergiaChart';
import PreciosChart from '@site/src/components/EsiosCharts/PreciosChart';
import PotenciaChart from '@site/src/components/EsiosCharts/PotenciaChart';
import SubastasChart from '@site/src/components/EsiosCharts/SubastasChart';
import GenericEsiosChart from '@site/src/components/EsiosCharts/GenericEsiosChart';
import ResizeFix from '@site/src/components/EsiosCharts/ResizeFix';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import GlitchTitle from '@site/src/components/GlitchTitle';

<ResizeFix />

<GlitchTitle>ESIOS - Evidencia Forense</GlitchTitle>

Registro oficial de Red Eléctrica de España (REE). Análisis de los indicadores operativos y de mercado durante el colapso sistémico del 28 de abril de 2025.`;

const entsoeHeader = `---
title: Análisis Forense ENTSO-E
sidebar_position: 17
hide_title: true
---

import ForecastTransferChart from '@site/src/components/EntsoeCharts/ForecastTransferChart';
import CostCongestionChart from '@site/src/components/EntsoeCharts/CostCongestionChart';
import ActualGenerationChart from '@site/src/components/EntsoeCharts/ActualGenerationChart';
import HydroReservoirChart from '@site/src/components/EntsoeCharts/HydroReservoirChart';
import ImbalancePricesChart from '@site/src/components/EntsoeCharts/ImbalancePricesChart';
import CurrentBalancingStateChart from '@site/src/components/EntsoeCharts/CurrentBalancingStateChart';
import ScheduledCommercialExchangesChart from '@site/src/components/EntsoeCharts/ScheduledCommercialExchangesChart';
import FallbacksChart from '@site/src/components/EntsoeCharts/FallbacksChart';
import InstalledCapacityChart from '@site/src/components/EntsoeCharts/InstalledCapacityChart';
import TotalLoadChart from '@site/src/components/EntsoeCharts/TotalLoadChart';
import EnergyPricesChart from '@site/src/components/EntsoeCharts/EnergyPricesChart';
import CrossBorderFlowsChart from '@site/src/components/EntsoeCharts/CrossBorderFlowsChart';
import ImbalanceChart from '@site/src/components/EntsoeCharts/ImbalanceChart';
import FrrCapacityChart from '@site/src/components/EntsoeCharts/FrrCapacityChart';
import ResizeFix from '@site/src/components/EsiosCharts/ResizeFix';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import GlitchTitle from '@site/src/components/GlitchTitle';

<ResizeFix />

<GlitchTitle>ENTSO-E - Evidencia Forense</GlitchTitle>

Plataforma de Transparencia Europea. Análisis de la propagación transfronteriza y fallos sistémicos a nivel continental durante el apagón ibérico del 28 de abril de 2025.`;

const esiosMdx = generateMdx(esiosSections, esiosComponentMap, esiosHeader);
const entsoMdx = generateMdx(entsoSections, entsoComponentMap, entsoeHeader);

fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\docs\\16-graficas-esios.mdx', esiosMdx);
fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\docs\\17-graficas-entsoe.mdx', entsoMdx);

console.log('MDX files successfully generated!');
