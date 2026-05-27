// slides/Slide34.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide34.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide34({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FASE 3 – CASCADA" color="#b91c1c" />
        <DigitalClock fixedTime="12:33:18 – 12:33:29" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>FASE 3: EL CAMINO HACIA EL CERO DE TENSIÓN</h1>
        <h2 className={styles.subtitle}>11 segundos de reacción en cadena</h2>

        {stage >= 1 && (
          <div className={styles.cascadeBox}>
            <h3>Desconexiones en cascada de IBR</h3>
            <div className={styles.timelineEvents}>
              <div><span>12:33:16</span> Badajoz → pérdida de <strong>725 MW</strong></div>
              <div><span>12:33:17</span> Segovia, Sevilla, Huelva → <strong>930 MW</strong> adicionales</div>
              <div><span>12:33:19–24</span> <strong>+15 GW</strong> de generación destruida (≈60% demanda nacional)</div>
            </div>
            <img src="/figuras/cascada_desconexiones_ibr.png" alt="Cascada de desconexiones IBR" className={styles.imageInline} />
            <div className={styles.imageCaption}>Propagación geográfica de la cascada. Fuente: Comité de Análisis del Gobierno</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.uflsBox}>
            <h3>Paradoja del UFLS</h3>
            <p>Al cruzar 49,5 Hz se desconectaron >2.000 MW de bombeo hidráulico y demanda industrial. Pero eliminar sumideros reactivos empeoró la sobretensión.</p>
            <img src="/figuras/evolucion_acoplada_tension_frecuencia.png" alt="Evolución tensión-frecuencia" className={styles.imageInline} />
            <div className={styles.imageCaption}>Incremento de tensión precede a caída de frecuencia – colapso primariamente capacitivo. Fuente: Comité de Análisis del Gobierno</div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.flowsBox}>
            <h3>Inversión de flujos y aislamiento</h3>
            <div className={styles.flows}>
              <div>Intento de importación AC desde Francia: <strong className={styles.red}>4.609 MW</strong></div>
              <div>Exportación fijada HVDC INELFE-1 (PMODE1): <strong className={styles.red}>1.000 MW</strong></div>
            </div>
            <img src="/figuras/inversion_flujos_hvdc.png" alt="Inversión de flujos" className={styles.imageInline} />
            <div className={styles.warning}>A las 12:33:21 CEST, pérdida de sincronismo → apertura de enlaces AC → aislamiento de la península ibérica</div>
            <div className={styles.final}>Cero de tensión confirmado a las <strong>12:33:29.741 CEST</strong></div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ENTSO-E / ICAI – Registros SCADA y PMU</div>
    </div>
  );
}
