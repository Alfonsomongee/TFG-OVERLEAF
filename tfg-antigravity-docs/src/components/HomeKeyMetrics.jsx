/**
 * HomeKeyMetrics.jsx
 * src/components/HomeKeyMetrics.jsx
 *
 * Bloque de 4 KPIs del incidente — posición 2 de la homepage,
 * entre HomeHero y HomeThesisPanel.
 *
 * Datos consolidados en todas las fuentes primarias:
 * ENTSO-E Factual Report (2025), Comité de Análisis del Gobierno (2025), REE.
 *
 * Sin contadores animados llamativos. Números grandes, contexto corto,
 * fuente discreta. Estética de ficha técnica, no de dashboard.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeKeyMetrics.module.css';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Magnitud del incidente',
    metrics: [
      {
        id: 'time',
        value: '12:33',
        unit: 'CEST',
        label: 'Inicio del colapso operativo',
        detail: '28 de abril de 2025',
        source: 'ENTSO-E / Comité del Gobierno',
      },
      {
        id: 'power',
        value: '≈15.000',
        unit: 'MW',
        label: 'Generación desconectada en cascada',
        detail: 'Aprox. 60 % de la generación activa en ese instante',
        source: 'ENTSO-E Factual Report (2025)',
      },
      {
        id: 'ufls',
        value: '>10.600',
        unit: 'MW',
        label: 'Deslastre automático de carga (UFLS)',
        detail: 'Esquemas de defensa por subfrecuencia',
        source: 'Comité de Análisis del Gobierno (2025)',
      },
      {
        id: 'restoration',
        value: '≈16',
        unit: 'h',
        label: 'Reposición del suministro',
        detail: 'Hasta recuperación prácticamente completa',
        source: 'REE / REN / ENTSO-E',
      },
    ],
  },
  en: {
    eyebrow: 'Incident magnitude',
    metrics: [
      {
        id: 'time',
        value: '12:33',
        unit: 'CEST',
        label: 'Start of operational collapse',
        detail: 'April 28, 2025',
        source: 'ENTSO-E / Government Committee',
      },
      {
        id: 'power',
        value: '≈15,000',
        unit: 'MW',
        label: 'Generation disconnected in cascade',
        detail: 'Approx. 60% of active generation at that moment',
        source: 'ENTSO-E Factual Report (2025)',
      },
      {
        id: 'ufls',
        value: '>10,600',
        unit: 'MW',
        label: 'Automatic load shedding (UFLS)',
        detail: 'Under-frequency defense schemes',
        source: 'Government Analysis Committee (2025)',
      },
      {
        id: 'restoration',
        value: '≈16',
        unit: 'h',
        label: 'Supply restoration',
        detail: 'Until near-complete recovery',
        source: 'REE / REN / ENTSO-E',
      },
    ],
  },
  de: {
    eyebrow: 'Ausmaß des Vorfalls',
    metrics: [
      {
        id: 'time',
        value: '12:33',
        unit: 'CEST',
        label: 'Beginn des Betriebszusammenbruchs',
        detail: '28. April 2025',
        source: 'ENTSO-E / Regierungsausschuss',
      },
      {
        id: 'power',
        value: '≈15.000',
        unit: 'MW',
        label: 'In Kaskade abgeschaltete Erzeugung',
        detail: 'Ca. 60 % der aktiven Erzeugung in diesem Moment',
        source: 'ENTSO-E Factual Report (2025)',
      },
      {
        id: 'ufls',
        value: '>10.600',
        unit: 'MW',
        label: 'Automatischer Lastabwurf (UFLS)',
        detail: 'Unterfrequenz-Schutzschemas',
        source: 'Regierungsanalysausschuss (2025)',
      },
      {
        id: 'restoration',
        value: '≈16',
        unit: 'h',
        label: 'Wiederherstellung der Versorgung',
        detail: 'Bis zur nahezu vollständigen Erholung',
        source: 'REE / REN / ENTSO-E',
      },
    ],
  },
  'zh-Hans': {
    eyebrow: '事故规模',
    metrics: [
      {
        id: 'time',
        value: '12:33',
        unit: 'CEST',
        label: '电网运行崩溃开始时刻',
        detail: '2025年4月28日',
        source: 'ENTSO-E / 政府分析委员会',
      },
      {
        id: 'power',
        value: '≈15,000',
        unit: 'MW',
        label: '级联断路损失的发电容量',
        detail: '约占事故时刻在网发电量的60%',
        source: 'ENTSO-E事实报告（2025）',
      },
      {
        id: 'ufls',
        value: '>10,600',
        unit: 'MW',
        label: '低频减载自动切除负荷（UFLS）',
        detail: '欠频防御保护方案动作',
        source: '政府分析委员会（2025）',
      },
      {
        id: 'restoration',
        value: '≈16',
        unit: 'h',
        label: '电力恢复供应耗时',
        detail: '直至供电基本完全恢复',
        source: 'REE / REN / ENTSO-E',
      },
    ],
  },
};

export default function HomeKeyMetrics() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <section className={styles.section} aria-label={t.eyebrow}>
      <div className={styles.inner}>

        <p className={styles.eyebrow}>{t.eyebrow}</p>

        <div className={styles.grid}>
          {t.metrics.map((m) => (
            <div key={m.id} className={`${styles.card} ${styles[`card--${m.id}`]}`}>
              {/* Número principal */}
              <div className={styles.valueRow}>
                <span className={styles.value}>{m.value}</span>
                <span className={styles.unit}>{m.unit}</span>
              </div>

              {/* Etiqueta */}
              <p className={styles.label}>{m.label}</p>

              {/* Detalle contextual */}
              <p className={styles.detail}>{m.detail}</p>

              {/* Fuente */}
              <p className={styles.source}>{m.source}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
