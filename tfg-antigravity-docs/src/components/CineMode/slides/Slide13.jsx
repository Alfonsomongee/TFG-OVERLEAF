// slides/Slide13.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide13.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide13({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.4) setStage(2);
    if (slideProgress >= 0.6) setStage(3);
    if (slideProgress >= 0.8) setStage(4);
  }, [slideProgress]);

  const phase1 = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.2));
  const phase2 = Math.min(1, Math.max(0, (slideProgress - 0.4) / 0.2));
  const phase3 = Math.min(1, Math.max(0, (slideProgress - 0.6) / 0.2));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="MODO FORENSE – VALIDACIÓN CRUZADA" color="#3b82f6" />
        <DigitalClock fixedTime="13:35:40" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>METODOLOGÍA FORENSE: TRIANGULACIÓN CRUZADA</h1>
        <h2 className={styles.subtitle}>170 GB de registros técnicos · 26 PMU independientes</h2>

        {stage >= 1 && (
          <div className={styles.flow} style={{ opacity: phase1 }}>
            <div className={styles.phase}>
              <div className={styles.phaseIcon}>💾</div>
              <div className={styles.phaseTitle}>FASE 01 – DATOS BRUTOS</div>
              <div className={styles.phaseDetail}>SCADA + oscilogramas digitales</div>
              <div className={styles.phaseMetric}>170 GB</div>
            </div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.flow} style={{ opacity: phase2 }}>
            <div className={styles.phase}>
              <div className={styles.phaseIcon}>⚖️</div>
              <div className={styles.phaseTitle}>FASE 02 – CONTRATE DE NARRATIVAS</div>
              <div className={styles.phaseDetail}>P.O. 7.4 vs Tap-Lag vs oscilaciones inter-área</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.flow} style={{ opacity: phase3 }}>
            <div className={styles.phase}>
              <div className={styles.phaseIcon}>📡</div>
              <div className={styles.phaseTitle}>FASE 03 – VALIDACIÓN CRUZADA</div>
              <div className={styles.phaseDetail}>PMU del NREL – +26 unidades de medición fasorial</div>
              <div className={styles.phaseMetric}>Precisión 1° de ángulo · sincronización GPS</div>
            </div>
            <div className={styles.timeline}>
              <div className={styles.timelineLine}></div>
              <div className={styles.timelinePoint} style={{ left: '20%' }}><span>SCADA</span><small>20 ms (50 Hz)</small></div>
              <div className={styles.timelinePoint} style={{ left: '50%' }}><span>Oscilogramas</span><small>1 kHz</small></div>
              <div className={styles.timelinePoint} style={{ left: '80%' }}><span>PMU</span><small>50 Hz sincro</small></div>
            </div>
          </div>
        )}

        {stage >= 4 && (
          <div className={styles.warningBox}>
            ⚠️ <strong>Limitación LLM:</strong> No aplicable a fenómenos de dinámica rápida (Tap-Lag, UFLS). Análisis causal exclusivo del autor.
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuentes: REE · ICAI · ENTSO-E · NREL · Elaboración propia</div>
    </div>
  );
}
