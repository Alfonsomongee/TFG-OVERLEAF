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

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const getGraphicData = (id, lang) => {
  const dictionary = {
    frequency: {
      es: { title: 'Caída de Frecuencia (Hz)', desc: 'Gráfico interactivo de la evolución de la frecuencia durante el colapso.' },
      en: { title: 'Frequency Drop (Hz)', desc: 'Interactive chart of frequency evolution during the collapse.' },
      pt: { title: 'Queda de Frequência (Hz)', desc: 'Gráfico interativo da evolução da frequência durante o colapso.' },
      fr: { title: 'Chute de Fréquence (Hz)', desc: 'Graphique interactif de l\'évolution de la fréquence pendant l\'effondrement.' },
      it: { title: 'Caduta di Frequenza (Hz)', desc: 'Grafico interattivo dell\'evoluzione della frequenza durante il collasso.' },
      de: { title: 'Frequenzabfall (Hz)', desc: 'Interaktives Diagramm der Frequenzentwicklung während des Kollapses.' }
    },
    energymix: {
      es: { title: 'Mix Energético', desc: 'Evolución interactiva de la cuota de generación renovable y convencional.' },
      en: { title: 'Energy Mix', desc: 'Interactive evolution of renewable vs conventional generation share.' },
      pt: { title: 'Matriz Energética', desc: 'Evolução interativa da cota de geração renovável e convencional.' },
      fr: { title: 'Mix Énergétique', desc: 'Évolution interactive de la part de production renouvelable et conventionnelle.' },
      it: { title: 'Mix Energetico', desc: 'Evoluzione interattiva della quota di generazione rinnovabile e convenzionale.' },
      de: { title: 'Energiemix', desc: 'Interaktive Entwicklung des Anteils erneuerbarer vs. konventioneller Erzeugung.' }
    },
    map: {
      es: { title: 'Mapa Animado del Colapso', desc: 'Simulación geográfica interactiva de la cascada de desconexiones.' },
      en: { title: 'Animated Collapse Map', desc: 'Interactive geographic simulation of the disconnection cascade.' },
      pt: { title: 'Mapa Animado do Colapso', desc: 'Simulação geográfica interativa da cascata de desconexões.' },
      fr: { title: 'Carte Animée de l\'Effondrement', desc: 'Simulation géographique interactive de la cascade de déconnexions.' },
      it: { title: 'Mappa Animata del Collasso', desc: 'Simulazione geografica interattiva della cascata di disconnessioni.' },
      de: { title: 'Animierte Kollaps-Karte', desc: 'Interaktive geografische Simulation der Kaskadentrennungen.' }
    },
    timeline: {
      es: { title: 'Cronograma del Incidente', desc: 'Línea de tiempo vertical e interactiva de los eventos clave.' },
      en: { title: 'Incident Timeline', desc: 'Interactive vertical timeline of key events.' },
      pt: { title: 'Cronograma do Incidente', desc: 'Linha do tempo vertical e interativa dos eventos-chave.' },
      fr: { title: 'Chronologie de l\'Incident', desc: 'Chronologie verticale interactive des événements clés.' },
      it: { title: 'Cronologia dell\'Incidente', desc: 'Cronologia verticale interattiva degli eventi chiave.' },
      de: { title: 'Vorfall-Zeitachse', desc: 'Interaktive vertikale Zeitachse der Schlüsselereignisse.' }
    },
    sld: {
      es: { title: 'Diagrama Unifilar', desc: 'Esquema eléctrico interactivo de la red de transporte.' },
      en: { title: 'Single Line Diagram', desc: 'Interactive electrical schematic of the transmission grid.' },
      pt: { title: 'Diagrama Unifilar', desc: 'Esquema elétrico interativo da rede de transmissão.' },
      fr: { title: 'Schéma Unifilaire', desc: 'Schéma électrique interactif du réseau de transport.' },
      it: { title: 'Schema Unifilare', desc: 'Schema elettrico interattivo della rete di trasmissione.' },
      de: { title: 'Einliniendiagramm', desc: 'Interaktives elektrisches Schema des Übertragungsnetzes.' }
    },
    streamgraph: {
      es: { title: 'Transición y Emisiones', desc: 'Evolución macroestructural del mix de generación frente a las emisiones de CO2.' },
      en: { title: 'Transition & Emissions', desc: 'Macro-structural evolution of the generation mix versus CO2 emissions.' },
      pt: { title: 'Transição e Emissões', desc: 'Evolução macroestrutural da matriz de geração versus emissões de CO2.' },
      fr: { title: 'Transition & Émissions', desc: 'Évolution macrostructurelle du mix de production face aux émissions de CO2.' },
      it: { title: 'Transizione ed Emissioni', desc: 'Evoluzione macrostrutturale del mix di generazione rispetto alle emissioni di CO2.' },
      de: { title: 'Übergang & Emissionen', desc: 'Makrostrukturelle Entwicklung des Erzeugungsmixes versus CO2-Emissionen.' }
    },
    waterfall: {
      es: { title: 'Auditoría Económica', desc: 'Cascada financiera del impacto del apagón y el coste de resiliencia.' },
      en: { title: 'Economic Audit', desc: 'Financial waterfall of the blackout impact and resilience cost.' },
      pt: { title: 'Auditoria Econômica', desc: 'Cascata financeira do impacto do apagão e custo de resiliência.' },
      fr: { title: 'Audit Économique', desc: 'Cascade financière de l\'impact de la panne et du coût de la résilience.' },
      it: { title: 'Audit Economico', desc: 'Cascata finanziaria dell\'impatto del blackout e del costo della resilienza.' },
      de: { title: 'Wirtschaftsprüfung', desc: 'Finanzkaskade der Blackout-Auswirkungen und Resilienzkosten.' }
    },
    blackout3d: {
      es: { title: 'Mapa 3D del Apagón (WebGL)', desc: 'Simulación geográfica interactiva con Deck.gl de la cascada de desconexiones y flujos masivos de reactiva.' },
      en: { title: '3D Blackout Map (WebGL)', desc: 'Interactive geographic simulation with Deck.gl of the disconnection cascade.' },
      pt: { title: 'Mapa 3D do Apagão (WebGL)', desc: 'Simulação geográfica interativa com Deck.gl da cascata de desconexões.' },
      fr: { title: 'Carte 3D de la Panne (WebGL)', desc: 'Simulation géographique interactive avec Deck.gl de la cascade de déconnexions.' },
      it: { title: 'Mappa 3D del Blackout (WebGL)', desc: 'Simulazione geografica interattiva con Deck.gl della cascata di disconnessioni.' },
      de: { title: '3D-Blackout-Karte (WebGL)', desc: 'Interaktive geografische Simulation mit Deck.gl der Kaskadentrennungen.' }
    },
    topology: {
      es: { title: 'Topología de Red Neuronal (GNN)', desc: 'Grafo Force-Directed de las impedancias de la red de transporte y dependencias de tensión inter-área.' },
      en: { title: 'Neural Grid Topology (GNN)', desc: 'Force-directed graph of the transmission grid impedances.' },
      pt: { title: 'Topologia de Rede Neural (GNN)', desc: 'Grafo Force-Directed das impedâncias da rede de transmissão.' },
      fr: { title: 'Topologie de Réseau Neuronal (GNN)', desc: 'Graphe dirigé par la force des impédances du réseau de transport.' },
      it: { title: 'Topologia di Rete Neurale (GNN)', desc: 'Grafo diretto dalla forza delle impedenze della rete di trasmissione.' },
      de: { title: 'Neuronale Netztopologie (GNN)', desc: 'Kraftgesteuerter Graph der Übertragungsnetzimpedanzen.' }
    }
  };
  return dictionary[id][lang] || dictionary[id]['es'];
};

