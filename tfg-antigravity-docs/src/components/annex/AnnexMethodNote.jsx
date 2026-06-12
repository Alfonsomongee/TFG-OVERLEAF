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

import { useDocLang } from '@site/src/hooks/useDocLang';

const LABELS = {
  'dato-historico': {
    es: 'Dato histórico',
    en: 'Historical data',
    de: 'Historischer Wert',
    'zh-Hans': '历史数据',
  },
  'dato-vivo': {
    es: 'Dato vivo',
    en: 'Live data',
    de: 'Live-Daten',
    'zh-Hans': '实时数据',
  },
  estimacion: {
    es: 'Estimación',
    en: 'Estimation',
    de: 'Schätzung',
    'zh-Hans': '估算数据',
  },
  reconstruccion: {
    es: 'Análisis forense',
    en: 'Forensic analysis',
    de: 'Forensische Analyse',
    'zh-Hans': '法医分析',
  },
  'modelo-didactico': {
    es: 'Modelo didáctico',
    en: 'Didactic model',
    de: 'Didaktisches Modell',
    'zh-Hans': '教学模型',
  },
  'ilustracion-conceptual': {
    es: 'Ilustración conceptual',
    en: 'Conceptual illustration',
    de: 'Begriffliche Veranschaulichung',
    'zh-Hans': '概念说明图',
  },
  'cuestion-abierta': {
    es: 'Cuestión abierta',
    en: 'Open question',
    de: 'Offene Frage',
    'zh-Hans': '开放性问题',
  },
};

const typeClassName = {
  'dato-historico': 'historico',
  'dato-vivo': 'vivo',
  estimacion: 'estimacion',
  reconstruccion: 'reconstruccion',
  'modelo-didactico': 'modeloDidactico',
  'ilustracion-conceptual': 'ilustracionConceptual',
  'cuestion-abierta': 'cuestionAbierta',
};

export default function AnnexMethodNote({ type = 'dato-historico', children }) {
  const lang = useDocLang();
  const className = typeClassName[type] || 'historico';
  const localizedLabels = LABELS[type] || LABELS['dato-historico'];
  const label = localizedLabels[lang] || localizedLabels.es;

  const badgeClass = `${styles.methodNote} ${styles[className]}`;

  return (
    <span className={badgeClass} title={label}>
      {label}
      {children && (
        <>
          {': '}
          {children}
        </>
      )}
    </span>
  );
}
