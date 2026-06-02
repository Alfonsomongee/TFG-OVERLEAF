// slides/Slide23.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide23.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide23({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ALERTA – INTERCONEXIÓN" color="#b91c1c" />
        <DigitalClock fixedTime="13:33:29" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>ISLA ENERGÉTICA IBÉRICA</h1>
        <h2 className={styles.subtitle}>Limitación estructural de interconexión y fallo del sistema de alerta europeo</h2>

        {stage >= 1 && (
          <div className={styles.interconTable}>
            <h3>Capacidad de interconexión (% sobre demanda punta)</h3>
            <table>
              <thead><tr><th>Región</th><th>%</th></tr></thead>
              <tbody>
                <tr className={styles.highlight}><td>Iberia (ES+PT)</td><td>7,9%</td></tr>
                <tr><td>Francia</td><td>~14%</td></tr>
                <tr><td>Alemania</td><td>~17%</td></tr>
                <tr><td>Objetivo UE 2030</td><td>15%</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.hvdcBox}>
            <h3>Frontera ES-FR: HVDC INELFE-1</h3>
            <div className={styles.diagram}>
              <span className={styles.country}>ES</span>
              <span className={styles.arrow}>⟷</span>
              <span className={styles.country}>FR</span>
            </div>
            <div className={styles.modeBadge}>PMODE1 → 1000 MW fijo</div>
            <div className={styles.modeChange}>Cambio desde PMODE3 a las 12:08 CEST</div>
            <div className={styles.metricsRowSmall}>
              <span><strong className={styles.red}>4.609 MW</strong> intento de importación AC</span>
              <span><strong className={styles.red}>1.000 MW</strong> exportación HVDC fijada</span>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.easPanel}>
            <h3>Sistema de Alerta Europeo (EAS) – Transición abrupta</h3>
            <div className={styles.stateTransition}>
              <span className={styles.stateNormal}>Normal</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.stateBlackout}>Blackout</span>
            </div>
            <p>Sin estados intermedios (Alerta / Emergencia). El EAS actuó como notificador <em>post mortem</em>.</p>
            <div className={styles.easNote}>⚠️ Umbral Marruecos: 49,5 Hz → desconexión protectora a las 12:33:20</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: ENTSO-E / REE / RTE / ICAI – Informe Factual 2025</div>
    </div>
  );
}
