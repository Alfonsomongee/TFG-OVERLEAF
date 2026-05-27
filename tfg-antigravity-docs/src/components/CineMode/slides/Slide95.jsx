// slides/Slide95.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide95.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide95({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.3) setStage(1);
  }, [slideProgress]);

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="INTERCONEXIONES" color="#f59e0b" />
        <DigitalClock fixedTime="12:30 CEST" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>LAS INTERCONEXIONES</h1>
        <h2 className={styles.subtitle}>EL FACTOR GEOGRÁFICO QUE CONFINÓ LA CRISIS</h2>

        <div style={{ opacity, width: '100%' }}>
          <table className={styles.cleanTable}>
            <thead><tr><th>INTERCONEXIÓN</th><th>FLUJO PRE-APAGÓN</th><th>CAPACIDAD NOMINAL</th><th>UTILIZACIÓN</th></tr></thead>
            <tbody>
              <tr><td className={styles.label}>FRANCIA AC (400 KV)</td><td>870 MW EXPORT</td><td>2.700 MW</td><td>32%</td></tr>
              <tr><td className={styles.label}>HVDC INELFE</td><td>1.000 MW CONSTANTE</td><td>2.000 MW</td><td>50% (PMODE1)</td></tr>
              <tr><td className={styles.label}>PORTUGAL (ES→PT)</td><td>2.600 MW</td><td>3.900 MW</td><td>67%</td></tr>
              <tr><td className={styles.label}>MARRUECOS (HVDC)</td><td>800 MW</td><td>900 MW</td><td>89% (PRIMERA EN DESCONECTARSE)</td></tr>
            </tbody>
          </table>
          <div className={styles.conclusionBox}>
            <div>⚠️ RATIO DE INTERCONEXIÓN IBÉRICA: <strong>3–5%</strong> (CAPACIDAD DE APOYO EXTERNO ~900–1.500 MW FRENTE A DEMANDA DE 25–30 GW)</div>
            <div>⚡ DURANTE LA CASCADA: INTENTO DE IMPORTACIÓN MASIVA DE HASTA <strong>4.609 MW</strong> POR LÍNEAS AC – SUPERÓ CAPACIDAD NOMINAL (2.700 MW) → ACELERÓ LA INESTABILIDAD</div>
            <div>🔌 AISLAMIENTO DE IBERIA A LAS 12:33:21 CEST – REPOSICIÓN AUTÓNOMA DESDE CERO</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE · ENTSO-E · COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}