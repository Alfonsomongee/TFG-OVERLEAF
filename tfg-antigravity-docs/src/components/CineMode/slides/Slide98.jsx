// slides/Slide98.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide98.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide98({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.6) setStage(2);
  }, [slideProgress]);

  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.4));
  const consensosOpacity = Math.min(1, Math.max(0, (slideProgress - 0.6) / 0.3));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CONCLUSIONES" color="#3b82f6" />
        <DigitalClock fixedTime="SÍNTESIS FORENSE" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>SÍNTESIS COMPARATIVA DE POSTURAS INSTITUCIONALES</h1>
        <h2 className={styles.subtitle}>CUATRO NARRATIVAS · DOS EJES DE DIVERGENCIA</h2>

        <div style={{ opacity: tableOpacity, width: '100%' }}>
          <table className={styles.cleanTable}>
            <thead>
              <tr><th>AGENTE</th><th>MARCO ANALÍTICO</th><th>CAUSA RAÍZ</th><th>INERCIA (H)</th></tr>
            </thead>
            <tbody>
              <tr><td className={styles.label}>ADMINISTRACIÓN (REE/CSN)</td><td className={styles.cellSmall}>CUMPLIMIENTO NORMATIVO</td><td className={styles.cellSmall}>DÉFICIT DE ABSORCIÓN DE REACTIVA (P.O. 7.4)</td><td className={styles.cellSmall}>2,3 S (GLOBAL)</td></tr>
              <tr><td className={styles.label}>SECTOR GENERADOR (ICAI)</td><td className={styles.cellSmall}>ANÁLISIS ELECTROMAGNÉTICO</td><td className={styles.cellSmall}>INESTABILIDAD CAPACITIVA POR MALLADO + TAP-LAG</td><td className={styles.cellSmall}>1,3 S (SUR)</td></tr>
              <tr><td className={styles.label}>ENTSO-E</td><td className={styles.cellSmall}>ESTABILIDAD ÁREA SÍNCRONA</td><td className={styles.cellSmall}>OSCILACIONES INTER-ÁREA + INSUFICIENCIA N-1 DINÁMICO</td><td className={styles.cellSmall}>1,3–1,8 S (ZONAL)</td></tr>
              <tr><td className={styles.label}>ACADEMIA (NREL/MIT)</td><td className={styles.cellSmall}>REGISTROS PMU</td><td className={styles.cellSmall}>EROSIÓN SCR + DESCONEXIÓN IBR POR SOBRETENSIÓN</td><td className={styles.cellSmall}>1,3–1,8 S (SUR)</td></tr>
            </tbody>
          </table>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: consensosOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>TRES CONSENSOS TÉCNICOS ROBUSTOS</h3>
            <div className={styles.consensoBox}>
              <div>1. EL MECANISMO DOMINANTE FUE INESTABILIDAD DE TENSIÓN EN RÉGIMEN CAPACITIVO (NO DÉFICIT DE FRECUENCIA)</div>
              <div>2. LA OPERACIÓN PROLONGADA CON 82% IBR AGOTÓ LOS MÁRGENES DE CONTROL DINÁMICO DE TENSIÓN (EVENTOS PRECURSORES 22 Y 24 DE ABRIL)</div>
              <div>3. EL MARCO REGULATORIO (P.O. 7.4 + NC RFG SIN GRID-FORMING) ERA ESTRUCTURALMENTE INADECUADO</div>
            </div>
            <div className={styles.divergenciaBox}>
              <strong>DOS EJES DE DIVERGENCIA IRRECONCILIABLE:</strong>
              <div>📏 PERÍMETRO DE MEDIDA – INERCIA GLOBAL (2,3 S) VS ZONAL (1,3 S EN EL SUR)</div>
              <div>⚖️ ATRIBUCIÓN DEL DISPARADOR – INCUMPLIMIENTO DEL PARQUE GENERADOR VS MANIOBRA DE MALLADO DE REE</div>
              <div className={styles.note}>LA DIVERGENCIA NO ES TÉCNICA SINO DISTRIBUTIVA: LA CADENA CAUSAL ES COMPARTIDA, LA RESPONSABILIDAD ES DISPUTADA</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: SÍNTESIS DE INFORMES – ELABORACIÓN PROPIA</div>
    </div>
  );
}