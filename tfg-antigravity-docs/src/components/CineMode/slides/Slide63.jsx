// slides/Slide63.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide63.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide63({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const phase1Opacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const phase2Opacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const phase3Opacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="REDES SOCIALES" color="#f59e0b" />
        <DigitalClock fixedTime="0–72 HORAS" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>REACCIÓN EN REDES SOCIALES (X)</h1>
        <h2 className={styles.subtitle}>TRES FASES DE GESTIÓN COLECTIVA DE LA INCERTIDUMBRE</h2>

        {/* FASE 1 */}
        <div style={{ opacity: phase1Opacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>FASE 1 (0–6 HORAS): INCERTIDUMBRE AGUDA</h3>
          <div className={styles.phaseBox}>
            <div>VACUUM FILLING: HIPÓTESIS DE SABOTAJE, CIBERATAQUES, FENÓMENOS ATMOSFÉRICOS</div>
            <div>EMERGENT NORM THEORY: HUMOR COSTUMBRISTA, IRONÍA, NORMALIZACIÓN PRAGMÁTICA</div>
          </div>
        </div>

        {/* FASE 2 */}
        {stage >= 2 && (
          <div style={{ opacity: phase2Opacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>FASE 2 (6–72 HORAS): POLITIZACIÓN Y OUTRAGE COMMUNICATION</h3>
            <div className={styles.phaseBox}>
              <div>DISCURSO CRÍTICO: EVIDENCIA DE GESTIÓN DEFICIENTE, EXIGENCIAS DE DIMISIONES</div>
              <div>DISCURSO FAVORABLE: VALORACIÓN POSITIVA DE LA RESPUESTA DE EMERGENCIAS</div>
              <div className={styles.algorithmNote}>⚠️ MENSAJES DE INDIGNACIÓN TIENEN MAYOR ALCANCE ALGORÍTMICO</div>
            </div>
          </div>
        )}

        {/* FASE 3 */}
        {stage >= 3 && (
          <div style={{ opacity: phase3Opacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>FASE 3 (&gt;72 HORAS): CORRECCIÓN TARDÍA</h3>
            <div className={styles.phaseBox}>
              <div>EXPLICACIONES TÉCNICAS VERIFICADAS LLEGAN CON ALCANCE REDUCIDO</div>
              <div>ASIMETRÍA ESTRUCTURAL: VELOCIDAD VIRAL VS LENTITUD FORENSE</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ELABORACIÓN PROPIA A PARTIR DE ANÁLISIS DE CONTENIDO EN X</div>
    </div>
  );
}