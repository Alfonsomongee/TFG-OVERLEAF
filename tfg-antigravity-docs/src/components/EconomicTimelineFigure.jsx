import React from 'react';
import styles from './EconomicTimelineFigure.module.css';

const EVENTS = [
  { date:'28 abr 12:33', event:'Cero de tensión — 15.000 MW perdidos en 5 s', amount:'−15 GW', color:'Burgundy', highlight:true },
  { date:'28 abr tarde', event:'Parálisis comercial + colapso digital (internet −80 %)', amount:'', color:'Burgundy', highlight:true },
  { date:'29 abr', event:'OMIE cierra a 5,79 €/MWh — señal contradictoria del mercado', amount:'5,79 €/MWh', color:'Teal' },
  { date:'30 abr', event:'CEOE cifra daño macroeconómico (0,1 % PIB)', amount:'1.600 M€', color:'Burgundy', highlight:true },
  { date:'May 2025', event:'REE instaura Operación Reforzada — 25-30 CCGT permanentes', amount:'', color:'Amber', amber:true },
  { date:'Jun 2025', event:'CNMC publica resolución P.O. 7.4 revisado (BOE-A-2025-13076)', amount:'', color:'Teal' },
  { date:'Oct 2025', event:'OR acumulada (may–oct)', amount:'422 M€', color:'Amber', amber:true },
  { date:'Dic 2025', event:'OR acumulada (may–dic); restricciones 2025 totales', amount:'516 M€ / 3.812 M€', color:'Amber', amber:true },
  { date:'Feb 2026', event:'PwC cifra sobrecoste anual atribuible a OR', amount:'~1.100 M€/año', color:'Burgundy', highlight:true },
  { date:'Mar 2026', event:'OR acumulada (may 2025–mar 2026)', amount:'666 M€', color:'Amber', amber:true },
  { date:'Abr 2026', event:'CNMC: al menos 58 expedientes sancionadores incoados', amount:'', color:'Burgundy', highlight:true },
  { date:'Abr 2026', event:'Repsol formaliza demanda por lucro cesante', amount:'125 M€', color:'Burgundy', highlight:true },
  { date:'May 2026', event:'BESS España: de 28 MW a ~221 MW (+689 %)', amount:'+193 MW', color:'Teal' },
];

export default function EconomicTimelineFigure() {
  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7b · Cronología económica</span>
      <h3 className={styles.title}>Del apagón a la factura: un año de costes</h3>
      <p className={styles.subtitle}>
        Secuencia temporal del impacto económico desde el cero de tensión hasta el aniversario del 28-A. Fuentes primarias: REE, CEOE, PwC, CNMC.
      </p>

      <div className={styles.timeline}>
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`${styles.entry} ${ev.highlight ? styles.entryHighlight : ''} ${ev.amber ? styles.entryAmber : ''}`}
          >
            <span className={styles.date}>{ev.date}</span>
            <span className={styles.event}>{ev.event}</span>
            {ev.amount && (
              <span className={`${styles.amount} ${styles[`amount${ev.color}`]}`}>{ev.amount}</span>
            )}
          </div>
        ))}
      </div>

      <p className={styles.source}>
        Fuentes: REE (notas oficiales OR), CEOE, ATA, PwC/NERA (informe sobrecoste), CNMC (expedientes), Fundación Renovables (BESS).
      </p>
    </figure>
  );
}
