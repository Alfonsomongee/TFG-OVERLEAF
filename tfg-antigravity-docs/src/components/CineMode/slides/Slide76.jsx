// slides/Slide76.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide76.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide76({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const vollOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const macroOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const priceOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="AUDITORÍA ECONÓMICA" color="#b91c1c" />
        <DigitalClock fixedTime="28-29 ABRIL 2025" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>COSTE DIRECTO DEL APAGÓN</h1>
        <h2 className={styles.subtitle}>VALOR DE LA ENERGÍA NO SUMINISTRADA (VOLL)</h2>

        <div style={{ opacity: vollOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>RANGOS VOLL POR SECTOR (€/KWH)</h3>
          <table className={styles.cleanTable}>
            <thead><tr><th>SECTOR</th><th>VOLL ESTIMADO</th><th>SENSIBILIDAD</th></tr></thead>
            <tbody>
              <tr><td className={styles.label}>RESIDENCIAL</td><td>5,00 – 45,00</td><td>BAJA-MEDIA</td></tr>
              <tr><td className={styles.label}>SERVICIOS / COMERCIO</td><td>15,00 – 90,00</td><td>MEDIA-ALTA</td></tr>
              <tr><td className={styles.label}>INDUSTRIAL (MANUFACTURA)</td><td>50,00 – 250,00</td><td>MUY ALTA</td></tr>
            </tbody>
          </table>
          <div className={styles.metricHighlight}>
            ENERGÍA NO SUMINISTRADA (ENS): 150.000 – 180.000 MWH
          </div>
          <div className={styles.damageBox}>
            💥 DESTRUCCIÓN DIRECTA E INDIRECTA DE VALOR: <strong>1.000 – 1.500 MILLONES DE EUROS</strong>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: macroOpacity, width: '100%' }}>
            <div className={styles.collapseNote}>
              ⚠️ COLAPSO COLATERAL: EL TRÁFICO DE INTERNET EN PORTUGAL SE DESPLOMÓ UN 90% DURANTE LAS PRIMERAS 5 HORAS
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: priceOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>DISTORSIÓN DE PRECIOS EN OMIE Y PVPC</h3>
            <div className={styles.priceBox}>
              <div>PRE-APAGÓN (MAÑANA 28-A): PRECIO MARGINAL <strong>5,79 €/MWH</strong> (PRECIOS NEGATIVOS)</div>
              <div>POST-APAGÓN (REPOSICIÓN): GAS MARCA MARGINAL → PRECIO SE MULTIPLICA POR 5</div>
              <div className={styles.pvpc}>CLIENTES PVPC: INCREMENTO DEL <strong>125%</strong> EN RESTRICCIONES TÉCNICAS → +3 €/MES POR HOGAR</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ACER · CEER · OMIE · ELABORACIÓN PROPIA</div>
    </div>
  );
}