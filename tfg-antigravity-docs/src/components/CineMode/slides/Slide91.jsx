// slides/Slide91.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide91.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide91({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.3) setStage(1);
  }, [slideProgress]);

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="RESUMEN DE CIFRAS" color="#b91c1c" />
        <DigitalClock fixedTime="28 DE ABRIL 2025" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>IMPACTO INMEDIATO</h1>
        <h2 className={styles.subtitle}>SEIS CIFRAS QUE DEFINEN UNA CRISIS</h2>

        <div style={{ opacity, width: '100%' }}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>27</span>
              <span className={styles.metricUnit}>SEGUNDOS</span>
              <p>DURACIÓN DE LA CASCADA DESDE EL PRIMER DISPARO HASTA EL CERO ELÉCTRICO</p>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>31</span>
              <span className={styles.metricUnit}>GW</span>
              <p>POTENCIA TOTAL INTERRUMPIDA (~100% DE LA DEMANDA)</p>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>55</span>
              <span className={styles.metricUnit}>MILLONES</span>
              <p>PERSONAS AFECTADAS EN ESPAÑA Y PORTUGAL</p>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>2.500</span>
              <span className={styles.metricUnit}>MW</span>
              <p>PÉRDIDA DE GENERACIÓN EN LOS PRIMEROS 20 SEGUNDOS</p>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>82</span>
              <span className={styles.metricUnit}>%</span>
              <p>GENERACIÓN IBR (ELECTRÓNICA DE POTENCIA) EN EL MIX INSTANTÁNEO</p>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>18</span>
              <span className={styles.metricUnit}>HORAS</span>
              <p>TIEMPO DE REPOSICIÓN DEL 99,95% DEL SUMINISTRO</p>
            </div>
          </div>
          <div className={styles.footnote}>
            EL APAGÓN NO FUE CAUSADO POR FALTA DE ENERGÍA DISPONIBLE, SINO POR UN FALLO
            CATASTRÓFICO EN EL CONTROL DE TENSIÓN DE UNA RED CON 82% DE IBR
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE · ENTSO-E · COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}