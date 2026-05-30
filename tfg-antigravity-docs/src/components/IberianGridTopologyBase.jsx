import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const getGridData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return {
    nodes: [
      { id: 'GRN', name: t('Caparacena (Fallo Inicial)', 'Caparacena (Initial Failure)', 'Caparacena (Falha Inicial)', 'Caparacena (Défaillance Initiale)', 'Caparacena (Guasto Iniziale)', 'Caparacena (Anfänglicher Fehler)'), group: 1, val: 25, activeColor: '#ef4444', defaultColor: '#10b981', activationTime: 2, fx: 10, fy: 100 },
      { id: 'SEV', name: t('Alcores (Efecto Dominó Sur)', 'Alcores (South Domino Effect)', 'Alcores (Efeito Dominó Sul)', 'Alcores (Effet Domino Sud)', 'Alcores (Effetto Domino Sud)', 'Alcores (Südlicher Dominoeffekt)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4, fx: -40, fy: 80 },
      { id: 'BAD', name: t('Guillena (Colapso Tensión)', 'Guillena (Voltage Collapse)', 'Guillena (Colapso de Tensão)', 'Guillena (Effondrement de Tension)', 'Guillena (Collasso di Tensione)', 'Guillena (Spannungskollaps)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4, fx: -60, fy: 40 },
      { id: 'MAD', name: t('Madrid Morata (Contención)', 'Madrid Morata (Containment)', 'Madrid Morata (Contenção)', 'Madrid Morata (Confinement)', 'Madrid Morata (Contenimento)', 'Madrid Morata (Eindämmung)'), group: 2, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 0, fy: 0 },
      { id: 'ALM', name: t('C.N. Almaraz (Inercia Base)', 'C.N. Almaraz (Base Inertia)', 'C.N. Almaraz (Inércia Base)', 'C.N. Almaraz (Inertie de Base)', 'C.N. Almaraz (Inerzia di Base)', 'C.N. Almaraz (Basisträgheit)'), group: 2, val: 25, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: -50, fy: 0 },
      { id: 'ZAR', name: t('Aragón (Puente Norte)', 'Aragon (North Bridge)', 'Aragão (Ponte Norte)', 'Aragon (Pont Nord)', 'Aragona (Ponte Nord)', 'Aragonien (Nordbrücke)'), group: 3, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 50, fy: -50 },
      { id: 'BAR', name: t('Rubí (Resistencia Este)', 'Rubí (East Resistance)', 'Rubí (Resistência Leste)', 'Rubí (Résistance Est)', 'Rubí (Resistenza Est)', 'Rubí (Ost-Widerstand)'), group: 3, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 120, fy: -60 },
      { id: 'LIS', name: t('Lisboa (Desequilibrio)', 'Lisbon (Imbalance)', 'Lisboa (Desequilíbrio)', 'Lisbonne (Déséquilibre)', 'Lisbona (Squilibrio)', 'Lissabon (Ungleichgewicht)'), group: 4, val: 20, activeColor: '#f59e0b', defaultColor: '#10b981', activationTime: 6, fx: -120, fy: 30 },
      { id: 'POR', name: t('Porto (Compensación)', 'Porto (Compensation)', 'Porto (Compensação)', 'Porto (Compensation)', 'Porto (Compensazione)', 'Porto (Kompensation)'), group: 4, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: -110, fy: -30 },
      { id: 'FR', name: t('Francia (Rescate Externo)', 'France (External Rescue)', 'França (Resgate Externo)', 'France (Sauvetage Externe)', 'Francia (Salvataggio Esterno)', 'Frankreich (Externe Rettung)'), group: 5, val: 30, activeColor: '#3b82f6', defaultColor: '#3b82f6', activationTime: 10, fx: 100, fy: -120 }
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
    { t: 0, msg: t("12:32:57 CEST — Sistema ibérico en estado operativo. Alta penetración renovable (≈82%). H_eq ≈ 2,4 s.", "12:32:57 CEST — Iberian system in operational state. High renewable penetration (≈82%). H_eq ≈ 2.4 s.", "12:32:57 CEST — Sistema ibérico em estado operacional. Alta penetração renovável (≈82%). H_eq ≈ 2,4 s.", "12:32:57 CEST — Système ibérique en état opérationnel. Forte pénétration renouvelable (≈82%). H_eq ≈ 2,4 s.", "12:32:57 CEST — Sistema iberico in stato operativo. Alta penetrazione rinnovabile (≈82%). H_eq ≈ 2,4 s.", "12:32:57 CEST — Iberisches System in Betriebszustand. Hoher Anteil erneuerbarer Energien (≈82%). H_eq ≈ 2,4 s.") },
    { t: 2, msg: t("12:32:57 CEST — DISPARO RAÍZ: Transformador 400/220 kV en Granada (Caparacena). Pérdida de −355 MW y −165 MVAr de absorción reactiva. (ENTSO-E Factual, p.28)", "12:32:57 CEST — ROOT TRIP: 400/220 kV transformer in Granada (Caparacena). Loss of −355 MW and −165 MVAr reactive absorption. (ENTSO-E Factual, p.28)", "12:32:57 CEST — DISPARO RAIZ: Transformador 400/220 kV em Granada (Caparacena). Perda de −355 MW e −165 MVAr de absorção reativa. (ENTSO-E Factual, p.28)", "12:32:57 CEST — DÉCLENCHEMENT RACINE : Transformateur 400/220 kV à Grenade (Caparacena). Perte de −355 MW et −165 MVAr d'absorption réactive. (ENTSO-E Factual, p.28)", "12:32:57 CEST — SCATTO RADICE: Trasformatore 400/220 kV a Granada (Caparacena). Perdita di −355 MW e −165 MVAr di assorbimento reattivo. (ENTSO-E Factual, p.28)", "12:32:57 CEST — WURZEL-AUSLÖSUNG: 400/220-kV-Transformator in Granada (Caparacena). Verlust von −355 MW und −165 MVAr Blindleistungsaufnahme. (ENTSO-E Factual, S.28)") },
    { t: 4, msg: t("12:33:00–10 CEST — La tensión supera 440 kV en barras colectoras. Protecciones ANSI 59 disparan plantas FV en cascada en el sur.", "12:33:00–10 CEST — Voltage exceeds 440 kV at collector busbars. ANSI 59 protections trip PV plants in cascade across the south.", "12:33:00–10 CEST — A tensão supera 440 kV nas barras coletoras. Proteções ANSI 59 disparam plantas FV em cascata no sul.", "12:33:00–10 CEST — La tension dépasse 440 kV sur les jeux de barres collecteurs. Les protections ANSI 59 déclenchent les centrales PV en cascade dans le sud.", "12:33:00–10 CEST — La tensione supera 440 kV sulle barre collettori. Le protezioni ANSI 59 scattano sugli impianti FV a cascata nel sud.", "12:33:00–10 CEST — Spannung überschreitet 440 kV an Sammelschienen. ANSI-59-Schutz löst PV-Anlagen kaskadenartig im Süden aus.") },
    { t: 6, msg: t("12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). La isla ibérica se debilita.", "12:33:10 CEST — Inter-area oscillations reach Portugal (0.21 Hz). The Iberian island weakens.", "12:33:10 CEST — Oscilações inter-área atingem Portugal (0,21 Hz). A ilha ibérica enfraquece.", "12:33:10 CEST — Les oscillations inter-zones atteignent le Portugal (0,21 Hz). L'île ibérique s'affaiblit.", "12:33:10 CEST — Le oscillazioni inter-area raggiungono il Portogallo (0,21 Hz). L'isola iberica si indebolisce.", "12:33:10 CEST — Inter-Area-Schwingungen erreichen Portugal (0,21 Hz). Die iberische Insel schwächt sich ab.") },
    { t: 8, msg: t("12:33:18 CEST — Frecuencia cae a 48,46 Hz. El HVDC INELFE mantiene 1.000 MW de exportación a Francia (PMODE1).", "12:33:18 CEST — Frequency drops to 48.46 Hz. HVDC INELFE maintains 1,000 MW of export to France (PMODE1).", "12:33:18 CEST — Frequência cai para 48,46 Hz. O HVDC INELFE mantém 1.000 MW de exportação para a França (PMODE1).", "12:33:18 CEST — La fréquence chute à 48,46 Hz. L'HVDC INELFE maintient 1 000 MW d'exportation vers la France (PMODE1).", "12:33:18 CEST — La frequenza scende a 48,46 Hz. L'HVDC INELFE mantiene 1.000 MW di esportazione verso la Francia (PMODE1).", "12:33:18 CEST — Frequenz fällt auf 48,46 Hz. HVDC INELFE hält 1.000 MW Export nach Frankreich aufrecht (PMODE1).") },
    { t: 10, msg: t("12:33:21 CEST — Pérdida de sincronismo. Apertura de enlaces AC transpirenaicos (ANSI 78 out-of-step).", "12:33:21 CEST — Loss of synchronism. Opening of trans-Pyrenean AC links (ANSI 78 out-of-step).", "12:33:21 CEST — Perda de sincronismo. Abertura dos elos AC transpirenáicos (ANSI 78 out-of-step).", "12:33:21 CEST — Perte de synchronisme. Ouverture des liaisons CA transpyrénéennes (ANSI 78 out-of-step).", "12:33:21 CEST — Perdita di sincronismo. Apertura dei collegamenti AC transpirenáici (ANSI 78 out-of-step).", "12:33:21 CEST — Synchronisationsverlust. Öffnung der transpyrenäischen AC-Verbindungen (ANSI 78 out-of-step).") },
    { t: 12, msg: t("12:33:24 CEST — Cero de tensión sistémico. 15 GW de generación perdida en 30 segundos.", "12:33:24 CEST — Systemic voltage zero. 15 GW of generation lost in 30 seconds.", "12:33:24 CEST — Zero de tensão sistémico. 15 GW de geração perdida em 30 segundos.", "12:33:24 CEST — Zéro de tension systémique. 15 GW de production perdus en 30 secondes.", "12:33:24 CEST — Zero di tensione sistemico. 15 GW di generazione persi in 30 secondi.", "12:33:24 CEST — Systemischer Spannungsnullpunkt. 15 GW Erzeugung in 30 Sekunden verloren.") }
  ];
};

function TopologyMapContent({ lang = 'es' }) {
  const GRID_DATA = useMemo(() => getGridData(lang), [lang]);
  const EVENT_LOG = useMemo(() => getEventLog(lang), [lang]);
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Topological Simulator', play: 'Play', pause: 'Pause', replay: 'Replay', desc: 'This force-directed graph visualises the topological dependencies of the Iberian transmission grid. Hit <strong>Play</strong> to see the causal propagation of the collapse according to impedance flow.', zoomNote: '💡 Scroll mouse wheel to zoom in/out', loading: 'Loading Graph...' };
      case 'pt': return { title: 'Simulador Topológico', play: 'Iniciar', pause: 'Pausar', replay: 'Repetir', desc: 'Este grafo de força dirigida visualiza as dependências topológicas da rede de transmissão ibérica. Clique em <strong>Iniciar</strong> para ver a propagação causal do colapso segundo o fluxo de impedâncias.', zoomNote: '💡 Deslize a roda do rato para ampliar/reduzir', loading: 'Carregando Grafo...' };
      case 'fr': return { title: 'Simulateur Topologique', play: 'Lecture', pause: 'Pause', replay: 'Rejouer', desc: 'Ce graphe de force dirigée visualise les dépendances topologiques du réseau de transport ibérique. Appuyez sur <strong>Lecture</strong> pour voir la propagation causale de l\'effondrement selon le flux d\'impédance.', zoomNote: '💡 Utilisez la molette de la souris pour zoomer', loading: 'Chargement du Graphe...' };
      case 'it': return { title: 'Simulatore Topologico', play: 'Play', pause: 'Pausa', replay: 'Riproduci', desc: 'Questo grafo a forza diretta visualizza le dipendenze topologiche della rete di trasmissione iberica. Premi <strong>Play</strong> per vedere la propagazione causale del collasso secondo il flusso di impedenza.', zoomNote: '💡 Usa la rotellina del mouse per ingrandire/ridurre', loading: 'Caricamento Grafo...' };
      case 'de': return { title: 'Topologischer Simulator', play: 'Abspielen', pause: 'Pause', replay: 'Wiederholen', desc: 'Dieser kraftgesteuerte Graph visualisiert die topologischen Abhängigkeiten des iberischen Übertragungsnetzes. Drücken Sie <strong>Abspielen</strong>, um die kausale Ausbreitung des Kollapses gemäß dem Impedanzfluss zu sehen.', zoomNote: '💡 Mausrad drehen, um zu zoomen', loading: 'Graph wird geladen...' };
      default: return { title: 'Simulador Topológico', play: 'Play', pause: 'Pausa', replay: 'Replay', desc: 'Este grafo de fuerza dirigida visualiza las dependencias topológicas de la red de transporte ibérica. Dale al <strong>Play</strong> para ver la propagación causal del colapso según el flujo de impedancias.', zoomNote: '💡 Desliza la rueda del ratón para ampliar o desampliar el mapa', loading: 'Cargando Grafo...' };
    }
  };
  const strings = getStrings(lang);

  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const fgRef = useRef();
  
  // Dynamic import para evitar problemas de SSR
  useEffect(() => {
    import(/* webpackChunkName: "force-graph-topology" */ 'react-force-graph-2d').then(module => {
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

  if (!ForceGraph2D) return <div style={{height: 680}}>{strings.loading}</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '680px', backgroundColor: '#0d1117', borderRadius: '12px', overflow: 'hidden', border: '1px solid #30363d' }}>
      <ForceGraph2D
        ref={fgRef}
        height={680}
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
        cooldownTicks={0}
        onEngineStop={() => {}}
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
        
        <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#9ca3af' }} dangerouslySetInnerHTML={{__html: strings.desc}} />
        <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#60a5fa', fontStyle: 'italic' }}>{strings.zoomNote}</p>
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
