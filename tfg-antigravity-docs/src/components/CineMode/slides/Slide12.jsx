// slides/Slide12.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide12.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide12({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const lineProgress = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const barProgress = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const inertia = [3.2, 2.8, 2.3, 1.9, 1.6, 1.5];
  const maxY = 3.6, minY = 1.0, chartH = 180, topPad = 30;
  const normY = (v) => topPad + ((maxY - v) / (maxY - minY)) * chartH;
  const points = years.map((_, i) => `${i * 70},${normY(inertia[i])}`).join(' ');
  const totalLen = 420;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CRÍTICO – INERCIA BAJA" color="#b91c1c" />
        <DigitalClock fixedTime="13:33:15" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>VULNERABILIDAD ESTRUCTURAL DEL SISTEMA IBÉRICO</h1>
        <h2 className={styles.subtitle}>Penetración IBR récord: 82% no síncrono</h2>

        {stage >= 1 && (
          <div className={styles.chartBox}>
            <h3>Evolución de la inercia H (s)</h3>
            <svg viewBox="0 0 450 240" className={styles.inertiaSvg}>
              <line x1="40" y1="210" x2="430" y2="210" stroke="#5a6e8a" strokeWidth="1" />
              <line x1="40" y1="30" x2="40" y2="210" stroke="#5a6e8a" strokeWidth="1" />
              <line x1="40" y1={normY(2.0)} x2="430" y2={normY(2.0)} stroke="#b91c1c" strokeWidth="2" strokeDasharray="6" />
              <text x="435" y={normY(2.0)-3} fill="#b91c1c" fontSize="12" fontFamily="Fira Code">Umbral 2.0 s</text>
              <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={totalLen} strokeDashoffset={totalLen * (1 - lineProgress)} />
              {lineProgress > 0.8 && inertia.map((val,i)=> <circle key={i} cx={i*70} cy={normY(val)} r="5" fill="#f59e0b" />)}
              {years.map((y,i)=> <text key={i} x={i*70} y="230" textAnchor="middle" fill="#cbd5e1" fontSize="12">{y}</text>)}
            </svg>
            <div className={styles.insetText}>Inercia zonal sur: <strong className={styles.red}>1,3 – 1,8 s</strong> (por debajo del mínimo dinámico)</div>
          </div>
        )}

        {stage >= 2 && (
          <div className={styles.interconTable} style={{ opacity: barProgress }}>
            <h3>Comparativa de interconexión eléctrica (% sobre demanda punta)</h3>
            <table>
              <thead><tr><th>Región</th><th>%</th></tr></thead>
              <tbody>
                <tr className={styles.highlight}><td>Iberia (ES+PT)</td><td>7,9%</td></tr>
                <tr><td>Francia</td><td>~14%</td></tr>
                <tr><td>Alemania</td><td>~17%</td></tr>
                <tr><td>Objetivo UE 2030</td><td>15%</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {stage >= 3 && (
          <div className={styles.bottomPanel}>
            <div className={styles.dialContainer}>
              <span className={styles.dialLabel}>Penetración IBR</span>
              <div className={styles.dial}><div className={styles.dialFill} style={{ width: '82%' }}></div><span className={styles.dialValue}>82%</span></div>
            </div>
            <div className={styles.note}>Aislamiento estructural: 7,9% de interconexión vs objetivo 15% UE</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>Fuente: REE Informe Seguimiento Inercia 2025 / ENTSO-E</div>
    </div>
  );
}
