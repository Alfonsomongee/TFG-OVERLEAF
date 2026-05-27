// slides/Slide42.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide42.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide42({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const strategyOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const failuresOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const scaffoldingOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="BLACK START" color="#b91c1c" />
        <DigitalClock fixedTime="12:33:30 – 20:22" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>BLACK START: HIDROELÉCTRICAS Y CICLOS COMBINADOS</h1>
        <h2 className={styles.subtitle}>LOS IBR GRID-FOLLOWING NO PUEDEN ARRANCAR SIN RED EXTERNA</h2>

        {/* ESTRATEGIA DUAL */}
        <div style={{ opacity: strategyOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>ESTRATEGIA DUAL DE RE-ENERGIZACIÓN</h3>
          <svg viewBox="0 0 700 140" className={styles.strategySvg}>
            <rect x="20" y="20" width="200" height="100" rx="10" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <text x="120" y="55" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">TOP-DOWN</text>
            <text x="120" y="75" textAnchor="middle" fill="#cbd5e1" fontSize="12">FRANCIA / MARRUECOS</text>
            <text x="120" y="95" textAnchor="middle" fill="#cbd5e1" fontSize="12">REFERENCIA DE TENSIÓN</text>
            <rect x="480" y="20" width="200" height="100" rx="10" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="580" y="55" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">BOTTOM-UP</text>
            <text x="580" y="75" textAnchor="middle" fill="#cbd5e1" fontSize="12">HIDROELÉCTRICAS</text>
            <text x="580" y="95" textAnchor="middle" fill="#cbd5e1" fontSize="12">GALICIA, ASTURIAS, DUERO</text>
            <path d="M220,70 L480,70" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6" />
          </svg>
        </div>

        {/* INTENTOS FALLIDOS */}
        {stage >= 2 && (
          <div style={{ opacity: failuresOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>INTENTOS DE ARRANQUE AUTÓNOMO – FALLOS SIGNIFICATIVOS</h3>
            <div className={styles.failureList}>
              <div>❌ ISLA DE CANTABRIA – NO SE SOSTUVO</div>
              <div>❌ ISLA DE LEVANTE – REINICIO NECESARIO</div>
              <div>❌ ANDALUCÍA – ARRANQUE INFructuoso (SOPORTE MARRUECOS)</div>
              <div>⚠️ MADRID – NO ESTABILIZÓ PARÁMETROS TRAS VARIOS INTENTOS</div>
            </div>
          </div>
        )}

        {/* ANDAMIAJE ELECTROMAGNÉTICO */}
        {stage >= 3 && (
          <div style={{ opacity: scaffoldingOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>CONSOLIDACIÓN: CICLOS COMBINADOS Y NUCLEARES</h3>
            <div className={styles.scaffoldNote}>
              APORTAN POTENCIA DE CORTOCIRCUITO (Ssc), INERCIA (H) Y GESTIÓN DINÁMICA DE REACTIVA
            </div>
            <div className={styles.metricInline}>
              <span>PORTUGAL: HPP 1-CENTRO + CCGT 1-NORTE</span>
              <span>SINCRONIZACIÓN A LAS 20:22 CEST</span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ENTSO-E / REE – ANÁLISIS DE BLACK START</div>
    </div>
  );
}