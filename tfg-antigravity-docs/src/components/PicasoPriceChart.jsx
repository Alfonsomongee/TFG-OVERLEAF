// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Incidentes de Precios en PICASSO e Impacto del Límite de Demanda Elástica" en "El Día Después: Reformas Institucionales".
// %% LEGEND_PROPOSAL: "CBMP (€/MWh) sin elasticidad (rojo discontinuo) y con demanda elástica (verde) para activaciones de aFRR. Efecto mitigador de las Decisiones ACER 08/2024 y 09/2024."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './PicasoPriceChart.module.css';

const DATA = [
  { demand: 45, zone: 'DK2', cbmpWithout: 2100, cbmpWith: 450, note: 'Baja inercia local, eólica nula' },
  { demand: 140, zone: 'DK1+DK2', cbmpWithout: 4618, cbmpWith: 850, note: 'Periodo de rampa solar vespertina' },
  { demand: 500, zone: 'Terna (IT)', cbmpWithout: 5800, cbmpWith: 1200, note: 'Pérdida de línea de interconexión' },
  { demand: 1200, zone: 'RTE (FR)', cbmpWithout: 7500, cbmpWith: 2100, note: 'Transitorio tras rearranque nuclear' },
  { demand: 2500, zone: 'RTE (FR — Apagón)', cbmpWithout: 16000, cbmpWith: 4500, note: 'Pérdida masiva de interconexión' },
];

export default function PicasoPriceChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedIdx, setSelectedIdx] = useState(null);

  const colorWithout = isDark ? '#d45a54' : '#a83832';
  const colorWith = isDark ? '#6aad52' : '#4a7c3a';
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const axisColor = isDark ? '#3a5570' : '#9aa5af';
  const gridColor = isDark ? 'rgba(180,198,220,0.1)' : 'rgba(31,41,51,0.08)';

  const w = 620, h = 240;
  const m = { top: 16, right: 16, bottom: 42, left: 52 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;

  const maxDemand = 2600, maxPrice = 17000;
  const xScale = (d) => m.left + (d / maxDemand) * cw;
  const yScale = (p) => m.top + ch - (p / maxPrice) * ch;

  const ptsW = DATA.map((d) => ({ x: xScale(d.demand), y: yScale(d.cbmpWithout) }));
  const ptsE = DATA.map((d) => ({ x: xScale(d.demand), y: yScale(d.cbmpWith) }));
  const line = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const toggle = (i) => setSelectedIdx((p) => (p === i ? null : i));
  const sel = selectedIdx !== null ? DATA[selectedIdx] : null;

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Mercado de balance</span>
        <h3 className={styles.title}>Incidentes de precios en PICASSO y demanda elástica</h3>
        <p className={styles.subtitle}>
          Mitigación del CBMP tras la reforma de ACER (Decisiones 08/2024 y 09/2024).
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ borderColor: colorWithout, borderStyle: 'dashed' }} aria-hidden="true" />
          Sin elasticidad
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ borderColor: colorWith, borderStyle: 'solid' }} aria-hidden="true" />
          Con demanda elástica
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label="Incidentes de precios PICASSO">
          <title>CBMP con y sin elasticidad en función de la demanda aFRR</title>
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          {[0, 4000, 8000, 12000, 16000].map((v) => (
            <g key={v}>
              {v > 0 && <line x1={m.left} y1={yScale(v)} x2={m.left + cw} y2={yScale(v)} stroke={gridColor} strokeWidth="1" />}
              <text x={m.left - 6} y={yScale(v) + 3.5} textAnchor="end" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{v >= 1000 ? `${v / 1000}k` : v}</text>
            </g>
          ))}
          {[0, 500, 1000, 1500, 2000, 2500].map((v) => (
            <text key={v} x={xScale(v)} y={m.top + ch + 13} textAnchor="middle" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{v}</text>
          ))}
          <text x={m.left + cw / 2} y={m.top + ch + 30} textAnchor="middle" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>Demanda aFRR (MW)</text>
          <text x={m.left - 38} y={m.top + ch / 2} textAnchor="middle" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} transform={`rotate(-90,${m.left - 38},${m.top + ch / 2})`}>CBMP (€/MWh)</text>

          <path d={line(ptsW)} fill="none" stroke={colorWithout} strokeWidth="2" strokeDasharray="5 3" />
          <path d={line(ptsE)} fill="none" stroke={colorWith} strokeWidth="2" />

          {DATA.map((d, i) => (
            <g key={i}>
              <circle cx={xScale(d.demand)} cy={yScale(d.cbmpWithout)} r={selectedIdx === i ? 5.5 : 3.5} fill={colorWithout}
                className={styles.point} onClick={() => toggle(i)} tabIndex={0} role="button"
                aria-label={`${d.zone}: sin elast. ${d.cbmpWithout} €/MWh`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}>
                <title>{`${d.zone} — Sin elasticidad: ${d.cbmpWithout.toLocaleString()} €/MWh`}</title>
              </circle>
              <circle cx={xScale(d.demand)} cy={yScale(d.cbmpWith)} r={selectedIdx === i ? 5.5 : 3.5} fill={colorWith}
                className={styles.point} onClick={() => toggle(i)} tabIndex={0} role="button"
                aria-label={`${d.zone}: con elast. ${d.cbmpWith} €/MWh`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}>
                <title>{`${d.zone} — Con elasticidad: ${d.cbmpWith.toLocaleString()} €/MWh`}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      {sel && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${sel.zone}`}>
          <h4 className={styles.detailTitle}>{sel.zone} — {sel.demand} MW</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Sin elasticidad</span>
            <span>{sel.cbmpWithout.toLocaleString()} €/MWh</span>
            <span className={styles.detailLabel}>Con elasticidad</span>
            <span>{sel.cbmpWith.toLocaleString()} €/MWh</span>
          </div>
          <p className={styles.detailNote}>{sel.note}</p>
        </div>
      )}
    </div>
  );
}
