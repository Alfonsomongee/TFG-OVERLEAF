import React, { useState, useEffect, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InteractiveGraphicsGallery.module.css';

const FrequencyChart = lazy(() => import(/* webpackChunkName: "chart-frequency" */ './FrequencyChart'));
const AnimatedMap = lazy(() => import(/* webpackChunkName: "chart-animated-map" */ './AnimatedMap'));
const VerticalTimeline = lazy(() => import(/* webpackChunkName: "chart-timeline" */ './VerticalTimeline'));
const EnergyTransitionStreamgraph = lazy(() => import(/* webpackChunkName: "chart-streamgraph" */ './EnergyTransitionStreamgraph'));
const FinancialWaterfallChart = lazy(() => import(/* webpackChunkName: "chart-waterfall" */ './FinancialWaterfallChart'));
const BlackoutPropagationMap = lazy(() => import(/* webpackChunkName: "chart-blackout-map" */ './BlackoutPropagationMap'));
const IberianGridTopology = lazy(() => import(/* webpackChunkName: "chart-topology" */ './IberianGridTopology'));
const ThermalAdjustmentCostMatrix = lazy(() => import(/* webpackChunkName: "chart-thermal-matrix" */ './ThermalAdjustmentCostMatrix'));
const CollapseSismograph = lazy(() => import(/* webpackChunkName: "chart-sismograph" */ './CollapseSismograph'));
const PVCurveSimulator = lazy(() => import(/* webpackChunkName: "chart-pvcurve" */ './PVCurveSimulator'));
const ANSI59Cascade = lazy(() => import(/* webpackChunkName: "chart-ansi59" */ './ANSI59Cascade'));

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
      es: { title: 'Topología de Red', desc: 'Grafo de fuerza dirigida de las dependencias topológicas de la red de transporte ibérica.' },
      en: { title: 'Grid Topology', desc: 'Force-directed graph of the topological dependencies of the Iberian transmission grid.' },
      pt: { title: 'Topologia de Rede', desc: 'Grafo de força dirigida das dependências topológicas da rede de transmissão ibérica.' },
      fr: { title: 'Topologie de Réseau', desc: 'Graphe de force dirigée des dépendances topologiques du réseau de transport ibérique.' },
      it: { title: 'Topologia di Rete', desc: 'Grafo a forza diretta delle dipendenze topologiche della rete di trasmissione iberica.' },
      de: { title: 'Netztopologie', desc: 'Kraftgesteuerter Graph der topologischen Abhängigkeiten des iberischen Übertragungsnetzes.' }
    },
    sismograph: {
      es: { title: 'Sismógrafo del Colapso', desc: 'Evolución transitoria de la frecuencia y la tensión de red en Carmona durante los 27 segundos críticos del colapso.' },
      en: { title: 'Collapse Sismograph', desc: 'Transient evolution of grid frequency and voltage at Carmona during the critical 27 seconds of the collapse.' },
      pt: { title: 'Sismógrafo do Colapso', desc: 'Evolução transitória de frequência e tensão de rede em Carmona durante os 27 segundos críticos del colapso.' },
      fr: { title: 'Sismographe de l\'Effondrement', desc: 'Évolution transitoire de la fréquence et de la tension de réseau à Carmona pendant les 27 secondes critiques de l\'effondrement.' },
      it: { title: 'Sismografo del Collasso', desc: 'Evoluzione transitoria della frequenza e della tensión di rete a Carmona durante i 27 secondi critici del collasso.' },
      de: { title: 'Kollaps-Sismograph', desc: 'Transiente Entwicklung von Netzfrequenz und -spannung in Carmona während der kritischen 27 Sekunden des Kollapses.' }
    },
    phasor: {
      es: { title: 'Gráfico Fasorial Transitorio', desc: 'Dispersión polar de Unidades de Medición Fasorial (PMU) a 50Hz ilustrando la divergencia angular y colapso de la estabilidad.' },
      en: { title: 'Transient Phasor Plot', desc: 'Polar scatter of Phasor Measurement Units (PMU) at 50Hz illustrating angular divergence and stability collapse.' },
      pt: { title: 'Gráfico Fasorial Transitório', desc: 'Dispersão polar de Unidades de Medição Fasorial (PMU) a 50Hz ilustrando a divergência angular.' },
      fr: { title: 'Tracé Phasoriel Transitoire', desc: 'Dispersion polaire des unités de mesure de phase (PMU) à 50 Hz illustrant la divergence angulaire.' },
      it: { title: 'Grafico Fasoriale Transitorio', desc: 'Dispersione polare delle unità di misura fasoriale (PMU) a 50Hz che illustra la divergenza angolare.' },
      de: { title: 'Transientes Zeigerdiagramm', desc: 'Polare Streuung von Phasor Measurement Units (PMU) bei 50 Hz zur Veranschaulichung der Winkeldivergenz.' }
    },
    phaseplane: {
      es: { title: 'Diagrama de Plano de Fase (GFM vs GFL)', desc: 'Comparación en el espacio de estados δ vs Δω de la convergencia de inversores Formadores de Red frente a Seguidores de Red.' },
      en: { title: 'Phase-Plane Diagram (GFM vs GFL)', desc: 'State-space comparison δ vs Δω of Grid-Forming vs Grid-Following inverters convergence.' },
      pt: { title: 'Diagrama de Plano de Fase (GFM vs GFL)', desc: 'Comparação no espaço de estados δ vs Δω da convergência de inversores Formadores de Rede versus Seguidores de Rede.' },
      fr: { title: 'Diagramme de Plan de Phase (GFM vs GFL)', desc: 'Comparaison dans l\'espace d\'états δ vs Δω de la convergence des onduleurs Formateurs de Réseau vs Suiveurs de Réseau.' },
      it: { title: 'Diagramma di Piano di Fase (GFM vs GFL)', desc: 'Confronto nello spazio degli stati δ vs Δω della convergenza degli inverter Grid-Forming vs Grid-Following.' },
      de: { title: 'Phasenebenendiagramm (GFM vs GFL)', desc: 'Zustandsraumvergleich δ vs Δω der Konvergenz von netzbildenden vs. netzfolgenden Wechselrichtern.' }
    },
    interconnection: {
      es: { title: 'Dashboard de Interconexiones', desc: 'Análisis del estrangulamiento estructural de los intercambios internacionales.' },
      en: { title: 'Interconnection Dashboard', desc: 'Analysis of the structural bottleneck in international exchanges.' },
      pt: { title: 'Dashboard de Interconexões', desc: 'Análise do estrangulamento estrutural das trocas internacionais.' },
      fr: { title: 'Tableau de Bord des Interconnexions', desc: 'Analyse du goulot d\'étranglement structurel des échanges internationaux.' },
      it: { title: 'Dashboard delle Interconnessioni', desc: 'Analisi del collo di bottiglia strutturale negli scambi internazionali.' },
      de: { title: 'Verbindungs-Dashboard', desc: 'Analyse des strukturellen Engpasses im internationalen Austausch.' }
    },
    swing: {
      es: { title: 'Simulador Ecuación del Swing', desc: 'Simulador interactivo de la inercia (H), desequilibrio (ΔP) y Respuesta Rápida de Frecuencia (FFR) tras el incidente.' },
      en: { title: 'Swing Equation Simulator', desc: 'Interactive simulator of inertia (H), power mismatch (ΔP) and Fast Frequency Response (FFR).' },
      pt: { title: 'Simulador Equação do Swing', desc: 'Simulador interativo da inércia (H), desequilíbrio (ΔP) e Resposta Rápida de Frequência (FFR).' },
      fr: { title: 'Simulateur Équation du Swing', desc: 'Simulateur interactif de l\'inertie (H), déséquilibre (ΔP) et Réponse Rapide de Fréquence (FFR).' },
      it: { title: 'Simulatore Equazione dello Swing', desc: 'Simulatore interattivo dell\'inerzia (H), squilibrio (ΔP) e Risposta Rapida di Frequenza (FFR).' },
      de: { title: 'Swing-Gleichung-Simulator', desc: 'Interaktiver Simulator für Trägheit (H), Ungleichgewicht (ΔP) und Schnelle Frequenzantwort (FFR).' }
    },
    matrix: {
      es: { title: 'Matriz de Costes de Inacción', desc: 'Análisis comparativo entre el OPEX tóxico diario por inacción y el CAPEX del retrofitting.' },
      en: { title: 'Cost of Inaction Matrix', desc: 'Comparative analysis between daily toxic OPEX from inaction and retrofitting CAPEX.' },
      pt: { title: 'Matriz de Custos de Inação', desc: 'Análise comparativa entre o OPEX tóxico diário por inação e o CAPEX del retrofitting.' },
      fr: { title: 'Matrice des Coûts de l\'Inaction', desc: 'Analyse comparative entre l\'OPEX toxique quotidien dû à l\'inaction et le CAPEX du rétrofitting.' },
      it: { title: 'Matrice dei Costi dell\'Inazione', desc: 'Analisi comparativa tra l\'OPEX tossico giornaliero per inazione e il CAPEX del retrofitting.' },
      de: { title: 'Kosten der Untätigkeit Matrix', desc: 'Vergleichende Analyse zwischen dem täglichen toxischen OPEX durch Untätigkeit und dem Retrofitting-CAPEX.' }
    },
    pvcurve: {
      es: { title: 'Curva Nariz P-V', desc: 'Mecanismo físico de inestabilidad y margen de cargabilidad al colapso de tensión.' },
      en: { title: 'P-V Nose Curve', desc: 'Physical instability mechanism and reactive power margin to voltage collapse.' },
      pt: { title: 'Curva de Nariz P-V', desc: 'Mecanismo físico de instabilidade e margem de carregabilidade ao colapso de tensão.' },
      fr: { title: 'Courbe en Nez P-V', desc: 'Mécanisme physique d\'instabilité et marge de charge face à l\'effondrement de tension.' },
      it: { title: 'Curva a Naso P-V', desc: 'Meccanismo fisico di instabilità e margine di caricabilità al collasso di tensione.' },
      de: { title: 'P-V-Nasenkurve', desc: 'Physischer Instabilitätsmechanismus und Belastbarkeitsgrenze bis zum Spannungskollaps.' }
    },
    ansi59: {
      es: { title: 'Bucle Cascada ANSI 59', desc: 'Simulación de retroalimentación positiva por desconexiones masivas de IBR.' },
      en: { title: 'ANSI 59 Cascade Loop', desc: 'Positive feedback simulation driven by massive IBR trips.' },
      pt: { title: 'Bucle Cascata ANSI 59', desc: 'Simulação de retroalimentação positiva por desligamentos massivos de IBR.' },
      fr: { title: 'Boucle en Cascade ANSI 59', desc: 'Simulation de rétroaction positive causée par des déconnexions massives d\'IBR.' },
      it: { title: 'Loop a Cascata ANSI 59', desc: 'Simulazione di retroazione positiva causata da disconnessioni massive di IBR.' },
      de: { title: 'ANSI-59-Kaskadenschleife', desc: 'Simulation der positiven Rückkopplung durch massenhafte IBR-Trennungen.' }
    }
  };
  return dictionary[id] ? (dictionary[id][lang] || dictionary[id]['es']) : dictionary['frequency']['es'];
};

