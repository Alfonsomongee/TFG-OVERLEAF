// slides/Slide13.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide13.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide13({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

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
        <h2 className={styles.subtitle}>170 GB DE REGISTROS TÉCNICOS · 26 PMU INDEPENDIENTES</h2>

        <div className={styles.flowContainer}>
          <div className={styles.phaseBlock} style={{ opacity: phase1, transform: `translateY(${phase1 === 1 ? 0 : 20}px)` }}>
            <div className={styles.phaseIcon}>💾</div>
            <div className={styles.phaseTitle}>FASE 01 – DATOS BRUTOS</div>
            <div className={styles.phaseDetail}>SCADA + OSCILOGRAMAS DIGITALES</div>
            <div className={styles.phaseMetric}>170 GB</div>
          </div>

          <div className={styles.arrow} style={{ opacity: phase2 }}>▼</div>

          <div className={styles.phaseBlock} style={{ opacity: phase2, transform: `translateY(${phase2 === 1 ? 0 : 20}px)` }}>
            <div className={styles.phaseIcon}>⚖️</div>
            <div className={styles.phaseTitle}>FASE 02 – CONTRATE DE NARRATIVAS</div>
            <div className={styles.phaseDetail}>P.O. 7.4 VS TAP-LAG VS OSCILACIONES INTER-ÁREA</div>
          </div>

          <div className={styles.arrow} style={{ opacity: phase3 }}>▼</div>

          <div className={styles.phaseBlock} style={{ opacity: phase3, transform: `translateY(${phase3 === 1 ? 0 : 20}px)` }}>
            <div className={styles.phaseIcon}>📡</div>
            <div className={styles.phaseTitle}>FASE 03 – VALIDACIÓN CRUZADA</div>
            <div className={styles.phaseDetail}>PMU DEL NREL – +26 UNIDADES DE MEDICIÓN FASORIAL</div>
            <div className={styles.phaseMetric}>PRECISIÓN 1° DE ÁNGULO · SINCRONIZACIÓN GPS</div>
          </div>
        </div>

        <div className={styles.timeline} style={{ opacity: stage >= 3 ? 1 : 0 }}>
          <div className={styles.timelineLine}></div>
          <div className={styles.timelinePoint} style={{ left: '15%' }}><span>SCADA</span><small>20 MS (50 HZ)</small></div>
          <div className={styles.timelinePoint} style={{ left: '50%' }}><span>OSCILOGRAMAS</span><small>1 KHZ</small></div>
          <div className={styles.timelinePoint} style={{ left: '85%' }}><span>PMU</span><small>50 HZ SINCRONIZADOS</small></div>
        </div>

        {stage >= 4 && (
          <div className={styles.warningBox}>
            ⚠️ <strong>LIMITACIÓN LLM:</strong> NO APLICABLE A FENÓMENOS DE DINÁMICA RÁPIDA (TAP-LAG, UFLS). ANÁLISIS CAUSAL EXCLUSIVO DEL AUTOR.
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTES: REE · ICAI · ENTSO-E · NREL · ELABORACIÓN PROPIA</div>
    </div>
  );
}