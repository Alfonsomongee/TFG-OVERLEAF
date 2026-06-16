import React, { useState, useCallback } from 'react';
import styles from './CausalFlowFigure.module.css';

const NODES = [
  { id:'blackout', label:'Cero de tensión', sub:'12:33 CEST · 28 abr 2025', metric:'15.000 MW', metricLabel:'pérdida instantánea', detail:'Desconexión en cascada de 15.000 MW en menos de 5 s. Sistema ibérico aislado del continente a las 12:33:29 CEST.' },
  { id:'ens', label:'Energía no suministrada', sub:'~150–180 GWh · 18 h', metric:'~150 GWh', metricLabel:'estimación académica (Funcas)', detail:'Integral de la curva de demanda no cubierta desde las 12:33 hasta la restitución al 99,95 % (07:05 del 29-A). Límite inferior: recuperación parcial nocturna; superior: destrucción neta por parada fría.' },
  { id:'voll', label:'Coste de la ausencia', sub:'VoLL · metodología ACER/CEER', metric:'5–250 €/kWh', metricLabel:'rango sectorial europeo', detail:'VoLL por sector: residencial 5–45 €/kWh, servicios 15–90 €/kWh, industria 50–250 €/kWh. El rango refleja la heterogeneidad del tejido productivo afectado.' },
  { id:'bill', label:'Factura macroeconómica', sub:'estimaciones patronales', metric:'1.600 M€', metricLabel:'CEOE · 0,1 % del PIB', detail:'CEOE: 1.600 M€ (tejido corporativo). ATA: 1.300 M€ (autónomos, hostelería, comercio). Perímetros distintos, no acumulables. Estimaciones independientes sitúan la horquilla entre 1.600 y 4.800 M€.' },
];

const AMP = {
  label: 'Amplificador: colapso digital simultáneo',
  items: [
    { geo:'España · internet', val:'−80 %', note:'tráfico' },
    { geo:'Portugal · internet', val:'−90 %', note:'tráfico' },
    { geo:'España · red móvil', val:'−73 %', note:'velocidad mediana' },
  ],
  detail: 'La caída de conectividad convirtió el apagón en parálisis comercial: TPV, cajeros, logística y canales de emergencia degradados simultáneamente. El colapso digital amplificó el VoLL al impedir mecanismos de contingencia. Fuente: Cloudflare Radar / Ookla.',
};

export default function CausalFlowFigure() {
  const [active, setActive] = useState(null);
  const [ampOpen, setAmpOpen] = useState(false);
  const toggle = useCallback((id) => { setAmpOpen(false); setActive(a => a === id ? null : id); }, []);

  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7b · Consecuencias financieras</span>
      <h3 className={styles.title}>Del cero de tensión a la factura macroeconómica</h3>
      <p className={styles.subtitle}>
        Cadena causal: colapso eléctrico → energía no suministrada → valoración VoLL → daño económico agregado. Pulsa cada nodo para ampliar.
      </p>

      <div className={styles.flow}>
        {NODES.map((n, i) => (
          <React.Fragment key={n.id}>
            <button
              className={`${styles.node} ${active === n.id ? styles.nodeActive : ''}`}
              onClick={() => toggle(n.id)}
              aria-expanded={active === n.id}
              type="button"
            >
              <span className={styles.nodeLabel}>{n.label}</span>
              <span className={styles.nodeSub}>{n.sub}</span>
              <span className={styles.nodeMetric}>{n.metric}</span>
              <span className={styles.nodeMetricLabel}>{n.metricLabel}</span>
            </button>
            {i < NODES.length - 1 && (
              <div className={styles.arrow} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        className={`${styles.amplifier} ${ampOpen ? styles.ampActive : ''}`}
        onClick={() => { setActive(null); setAmpOpen(o => !o); }}
        aria-expanded={ampOpen}
        type="button"
      >
        <span className={styles.ampTitle}>{AMP.label}</span>
        <div className={styles.ampItems}>
          {AMP.items.map(it => (
            <div key={it.geo} className={styles.ampItem}>
              <span className={styles.ampGeo}>{it.geo}</span>
              <span className={styles.ampVal}>{it.val}</span>
              <span className={styles.ampNote}>{it.note}</span>
            </div>
          ))}
        </div>
      </button>

      {(active || ampOpen) && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p>{active ? NODES.find(n => n.id === active)?.detail : AMP.detail}</p>
        </div>
      )}

      <div className={styles.methodNote}>
        ⚠ Las estimaciones CEOE y ATA representan perímetros económicos distintos y no son magnitudes acumulables. El VoLL no equivale al precio de mercado de la energía.
      </div>
    </figure>
  );
}