const SynchrophasorPlot = lazy(() => import(/* webpackChunkName: "chart-synchrophasor" */ './SynchrophasorPlot'));
const PhasePlanePlot = lazy(() => import(/* webpackChunkName: "chart-phaseplane" */ './PhasePlanePlot'));
const InterconnectionDashboard = lazy(() => import(/* webpackChunkName: "chart-interconnection" */ './InterconnectionDashboard'));
const SwingEquationSimulator = lazy(() => import(/* webpackChunkName: "chart-swing" */ './SwingEquationSimulator/SwingEquationSimulator'));

const graphicsData = [
  { id: 'frequency', icon: '📉', component: FrequencyChart },
  { id: 'map', icon: '🗺️', component: AnimatedMap },
  { id: 'timeline', icon: '⏱️', component: VerticalTimeline },

  { id: 'streamgraph', icon: '🌍', component: EnergyTransitionStreamgraph },
  { id: 'waterfall', icon: '💶', component: FinancialWaterfallChart },
  { id: 'topology', icon: '🕸️', component: IberianGridTopology },
  { id: 'sismograph', icon: '📊', component: CollapseSismograph },
  { id: 'phasor', icon: '🧭', component: SynchrophasorPlot },
  { id: 'phaseplane', icon: '🌀', component: PhasePlanePlot },
  { id: 'interconnection', icon: '🔌', component: InterconnectionDashboard },
  { id: 'swing', icon: '⚖️', component: SwingEquationSimulator },
  { id: 'matrix', icon: '💸', component: ThermalAdjustmentCostMatrix },
  { id: 'pvcurve', icon: '📈', component: PVCurveSimulator },
  { id: 'ansi59', icon: '⚡', component: ANSI59Cascade }
];

