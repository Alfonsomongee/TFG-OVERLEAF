// slides/Slide83.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide83.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide83({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const contentOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="REFLEXIÓN CRÍTICA" color="#10b981" />
        <DigitalClock fixedTime="LECCIONES METODOLÓGICAS" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>REFLEXIÓN CRÍTICA</h1>
        <h2 className={styles.subtitle}>IMPLICACIONES METODOLÓGICAS, ÉTICAS Y PROSPECTIVAS</h2>

        <div style={{ opacity: contentOpacity, width: '100%' }}>
          <div className={styles.implicationBox}>
            <strong>01. IMPLICACIÓN METODOLÓGICA</strong>
            <p>EL USO DE IA NO EXIME AL INVESTIGADOR DE DOMINAR EL CONTENIDO TÉCNICO. SOLO UN INVESTIGADOR CON COMPETENCIA SUFICIENTE PARA IDENTIFICAR UNA INFERENCIA FÍSICAMENTE IMPOSIBLE PUEDE EMPLEAR CON SEGURIDAD UN MODELO CAPAZ DE PRODUCIRLA CON FLUIDEZ RETÓRICA.</p>
          </div>
          <div className={styles.implicationBox}>
            <strong>02. IMPLICACIÓN ÉTICO-ACADÉMICA</strong>
            <p>LA IA NO FIRMA TFGS NI SE SIENTA ANTE UN TRIBUNAL. EL INGENIERO RUBRICA CON SU NOMBRE LA CAUSALIDAD MATERIAL DE LOS HECHOS EXPUESTOS, Y ESA RÚBRICA ES INTRANSFERIBLE.</p>
          </div>
          <div className={styles.implicationBox}>
            <strong>03. IMPLICACIÓN DISCIPLINAR PROSPECTIVA</strong>
            <p>LA ARQUITECTURA HÍBRIDA — LLM COMO INTERFAZ SEMÁNTICA Y DE SÍNTESIS, SIMULADORES FÍSICOS COMO MOTOR DE INFERENCIA CAUSAL — ES LA DIRECCIÓN HACIA LA QUE EVOLUCIONARÁN LAS HERRAMIENTAS DE INGENIERÍA DE SISTEMAS DE POTENCIA.</p>
          </div>
          <div className={styles.conclusionBox}>
            LA UTILIDAD DE LA ASISTENCIA AUTOMÁTICA ES MÁXIMA EN TAREAS DE PROCESAMIENTO (EXTRACCIÓN, SÍNTESIS, ESTRUCTURACIÓN, TABULACIÓN) Y MÍNIMA, HASTA EL PUNTO DE SER CONTRAPRODUCENTE, EN TAREAS DE INFERENCIA CAUSAL SOBRE FENÓMENOS FÍSICOS CON BAJA REPRESENTACIÓN EN LOS CORPUS DE ENTRENAMIENTO.
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: METODOLOGÍA DEL TFG – SÍNTESIS DE BUENAS PRÁCTICAS EN TRANSPARENCIA METODOLÓGICA</div>
    </div>
  );
}