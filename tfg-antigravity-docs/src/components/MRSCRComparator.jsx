// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Simulación de Fortaleza de Red: SCR vs. MRSCR" en el capítulo "El Día Después: Reformas Institucionales".
// %% LEGEND: "Comparación del Short-Circuit Ratio (SCR) tradicional y el Multi-Infeed SCR (MRSCR) real en los nodos de interconexión franco‑ibérica. El umbral MRSCR ≤ 2.0 indica red débil con riesgo de inestabilidad dinámica."
import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './MRSCRComparator.module.css';

const SUBSTATIONS = [
  {
    id: 'hernani',
    name: 'Hernani 400 kV (ES)',
    short: 'Hernani',
    sac: 5500,
    ibr: 1500,
    miif: 0.42,
    scr: 3.67,
    mrscr: 1.88,
    classification: 'Red Débil (Riesgo Crítico)',
  },
  {
    id: 'vic',
    name: 'Vic 400 kV (ES)',
    short: 'Vic',
    sac: 6100,
    ibr: 1800,
    miif: 0.38,
    scr: 3.39,
    mrscr: 1.95,
    classification: 'Red Débil (Riesgo Crítico)',
  },
  {
    id: 'arkale',
    name: 'Arkale 220 kV (ES)',
    short: 'Arkale',
    sac: 2800,
    ibr: 900,
    miif: 0.51,
    scr: 3.11,
    mrscr: 1.48,
    classification: 'Red Extremadamente Débil (Fallo de PLL)',
  },
  {
    id: 'baixas',
    name: 'Baixas 400 kV (FR)',
    short: 'Baixas',
    sac: 14000,
    ibr: 2500,
    miif: 0.18,
    scr: 5.60,
    mrscr: 3.82,
    classification: 'Red Fuerte (Estabilidad Dinámica)',
  },
  {
    id: 'argia',
    name: 'Argia 400 kV (FR)',
    short: 'Argia',
    sac: 4200,
    ibr: 1100,
    miif: 0.48,
    scr: 3.82,
    mrscr: 1.92,
    classification: 'Red Débil (Riesgo Crítico)',
  },
  {
    id: 'lagoaca',
    name: 'Lagoaça 400 kV (PT)',
    short: 'Lagoaça',
    sac: 3900,
    ibr: 1200,
    miif: 0.35,
    scr: 3.25,
    mrscr: 1.83,
    classification: 'Red Débil (Riesgo Crítico)',
  },
];

const THRESHOLD = 2.0;

export default function MRSCRComparator({ showCaption = false }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const scrColor = isDark ? '#5890D8' : '#2A4875';
  const mrscrColor = isDark ? '#D4A040' : '#A86018';

  const width = 800;
  const height = 280; // reducido
  const margin = { top: 20, right: 30, bottom: 50, left: 45 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = 6.0;
  const yScale = (val) => margin.top + chartHeight - (val / maxValue) * chartHeight;

  const groupCount = SUBSTATIONS.length;
  const groupWidth = chartWidth / groupCount;
  const barWidth = Math.min(20, groupWidth * 0.3);
  const barGap = 4;

  const barX = (groupIndex, barIndex) => {
    const groupCenter = margin.left + groupIndex * groupWidth + groupWidth / 2;
    const leftOffset = groupCenter - barWidth - barGap / 2;
    return barIndex === 0 ? leftOffset : leftOffset + barWidth + barGap;
  };

  const handleSelect = (id) => setSelectedId((prev) => (prev === id ? null : id));
  const selectedStation = SUBSTATIONS.find((s) => s.id === selectedId);

  return (
    <div className={styles.container || styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Fortaleza de red</span>
        <h2 className={styles.title}>MRSCR vs SCR en subestaciones ibéricas</h2>
        <p className={styles.subtitle}>
          Comparación del SCR tradicional y el MRSCR en los nodos de interconexión franco‑ibérica. 
          MRSCR ≤ 2.0 indica red débil (riesgo de inestabilidad dinámica).
        </p>
      </header>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: scrColor }} />
          <span>SCR</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: mrscrColor }} />
          <span>MRSCR</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLine}>- - -</span>
          <span>MRSCR = 2.0 (umbral red débil)</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} role="img">
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke="var(--mcomp-axis)" strokeWidth="1" />
          <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} stroke="var(--mcomp-axis)" strokeWidth="1" />
          {[0,1,2,3,4,5,6].map(v => (
            <line key={`grid-${v}`} x1={margin.left} y1={yScale(v)} x2={margin.left + chartWidth} y2={yScale(v)} stroke="var(--mcomp-grid)" strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          <line x1={margin.left} y1={yScale(THRESHOLD)} x2={margin.left + chartWidth} y2={yScale(THRESHOLD)} stroke="var(--mcomp-threshold)" strokeWidth="2" strokeDasharray="6 3" />
          <text x={margin.left + chartWidth} y={yScale(THRESHOLD) - 6} textAnchor="end" fontSize="9" fill="var(--mcomp-text)" opacity="0.8">MRSCR=2.0</text>
          {[0,1,2,3,4,5,6].map(v => (
            <text key={`yl-${v}`} x={margin.left - 6} y={yScale(v) + 3} textAnchor="end" fontSize="10" fill="var(--mcomp-text)">{v}</text>
          ))}
          {SUBSTATIONS.map((station, i) => (
            <g key={station.id}>
              <rect
                x={barX(i,0)}
                y={yScale(station.scr)}
                width={barWidth}
                height={chartHeight - (yScale(station.scr) - margin.top)}
                fill={scrColor}
                className={styles.bar}
                onClick={() => handleSelect(station.id)}
                tabIndex={0}
                role="button"
                aria-label={`SCR ${station.scr}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(station.id); } }}
              />
              <rect
                x={barX(i,1)}
                y={yScale(station.mrscr)}
                width={barWidth}
                height={chartHeight - (yScale(station.mrscr) - margin.top)}
                fill={mrscrColor}
                className={styles.bar}
                onClick={() => handleSelect(station.id)}
                tabIndex={0}
                role="button"
                aria-label={`MRSCR ${station.mrscr}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(station.id); } }}
              />
              <text
                x={margin.left + i * groupWidth + groupWidth / 2}
                y={margin.top + chartHeight + 18}
                textAnchor="middle"
                fontSize="10"
                fill="var(--mcomp-text)"
              >
                {station.short}
              </text>
            </g>
          ))}
        </svg>
        {selectedStation && (
          <div className={styles.detailPanel}>
            <h4 className={styles.detailTitle}>{selectedStation.name}</h4>
            <dl className={styles.detailGrid}>
              <div><dt>SCR</dt><dd>{selectedStation.scr}</dd></div>
              <div><dt>MRSCR</dt><dd>{selectedStation.mrscr}</dd></div>
              <div><dt>S<sub>ac</sub> (MVA)</dt><dd>{selectedStation.sac.toLocaleString()}</dd></div>
              <div><dt>Capacidad IBR (MW)</dt><dd>{selectedStation.ibr}</dd></div>
              <div><dt>MIIF promedio</dt><dd>{selectedStation.miif}</dd></div>
              <div><dt>Clasificación</dt><dd className={styles.classification}>{selectedStation.classification}</dd></div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}