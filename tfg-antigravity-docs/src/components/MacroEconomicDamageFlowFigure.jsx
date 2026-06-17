import React from 'react';
import styles from './MacroEconomicDamageFlowFigure.module.css';

const CORE_METRICS = [
  {
    value: '~150 GWh',
    label: 'Energia no suministrada',
    detail: 'Estimacion academica del deficit fisico del evento',
    tone: 'physical',
  },
  {
    value: '1.600 M€',
    label: 'Coste agregado CEOE',
    detail: 'Perdidas empresariales directas e indirectas',
    tone: 'economic',
  },
  {
    value: '1.300 M€',
    label: 'Impacto ATA',
    detail: 'Autonomos, comercio y hosteleria de proximidad',
    tone: 'economicAlt',
  },
  {
    value: '4.000-45.000 €/MWh',
    label: 'Rango VoLL europeo',
    detail: 'Valor economico de la energia no suministrada',
    tone: 'voll',
  },
];

const ECONOMIC_ESTIMATES = [
  {
    actor: 'CEOE',
    value: 1600,
    scope: 'Tejido empresarial nacional',
    description: 'Lucro cesante, disrupcion operativa y danos directos agregados.',
  },
  {
    actor: 'ATA',
    value: 1300,
    scope: 'Autonomos, pymes y comercio minorista',
    description: 'Perdida de ventas, cadena de frio y TPV inoperativos.',
  },
];

const DIGITAL_IMPACTS = [
  {
    label: 'Espana · trafico internet',
    value: 80,
    detail: 'Reduccion maxima aproximada en las horas posteriores',
  },
  {
    label: 'Portugal · trafico internet',
    value: 90,
    detail: 'Caida hasta el 10 % del baseline historico',
  },
  {
    label: 'Espana · velocidad movil',
    value: 73,
    detail: 'Caida de la velocidad mediana de descarga',
  },
];

function formatMoney(value) {
  return `${value.toLocaleString('es-ES')} M€`;
}

function MetricCard({ metric }) {
  return (
    <article className={`${styles.metricCard} ${styles[`metric_${metric.tone}`]}`}>
      <strong>{metric.value}</strong>
      <span>{metric.label}</span>
      <small>{metric.detail}</small>
    </article>
  );
}

function EconomicBar({ item, max }) {
  const width = `${Math.max(8, (item.value / max) * 100)}%`;

  return (
    <article className={styles.economicRow}>
      <div className={styles.economicTopline}>
        <div>
          <strong>{item.actor}</strong>
          <span>{item.scope}</span>
        </div>
        <b>{formatMoney(item.value)}</b>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.economicFill} style={{ width }} />
      </div>
      <p>{item.description}</p>
    </article>
  );
}

function DigitalImpactBar({ item }) {
  return (
    <article className={styles.digitalRow}>
      <div className={styles.digitalTopline}>
        <strong>{item.label}</strong>
        <b>-{item.value}%</b>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.digitalFill} style={{ width: `${item.value}%` }} />
      </div>
      <p>{item.detail}</p>
    </article>
  );
}

