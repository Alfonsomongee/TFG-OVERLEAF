// slides/Slide81.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide81.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide81({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="METODOLOGÍA IA" color="#3b82f6" />
        <DigitalClock fixedTime="LLM ASSISTANCE" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>USO DE INTELIGENCIA ARTIFICIAL</h1>
        <h2 className={styles.subtitle}>CINCO FUNCIONES OPERATIVAS DEL MODELO GENERATIVO</h2>

        <div style={{ opacity: tableOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>FUNCIONES DE ASISTENCIA LLM</h3>
          <table className={styles.cleanTable}>
            <thead><tr><th>FUNCIÓN</th><th>DESCRIPCIÓN</th></tr></thead>
            <tbody>
              <tr><td className={styles.label}>RECONCILIACIÓN CRONOLÓGICA</td><td>CONSTRUCCIÓN DE TABLA MAESTRA UNIFICADA DE TIMESTAMPS CON DESFASES DE HASTA 200 MS ENTRE INFORMES</td></tr>
              <tr><td className={styles.label}>MAPEO SISTEMÁTICO DE DIVERGENCIAS</td><td>EXTRACCIÓN ASISTIDA DE PASAJES HOMÓLOGOS PARA LOCALIZAR AFIRMACIONES TÉCNICAMENTE INCOMPATIBLES</td></tr>
              <tr><td className={styles.label}>TABULACIÓN CUANTITATIVA</td><td>CONSOLIDACIÓN DE MAGNITUDES: INERCIA ZONAL, PENETRACIÓN RENOVABLE, INTERCAMBIOS TRANSFRONTERIZOS, UFLS, APORTACIONES CAPACITIVAS DEL MALLADO</td></tr>
              <tr><td className={styles.label}>SOPORTE REDACIONAL</td><td>SUGERENCIA DE VARIANTES LÉXICAS, DEPURACIÓN DE SINONIMIAS, CONTROL DE TERMINOLOGÍA</td></tr>
              <tr><td className={styles.label}>ANDAMIAJE DE ELEMENTOS GRÁFICOS</td><td>GENERACIÓN DE BORRADORES EN TIKZ Y PGFPLOTS, POSTERIORMENTE REVISADOS Y VALIDADOS MANUALMENTE</td></tr>
            </tbody>
          </table>
          <div className={styles.noteBox}>
            ⚠️ NINGUNA DE ESTAS FUNCIONES INVOLUCRA INFERENCIA CAUSAL AUTÓNOMA SOBRE LA FÍSICA DEL SISTEMA
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: METODOLOGÍA DEL TFG – ELABORACIÓN PROPIA</div>
    </div>
  );
}