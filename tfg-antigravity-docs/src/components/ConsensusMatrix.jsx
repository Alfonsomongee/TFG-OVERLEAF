import React, { useState } from 'react';
import styles from './ConsensusMatrix.module.css';

const CLAIMS = [
  { id:'c1', text:'Mecanismo dominante: sobretensión, no déficit de frecuencia', gobierno:'acuerdo', ree:'acuerdo', iit:'acuerdo', aelec:'acuerdo', entsoe:'acuerdo', consenso:'muy_alto', detalle:'Todos los informes coinciden en que la secuencia final fue de sobretensión y desconexión en cascada. El informe final ENTSO-E confirma: "even with significantly higher inertia values, the loss of system synchronism would not have been avoided".' },
  { id:'c2', text:'Evento multifactorial, no monocausal', gobierno:'acuerdo', ree:'acuerdo', iit:'acuerdo', aelec:'acuerdo', entsoe:'acuerdo', consenso:'muy_alto', detalle:'El informe final ENTSO-E identifica al menos 15 factores interactuantes. Gobierno, REE, IIT, AELEC coinciden.' },
  { id:'c3', text:'La frecuencia no fue el disparador raíz', gobierno:'acuerdo', ree:'acuerdo', iit:'acuerdo', aelec:'acuerdo', entsoe:'acuerdo', consenso:'alto', detalle:'La sobretensión habría causado desconexiones independientemente de la frecuencia.' },
  { id:'c4', text:'Inercia media peninsular ≈ 2,3 s', gobierno:'acuerdo', ree:'no_evaluado', iit:'acuerdo', aelec:'no_evaluado', entsoe:'no_evaluado', consenso:'medio_alto', detalle:'Gobierno e IIT confirman ~2,3 s; REE, AELEC y ENTSO-E no la destacan.' },
  { id:'c5', text:'Inercia zonal sur ≈ 1,3 s', gobierno:'no_evaluado', ree:'no_evaluado', iit:'acuerdo', aelec:'matiz', entsoe:'no_evaluado', consenso:'medio', detalle:'Solo IIT calcula 1,30 s; AELEC converge cualitativamente; resto no lo publica.' },
  { id:'c6', text:'Penetración instantánea 82 % renovable', gobierno:'acuerdo', ree:'no_evaluado', iit:'no_evaluado', aelec:'matiz', entsoe:'no_evaluado', consenso:'parcial', detalle:'Cifra oficial de generación renovable, no equivalente a 82 % IBR. ENTSO-E no la menciona como factor determinante.' },
  { id:'c7', text:'Insuficiente absorción de reactiva según P.O. 7.4', gobierno:'acuerdo', ree:'acuerdo', iit:'no_evaluado', aelec:'disputa', entsoe:'matiz', consenso:'medio_bajo', detalle:'Gobierno y REE señalan incumplimiento; AELEC discrepa; ENTSO-E habla de "gaps in voltage and reactive power control".' },
  { id:'c8', text:'Maniobras de mallado de REE agravaron el margen de tensión', gobierno:'matiz', ree:'disputa', iit:'acuerdo', aelec:'acuerdo', entsoe:'no_evaluado', consenso:'bajo', detalle:'IIT y AELEC afirman que redujeron el margen; REE defiende su necesidad; ENTSO-E señala "insufficient security margins".' },
  { id:'c9', text:'Tap-Lag / OLTC y sobretensión no observable desde transporte', gobierno:'matiz', ree:'matiz', iit:'no_evaluado', aelec:'matiz', entsoe:'no_evaluado', consenso:'medio', detalle:'Varios informes sugieren relación, sin confirmación robusta común.' },
  { id:'c10', text:'El perímetro de estabilidad de tensión fue zonal, no global', gobierno:'acuerdo', ree:'acuerdo', iit:'acuerdo', aelec:'acuerdo', entsoe:'acuerdo', consenso:'alto', detalle:'Todos coinciden en que la fragilidad estaba concentrada en el sur peninsular.' },
];

