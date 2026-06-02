// slides/Slide31.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide31.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide31({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const lineProgress = Math.min(1, Math.max(0, (slideProgress - 0.4) / 0.3));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FASE 0 – RED DEBILITADA" color="#b91c1c" />
        <DigitalClock fixedTime="12:00–12:30" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>FASE 0: RED DEBILITADA Y MANIOBRA DE MALLADO</h1>
        <h2 className={styles.subtitle}>35,8% de la red de 400 kV en el sur permanecía desconectada</h2>

        {stage >= 1 && (
          <div className={styles.oscillationsBox}>
            <h3>Oscilaciones electromecánicas previas</h3>
            <div className={styles.oscillationItem}>
              <span className={styles.time}>12:03 CEST</span>
              <span className={styles.detail}>0,6 Hz forzada · amplitud 70 mHz · amortiguamiento <strong className={styles.red}>~1%</strong> (umbral 5%)</span>
            </div>
            <div className={styles.oscillationItem}>
              <span className={styles.time}>12:19 CEST</span>
              <span className={styles.detail}>0,2 Hz inter-área · modo Este-Centro-Oeste · tensión en enlaces pirenaicos</span>
            </div>
            <img src="/figuras/oscilaciones_nunez_balboa.png" alt="Oscilaciones de tensión" className={styles.imageInline} />
            <div className={styles.imageCaption}>Oscilaciones y sobretensiones en Núñez de Balboa 400 kV. Fuente: IIT-ICAI</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.malladoBox}>
            <h3>Maniobra de mallado (12:03–12:30)</h3>
            <p>Reconexión de <strong>11 líneas de 400 kV</strong> para frenar oscilaciones</p>
            <div className={styles.metricsRowSmall}>
              <div><span className={styles.metricLabel}>Inyección capacitiva:</span><span className={styles.red}>2,4 GVAr</span> (ICAI) / <span className={styles.blue}>1.050 MVAr</span> (NREL)</div>
              <div><span className={styles.metricLabel}>Margen hasta colapso (Carmona):</span><span className={styles.red}>2.964 MW → 1.268 MW</span> (<strong>-57%</strong>)</div>
            </div>
            <div className={styles.warningNote}>⚠️ El sistema quedó a 1.268 MW del umbral de saturación capacitiva</div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.captureBox}>
            <img src="/figuras/captura_wams_0_6hz.png" alt="Captura WAMS" className={styles.imageInline} />
            <div className={styles.imageCaption}>Registro WAMS – oscilación de 0,6 Hz en Carmona (Sevilla). Fuente: ENTSO-E / REE</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE / ENTSO-E / ICAI / NREL – Simulaciones periciales</div>
    </div>
  );
}
