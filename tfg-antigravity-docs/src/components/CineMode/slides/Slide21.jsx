// slides/Slide21.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide21.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide21({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const donutProgress = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const barsProgress = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CONTEXTO – EVOLUCIÓN" color="#3b82f6" />
        <DigitalClock fixedTime="13:32:00" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>EVOLUCIÓN DEL PARQUE GENERADOR</h1>
        <h2 className={styles.subtitle}>Del dominio síncrono al mix dominado por IBR</h2>

        {stage >= 1 && (
          <div className={styles.chartsRow}>
            <div className={styles.donutCard}>
              <h3>Mix de generación</h3>
              <div className={styles.donuts}>
                <div className={styles.donut}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#1e2a3a" strokeWidth="20" />
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#b91c1c" strokeWidth="20" strokeDasharray="314" strokeDashoffset={314 * (1 - 0.65 * donutProgress)} transform="rotate(-90 70 70)" />
                    <text x="70" y="75" textAnchor="middle" fill="#b91c1c" fontSize="18" fontWeight="bold">65%</text>
                    <text x="70" y="95" textAnchor="middle" fill="#cbd5e1" fontSize="11">Térm+Nuc</text>
                    <text x="70" y="30" textAnchor="middle" fill="#3b82f6" fontSize="12">2010</text>
                  </svg>
                </div>
                <div className={styles.donut}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#1e2a3a" strokeWidth="20" />
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="314" strokeDashoffset={314 * (1 - 0.59 * donutProgress)} transform="rotate(-90 70 70)" />
                    <text x="70" y="75" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="bold">59%</text>
                    <text x="70" y="95" textAnchor="middle" fill="#cbd5e1" fontSize="11">Renovable</text>
                    <text x="70" y="30" textAnchor="middle" fill="#3b82f6" fontSize="12">2024</text>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.barsCard}>
              <h3>Capacidad instalada (enero 2025)</h3>
              <div className={styles.barList}>
                <div className={styles.barItem}><span className={styles.barLabel}>Solar</span><div className={styles.barBg}><div className={styles.barFill} style={{ width: `${48.1 * barsProgress}%`, backgroundColor: '#f59e0b' }} /></div><span className={styles.barValue}>48,1 GW</span></div>
                <div className={styles.barItem}><span className={styles.barLabel}>Eólica</span><div className={styles.barBg}><div className={styles.barFill} style={{ width: `${33.1 * barsProgress}%`, backgroundColor: '#3b82f6' }} /></div><span className={styles.barValue}>33,1 GW</span></div>
                <div className={styles.barItem}><span className={styles.barLabel}>CCGT</span><div className={styles.barBg}><div className={styles.barFill} style={{ width: `${26 * barsProgress}%`, backgroundColor: '#5a6e8a' }} /></div><span className={styles.barValue}>26,0 GW</span></div>
                <div className={styles.barItem}><span className={styles.barLabel}>Nuclear</span><div className={styles.barBg}><div className={styles.barFill} style={{ width: `${5.5 * barsProgress}%`, backgroundColor: '#b91c1c' }} /></div><span className={styles.barValue}>5,5 GW</span></div>
              </div>
            </div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.bottomNote}>
            <span className={styles.metricHighlight}>100 GW</span> de capacidad renovable instalada
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.warningNote}>⚠️ Desplazamiento de masas rotatorias → baja inercia síncrona y reducción de potencia de cortocircuito</div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ESIOS / NREL – Evolución del mix 2010-2025</div>
    </div>
  );
}
