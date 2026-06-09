// %% AGENT_INSTRUCTION: Insertar en "Actualización 2026: Un Año Después" → "Calendario de implementación del P.O. 7.4", sustituyendo la tabla J2 markdown.
// %% LEGEND_PROPOSAL: "Hitos del proceso de reforma del P.O. 7.4 desde la propuesta inicial de REE (2021) hasta la finalización prevista de exenciones transitorias (dic 2026). Verde: completado. Gris: estimado."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './PO74Timeline.module.css';

const MILESTONES = [
  {
    id: 'PO74_001',
    label: 'Propuesta inicial de revisión del P.O. 7.4 por REE a la CNMC',
    date: '2021-07-15',
    status: 'completado',
    category: 'Aprobación regulatoria',
  },
  {
    id: 'PO74_002',
    label: 'Apagón Ibérico (evidencia crítica de inoperancia del control estático)',
    date: '2025-04-28',
    status: 'completado',
    category: 'Evento operativo',
  },
  {
    id: 'PO74_003',
    label: 'Resolución CNMC que aprueba el nuevo servicio de control de tensión',
    date: '2025-06-12',
    status: 'completado',
    category: 'Aprobación regulatoria',
  },
  {
    id: 'PO74_004',
    label: 'Publicación en BOE (BOE‑A‑2025‑13076) del P.O. 7.4 modificado',
    date: '2025-06-26',
    status: 'completado',
    category: 'Publicación oficial',
  },
  {
    id: 'PO74_005',
    label: 'Asignación de ofertas para recursos adicionales excediendo requisitos mínimos',
    date: '2025-12-15',
    status: 'completado',
    category: 'Operación de mercado',
  },
  {
    id: 'PO74_006',
    label: 'Modificación de tolerancia Anexo II para P≤0 y suspensión plazo 10.5',
    date: '2026-03-16',
    status: 'completado',
    category: 'Tolerancia regulatoria',
  },
  {
    id: 'PO74_007',
    label: 'Inicio de la prestación de control de tensión por consignas en tiempo real',
    date: '2026-03-17',
    status: 'completado',
    category: 'Operación de mercado',
  },
  {
    id: 'PO74_008',
    label: 'Finalización de exenciones transitorias para adecuación de equipos de medida',
    date: '2026-12-31',
    status: 'estimado',
    category: 'Exenciones transitorias',
  },
];

const MONTHS_ES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${MONTHS_ES[parseInt(m, 10) - 1]} ${y}`;
}

export default function PO74Timeline() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Reforma regulatoria</span>
        <h3 className={styles.title}>Cronograma del P.O. 7.4</h3>
        <p className={styles.subtitle}>
          Hitos desde la propuesta inicial de REE hasta la finalización prevista
          de las exenciones transitorias.
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotCompleted} aria-hidden="true" />
          Completado
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotEstimated} aria-hidden="true" />
          Estimado
        </span>
      </div>

      <ol className={styles.timeline} role="list">
        {MILESTONES.map((m, i) => {
          const isSelected = m.id === selectedId;
          const isLast = i === MILESTONES.length - 1;

          return (
            <li key={m.id} className={styles.milestone}>
              <div className={styles.rail}>
                <button
                  type="button"
                  className={`${styles.dot} ${
                    m.status === 'completado' ? styles.dotFillCompleted : styles.dotFillEstimated
                  } ${isSelected ? styles.dotActive : ''}`}
                  onClick={() => toggle(m.id)}
                  aria-expanded={isSelected}
                  aria-controls={`po74-detail-${m.id}`}
                  aria-label={`${formatDate(m.date)}: ${m.label} (${m.status})`}
                />
                {!isLast && <span className={styles.stem} aria-hidden="true" />}
              </div>

              <div className={styles.body}>
                <button
                  type="button"
                  className={styles.bodyBtn}
                  onClick={() => toggle(m.id)}
                  aria-expanded={isSelected}
                  aria-controls={`po74-detail-${m.id}`}
                >
                  <time className={styles.date} dateTime={m.date}>
                    {formatDate(m.date)}
                  </time>
                  <span className={styles.label}>{m.label}</span>
                </button>

                {isSelected && (
                  <div
                    id={`po74-detail-${m.id}`}
                    className={styles.detail}
                    role="region"
                    aria-label={`Detalle: ${m.label}`}
                  >
                    <p>
                      <strong>Estado:</strong>{' '}
                      {m.status === 'completado' ? 'Completado' : 'Estimado'}
                    </p>
                    <p>
                      <strong>Categoría:</strong> {m.category}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
