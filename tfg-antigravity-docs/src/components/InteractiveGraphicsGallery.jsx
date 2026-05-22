import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InteractiveGraphicsGallery.module.css';

// Import components directly if they are safe for SSR, or we wrap their usage in BrowserOnly.
// Since some of them need BrowserOnly, we'll wrap the active component renderer.
import FrequencyChart from './FrequencyChart';
import EnergyMixChart from './EnergyMixChart';
import AnimatedMap from './AnimatedMap';
import VerticalTimeline from './VerticalTimeline';
import SldDiagram from './SldDiagram';
import EnergyTransitionStreamgraph from './EnergyTransitionStreamgraph';
import FinancialWaterfallChart from './FinancialWaterfallChart';
import BlackoutPropagationMap from './BlackoutPropagationMap';
import IberianGridTopology from './IberianGridTopology';

const graphicsData = [
  {
    id: 'frequency',
    title_es: 'Caída de Frecuencia (Hz)',
    title_en: 'Frequency Drop (Hz)',
    desc_es: 'Gráfico interactivo de la evolución de la frecuencia durante el colapso.',
    desc_en: 'Interactive chart of frequency evolution during the collapse.',
    icon: '📉',
    component: FrequencyChart
  },
  {
    id: 'energymix',
    title_es: 'Mix Energético',
    title_en: 'Energy Mix',
    desc_es: 'Evolución interactiva de la cuota de generación renovable y convencional.',
    desc_en: 'Interactive evolution of renewable vs conventional generation share.',
    icon: '⚡',
    component: EnergyMixChart
  },
  {
    id: 'map',
    title_es: 'Mapa Animado del Colapso',
    title_en: 'Animated Collapse Map',
    desc_es: 'Simulación geográfica interactiva de la cascada de desconexiones.',
    desc_en: 'Interactive geographic simulation of the disconnection cascade.',
    icon: '🗺️',
    component: AnimatedMap
  },
  {
    id: 'timeline',
    title_es: 'Cronograma del Incidente',
    title_en: 'Incident Timeline',
    desc_es: 'Línea de tiempo vertical e interactiva de los eventos clave.',
    desc_en: 'Interactive vertical timeline of key events.',
    icon: '⏱️',
    component: VerticalTimeline
  },
  {
    id: 'sld',
    title_es: 'Diagrama Unifilar',
    title_en: 'Single Line Diagram',
    desc_es: 'Esquema eléctrico interactivo de la red de transporte.',
    desc_en: 'Interactive electrical schematic of the transmission grid.',
    icon: '🔌',
    component: SldDiagram
  },
  {
    id: 'streamgraph',
    title_es: 'Transición y Emisiones',
    title_en: 'Transition & Emissions',
    desc_es: 'Evolución macroestructural del mix de generación frente a las emisiones de CO2.',
    desc_en: 'Macro-structural evolution of the generation mix versus CO2 emissions.',
    icon: '🌍',
    component: EnergyTransitionStreamgraph
  },
  {
    id: 'waterfall',
    title_es: 'Auditoría Económica',
    title_en: 'Economic Audit',
    desc_es: 'Cascada financiera del impacto del apagón y el coste de resiliencia.',
    desc_en: 'Financial waterfall of the blackout impact and resilience cost.',
    icon: '💶',
    component: FinancialWaterfallChart
  },
  {
    id: 'blackout3d',
    title_es: 'Mapa 3D del Apagón (WebGL)',
    title_en: '3D Blackout Map (WebGL)',
    desc_es: 'Simulación geográfica interactiva con Deck.gl de la cascada de desconexiones y flujos masivos de reactiva.',
    desc_en: 'Interactive geographic simulation with Deck.gl of the disconnection cascade.',
    icon: '🌍',
    component: BlackoutPropagationMap
  },
  {
    id: 'topology',
    title_es: 'Topología de Red Neuronal (GNN)',
    title_en: 'Neural Grid Topology (GNN)',
    desc_es: 'Grafo Force-Directed de las impedancias de la red de transporte y dependencias de tensión inter-área.',
    desc_en: 'Force-directed graph of the transmission grid impedances.',
    icon: '🕸️',
    component: IberianGridTopology
  }
];

export default function InteractiveGraphicsGallery({ lang = 'es' }) {
  const [activeGraphicId, setActiveGraphicId] = useState(graphicsData[0].id);
  const isEn = lang === 'en';

  const activeGraphic = graphicsData.find(g => g.id === activeGraphicId);
  const ActiveComponent = activeGraphic.component;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>
          {isEn ? 'Available Graphics' : 'Gráficas Disponibles'}
        </h3>
        <ul className={styles.graphicList}>
          {graphicsData.map(graphic => (
            <li key={graphic.id}>
              <button
                className={`${styles.graphicButton} ${activeGraphicId === graphic.id ? styles.activeButton : ''}`}
                onClick={() => setActiveGraphicId(graphic.id)}
              >
                <span className={styles.icon}>{graphic.icon}</span>
                <div className={styles.buttonText}>
                  <span className={styles.buttonTitle}>
                    {isEn ? graphic.title_en : graphic.title_es}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.graphicHeader}>
          <h2>{isEn ? activeGraphic.title_en : activeGraphic.title_es}</h2>
          <p>{isEn ? activeGraphic.desc_en : activeGraphic.desc_es}</p>
        </div>
        <div className={styles.graphicStage}>
          <BrowserOnly fallback={<div>Cargando gráfico interactivo / Loading interactive graphic...</div>}>
            {() => <ActiveComponent lang={lang} />}
          </BrowserOnly>
        </div>
      </div>
    </div>
  );
}
