// %% AGENT_INSTRUCTION: Insertar en "Actualización 2026: Un Año Después" → "1. El Paradigma del 'Overvoltage-Driven Blackout'", después de "...fue el detonante de la cascada." y antes de "Según la reconstrucción forense, las plantas conectadas mediante inversores Grid-Following...".
// %% LEGEND_PROPOSAL: "Secuencia de eventos que condujeron al colapso por sobretensión del 28‑A. Azul: oscilación. Ámbar: sobretensión. Rojo: disparo en cascada. Gris oscuro: colapso total."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './OvervoltageTimeline.module.css';

const EVENTS = [
  {
    id: 'ov1',
    time: '10:30',
    title: 'Oscilación interárea natural (0,2 Hz)',
    impact: 'Fluctuaciones de tensión ≤ 4 kV. Sin deslastre.',
    cause: 'Propia de la interconexión síncrona continental.',
    category: 'oscillation',
    mwLost: 0,
  },
  {
    id: 'ov2',
    time: '11:04 – 11:09',
    title: 'Disparo de transformadores ADIF (Terrer y Rueda de Jalón, 400/55 kV)',
    impact: 'Afección a la tracción ferroviaria por elevación de tensión local > 30 kV.',
    cause: 'Sobretensión mantenida por encima de umbrales de protección secundaria.',
    category: 'voltage',
    mwLost: null,
  },
  {
    id: 'ov3',
    time: '12:03 – 12:07',
    title: 'Surgimiento de oscilación anómala de 0,6 Hz',
    impact: 'Variaciones de tensión de hasta 30 kV. Factor de amortiguamiento colapsa del 20 % al 5 %.',
    cause: 'Interacción de lazos de control de inversores con resonancias de red débil.',
    category: 'oscillation',
    mwLost: null,
  },
  {
    id: 'ov4',
    time: '12:16 – 12:19',
    title: 'Reducción de exportaciones hacia Francia y mallado de líneas',
    impact: 'Descarga de líneas de 400 kV. Inicio del efecto Ferranti distribuido.',
    cause: 'Maniobra del OS para mitigar oscilaciones. Reducción de flujo activo.',
    category: 'voltage',
    mwLost: null,
  },
  {
    id: 'ov5',
    time: '12:32:57 – 12:33:18',
    title: 'Disparo masivo de inversores solares en el sur',
    impact: 'Pérdida de ~2.000 MW en rampa inicial. Subestaciones Huéneja, Badajoz, Sevilla, Segovia.',
    cause: 'Superación de umbrales de tensión (TED/749/2020). Desconexión por autoprotección de hardware.',
    category: 'trip',
    mwLost: 2000,
  },
  {
    id: 'ov6',
    time: '12:33:18 – 12:33:30',
    title: 'Colapso total peninsular',
    impact: '~13.000 MW adicionales perdidos. Apagón completo.',
    cause: 'Desplome de frecuencia por carencia inasumible de potencia activa. Apertura de enlaces transfronterizos.',
    category: 'collapse',
    mwLost: 13000,
  },
];

const CATEGORY_META = {
  oscillation: { label: 'Oscilación', light: '#345a7e', dark: '#5a90c8' },
  voltage: { label: 'Sobretensión', light: '#9a6b2f', dark: '#c49a4a' },
  trip: { label: 'Disparo en cascada', light: '#a83832', dark: '#d45a54' },
  collapse: { label: 'Colapso', light: '#3a4a5a', dark: '#8a99ab' },
};

export default function OvervoltageTimeline() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const getColor = (cat) => {
    const c = CATEGORY_META[cat] || CATEGORY_META.oscillation;
    return isDark ? c.dark : c.light;
  };

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Cascada de tensión</span>
        <h3 className={styles.title}>
          Cronología del overvoltage‑driven blackout
        </h3>
        <p className={styles.subtitle}>
          Secuencia de eventos que llevó al colapso peninsular. Oscilación,
          sobretensión y disparo en cascada se sucedieron en menos de tres horas.
        </p>
      </header>

      <div className={styles.legend}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <span key={key} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: isDark ? meta.dark : meta.light }}
              aria-hidden="true"
            />
            {meta.label}
          </span>
        ))}
      </div>

      <ol className={styles.timeline} role="list">
        {EVENTS.map((evt, i) => {
          const isExpanded = expandedId === evt.id;
          const color = getColor(evt.category);
          const isLast = i === EVENTS.length - 1;

          return (
            <li key={evt.id} className={styles.event}>
              <div className={styles.rail}>
                <button
                  type="button"
                  className={`${styles.marker} ${isExpanded ? styles.markerActive : ''}`}
                  style={{
                    backgroundColor: color,
                    borderColor: color,
                  }}
                  aria-expanded={isExpanded}
                  aria-controls={`ov-detail-${evt.id}`}
                  aria-label={`${evt.time}: ${evt.title}`}
                  onClick={() => toggle(evt.id)}
                />
                {!isLast && <span className={styles.stem} aria-hidden="true" />}
              </div>

              <div className={styles.body}>
                <button
                  type="button"
                  className={styles.summaryBtn}
                  aria-expanded={isExpanded}
                  aria-controls={`ov-detail-${evt.id}`}
                  onClick={() => toggle(evt.id)}
                >
                  <time className={styles.time}>{evt.time}</time>
                  <span className={styles.eventTitle}>{evt.title}</span>
                </button>

                {isExpanded && (
                  <div
                    id={`ov-detail-${evt.id}`}
                    className={styles.details}
                    role="region"
                    aria-label={`Detalle: ${evt.title}`}
                  >
                    <p>
                      <strong>Impacto:</strong> {evt.impact}
                    </p>
                    <p>
                      <strong>Causa:</strong> {evt.cause}
                    </p>
                    {evt.mwLost !== null && evt.mwLost > 0 && (
                      <p>
                        <strong>MW perdidos:</strong>{' '}
                        {evt.mwLost.toLocaleString()} MW
                      </p>
                    )}
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
