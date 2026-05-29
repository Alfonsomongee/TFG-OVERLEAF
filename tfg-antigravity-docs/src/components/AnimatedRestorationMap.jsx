import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const getGridData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return {
    nodes: [
      { id: 'FRA', name: t('Francia (Top-Down)', 'France (Top-Down)', 'França', 'France', 'Francia', 'Frankreich'), group: 1, val: 30, fx: 100, fy: -100 },
      { id: 'CAT', name: t('Isla Cataluña', 'Catalonia Island', 'Ilha Catalunha', 'Île Catalogne', 'Isola Catalogna', 'Insel Katalonien'), group: 1, val: 20, fx: 80, fy: -50 },
      { id: 'ARA', name: t('Isla Aragón', 'Aragon Island', 'Ilha Aragão', 'Île Aragon', 'Isola Aragona', 'Insel Aragonien'), group: 2, val: 15, fx: 40, fy: -40 },
      { id: 'CEN', name: t('Isla Central (Madrid)', 'Central Island (Madrid)', 'Ilha Central', 'Île Centrale', 'Isola Centrale', 'Zentralinsel'), group: 2, val: 25, fx: 0, fy: 0 },
      { id: 'POR', name: t('Portugal', 'Portugal', 'Portugal', 'Portugal', 'Portogallo', 'Portugal'), group: 3, val: 25, fx: -100, fy: -10 },
      { id: 'GAL', name: t('Isla Galicia/León', 'Galicia/Leon Island', 'Ilha Galiza/Leão', 'Île Galice/León', 'Isola Galizia/León', 'Insel Galicien/León'), group: 3, val: 15, fx: -80, fy: -60 },
      { id: 'SUR', name: t('Isla Andalucía (Bottom-Up)', 'Andalusia Island (Bottom-Up)', 'Ilha Andaluzia', 'Île Andalousie', 'Isola Andalusia', 'Insel Andalusien'), group: 4, val: 20, fx: -30, fy: 80 },
      { id: 'LEV', name: t('Isla Levante', 'Levante Island', 'Ilha Levante', 'Île Levante', 'Isola Levante', 'Insel Levante'), group: 5, val: 15, fx: 60, fy: 40 }
    ],
    links: [
      // Top-Down from France
      { source: 'FRA', target: 'CAT', activationTime: 2, isTopDown: true },
      { source: 'CAT', target: 'ARA', activationTime: 4, isTopDown: true },
      { source: 'ARA', target: 'CEN', activationTime: 6, isTopDown: true },
      // Top-Down from Portugal
      { source: 'POR', target: 'GAL', activationTime: 3, isTopDown: true },
      { source: 'POR', target: 'CEN', activationTime: 7, isTopDown: true },
      // Bottom-Up from South (Hydro/SynCons)
      { source: 'SUR', target: 'LEV', activationTime: 5, isBottomUp: true },
      { source: 'SUR', target: 'CEN', activationTime: 9, isBottomUp: true },
      { source: 'LEV', target: 'CAT', activationTime: 11, isBottomUp: true } // final mesh
    ]
  };
};

const getEventLog = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { t: 0, msg: t("16:35 - Blackout sistémico. Red fragmentada en 7 islas desenergizadas.", "16:35 - Systemic blackout. Grid fragmented into 7 de-energized islands.", "16:35 - Blackout sistémico. Rede fragmentada.", "16:35 - Blackout systémique. Réseau fragmenté.", "16:35 - Blackout sistemico. Rete frammentata.", "16:35 - Systemweiter Blackout. Netz fragmentiert.") },
    { t: 2, msg: t("16:50 - TOP-DOWN: Francia energiza la interconexión. Cataluña recobra tensión.", "16:50 - TOP-DOWN: France energizes interconnection. Catalonia recovers voltage.", "16:50 - TOP-DOWN: França energiza. Catalunha recupera.", "16:50 - TOP-DOWN: La France énergise. La Catalogne récupère.", "16:50 - TOP-DOWN: La Francia energizza. La Catalogna recupera.", "16:50 - TOP-DOWN: Frankreich schaltet ein. Katalonien erholt sich.") },
    { t: 3, msg: t("17:15 - TOP-DOWN: Portugal inyecta potencia hacia Galicia.", "17:15 - TOP-DOWN: Portugal injects power towards Galicia.", "17:15 - TOP-DOWN: Portugal injeta potência.", "17:15 - TOP-DOWN: Le Portugal injecte de la puissance.", "17:15 - TOP-DOWN: Il Portogallo inietta potenza.", "17:15 - TOP-DOWN: Portugal speist Leistung ein.") },
    { t: 4, msg: t("17:40 - Malla Nordeste: Aragón se sincroniza con Cataluña.", "17:40 - Northeast Mesh: Aragon syncs with Catalonia.", "17:40 - Malha Nordeste: Aragão sincroniza.", "17:40 - Maillage Nord-Est : L'Aragon se synchronise.", "17:40 - Maglia Nord-Est: L'Aragona si sincronizza.", "17:40 - Nordost-Masche: Aragonien synchronisiert sich.") },
    { t: 5, msg: t("18:10 - BOTTOM-UP: Arranque autónomo hidráulico en Andalucía. Creación de isla viva.", "18:10 - BOTTOM-UP: Black-start hydro in Andalusia. Live island created.", "18:10 - BOTTOM-UP: Arranque autónomo hídrico.", "18:10 - BOTTOM-UP: Démarrage autonome hydro.", "18:10 - BOTTOM-UP: Avvio autonomo idroelettrico.", "18:10 - BOTTOM-UP: Schwarzstart durch Wasserkraft.") },
    { t: 6, msg: t("18:30 - Expansión Top-Down: La tensión llega a la Isla Central (Madrid).", "18:30 - Top-Down Expansion: Voltage reaches Central Island.", "18:30 - Expansão Top-Down: Tensão chega a Madrid.", "18:30 - Expansion Top-Down : La tension atteint Madrid.", "18:30 - Espansione Top-Down: La tensione raggiunge Madrid.", "18:30 - Top-Down-Erweiterung: Spannung erreicht Madrid.") },
    { t: 7, msg: t("18:45 - Portugal sincroniza su corredor este con la Isla Central.", "18:45 - Portugal syncs its east corridor with Central Island.", "18:45 - Portugal sincroniza com a Ilha Central.", "18:45 - Le Portugal se synchronise avec l'Île Centrale.", "18:45 - Il Portogallo si sincronizza con l'Isola Centrale.", "18:45 - Portugal synchronisiert sich mit der Zentralinsel.") },
    { t: 9, msg: t("19:20 - Cierre Sur-Centro. La isla andaluza se acopla al esqueleto principal.", "19:20 - South-Center closure. Andalusian island couples to main skeleton.", "19:20 - Fecho Sul-Centro.", "19:20 - Fermeture Sud-Centre.", "19:20 - Chiusura Sud-Centro.", "19:20 - Süd-Zentrum-Schluss.") },
    { t: 11, msg: t("19:50 - Sincronización Final: Levante se acopla cerrando el anillo mediterráneo. Reposición completa.", "19:50 - Final Sync: Levante couples, closing Med ring. Full restoration.", "19:50 - Sincronização Final.", "19:50 - Synchronisation Finale.", "19:50 - Sincronizzazione Finale.", "19:50 - Finale Synchronisation.") }
  ];
};

