// %% AGENT_INSTRUCTION: Insertar en "Conclusiones" → "Simulador del Trilema (Modelo Interactivo)" o tras la tabla K1, sustituyendo el texto estático que describe las tensiones.
// %% LEGEND_PROPOSAL: "Trilema estructural del sistema ibérico el 28‑A. Cada arista muestra una tensión operativa entre dos objetivos. El centro marca el punto de máxima tensión simultánea vivido el 28 de abril de 2025. Pulsar cada arista para ver el detalle."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './TrilemmaTriangle.module.css';

const TENSIONS = [
  {
    id: 'des_est',
    from: 'Descarbonización',
    to: 'Estabilidad',
    edgeLabel: 'Marginación de síncronas',
    metric: '82 % renovable · H sur = 1,3 s',
    detail:
      'La orden de mérito desplazó los CCGT, vaciando al sistema de inercia y potencia de cortocircuito en el instante crítico.',
  },
  {
    id: 'des_aseq',
    from: 'Descarbonización',
    to: 'Asequibilidad',
    edgeLabel: 'Horas de precio ≤ 0 €/MWh',
    metric: '784 h en 2024 · 18,50 €/MWh el 28‑A',
    detail:
      'Más de 500 horas de precio cero o negativo en 2024; precio medio diario de 18,50 €/MWh el propio 28-A.',
  },
  {
    id: 'est_aseq',
    from: 'Estabilidad',
    to: 'Asequibilidad',
    edgeLabel: 'Coste de servicios esenciales',
    metric: 'P.O. 7.4 reformado jun 2025',
    detail:
      'Los servicios de inercia, reactiva dinámica y FFR no estaban remunerados explícitamente en el diseño de mercado previo al 28-A.',
  },
];

/* Triangle geometry (in viewBox 560×420) */
const V = {
  top: { x: 280, y: 50 },
  left: { x: 70, y: 360 },
  right: { x: 490, y: 360 },
};

const CENTER = { x: 280, y: 260 };

/* Edge midpoints for label placement */
const EDGE_MID = {
  des_est: { x: (V.top.x + V.left.x) / 2 - 10, y: (V.top.y + V.left.y) / 2 - 8 },
  des_aseq: { x: (V.top.x + V.right.x) / 2 + 10, y: (V.top.y + V.right.y) / 2 - 8 },
  est_aseq: { x: (V.left.x + V.right.x) / 2, y: (V.left.y + V.right.y) / 2 + 22 },
};

/* Edge endpoints for hit areas */
const EDGE_POINTS = {
  des_est: { x1: V.top.x, y1: V.top.y, x2: V.left.x, y2: V.left.y },
  des_aseq: { x1: V.top.x, y1: V.top.y, x2: V.right.x, y2: V.right.y },
  est_aseq: { x1: V.left.x, y1: V.left.y, x2: V.right.x, y2: V.right.y },
};

