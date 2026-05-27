// slides/Slide71.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide71.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide71({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const swingOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const scrOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const paradoxOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="RESILIENCIA Y FUTURO" color="#3b82f6" />
        <DigitalClock fixedTime="LECCIONES ESTRUCTURALES" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>FÍSICA DE LA FRAGILIDAD SISTÉMICA</h1>
        <h2 className={styles.subtitle}>INERCIA, ROCoF Y POTENCIA DE CORTOCIRCUITO</h2>

        {/* ECUACIÓN DE OSCILACIÓN */}
        <div style={{ opacity: swingOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>ECUACIÓN DE OSCILACIÓN (SWING EQUATION)</h3>
          <div className={styles.equation}>
            \frac{2H}{f_0} \cdot \frac{df}{dt} = P_m - P_e - D \cdot \Delta f
          </div>
          <div className={styles.equationNote}>
            H = CONSTANTE DE INERCIA (S) · ROCoF = df/dt · LOS INVERSORES GRID-FOLLOWING NO APORTAN INERCIA ELECTROMECÁNICA
          </div>
          <div className={styles.metricHighlight}>
            SISTEMA CERTIFICÓ H = 2,3 S (UMBRAL ENTSO-E = 2,0 S) – EL COLAPSO NO FUE POR DÉFICIT DE MASA SÍNCRONA
          </div>
        </div>

        {/* SCR Y DEGRADACIÓN */}
        {stage >= 2 && (
          <div style={{ opacity: scrOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>SHORT CIRCUIT RATIO (SCR)</h3>
            <div className={styles.equation}>
              SCR = S_sc,PCC / P_IBR
            </div>
            <table className={styles.cleanTable}>
              <thead><tr><th>CATEGORÍA</th><th>UMBRAL SCR</th><th>IMPLICACIÓN OPERATIVA</th></tr></thead>
              <tbody>
                <tr><td>RED FUERTE</td><td>SCR &gt; 3</td><td>INVERSORES GFL OPERAN CON ESTABILIDAD</td></tr>
                <tr><td className={styles.warning}>RED DÉBIL</td><td>2 ≤ SCR ≤ 3</td><td>DEGRADACIÓN DEL MARGEN DE ESTABILIDAD DEL PLL</td></tr>
                <tr><td className={styles.critical}>RED MUY DÉBIL</td><td>SCR &lt; 2</td><td>PLL PROPENSOS A PÉRDIDA DE SINCRONISMO</td></tr>
              </tbody>
            </table>
            <div className={styles.note}>AMPLIAS ZONAS DE LA PENÍNSULA OPERABAN COMO RED MUY DÉBIL (SCR &lt; 2) HORAS ANTES DEL COLAPSO</div>
          </div>
        )}

        {/* PARADOJA P-Q */}
        {stage >= 3 && (
          <div style={{ opacity: paradoxOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>PARADOJA GEOMÉTRICA DE LOS INVERSORES</h3>
            <div className={styles.equation}>
              S_max = √(P² + Q²)
            </div>
            <div className={styles.paradoxBox}>
              AL INCREMENTAR P POR ACLARAMIENTO, EL INVERSOR DEBE REDUCIR Q. PERO ESE ES EL INSTANTE EN QUE LA RED REQUIERE MÁS Q PARA CONTENER LA SOBRETENSIÓN.
            </div>
            <div className={styles.conclusion}>EL 28-A NO FUE UN COLAPSO DE ENERGÍA SINO DE CONTROL</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ECUACIÓN DE OSCILACIÓN · ENTSO-E · IIT-ICAI</div>
    </div>
  );
}