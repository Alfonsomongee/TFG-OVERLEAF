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

  const triangleProgress = Math.min(1, Math.max(0, (slideProgress - 0.25) / 0.3));
  const tableProgress = Math.min(1, Math.max(0, (slideProgress - 0.65) / 0.2));
  const metricsProgress = Math.min(1, Math.max(0, (slideProgress - 0.85) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ANÁLISIS POST-EVENTO" color="#b91c1c" />
        <DigitalClock fixedTime="13:34:22" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title} style={{ opacity: stage >= 1 ? 1 : 0, transform: `translateY(${stage >= 1 ? 0 : 20}px)` }}>
          TRES NARRATIVAS EN CONFLICTO
        </h1>
        <h2 className={styles.subtitle} style={{ opacity: stage >= 2 ? 1 : 0 }}>
          28 de abril de 2025 – Colapso de tensión del sistema ibérico
        </h2>

        {stage >= 3 && (
          <div className={styles.triangleContainer}>
            <svg viewBox="0 0 800 450" className={styles.triangleSvg}>
              <polygon
                points="400,50 750,400 50,400"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeDasharray="1200"
                strokeDashoffset={1200 * (1 - triangleProgress)}
              />
              {triangleProgress > 0.4 && (
                <>
                  <circle cx="400" cy="50" r="8" fill="#3b82f6" />
                  <text x="400" y="35" textAnchor="middle" fill="#e0e6f0" fontSize="18" fontWeight="bold">ADMINISTRACIÓN</text>
                  <text x="400" y="75" textAnchor="middle" fill="#cbd5e1" fontSize="13">Causa: Incumplimiento P.O. 7.4</text>
                  <circle cx="750" cy="400" r="8" fill="#b91c1c" />
                  <text x="750" y="385" textAnchor="middle" fill="#b91c1c" fontSize="18" fontWeight="bold">SECTOR GENERADOR</text>
                  <text x="750" y="425" textAnchor="middle" fill="#cbd5e1" fontSize="13">Causa: Maniobra de mallado (Tap-Lag)</text>
                  <circle cx="50" cy="400" r="8" fill="#f59e0b" />
                  <text x="50" y="385" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold">ENTSO-E</text>
                  <text x="50" y="425" textAnchor="middle" fill="#cbd5e1" fontSize="13">Causa: Oscilaciones inter-área</text>
                </>
              )}
              {triangleProgress > 0.7 && (
                <>
                  <circle cx="400" cy="270" r="85" fill="none" stroke="#b91c1c" strokeWidth="2" strokeDasharray="6" />
                  <text x="400" y="265" textAnchor="middle" fill="#b91c1c" fontSize="22" fontFamily="Fira Code">NO CONSENSO</text>
                  <text x="400" y="290" textAnchor="middle" fill="#cbd5e1" fontSize="14">sobre causa raíz</text>
                </>
              )}
            </svg>
          </div>
        )}

        {stage >= 4 && (
          <div className={styles.comparisonTable} style={{ opacity: tableProgress }}>
            <h3>Comparativa de narrativas</h3>
            <table>
              <thead><tr><th>Institución</th><th>Tesis principal</th><th>Responsabilidad</th></tr></thead>
              <tbody>
                <tr><td>Administración</td><td>Incumplimiento P.O. 7.4</td><td>Generadores (falta reactiva)</td></tr>
                <tr><td>Generadores (ICAI)</td><td>Error operativo en mallado</td><td>Redeia (observabilidad 220 kV)</td></tr>
                <tr><td>ENTSO-E</td><td>Insuficiencia N-1 dinámico</td><td>Marco regulatorio europeo</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {stage >= 5 && (
          <div className={styles.metrics} style={{ opacity: metricsProgress }}>
            <div className={styles.metricCard}><span className={styles.metricValue}>15,2</span><span className={styles.metricUnit}>GW</span><span className={styles.metricLabel}>generación destruida</span></div>
            <div className={styles.metricCard}><span className={styles.metricValue}>60</span><span className={styles.metricUnit}>M</span><span className={styles.metricLabel}>personas afectadas</span></div>
            <div className={styles.metricCard}><span className={styles.metricValue}>7,9</span><span className={styles.metricUnit}>%</span><span className={styles.metricLabel}>interconexión ibérica</span></div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ICAI / ENTSO-E – Triangulación forense</div>
    </div>
  );
}
