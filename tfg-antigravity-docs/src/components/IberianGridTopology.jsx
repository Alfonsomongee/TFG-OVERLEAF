import React, { useRef, useState, useCallback, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const GRID_DATA = {
  nodes: [
    { id: 'GRN', name: 'Granada 400kV (Detonante)', group: 1, val: 25, color: '#ef4444' }, // Rojo
    { id: 'SEV', name: 'Sevilla 400kV', group: 1, val: 15, color: '#f97316' }, // Naranja
    { id: 'BAD', name: 'Badajoz 400kV', group: 1, val: 15, color: '#f97316' },
    { id: 'MAD', name: 'Madrid Sur', group: 2, val: 20, color: '#10b981' }, // Verde
    { id: 'ALM', name: 'Almaraz Nuclear', group: 2, val: 25, color: '#10b981' },
    { id: 'ZAR', name: 'Zaragoza', group: 3, val: 15, color: '#10b981' },
    { id: 'BAR', name: 'Barcelona', group: 3, val: 20, color: '#10b981' },
    { id: 'VAL', name: 'Valencia', group: 3, val: 15, color: '#10b981' },
    { id: 'LIS', name: 'Lisboa REN', group: 4, val: 20, color: '#10b981' },
    { id: 'POR', name: 'Porto REN', group: 4, val: 15, color: '#10b981' },
    { id: 'FR', name: 'RTE Francia (Aislamiento)', group: 5, val: 30, color: '#3b82f6' } // Azul
  ],
  links: [
    { source: 'GRN', target: 'SEV', isCritical: true, flow: 'Sobrecarga masiva' },
    { source: 'SEV', target: 'BAD', isCritical: true, flow: 'Sobrecarga masiva' },
    { source: 'BAD', target: 'ALM', isCritical: false },
    { source: 'BAD', target: 'LIS', isCritical: true, flow: 'Oscilaciones Inter-área (0.8Hz)' },
    { source: 'LIS', target: 'POR', isCritical: false },
    { source: 'POR', target: 'ALM', isCritical: false },
    { source: 'ALM', target: 'MAD', isCritical: false },
    { source: 'SEV', target: 'MAD', isCritical: false },
    { source: 'MAD', target: 'ZAR', isCritical: false },
    { source: 'ZAR', target: 'BAR', isCritical: false },
    { source: 'ZAR', target: 'FR', isCritical: true, flow: 'Desconexión por subfrecuencia' },
    { source: 'BAR', target: 'FR', isCritical: true, flow: 'Desconexión por subfrecuencia' },
    { source: 'VAL', target: 'MAD', isCritical: false },
    { source: 'VAL', target: 'BAR', isCritical: false },
    { source: 'GRN', target: 'VAL', isCritical: true, flow: 'Caída de tensión (Collapse)' }
  ]
};

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
        nodeLabel="name"
        nodeColor={node => highlightNodes.size === 0 || highlightNodes.has(node.id) ? node.color : 'rgba(255,255,255,0.1)'}
        nodeRelSize={6}
        nodeVal={node => node.val}
        linkColor={link => highlightLinks.has(link) ? '#fff' : (link.isCritical ? '#ef4444' : 'rgba(255,255,255,0.2)')}
        linkWidth={link => highlightLinks.has(link) ? 3 : (link.isCritical ? 2 : 1)}
        linkDirectionalParticles={link => link.isCritical ? 4 : 0}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        onNodeHover={handleNodeHover}
        onNodeClick={node => {
          fgRef.current.centerAt(node.x, node.y, 1000);
          fgRef.current.zoom(8, 2000);
        }}
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
        color: '#fff'
      }}>
        <h4 style={{ margin: 0, color: '#e5e7eb' }}>Grafo Topológico de Impedancias (GNN)</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Pasa el ratón sobre los nudos para analizar dependencias locales.</p>
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
