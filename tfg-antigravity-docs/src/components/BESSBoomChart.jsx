// %% AGENT_INSTRUCTION: Insertar en "Actualización 2026: Un Año Después" → "El Boom del Almacenamiento Ibérico", después de "...impulsando una arquitectura de red nativa para servicios de Black Start." y antes de "Conclusión de la Crisis".
// %% LEGEND_PROPOSAL: "Evolución de la capacidad BESS acumulada en España desde Q1 2024 hasta mayo de 2026. Las anotaciones marcan los hitos normativos y de mercado que aceleraron el despliegue."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './BESSBoomChart.module.css';

const DATA = [
  {
    period: 'Q1 2024',
    short: 'Q1 24',
    date: '2024-03-31',
    capacity: 150,
    note: 'Proyectos piloto y autoconsumo industrial aislado.',
    confidence: 'Alta',
  },
  {
    period: 'Q4 2024',
    short: 'Q4 24',
    date: '2024-12-31',
    capacity: 500,
    note: 'Adopción temprana de LFP por desarrolladores first‑movers.',
    confidence: 'Alta',
  },
  {
    period: 'Q2 2025',
    short: 'Q2 25',
    date: '2025-06-30',
    capacity: 1500,
    note: 'Apagón del 28‑A (abril 2025). Aceleración de normativas habilitadoras.',
    confidence: 'Media',
    milestone: true,
    milestoneLabel: '28‑A',
  },
  {
    period: 'Q4 2025',
    short: 'Q4 25',
    date: '2025-12-31',
    capacity: 4200,
    note: '798 horas de precio ≤0 €/MWh en el año. Retrofit masivo para evitar vertidos.',
    confidence: 'Media',
  },
  {
    period: 'Q1 2026',
    short: 'Q1 26',
    date: '2026-03-31',
    capacity: 7800,
    note: 'Hibridación masiva en nudos clave. Adjudicaciones de conexión >400 MW.',
    confidence: 'Alta',
  },
  {
    period: 'Q2 2026 (mayo)',
    short: 'May 26',
    date: '2026-05-31',
    capacity: 9590,
    note: 'Aprobación del Mercado de Capacidad por la Comisión Europea. Consolidación del revenue stacking.',
    confidence: 'Alta',
    milestone: true,
    milestoneLabel: 'Mercado Capacidad UE',
  },
];

