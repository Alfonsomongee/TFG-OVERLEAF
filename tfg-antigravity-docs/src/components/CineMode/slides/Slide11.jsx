// slides/Slide11.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide11.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide11({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.1) setStage(1);
    if (slideProgress >= 0.25) setStage(2);
    if (slideProgress >= 0.45) setStage(3);
    if (slideProgress >= 0.65) setStage(4);
    if (slideProgress >= 0.85) setStage(5);
  }, [slideProgress]);

  const triangleOpacity = Math.min(1, Math.max(0, (slideProgress - 0.25) / 0.2));
  const verticesOpacity = Math.min(1, Math.max(0, (slideProgress - 0.45) / 0.15));
  const centerOpacity = Math.min(1, Math.max(0, (slideProgress - 0.6) / 0.1));
  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.65) / 0.15));
  const metricsOpacity = Math.min(1, Math.max(0, (slideProgress - 0.85) / 0.1));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ANÁLISIS POST-EVENTO" color="#b91c1c" />
        <DigitalClock fixedTime="13:34:22" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title} style={{ opacity: stage >= 1 ? 1 : 0, transform: `translateY(${stage >= 1 ? 0 : 15}px)` }}>
          TRES NARRATIVAS EN CONFLICTO
        </h1>
        <h2 className={styles.subtitle} style={{ opacity: stage >= 2 ? 1 : 0 }}>
          28 DE ABRIL DE 2025 – COLAPSO DE TENSIÓN DEL SISTEMA IBÉRICO
        </h2>

        <div className={styles.triangleContainer} style={{ opacity: triangleOpacity }}>
          <svg viewBox="0 0 900 480" className={styles.triangleSvg}>
            <polygon points="450,60 820,430 80,430" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            <g style={{ opacity: verticesOpacity }}>
              <circle cx="450" cy="60" r="7" fill="#3b82f6" />
              <text x="450" y="45" textAnchor="middle" fill="#e0e6f0" fontSize="18" fontWeight="bold">ADMINISTRACIÓN</text>
              <text x="450" y="85" textAnchor="middle" fill="#cbd5e1" fontSize="13">CAUSA: INCUMPLIMIENTO P.O. 7.4</text>
              <circle cx="820" cy="430" r="7" fill="#b91c1c" />
              <text x="820" y="415" textAnchor="middle" fill="#b91c1c" fontSize="18" fontWeight="bold">SECTOR GENERADOR</text>
              <text x="820" y="455" textAnchor="middle" fill="#cbd5e1" fontSize="13">CAUSA: MANIOBRA DE MALLADO (TAP-LAG)</text>
              <circle cx="80" cy="430" r="7" fill="#f59e0b" />
              <text x="80" y="415" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold">ENTSO-E</text>
              <text x="80" y="455" textAnchor="middle" fill="#cbd5e1" fontSize="13">CAUSA: OSCILACIONES INTER-ÁREA</text>
            </g>
            <g style={{ opacity: centerOpacity }}>
              <circle cx="450" cy="290" r="85" fill="none" stroke="#b91c1c" strokeWidth="2" strokeDasharray="6" />
              <text x="450" y="285" textAnchor="middle" fill="#b91c1c" fontSize="22" fontFamily="Fira Code">NO CONSENSO</text>
              <text x="450" y="310" textAnchor="middle" fill="#cbd5e1" fontSize="14">SOBRE CAUSA RAÍZ</text>
            </g>
          </svg>
        </div>

        {stage >= 4 && (
          <div className={styles.comparisonTable} style={{ opacity: tableOpacity }}>
            <h3>COMPARATIVA DE NARRATIVAS</h3>
            <table className={styles.cleanTable}>
              <thead>
                <tr><th>INSTITUCIÓN</th><th>TESIS PRINCIPAL</th><th>RESPONSABILIDAD</th></tr>
              </thead>
              <tbody>
                <tr><td>ADMINISTRACIÓN</td><td>INCUMPLIMIENTO P.O. 7.4</td><td>GENERADORES (FALTA REACTIVA)</td></tr>
                <tr><td>GENERADORES (ICAI)</td><td>ERROR OPERATIVO EN MALLADO</td><td>REDEIA (OBSERVABILIDAD 220 KV)</td></tr>
                <tr><td>ENTSO-E</td><td>INSUFICIENCIA N-1 DINÁMICO</td><td>MARCO REGULATORIO EUROPEO</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {stage >= 5 && (
          <div className={styles.metrics} style={{ opacity: metricsOpacity }}>
            <div className={styles.metricCard}><span className={styles.metricValue}>15,2</span><span className={styles.metricUnit}>GW</span><span className={styles.metricLabel}>GENERACIÓN DESTRUIDA</span></div>
            <div className={styles.metricCard}><span className={styles.metricValue}>60</span><span className={styles.metricUnit}>M</span><span className={styles.metricLabel}>PERSONAS AFECTADAS</span></div>
            <div className={styles.metricCard}><span className={styles.metricValue}>7,9</span><span className={styles.metricUnit}>%</span><span className={styles.metricLabel}>INTERCONEXIÓN IBÉRICA</span></div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: REE / ICAI / ENTSO-E – TRIANGULACIÓN FORENSE</div>
    </div>
  );
}