// CommandArchitectureGraph.jsx
import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './CommandArchitectureGraph.module.css';

const NODES = [
  {
    id: 'ree',
    label: 'REE',
    country: 'España',
    role: 'Líder de Frecuencia del Bloque Ibérico Aislado',
    shortLabel: 'Líder de frecuencia ibérico',
    mandate:
      'Dirección única de la regulación de frecuencia-potencia y del plan de restauración (control local) en la isla peninsular. Coordinación directa con REN.',
    basis:
      'Planes de Restauración Nacionales bajo régimen de operación en isla síncrona del NC ER.',
    evidence: 'Explícita en Factual Report',
    x: 160,
    y: 230,
    color: '#C0392B',
  },
  {
    id: 'ren',
    label: 'REN',
    country: 'Portugal',
    role: 'Operador de red de Portugal',
    shortLabel: 'Operador PT',
    mandate:
      'Coordinación local de restauración y balance en Portugal bajo la dirección del líder de frecuencia ibérico (REE).',
    basis: 'Planes de restauración nacional y acuerdos bilaterales REE-REN.',
    evidence: 'Implícita en reportes operativos',
    x: 160,
    y: 390,
    color: '#C0392B',
    minor: true,
  },
  {
    id: 'rte',
    label: 'RTE',
    country: 'Francia',
    role: 'Líder de Resincronización Continental',
    shortLabel: 'Líder de resincronización',
    mandate:
      'Autoridad exclusiva para autorizar, programar y coordinar el acoplamiento síncrono físico entre el bloque ibérico aislado y el bloque continental remanente.',
    basis: 'Red de Emergencia y Restauración de ENTSO-E (NC ER - Reglamento UE 2017/2196).',
    evidence: 'Explícita en Factual Report',
    x: 420,
    y: 310,
    color: '#2A4875',
  },
  {
    id: 'swissgrid',
    label: 'Swissgrid',
    country: 'Suiza',
    role: 'Synchronous Area Monitor (CC South) & Líder de Frecuencia del Bloque Continental',
    shortLabel: 'SAM CC South · liderazgo continental',
    mandate:
      'Monitorización global de frecuencia de Europa Continental remanente. Coordinación de las desviaciones de potencia de balance del sur síncrono.',
    basis: 'Artículos 141 y 143 del reglamento System Operation Guidelines (SO GL).',
    evidence: 'Explícita en Factual Report',
    x: 680,
    y: 160,
    color: '#A86018',
  },
  {
    id: 'amprion',
    label: 'Amprion',
    country: 'Alemania',
    role: 'Synchronous Area Monitor (CC North) & Coordinador de Alertas EAS',
    shortLabel: 'SAM CC North · alertas EAS',
    mandate:
      'Monitorización del bloque norte continental. Emisión de alertas oficiales de system split y coordinación de seguridad de flujos comerciales interzonales.',
    basis:
      'Procedimientos de Separación de Sistemas del bloque síncrono de Europa Continental (RG CE).',
    evidence: 'Explícita en Factual Report',
    x: 680,
    y: 460,
    color: '#A86018',
  },
];

const EDGES = [
  { source: 'ree', target: 'ren', type: 'hierarchy', animated: false },
  { source: 'ree', target: 'rte', type: 'physical_split', animated: false, dashed: true },
  { source: 'swissgrid', target: 'rte', type: 'coordination', animated: true },
  { source: 'amprion', target: 'rte', type: 'coordination', animated: true },
  { source: 'swissgrid', target: 'amprion', type: 'coordination', animated: false, light: true },
];

const CommandArchitectureGraphInner = ({ showCaption }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const selectedNode = NODES.find((n) => n.id === selectedNodeId);
  const bgLine = isDark ? '#444' : '#ccc';
  const textColor = isDark ? '#ddd' : '#222';
  const subTextColor = isDark ? '#aaa' : '#555';

  const getNodeColor = (node) => node.color;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>Arquitectura de mando</span>
        <h2 className={styles.title}>Roles operativos durante el System Split ibérico</h2>
        <p className={styles.subtitle}>
          Asignación de líderes de frecuencia, monitorización y resincronización bajo las SO GL de ENTSO-E.
        </p>
      </header>

      <div className={styles.graphContainer}>
        <svg
          viewBox="0 0 860 600"
          className={styles.svg}
          aria-label="Grafo de arquitectura de mando continental"
        >
          {EDGES.map((edge) => {
            const sourceNode = NODES.find((n) => n.id === edge.source);
            const targetNode = NODES.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;
            const strokeColor = edge.light
              ? isDark ? '#555' : '#ccc'
              : edge.type === 'physical_split'
              ? '#C0392B'
              : edge.type === 'coordination'
              ? '#A86018'
              : '#888';
            return (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={strokeColor}
                strokeWidth={edge.light ? 1.5 : 2.5}
                strokeDasharray={edge.dashed ? '8 4' : edge.animated ? '6 3' : 'none'}
                className={edge.animated ? styles.animatedLine : ''}
                opacity={0.8}
              />
            );
          })}

          {NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const r = node.minor ? 22 : 30;
            return (
              <g key={node.id} className={styles.nodeGroup}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={getNodeColor(node)}
                  stroke={isDark ? '#fff' : '#000'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className={styles.nodeCircle}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label} - ${node.role}`}
                  aria-selected={isSelected}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNodeId(isSelected ? null : node.id);
                    }
                  }}
                />
                <text
                  x={node.x}
                  y={node.y - r - 6}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={node.minor ? 13 : 15}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={subTextColor}
                  fontSize={node.minor ? 10 : 11}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.shortLabel}
                </text>
              </g>
            );
          })}

          <text x={160} y={130} textAnchor="middle" fill={textColor} fontSize={12} fontWeight="bold">
            Isla Ibérica
          </text>
          <text x={680} y={110} textAnchor="middle" fill={textColor} fontSize={12} fontWeight="bold">
            Bloque Continental Síncrono
          </text>
          <text x={420} y={280} textAnchor="middle" fill={textColor} fontSize={11} fontStyle="italic">
            Frontera de resincronización
          </text>
        </svg>

        {selectedNode && (
          <div className={styles.detailPanel} role="region" aria-label={`Detalles de ${selectedNode.label}`}>
            <h3 className={styles.detailTitle}>
              {selectedNode.label} – {selectedNode.country}
            </h3>
            <dl className={styles.detailList}>
              <div>
                <dt>Rol asignado</dt>
                <dd>{selectedNode.role}</dd>
              </div>
              <div>
                <dt>Mandato operativo</dt>
                <dd>{selectedNode.mandate}</dd>
              </div>
              <div>
                <dt>Base normativa</dt>
                <dd>{selectedNode.basis}</dd>
              </div>
              <div>
                <dt>Tipo de evidencia</dt>
                <dd>{selectedNode.evidence}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CommandArchitectureGraph() {
  return (
    <BrowserOnly fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Cargando grafo de arquitectura de mando…</div>}>
      {() => <CommandArchitectureGraphInner />}
    </BrowserOnly>
  );
}