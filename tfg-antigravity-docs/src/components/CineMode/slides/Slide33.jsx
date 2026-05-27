// slides/Slide33.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide33.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide33({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FASE 2 – TAP-LAG" color="#b91c1c" />
        <DigitalClock fixedTime="12:32:57 – 12:33:18" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>FASE 2: FENÓMENO TAP-LAG</h1>
        <h2 className={styles.subtitle}>Desacoplamiento entre red de 400 kV y redes colectoras</h2>

        {stage >= 1 && (
          <div className={styles.oltcBox}>
            <h3>OLTC atrapados por inercia mecánica</h3>
            <p>Los transformadores 400/220 kV y 400/132 kV habían subido tomas durante las caídas de tensión previas. Al llegar la sobretensión, no pudieron rebajarlas a tiempo.</p>
            <img src="/figuras/desacoplamiento_tap_lag.png" alt="Desacoplamiento Tap-Lag" className={styles.imageInline} />
            <div className={styles.imageCaption}>Desacoplamiento entre primario 400 kV y secundario colector. Fuente: ENTSO-E</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.invisibilityBox}>
            <h3>Invisibilidad de la red de 220/132 kV</h3>
            <p>El SCADA del operador monitorizaba el primario de 400 kV (tensiones &lt;435 kV). Aguas abajo, las redes de 220 kV y 132 kV escalaron por encima de <strong>1,2 p.u.</strong> – umbrales invisibles para el despacho nacional.</p>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.ibrBox}>
            <h3>Disparos de IBR y discrepancia forense</h3>
            <p>Los inversores actuaron su protección de sobretensión (función 59 ANSI) ante voltajes >1,2 p.u. en sus puntos de conexión.</p>
            <div className={styles.discrepancy}>
              <div className={styles.reeClaim}>REE: “Disparos inadecuados, no había sobretensión en 400 kV”</div>
              <div className={styles.icaiClaim}>ICAI: “Actuaron correctamente, la sobretensión real estaba aguas abajo del OLTC”</div>
            </div>
            <img src="/figuras/mapa_calor_sobretensiones.png" alt="Mapa de calor sobretensiones" className={styles.imageInline} />
            <div className={styles.imageCaption}>Propagación de sobretensiones en red de 400 kV. Fuente: Comité de Análisis del Gobierno</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ICAI / ENTSO-E – Análisis pericial</div>
    </div>
  );
}
