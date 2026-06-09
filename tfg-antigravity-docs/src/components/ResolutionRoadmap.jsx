// %% AGENT_INSTRUCTION: Insertar en "Conclusiones" → "Tres planos de resolución", sustituyendo la tabla markdown de plano/problema/solución.
// %% LEGEND_PROPOSAL: "Hoja de ruta post-28‑A en los planos técnico, regulatorio y económico. Verde: vigente. Verde claro: guía publicada. Ámbar: recomendación o propuesta. Gris: pendiente."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ResolutionRoadmap.module.css';

const PLANES = [
  {
    plane: 'Técnico',
    items: [
      {
        id: 't1',
        problem: 'Falta de control dinámico de tensión con alta no síncrona',
        solution: 'Despliegue de capacidades Grid-Forming',
        institution: 'ENTSO-E (guía Phase II GFM)',
        status: 'guia',
        horizon: 'europeo',
      },
      {
        id: 't2',
        problem: 'Débil capacidad de observación y post-análisis',
        solution: 'Ampliar WAMS con PMU y requisitos mínimos de monitorización',
        institution: 'REE',
        status: 'recomendacion',
        horizon: 'inmediato',
      },
      {
        id: 't3',
        problem: 'Red débil / baja fortaleza de red para IBR',
        solution: 'Evaluar y reforzar SCR; usar métricas tipo MRSCR',
        institution: 'NERC / literatura técnica',
        status: 'guia',
        horizon: 'medio_plazo',
      },
      {
        id: 't4',
        problem: 'Necesidad de soporte de estabilidad en redes débiles',
        solution: 'BESS-GFM o activos de refuerzo (SynCon)',
        institution: 'NREL / estudios weak-grid',
        status: 'propuesta',
        horizon: 'medio_plazo',
      },
    ],
  },
  {
    plane: 'Regulatorio',
    items: [
      {
        id: 'r1',
        problem: 'Marco obsoleto de control de tensión',
        solution: 'Nuevo P.O. 7.4',
        institution: 'CNMC / BOE',
        status: 'vigente',
        horizon: 'inmediato',
      },
      {
        id: 'r2',
        problem: 'Falta de requisitos armonizados GFM en conexiones europeas',
        solution: 'NC RfG 2.0 + guía ENTSO-E sobre GFM',
        institution: 'ENTSO-E / EC / ACER',
        status: 'propuesta',
        horizon: 'europeo',
      },
      {
        id: 'r3',
        problem: 'Desajuste entre mercado, política energética y física del sistema',
        solution: 'Adaptar marcos regulatorios al sistema en evolución',
        institution: 'ENTSO-E final report',
        status: 'recomendacion',
        horizon: 'europeo',
      },
    ],
  },
  {
    plane: 'Económico',
    items: [
      {
        id: 'e1',
        problem: 'El mercado de energía no remunera el soporte de tensión',
        solution: 'Remuneración de control de tensión en tiempo real y mercado zonal de capacidad reactiva',
        institution: 'CNMC / BOE',
        status: 'vigente',
        horizon: 'inmediato',
      },
      {
        id: 'e2',
        problem: 'Necesidad más amplia de atributos de confiabilidad',
        solution: 'Marco de Essential Reliability Services (ERS)',
        institution: 'NERC',
        status: 'propuesta',
        horizon: 'medio_plazo',
      },
      {
        id: 'e3',
        problem: 'Inercia, FFR, SCR sin mercado español explícito',
        solution: 'Diseñar productos explícitos de ERS',
        institution: 'España / UE',
        status: 'pendiente',
        horizon: 'europeo',
      },
    ],
  },
];

const STATUS_META = {
  vigente: { label: 'Vigente' },
  guia: { label: 'Guía' },
  recomendacion: { label: 'Recom.' },
  propuesta: { label: 'Propuesta' },
  pendiente: { label: 'Pendiente' },
};

const HORIZON_LABELS = {
  inmediato: 'Inmediato',
  medio_plazo: 'Medio plazo',
  europeo: 'Europeo',
};

export default function ResolutionRoadmap() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));

  const planeColor = (plane) => {
    const map = {
      Técnico: isDark ? '#5a90c8' : '#2a5080',
      Regulatorio: isDark ? '#c49a4a' : '#9a6b2f',
      Económico: isDark ? '#6aad52' : '#4a7c3a',
    };
    return map[plane] || map.Técnico;
  };

  const statusColor = (s) => {
    const map = {
      vigente: isDark ? '#5a9d42' : '#3a6b2e',
      guia: isDark ? '#6aad52' : '#4a7c3a',
      recomendacion: isDark ? '#c49a4a' : '#9a6b2f',
      propuesta: isDark ? '#ca8a3a' : '#a87020',
      pendiente: isDark ? '#6a7a8a' : '#8a95a3',
    };
    return map[s] || map.pendiente;
  };

  const allItems = PLANES.flatMap((p) =>
    p.items.map((item) => ({ ...item, plane: p.plane }))
  );
  const selected = allItems.find((i) => i.id === selectedId);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Hoja de ruta</span>
        <h3 className={styles.title}>Tres planos de resolución</h3>
        <p className={styles.subtitle}>
          Soluciones técnicas, regulatorias y económicas identificadas tras el
          28‑A. El estado indica el grado de implementación.
        </p>
      </header>

      <div className={styles.legend}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <span key={key} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: statusColor(key) }}
              aria-hidden="true"
            />
            {meta.label}
          </span>
        ))}
      </div>

      <div className={styles.planes}>
        {PLANES.map((plane) => {
          const color = planeColor(plane.plane);
          return (
            <section
              key={plane.plane}
              className={styles.plane}
              aria-label={`Plano ${plane.plane}`}
            >
              <h4 className={styles.planeTitle} style={{ borderColor: color, color }}>
                {plane.plane}
              </h4>

              {plane.items.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.item} ${isSelected ? styles.itemActive : ''}`}
                    onClick={() => toggle(item.id)}
                    aria-expanded={isSelected}
                    aria-label={`${item.solution} — ${STATUS_META[item.status]?.label || item.status}`}
                  >
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: statusColor(item.status) }}
                    >
                      {STATUS_META[item.status]?.label || item.status}
                    </span>
                    <span className={styles.itemSolution}>{item.solution}</span>
                    <span className={styles.itemInst}>{item.institution}</span>
                  </button>
                );
              })}
            </section>
          );
        })}
      </div>

      {selected && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${selected.solution}`}>
          <h4 className={styles.detailTitle}>{selected.solution}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Problema</span>
            <span>{selected.problem}</span>
            <span className={styles.detailLabel}>Institución</span>
            <span>{selected.institution}</span>
            <span className={styles.detailLabel}>Horizonte</span>
            <span>{HORIZON_LABELS[selected.horizon] || selected.horizon}</span>
            <span className={styles.detailLabel}>Estado</span>
            <span>{STATUS_META[selected.status]?.label || selected.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
