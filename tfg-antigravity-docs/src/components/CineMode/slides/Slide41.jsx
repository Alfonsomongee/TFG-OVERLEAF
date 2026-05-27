// slides/Slide41.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide41.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide41({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const actionsOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const fragmentOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FASE 4 – REPOSICIÓN" color="#3b82f6" />
        <DigitalClock fixedTime="12:33:30 – 07:05" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>REACCIÓN Y REPOSICIÓN</h1>
        <h2 className={styles.subtitle}>19 HORAS DE MANIOBRAS ININTERRUMPIDAS PARA RECUPERAR EL SUMINISTRO</h2>

        {/* TABLA DE FASES */}
        <div style={{ opacity: tableOpacity, width: '100%' }}>
          <h3 className={styles.tableTitle}>CRONOLOGÍA OFICIAL DEL INCIDENTE</h3>
          <table className={styles.cleanTable}>
            <thead>
              <tr><th>FASE</th><th>VENTANA TEMPORAL</th><th>DESCRIPCIÓN</th></tr>
            </thead>
            <tbody>
              <tr><td>FASE 0</td><td>DÍAS PREVIOS</td><td>INESTABILIDAD LATENTE DE TENSIONES</td></tr>
              <tr><td>FASE 1</td><td>12:00–12:30 CEST</td><td>OSCILACIONES ELECTROMECÁNICAS</td></tr>
              <tr><td>FASE 2</td><td>12:32:00–12:33:18 CEST</td><td>PÉRDIDAS DE GENERACIÓN POR SOBRETENSIÓN</td></tr>
              <tr className={styles.blackoutRow}><td>FASE 3</td><td>12:33:18–12:33:30 CEST</td><td>CASCADA HASTA CERO DE TENSIÓN</td></tr>
              <tr><td>FASE 4</td><td>12:33:30 CEST – 14:36 (29-A)</td><td>REPOSICIÓN PROGRESIVA DEL SUMINISTRO</td></tr>
            </tbody>
          </table>
        </div>

        {/* REACCIÓN INMEDIATA */}
        {stage >= 2 && (
          <div style={{ opacity: actionsOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>REACCIÓN INMEDIATA (P.O. 1.6)</h3>
            <div className={styles.timelineEvents}>
              <div><span>12:34</span> REE CONFIRMA CON REN QUE PORTUGAL ESTÁ SIN TENSIÓN</div>
              <div><span>12:36</span> NOTIFICACIÓN EAS – ESTADO "RESTAURACIÓN"</div>
              <div><span>12:44</span> SUSPENSIÓN DE MERCADOS INTRA-DIARIOS</div>
            </div>
          </div>
        )}

        {/* FRAGMENTACIÓN EN 7 ISLAS */}
        {stage >= 3 && (
          <div style={{ opacity: fragmentOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>FRAGMENTACIÓN CONTROLADA – 7 ISLAS ELÉCTRICAS</h3>
            <svg viewBox="0 0 600 200" className={styles.fragmentSvg}>
              <rect x="50" y="40" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="90" y="70" textAnchor="middle" fill="#cbd5e1" fontSize="12">SUR</text>
              <rect x="150" y="40" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="190" y="70" textAnchor="middle" fill="#cbd5e1" fontSize="12">TAJO</text>
              <rect x="250" y="40" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="290" y="70" textAnchor="middle" fill="#cbd5e1" fontSize="12">LEVANTE</text>
              <rect x="350" y="40" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="390" y="70" textAnchor="middle" fill="#cbd5e1" fontSize="12">NORTE</text>
              <rect x="100" y="110" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="140" y="140" textAnchor="middle" fill="#cbd5e1" fontSize="12">GALICIA</text>
              <rect x="200" y="110" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="240" y="140" textAnchor="middle" fill="#cbd5e1" fontSize="12">DUERO</text>
              <rect x="300" y="110" width="80" height="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="340" y="140" textAnchor="middle" fill="#cbd5e1" fontSize="12">PORTUGAL</text>
              <text x="300" y="185" textAnchor="middle" fill="#8892b0" fontSize="12">CADA ISLA DEBÍA ESTABILIZARSE INDIVIDUALMENTE</text>
            </svg>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ENTSO-E / REE – COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}