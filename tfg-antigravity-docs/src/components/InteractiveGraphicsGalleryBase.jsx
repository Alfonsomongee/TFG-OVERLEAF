import { useDocLang } from '@site/src/hooks/useDocLang';
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
// ── Visualizaciones forenses migrables desde datos-tiempo-real ──────────────
const GridUnavailabilityGauge = lazy(() => import(/* webpackChunkName: "chart-grid-unavailability" */ './GridUnavailabilityGauge'));
const EmissionsVsRenewablesChart = lazy(() => import(/* webpackChunkName: "chart-emissions-renewables" */ './EmissionsVsRenewablesChart'));
const SectorialResilienceChart = lazy(() => import(/* webpackChunkName: "chart-sectorial-resilience" */ './SectorialResilienceChart'));
const CollapseSismograph = lazy(() => import(/* webpackChunkName: "chart-sismograph" */ './CollapseSismograph'));
const PVCurveSimulator = lazy(() => import(/* webpackChunkName: "chart-pvcurve" */ './PVCurveSimulator'));
const ANSI59Cascade = lazy(() => import(/* webpackChunkName: "chart-ansi59" */ './ANSI59Cascade'));

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const getGraphicData = (id, lang) => {
  const dictionary = {
    frequency: {
      es: { title: 'Caída de Frecuencia (Hz)', desc: 'Gráfico interactivo de la evolución de la frecuencia durante el colapso.' },
      en: { title: 'Frequency Drop (Hz)', desc: 'Interactive chart of frequency evolution during the collapse.' },
      fr: { title: 'Chute de Fréquence (Hz)', desc: 'Graphique interactif de l\'évolution de la fréquence pendant l\'effondrement.' },
      de: { title: 'Frequenzabfall (Hz)', desc: 'Interaktives Diagramm der Frequenzentwicklung während des Kollapses.' }
    },
    map: {
      es: { title: 'Mapa Animado del Colapso', desc: 'Simulación geográfica interactiva de la cascada de desconexiones.' },
      en: { title: 'Animated Collapse Map', desc: 'Interactive geographic simulation of the disconnection cascade.' },
      fr: { title: 'Carte Animée de l\'Effondrement', desc: 'Simulation géographique interactive de la cascade de déconnexions.' },
      de: { title: 'Animierte Kollaps-Karte', desc: 'Interaktive geografische Simulation der Kaskadentrennungen.' }
    },
    timeline: {
      es: { title: 'Cronograma del Incidente', desc: 'Línea de tiempo vertical e interactiva de los eventos clave.' },
      en: { title: 'Incident Timeline', desc: 'Interactive vertical timeline of key events.' },
      fr: { title: 'Chronologie de l\'Incident', desc: 'Chronologie verticale interactive des événements clés.' },
      de: { title: 'Vorfall-Zeitachse', desc: 'Interaktive vertikale Zeitachse der Schlüsselereignisse.' }
    },

    streamgraph: {
      es: { title: 'Transición y Emisiones', desc: 'Evolución macroestructural del mix de generación frente a las emisiones de CO2.' },
      en: { title: 'Transition & Emissions', desc: 'Macro-structural evolution of the generation mix versus CO2 emissions.' },
      fr: { title: 'Transition & Émissions', desc: 'Évolution macrostructurelle du mix de production face aux émissions de CO2.' },
      de: { title: 'Übergang & Emissionen', desc: 'Makrostrukturelle Entwicklung des Erzeugungsmixes versus CO2-Emissionen.' }
    },
    waterfall: {
      es: { title: 'Auditoría Económica', desc: 'Cascada financiera del impacto del apagón y el coste de resiliencia.' },
      en: { title: 'Economic Audit', desc: 'Financial waterfall of the blackout impact and resilience cost.' },
      fr: { title: 'Audit Économique', desc: 'Cascade financière de l\'impact de la panne et du coût de la résilience.' },
      de: { title: 'Wirtschaftsprüfung', desc: 'Finanzkaskade der Blackout-Auswirkungen und Resilienzkosten.' }
    },
    blackout3d: {
      es: { title: 'Mapa 3D del Apagón (WebGL)', desc: 'Simulación geográfica interactiva con Deck.gl de la cascada de desconexiones y flujos masivos de reactiva.' },
      en: { title: '3D Blackout Map (WebGL)', desc: 'Interactive geographic simulation with Deck.gl of the disconnection cascade.' },
      fr: { title: 'Carte 3D de la Panne (WebGL)', desc: 'Simulation géographique interactive avec Deck.gl de la cascade de déconnexions.' },
      de: { title: '3D-Blackout-Karte (WebGL)', desc: 'Interaktive geografische Simulation mit Deck.gl der Kaskadentrennungen.' }
    },
    topology: {
      es: { title: 'Topología de Red', desc: 'Grafo de fuerza dirigida de las dependencias topológicas de la red de transporte ibérica.' },
      en: { title: 'Grid Topology', desc: 'Force-directed graph of the topological dependencies of the Iberian transmission grid.' },
      fr: { title: 'Topologie de Réseau', desc: 'Graphe de force dirigée des dépendances topologiques du réseau de transport ibérique.' },
      de: { title: 'Netztopologie', desc: 'Kraftgesteuerter Graph der topologischen Abhängigkeiten des iberischen Übertragungsnetzes.' }
    },
    sismograph: {
      es: { title: 'Sismógrafo del Colapso', desc: 'Evolución transitoria de la frecuencia y la tensión de red en Carmona durante los 27 segundos críticos del colapso.' },
      en: { title: 'Collapse Sismograph', desc: 'Transient evolution of grid frequency and voltage at Carmona during the critical 27 seconds of the collapse.' },
      fr: { title: 'Sismographe de l\'Effondrement', desc: 'Évolution transitoire de la fréquence et de la tension de réseau à Carmona pendant les 27 secondes critiques de l\'effondrement.' },
      de: { title: 'Kollaps-Sismograph', desc: 'Transiente Entwicklung von Netzfrequenz und -spannung in Carmona während der kritischen 27 Sekunden des Kollapses.' }
    },
    phasor: {
      es: { title: 'Gráfico Fasorial Transitorio', desc: 'Dispersión polar de Unidades de Medición Fasorial (PMU) a 50Hz ilustrando la divergencia angular y colapso de la estabilidad.' },
      en: { title: 'Transient Phasor Plot', desc: 'Polar scatter of Phasor Measurement Units (PMU) at 50Hz illustrating angular divergence and stability collapse.' },
      fr: { title: 'Tracé Phasoriel Transitoire', desc: 'Dispersion polaire des unités de mesure de phase (PMU) à 50 Hz illustrant la divergence angulaire.' },
      de: { title: 'Transientes Zeigerdiagramm', desc: 'Polare Streuung von Phasor Measurement Units (PMU) bei 50 Hz zur Veranschaulichung der Winkeldivergenz.' }
    },
    phaseplane: {
      es: { title: 'Diagrama de Plano de Fase (GFM vs GFL)', desc: 'Comparación en el espacio de estados δ vs Δω de la convergencia de inversores Formadores de Red frente a Seguidores de Red.' },
      en: { title: 'Phase-Plane Diagram (GFM vs GFL)', desc: 'State-space comparison δ vs Δω of Grid-Forming vs Grid-Following inverters convergence.' },
      fr: { title: 'Diagramme de Plan de Phase (GFM vs GFL)', desc: 'Comparaison dans l\'espace d\'états δ vs Δω de la convergence des onduleurs Formateurs de Réseau vs Suiveurs de Réseau.' },
      de: { title: 'Phasenebenendiagramm (GFM vs GFL)', desc: 'Zustandsraumvergleich δ vs Δω der Konvergenz von netzbildenden vs. netzfolgenden Wechselrichtern.' }
    },
    ufls: {
      es: { title: 'Paradoja del UFLS', desc: 'Reconstrucción didáctico-forense de la actuación del deslastre automático de carga durante el 28-A: al cortar consumo inductivo, el esquema de subfrecuencia agravó la sobretensión residual.' },
      en: { title: 'UFLS Paradox', desc: 'Didactic-forensic reconstruction of the automatic load shedding performance during April 28: by cutting inductive consumption, the underfrequency scheme worsened residual overvoltage.' },
      fr: { title: 'Paradoxe du UFLS', desc: 'Reconstruction didactico-légale de la performance du délestage automatique le 28 avril.' },
      de: { title: 'UFLS-Paradoxon', desc: 'Didaktisch-forensische Rekonstruktion der Leistung des automatischen Lastabwurfs am 28. April.' }
    },
    interconnection: {
      es: { title: 'Dashboard de Interconexiones', desc: 'Análisis del estrangulamiento estructural de los intercambios internacionales.' },
      en: { title: 'Interconnection Dashboard', desc: 'Analysis of the structural bottleneck in international exchanges.' },
      fr: { title: 'Tableau de Bord des Interconnexions', desc: 'Analyse du goulot d\'étranglement structurel des échanges internationaux.' },
      de: { title: 'Verbindungs-Dashboard', desc: 'Analyse des strukturellen Engpasses im internationalen Austausch.' }
    },
    swing: {
      es: { title: 'Simulador Ecuación del Swing', desc: 'Simulador interactivo de la inercia (H), desequilibrio (ΔP) y Respuesta Rápida de Frecuencia (FFR) tras el incidente.' },
      en: { title: 'Swing Equation Simulator', desc: 'Interactive simulator of inertia (H), power mismatch (ΔP) and Fast Frequency Response (FFR).' },
      fr: { title: 'Simulateur Équation du Swing', desc: 'Simulateur interactif de l\'inertie (H), déséquilibre (ΔP) et Réponse Rapide de Fréquence (FFR).' },
      de: { title: 'Swing-Gleichung-Simulator', desc: 'Interaktiver Simulator für Trägheit (H), Ungleichgewicht (ΔP) und Schnelle Frequenzantwort (FFR).' }
    },
    matrix: {
      es: { title: 'Matriz de Costes de Inacción', desc: 'Análisis comparativo entre el OPEX tóxico diario por inacción y el CAPEX del retrofitting.' },
      en: { title: 'Cost of Inaction Matrix', desc: 'Comparative analysis between daily toxic OPEX from inaction and retrofitting CAPEX.' },
      fr: { title: 'Matrice des Coûts de l\'Inaction', desc: 'Analyse comparative entre l\'OPEX toxique quotidien dû à l\'inaction et le CAPEX du rétrofitting.' },
      de: { title: 'Kosten der Untätigkeit Matrix', desc: 'Vergleichende Analyse zwischen dem täglichen toxischen OPEX durch Untätigkeit und dem Retrofitting-CAPEX.' }
    },
    pvcurve: {
      es: { title: 'Curva Nariz P-V', desc: 'Mecanismo físico de inestabilidad y margen de cargabilidad al colapso de tensión.' },
      en: { title: 'P-V Nose Curve', desc: 'Physical instability mechanism and reactive power margin to voltage collapse.' },
      fr: { title: 'Courbe en Nez P-V', desc: 'Mécanisme physique d\'instabilité et marge de charge face à l\'effondrement de tension.' },
      de: { title: 'P-V-Nasenkurve', desc: 'Physischer Instabilitätsmechanismus und Belastbarkeitsgrenze bis zum Spannungskollaps.' }
    },
    ansi59: {
      es: { title: 'Bucle Cascada ANSI 59', desc: 'Simulación de retroalimentación positiva por desconexiones masivas de IBR.' },
      en: { title: 'ANSI 59 Cascade Loop', desc: 'Positive feedback simulation driven by massive IBR trips.' },
      fr: { title: 'Boucle en Cascade ANSI 59', desc: 'Simulation de rétroaction positive causée par des déconnexions massives d\'IBR.' },
      de: { title: 'ANSI-59-Kaskadenschleife', desc: 'Simulation der positiven Rückkopplung durch massenhafte IBR-Trennungen.' }
    },
    'sticky-collapse': {
      es: { title: 'Anatomía del Colapso — 30 Segundos', desc: 'Scrollytelling sincronizado: sismógrafo reactivo a cada fase de la cascada.' },
      en: { title: 'Collapse Anatomy — 30 Seconds', desc: 'Synchronized scrollytelling: sismograph reactive to each cascade phase.' },
      fr: { title: 'Anatomie de l\'Effondrement — 30 Secondes', desc: 'Scrollytelling synchronisé: sismographe réactif à chaque phase de la cascade.' },
      de: { title: 'Kollaps-Anatomie — 30 Sekunden', desc: 'Synchronisiertes Scrollytelling: Seismograph reaktiv auf jede Phase der Kaskade.' }
    },
    'comparador-28a': {
      es: { title: 'Sistema Ahora vs 28-A', desc: 'Comparador en tiempo real de las métricas de vulnerabilidad sistémica actuales frente al 28 de abril.' },
      en: { title: 'System Now vs April 28', desc: 'Real-time comparison of current systemic vulnerability metrics vs. April 28.' },
      fr: { title: 'Système Maintenant vs 28-A', desc: 'Comparateur en temps réel des métriques de vulnérabilité systémique actuelles vs. 28 avril.' },
      de: { title: 'System Jetzt vs 28-A', desc: 'Echtzeit-Vergleich aktueller systemischer Verwundbarkeitsmetriken vs. 28. April.' }
    },
    'radar-vulnerabilidad': {
      es: { title: 'Radar de Vulnerabilidad Sistémica', desc: 'Radar de 5 ejes: condición del colapso vs operación reforzada vs objetivo PNIEC 2030.' },
      en: { title: 'Systemic Vulnerability Radar', desc: '5-axis radar: collapse condition vs reinforced operation vs PNIEC 2030 target.' },
      fr: { title: 'Radar de Vulnérabilité Systémique', desc: 'Radar à 5 axes: condition d\'effondrement vs opération renforcée vs objectif PNIEC 2030.' },
      de: { title: 'Systemisches Verwundbarkeitsradar', desc: '5-Achsen-Radar: Kollaps-Zustand vs verstärkter Betrieb vs PNIEC-2030-Ziel.' }
    },
    'tap-lag-sequence': {
      es: { title: 'Mecanismo Tap-Lag — 5 Pasos', desc: 'Secuencia SVG animada del efecto Tap-Lag: cómo la inercia del OLTC ocultó la sobretensión al SCADA de REE.' },
      en: { title: 'Tap-Lag Mechanism — 5 Steps', desc: 'Animated SVG sequence of the Tap-Lag effect: how OLTC inertia hid the overvoltage from REE\'s SCADA.' },
      fr: { title: 'Mécanisme Tap-Lag — 5 Étapes', desc: 'Séquence SVG animée de l\'effet Tap-Lag: comment l\'inertie de l\'OLTC a masqué la surtension au SCADA de REE.' },
      de: { title: 'Tap-Lag-Mechanismus — 5 Schritte', desc: 'Animierte SVG-Sequenz des Tap-Lag-Effekts: wie die OLTC-Trägheit die Überspannung vor dem SCADA von REE verbarg.' }
    },
    // ── Visualizaciones forenses (migradas desde datos-tiempo-real) ──────────
        'mix-generacion': {
      es: { title: 'Mix de Generación en Tiempo Real', desc: 'Componente vivo/API: estructura instantánea de generación por tecnologías vs el perfil de colapso del 28-A.' },
      en: { title: 'Real-Time Generation Mix', desc: 'Live/API component: instant generation structure by technologies vs the 28-A collapse profile.' },
      fr: { title: 'Mix de Production en Temps Réel', desc: 'Composant en direct/API: structure de production instantanée par technologies vs le profil d effondrement du 28-A.' },
      de: { title: 'Echtzeit-Erzeugungsmix', desc: 'Live/API-Komponente: augenblickliche Erzeugungsstruktur nach Technologien im Vergleich zum Kollapsprofil vom 28-A.' }
    },
    'grid-unavailability': {
      es: { title: 'Indisponibilidad de la Red', desc: 'Afectación de la red de transporte de alta tensión (400 kV) durante la cascada de disparos por sobretensión del 28-A.' },
      en: { title: 'Grid Unavailability', desc: 'Impact on the high-voltage transmission grid (400 kV) during the overvoltage trip cascade of 28-A.' },
      fr: { title: 'Indisponibilité du Réseau', desc: 'Impact sur le réseau de transport haute tension (400 kV) pendant la cascade de déclenchements par surtension du 28-A.' },
      de: { title: 'Netzverfügbarkeit', desc: 'Auswirkungen auf das Hochspannungsübertragungsnetz (400 kV) während der Überspannungsauslöse-Kaskade des 28-A.' }
    },
    'emissions-renewables': {
      es: { title: 'Emisiones vs Renovables', desc: 'Correlación entre la intensidad de CO₂ del mix de generación y la tasa de penetración de energía renovable no síncrona en el sistema ibérico.' },
      en: { title: 'Emissions vs Renewables', desc: 'Correlation between CO₂ intensity of the generation mix and the non-synchronous renewable penetration rate in the Iberian system.' },
      fr: { title: 'Émissions vs Renouvelables', desc: 'Corrélation entre l\'intensité en CO₂ du mix de production et le taux de pénétration des énergies renouvelables non synchrones.' },
      de: { title: 'Emissionen vs Erneuerbare', desc: 'Korrelation zwischen CO₂-Intensität des Erzeugungsmixes und dem Anteil nicht-synchroner erneuerbarer Energien im iberischen System.' }
    },
    'sectorial-resilience': {
      es: { title: 'Resiliencia Sectorial', desc: 'Curvas de recuperación del consumo eléctrico por sector de actividad (industria de gran consumo y servicios) tras el restablecimiento del 28-A.' },
      en: { title: 'Sectorial Resilience', desc: 'Electricity consumption recovery curves by activity sector (large industry and services) after the 28-A restoration.' },
      fr: { title: 'Résilience Sectorielle', desc: 'Courbes de récupération de la consommation électrique par secteur d\'activité (grande industrie et services) après le rétablissement du 28-A.' },
      de: { title: 'Sektorielle Resilienz', desc: 'Erholungskurven des Stromverbrauchs nach Aktivitätssektoren (Großindustrie und Dienstleistungen) nach der Wiederherstellung des 28-A.' }
    }
  };
  return dictionary[id] ? (dictionary[id][lang] || dictionary[id]['es']) : dictionary['frequency']['es'];
};

