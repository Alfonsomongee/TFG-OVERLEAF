// slides/Slide73.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide73.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide73({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const po74Opacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const ncrfgOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const timelineOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="RESPUESTA NORMATIVA" color="#f59e0b" />
        <DigitalClock fixedTime="P.O. 7.4 · NC RFG 2.0" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>RESPUESTA NORMATIVA</h1>
        <h2 className={styles.subtitle}>DEL P.O. 7.4 OBSOLETO AL GRID-FORMING OBLIGATORIO</h2>

        <div style={{ opacity: po74Opacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>P.O. 7.4 – COMPARATIVA MARCO REGULATORIO</h3>
          <table className={styles.cleanTable}>
            <thead><tr><th>ATRIBUTO OPERATIVO</th><th>P.O. 7.4 ORIGINAL (PRE-2025)</th><th>MARCO ACTUALIZADO (POST-2025)</th></tr></thead>
            <tbody>
              <tr><td className={styles.label}>NATURALEZA DEL CONTROL</td><td>ESTÁTICA Y ASIMÉTRICA</td><td className={styles.highlight}>DINÁMICA, CONTINUA Y PROPORCIONAL</td></tr>
              <tr><td className={styles.label}>PARTICIPACIÓN IBR</td><td>GRID-FOLLOWING PASIVO</td><td className={styles.highlight}>GRID-FORMING OBLIGATORIO</td></tr>
              <tr><td className={styles.label}>BANDA MUERTA</td><td>405–410 KV SIN RESPUESTA</td><td className={styles.highlight}>ELIMINADA O REDUCIDA A ±0,5%</td></tr>
              <tr><td className={styles.label}>RESPUESTA EN REACTIVA</td><td>ESCALONES LENTOS</td><td className={styles.highlight}>RESPUESTA AUTOMÁTICA EN BUCLE CERRADO</td></tr>
              <tr><td className={styles.label}>OBSERVABILIDAD</td><td>SCADA 400 KV</td><td className={styles.highlight}>PMU Y TELEMEDIDA DE 4 SEGUNDOS</td></tr>
            </tbody>
          </table>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: ncrfgOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>NC RFG 2.0 (PROPUESTA ENTSO-E)</h3>
            <table className={styles.cleanTable}>
              <thead><tr><th>TIPO</th><th>POTENCIA / CONEXIÓN</th><th>REQUISITO GFM</th><th>CRONOGRAMA</th></tr></thead>
              <tbody>
                <tr><td className={styles.label}>TIPO A</td><td>&lt; 1 MW</td><td>VOLUNTARIO</td><td>N/A</td></tr>
                <tr><td className={styles.label}>TIPO B</td><td>1–50 MW</td><td className={styles.highlight}>OBLIGATORIO – INERCIA SINTÉTICA</td><td>3 AÑOS TRAS IGD</td></tr>
                <tr><td className={styles.label}>TIPO C</td><td>&gt; 50 MW</td><td className={styles.highlight}>OBLIGATORIO EXHAUSTIVO – FUENTE DE TENSIÓN</td><td>3 AÑOS TRAS ADOPCIÓN UE</td></tr>
                <tr><td className={styles.label}>TIPO D</td><td>≥ 110 KV o &gt; 75 MW</td><td className={styles.highlight}>ÍDEM TIPO C + CERTIFICACIÓN</td><td>3 AÑOS TRAS ADOPCIÓN UE</td></tr>
              </tbody>
            </table>
            <div className={styles.warningNote}>⚠️ ADOPCIÓN FORMAL POR LA COMISIÓN EUROPEA – SIN CALENDARIO OFICIAL</div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: timelineOpacity, width: '100%' }}>
            <div className={styles.rdBox}>
              REAL DECRETO 997/2025 – CUATRO MEDIDAS DE URGENCIA:
            </div>
            <div className={styles.measures}>
              <div>1. REDEFINICIÓN JURÍDICA DE BESS COMO ACTIVOS DE ESTABILIDAD SISTÉMICA</div>
              <div>2. SANEAMIENTO DE PERMISOS DE CONEXIÓN OBSOLETOS</div>
              <div>3. TELEMEDIDA &lt; 4 SEGUNDOS PARA TODO IBR SIGNIFICATIVO</div>
              <div>4. PSS/POD OBLIGATORIO EN INVERSORES GFM &gt; 10 MW</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: REE · CNMC · BOE-A-2025-13076 · ENTSO-E NC RFG 2.0</div>
    </div>
  );
}