export default function BESSBoomChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedIdx, setSelectedIdx] = useState(null);

  const toggle = (i) => setSelectedIdx((prev) => (prev === i ? null : i));

  /* ── Palette ── */
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const axisColor = isDark ? '#3a5570' : '#9aa5af';
  const gridColor = isDark ? 'rgba(180,198,220,0.1)' : 'rgba(31,41,51,0.08)';
  const lineColor = isDark ? '#5a90c8' : '#2a5080';
  const areaColor = isDark ? 'rgba(90,144,200,0.12)' : 'rgba(42,80,128,0.08)';
  const pointColor = isDark ? '#6aad52' : '#4a7c3a';
  const milestoneColor = isDark ? '#c49a4a' : '#9a6b2f';
  const milestoneLineColor = isDark ? 'rgba(196,154,74,0.3)' : 'rgba(154,107,47,0.25)';

  /* ── Geometry ── */
  const w = 620;
  const h = 280;
  const m = { top: 36, right: 20, bottom: 40, left: 62 };
  const cw = w - m.left - m.right;
  const ch = h - m.top - m.bottom;
  const maxCap = 10000;

  const xScale = (i) => m.left + (i / (DATA.length - 1)) * cw;
  const yScale = (v) => m.top + ch - (v / maxCap) * ch;

  /* ── Paths ── */
  const pts = DATA.map((d, i) => ({ x: xScale(i), y: yScale(d.capacity) }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${yScale(0)} L${pts[0].x},${yScale(0)} Z`;

  const yTicks = [0, 2000, 4000, 6000, 8000, 10000];
  const selected = selectedIdx !== null ? DATA[selectedIdx] : null;

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Almacenamiento energético</span>
        <h3 className={styles.title}>Capacidad BESS acumulada — España (2024‑2026)</h3>
        <p className={styles.subtitle}>
          Despliegue trimestral de almacenamiento en baterías. El 28‑A y la aprobación
          del mercado de capacidad europeo impulsaron un crecimiento exponencial.
        </p>
      </header>

      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className={styles.svg}
          role="img"
          aria-label="Gráfico de evolución de la capacidad BESS acumulada en España"
        >
          <title>Capacidad BESS acumulada en España, Q1 2024 – mayo 2026</title>
          <desc>Gráfico de área que muestra el crecimiento de 150 MW a 9 590 MW.</desc>

          {/* Grid + Y axis labels */}
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              {v > 0 && (
                <line
                  x1={m.left}
                  y1={yScale(v)}
                  x2={m.left + cw}
                  y2={yScale(v)}
                  stroke={gridColor}
                  strokeWidth="1"
                />
              )}
              <text
                x={m.left - 8}
                y={yScale(v) + 3.5}
                textAnchor="end"
                fontSize="9"
                fontFamily="Inter, system-ui, sans-serif"
                fill={mutedColor}
              >
                {v === 0 ? '0' : `${(v / 1000).toFixed(0)} GW`}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />

          {/* Milestone vertical markers */}
          {DATA.filter((d) => d.milestone).map((d) => {
            const idx = DATA.indexOf(d);
            const cx = xScale(idx);
            return (
              <line
                key={`mline-${d.period}`}
                x1={cx}
                y1={yScale(d.capacity) - 4}
                x2={cx}
                y2={m.top + ch}
                stroke={milestoneLineColor}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Area */}
          <path d={areaPath} fill={areaColor} />

          {/* Line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />

          {/* Data points */}
          {DATA.map((d, i) => {
            const cx = xScale(i);
            const cy = yScale(d.capacity);
            const isSelected = i === selectedIdx;
            const color = d.milestone ? milestoneColor : pointColor;
            return (
              <circle
                key={d.period}
                cx={cx}
                cy={cy}
                r={isSelected ? 6 : 4}
                fill={color}
                stroke={isDark ? '#13263f' : '#fffdf7'}
                strokeWidth="1.5"
                className={styles.point}
                onClick={() => toggle(i)}
                tabIndex={0}
                role="button"
                aria-label={`${d.period}: ${d.capacity.toLocaleString()} MW`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(i);
                  }
                }}
              >
                <title>{`${d.period}\n${d.capacity.toLocaleString()} MW\nConfianza: ${d.confidence}\n${d.note}`}</title>
              </circle>
            );
          })}

          {/* Milestone labels */}
          {DATA.filter((d) => d.milestone).map((d) => {
            const idx = DATA.indexOf(d);
            const cx = xScale(idx);
            const cy = yScale(d.capacity);
            /* Adjust label position: first milestone above, last to the left */
            const isLast = idx === DATA.length - 1;
            return (
              <text
                key={`ml-${d.period}`}
                x={isLast ? cx - 6 : cx}
                y={cy - 12}
                textAnchor={isLast ? 'end' : 'middle'}
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill={milestoneColor}
              >
                {d.milestoneLabel}
              </text>
            );
          })}

          {/* X axis labels */}
          {DATA.map((d, i) => (
            <text
              key={`xl-${d.period}`}
              x={xScale(i)}
              y={m.top + ch + 16}
              textAnchor="middle"
              fontSize="8.5"
              fontFamily="Inter, system-ui, sans-serif"
              fill={mutedColor}
            >
              {d.short}
            </text>
          ))}
        </svg>
      </div>

      {selected && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${selected.period}`}>
          <h4 className={styles.detailTitle}>{selected.period}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Capacidad acumulada</span>
            <span>{selected.capacity.toLocaleString()} MW</span>
            <span className={styles.detailLabel}>Confianza</span>
            <span>{selected.confidence}</span>
          </div>
          <p className={styles.detailNote}>{selected.note}</p>
        </div>
      )}
    </div>
  );
}