const graphicsData = [
  { id: 'frequency', icon: '📉', component: FrequencyChart },
  { id: 'energymix', icon: '⚡', component: EnergyMixChart },
  { id: 'map', icon: '🗺️', component: AnimatedMap },
  { id: 'timeline', icon: '⏱️', component: VerticalTimeline },
  { id: 'sld', icon: '🔌', component: SldDiagram },
  { id: 'streamgraph', icon: '🌍', component: EnergyTransitionStreamgraph },
  { id: 'waterfall', icon: '💶', component: FinancialWaterfallChart },
  { id: 'blackout3d', icon: '🌍', component: BlackoutPropagationMap },
  { id: 'topology', icon: '🕸️', component: IberianGridTopology }
];

export default function InteractiveGraphicsGallery({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const locale = propLang || i18n.currentLocale;
  const [activeGraphicId, setActiveGraphicId] = useState(graphicsData[0].id);

  const activeGraphic = graphicsData.find(g => g.id === activeGraphicId);
  const ActiveComponent = activeGraphic.component;
  const activeGraphicContent = getGraphicData(activeGraphic.id, locale);

  const getAvailableTitle = (l) => {
    switch(l) {
      case 'en': return 'Available Graphics';
      case 'pt': return 'Gráficos Disponíveis';
      case 'fr': return 'Graphiques Disponibles';
      case 'it': return 'Grafici Disponibili';
      case 'de': return 'Verfügbare Grafiken';
      default: return 'Gráficas Disponibles';
    }
  };

  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive graphic...';
      case 'pt': return 'Carregando gráfico interativo...';
      case 'fr': return 'Chargement du graphique interactif...';
      case 'it': return 'Caricamento del grafico interattivo...';
      case 'de': return 'Interaktive Grafik wird geladen...';
      default: return 'Cargando gráfico interactivo...';
    }
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>
          {getAvailableTitle(locale)}
        </h3>
        <ul className={styles.graphicList}>
          {graphicsData.map(graphic => {
            const content = getGraphicData(graphic.id, locale);
            return (
            <li key={graphic.id}>
              <button
                className={`${styles.graphicButton} ${activeGraphicId === graphic.id ? styles.activeButton : ''}`}
                onClick={() => setActiveGraphicId(graphic.id)}
              >
                <span className={styles.icon}>{graphic.icon}</span>
                <div className={styles.buttonText}>
                  <span className={styles.buttonTitle}>
                    {content.title}
                  </span>
                </div>
              </button>
            </li>
          )})}
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.graphicHeader}>
          <h2>{activeGraphicContent.title}</h2>
          <p>{activeGraphicContent.desc}</p>
        </div>
        <div className={styles.graphicStage}>
          <BrowserOnly fallback={<div>{getLoadingText(locale)}</div>}>
            {() => <ActiveComponent lang={locale} isGallery={true} />}
          </BrowserOnly>
        </div>
      </div>
    </div>
  );
}