export default function TrilemmaTriangle() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));
  const selected = TENSIONS.find((t) => t.id === selectedId);

  const edgeColor = isDark ? '#4a6a8a' : '#8a9aaa';
  const accentColor = isDark ? '#c49a4a' : '#9a6b2f';
  const centerFill = isDark ? '#b84a44' : '#a83832';
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const vertexFill = isDark ? '#13263f' : '#fffdf7';
  const vertexStroke = isDark ? '#5a90c8' : '#2a5080';
  const selectedEdge = isDark ? '#e5c87a' : '#b38530';

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Trilema estructural</span>
        <h3 className={styles.title}>Trilema de la transición energética</h3>
        <p className={styles.subtitle}>
          Tensiones entre descarbonización, estabilidad y asequibilidad. El
          centro representa el punto de máxima tensión simultánea vivido el 28‑A.
        </p>
      </header>

      <div className={styles.chartWrap}>
        <svg
          viewBox="0 0 560 420"
          className={styles.svg}
          role="img"
          aria-label="Diagrama del trilema energético del 28‑A"
        >
          <title>Trilema: descarbonización, estabilidad dinámica y asequibilidad</title>

          {/* Triangle edges (visible) */}
          <polygon
            points={`${V.top.x},${V.top.y} ${V.left.x},${V.left.y} ${V.right.x},${V.right.y}`}
            fill="none"
            stroke={edgeColor}
            strokeWidth="1.5"
          />

          {/* Clickable edge overlays (one per tension) */}
          {TENSIONS.map((t) => {
            const ep = EDGE_POINTS[t.id];
            const isActive = t.id === selectedId;
            return (
              <line
                key={t.id}
                x1={ep.x1}
                y1={ep.y1}
                x2={ep.x2}
                y2={ep.y2}
                stroke={isActive ? selectedEdge : 'transparent'}
                strokeWidth={isActive ? 3 : 22}
                strokeLinecap="round"
                className={styles.edgeHit}
                onClick={() => toggle(t.id)}
                tabIndex={0}
                role="button"
                aria-label={`Tensión: ${t.from} ↔ ${t.to}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(t.id);
                  }
                }}
              >
                <title>{`${t.from} ↔ ${t.to}: ${t.edgeLabel}`}</title>
              </line>
            );
          })}

          {/* Selected edge highlight */}
          {selected && (
            <line
              x1={EDGE_POINTS[selected.id].x1}
              y1={EDGE_POINTS[selected.id].y1}
              x2={EDGE_POINTS[selected.id].x2}
              y2={EDGE_POINTS[selected.id].y2}
              stroke={selectedEdge}
              strokeWidth="3"
              strokeLinecap="round"
              pointerEvents="none"
            />
          )}

          {/* Edge labels */}
          {TENSIONS.map((t) => {
            const mid = EDGE_MID[t.id];
            const anchor = t.id === 'des_est' ? 'end' : t.id === 'des_aseq' ? 'start' : 'middle';
            return (
              <g key={`label-${t.id}`}>
                <text
                  x={mid.x}
                  y={mid.y}
                  textAnchor={anchor}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill={t.id === selectedId ? selectedEdge : accentColor}
                >
                  {t.edgeLabel}
                </text>
                <text
                  x={mid.x}
                  y={mid.y + 13}
                  textAnchor={anchor}
                  fontSize="7.5"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill={mutedColor}
                >
                  {t.metric}
                </text>
              </g>
            );
          })}

          {/* Center marker: 28-A */}
          <circle cx={CENTER.x} cy={CENTER.y} r="22" fill={centerFill} opacity="0.9" />
          <text
            x={CENTER.x}
            y={CENTER.y + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#fff"
          >
            28‑A
          </text>

          {/* Vertices */}
          {[
            { pos: V.top, label: 'Descarbonización', labelY: V.top.y - 18 },
            { pos: V.left, label: 'Estabilidad', sublabel: 'dinámica', labelY: V.left.y + 20 },
            { pos: V.right, label: 'Asequibilidad', labelY: V.right.y + 20 },
          ].map((v, i) => (
            <g key={i}>
              <circle
                cx={v.pos.x}
                cy={v.pos.y}
                r="8"
                fill={vertexFill}
                stroke={vertexStroke}
                strokeWidth="2"
              />
              <text
                x={v.pos.x}
                y={v.labelY}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                fill={textColor}
              >
                {v.label}
              </text>
              {v.sublabel && (
                <text
                  x={v.pos.x}
                  y={v.labelY + 13}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill={textColor}
                >
                  {v.sublabel}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {selected && (
        <div className={styles.detail} role="region" aria-label={`Tensión: ${selected.from} ↔ ${selected.to}`}>
          <h4 className={styles.detailTitle}>
            {selected.from} ↔ {selected.to}
          </h4>
          <p>
            <strong>Métrica:</strong> {selected.metric}
          </p>
          <p className={styles.detailNote}>{selected.detail}</p>
        </div>
      )}
    </div>
  );
}
