/**
 * AnnexMethodNote.jsx
 *
 * Data type / methodology badge for annex content
 * Clearly labels the provenance/nature of data:
 *   - dato-historico: Fixed historical snapshot (28-A)
 *   - dato-vivo: Live operational data (ESIOS)
 *   - estimacion: Computed estimate
 *   - reconstruccion: Forensic reconstruction
 *   - modelo-didactico: Educational simulation
 *   - ilustracion-conceptual: Conceptual illustration
 *   - cuestion-abierta: Open-ended research question
 *
 * Props:
 *   type      (string) — one of the above
 *   children  (React node) — content to wrap/associate with badge
 *
 * Example:
 *   <AnnexMethodNote type="dato-historico">
 *     Datos del 28-A a las 12:30 CEST
 *   </AnnexMethodNote>
 */

import React from 'react';
import styles from './Annex.module.css';

const typeConfig = {
  'dato-historico': {
    label: 'Dato histórico',
    className: 'historico',
  },
  'dato-vivo': {
    label: 'Dato vivo',
    className: 'vivo',
  },
  estimacion: {
    label: 'Estimación',
    className: 'estimacion',
  },
  reconstruccion: {
    label: 'Análisis forense',
    className: 'reconstruccion',
  },
  'modelo-didactico': {
    label: 'Modelo didáctico',
    className: 'modeloDidactico',
  },
  'ilustracion-conceptual': {
    label: 'Ilustración conceptual',
    className: 'ilustracionConceptual',
  },
  'cuestion-abierta': {
    label: 'Cuestión abierta',
    className: 'cuestionAbierta',
  },
};

export default function AnnexMethodNote({ type = 'dato-historico', children }) {
  const config = typeConfig[type] || typeConfig['dato-historico'];
  const badgeClass = `${styles.methodNote} ${styles[config.className]}`;

  return (
    <span className={badgeClass} title={config.label}>
      {config.label}
      {children && (
        <>
          {': '}
          {children}
        </>
      )}
    </span>
  );
}
