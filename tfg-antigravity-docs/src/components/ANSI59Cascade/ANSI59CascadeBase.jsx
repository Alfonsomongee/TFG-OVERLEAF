import React, { useState, useEffect, useRef } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
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
        {translate({id: 'ansi59.loading', message: 'Cargando simulador de cascada...'})}
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
              ▶ {translate({id: 'ansi59.start', message: 'Iniciar Cascada'})}
            </button>
          ) : isRunning ? (
            <button className={styles.controlBtn} onClick={pauseSimulation}>
              ⏸ {translate({id: 'ansi59.pause', message: 'Pausar'})}
            </button>
          ) : (
            <button className={`${styles.controlBtn} ${styles.primary}`} onClick={startSimulation}>
              ▶ {translate({id: 'ansi59.resume', message: 'Reanudar'})}
            </button>
          )}

          <button className={styles.controlBtn} onClick={resetSimulation}>
            ↺ {translate({id: 'ansi59.reset', message: 'Reiniciar'})}
          </button>
        </div>

        {/* Sensitivity slider */}
        <div className={styles.sliderRow}>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderLabel}><Translate id="ansi59.sliderSensitivity">Protecciones ANSI 59 (Sensibilidad)</Translate></span>
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
          <span style={{ fontSize: '0.62rem', color: 'var(--text-1, #64748b)', marginTop: '0.1rem' }}>
            {sensitivity <= 0.05 
              ? translate({id: 'ansi59.hintOptimal', message: '🛡️ Calibración óptima (Cascada contenida)'}) 
              : sensitivity <= 0.09 
                ? translate({id: 'ansi59.hintReal', message: '⚠️ Calibración real 28-A (Riesgo alto de propagación)'}) 
                : translate({id: 'ansi59.hintCritical', message: '💥 Calibración crítica (Cascada explosiva)'})}
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
                  {isNodeTripped ? translate({id: 'ansi59.badgeTrip', message: '⚡ TRIP'}) : translate({id: 'ansi59.badgeActive', message: 'ACTIVO'})}
                </span>
              </div>

              <div className={styles.voltageMetricRow}>
                <span className={styles.voltageLabel}><Translate id="ansi59.voltageLabel">Tensión en barra</Translate></span>
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
                  {node.type === 'solar' ? translate({id: 'ansi59.solar', message: 'Generación FV'}) : translate({id: 'ansi59.wind', message: 'Generación Eólica'})}: {(node.P_ibr * 1000).toFixed(0)} MW
                </span>
                {isNodeTripped && (
                  <span className={styles.metaTripTime}>
                    {translate({id: 'ansi59.trippedAt', message: 'Disparado a'})} {node.tripTime}
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
          <h4 className={styles.statsTitle}><Translate id="ansi59.statsTitle">Monitoreo del Sistema</Translate></h4>
          
          <div className={styles.statRow}>
            <span className={styles.statLabel}><Translate id="ansi59.timerLabel">Cronómetro:</Translate></span>
            <span className={styles.statValue}>{time.toFixed(1)}s</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}><Translate id="ansi59.activeNodesLabel">Nudos activos:</Translate></span>
            <span className={styles.statValue}>{activeNodesCount} / 8</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}><Translate id="ansi59.lostMWLabel">Gen. Perdida:</Translate></span>
            <span className={`${styles.statValue} ${totalLostMW > 0 ? styles.warning : ''}`}>
              {(totalLostMW * 1000).toFixed(0)} MW
            </span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}><Translate id="ansi59.lostMVArLabel">Reactiva Perdida:</Translate></span>
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
              <span className={styles.emptyLog}>{translate({id: 'ansi59.logEmpty', message: 'Esperando disparo raíz para iniciar cascada...'})}</span>
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
              <Translate id="ansi59.bannerCollapse" values={{ mw: (totalLostMW * 1000).toFixed(0), mvar: (totalLostMVAr * 1000).toFixed(0), time: time.toFixed(1), strong: (chunks) => <strong>{chunks}</strong> }}>
                {`💥 <strong>COLAPSO TOTAL DEL CORREDOR:</strong> Pérdida completa de estabilidad de tensión. Se perdieron {mw} MW y {mvar} MVAr de absorción reactiva en {time} segundos.`}
              </Translate>
            </span>
          ) : (
            <span>
              <Translate id="ansi59.bannerStable" values={{ nodes: activeNodesCount, time: time.toFixed(1), strong: (chunks) => <strong>{chunks}</strong> }}>
                {`🛡️ <strong>SISTEMA ESTABILIZADO:</strong> La cascada se detuvo. Permanecen activos {nodes} de 8 nudos tras {time} segundos.`}
              </Translate>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
