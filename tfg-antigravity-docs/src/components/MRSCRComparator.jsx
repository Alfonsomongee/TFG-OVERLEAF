// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Simulación de Fortaleza de Red: SCR vs. MRSCR" en "El Día Después: Reformas Institucionales".
// %% LEGEND_PROPOSAL: "Comparación del SCR tradicional y el MRSCR en nodos de interconexión franco‑ibérica. El umbral MRSCR ≤ 2,0 indica red débil con riesgo de inestabilidad dinámica."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './MRSCRComparator.module.css';

const SUBSTATIONS = [
  { id: 'hernani', name: 'Hernani 400 kV (ES)', short: 'Hernani', sac: 5500, ibr: 1500, miif: 0.42, scr: 3.67, mrscr: 1.88, classification: 'Red Débil (Riesgo Crítico)' },
  { id: 'vic', name: 'Vic 400 kV (ES)', short: 'Vic', sac: 6100, ibr: 1800, miif: 0.38, scr: 3.39, mrscr: 1.95, classification: 'Red Débil (Riesgo Crítico)' },
  { id: 'arkale', name: 'Arkale 220 kV (ES)', short: 'Arkale', sac: 2800, ibr: 900, miif: 0.51, scr: 3.11, mrscr: 1.48, classification: 'Red Extremadamente Débil (Fallo de PLL)' },
  { id: 'baixas', name: 'Baixas 400 kV (FR)', short: 'Baixas', sac: 14000, ibr: 2500, miif: 0.18, scr: 5.60, mrscr: 3.82, classification: 'Red Fuerte (Estabilidad Dinámica)' },
  { id: 'argia', name: 'Argia 400 kV (FR)', short: 'Argia', sac: 4200, ibr: 1100, miif: 0.48, scr: 3.82, mrscr: 1.92, classification: 'Red Débil (Riesgo Crítico)' },
  { id: 'lagoaca', name: 'Lagoaça 400 kV (PT)', short: 'Lagoaça', sac: 3900, ibr: 1200, miif: 0.35, scr: 3.25, mrscr: 1.83, classification: 'Red Débil (Riesgo Crítico)' },
];

const THRESHOLD = 2.0;

export default function MRSCRComparator() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const scrColor = isDark ? '#5a90c8' : '#2a5080';
  const mrscrColor = isDark ? '#c49a4a' : '#9a6b2f';
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const axisColor = isDark ? '#3a5570' : '#9aa5af';
  const gridColor = isDark ? 'rgba(180,198,220,0.1)' : 'rgba(31,41,51,0.08)';
  const thresholdColor = isDark ? '#d45a54' : '#a83832';

  const w = 680, h = 250;
  const m = { top: 18, right: 20, bottom: 44, left: 38 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;
  const maxVal = 6.0;
  const yScale = (v) => m.top + ch - (v / maxVal) * ch;

  const gw = cw / SUBSTATIONS.length;
  const bw = Math.min(18, gw * 0.28);
  const bg = 3;
  const barX = (gi, bi) => {
    const gc = m.left + gi * gw + gw / 2;
    return gc - bw - bg / 2 + bi * (bw + bg);
  };

  const toggle = (id) => setSelectedId((p) => (p === id ? null : id));
  const sel = SUBSTATIONS.find((s) => s.id === selectedId);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Fortaleza de red</span>
        <h3 className={styles.title}>MRSCR vs. SCR en subestaciones ibéricas</h3>
        <p className={styles.subtitle}>
          MRSCR ≤ 2,0 indica red débil con riesgo de inestabilidad dinámica.
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: scrColor }} aria-hidden="true" />SCR
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: mrscrColor }} aria-hidden="true" />MRSCR
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ borderColor: thresholdColor }} aria-hidden="true" />
          Umbral 2,0
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label="Comparación SCR vs MRSCR">
          <title>SCR vs MRSCR en nodos de interconexión franco‑ibérica</title>
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          {[0,1,2,3,4,5,6].map((v) => (
            <g key={v}>
              {v > 0 && <line x1={m.left} y1={yScale(v)} x2={m.left + cw} y2={yScale(v)} stroke={gridColor} strokeWidth="1" />}
              <text x={m.left - 6} y={yScale(v) + 3.5} textAnchor="end" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{v}</text>
            </g>
          ))}
          <line x1={m.left} y1={yScale(THRESHOLD)} x2={m.left + cw} y2={yScale(THRESHOLD)} stroke={thresholdColor} strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={m.left + cw - 2} y={yScale(THRESHOLD) - 4} textAnchor="end" fontSize="7.5" fontFamily="Inter,system-ui,sans-serif" fill={thresholdColor}>MRSCR = 2,0</text>

          {SUBSTATIONS.map((s, i) => (
            <g key={s.id}>
              <rect x={barX(i,0)} y={yScale(s.scr)} width={bw} height={ch-(yScale(s.scr)-m.top)} fill={scrColor} rx="2"
                className={styles.bar} onClick={() => toggle(s.id)} tabIndex={0} role="button"
                aria-label={`${s.short} SCR: ${s.scr}`}
                onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(s.id); } }}>
                <title>{`${s.name}\nSCR: ${s.scr}`}</title>
              </rect>
              <rect x={barX(i,1)} y={yScale(s.mrscr)} width={bw} height={ch-(yScale(s.mrscr)-m.top)} fill={mrscrColor} rx="2"
                className={styles.bar} onClick={() => toggle(s.id)} tabIndex={0} role="button"
                aria-label={`${s.short} MRSCR: ${s.mrscr}`}
                onKeyDown={(e) => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(s.id); } }}>
                <title>{`${s.name}\nMRSCR: ${s.mrscr}`}</title>
              </rect>
              <text x={m.left + i * gw + gw / 2} y={m.top + ch + 14} textAnchor="middle" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{s.short}</text>
            </g>
          ))}
        </svg>
      </div>

      {sel && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${sel.name}`}>
          <h4 className={styles.detailTitle}>{sel.name}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>SCR</span><span>{sel.scr}</span>
            <span className={styles.detailLabel}>MRSCR</span><span>{sel.mrscr}</span>
            <span className={styles.detailLabel}>Sac (MVA)</span><span>{sel.sac.toLocaleString()}</span>
            <span className={styles.detailLabel}>IBR (MW)</span><span>{sel.ibr}</span>
            <span className={styles.detailLabel}>MIIF prom.</span><span>{sel.miif}</span>
            <span className={styles.detailLabel}>Clasificación</span><span className={styles.classNote}>{sel.classification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
