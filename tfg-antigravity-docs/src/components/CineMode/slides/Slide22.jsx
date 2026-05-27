// slides/Slide22.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide22.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide22({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const barProgress = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));

  const mix = [
    { label: 'Solar', value: 53, color: '#f59e0b' },
    { label: 'Eólica', value: 11, color: '#3b82f6' },
    { label: 'Nuclear', value: 10, color: '#b91c1c' },
    { label: 'Gas CCGT', value: 3, color: '#5a6e8a' },
    { label: 'Bombeo+Exp', value: 23, color: '#10b981' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CRÍTICO – PRE-EVENTO" color="#b91c1c" />
        <DigitalClock fixedTime="13:32:30" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>PARADOJA DE LA ABUNDANCIA</h1>
        <h2 className={styles.subtitle}>Demanda valle + máximo renovable = mínimos históricos de generación síncrona</h2>

        {stage >= 1 && (
          <div className={styles.metricsRow}>
            <div className={styles.metricCard}><span className={styles.metricVal}>25.184</span><span className={styles.metricUnit}>MW</span><span className={styles.metricLabel}>demanda (56% punta)</span></div>
            <div className={styles.metricCard}><span className={styles.metricVal}>82</span><span className={styles.metricUnit}>%</span><span className={styles.metricLabel}>penetración IBR</span></div>
            <div className={styles.metricCard}><span className={styles.metricVal}>1,3</span><span className={styles.metricUnit}>s</span><span className={styles.metricLabel}>inercia sur (umbral 2,0)</span></div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.mixBox} style={{ opacity: barProgress }}>
            <h3>Mix instantáneo (12:30 CEST)</h3>
            <div className={styles.barList}>
              {mix.map((item, idx) => (
                <div key={idx} className={styles.barItem}>
                  <span className={styles.barLabel}>{item.label}</span>
                  <div className={styles.barBg}><div className={styles.barFill} style={{ width: `${item.value * barProgress}%`, backgroundColor: item.color }} /></div>
                  <span className={styles.barValue}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.episodesBox}>
            <h3>Episodios precursores (abril 2025)</h3>
            <div className={styles.timelineEvents}>
              <div><span>16/04</span> oscilaciones tensión</div>
              <div><span>22/04</span> pico >430 kV</div>
              <div><span>24/04</span> inestabilidad red</div>
            </div>
            <div className={styles.quote}>“El sistema operaba con márgenes de control dinámico de tensión estructuralmente estrechos” – ICAI</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ENTSO-E / ICAI – Perfil de generación 28-A y episodios previos</div>
    </div>
  );
}
