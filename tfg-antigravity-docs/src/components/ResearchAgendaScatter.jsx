// %% AGENT_INSTRUCTION: Insertar en "Conclusiones" → "Agenda de investigación futura", sustituyendo la tabla markdown de líneas de investigación.
// %% LEGEND_PROPOSAL: "Cada fila representa una línea de investigación futura. Las barras indican la madurez técnica y regulatoria (escala 0–3). Los puntos de confianza reflejan la solidez de la evidencia disponible."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ResearchAgendaScatter.module.css';

const LINES = [
  {
    id: 'pmu_wams',
    label: 'PMU/WAMS para DSA y estabilidad',
    tech: 3,
    reg: 2,
    confidence: 3,
    problem: 'La supervisión clásica detecta tarde fenómenos rápidos.',
  },
  {
    id: 'ers',
    label: 'Mercado de ERS (inercia virtual, GFM)',
    tech: 2.5,
    reg: 1,
    confidence: 3,
    problem: 'Falta de señal económica para atributos que el energy-only market no remunera.',
  },
  {
    id: 'mrscr',
    label: 'Estimación MRSCR con PMU',
    tech: 2,
    reg: 1,
    confidence: 2,
    problem: 'SCR simple insuficiente con múltiples IBR cercanos.',
  },
  {
    id: 'syncon',
    label: 'Comparativa SynCon vs BESS‑GFM',
    tech: 2,
    reg: 1,
    confidence: 2,
    problem: 'Decidir qué activo refuerza mejor la tensión y el SCR local.',
  },
  {
    id: 'oltc_model',
    label: 'Modelado Tap‑Lag/OLTC (PSCAD/EMTP)',
    tech: 2,
    reg: 1,
    confidence: 1.5,
    problem: 'Rol de tomas lentas en sobretensiones ocultas.',
  },
  {
    id: 'oltc_block',
    label: 'Bloqueo jerárquico OLTC + emergencia',
    tech: 1.5,
    reg: 1,
    confidence: 1,
    problem: 'Evitar que controles locales empeoren rampas de tensión.',
  },
  {
    id: 'ucte',
    label: 'Relectura UCTE (invariantes históricos)',
    tech: 1.5,
    reg: 1,
    confidence: 1,
    problem: 'Extraer lecciones de grandes apagones previos.',
  },
];

const MAX_LEVEL = 3;

function ConfidenceDots({ value, max = 3, color }) {
  const filled = Math.round(value);
  return (
    <span className={styles.dots} aria-label={`Confianza: ${value}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={{
            backgroundColor: i < filled ? color : 'transparent',
            borderColor: color,
          }}
        />
      ))}
    </span>
  );
}

export default function ResearchAgendaScatter() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));
  const selected = LINES.find((l) => l.id === selectedId);

  const techColor = isDark ? '#5a90c8' : '#2a5080';
  const regColor = isDark ? '#c49a4a' : '#9a6b2f';
  const confColor = isDark ? '#6aad52' : '#4a7c3a';

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Investigación futura</span>
        <h3 className={styles.title}>
          Madurez técnica vs. regulatoria de las líneas abiertas
        </h3>
        <p className={styles.subtitle}>
          Cada línea de investigación se valora por su madurez técnica y
          regulatoria (escala 0–3). Los puntos reflejan la confianza de la
          evidencia actual.
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendBar} style={{ backgroundColor: techColor }} aria-hidden="true" />
          Madurez técnica
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendBar} style={{ backgroundColor: regColor }} aria-hidden="true" />
          Madurez regulatoria
        </span>
        <span className={styles.legendItem}>
          <ConfidenceDots value={3} color={confColor} />
          <span style={{ marginLeft: '0.15rem' }}>Confianza</span>
        </span>
      </div>

      <div className={styles.table} role="table" aria-label="Madurez de líneas de investigación">
        {/* Column headers */}
        <div className={styles.tableHead} role="row" aria-hidden="true">
          <span className={styles.colLine}>Línea de investigación</span>
          <span className={styles.colBars}>Madurez</span>
          <span className={styles.colConf}>Conf.</span>
        </div>

        {LINES.map((line) => {
          const isSelected = line.id === selectedId;
          const techPct = (line.tech / MAX_LEVEL) * 100;
          const regPct = (line.reg / MAX_LEVEL) * 100;

          return (
            <button
              key={line.id}
              type="button"
              className={`${styles.row} ${isSelected ? styles.rowActive : ''}`}
              onClick={() => toggle(line.id)}
              aria-expanded={isSelected}
              aria-label={`${line.label}: técnica ${line.tech}/3, regulatoria ${line.reg}/3, confianza ${line.confidence}/3`}
            >
              <span className={styles.lineLabel}>{line.label}</span>

              <span className={styles.barsBlock}>
                <span className={styles.barLine}>
                  <span className={styles.barTag}>Téc.</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{
                        width: `${Math.max(techPct, 3)}%`,
                        backgroundColor: techColor,
                      }}
                    />
                  </span>
                  <span className={styles.barVal}>{line.tech}</span>
                </span>
                <span className={styles.barLine}>
                  <span className={styles.barTag}>Reg.</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{
                        width: `${Math.max(regPct, 3)}%`,
                        backgroundColor: regColor,
                      }}
                    />
                  </span>
                  <span className={styles.barVal}>{line.reg}</span>
                </span>
              </span>

              <span className={styles.confCell}>
                <ConfidenceDots value={line.confidence} color={confColor} />
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${selected.label}`}>
          <h4 className={styles.detailTitle}>{selected.label}</h4>
          <p>
            <strong>Problema:</strong> {selected.problem}
          </p>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Madurez técnica</span>
            <span>{selected.tech} / 3</span>
            <span className={styles.detailLabel}>Madurez regulatoria</span>
            <span>{selected.reg} / 3</span>
            <span className={styles.detailLabel}>Confianza</span>
            <span>{selected.confidence} / 3</span>
          </div>
        </div>
      )}
    </div>
  );
}
