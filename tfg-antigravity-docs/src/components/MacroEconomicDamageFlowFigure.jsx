import React, { useState } from 'react';
import styles from './MacroEconomicDamageFlowFigure.module.css';

const NODES = [
  {
    id: 'origen',
    label: 'Cero de tensión',
    sub: '12:33 CEST · 28 abr 2025',
    metric: '15.000 MW',
    metricLabel: 'pérdida instantánea',
    detail: 'Desconexión en cascada de 15.000 MW en menos de 5 segundos. Sistema ibérico aislado del continente a las 12:33:29 CEST.',
  },
  {
    id: 'ens',
    label: 'Energía no suministrada',
    sub: '~150–180 GWh · 18 h de interrupción',
    metric: '~150 GWh',
    metricLabel: 'estimación académica',
    detail: 'Integral de la curva de demanda no cubierta desde las 12:33 del 28-A hasta la restitución al 99,95 % a las 07:05 del 29-A. Fuente: Funcas / análisis académico.',
  },
  {
    id: 'voll',
    label: 'Valor de la energía\nno suministrada',
    sub: 'VoLL · metodología ACER/CEER',
    metric: '4.000–45.000 €/MWh',
    metricLabel: 'rango europeo según sector',
    detail: 'El VoLL varía por sector: residencial 5–45 €/kWh, servicios 15–90 €/kWh, industria manufacturera 50–250 €/kWh. El rango amplio refleja la heterogeneidad del tejido productivo afectado.',
  },
  {
    id: 'factura',
    label: 'Factura económica',
    sub: 'estimaciones patronales · no aditivas',
    metric: '1.300–1.600 M€',
    metricLabel: 'CEOE + ATA (perímetros distintos)',
    detail: 'CEOE cifra el daño empresarial agregado en 1.600 M€ (tejido corporativo nacional). ATA estima 1.300 M€ en autónomos, hostelería y comercio. Son perímetros distintos, no magnitudes acumulables.',
  },
];

const AMPLIFIER = {
  label: 'Colapso digital',
  items: [
    { geo: 'España · internet', value: '−80 %', note: 'caída máxima de tráfico' },
    { geo: 'Portugal · internet', value: '−90 %', note: 'caída hasta el 10 % del baseline' },
    { geo: 'España · red móvil', value: '−73 %', note: 'velocidad mediana de descarga' },
  ],
  detail: 'La caída de conectividad convirtió el apagón en parálisis comercial: TPV, cajeros, coordinación logística y canales de emergencia quedados degradados simultáneamente. Fuente: Cloudflare Radar / Ookla.',
};

export default function MacroEconomicDamageFlowFigure() {
  const [activeNode, setActiveNode] = useState(null);
  const [ampActive, setAmpActive] = useState(false);

  return (
    <figure className={styles.figure}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker}>Capítulo 7b · Consecuencias financieras</span>
        <h3 className={styles.title}>Del cero de tensión a la factura macroeconómica</h3>
        <p className={styles.subtitle}>
          Cadena causal que transforma el colapso eléctrico en energía no suministrada,
          pérdida de conectividad y daño económico agregado.
        </p>
      </div>

      {/* Flow */}
      <div className={styles.flowWrapper}>
        {/* Main chain */}
        <div className={styles.chain}>
          {NODES.map((node, i) => (
            <React.Fragment key={node.id}>
              <button
                className={`${styles.node} ${activeNode === node.id ? styles.nodeActive : ''}`}
                onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                aria-expanded={activeNode === node.id}
              >
                <span className={styles.nodeIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.nodeLabel}>{node.label}</span>
                <span className={styles.nodeSub}>{node.sub}</span>
                <span className={styles.nodeMetric}>{node.metric}</span>
                <span className={styles.nodeMetricLabel}>{node.metricLabel}</span>
              </button>

              {i < NODES.length - 1 && (
                <div className={styles.arrow} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Amplifier block */}
        <div className={styles.amplifierRow}>
          <div className={styles.amplifierConnector} aria-hidden="true">
            <span className={styles.amplifierConnectorLine} />
            <span className={styles.amplifierConnectorLabel}>amplificador</span>
          </div>
          <button
            className={`${styles.amplifier} ${ampActive ? styles.amplifierActive : ''}`}
            onClick={() => setAmpActive(!ampActive)}
            aria-expanded={ampActive}
          >
            <span className={styles.amplifierTitle}>{AMPLIFIER.label}</span>
            <div className={styles.amplifierItems}>
              {AMPLIFIER.items.map((item) => (
                <div key={item.geo} className={styles.amplifierItem}>
                  <span className={styles.amplifierGeo}>{item.geo}</span>
                  <span className={styles.amplifierValue}>{item.value}</span>
                  <span className={styles.amplifierNote}>{item.note}</span>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Detail panel */}
      {(activeNode || ampActive) && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p className={styles.detailText}>
            {activeNode
              ? NODES.find(n => n.id === activeNode)?.detail
              : AMPLIFIER.detail}
          </p>
        </div>
      )}

      {/* Methodological note */}
      <div className={styles.methodNote}>
        <span className={styles.methodNoteIcon} aria-hidden="true">⚠</span>
        Las estimaciones CEOE y ATA representan perímetros económicos distintos y no son magnitudes acumulables.
        El VoLL no equivale al precio de mercado de la energía.
      </div>

    </figure>
  );
}
