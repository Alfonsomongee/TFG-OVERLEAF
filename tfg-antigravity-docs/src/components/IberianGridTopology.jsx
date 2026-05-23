import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const getGridData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return {
    nodes: [
      { id: 'GRN', name: t('Caparacena (Fallo Inicial)', 'Caparacena (Initial Failure)', 'Caparacena (Falha Inicial)', 'Caparacena (Défaillance Initiale)', 'Caparacena (Guasto Iniziale)', 'Caparacena (Anfänglicher Fehler)'), group: 1, val: 25, activeColor: '#ef4444', defaultColor: '#10b981', activationTime: 2 },
      { id: 'SEV', name: t('Alcores (Efecto Dominó Sur)', 'Alcores (South Domino Effect)', 'Alcores (Efeito Dominó Sul)', 'Alcores (Effet Domino Sud)', 'Alcores (Effetto Domino Sud)', 'Alcores (Südlicher Dominoeffekt)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4 },
      { id: 'BAD', name: t('Guillena (Colapso Tensión)', 'Guillena (Voltage Collapse)', 'Guillena (Colapso de Tensão)', 'Guillena (Effondrement de Tension)', 'Guillena (Collasso di Tensione)', 'Guillena (Spannungskollaps)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4 },
      { id: 'MAD', name: t('Madrid Morata (Contención)', 'Madrid Morata (Containment)', 'Madrid Morata (Contenção)', 'Madrid Morata (Confinement)', 'Madrid Morata (Contenimento)', 'Madrid Morata (Eindämmung)'), group: 2, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0 },
      { id: 'ALM', name: t('C.N. Almaraz (Inercia Base)', 'C.N. Almaraz (Base Inertia)', 'C.N. Almaraz (Inércia Base)', 'C.N. Almaraz (Inertie de Base)', 'C.N. Almaraz (Inerzia di Base)', 'C.N. Almaraz (Basisträgheit)'), group: 2, val: 25, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0 },
      { id: 'ZAR', name: t('Aragón (Puente Norte)', 'Aragon (North Bridge)', 'Aragão (Ponte Norte)', 'Aragon (Pont Nord)', 'Aragona (Ponte Nord)', 'Aragonien (Nordbrücke)'), group: 3, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0 },
      { id: 'BAR', name: t('Rubí (Resistencia Este)', 'Rubí (East Resistance)', 'Rubí (Resistência Leste)', 'Rubí (Résistance Est)', 'Rubí (Resistenza Est)', 'Rubí (Ost-Widerstand)'), group: 3, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0 },
      { id: 'LIS', name: t('Lisboa (Desequilibrio)', 'Lisbon (Imbalance)', 'Lisboa (Desequilíbrio)', 'Lisbonne (Déséquilibre)', 'Lisbona (Squilibrio)', 'Lissabon (Ungleichgewicht)'), group: 4, val: 20, activeColor: '#f59e0b', defaultColor: '#10b981', activationTime: 6 },
      { id: 'POR', name: t('Porto (Compensación)', 'Porto (Compensation)', 'Porto (Compensação)', 'Porto (Compensation)', 'Porto (Compensazione)', 'Porto (Kompensation)'), group: 4, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0 },
      { id: 'FR', name: t('Francia (Rescate Externo)', 'France (External Rescue)', 'França (Resgate Externo)', 'France (Sauvetage Externe)', 'Francia (Salvataggio Esterno)', 'Frankreich (Externe Rettung)'), group: 5, val: 30, activeColor: '#3b82f6', defaultColor: '#3b82f6', activationTime: 10 }
    ],
    links: [
      { source: 'GRN', target: 'SEV', isCritical: true, flow: t('Sobrecarga masiva', 'Massive overload', 'Sobrecarga massiva', 'Surcharge massive', 'Sovraccarico massiccio', 'Massive Überlastung'), activationTime: 2 },
      { source: 'SEV', target: 'BAD', isCritical: true, flow: t('Sobrecarga masiva', 'Massive overload', 'Sobrecarga massiva', 'Surcharge massive', 'Sovraccarico massiccio', 'Massive Überlastung'), activationTime: 4 },
      { source: 'BAD', target: 'LIS', isCritical: true, flow: t('Oscilaciones Inter-área (0.8Hz)', 'Inter-area oscillations (0.8Hz)', 'Oscilações interárea (0.8Hz)', 'Oscillations inter-zones (0.8Hz)', 'Oscillazioni inter-area (0.8Hz)', 'Inter-Area-Schwingungen (0.8Hz)'), activationTime: 6 },
      { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0 },
      { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0 },
      { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0 },
      { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0 },
      { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0 },
      { source: 'ZAR', target: 'FR', isCritical: true, flow: t('Importación de emergencia (Subfrecuencia)', 'Emergency import (Underfrequency)', 'Importação de emergência (Subfrequência)', 'Importation d\'urgence (Sous-fréquence)', 'Importazione di emergenza (Sottofrequenza)', 'Notimport (Unterfrequenz)'), activationTime: 10 },
      { source: 'BAR', target: 'FR', isCritical: true, flow: t('Importación de emergencia (Subfrecuencia)', 'Emergency import (Underfrequency)', 'Importação de emergência (Subfrequência)', 'Importation d\'urgence (Sous-fréquence)', 'Importazione di emergenza (Sottofrequenza)', 'Notimport (Unterfrequenz)'), activationTime: 10 }
    ]
  };
};

const getEventLog = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { t: 0, msg: t("16:31:50 - Sistema Ibérico en estado estable. Operación nominal.", "16:31:50 - Iberian System in stable state. Nominal operation.", "16:31:50 - Sistema Ibérico em estado estável. Operação nominal.", "16:31:50 - Système ibérique à l'état stable. Fonctionnement nominal.", "16:31:50 - Sistema iberico in stato stabile. Funzionamento nominale.", "16:31:50 - Iberisches System in stabilem Zustand. Nennbetrieb.") },
    { t: 2, msg: t("16:32:00 - ¡DETONANTE! Cortocircuito doble en Caparacena (Granada). Pérdida brutal de reactiva.", "16:32:00 - TRIGGER! Double short circuit in Caparacena (Granada). Brutal loss of reactive power.", "16:32:00 - GATILHO! Curto-circuito duplo em Caparacena (Granada). Perda brutal de potência reativa.", "16:32:00 - DÉCLENCHEUR ! Double court-circuit à Caparacena (Grenade). Perte brutale de puissance réactive.", "16:32:00 - INNESCO! Doppio cortocircuito a Caparacena (Granada). Perdita brutale di potenza reattiva.", "16:32:00 - AUSLÖSER! Doppelter Kurzschluss in Caparacena (Granada). Brutaler Verlust an Blindleistung.") },
    { t: 4, msg: t("16:32:04 - Cae la tensión en el sur. El colapso se transfiere hacia Sevilla y Badajoz.", "16:32:04 - Voltage drops in the south. Collapse transfers towards Seville and Badajoz.", "16:32:04 - A tensão cai no sul. O colapso transfere-se para Sevilha e Badajoz.", "16:32:04 - La tension chute au sud. L'effondrement se transfère vers Séville et Badajoz.", "16:32:04 - La tensione scende nel sud. Il collasso si trasferisce verso Siviglia e Badajoz.", "16:32:04 - Die Spannung fällt im Süden. Der Kollaps verlagert sich nach Sevilla und Badajoz.") },
    { t: 6, msg: t("16:32:10 - ¡ALERTA INTER-ÁREA! Oscilaciones masivas de 0.8 Hz golpean la red de Portugal.", "16:32:10 - INTER-AREA ALERT! Massive 0.8 Hz oscillations hit the Portuguese grid.", "16:32:10 - ALERTA INTERÁREA! Oscilações massivas de 0.8 Hz atingem a rede de Portugal.", "16:32:10 - ALERTE INTER-ZONES ! Des oscillations massives de 0.8 Hz frappent le réseau du Portugal.", "16:32:10 - ALLARME INTER-AREA! Oscillazioni massicce di 0.8 Hz colpiscono la rete del Portogallo.", "16:32:10 - INTER-AREA-ALARM! Massive 0,8-Hz-Schwingungen treffen das portugiesische Netz.") },
    { t: 8, msg: t("16:32:15 - El centro (Madrid/Almaraz) absorbe el impacto gracias a la inercia de los alternadores.", "16:32:15 - The center (Madrid/Almaraz) absorbs the impact thanks to alternator inertia.", "16:32:15 - O centro (Madrid/Almaraz) absorve o impacto graças à inércia dos alternadores.", "16:32:15 - Le centre (Madrid/Almaraz) absorbe l'impact grâce à l'inertie des alternateurs.", "16:32:15 - Il centro (Madrid/Almaraz) assorbe l'impatto grazie all'inerzia degli alternatori.", "16:32:15 - Das Zentrum (Madrid/Almaraz) absorbiert den Aufprall dank der Trägheit der Generatoren.") },
    { t: 10, msg: t("16:32:20 - Desconexión inminente. Entra energía de rescate masiva desde Francia por los Pirineos.", "16:32:20 - Imminent disconnection. Massive rescue power enters from France via the Pyrenees.", "16:32:20 - Desconexão iminente. Entra energia de resgate massiva da França pelos Pirenéus.", "16:32:20 - Déconnexion imminente. De l'énergie de secours massive entre depuis la France par les Pyrénées.", "16:32:20 - Disconnessione imminente. Entra massiccia energia di soccorso dalla Francia attraverso i Pirenei.", "16:32:20 - Bevorstehende Trennung. Massive Rettungsenergie aus Frankreich über die Pyrenäen.") },
    { t: 12, msg: t("16:32:23 - Colapso contenido. El sistema sobrevive pero queda dividido y frágil.", "16:32:23 - Collapse contained. The system survives but remains divided and fragile.", "16:32:23 - Colapso contido. O sistema sobrevive, mas fica dividido e frágil.", "16:32:23 - Effondrement contenu. Le système survit mais reste divisé et fragile.", "16:32:23 - Collasso contenuto. Il sistema sopravvive ma rimane diviso e fragile.", "16:32:23 - Kollaps eingedämmst. Das System überlebt, bleibt aber geteilt und fragil.") }
  ];
};

function TopologyMapContent({ lang = 'es' }) {
  const GRID_DATA = useMemo(() => getGridData(lang), [lang]);
  const EVENT_LOG = useMemo(() => getEventLog(lang), [lang]);
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Topological Simulator', play: 'Play', pause: 'Pause', replay: 'Replay', desc: 'This graph models the grid using GNN. Hit <strong>Play</strong> to see the causal propagation of the collapse according to impedance flow.', loading: 'Loading Graph...' };
      case 'pt': return { title: 'Simulador Topológico', play: 'Iniciar', pause: 'Pausar', replay: 'Repetir', desc: 'Este grafo modela a rede usando GNN. Clique em <strong>Iniciar</strong> para ver a propagação causal do colapso segundo o fluxo de impedâncias.', loading: 'Carregando Grafo...' };
      case 'fr': return { title: 'Simulateur Topologique', play: 'Lecture', pause: 'Pause', replay: 'Rejouer', desc: 'Ce graphe modélise le réseau via GNN. Appuyez sur <strong>Lecture</strong> pour voir la propagation causale de l\'effondrement selon le flux d\'impédance.', loading: 'Chargement du Graphe...' };
      case 'it': return { title: 'Simulatore Topologico', play: 'Play', pause: 'Pausa', replay: 'Riproduci', desc: 'Questo grafo modella la rete tramite GNN. Premi <strong>Play</strong> per vedere la propagazione causale del collasso secondo il flusso di impedenza.', loading: 'Caricamento Grafo...' };
      case 'de': return { title: 'Topologischer Simulator', play: 'Abspielen', pause: 'Pause', replay: 'Wiederholen', desc: 'Dieser Graph modelliert das Netz mittels GNN. Drücken Sie <strong>Abspielen</strong>, um die kausale Ausbreitung des Kollapses gemäß dem Impedanzfluss zu sehen.', loading: 'Graph wird geladen...' };
      default: return { title: 'Simulador Topológico', play: 'Play', pause: 'Pausa', replay: 'Replay', desc: 'Este grafo modela la red mediante GNN. Dale al <strong>Play</strong> para ver la propagación causal del colapso según el flujo de impedancias.', loading: 'Cargando Grafo...' };
    }
  };
  const strings = getStrings(lang);

  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const fgRef = useRef();
  
  // Dynamic import para evitar problemas de SSR
  useEffect(() => {
    import('react-force-graph-2d').then(module => {
      setForceGraph2D(() => module.default);
    });
  }, []);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && simTime < 14) {
      interval = setInterval(() => {
        setSimTime(t => t + 1);
      }, 1000);
    } else if (simTime >= 14) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simTime]);

  // Filtramos los eventos del log
  const visibleLogs = EVENT_LOG.filter(log => log.t <= simTime).reverse();

  // Pre-calcular vecinos para hover rápido
  const neighbors = useRef(new Map());
  useEffect(() => {
    GRID_DATA.links.forEach(link => {
      const a = typeof link.source === 'object' ? link.source.id : link.source;
      const b = typeof link.target === 'object' ? link.target.id : link.target;
      if (!neighbors.current.has(a)) neighbors.current.set(a, []);
      if (!neighbors.current.has(b)) neighbors.current.set(b, []);
      neighbors.current.get(a).push(b);
      neighbors.current.get(b).push(a);
    });
  }, []);

  const handleNodeHover = useCallback(node => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    if (node) {
      const newHighlightNodes = new Set([node.id]);
      if (neighbors.current.has(node.id)) {
        neighbors.current.get(node.id).forEach(neighbor => newHighlightNodes.add(neighbor));
      }
      
      const newHighlightLinks = new Set();
      GRID_DATA.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(link);
        }
      });
      
      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    }
    setHoverNode(node || null);
  }, []);

  if (!ForceGraph2D) return <div style={{height: 500}}>{strings.loading}</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#0d1117', borderRadius: '12px', overflow: 'hidden', border: '1px solid #30363d' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={GRID_DATA}
        nodeColor={node => highlightNodes.size === 0 || highlightNodes.has(node.id) ? node.color : 'rgba(255,255,255,0.1)'}
        nodeRelSize={6}
        nodeVal={node => node.val}
        linkColor={link => {
          if (highlightLinks.has(link)) return '#fff';
          if (link.isCritical && simTime >= link.activationTime) return '#ef4444';
          return 'rgba(255,255,255,0.2)';
        }}
        linkWidth={link => highlightLinks.has(link) ? 3 : (link.isCritical && simTime >= link.activationTime ? 2 : 1)}
        linkDirectionalParticles={link => (link.isCritical && simTime >= link.activationTime) ? 4 : 0}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        onNodeHover={handleNodeHover}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const currentNodeColor = (simTime >= node.activationTime) ? node.activeColor : node.defaultColor;

          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - 10, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? currentNodeColor : 'rgba(255,255,255,0.2)';
          ctx.fillText(label, node.x, node.y - 10);

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? currentNodeColor : 'rgba(255,255,255,0.1)';
          ctx.fill();
        }}
        nodeCanvasObjectMode={() => 'replace'}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current.zoomToFit(400, 50)}
      />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #30363d',
        width: '320px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '400px'
      }}>
        <div style={{ pointerEvents: 'auto', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, color: '#60a5fa' }}>{strings.title}</h4>
          <div>
            <button 
              onClick={() => {
                if (simTime >= 14) setSimTime(0);
                setIsPlaying(!isPlaying);
              }}
              style={{
                background: 'var(--ifm-color-primary)',
                color: 'white',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {simTime >= 14 ? strings.replay : (isPlaying ? strings.pause : strings.play)}
            </button>
          </div>
        </div>
        
        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#9ca3af' }} dangerouslySetInnerHTML={{__html: strings.desc}} />

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleLogs.map((log, idx) => (
            <div key={idx} style={{
              fontSize: '0.85rem',
              padding: '8px',
              backgroundColor: idx === 0 ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
              borderLeft: idx === 0 ? '3px solid #60a5fa' : '3px solid transparent',
              color: idx === 0 ? '#fff' : '#9ca3af',
              transition: 'all 0.3s ease'
            }}>
              {log.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IberianGridTopology({ lang = 'es' }) {
  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading grid topology...';
      case 'pt': return 'Carregando topologia de rede...';
      case 'fr': return 'Chargement de la topologie du réseau...';
      case 'it': return 'Caricamento della topologia di rete...';
      case 'de': return 'Netztopologie wird geladen...';
      default: return 'Cargando topología de red...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(lang)}</div>}>
      {() => <TopologyMapContent lang={lang} />}
    </BrowserOnly>
  );
}
