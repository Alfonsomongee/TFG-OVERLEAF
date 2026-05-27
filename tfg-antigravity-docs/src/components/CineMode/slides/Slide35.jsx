// slides/Slide35.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide35.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide35({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.6) setStage(2);
  }, [slideProgress]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CONCLUSIONES" color="#3b82f6" />
        <DigitalClock fixedTime="POST-EVENT" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>RESUMEN CRONOLÓGICO Y LECCIONES CLAVE</h1>
        <h2 className={styles.subtitle}>El colapso más severo del sistema europeo continental</h2>

        {stage >= 1 && (
          <div className={styles.timelineVertical}>
            <div className={styles.event}><span>12:03</span> Oscilación forzada 0,6 Hz (amortiguamiento 1%)</div>
            <div className={styles.event}><span>12:19</span> Modo inter-área 0,2 Hz (efecto látigo)</div>
            <div className={styles.event}><span>12:30</span> Mallado de 11 líneas – reducción del margen 57%</div>
            <div className={styles.event}><span>12:32:57</span> Disparo raíz Granada (pérdida 165 MVAr)</div>
            <div className={styles.event}><span>12:33:16–24</span> Cascada IBR >15 GW – paradoja UFLS</div>
            <div className={styles.event}><span>12:33:21</span> Apertura enlaces AC por pérdida de sincronismo</div>
            <div className={styles.event}><span>12:33:29.741</span> Cero de tensión – aislamiento peninsular</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.lessonsBox}>
            <h3>Lecciones estructurales</h3>
            <ul>
              <li>⚠️ La baja inercia (&lt;2,0 s) y la reducida potencia de cortocircuito hacen inviable absorber transitorios de tensión.</li>
              <li>⚠️ El Tap-Lag desacopla la monitorización SCADA de la realidad de la red subyacente.</li>
              <li>⚠️ El UFLS puede ser contraproducente en colapsos de tensión (paradoja).</li>
              <li>⚠️ El modo PMODE1 del HVDC impidió la importación de emergencia (–22% de soporte neto).</li>
              <li>⚠️ El EAS no detectó la transición Normal → Blackout sin estados intermedios.</li>
            </ul>
            <div className={styles.metricFinal}>
              <span className={styles.metricValLarge}>60M</span> personas afectadas · <span className={styles.metricValLarge}>15 GW</span> destruidos · <span className={styles.metricValLarge}>7,9%</span> interconexión
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ENTSO-E / ICAI / NREL – Síntesis forense</div>
    </div>
  );
}
