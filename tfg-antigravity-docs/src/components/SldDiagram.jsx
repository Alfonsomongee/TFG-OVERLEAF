import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styles from './SldDiagram.module.css';

// Custom Node for Substations
const SubstationNode = ({ data }) => {
  return (
    <div className={`${styles.node} ${data.isTripped ? styles.nodeTripped : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.nodeHeader}>
        <strong>{data.label}</strong>
      </div>
      <div className={styles.nodeBody}>
        <div>V: {data.voltage}</div>
        {data.power && <div>{data.power}</div>}
      </div>
      {data.alert && <div className={styles.nodeAlert}>{data.alert}</div>}
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} id="right" className={styles.handle} />
      <Handle type="target" position={Position.Left} id="left" className={styles.handle} />
    </div>
  );
};

const nodeTypes = { substation: SubstationNode };

const initialNodes = [
  {
    id: 'nunez',
    type: 'substation',
    position: { x: 50, y: 50 },
    data: { label: 'Núñez de Balboa 400kV', voltage: '412 kV', power: 'Q-V Margin: Low', isTripped: false },
  },
  {
    id: 'carmona',
    type: 'substation',
    position: { x: 350, y: 50 },
    data: { label: 'Carmona 400kV', voltage: '415 kV', power: 'Osc. 0.6Hz', isTripped: false },
  },
  {
    id: 'granada400',
    type: 'substation',
    position: { x: 650, y: 50 },
    data: { label: 'Granada 400kV', voltage: '420 kV', isTripped: false },
  },
  {
    id: 'granada220',
    type: 'substation',
    position: { x: 650, y: 200 },
    data: { label: 'Granada 220kV', voltage: '230 kV', alert: null, isTripped: false },
  },
  {
    id: 'ibr',
    type: 'substation',
    position: { x: 650, y: 350 },
    data: { label: 'Plantas IBR (Solar)', voltage: '1.02 pu', power: 'P: 355 MW', isTripped: false },
  }
];

const initialEdges = [
  { id: 'e-n-c', source: 'nunez', sourceHandle: 'right', target: 'carmona', targetHandle: 'left', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-c-g', source: 'carmona', sourceHandle: 'right', target: 'granada400', targetHandle: 'left', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-g4-g2', source: 'granada400', target: 'granada220', label: 'Trafo 400/220', style: { stroke: '#ef4444', strokeWidth: 4 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-g2-ibr', source: 'granada220', target: 'ibr', style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
];

export default function SldDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [simulationState, setSimulationState] = useState(0); // 0: initial, 1: fault, 2: cascade, 3: collapse

  const runSimulation = () => {
    if (simulationState > 0) {
      // Reset
      setNodes(initialNodes);
      setEdges(initialEdges);
      setSimulationState(0);
      return;
    }

    // Step 1: Root Fault (t=0s)
    setSimulationState(1);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === 'granada220') return { ...n, data: { ...n.data, voltage: '244 kV (O.V.)', alert: 'SOBRETENSIÓN' } };
        return n;
      })
    );
    
    setTimeout(() => {
      // Step 2: Transformer trips (t=2s)
      setSimulationState(2);
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === 'e-g4-g2') return { ...e, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }, markerEnd: { ...e.markerEnd, color: '#10b981' } };
          return e;
        })
      );
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === 'granada400') return { ...n, data: { ...n.data, voltage: '438 kV' } };
          if (n.id === 'ibr') return { ...n, data: { ...n.data, alert: 'Protección 59' } };
          return n;
        })
      );
    }, 2000);

    setTimeout(() => {
      // Step 3: Cascade Collapse (t=5s)
      setSimulationState(3);
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: false,
          style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
          markerEnd: { ...e.markerEnd, color: '#10b981' }
        }))
      );
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, isTripped: true, voltage: '0 kV', alert: 'BLACKOUT' }
        }))
      );
    }, 5000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button onClick={runSimulation} className={`button button--primary ${styles.simBtn}`}>
          {simulationState === 0 ? '▶ Simular Cascada (11s)' : '↺ Reiniciar'}
        </button>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.legendRed}></span> Energizado</span>
          <span className={styles.legendItem}><span className={styles.legendGreen}></span> Disparado / Abierto</span>
        </div>
      </div>
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
