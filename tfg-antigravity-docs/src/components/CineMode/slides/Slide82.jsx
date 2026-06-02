// slides/Slide82.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide82.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide82({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="VALIDACIÓN" color="#f59e0b" />
        <DigitalClock fixedTime="FILTRO DE VALIDACIÓN FÍSICA" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>VALIDACIÓN Y VERIFICACIÓN</h1>
        <h2 className={styles.subtitle}>CUATRO MODOS DE INFERENCIA ERRÓNEA DEL LLM</h2>

        <div style={{ opacity: tableOpacity, width: '100%' }}>
          <table className={styles.cleanTable}>
            <thead>
              <tr><th>FENÓMENO</th><th>INFERENCIA ERRÓNEA POR DEFECTO</th><th>CORRECCIÓN FÍSICA APLICADA</th></tr>
            </thead>
            <tbody>
              <tr><td className={styles.label}>PARADOJA DEL UFLS</td><td>EL DESLASTRE POR SUBFRECUENCIA "SALVÓ" ÁREAS DEL SISTEMA</td><td>EL UFLS ES CIEGO AL VOLTAJE: ELIMINÓ SUMIDEROS DE REACTIVA INDUCTIVA, AGRAVANDO LA SOBRETENSIÓN</td></tr>
              <tr><td className={styles.label}>TAP-LAG</td><td>LOS OLTC RESPONDIERON CORRECTAMENTE AL TRANSITORIO</td><td>LOS RETARDOS INTENCIONALES DEJARON LOS OLTC DESFASADOS, MULTIPLICANDO LA TENSIÓN HACIA 220/132 KV</td></tr>
              <tr><td className={styles.label}>APORTE CAPACITIVO DEL MALLADO</td><td>EL MALLADO REDUJO LA IMPEDANCIA Y AUMENTÓ LA ESTABILIDAD</td><td>EN RÉGIMEN DE BAJA CARGA, ACTIVÓ LA ADMITANCIA TRANSVERSAL (EFECTO FERRANTI) INYECTANDO 1.050 MVAr CAPACITIVOS</td></tr>
              <tr><td className={styles.label}>OSCILACIÓN DE 0,6 HZ</td><td>RESPUESTA INTEGRADA PROMEDIADA SOBRE LAS FUENTES</td><td>EL ORIGEN ES DISCREPANCIA (ICAI: OSCILACIÓN FORZADA / REE: MODO NATURAL) QUE EL TFG DEBE PRESERVAR, NO RESOLVER</td></tr>
            </tbody>
          </table>
          <div className={styles.workflowBox}>
            <strong>FLUJO DE TRABAJO CON VALIDACIÓN FÍSICA:</strong>
            <div>FUENTES PRIMARIAS → ASISTENCIA LLM → FILTRO DE VALIDACIÓN FÍSICA (KIRCHHOFF, CURVAS Q-V, ECUACIÓN DE OSCILACIÓN) → CUERPO DEL TFG ↑ ← (REFORMULACIÓN DE PROMPT ANTE ALUCINACIÓN)</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: METODOLOGÍA DEL TFG – CASOS DE INFERENCIA CORREGIDA</div>
    </div>
  );
}