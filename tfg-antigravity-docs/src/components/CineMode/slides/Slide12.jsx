// slides/Slide12.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide12.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide12({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const inertia = [3.2, 2.8, 2.3, 1.9, 1.6, 1.5];
  const maxY = 3.6, minY = 1.0, chartHeight = 180, topPad = 30;
  const normY = (v) => topPad + ((maxY - v) / (maxY - minY)) * chartHeight;
  const points = years.map((_, i) => `${i * 80},${normY(inertia[i])}`).join(' ');

  const chartOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const tableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const bottomOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CRÍTICO – INERCIA BAJA" color="#b91c1c" />
        <DigitalClock fixedTime="13:33:15" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>VULNERABILIDAD ESTRUCTURAL DEL SISTEMA IBÉRICO</h1>
        <h2 className={styles.subtitle}>PENETRACIÓN IBR RÉCORD: 82% NO SÍNCRONO</h2>

        <div style={{ opacity: chartOpacity, width: '100%' }}>
          <h3 className={styles.chartTitle}>EVOLUCIÓN DE LA INERCIA H (S)</h3>
          <svg viewBox="0 0 550 240" className={styles.inertiaSvg}>
            <line x1="45" y1="210" x2="530" y2="210" stroke="#5a6e8a" strokeWidth="1" />
            <line x1="45" y1="30" x2="45" y2="210" stroke="#5a6e8a" strokeWidth="1" />
            <line x1="45" y1={normY(2.0)} x2="530" y2={normY(2.0)} stroke="#b91c1c" strokeWidth="2" strokeDasharray="6" />
            <text x="535" y={normY(2.0)-3} fill="#b91c1c" fontSize="12" fontFamily="Fira Code">UMBRAL 2.0 S</text>
            <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" />
            {inertia.map((val,i)=> <circle key={i} cx={i*80+45} cy={normY(val)} r="5" fill="#f59e0b" />)}
            {years.map((y,i)=> <text key={i} x={i*80+45} y="230" textAnchor="middle" fill="#cbd5e1" fontSize="13">{y}</text>)}
          </svg>
          <div className={styles.insetText}>INERCIA ZONAL SUR: <strong className={styles.red}>1,3 – 1,8 S</strong> (POR DEBAJO DEL MÍNIMO DINÁMICO)</div>
        </div>

        <div style={{ opacity: tableOpacity, width: '100%' }}>
          <h3 className={styles.tableTitle}>COMPARATIVA DE INTERCONEXIÓN ELÉCTRICA (% SOBRE DEMANDA PUNTA)</h3>
          <table className={styles.cleanTable}>
            <thead><tr><th>REGIÓN</th><th>%</th></tr></thead>
            <tbody>
              <tr className={styles.highlight}><td>IBERIA (ES+PT)</td><td>7,9%</td></tr>
              <tr><td>FRANCIA</td><td>~14%</td></tr>
              <tr><td>ALEMANIA</td><td>~17%</td></tr>
              <tr><td>OBJETIVO UE 2030</td><td>15%</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ opacity: bottomOpacity, width: '100%', textAlign: 'center' }}>
          <div className={styles.dialContainer}>
            <span className={styles.dialLabel}>PENETRACIÓN IBR:</span>
            <div className={styles.dial}><div className={styles.dialFill} style={{ width: '82%' }}></div><span className={styles.dialValue}>82%</span></div>
          </div>
          <div className={styles.note}>AISLAMIENTO ESTRUCTURAL: 7,9% DE INTERCONEXIÓN VS OBJETIVO 15% UE</div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE INFORME SEGUIMIENTO INERCIA 2025 / ENTSO-E</div>
    </div>
  );
}