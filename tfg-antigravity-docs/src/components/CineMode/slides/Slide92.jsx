// slides/Slide92.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide92.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide92({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  // Datos del mix: solar, nuclear, eólica, hidráulica, CCGT
  const technologies = [
    { name: 'SOLAR FV', value: 19155, percent: 65, color: '#f59e0b' },
    { name: 'NUCLEAR', value: 3870, percent: 13, color: '#10b981' },
    { name: 'EÓLICA', value: 3540, percent: 12, color: '#3b82f6' },
    { name: 'HIDRÁULICA', value: 2000, percent: 7, color: '#06b6d4' },
    { name: 'CCGT (GAS)', value: 990, percent: 3, color: '#5a6e8a' }
  ];
  const maxMW = 20000;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="GENERACIÓN PRE-APAGÓN" color="#f59e0b" />
        <DigitalClock fixedTime="12:30 CEST" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>GENERACIÓN EN EL MOMENTO DEL COLAPSO</h1>
        <h2 className={styles.subtitle}>82% IBR (ELECTRÓNICA DE POTENCIA) – 18% SÍNCRONA</h2>

        <div style={{ opacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>MIX INSTANTÁNEO (TOTAL ~29.600 MW)</h3>
          <div className={styles.barsContainer}>
            {technologies.map((tech, idx) => (
              <div key={idx} className={styles.barItem}>
                <span className={styles.barLabel}>{tech.name}</span>
                <div className={styles.barBg}>
                  <div className={styles.barFill} style={{ width: `${(tech.value / maxMW) * 100}%`, backgroundColor: tech.color }} />
                </div>
                <span className={styles.barValue}>{tech.value.toLocaleString()} MW ({tech.percent}%)</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryBox}>
            <div>⚠️ GENERACIÓN SÍNCRONA (NUCLEAR + HIDRÁULICA + CCGT): <strong>18%</strong></div>
            <div>🔌 GENERACIÓN IBR (SOLAR + EÓLICA): <strong>77%</strong> (MÁS AUTOCONSUMO DISTRIBUIDO → 82%)</div>
            <div className={styles.conclusion}>EL 82% DE LA GENERACIÓN OPERABA EN MODO GRID-FOLLOWING CON FACTOR DE POTENCIA FIJO – SIN CAPACIDAD DE CONTROL DINÁMICO DE TENSIÓN</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE · ESIOS · INFORME DE EXPLOTACIÓN 28-A</div>
    </div>
  );
}