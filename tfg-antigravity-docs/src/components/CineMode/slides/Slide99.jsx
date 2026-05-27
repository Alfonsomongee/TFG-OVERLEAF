// slides/Slide99.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide99.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide99({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.6) setStage(2);
  }, [slideProgress]);

  const trilemaOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.4));
  const leccionOpacity = Math.min(1, Math.max(0, (slideProgress - 0.6) / 0.3));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="LECCIÓN FINAL" color="#b91c1c" />
        <DigitalClock fixedTime="28 DE ABRIL DE 2025" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>EL TRILEMA DE LA TRANSICIÓN ENERGÉTICA</h1>
        <h2 className={styles.subtitle}>TRES TENSIONES ESTRUCTURALES QUE CONVERGIERON EL 28-A</h2>

        <div style={{ opacity: trilemaOpacity, width: '100%' }}>
          <div className={styles.trilemaGrid}>
            <div className={styles.tensionCard}>
              <span className={styles.tensionIcon}>⚙️</span>
              <strong>TENSIÓN TECNOLÓGICA</strong>
              <p>DESCARBONIZACIÓN ↔ ESTABILIDAD DINÁMICA</p>
              <div className={styles.tensionDetail}>LA ORDEN DE MÉRITO DESPLAZÓ LOS CCGTS, VACIANDO AL SISTEMA DE INERCIA Y POTENCIA DE CORTOCIRCUITO EN EL INSTANTE CRÍTICO</div>
            </div>
            <div className={styles.tensionCard}>
              <span className={styles.tensionIcon}>📜</span>
              <strong>TENSIÓN REGULATORIA</strong>
              <p>DESCARBONIZACIÓN ↔ ASEQUIBILIDAD</p>
              <div className={styles.tensionDetail}>MÁS DE 500 HORAS DE PRECIO CERO O NEGATIVO EN 2024 – PRECIO MEDIO DIARIO DE 18,50 €/MWH EL 28-A</div>
            </div>
            <div className={styles.tensionCard}>
              <span className={styles.tensionIcon}>💰</span>
              <strong>TENSIÓN ECONÓMICA</strong>
              <p>ESTABILIDAD DINÁMICA ↔ ASEQUIBILIDAD</p>
              <div className={styles.tensionDetail}>SERVICIOS ANCIALES (INERCIA, REACTIVA DINÁMICA, FFR) NO REMUNERADOS EXPLÍCITAMENTE EN EL DISEÑO DE MERCADO</div>
            </div>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: leccionOpacity, width: '100%' }}>
            <div className={styles.leccionBox}>
              <strong>LA LECCIÓN DEL 28-A</strong>
              <p>LA TRANSICIÓN ENERGÉTICA, PARA SER OPERATIVAMENTE SOSTENIBLE, DEBE PRODUCIRSE SIMULTÁNEAMENTE EN LOS TRES PLANOS QUE EL TRILEMA IDENTIFICA:</p>
              <div className={styles.planos}>
                <span>TÉCNICO</span> → <span>REGULATORIO</span> → <span>ECONÓMICO</span>
              </div>
              <p>NINGUNA ASIMETRÍA ENTRE ELLOS REPRODUCE LAS CONDICIONES DE VULNERABILIDAD QUE EL 28-A MATERIALIZÓ.</p>
            </div>
            <div className={styles.finalStatement}>
              EL 28 DE ABRIL DE 2025 ES, EN ESTE SENTIDO, MENOS UN ACCIDENTE IBÉRICO QUE UN PRECEDENTE EUROPEO.
            </div>
            <div className={styles.tagline}>
              LAS CIFRAS HABLAN POR SÍ SOLAS: 27 SEGUNDOS, 31 GW, 55 MILLONES DE PERSONAS, 18 HORAS DE REPOSICIÓN.
              LA INGENIERÍA ELÉCTRICA CONTINENTAL TUVO QUE ADMITIR QUE EL SIGLO XX HABÍA TERMINADO.
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: SÍNTESIS DE INFORMES – ELABORACIÓN PROPIA</div>
    </div>
  );
}