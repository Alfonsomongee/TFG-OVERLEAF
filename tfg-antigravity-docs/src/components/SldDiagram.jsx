import React, { useState, useEffect } from 'react';
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

// ----------------------------------------------------
// Custom Nodes
// ----------------------------------------------------

const NetworkNode = ({ data }) => (
  <div className={`${styles.node} ${data.isTripped ? styles.nodeTripped : ''}`}>
    <Handle type="target" position={Position.Top} className={styles.handle} />
    <div className={styles.nodeHeader} style={{ background: data.bgColor }}>
      <strong>{data.label}</strong>
    </div>
    <div className={styles.nodeBody}>
      <div className={styles.voltageMetric}>
        <span>Tensión:</span>
        <strong className={data.isOvervoltage ? styles.overvoltageText : ''}>{data.voltage}</strong>
      </div>
      {data.info && <div className={styles.infoText}>{data.info}</div>}
    </div>
    {data.alert && <div className={styles.nodeAlert}>{data.alert}</div>}
    <Handle type="source" position={Position.Bottom} className={styles.handle} />
  </div>
);

const TransformerNode = ({ data }) => (
  <div className={styles.trafoNode}>
    <Handle type="target" position={Position.Top} className={styles.handle} />
    <div className={styles.trafoIcon}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <circle cx="12" cy="16" r="6" />
      </svg>
    </div>
    <div className={styles.trafoBody}>
      <strong>{data.label}</strong>
      <div className={styles.tapIndicator}>
        <span>OLTC Tap:</span>
        <span className={`${styles.tapValue} ${data.tapLag ? styles.tapLagAnimation : ''}`}>
          {data.tap}
        </span>
      </div>
      {data.tapLag && <div className={styles.tapLagWarning}>⚠ BLOQUEO MECÁNICO (Tap-Lag)</div>}
    </div>
    <Handle type="source" position={Position.Bottom} className={styles.handle} />
  </div>
);

const QMarginNode = ({ data }) => (
  <div className={styles.marginNode}>
    <div className={styles.marginHeader}>Capacidad de Absorción (Reactiva)</div>
    <div className={styles.progressBarBg}>
      <div 
        className={`${styles.progressBarFill} ${data.margin === 0 ? styles.progressBarEmpty : ''}`} 
        style={{ width: `${(data.margin / 165) * 100}%` }}
      ></div>
    </div>
    <div className={styles.marginValue}>{data.margin} MVAr</div>
  </div>
);

const nodeTypes = {
  network: NetworkNode,
  transformer: TransformerNode,
  qmargin: QMarginNode
};

// ----------------------------------------------------
// Initial Graph State
// ----------------------------------------------------

const initialNodes = [
  {
    id: 'ree400',
    type: 'network',
    position: { x: 300, y: 50 },
    data: { label: 'Primario: Red 400 kV (REE)', voltage: '412 kV', bgColor: 'var(--ifm-color-primary-dark)', isOvervoltage: false, isTripped: false },
  },
  {
    id: 'trafo',
    type: 'transformer',
    position: { x: 325, y: 220 },
    data: { label: 'Transformador Granada', tap: '5', tapLag: false },
  },
  {
    id: 'colector220',
    type: 'network',
    position: { x: 300, y: 400 },
    data: { label: 'Secundario: Colector 220 kV', voltage: '228 kV', bgColor: 'var(--ifm-color-warning)', isOvervoltage: false, isTripped: false },
  },
  {
    id: 'ibr',
    type: 'network',
    position: { x: 300, y: 580 },
    data: { label: 'Plantas Solares IBR', voltage: '1.02 p.u.', info: 'Generando 355 MW', bgColor: '#f59e0b', isTripped: false },
  },
  {
    id: 'qmargin',
    type: 'qmargin',
    position: { x: 600, y: 50 },
    data: { margin: 165 },
  }
];

const initialEdges = [
  { id: 'e1', source: 'ree400', target: 'trafo', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
  { id: 'e2', source: 'trafo', target: 'colector220', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
  { id: 'e3', source: 'colector220', target: 'ibr', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
];

// ----------------------------------------------------
// Component
// ----------------------------------------------------

export default function SldDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const resetSim = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setStep(0);
    setIsRunning(false);
  };

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStep(1);

    // T=2s: Perturbación y Tap-Lag
    setTimeout(() => {
      setStep(2);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'ree400') return { ...n, data: { ...n.data, voltage: '435 kV (OK para REE)' } };
        if (n.id === 'trafo') return { ...n, data: { ...n.data, tapLag: true } };
        if (n.id === 'colector220') return { ...n, data: { ...n.data, voltage: '244 kV !!!', isOvervoltage: true, alert: 'SOBRETENSIÓN INVISIBLE A REE' } };
        if (n.id === 'ibr') return { ...n, data: { ...n.data, voltage: '1.11 p.u.' } };
        return n;
      }));
    }, 2000);

    // T=5s: Disparo de inversores por protección 59
    setTimeout(() => {
      setStep(3);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'ibr') return { ...n, data: { ...n.data, isTripped: true, voltage: '0 p.u.', info: 'Desconectada (Protección 59)', alert: 'DISPARO IBR' } };
        return n;
      }));
      setEdges((eds) => eds.map((e) => {
        if (e.id === 'e3') return { ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' } };
        return e;
      }));
    }, 5000);

    // T=8s: Pérdida del margen reactivo y Colapso Q-V
    setTimeout(() => {
      setStep(4);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'qmargin') return { ...n, data: { ...n.data, margin: 0 } };
        if (n.id === 'ree400') return { ...n, data: { ...n.data, voltage: '445 kV !!!', isOvervoltage: true, alert: 'COLAPSO Q-V (EFECTO FERRANTI)' } };
        return n;
      }));
    }, 8000);

    // T=11s: Blackout sistémico
    setTimeout(() => {
      setStep(5);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'ree400' || n.id === 'colector220' || n.id === 'trafo') {
          return { ...n, data: { ...n.data, isTripped: true, alert: 'BLACKOUT SISTÉMICO' } };
        }
        return n;
      }));
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' } })));
      setIsRunning(false);
    }, 11000);
  };

  const getStepText = () => {
    switch(step) {
      case 0: return "Estado inicial: Sistema energizado, flujos normales.";
      case 1: return "12:33:18 CEST: Transitorio en la red...";
      case 2: return "12:33:20 CEST: Efecto Tap-Lag. El transformador no regula. Tensión letal en 220kV.";
      case 3: return "12:33:23 CEST: Las plantas solares detectan sobretensión y se protegen (Disparo).";
      case 4: return "12:33:26 CEST: Pérdida de 165 MVAr de absorción. REE sufre Colapso Q-V.";
      case 5: return "12:33:29 CEST: Desconexión total de la Península Ibérica.";
      default: return "";
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <div className={styles.controlLeft}>
          <button onClick={step === 0 || step === 5 ? (step === 5 ? resetSim : runSimulation) : undefined} 
                  className={`button button--primary ${styles.simBtn} ${(isRunning) ? styles.btnDisabled : ''}`}
                  disabled={isRunning}>
            {step === 0 ? '▶ Iniciar Análisis Tap-Lag' : (step === 5 ? '↺ Reiniciar' : 'Simulando...')}
          </button>
          <span className={styles.stepText}>{getStepText()}</span>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.legendRed}></span> Energizado</span>
          <span className={styles.legendItem}><span className={styles.legendGreen}></span> Desconectado</span>
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