const REPORTS = [
  { key:'gobierno', label:'Gob.' },
  { key:'ree', label:'REE' },
  { key:'iit', label:'IIT' },
  { key:'aelec', label:'AELEC' },
  { key:'entsoe', label:'ENTSO-E' },
];

const SM = {
  acuerdo:     { sym:'✓', label:'Acuerdo',     color:'var(--st-acuerdo)' },
  matiz:       { sym:'~', label:'Matiz',        color:'var(--st-matiz)' },
  disputa:     { sym:'✗', label:'Disputa',      color:'var(--st-disputa)' },
  no_evaluado: { sym:'—', label:'No evaluado',  color:'var(--st-no)' },
};

const CL = {
  muy_alto:   { label:'Muy alto',    color:'var(--cons-muy-alto)' },
  alto:       { label:'Alto',        color:'var(--cons-alto)' },
  medio_alto: { label:'Medio-alto',  color:'var(--cons-medio-alto)' },
  medio:      { label:'Medio',       color:'var(--cons-medio)' },
  parcial:    { label:'Parcial',     color:'var(--cons-parcial)' },
  medio_bajo: { label:'Medio-bajo',  color:'var(--cons-medio-bajo)' },
  bajo:       { label:'Bajo',        color:'var(--cons-bajo)' },
};

export default function ConsensusMatrix() {
  const [sel, setSel] = useState(null);
  const toggle = (cId, rKey) => setSel(p => p?.cId === cId && p?.rKey === rKey ? null : { cId, rKey });

  const selC = sel ? CLAIMS.find(c => c.id === sel.cId) : null;
  const selR = sel ? REPORTS.find(r => r.key === sel.rKey) : null;

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Síntesis forense</span>
        <h3 className={styles.title}>Matriz de consenso entre informes</h3>
        <p className={styles.subtitle}>
          Grado de acuerdo entre los principales informes periciales sobre diez
          afirmaciones clave. La columna final indica el consenso técnico global. Pulsa cada celda para ampliar.
        </p>
      </header>
      <div className={styles.legend}>
        {Object.entries(SM).map(([k, m]) => (
          <span key={k} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: m.color }} />{m.label}
          </span>
        ))}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.matrix} role="grid">
          <thead>
            <tr>
              <th className={styles.thClaim}>Afirmación</th>
              {REPORTS.map(r => <th key={r.key} className={styles.thReport}>{r.label}</th>)}
              <th className={styles.thConsenso}>Cons.</th>
            </tr>
          </thead>
          <tbody>
            {CLAIMS.map((c, ri) => (
              <tr key={c.id} className={ri % 2 === 0 ? styles.rowEven : ''}>
                <td className={styles.tdClaim}>{c.text}</td>
                {REPORTS.map(r => {
                  const s = c[r.key];
                  const m = SM[s] || SM.no_evaluado;
                  const isAct = sel?.cId === c.id && sel?.rKey === r.key;
                  return (
                    <td key={r.key} className={styles.tdCell}>
                      <button type="button"
                        className={`${styles.cell} ${isAct ? styles.cellActive : ''}`}
                        style={{ backgroundColor: m.color }}
                        onClick={() => toggle(c.id, r.key)}
                        title={`${r.label}: ${m.label}`}
                        aria-label={`${c.text}: ${r.label} — ${m.label}`}>
                        {m.sym}
                      </button>
                    </td>
                  );
                })}
                <td className={styles.tdConsenso}>
                  <span className={styles.consensoBadge} style={{ backgroundColor: CL[c.consenso]?.color }}>
                    {CL[c.consenso]?.label || c.consenso}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selC && selR && (
        <div className={styles.detail} role="region">
          <h4 className={styles.detailTitle}>{selR.label} — {selC.id.toUpperCase()}</h4>
          <p><strong>Afirmación:</strong> {selC.text}</p>
          <p><strong>Postura:</strong> {SM[selC[selR.key]]?.label}</p>
          {selC.detalle && <p className={styles.detailNote}>{selC.detalle}</p>}
        </div>
      )}
    </div>
  );
}
