// slides/Slide74.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide74.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide74({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const headroomOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const revenueOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const ds3Opacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="MERCADOS ERS" color="#f59e0b" />
        <DigitalClock fixedTime="REVENUE STACKING · DS3 · RRS-FFR" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>MERCADOS DE SERVICIOS ESENCIALES (ERS)</h1>
        <h2 className={styles.subtitle}>REMUNERACIÓN EXPLÍCITA DE LA ESTABILIDAD</h2>

        <div style={{ opacity: headroomOpacity, width: '100%' }}>
          <div className={styles.headroomBox}>
            <strong>EL PROBLEMA DEL HEADROOM:</strong> UN INVERSOR GFM DEBE MANTENER RESERVA DE CAPACIDAD APARENTE (S_max) SIN UTILIZAR EN ESTADO ESTACIONARIO – SIN REMUNERACIÓN, NO ES VIABLE COMERCIALMENTE
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: revenueOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>REVENUE STACKING – FUENTES DE INGRESOS APILADAS</h3>
            <div className={styles.revenueStack}>
              <div>💰 MERCADO DE ENERGÍA DIARIO (ARBITRAJE)</div>
              <div>💰 SUBastas aFRR/mFRR (REGULACIÓN SECUNDARIA/TERCIARIA)</div>
              <div>💰 PAGOS POR CAPACIDAD DE INERCIA SINTÉTICA Y FFR</div>
              <div>💰 PAGOS POR DISPONIBILIDAD DE REACTIVA ERS</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: ds3Opacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>MODELOS DE REFERENCIA</h3>
            <table className={styles.cleanTable}>
              <thead><tr><th>SERVICIO</th><th>DEFINICIÓN</th><th>UMBRAL / VENTANA</th></tr></thead>
              <tbody>
                <tr><td className={styles.label}>SIR (EIRGRID DS3)</td><td>PROVISIÓN CUASI-INSTANTÁNEA DE POTENCIA ACTIVA</td><td>SIRF ≥ 15 S</td></tr>
                <tr><td className={styles.label}>FFR (EIRGRID DS3)</td><td>INYECCIÓN RÁPIDA TRAS CAÍDA DE FRECUENCIA</td><td>0,15 S – 2 S</td></tr>
                <tr><td className={styles.label}>RRS-FFR (ERCOT)</td><td>DETECCIÓN AUTÓNOMA &lt; 59,85 HZ – INYECCIÓN 100%</td><td>≤ 0,25 S · MÍNIMO 15 MIN</td></tr>
              </tbody>
            </table>
            <div className={styles.conclusion}>
              EL MODELO MARGINALISTA PURO DE ENERGÍA ES ESTRUCTURALMENTE INCAPAZ DE REMUNERAR LOS ATRIBUTOS DE FIRMEZA
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: EIRGRID DS3 · ERCOT RRS-FFR · ENTSO-E · ELABORACIÓN PROPIA</div>
    </div>
  );
}