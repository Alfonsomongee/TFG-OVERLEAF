// slides/Slide72.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide72.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide72({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const bessOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const synconOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const hybridOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="TECNOLOGÍAS" color="#10b981" />
        <DigitalClock fixedTime="GFM · SYNCONS · IA" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>TECNOLOGÍAS HABILITADORAS LIBRES DE EMISIONES</h1>
        <h2 className={styles.subtitle}>BESS-GFM · COMPENSADORES SÍNCRONOS · ARQUITECTURA HÍBRIDA</h2>

        <div style={{ opacity: bessOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>BESS CON CONTROL GRID-FORMING (GFM)</h3>
          <div className={styles.techBox}>
            <div>⚠️ INVERSOR GFM = FUENTE DE TENSIÓN AUTÓNOMA (EQUIVALENTE DE THÉVENIN) – NO DEPENDE DE PLL</div>
            <div>✅ INERCIA SINTÉTICA: RESPUESTA EN DECENAS DE MILISEGUNDOS</div>
            <div>✅ FFR: INYECCIÓN SUBCÍCLICA (≤ 0,25 S) FRENA RoCoF ANTES DE QUE ACTÚEN LOS GOBERNADORES</div>
          </div>
          <div className={styles.caseBox}>
            <strong>CASO HORNSDALE (AUSTRALIA):</strong> 150 MW / 193,5 MWH – CERTIFICÓ 2.000 MWS DE INERCIA EQUIVALENTE (~15% DE LA INERCIA MÍNIMA REQUERIDA)
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: synconOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>COMPENSADORES SÍNCRONOS (SYNCONS)</h3>
            <div className={styles.techBox}>
              <div>⚠️ CORRIENTES DE CORTOCIRCUITO: 300–400% DEL VALOR NOMINAL</div>
              <div>✅ INERCIA ROTACIONAL GENUINA – FÍSICAMENTE DISPONIBLE EN EL PRIMER MILISEGUNDO</div>
              <div>♻️ ESTRATEGIA BROWNFIELD: RECONVERTIR ALTERNADORES DE CENTRALES EN DESMANTELAMIENTO</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: hybridOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>ARQUITECTURA HÍBRIDA – COMPLEMENTARIEDAD</h3>
            <div className={styles.hybridGrid}>
              <div className={styles.card}><strong>BESS-GFM</strong><br/>VELOCIDAD · PRECISIÓN · BLACK START<br/><span className={styles.limit}>LIMITACIÓN: CORRIENTE &lt; 1,5 PU</span></div>
              <div className={styles.card}><strong>SYNCONS</strong><br/>INERCIA REAL · CORTO CIRCUITO ELEVADO<br/><span className={styles.limit}>LIMITACIÓN: SIN ENERGÍA ACTIVA · LENTOS</span></div>
            </div>
            <div className={styles.conclusion}>NINGUNA POR SÍ SOLA ES SUFICIENTE – LA RESILIENCIA REQUIERE AMBAS</div>
            <div className={styles.aiNote}>
              🔬 IA Y GNN (GRAPH NEURAL NETWORKS) – PREDICCIÓN DE LA CUENCA DE ESTABILIDAD (SNBS) ANTES DEL COLAPSO
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: HITACHI ENERGY / FUTURED / NREL / ERCOT / DÖRFLER (ETH ZÜRICH)</div>
    </div>
  );
}