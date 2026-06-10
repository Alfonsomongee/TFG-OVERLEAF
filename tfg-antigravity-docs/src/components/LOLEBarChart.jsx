// %% AGENT_INSTRUCTION: Sustituir la tabla bajo "Datos de Resultados Enmendados de LOLE en ERAA 2025" en "El Día Después: Reformas Institucionales".
// %% LEGEND_PROPOSAL: "Horas anuales de LOLE por zona de oferta según Decisión 06/2026 de ACER. Línea discontinua: estándar de fiabilidad (3 h para la mayoría de zonas, 8 h para ISEM)."

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

const YEAR_PALETTE = {
  light: { 2028: '#4a7c3a', 2030: '#2a5080', 2033: '#9a6b2f', 2035: '#6a4a7a' },
  dark:  { 2028: '#6aad52', 2030: '#5a90c8', 2033: '#c49a4a', 2035: '#a07ab0' },
};

export default function LOLEBarChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedZone, setSelectedZone] = useState(null);

  const colors = isDark ? YEAR_PALETTE.dark : YEAR_PALETTE.light;
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const axisColor = isDark ? '#3a5570' : '#9aa5af';
  const gridColor = isDark ? 'rgba(180,198,220,0.1)' : 'rgba(31,41,51,0.08)';
  const stdColor = isDark ? '#d45a54' : '#a83832';

  const w = 680, h = 250;
  const m = { top: 18, right: 20, bottom: 44, left: 40 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;
  const maxLOLE = 26;
  const yScale = (v) => m.top + ch - (v / maxLOLE) * ch;

  const gw = cw / ZONES.length;
  const bPad = 2;
  const bw = Math.min(14, (gw - 8 - 3 * bPad) / 4);
  const getBarX = (zi, yi) => m.left + zi * gw + 4 + yi * (bw + bPad);

  const toggle = (id) => setSelectedZone((p) => (p === id ? null : id));
  const sel = ZONES.find((z) => z.id === selectedZone);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Planificación estratégica</span>
        <h3 className={styles.title}>LOLE por zona de oferta (ERAA 2025 enmendada)</h3>
        <p className={styles.subtitle}>
          Decisión 06/2026 de ACER. La línea discontinua marca el estándar de
          fiabilidad (3 h).
        </p>
      </header>

      <div className={styles.legend}>
        {YEARS.map((y) => (
          <span key={y} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: colors[y] }} aria-hidden="true" />{y}
          </span>
        ))}
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{ borderColor: stdColor }} aria-hidden="true" />
          Estándar 3 h
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label="LOLE por zona de oferta">
          <title>Evolución de LOLE por zona, ERAA 2025</title>
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          {[0, 5, 10, 15, 20, 25].map((v) => (
            <g key={v}>
              {v > 0 && <line x1={m.left} y1={yScale(v)} x2={m.left + cw} y2={yScale(v)} stroke={gridColor} strokeWidth="1" />}
              <text x={m.left - 6} y={yScale(v) + 3.5} textAnchor="end" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{v} h</text>
            </g>
          ))}
          <line x1={m.left} y1={yScale(3)} x2={m.left + cw} y2={yScale(3)} stroke={stdColor} strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={m.left + 6} y={yScale(3) - 4} fontSize="7.5" fontFamily="Inter,system-ui,sans-serif" fill={stdColor}>3 h</text>

          {ZONES.map((zone, zi) =>
            YEARS.map((year, yi) => {
              const barH = ch - (yScale(zone.values[year]) - m.top);
              return (
                <rect key={`${zone.id}-${year}`}
                  x={getBarX(zi, yi)} y={yScale(zone.values[year])} width={bw} height={barH}
                  fill={colors[year]} rx="1.5" className={styles.bar}
                  onClick={() => toggle(zone.id)} tabIndex={0} role="button"
                  aria-label={`${zone.name} ${year}: ${zone.values[year]} h`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(zone.id); } }}>
                  <title>{`${zone.name} ${year}: ${zone.values[year]} h`}</title>
                </rect>
              );
            })
          )}
          {ZONES.map((zone, i) => (
            <text key={zone.id} x={m.left + i * gw + gw / 2} y={m.top + ch + 14} textAnchor="middle" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{zone.id}</text>
          ))}
        </svg>
      </div>

      {sel && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${sel.name}`}>
          <h4 className={styles.detailTitle}>{sel.name} (estándar: {sel.standard} h)</h4>
          <div className={styles.valuesRow}>
            {YEARS.map((y) => (
              <span key={y} className={styles.valueItem}>
                <span className={styles.yearTag}>{y}</span>
                <span className={styles.hours} style={{ color: colors[y] }}>{sel.values[y]} h</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
