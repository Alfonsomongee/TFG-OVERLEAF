// slides/Slide84.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide84.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide84({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const conceptOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const detonanteOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const pllOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ACTUALIZACIÓN 2026" color="#b91c1c" />
        <DigitalClock fixedTime="UN AÑO DESPUÉS" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>NUEVO PARADIGMA: OVERVOLTAGE-DRIVEN BLACKOUT</h1>
        <h2 className={styles.subtitle}>APAGÓN INDUCIDO POR SOBRETENSIÓN – CONCEPTO INÉDITO</h2>

        <div style={{ opacity: conceptOpacity, width: '100%' }}>
          <div className={styles.conceptBox}>
            <strong>ESTUDIO IIT (UNIVERSIDAD PONTIFICIA COMILLAS) – VALIDADO POR SCIENCE DIRECT (ROUCO, LOBATO, ECHAVARREN, 2026)</strong>
            <p>LA SECUENCIA FATAL NO FUE UNA CAÍDA DE TENSIÓN GENERALIZADA, SINO UNA CASCADA DE DISPAROS POR SOBRETENSIÓN MASIVA.</p>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: detonanteOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>DETONANTE DE LA CASCADA</h3>
            <div className={styles.detonanteBox}>
              <div>⚠️ DISPARO DEL TRANSFORMADOR 400/220 KV EN GRANADA (12:32:57 CEST)</div>
              <div>📉 PÉRDIDA DE <strong>355 MW</strong> DE POTENCIA ACTIVA</div>
              <div>⚡ DISPARO POR SOBRETENSIÓN – NO POR SUBFRECUENCIA</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: pllOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>FALLO DE LOS INVERSORES GRID-FOLLOWING</h3>
            <div className={styles.pllBox}>
              <div>🔴 PLANTAS CON <strong>FACTOR DE POTENCIA FIJO</strong> INYECTARON RAMPAS DE POTENCIA REACTIVA ANTE OSCILACIONES</div>
              <div>🔴 BAJO <strong>SHORT-CIRCUIT RATIO (SCR)</strong> BAJO, EL PLL PROVOCÓ INESTABILIDADES</div>
              <div>🔴 EL SISTEMA FUE INCAPAZ DE AMORTIGUAR</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: IIT-UNIVERSIDAD PONTIFICIA COMILLAS · SCIENCE DIRECT · ENTSO-E FINAL REPORT (20/03/2026)</div>
    </div>
  );
}