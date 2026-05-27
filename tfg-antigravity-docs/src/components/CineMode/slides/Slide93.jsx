// slides/Slide93.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide93.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide93({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.3) setStage(1);
  }, [slideProgress]);

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CASCADA" color="#b91c1c" />
        <DigitalClock fixedTime="12:32:57 – 12:33:27" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>LA CASCADA DE 27 SEGUNDOS</h1>
        <h2 className={styles.subtitle}>SEIS EVENTOS CRÍTICOS – DEL DISPARO RAÍZ AL CERO ELÉCTRICO</h2>

        <div style={{ opacity, width: '100%' }}>
          <div className={styles.timeline}>
            <div className={styles.event}>
              <span className={styles.time}>T = 0,0 S</span>
              <span className={styles.badge}>EVENTO 1</span>
              <p>DISPARO TRANSFORMADOR 400/220 KV, GRANADA – <strong>−355 MW</strong> (PÉRDIDA DE 165 MVAr DE ABSORCIÓN REACTIVA)</p>
            </div>
            <div className={styles.event}>
              <span className={styles.time}>T = 19,34 S</span>
              <span className={styles.badge}>EVENTO 2</span>
              <p>DESCONEXIÓN BADAJOZ (CSP + FV) – <strong>−727 MW</strong> ACUMULADO: −1.082 MW</p>
            </div>
            <div className={styles.event}>
              <span className={styles.time}>T = 20,25–20,88 S</span>
              <span className={styles.badge}>EVENTO 3</span>
              <p>CASCADA SEVILLA / HUELVA / CÁCERES / SEGOVIA – <strong>−~1.150 MW</strong> ACUMULADO: −2.232 MW</p>
            </div>
            <div className={styles.event}>
              <span className={styles.time}>T = 23,53 S</span>
              <span className={styles.badge}>EVENTO 4</span>
              <p>AISLAMIENTO DE IBERIA – TRIP LÍNEAS AC FRANCIA (ANSI 78) – PÉRDIDA DE IMPORTACIÓN (4.609 MW PICO)</p>
            </div>
            <div className={styles.event}>
              <span className={styles.time}>T = 25,88 S</span>
              <span className={styles.badge}>EVENTO 5</span>
              <p>NADIR DE FRECUENCIA: <strong>47,79 HZ</strong> – UFLS FINAL, DISPARO NUCLEARES, BLOQUEO HVDC INELFE</p>
            </div>
            <div className={styles.event}>
              <span className={styles.time}>T = 27,18 S</span>
              <span className={styles.badge}>EVENTO 6</span>
              <p>CERO ELÉCTRICO – TENSIÓN &lt; 1 KV EN 400 KV – APAGÓN TOTAL EN ESPAÑA Y PORTUGAL</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE · ENTSO-E · COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}