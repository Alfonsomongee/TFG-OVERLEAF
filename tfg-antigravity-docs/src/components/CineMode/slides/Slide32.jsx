// slides/Slide32.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide32.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide32({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FASE 1 – DISPARO RAÍZ" color="#b91c1c" />
        <DigitalClock fixedTime="12:32:57" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>FASE 1: DISPARO RAÍZ EN GRANADA</h1>
        <h2 className={styles.subtitle}>Un transformador 400/220 kV se desconecta por sobretensión (244 kV)</h2>

        {stage >= 1 && (
          <div className={styles.lossBox}>
            <h3>Pérdidas instantáneas</h3>
            <div className={styles.metricsRow}>
              <div className={styles.metricSmall}><span className={styles.metricVal}>355</span><span className={styles.metricUnit}>MW</span><span className={styles.metricLabel}>potencia activa</span></div>
              <div className={styles.metricSmall}><span className={styles.metricVal}>165</span><span className={styles.metricUnit}>MVAr</span><span className={styles.metricLabel}>absorción reactiva</span></div>
            </div>
            <div className={styles.consequence}>⚠️ Escalón ascendente de tensión en nudos circundantes – detonante de la reacción en cadena</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.controversyBox}>
            <h3>Controversia técnica sobre el origen de la oscilación</h3>
            <div className={styles.twoColumns}>
              <div className={styles.column}>
                <span className={styles.ree}>REE</span>
                <p>Oscilación forzada por lazo de control de planta fotovoltaica en Badajoz</p>
              </div>
              <div className={styles.column}>
                <span className={styles.icai}>ICAI</span>
                <p>Modo natural inter-área exacerbado por amortiguamiento sistémico del 1% (falta de PSS en ciclos combinados)</p>
              </div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.freqBox}>
            <img src="/figuras/evolucion_frecuencia_fase1.png" alt="Evolución de frecuencia" className={styles.imageInline} />
            <div className={styles.imageCaption}>Frecuencia cae de 50,00 Hz a 48,30 Hz en 11 segundos. Fuente: ENTSO-E open data</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ICAI / ENTSO-E – Registros oscilográficos</div>
    </div>
  );
}
