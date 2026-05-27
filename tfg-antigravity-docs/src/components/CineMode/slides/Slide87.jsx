// slides/Slide87.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide87.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide87({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const ncrfgOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const bessOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const finalOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="RESPUESTA REGULATORIA" color="#10b981" />
        <DigitalClock fixedTime="NC RFG 2.0 · BESS +589%" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>RESPUESTA REGULATORIA: MANDATO GRID-FORMING</h1>
        <h2 className={styles.subtitle}>NC RFG 2.0 · BOOM DEL ALMACENAMIENTO IBÉRICO</h2>

        <div style={{ opacity: ncrfgOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>NUEVO CÓDIGO DE RED EUROPEO (NC RFG 2.0) – NOVIEMBRE 2025</h3>
          <div className={styles.rfgBox}>
            <div>✅ <strong>GRID-FORMING OBLIGATORIO</strong> PARA NUEVAS PLANTAS NO SÍNCRONAS Y BESS &gt; 1 MW</div>
            <div>⚡ TIEMPO DE RESPUESTA DE CORRIENTE &lt; 10 MS</div>
            <div>🔄 RIDE-THROUGH FRENTE A SALTOS DE ÁNGULO DE FASE</div>
            <div>🎯 INERCIA SINTÉTICA EQUIVALENTE A MÁQUINA SÍNCRONA</div>
          </div>
          <div className={styles.warningNote}>⚠️ ADOPCIÓN OFICIAL POR LA COMISIÓN EUROPEA – DESPRIORIZADA HASTA FINALES DE 2026</div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: bessOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>BOOM DEL ALMACENAMIENTO IBÉRICO</h3>
            <div className={styles.bessBox}>
              <div>💰 COSTE SISTÉMICO POST-APAGÓN (OPERACIÓN REFORZADA): <strong>666 MILLONES DE EUROS</strong> EN 10 MESES</div>
              <div>⚡ CAPACIDAD BESS INSTALADA EN ESPAÑA: <strong>28 MW → 200 MW</strong> (MULTIPLICACIÓN DEL <strong>589%</strong>)</div>
              <div>🔋 IMPULSO A UNA ARQUITECTURA DE RED NATIVA PARA SERVICIOS DE BLACK START</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: finalOpacity, width: '100%' }}>
            <div className={styles.finalBox}>
              <strong>CONCLUSIÓN DE LA CRISIS</strong>
              <p>EL APAGÓN DE 2025 YA NO SE ESTUDIA COMO UN ACCIDENTE FORTUITO. ES EL PRIMER EXPONENTE DOCUMENTADO DE UN COLAPSO PROVOCADO POR ESTRANGULAMIENTO REGULATORIO Y TRANSICIÓN TECNOLÓGICA.</p>
              <p>LA PENÍNSULA IBÉRICA SE CONVIRTIÓ A LA FUERZA EN EL LABORATORIO VIVO QUE HA OBLIGADO A EUROPA A REESCRIBIR LAS REGLAS DE LA ESTABILIDAD ELÉCTRICA DE LA PRÓXIMA DÉCADA.</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ENTSO-E PHASE II REPORT · CNMC · REE · BOE</div>
    </div>
  );
}