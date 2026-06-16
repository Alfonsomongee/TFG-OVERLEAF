import React from 'react';
import styles from './ElectricityCostWaterfallFigure.module.css';

/*
  Descomposición del coste medio de electricidad en 2025.
  Datos: REE Informe Sistema Eléctrico 2025 / ESIOS / PwC.
  Precio final medio (may 2025–mar 2026): 77,07 €/MWh (REE).
*/

const MAX = 80; // €/MWh para escala de barras

const ROWS = [
  { label:'Precio mercado (OMIE)', value:30.2, unit:'€/MWh', color:'Teal', note:null },
  { label:'+ Peajes y cargos', value:24.5, unit:'€/MWh', color:'Teal', note:null },
  { label:'+ Servicios de ajuste', value:16.7, unit:'€/MWh', color:'Amber', note:'de los cuales OR: 4,7 % del precio final' },
  { label:'  └ Restricciones técnicas', value:14.2, unit:'€/MWh', color:'Burgundy', highlight:true, note:'+63 % vs 2024 (11,53 €/MWh)' },
];

const TOTAL = { label:'Precio final medio', value:77.1, unit:'€/MWh' };

export default function ElectricityCostWaterfallFigure() {
  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7b · Estructura de costes</span>
      <h3 className={styles.title}>De dónde sale la factura eléctrica en 2025</h3>
      <p className={styles.subtitle}>
        Descomposición del precio final medio de la electricidad (may 2025 – mar 2026). El componente de restricciones técnicas ya pesa tanto como los peajes de transporte y distribución.
      </p>

      <div className={styles.chart}>
        {ROWS.map((r, i) => (
          <React.Fragment key={i}>
            <div className={`${styles.row} ${r.highlight ? styles.rowHighlight : ''}`}>
              <span className={styles.rowLabel}>{r.label}</span>
              <div className={styles.rowTrack}>
                <div
                  className={`${styles.rowFill} ${styles[`rowFill${r.color}`]}`}
                  style={{ width: `${(r.value / MAX) * 100}%` }}
                />
              </div>
              <span className={styles.rowValue} style={{ color: `var(--fig-${r.color.toLowerCase()})` }}>
                {r.value.toFixed(1)} {r.unit}
              </span>
            </div>
            {r.note && <div className={styles.annotation}>{r.note}</div>}
          </React.Fragment>
        ))}

        <div className={styles.sep} />

        <div className={`${styles.row} ${styles.totalRow}`}>
          <span className={styles.rowLabel}>{TOTAL.label}</span>
          <div className={styles.rowTrack}>
            <div className={`${styles.rowFill} ${styles.rowFillTeal}`} style={{ width:'100%' }} />
          </div>
          <span className={styles.rowValue}>{TOTAL.value.toFixed(1)} {TOTAL.unit}</span>
        </div>
      </div>

      <p className={styles.source}>
        Fuente: REE nota oficial (abr 2026), ESIOS, PwC «El coste de la Operación Reforzada» (2026), REE Informe del Sistema Eléctrico 2025.
      </p>
    </figure>
  );
}