const MixGeneracion = lazy(() => import(/* webpackChunkName: "chart-mix-generacion" */ './MixGeneracion'));
const SynchrophasorPlot = lazy(() => import(/* webpackChunkName: "chart-synchrophasor" */ './SynchrophasorPlot'));
const PhasePlanePlot = lazy(() => import(/* webpackChunkName: "chart-phaseplane" */ './PhasePlanePlot'));
const InterconnectionDashboard = lazy(() => import(/* webpackChunkName: "chart-interconnection" */ './InterconnectionDashboard'));
const SwingEquationSimulator = lazy(() => import(/* webpackChunkName: "chart-swing" */ './SwingEquationSimulator/SwingEquationSimulator'));
const StickyCollapse = lazy(() => import(/* webpackChunkName: "chart-sticky-collapse" */ './StickyCollapse'));
const UFLSVisualizer = lazy(() => import(/* webpackChunkName: "chart-ufls" */ './UFLSVisualizer/UFLSVisualizer'));

const Comparador28A = lazy(() => import(/* webpackChunkName: "chart-comparador28a" */ './Comparador28A'));
const RadarVulnerabilidad = lazy(() => import(/* webpackChunkName: "chart-radar-vulnerabilidad" */ './RadarVulnerabilidad'));
const TapLagSequence = lazy(() => import(/* webpackChunkName: "chart-tap-lag-sequence" */ './TapLagSequence'));

