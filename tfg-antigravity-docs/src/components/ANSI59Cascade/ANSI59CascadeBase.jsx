import React, { useState, useEffect, useRef } from 'react';
import { useCascadeSimulation } from './useCascadeSimulation';
import styles from './styles.module.css';

export default function ANSI59Cascade() {
  const [isMounted, setIsMounted] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.08);

  const {
    nodes,
    time,
    isRunning,
    history,
    isFinished,
    totalLostMW,
    totalLostMVAr,
    activeNodesCount,
    startSimulation,
    pauseSimulation,
    resetSimulation
  } = useCascadeSimulation(sensitivity);

  const consoleEndRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      const parent = consoleEndRef.current.parentNode;
      parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
    }
  }, [history]);

  if (!isMounted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#94a3b8' }}>
        Cargando simulador de cascada...
      </div>
    );
  }

  // Helper for node type icon
  const getNodeIcon = (type) => {
    return type === 'solar' ? '☀️' : '💨';
  };

  // Helper for voltage styling
  const getVoltageClass = (V) => {
    if (V < 1.05) return styles.green;
    if (V < 1.09) return styles.amber;
    return styles.red;
  };

  // Progress bar fill calculation (map 0.95 p.u. - 1.15 p.u. to 0% - 100%)
  const getProgressWidth = (V) => {
    const min = 0.95;
    const max = 1.15;
    const pct = ((V - min) / (max - min)) * 100;
    return `${Math.min(100, Math.max(5, pct))}%`;
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. CONTROLS BAR */}
      <div className={styles.controlsBar}>
        <div className={styles.btnGroup}>
          {!isRunning && !isFinished ? (
            <button className={`${styles.controlBtn} ${styles.primary}`} onClick={startSimulation}>
              ▶ Iniciar Cascada
            </button>
          ) : isRunning ? (
            <button className={styles.controlBtn} onClick={pauseSimulation}>
              ⏸ Pausar
            </button>
          ) : (
            <button className={`${styles.controlBtn} ${styles.primary}`} onClick={startSimulation}>
              ▶ Reanudar
            </button>
          )}

          <button className={styles.controlBtn} onClick={resetSimulation}>
            ↺ Reiniciar
          </button>
        </div>

        {/* Sensitivity slider */}
        <div className={styles.sliderRow}>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderLabel}>Protecciones ANSI 59 (Sensibilidad)</span>
            <span className={styles.sliderValue}>{sensitivity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.04"
            max="0.15"
            step="0.01"
            value={sensitivity}
            disabled={isRunning || time > 0}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className={styles.rangeInput}
            aria-label="Sensibilidad de propagación (ANSI 59)"
          />
          <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '0.1rem' }}>
            {sensitivity <= 0.05 
              ? '🛡️ Calibración óptima (Cascada contenida)' 
              : sensitivity <= 0.09 
                ? '⚠️ Calibración real 28-A (Riesgo alto de propagación)' 
                : '💥 Calibración crítica (Cascada explosiva)'}
          </span>
        </div>
      </div>

      {/* 2. LEFT SIDE: NODES GRID */}
      <div className={styles.nodesContainer}>
        {nodes.map(node => {
          const vClass = getVoltageClass(node.V);
          const isNodeTripped = node.tripped;

          return (
            <div 
              key={node.id} 
              className={`${styles.nodeCard} ${isNodeTripped ? styles.tripped : ''}`}
            >
              <div className={styles.nodeHeader}>
                <span className={styles.nodeTitle}>
                  {getNodeIcon(node.type)} {node.name}
                </span>
                <span className={`${styles.badge} ${isNodeTripped ? styles.tripped : styles.active}`}>
                  {isNodeTripped ? '⚡ TRIP' : 'ACTIVO'}
                </span>
              </div>

              <div className={styles.voltageMetricRow}>
                <span className={styles.voltageLabel}>Tensión en barra</span>
                <span className={`${styles.voltageValue} ${vClass}`}>
                  {node.V.toFixed(3)} p.u.
                </span>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressBarBg}>
                <div 
                  className={`${styles.progressBarFill} ${vClass}`}
                  style={{ width: getProgressWidth(node.V) }}
                  role="progressbar"
                  aria-valuenow={node.V}
                  aria-valuemin="0.95"
                  aria-valuemax="1.15"
                  aria-label={`Tensión en barra ${node.name}`}
                />
              </div>

              <div className={styles.nodeMeta}>
                <span>
                  {node.type === 'solar' ? 'Generación FV' : 'Generación Eólica'}: {(node.P_ibr * 1000).toFixed(0)} MW
                </span>
                {isNodeTripped && (
                  <span className={styles.metaTripTime}>
                    Disparado a {node.tripTime}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. RIGHT SIDE: SIDEBAR CONSOLE & STATS */}
      <div className={styles.dashboardSidebar}>
        {/* Stats card */}
        <div className={styles.statsCard}>
          <h4 className={styles.statsTitle}>Monitoreo del Sistema</h4>
          
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Cronómetro:</span>
            <span className={styles.statValue}>{time.toFixed(1)}s</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Nudos activos:</span>
            <span className={styles.statValue}>{activeNodesCount} / 8</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Gen. Perdida:</span>
            <span className={`${styles.statValue} ${totalLostMW > 0 ? styles.warning : ''}`}>
              {(totalLostMW * 1000).toFixed(0)} MW
            </span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Reactiva Perdida:</span>
            <span className={`${styles.statValue} ${totalLostMVAr > 0 ? styles.warning : ''}`}>
              {(totalLostMVAr * 1000).toFixed(0)} MVAr
            </span>
          </div>
        </div>

        {/* Live event log console */}
        <div className={styles.consoleCard}>
          <div className={styles.consoleHeader}>
            <span className={styles.consoleTitle}>Forensic Event Log</span>
            {isRunning && <span className={styles.consoleDot} />}
          </div>
          
          <div className={styles.consoleBody} aria-live="polite">
            {history.length === 0 ? (
              <span className={styles.emptyLog}>Esperando disparo raíz para iniciar cascada...</span>
            ) : (
              history.map((log, idx) => (
                <div key={idx} className={styles.logEntry}>
                  <span className={styles.logTime}>[{log.time}]</span>
                  <span>{log.msg}</span>
                </div>
              ))
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>

      {/* 4. END GAME BANNER */}
      {isFinished && (
        <div className={`${styles.banner} ${activeNodesCount === 0 ? styles.collapsed : styles.stabilized}`}>
          {activeNodesCount === 0 ? (
            <span>
              💥 <strong>COLAPSO TOTAL DEL CORREDOR:</strong> Pérdida completa de estabilidad de tensión. Se perdieron {(totalLostMW * 1000).toFixed(0)} MW y {(totalLostMVAr * 1000).toFixed(0)} MVAr de absorción reactiva en {time.toFixed(1)} segundos.
            </span>
          ) : (
            <span>
              🛡️ <strong>SISTEMA ESTABILIZADO:</strong> La cascada se detuvo. Permanecen activos {activeNodesCount} de 8 nudos tras {time.toFixed(1)} segundos.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
