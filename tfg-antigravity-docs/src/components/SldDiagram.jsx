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
        <span>{data.voltageLabel || 'Tensión:'}</span>
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
    <div className={styles.marginHeader}>{data.marginLabel || 'Capacidad de Absorción (Reactiva)'}</div>
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

const getInitialNodes = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    {
      id: 'ree400',
      type: 'network',
      position: { x: 300, y: 50 },
      data: { label: t('Primario: Red 400 kV (REE)', 'Primary: 400 kV Grid (REE)', 'Primário: Rede 400 kV (REE)', 'Primaire : Réseau 400 kV (REE)', 'Primario: Rete 400 kV (REE)', 'Primär: 400-kV-Netz (REE)'), voltageLabel: t('Tensión:', 'Voltage:', 'Tensão:', 'Tension :', 'Tensione:', 'Spannung:'), voltage: '412 kV', bgColor: 'var(--ifm-color-primary-dark)', isOvervoltage: false, isTripped: false },
    },
    {
      id: 'trafo',
      type: 'transformer',
      position: { x: 325, y: 220 },
      data: { label: t('Transformador Granada', 'Granada Transformer', 'Transformador Granada', 'Transformateur Grenade', 'Trasformatore Granada', 'Granada Transformator'), tap: '5', tapLag: false },
    },
    {
      id: 'colector220',
      type: 'network',
      position: { x: 300, y: 400 },
      data: { label: t('Secundario: Colector 220 kV', 'Secondary: 220 kV Collector', 'Secundário: Coletor 220 kV', 'Secondaire : Collecteur 220 kV', 'Secondario: Collettore 220 kV', 'Sekundär: 220-kV-Kollektor'), voltageLabel: t('Tensión:', 'Voltage:', 'Tensão:', 'Tension :', 'Tensione:', 'Spannung:'), voltage: '228 kV', bgColor: 'var(--ifm-color-warning)', isOvervoltage: false, isTripped: false },
    },
    {
      id: 'ibr',
      type: 'network',
      position: { x: 300, y: 580 },
      data: { label: t('Plantas Solares IBR', 'IBR Solar Plants', 'Usinas Solares IBR', 'Centrales Solaires IBR', 'Impianti Solari IBR', 'IBR-Solaranlagen'), voltageLabel: t('Tensión:', 'Voltage:', 'Tensão:', 'Tension :', 'Tensione:', 'Spannung:'), voltage: '1.02 p.u.', info: t('Generando 355 MW', 'Generating 355 MW', 'Gerando 355 MW', 'Générant 355 MW', 'Generando 355 MW', 'Erzeugt 355 MW'), bgColor: '#f59e0b', isTripped: false },
    },
    {
      id: 'qmargin',
      type: 'qmargin',
      position: { x: 600, y: 50 },
      data: { margin: 165, marginLabel: t('Capacidad de Absorción (Reactiva)', 'Absorption Capacity (Reactive)', 'Capacidade de Absorção (Reativa)', 'Capacité d\'Absorption (Réactive)', 'Capacità di Assorbimento (Reattiva)', 'Absorptionskapazität (Blindleistung)') },
    }
  ];
};

