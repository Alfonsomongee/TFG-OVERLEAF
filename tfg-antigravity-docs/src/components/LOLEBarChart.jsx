// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Resultados Enmendados de LOLE en ERAA 2025 (Visualización: Recharts Multi-Bar Chart)" en el capítulo "El Día Después: Reformas Institucionales".
// %% LEGEND: "Horas anuales de LOLE por zona de oferta según la Decisión 06/2026 de ACER. La línea discontinua roja marca el estándar de fiabilidad (3 h para la mayoría de zonas, 8 h para ISEM)."
import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './LOLEBarChart.module.css';

const ZONES = [
  { id: 'DK00', name: 'Dinamarca', standard: 3, values: { 2028: 14.80, 2030: 20.13, 2033: 19.97, 2035: 23.76 } },
  { id: 'LU00', name: 'Luxemburgo', standard: 3, values: { 2028: 14.30, 2030: 19.64, 2033: 19.85, 2035: 24.00 } },
  { id: 'NO00', name: 'Noruega', standard: 3, values: { 2028: 4.03, 2030: 5.98, 2033: 10.64, 2035: 2.91 } },
  { id: 'SE00', name: 'Suecia', standard: 3, values: { 2028: 6.51, 2030: 7.90, 2033: 10.31, 2035: 6.86 } },
  { id: 'IT00', name: 'Italia', standard: 3, values: { 2028: 16.05, 2030: 6.35, 2033: 6.75, 2035: 5.13 } },
  { id: 'ISEM', name: 'Irlanda', standard: 8, values: { 2028: 2.04, 2030: 2.66, 2033: 3.48, 2035: 4.43 } },
];

const YEARS = [2028, 2030, 2033, 2035];
const YEAR_COLORS = { 2028: '#4E7432', 2030: '#3498DB', 2033: '#A86018', 2035: '#8E44AD' };
const YEAR_COLORS_DARK = { 2028: '#72BC54', 2030: '#5DADE2', 2033: '#D4A040', 2035: '#AF7AC5' };

export default function LOLEBarChart({ showCaption = false }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedZone, setSelectedZone] = useState(null);
  const colors = isDark ? YEAR_COLORS_DARK : YEAR_COLORS;

  const width = 800;
  const height = 280;
  const margin = { top: 20, right: 30, bottom: 60, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const maxLOLE = 26;
  const yScale = (v) => margin.top + chartHeight - (v / maxLOLE) * chartHeight;

  const groupWidth = chartWidth / ZONES.length;
  const barCount = YEARS.length;
  const barPadding = 2;
  const barWidth = Math.min(18, (groupWidth - 8 - (barCount - 1) * barPadding) / barCount);

  const getBarX = (zi, yi) => {
    const groupStart = margin.left + zi * groupWidth + 4;
    return groupStart + yi * (barWidth + barPadding);
  };

  const handleZoneClick = (id) => setSelectedZone((prev) => (prev === id ? null : id));
  const selectedData = ZONES.find(z => z.id === selectedZone);

  return (
    <div className={styles.container || styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Planificación estratégica</span>
        <h2 className={styles.title}>Evolución de LOLE por zona de oferta (ERAA 2025 enmendada)</h2>
        <p className={styles.subtitle}>
          LOLE anual según Decisión 06/2026 de ACER. La línea discontinua marca el estándar de fiabilidad local (3 h).
        </p>
      </header>
      <div className={styles.legend}>
        {YEARS.map(y => (
          <div key={y} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: colors[y] }} />
            <span>{y}</span>
          </div>
        ))}
        <div className={styles.legendItem}>
          <span className={styles.legendLine}>---</span>
          <span>Estándar 3 h</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke="var(--lole-axis)" strokeWidth="1" />
          <line x1={margin.left} y1={margin.top + chartHeight} x2={margin.left + chartWidth} y2={margin.top + chartHeight} stroke="var(--lole-axis)" strokeWidth="1" />
          {[0,5,10,15,20,25].map(v => (
            <g key={`grid-${v}`}>
              <line x1={margin.left} y1={yScale(v)} x2={margin.left + chartWidth} y2={yScale(v)} stroke="var(--lole-grid)" strokeWidth="0.5" strokeDasharray="3 3" />
              <text x={margin.left - 6} y={yScale(v)+3} textAnchor="end" fontSize="9" fill="var(--lole-text)">{v}h</text>
            </g>
          ))}
          <line x1={margin.left} y1={yScale(3)} x2={margin.left + chartWidth} y2={yScale(3)} stroke="var(--lole-standard)" strokeWidth="2" strokeDasharray="6 4" />
          <text x={margin.left + 8} y={yScale(3) - 5} fontSize="9" fill="var(--lole-standard)">3 h</text>
          {ZONES.map((zone, zi) =>
            YEARS.map((year, yi) => (
              <rect
                key={`${zone.id}-${year}`}
                x={getBarX(zi, yi)}
                y={yScale(zone.values[year])}
                width={barWidth}
                height={chartHeight - (yScale(zone.values[year]) - margin.top)}
                fill={colors[year]}
                className={styles.bar}
                onClick={() => handleZoneClick(zone.id)}
                tabIndex={0}
                role="button"
                aria-label={`${zone.name} ${year}: ${zone.values[year]} h`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleZoneClick(zone.id); } }}
              />
            ))
          )}
          {ZONES.map((zone, i) => (
            <text key={`zl-${zone.id}`} x={margin.left + i * groupWidth + groupWidth / 2} y={margin.top + chartHeight + 18} textAnchor="middle" fontSize="10" fill="var(--lole-text)">{zone.id}</text>
          ))}
        </svg>
        {selectedData && (
          <div className={styles.detailPanel}>
            <h4 className={styles.detailTitle}>{selectedData.name} (Estándar {selectedData.standard} h)</h4>
            <div className={styles.valuesGrid}>
              {YEARS.map(y => (
                <div key={y} className={styles.valueItem}>
                  <span className={styles.yearLabel}>{y}</span>
                  <span className={styles.hours} style={{ color: colors[y] }}>{selectedData.values[y]} h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}