export const graphicsData = [
  { id: 'frequency', icon: '📉', component: FrequencyChart , tema: 'T2' },
  { id: 'map', icon: '🗺️', component: AnimatedMap , tema: 'T3' },
  { id: 'timeline', icon: '⏱️', component: VerticalTimeline , tema: 'T3' },
  { id: 'streamgraph', icon: '🌍', component: EnergyTransitionStreamgraph , tema: 'T1' },
  { id: 'waterfall', icon: '💶', component: FinancialWaterfallChart , tema: 'T7' },
  { id: 'topology', icon: '🕸️', component: IberianGridTopology , tema: 'T4' },
  { id: 'sismograph', icon: '📊', component: CollapseSismograph , tema: 'T2' },
  { id: 'phasor', icon: '🧭', component: SynchrophasorPlot , tema: 'T2' },
  { id: 'phaseplane', icon: '🌀', component: PhasePlanePlot , tema: 'T9' },
  { id: 'interconnection', icon: '🔌', component: InterconnectionDashboard , tema: 'T4' },
  { id: 'swing', icon: '⚖️', component: SwingEquationSimulator , tema: 'T9' },
  { id: 'matrix', icon: '💸', component: ThermalAdjustmentCostMatrix , tema: 'T5' },  // costes de ajuste → T5 mercado/costes
  { id: 'pvcurve', icon: '📈', component: PVCurveSimulator , tema: 'T9' },
  { id: 'ansi59', icon: '⚡', component: ANSI59Cascade , tema: 'T3' },
  { id: 'sticky-collapse', icon: '🎬', component: StickyCollapse , tema: 'T3' },
  { id: 'ufls', icon: '🎛️', component: UFLSVisualizer , tema: 'T3', nature: 'didactic' },

  { id: 'comparador-28a', icon: '📡', component: Comparador28A , tema: 'T9' },
  { id: 'radar-vulnerabilidad', icon: '🕷️', component: RadarVulnerabilidad , tema: 'T9' },
  { id: 'tap-lag-sequence', icon: '⚙️', component: TapLagSequence , tema: 'T3' },
  // ── Visualizaciones forenses migradas desde datos-tiempo-real ───────────────
  { id: 'mix-generacion', icon: '🔋', component: MixGeneracion, tema: 'T1' },
  { id: 'grid-unavailability', icon: '⛔', component: GridUnavailabilityGauge , tema: 'T3' },  // cascada/protecciones/desconexiones
  { id: 'emissions-renewables', icon: '🌿', component: EmissionsVsRenewablesChart , tema: 'T1' },  // demanda/generación/balance
  { id: 'sectorial-resilience', icon: '🏭', component: SectorialResilienceChart , tema: 'T7' },  // impacto/resiliencia
];

export default function InteractiveGraphicsGallery({ propLang }) {
  const lang = useDocLang();
  const { i18n } = useDocusaurusContext();
  const locale = propLang || lang || i18n.currentLocale;
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
          <p className={styles.graphicHeaderDesc}>
            <span className={styles.graphicHeaderBrace}>&#123;</span> {activeGraphicContent.desc} <span className={styles.graphicHeaderBrace}>&#125;</span>
          </p>
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
                <div className={styles.galleryLoading}>
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

