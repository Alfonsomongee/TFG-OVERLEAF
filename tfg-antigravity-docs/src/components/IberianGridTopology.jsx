import React, { useRef, useState, useCallback, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const GRID_DATA = {
  nodes: [
    { id: 'GRN', name: 'Caparacena (Fallo Inicial)', group: 1, val: 25, color: '#ef4444' }, // Rojo
    { id: 'SEV', name: 'Alcores (Efecto Dominó Sur)', group: 1, val: 15, color: '#f97316' }, // Naranja
    { id: 'BAD', name: 'Guillena (Colapso Tensión)', group: 1, val: 15, color: '#f97316' },
    { id: 'MAD', name: 'Madrid Morata (Contención)', group: 2, val: 20, color: '#10b981' }, // Verde
    { id: 'ALM', name: 'C.N. Almaraz (Inercia Base)', group: 2, val: 25, color: '#10b981' },
    { id: 'ZAR', name: 'Aragón (Puente Norte)', group: 3, val: 15, color: '#10b981' },
    { id: 'BAR', name: 'Rubí (Resistencia Este)', group: 3, val: 20, color: '#10b981' },
    { id: 'LIS', name: 'Lisboa (Desequilibrio)', group: 4, val: 20, color: '#f59e0b' }, // Amarillo-naranja
    { id: 'POR', name: 'Porto (Compensación)', group: 4, val: 15, color: '#10b981' },
    { id: 'FR', name: 'Francia (Rescate Externo)', group: 5, val: 30, color: '#3b82f6' } // Azul
  ],
  links: [
    { source: 'GRN', target: 'SEV', isCritical: true, flow: 'Sobrecarga masiva', activationTime: 2 },
    { source: 'SEV', target: 'BAD', isCritical: true, flow: 'Sobrecarga masiva', activationTime: 4 },
    { source: 'BAD', target: 'LIS', isCritical: true, flow: 'Oscilaciones Inter-área (0.8Hz)', activationTime: 6 },
    { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0 },
    { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0 },
    { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0 },
    { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0 },
    { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0 },
    { source: 'ZAR', target: 'FR', isCritical: true, flow: 'Importación de emergencia (Subfrecuencia)', activationTime: 10 },
    { source: 'BAR', target: 'FR', isCritical: true, flow: 'Importación de emergencia (Subfrecuencia)', activationTime: 10 }
  ]
};

const EVENT_LOG = [
  { t: 0, msg: "16:31:50 - Sistema Ibérico en estado estable. Operación nominal." },
  { t: 2, msg: "16:32:00 - ¡DETONANTE! Cortocircuito doble en Caparacena (Granada). Pérdida brutal de reactiva." },
  { t: 4, msg: "16:32:04 - Cae la tensión en el sur. El colapso se transfiere hacia Sevilla y Badajoz." },
  { t: 6, msg: "16:32:10 - ¡ALERTA INTER-ÁREA! Oscilaciones masivas de 0.8 Hz golpean la red de Portugal." },
  { t: 8, msg: "16:32:15 - El centro (Madrid/Almaraz) absorbe el impacto gracias a la inercia de los alternadores." },
  { t: 10, msg: "16:32:20 - Desconexión inminente. Entra energía de rescate masiva desde Francia por los Pirineos." },
  { t: 12, msg: "16:32:23 - Colapso contenido. El sistema sobrevive pero queda dividido y frágil." }
];

function TopologyMapContent() {
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

  if (!ForceGraph2D) return <div style={{height: 500}}>Cargando Grafo...</div>;

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
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - 10, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? node.color : 'rgba(255,255,255,0.2)';
          ctx.fillText(label, node.x, node.y - 10);

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? node.color : 'rgba(255,255,255,0.1)';
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
          <h4 style={{ margin: 0, color: '#60a5fa' }}>Simulador Topológico</h4>
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
              {simTime >= 14 ? 'Replay' : (isPlaying ? 'Pausa' : 'Play')}
            </button>
          </div>
        </div>
        
        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#9ca3af' }}>
          Este grafo modela la red mediante GNN. Dale al <strong>Play</strong> para ver la propagación causal del colapso según el flujo de impedancias.
        </p>

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

export default function IberianGridTopology() {
  return (
    <BrowserOnly fallback={<div>Cargando topología de red...</div>}>
      {() => <TopologyMapContent />}
    </BrowserOnly>
  );
}