export default function MacroEconomicDamageFlowFigure() {
  const maxEconomicValue = Math.max(...ECONOMIC_ESTIMATES.map((item) => item.value));

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Impacto macroeconomico</p>
          <h3>Del cero de tension a la factura economica</h3>
        </div>
        <p className={styles.lead}>
          El apagon convirtio una perturbacion fisica de red en una perdida economica
          agregada: energia no suministrada, paralizacion productiva, colapso digital
          y destruccion de actividad en empresas, autonomos y servicios.
        </p>
      </header>

      <section className={styles.metricGrid} aria-label="Indicadores principales">
        {CORE_METRICS.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className={styles.flowPanel} aria-labelledby="macro-flow-title">
        <div className={styles.panelHeader}>
          <h4 id="macro-flow-title">Cadena causal del dano</h4>
          <p>
            La figura separa el origen fisico del apagon, la metrica regulatoria
            de dano y las estimaciones economicas finales.
          </p>
        </div>

        <div className={styles.svgWrap}>
          <svg
            className={styles.flowSvg}
            viewBox="0 0 1120 360"
            role="img"
            aria-labelledby="macro-flow-svg-title macro-flow-svg-desc"
          >
            <title id="macro-flow-svg-title">
              Diagrama causal del coste macroeconomico del apagon
            </title>
            <desc id="macro-flow-svg-desc">
              Cero de tension, energia no suministrada, valoracion mediante VoLL,
              estimaciones economicas y colapso de conectividad.
            </desc>

            <defs>
              <marker
                id="mdfArrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" className={styles.arrowHead} />
              </marker>
              <linearGradient id="mdfMainGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--mdf-physical)" />
                <stop offset="48%" stopColor="var(--mdf-voll)" />
                <stop offset="100%" stopColor="var(--mdf-economic)" />
              </linearGradient>
              <linearGradient id="mdfDigitalGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--mdf-physical)" />
                <stop offset="100%" stopColor="var(--mdf-digital)" />
              </linearGradient>
            </defs>

            <path className={styles.mainFlow} d="M 178 124 C 258 124, 272 124, 352 124" markerEnd="url(#mdfArrow)" />
            <path className={styles.mainFlow} d="M 502 124 C 578 124, 594 124, 668 124" markerEnd="url(#mdfArrow)" />
            <path className={styles.mainFlow} d="M 818 124 C 870 124, 884 124, 932 124" markerEnd="url(#mdfArrow)" />
            <path className={styles.digitalFlow} d="M 442 165 C 500 240, 650 275, 786 274" markerEnd="url(#mdfArrow)" />

            <g className={styles.node}>
              <rect x="28" y="70" width="150" height="108" rx="18" />
              <text x="103" y="101" textAnchor="middle" className={styles.nodeKicker}>ORIGEN FISICO</text>
              <text x="103" y="130" textAnchor="middle" className={styles.nodeTitle}>Cero de tension</text>
              <text x="103" y="154" textAnchor="middle" className={styles.nodeSub}>12:33 CEST</text>
            </g>

            <g className={styles.node}>
              <rect x="352" y="70" width="150" height="108" rx="18" />
              <text x="427" y="101" textAnchor="middle" className={styles.nodeKicker}>DANO FISICO</text>
              <text x="427" y="130" textAnchor="middle" className={styles.nodeTitle}>~150 GWh</text>
              <text x="427" y="154" textAnchor="middle" className={styles.nodeSub}>energia no suministrada</text>
            </g>

            <g className={styles.node}>
              <rect x="668" y="70" width="150" height="108" rx="18" />
              <text x="743" y="101" textAnchor="middle" className={styles.nodeKicker}>VALORACION</text>
              <text x="743" y="130" textAnchor="middle" className={styles.nodeTitle}>VoLL</text>
              <text x="743" y="154" textAnchor="middle" className={styles.nodeSub}>4.000-45.000 €/MWh</text>
            </g>

            <g className={styles.node}>
              <rect x="932" y="70" width="190" height="108" rx="18" />
              <text x="1027" y="101" textAnchor="middle" className={styles.nodeKicker}>FACTURA</text>
              <text x="1027" y="130" textAnchor="middle" className={styles.nodeTitle}>1.300-1.600 M€</text>
              <text x="1027" y="154" textAnchor="middle" className={styles.nodeSub}>estimaciones no aditivas</text>
            </g>

            <g className={styles.digitalNode}>
              <rect x="786" y="224" width="296" height="102" rx="18" />
              <text x="934" y="256" textAnchor="middle" className={styles.nodeKicker}>AMPLIFICADOR DIGITAL</text>
              <text x="934" y="285" textAnchor="middle" className={styles.nodeTitle}>Internet -80 % / -90 %</text>
              <text x="934" y="308" textAnchor="middle" className={styles.nodeSub}>Espana / Portugal · caida de conectividad</text>
            </g>

            <text x="560" y="222" textAnchor="middle" className={styles.branchLabel}>
              el cero electrico se transmite a telecomunicaciones, pagos y comercio
            </text>
          </svg>
        </div>
      </section>

      <section className={styles.lowerGrid}>
        <article className={styles.analysisPanel}>
          <div className={styles.panelHeaderCompact}>
            <h4>Estimaciones economicas</h4>
            <span>No aditivas</span>
          </div>
          <div className={styles.rowStack}>
            {ECONOMIC_ESTIMATES.map((item) => (
              <EconomicBar key={item.actor} item={item} max={maxEconomicValue} />
            ))}
          </div>
          <p className={styles.methodNote}>
            Las cifras CEOE y ATA representan perimetros economicos distintos. La
            figura las muestra como dos lecturas de impacto, no como componentes
            acumulables.
          </p>
        </article>

        <article className={styles.analysisPanel}>
          <div className={styles.panelHeaderCompact}>
            <h4>Colapso digital</h4>
            <span>Infraestructura dependiente</span>
          </div>
          <div className={styles.rowStack}>
            {DIGITAL_IMPACTS.map((item) => (
              <DigitalImpactBar key={item.label} item={item} />
            ))}
          </div>
          <p className={styles.methodNote}>
            La caida de conectividad convierte el apagon electrico en paralisis
            comercial: TPV, cajeros, coordinacion logistica y canales de emergencia
            quedan degradados simultaneamente.
          </p>
        </article>
      </section>

      <section className={styles.readingBox}>
        <h4>Lectura pericial</h4>
        <p>
          El valor economico del apagon no se obtiene multiplicando mecanicamente
          MWh por precio de mercado. La metrica relevante es el VoLL: el coste que
          sociedad, industria y servicios asignan a no disponer de electricidad
          cuando la actividad productiva, la conectividad y la cadena de pagos
          dependen de continuidad electrica estricta.
        </p>
      </section>

      <figcaption className={styles.caption}>
        Figura 35. Del cero de tension a la factura macroeconomica. La figura
        representa la cadena causal que transforma el colapso electrico en energia
        no suministrada, perdida de conectividad y dano economico agregado. Las
        estimaciones CEOE y ATA se muestran como perimetros de impacto distintos,
        no como magnitudes aditivas. Elaboracion propia a partir de Funcas, CEOE,
        ATA, Cloudflare Radar, Ookla y referencias ACER/CEER sobre VoLL.
      </figcaption>
    </figure>
  );
}