const initialEdges = [
  { id: 'e1', source: 'ree400', target: 'trafo', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
  { id: 'e2', source: 'trafo', target: 'colector220', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
  { id: 'e3', source: 'colector220', target: 'ibr', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } },
];

// ----------------------------------------------------
// Component
// ----------------------------------------------------

export default function SldDiagram({ lang = 'es' }) {
  const initialNodes = getInitialNodes(lang);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);

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
        if (n.id === 'ree400') return { ...n, data: { ...n.data, voltage: t('435 kV (OK para REE)', '435 kV (OK for REE)', '435 kV (OK para REE)', '435 kV (OK pour REE)', '435 kV (OK per REE)', '435 kV (OK für REE)') } };
        if (n.id === 'trafo') return { ...n, data: { ...n.data, tapLag: true } };
        if (n.id === 'colector220') return { ...n, data: { ...n.data, voltage: '244 kV !!!', isOvervoltage: true, alert: t('SOBRETENSIÓN INVISIBLE A REE', 'OVERVOLTAGE INVISIBLE TO REE', 'SOBRETENSÃO INVISÍVEL PARA REE', 'SURTENSION INVISIBLE POUR REE', 'SOVRATENSIONE INVISIBILE A REE', 'ÜBERSPANNUNG UNSICHTBAR FÜR REE') } };
        if (n.id === 'ibr') return { ...n, data: { ...n.data, voltage: '1.11 p.u.' } };
        return n;
      }));
    }, 2000);

    // T=5s: Disparo de inversores por protección 59
    setTimeout(() => {
      setStep(3);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'ibr') return { ...n, data: { ...n.data, isTripped: true, voltage: '0 p.u.', info: t('Desconectada (Protección 59)', 'Disconnected (Protection 59)', 'Desconectada (Proteção 59)', 'Déconnecté (Protection 59)', 'Disconnessa (Protezione 59)', 'Getrennt (Schutz 59)'), alert: t('DISPARO IBR', 'IBR TRIP', 'DISPARO IBR', 'DÉCLENCHEMENT IBR', 'SCATTO IBR', 'IBR AUSLÖSUNG') } };
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
        if (n.id === 'ree400') return { ...n, data: { ...n.data, voltage: '445 kV !!!', isOvervoltage: true, alert: t('COLAPSO Q-V (EFECTO FERRANTI)', 'Q-V COLLAPSE (FERRANTI EFFECT)', 'COLAPSO Q-V (EFEITO FERRANTI)', 'EFFONDREMENT Q-V (EFFET FERRANTI)', 'COLLASSO Q-V (EFFETTO FERRANTI)', 'Q-V KOLLAPS (FERRANTI-EFFEKT)') } };
        return n;
      }));
    }, 8000);

    // T=11s: Blackout sistémico
    setTimeout(() => {
      setStep(5);
      setNodes((nds) => nds.map((n) => {
        if (n.id === 'ree400' || n.id === 'colector220' || n.id === 'trafo') {
          return { ...n, data: { ...n.data, isTripped: true, alert: t('BLACKOUT SISTÉMICO', 'SYSTEMIC BLACKOUT', 'BLACKOUT SISTÊMICO', 'BLACKOUT SYSTÉMIQUE', 'BLACKOUT SISTEMICO', 'SYSTEMISCHER BLACKOUT') } };
        }
        return n;
      }));
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' } })));
      setIsRunning(false);
    }, 11000);
  };

  const getStepText = () => {
    switch(step) {
      case 0: return t("Estado inicial: Sistema energizado, flujos normales.", "Initial state: System energized, normal flows.", "Estado inicial: Sistema energizado, fluxos normais.", "État initial : Système sous tension, flux normaux.", "Stato iniziale: Sistema energizzato, flussi normali.", "Anfangszustand: System erregt, normale Flüsse.");
      case 1: return t("12:33:18 CEST: Transitorio en la red...", "12:33:18 CEST: Network transient...", "12:33:18 CEST: Transitório na rede...", "12:33:18 CEST : Transitoire dans le réseau...", "12:33:18 CEST: Transitorio nella rete...", "12:33:18 CEST: Netztransient...");
      case 2: return t("12:33:20 CEST: Efecto Tap-Lag. El transformador no regula. Tensión letal en 220kV.", "12:33:20 CEST: Tap-Lag effect. Transformer not regulating. Lethal voltage at 220kV.", "12:33:20 CEST: Efeito Tap-Lag. O transformador não regula. Tensão letal em 220kV.", "12:33:20 CEST : Effet Tap-Lag. Le transformateur ne régule pas. Tension létale à 220kV.", "12:33:20 CEST: Effetto Tap-Lag. Il trasformatore non regola. Tensione letale a 220kV.", "12:33:20 CEST: Tap-Lag-Effekt. Transformator regelt nicht. Tödliche Spannung bei 220kV.");
      case 3: return t("12:33:23 CEST: Las plantas solares detectan sobretensión y se protegen (Disparo).", "12:33:23 CEST: Solar plants detect overvoltage and protect themselves (Trip).", "12:33:23 CEST: Usinas solares detectam sobretensão e se protegem (Disparo).", "12:33:23 CEST : Les centrales solaires détectent une surtension et se protègent (Déclenchement).", "12:33:23 CEST: Gli impianti solari rilevano sovratensione e si proteggono (Scatto).", "12:33:23 CEST: Solaranlagen erkennen Überspannung und schützen sich (Auslösung).");
      case 4: return t("12:33:26 CEST: Pérdida de 165 MVAr de absorción. REE sufre Colapso Q-V.", "12:33:26 CEST: Loss of 165 MVAr absorption. REE suffers Q-V Collapse.", "12:33:26 CEST: Perda de 165 MVAr de absorção. REE sofre Colapso Q-V.", "12:33:26 CEST : Perte de 165 MVAr d'absorption. REE subit un effondrement Q-V.", "12:33:26 CEST: Perdita di 165 MVAr di assorbimento. REE subisce Collasso Q-V.", "12:33:26 CEST: Verlust von 165 MVAr Absorption. REE erleidet Q-V Kollaps.");
      case 5: return t("12:33:29 CEST: Desconexión total de la Península Ibérica.", "12:33:29 CEST: Total disconnection of the Iberian Peninsula.", "12:33:29 CEST: Desconexão total da Península Ibérica.", "12:33:29 CEST : Déconnexion totale de la Péninsule Ibérique.", "12:33:29 CEST: Disconnessione totale della Penisola Iberica.", "12:33:29 CEST: Vollständige Trennung der Iberischen Halbinsel.");
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
            {step === 0 ? t('▶ Iniciar Análisis Tap-Lag', '▶ Start Tap-Lag Analysis', '▶ Iniciar Análise Tap-Lag', '▶ Lancer l\'Analyse Tap-Lag', '▶ Avvia Analisi Tap-Lag', '▶ Tap-Lag-Analyse Starten') : (step === 5 ? t('↺ Reiniciar', '↺ Restart', '↺ Reiniciar', '↺ Recommencer', '↺ Riavvia', '↺ Neustart') : t('Simulando...', 'Simulating...', 'Simulando...', 'Simulation...', 'Simulazione...', 'Simulieren...'))}
          </button>
          <span className={styles.stepText}>{getStepText()}</span>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.legendRed}></span> {t('Energizado', 'Energized', 'Energizado', 'Sous tension', 'Energizzato', 'Erregt')}</span>
          <span className={styles.legendItem}><span className={styles.legendGreen}></span> {t('Desconectado', 'Disconnected', 'Desconectado', 'Déconnecté', 'Disconnesso', 'Getrennt')}</span>
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
