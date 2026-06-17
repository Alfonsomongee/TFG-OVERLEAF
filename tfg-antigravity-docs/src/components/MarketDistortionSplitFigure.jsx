import React, { useState, useCallback } from 'react';
import styles from './MarketDistortionSplitFigure.module.css';

const MARKET = [
  { id:'omie28', label:'OMIE · 28 abr', value:18.50, max:120, unit:'€/MWh', color:'Teal', detail:'Precio medio del mercado diario la mañana del apagón. Deprimido por sobreoferta renovable con coste marginal tendente a cero.' },
  { id:'omie29', label:'OMIE · 29 abr', value:5.79, max:120, unit:'€/MWh', color:'Teal', detail:'Tras el colapso, el mayorista cayó aún más. Señal contradictoria: red al límite pero el mercado reflejaba abundancia.' },
  { id:'pvpc',   label:'PVPC · media 28-A', value:114.50, max:120, unit:'€/MWh', color:'Amber', detail:'Tarifa regulada media del 28-A. Incluye peajes, cargos del sistema y liquidación de servicios de ajuste. No directamente comparable con OMIE.' },
];

const SYSTEM = [
  { id:'rest24', label:'Restricciones · 2024', value:11.53, max:20, unit:'€/MWh', color:'Teal', detail:'Coste unitario medio de restricciones técnicas en 2024. Componente históricamente marginal en la liquidación.' },
  { id:'rest25', label:'Restricciones · 2025', value:16.74, max:20, unit:'€/MWh', color:'Burgundy', detail:'Coste unitario medio tras la Operación Reforzada (ene–nov 2025). El despacho permanente de 25–30 ciclos combinados dispara el componente. Fuente: REE / ESIOS.' },
  { id:'rest25t', label:'Total ajuste · 2025', value:3812, max:4000, unit:'M€/año', color:'Burgundy', detail:'Coste total de servicios de ajuste en 2025: 3.812 M€, un 43 % más que 2024. Restricciones técnicas +63 %. Fuente: REE Informe del Sistema Eléctrico 2025.' },
];

const GAP = [
  { val:'+63 %', label:'Incremento restricciones técnicas 2025 vs 2024', color:'var(--fig-burgundy)' },
  { val:'~1.100 M€', label:'Sobrecoste anual atribuible a la OR (PwC/NERA)', color:'var(--fig-burgundy)' },
  { val:'+125 %', label:'Componente restricciones PVPC (PwC)', color:'var(--fig-amber)' },
  { val:'~33 €/año', label:'Recargo por hogar medio (PwC)', color:'var(--fig-amber)' },
];

function Bar({ row, isActive, onToggle }) {
  const pct = Math.min((row.value / row.max) * 100, 100);
  const colorClass = styles[`barFill${row.color}`];
  return (
    <div className={styles.barRow} onClick={() => onToggle(row.id)} role="button" tabIndex={0}>
      <span className={styles.barLabel}>{row.label}</span>
      <div className={styles.barTrack}>
        <div className={colorClass} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.barValue} style={{ color: `var(--fig-${row.color.toLowerCase()})` }}>
        {typeof row.value === 'number' && row.value >= 1000 ? row.value.toLocaleString('es-ES') : row.value} {row.unit}
      </span>
    </div>
  );
}

export default function MarketDistortionSplitFigure() {
  const [activeId, setActiveId] = useState(null);
  const toggle = useCallback((id) => setActiveId(a => a === id ? null : id), []);
  const allItems = [...MARKET, ...SYSTEM];
  const activeDetail = allItems.find(i => i.id === activeId)?.detail ?? null;

  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7b · Mercado eléctrico</span>
      <h3 className={styles.title}>Precio barato, sistema caro</h3>
      <p className={styles.subtitle}>
        El mercado diario reflejó energía barata; la red necesitó estabilidad física. Las restricciones técnicas trasladaron el sobrecoste a los consumidores PVPC. Pulsa cada barra para ampliar.
      </p>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <span className={`${styles.panelTag} ${styles.panelTagMarket}`}>Señal de mercado</span>
          <span className={styles.panelNote}>precio OMIE y PVPC · €/MWh</span>
          {MARKET.map(r => <Bar key={r.id} row={r} isActive={activeId === r.id} onToggle={toggle} />)}
        </div>
        <div className={styles.panel}>
          <span className={`${styles.panelTag} ${styles.panelTagSystem}`}>Coste del sistema</span>
          <span className={styles.panelNote}>restricciones técnicas y servicios de ajuste</span>
          {SYSTEM.map(r => <Bar key={r.id} row={r} isActive={activeId === r.id} onToggle={toggle} />)}
        </div>
      </div>

      {activeDetail && (
        <div className={styles.detail} role="region" aria-live="polite"><p>{activeDetail}</p></div>
      )}

      <div className={styles.gapBlock}>
        <span className={styles.gapTitle}>Impacto en el consumidor PVPC</span>
        <div className={styles.gapItems}>
          {GAP.map(g => (
            <div key={g.label} className={styles.gapItem}>
              <span className={styles.gapItemVal} style={{ color: g.color }}>{g.val}</span>
              <span className={styles.gapItemLabel}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.footnote}>
        ⚠ OMIE y PVPC no son magnitudes equivalentes. El PVPC incluye peajes, cargos y liquidación de servicios de ajuste. Fuente: OMIE, ESIOS/REE, PwC, NERA.
      </p>
    </figure>
  );
}
