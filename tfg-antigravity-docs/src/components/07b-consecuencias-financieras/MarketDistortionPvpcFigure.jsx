import React, { useState } from 'react';
import styles from './MarketDistortionPvpcFigure.module.css';

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const MARKET_ROWS = [
  {
    id: 'omie-28',
    label: 'OMIE · 28 abril',
    value: 18.50,
    max: 120,
    unit: '€/MWh',
    color: 'main',
    detail: 'Precio medio del mercado diario la mañana del apagón. Muy deprimido por sobreoferta renovable con coste marginal tendente a cero.',
  },
  {
    id: 'omie-29',
    label: 'OMIE · 29 abril',
    value: 5.79,
    max: 120,
    unit: '€/MWh',
    color: 'main',
    detail: 'El día después del colapso el precio mayorista cayó aún más. Señal equivocada: la red estaba al límite pero el mercado reflejaba abundancia.',
  },
  {
    id: 'pvpc',
    label: 'PVPC · media estimada',
    value: 114.50,
    max: 120,
    unit: '€/MWh',
    color: 'amber',
    detail: 'Tarifa regulada media del 28-A. Incluye peajes, cargos del sistema y la liquidación de servicios de ajuste. No comparable directamente con el precio OMIE.',
  },
];

const SYSTEM_ROWS = [
  {
    id: 'rest-base',
    label: 'Restricciones · dic 2024',
    value: 11.30,
    max: 16,
    unit: '€/MWh',
    color: 'main',
    detail: 'Coste unitario promedio de las restricciones técnicas antes del apagón. Componente históricamente marginal en la liquidación del sistema.',
  },
  {
    id: 'rest-post',
    label: 'Restricciones · dic 2025',
    value: 14.20,
    max: 16,
    unit: '€/MWh',
    color: 'red',
    detail: 'Coste unitario tras instaurar la Operación Reforzada. El despacho permanente de 25–30 ciclos combinados para proveer inercia dispara el componente de restricciones.',
  },
];

const IMPACT_ITEMS = [
  { label: 'Variación componente restricciones PVPC', value: '+125 %', color: 'red', detail: 'Incremento del componente de restricciones en la tarifa PVPC entre mayo y noviembre de 2025. Fuente: auditorías PwC / ConsumES.' },
  { label: 'Recargo medio por hogar', value: '+36 €/año', color: 'amber', detail: 'Equivale a un recargo del 16 % sobre el valor estricto de la energía consumida anualmente.' },
  { label: 'Sobrecoste sistémico anual', value: '>1.000 M€', color: 'red', detail: 'Sobrecoste macroeconómico respecto al ejercicio 2024, según auditorías de PwC y NERA.' },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Bar({ row, activeId, onToggle }) {
  const pct = Math.min((row.value / row.max) * 100, 100);
  const isActive = activeId === row.id;

  return (
    <button
      className={`${styles.barRow} ${isActive ? styles.barRowActive : ''}`}
      onClick={() => onToggle(row.id)}
      aria-expanded={isActive}
    >
      <div className={styles.barLabel}>{row.label}</div>
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${styles[`barFill_${row.color}`]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`${styles.barValue} ${styles[`barValue_${row.color}`]}`}>
        {row.value.toLocaleString('es-ES', { minimumFractionDigits: 2 })} {row.unit}
      </div>
    </button>
  );
}

function ImpactBadge({ item, activeId, onToggle }) {
  const isActive = activeId === item.label;
  return (
    <button
      className={`${styles.badge} ${styles[`badge_${item.color}`]} ${isActive ? styles.badgeActive : ''}`}
      onClick={() => onToggle(item.label)}
      aria-expanded={isActive}
    >
      <span className={styles.badgeValue}>{item.value}</span>
      <span className={styles.badgeLabel}>{item.label}</span>
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

export default function MarketDistortionPvpcFigure() {
  const [activeId, setActiveId] = useState(null);
  const toggle = (id) => setActiveId(prev => prev === id ? null : id);

  const allItems = [...MARKET_ROWS, ...SYSTEM_ROWS, ...IMPACT_ITEMS];
  const activeDetail =
    allItems.find(i => (i.id ?? i.label) === activeId)?.detail ?? null;

  return (
    <figure className={styles.figure}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker}>Capítulo 7b · Mercado eléctrico</span>
        <h3 className={styles.title}>Precio barato, sistema caro</h3>
        <p className={styles.subtitle}>
          El mercado diario reflejó energía barata; la red necesitó estabilidad física.
          Las restricciones técnicas trasladaron el coste a los consumidores PVPC.
        </p>
      </div>

      {/* Two-column grid */}
      <div className={styles.grid}>
        {/* Left: market signal */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>Señal de mercado</span>
            <span className={styles.panelNote}>precio OMIE · €/MWh</span>
          </div>
          <div className={styles.panelBars}>
            {MARKET_ROWS.map(row => (
              <Bar key={row.id} row={row} activeId={activeId} onToggle={toggle} />
            ))}
          </div>
          <div className={styles.panelFootnote}>
            ⚠ OMIE y PVPC no son magnitudes equivalentes — el PVPC incluye peajes,
            cargos y liquidación de servicios de ajuste.
          </div>
        </div>

        {/* Right: system cost */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>Coste del sistema</span>
            <span className={styles.panelNote}>restricciones técnicas · €/MWh</span>
          </div>
          <div className={styles.panelBars}>
            {SYSTEM_ROWS.map(row => (
              <Bar key={row.id} row={row} activeId={activeId} onToggle={toggle} />
            ))}
          </div>
          <div className={styles.panelFootnote}>
            Fuente: REE / auditoría PwC. Coste promedio mensual
            de resolución de restricciones técnicas.
          </div>
        </div>
      </div>

      {/* Impact row */}
      <div className={styles.impactRow}>
        <span className={styles.impactLabel}>Impacto en el consumidor PVPC</span>
        <div className={styles.badges}>
          {IMPACT_ITEMS.map(item => (
            <ImpactBadge key={item.label} item={item} activeId={activeId} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {activeDetail && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p className={styles.detailText}>{activeDetail}</p>
        </div>
      )}

      <figcaption className={styles.caption}>
        Figura 36. Distorsión OMIE/PVPC: el precio del mercado diario cayó hasta 5,79 €/MWh
        el día posterior al apagón, mientras el coste de las restricciones técnicas crecía un 125 %
        para los consumidores PVPC. Elaboración propia a partir de OMIE, ESIOS/REE, PwC/ConsumES y NERA.
      </figcaption>
    </figure>
  );
}