function AnimatedRestorationMapContent({ lang = 'es' }) {
  const GRID_DATA = useMemo(() => getGridData(lang), [lang]);
  const EVENT_LOG = useMemo(() => getEventLog(lang), [lang]);
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Restoration Sequences', play: 'Play', pause: 'Pause', replay: 'Replay', desc: 'Simulates the simultaneous Top-Down and Bottom-Up grid restoration.' };
      default: return { title: 'Secuencias de Reposición', play: 'Iniciar', pause: 'Pausar', replay: 'Repetir', desc: 'Simula el avance de la restitución del servicio eléctrico (Top-Down desde interconexiones, Bottom-Up desde centrales hidráulicas).' };
    }
  };
  const strings = getStrings(lang);

  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const fgRef = useRef();
  
  useEffect(() => {
    import('react-force-graph-2d').then(module => {
      setForceGraph2D(() => module.default);
    });
  }, []);

  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && simTime < 13) {
      interval = setInterval(() => {
        setSimTime(t => t + 1);
      }, 1000);
    } else if (simTime >= 13) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simTime]);

  const visibleLogs = EVENT_LOG.filter(log => log.t <= simTime).reverse();

  if (!ForceGraph2D) return <div style={{height: 680, backgroundColor: '#0d1117', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa'}}>Cargando...</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '680px', backgroundColor: '#0d1117', borderRadius: '12px', overflow: 'hidden', border: '1px solid #30363d' }}>
      <ForceGraph2D
        ref={fgRef}
        height={680}
        graphData={GRID_DATA}
        nodeRelSize={6}
        nodeVal={node => node.val}
        linkColor={link => {
          if (simTime >= link.activationTime) {
            return link.isTopDown ? '#3b82f6' : '#10b981'; // Blue for TopDown, Green for BottomUp
          }
          return 'rgba(255,255,255,0.05)';
        }}
        linkWidth={link => simTime >= link.activationTime ? 3 : 1}
        linkDirectionalParticles={link => simTime >= link.activationTime ? 3 : 0}
        linkDirectionalParticleSpeed={0.015}
        linkDirectionalParticleColor={link => link.isTopDown ? '#60a5fa' : '#34d399'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Determine if node is energized based on links connecting to it
          let isEnergized = false;
          if (node.id === 'FRA' || node.id === 'POR') isEnergized = true; // Always energized external grids
          else {
            GRID_DATA.links.forEach(l => {
              if (simTime >= l.activationTime) {
                const srcId = typeof l.source === 'object' ? l.source.id : l.source;
                const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
                if (srcId === node.id || tgtId === node.id) isEnergized = true;
              }
            });
          }

          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - 10, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isEnergized ? '#e2e8f0' : '#475569';
          ctx.fillText(label, node.x, node.y - 10);

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = isEnergized ? (node.id === 'FRA' || node.id === 'POR' ? '#3b82f6' : '#10b981') : '#1e293b';
          ctx.fill();
          
          if (isEnergized) {
            ctx.strokeStyle = node.id === 'FRA' || node.id === 'POR' ? '#60a5fa' : '#34d399';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }}
        nodeCanvasObjectMode={() => 'replace'}
        cooldownTicks={0}
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
          <h4 style={{ margin: 0, color: '#34d399' }}>{strings.title}</h4>
          <button 
            onClick={() => {
              if (simTime >= 13) setSimTime(0);
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
            {simTime >= 13 ? strings.replay : (isPlaying ? strings.pause : strings.play)}
          </button>
        </div>
        
        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#9ca3af' }}>{strings.desc}</p>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleLogs.map((log, idx) => (
            <div key={idx} style={{
              fontSize: '0.85rem',
              padding: '8px',
              backgroundColor: idx === 0 ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
              borderLeft: idx === 0 ? '3px solid #34d399' : '3px solid transparent',
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

export default function AnimatedRestorationMap({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={<div style={{height: 680, backgroundColor: '#0d1117', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa'}}>Cargando...</div>}>
      {() => <AnimatedRestorationMapContent lang={lang} />}
    </BrowserOnly>
  );
}
