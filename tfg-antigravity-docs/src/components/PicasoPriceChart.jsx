// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Incidentes de Precios en PICASSO e Impacto del Límite de Demanda Elástica" en el capítulo "El Día Después: Reformas Institucionales".
// %% LEGEND: "CBMP (€/MWh) sin elasticidad (rojo discontinuo) y con demanda elástica (verde) para activaciones de aFRR. Efecto mitigador de las Decisiones ACER 08/2024 y 09/2024."
import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './PicasoPriceChart.module.css';

const DATA = [
  { demand: 45, zone: 'DK2', cbmpWithout: 2100, cbmpWith: 450, note: 'Baja inercia local, eólica nula' },
  { demand: 140, zone: 'DK1+DK2', cbmpWithout: 4618, cbmpWith: 850, note: 'Periodo de rampa solar vespertina' },
  { demand: 500, zone: 'Terna (IT)', cbmpWithout: 5800, cbmpWith: 1200, note: 'Pérdida de línea de interconexión' },
  { demand: 1200, zone: 'RTE (FR)', cbmpWithout: 7500, cbmpWith: 2100, note: 'Transitorio tras rearranque nuclear' },
  { demand: 2500, zone: 'RTE (FR - Apagón)', cbmpWithout: 16000, cbmpWith: 4500, note: 'Pérdida masiva de interconexión' },
];

export default function PicasoPriceChart({ showCaption = false }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedIdx, setSelectedIdx] = useState(null);

  const colorWithout = isDark ? '#E74C3C' : '#E74C3C';
  const colorWith = isDark ? '#72BC54' : '#4E7432';

  const width = 700;
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 45, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxDemand = 2600;
  const maxPrice = 17000;
  const xScale = (d) => margin.left + (d / maxDemand) * chartWidth;
  const yScale = (p) => margin.top + chartHeight - (p / maxPrice) * chartHeight;

  const pointsWithout = DATA.map(d => ({ x: xScale(d.demand), y: yScale(d.cbmpWithout) }));
  const pointsWith = DATA.map(d => ({ x: xScale(d.demand), y: yScale(d.cbmpWith) }));

  const linePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const handleClick = (idx) => setSelectedIdx(prev => prev === idx ? null : idx);

  return (
    <div className={styles.container || styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Mercado de balance</span>
        <h2 className={styles.title}>Incidentes de precios en PICASSO y demanda elástica</h2>
        <p className={styles.subtitle}>
          Mitigación del CBMP tras la reforma de ACER (Decisión 08/2024 y 09/2024).
        </p>
      </header>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: colorWithout }} />
          <span>Sin elasticidad</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: colorWith }} />
          <span>Con demanda elástica</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
          <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} stroke="var(--pic-axis)" strokeWidth="1" />
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke="var(--pic-axis)" strokeWidth="1" />
          {[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000].map(v => (
            <g key={`grid-${v}`}>
              <line x1={margin.left} y1={yScale(v)} x2={margin.left + chartWidth} y2={yScale(v)} stroke="var(--pic-grid)" strokeWidth="0.5" strokeDasharray="3 3" />
              <text x={margin.left - 6} y={yScale(v) + 3} textAnchor="end" fontSize="9" fill="var(--pic-text)">{v >= 1000 ? `${v/1000}k` : v}</text>
            </g>
          ))}
          {[0, 500, 1000, 1500, 2000, 2500].map(v => (
            <text key={`xl-${v}`} x={xScale(v)} y={margin.top + chartHeight + 15} textAnchor="middle" fontSize="9" fill="var(--pic-text)">{v}</text>
          ))}
          <text x={margin.left + chartWidth/2} y={margin.top + chartHeight + 35} textAnchor="middle" fontSize="10" fill="var(--pic-text)">Demanda aFRR (MW)</text>
          <text x={margin.left - 45} y={margin.top + chartHeight/2} textAnchor="middle" fontSize="10" fill="var(--pic-text)" transform={`rotate(-90, ${margin.left - 45}, ${margin.top + chartHeight/2})`}>CBMP (€/MWh)</text>

          <path d={linePath(pointsWithout)} fill="none" stroke={colorWithout} strokeWidth="2" strokeDasharray="5 3" />
          <path d={linePath(pointsWith)} fill="none" stroke={colorWith} strokeWidth="2" />

          {DATA.map((d, i) => (
            <g key={`pt-${i}`}>
              <circle cx={xScale(d.demand)} cy={yScale(d.cbmpWithout)} r="4" fill={colorWithout} className={styles.point} onClick={() => handleClick(i)} tabIndex={0} role="button" aria-label={`Sin elasticidad: ${d.cbmpWithout} €/MWh`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(i); } }} />
              <circle cx={xScale(d.demand)} cy={yScale(d.cbmpWith)} r="4" fill={colorWith} className={styles.point} onClick={() => handleClick(i)} tabIndex={0} role="button" aria-label={`Con elasticidad: ${d.cbmpWith} €/MWh`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(i); } }} />
            </g>
          ))}
        </svg>
        {selectedIdx !== null && (
          <div className={styles.detailPanel}>
            <h4 className={styles.detailTitle}>{DATA[selectedIdx].zone} — {DATA[selectedIdx].demand} MW</h4>
            <p><strong>Sin elasticidad:</strong> {DATA[selectedIdx].cbmpWithout.toLocaleString()} €/MWh</p>
            <p><strong>Con elasticidad:</strong> {DATA[selectedIdx].cbmpWith.toLocaleString()} €/MWh</p>
            <p className={styles.note}>{DATA[selectedIdx].note}</p>
          </div>
        )}
      </div>
    </div>
  );
}