// %% AGENT_INSTRUCTION: Insertar en "Actualización 2026: Un Año Después" → "Estado procesal y regulatorio (mayo 2026)", sustituyendo la tabla J1 markdown.
// %% LEGEND_PROPOSAL: "Expedientes sancionadores incoados por la CNMC tras el 28‑A. Las barras representan el número de expedientes; el color indica la gravedad de la infracción según la LSE. Rojo: muy grave (hasta 60 M€). Ámbar: grave (hasta 6 M€)."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './CNMCSanctionsChart.module.css';

const ENTITIES = [
  {
    id: 'ree',
    name: 'Red Eléctrica de España',
    short: 'REE',
    expedientes: 1,
    tipificacion: 'muy_grave',
    sancion_max: 60,
    category: 'Operador del sistema',
    estado:
      'Instrucción abierta. Presunto incumplimiento art. 30.2 LSE.',
  },
  {
    id: 'iberdrola_nuc',
    name: 'Iberdrola Gen. Nuclear (Almaraz‑Trillo)',
    short: 'Iberdrola Nuclear',
    expedientes: 1,
    tipificacion: 'muy_grave',
    sancion_max: 60,
    category: 'Generador nuclear',
    estado:
      'Investigada por reducción no autorizada de producción. Demanda cruzada contra REE.',
  },
  {
    id: 'endesa',
    name: 'Endesa Generación',
    short: 'Endesa',
    expedientes: 12,
    tipificacion: 'grave',
    sancion_max: 6,
    category: 'Generador CCGT',
    estado:
      'Múltiples expedientes por indisponibilidad y presuntas irregularidades.',
  },
  {
    id: 'hueneja',
    name: 'Sist. Eléctrico Conexión Huéneja',
    short: 'Huéneja',
    expedientes: 1,
    tipificacion: 'grave',
    sancion_max: 6,
    category: 'Gestor de subestación',
    estado:
      'Incoado 13‑may‑2026. Punto cero del colapso. Arts. 64.15‑17 LSE.',
  },
  {
    id: 'otros',
    name: 'Repsol, Naturgy, Engie, TotalEnergies, etc.',
    short: 'Otros (~30)',
    expedientes: 30,
    tipificacion: 'grave',
    sancion_max: 6,
    category: 'Generadores CCGT y otros',
    estado:
      'Fase de instrucción. Investigados por reducción no autorizada o falta de soporte reactivo.',
  },
];

const MAX_EXPEDIENTES = 30;

export default function CNMCSanctionsChart() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));
  const selected = ENTITIES.find((e) => e.id === selectedId);

  const colorMuyGrave = isDark ? '#d45a54' : '#a83832';
  const colorGrave = isDark ? '#d48a3a' : '#b35a1e';

  const getColor = (tip) =>
    tip === 'muy_grave' ? colorMuyGrave : colorGrave;

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Consecuencias administrativas</span>
        <h3 className={styles.title}>
          Expedientes sancionadores CNMC (mayo 2026)
        </h3>
        <p className={styles.subtitle}>
          Expedientes incoados por entidad tras el apagón del 28‑A.
          El color indica la gravedad según la Ley del Sector Eléctrico.
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ backgroundColor: colorMuyGrave }}
            aria-hidden="true"
          />
          Muy grave (hasta 60 M€)
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ backgroundColor: colorGrave }}
            aria-hidden="true"
          />
          Grave (hasta 6 M€)
        </span>
      </div>

      <div className={styles.chart} role="img" aria-label="Expedientes sancionadores CNMC por entidad">
        {/* Scale ticks */}
        <div className={styles.scale} aria-hidden="true">
          {[0, 10, 20, 30].map((v) => (
            <span key={v} className={styles.tick} style={{ left: `${(v / MAX_EXPEDIENTES) * 100}%` }}>
              {v}
            </span>
          ))}
        </div>

        {ENTITIES.map((entity) => {
          const pct = (entity.expedientes / MAX_EXPEDIENTES) * 100;
          const isSelected = entity.id === selectedId;

          return (
            <button
              key={entity.id}
              type="button"
              className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
              onClick={() => toggle(entity.id)}
              aria-expanded={isSelected}
              aria-controls={`cnmc-detail-${entity.id}`}
              aria-label={`${entity.short}: ${entity.expedientes} expedientes, ${entity.tipificacion === 'muy_grave' ? 'muy grave' : 'grave'}`}
            >
              <span className={styles.entityName}>{entity.short}</span>
              <span className={styles.barTrack}>
                <span
                  className={styles.barFill}
                  style={{
                    width: `${Math.max(pct, 2.5)}%`,
                    backgroundColor: getColor(entity.tipificacion),
                  }}
                />
              </span>
              <span className={styles.barValue}>{entity.expedientes}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          id={`cnmc-detail-${selected.id}`}
          className={styles.detail}
          role="region"
          aria-label={`Detalle: ${selected.name}`}
        >
          <h4 className={styles.detailTitle}>{selected.name}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Expedientes</span>
            <span>{selected.expedientes}</span>
            <span className={styles.detailLabel}>Tipificación</span>
            <span>
              {selected.tipificacion === 'muy_grave'
                ? 'Muy grave (art. 64.25 LSE)'
                : 'Grave (art. 64 LSE)'}
            </span>
            <span className={styles.detailLabel}>Sanción máx.</span>
            <span>{selected.sancion_max} M€</span>
          </div>
          <p className={styles.detailEstado}>{selected.estado}</p>
        </div>
      )}
    </div>
  );
}