export default function InteractiveGraphicsGallery({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const locale = propLang || i18n.currentLocale;
  const [activeGraphicId, setActiveGraphicId] = useState(graphicsData[0].id);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && graphicsData.some(g => g.id === hash)) {
        setActiveGraphicId(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        <ul
          role="tablist"
          aria-label={getAvailableTitle(locale)}
          className={styles.graphicList}
        >
          {graphicsData.map(graphic => {
            const content = getGraphicData(graphic.id, locale);
            return (
            <li key={graphic.id}>
              <button
                role="tab"
                aria-selected={activeGraphicId === graphic.id}
                aria-controls={`panel-${graphic.id}`}
                id={`tab-${graphic.id}`}
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
        <div
          className={styles.graphicStage}
          role="tabpanel"
          id={`panel-${activeGraphicId}`}
          aria-labelledby={`tab-${activeGraphicId}`}
        >
          <BrowserOnly fallback={<div>{getLoadingText(locale)}</div>}>
            {() => (
              <Suspense fallback={
                <div style={{
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontFamily: 'monospace',
                  fontSize: 13
                }}>
                  Iniciando {activeGraphicContent.title}…
                </div>
              }>
                <ActiveComponent lang={locale} isGallery={true} />
              </Suspense>
            )}
          </BrowserOnly>
        </div>
      </div>
    </div>
  );
}

