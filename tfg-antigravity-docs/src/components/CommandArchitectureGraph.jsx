import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './CommandArchitectureGraph.module.css';

function getNodes() {
  return [
    { 
      id: 'ree', 
      label: 'REE', 
      country: translate({id: 'cmdarch.spain', message: 'España'}), 
      role: translate({id: 'cmdarch.ree.role', message: 'Líder de Frecuencia del Bloque Ibérico Aislado'}), 
      shortLabel: translate({id: 'cmdarch.ree.short', message: 'Líder frecuencia ibérico'}), 
      mandate: translate({id: 'cmdarch.ree.mandate', message: 'Dirección única de la regulación de frecuencia-potencia y del plan de restauración en la isla peninsular. Coordinación directa con REN.'}), 
      basis: translate({id: 'cmdarch.ree.basis', message: 'Planes de Restauración Nacionales bajo régimen de operación en isla (NC ER).'}), 
      evidence: translate({id: 'cmdarch.evidence.explicit', message: 'Explícita en Factual Report.'}), 
      x: 150, y: 210, color: 'var(--crisis)', r: 24 
    },
    { 
      id: 'ren', 
      label: 'REN', 
      country: translate({id: 'cmdarch.portugal', message: 'Portugal'}), 
      role: translate({id: 'cmdarch.ren.role', message: 'Operador de red de Portugal'}), 
      shortLabel: translate({id: 'cmdarch.ren.short', message: 'Operador PT'}), 
      mandate: translate({id: 'cmdarch.ren.mandate', message: 'Coordinación local de restauración y balance en Portugal bajo la dirección del líder de frecuencia ibérico (REE).'}), 
      basis: translate({id: 'cmdarch.ren.basis', message: 'Planes de restauración nacional y acuerdos bilaterales REE-REN.'}), 
      evidence: translate({id: 'cmdarch.evidence.implicit', message: 'Implícita en reportes operativos.'}), 
      x: 150, y: 350, color: 'var(--crisis)', r: 18 
    },
    { 
      id: 'rte', 
      label: 'RTE', 
      country: translate({id: 'cmdarch.france', message: 'Francia'}), 
      role: translate({id: 'cmdarch.rte.role', message: 'Líder de Resincronización Continental'}), 
      shortLabel: translate({id: 'cmdarch.rte.short', message: 'Líder resincronización'}), 
      mandate: translate({id: 'cmdarch.rte.mandate', message: 'Autoridad exclusiva para autorizar, programar y coordinar el acoplamiento síncrono entre el bloque ibérico y el continental.'}), 
      basis: translate({id: 'cmdarch.rte.basis', message: 'Red de Emergencia y Restauración de ENTSO-E (NC ER — Reglamento UE 2017/2196).'}), 
      evidence: translate({id: 'cmdarch.evidence.explicit', message: 'Explícita en Factual Report.'}), 
      x: 380, y: 280, color: 'var(--resynch)', r: 24 
    },
    { 
      id: 'swissgrid', 
      label: 'Swissgrid', 
      country: translate({id: 'cmdarch.switzerland', message: 'Suiza'}), 
      role: translate({id: 'cmdarch.swissgrid.role', message: 'SAM (CC South) · Líder de Frecuencia Continental'}), 
      shortLabel: translate({id: 'cmdarch.swissgrid.short', message: 'SAM South · líder continental'}), 
      mandate: translate({id: 'cmdarch.swissgrid.mandate', message: 'Monitorización global de frecuencia de Europa Continental remanente. Coordinación de las desviaciones de potencia del sur síncrono.'}), 
      basis: translate({id: 'cmdarch.swissgrid.basis', message: 'Arts. 141 y 143 del Reglamento SO GL.'}), 
      evidence: translate({id: 'cmdarch.evidence.explicit', message: 'Explícita en Factual Report.'}), 
      x: 610, y: 160, color: 'var(--continental)', r: 24 
    },
    { 
      id: 'amprion', 
      label: 'Amprion', 
      country: translate({id: 'cmdarch.germany', message: 'Alemania'}), 
      role: translate({id: 'cmdarch.amprion.role', message: 'SAM (CC North) · Coordinador de Alertas EAS'}), 
      shortLabel: translate({id: 'cmdarch.amprion.short', message: 'SAM North · alertas EAS'}), 
      mandate: translate({id: 'cmdarch.amprion.mandate', message: 'Monitorización del bloque norte continental. Emisión de alertas de System Split y coordinación de seguridad interzonal.'}), 
      basis: translate({id: 'cmdarch.amprion.basis', message: 'Procedimientos de Separación de Sistemas del bloque síncrono (RG CE).'}), 
      evidence: translate({id: 'cmdarch.evidence.explicit', message: 'Explícita en Factual Report.'}), 
      x: 610, y: 400, color: 'var(--continental)', r: 24 
    },
  ];
}

const EDGES = [
  { s:'ree', t:'ren', color:'var(--crisis)', dash:'' },
  { s:'ree', t:'rte', color:'var(--crisis)', dash:'6 3' },
  { s:'swissgrid', t:'rte', color:'var(--continental)', dash:'5 3', anim:true },
  { s:'amprion', t:'rte', color:'var(--continental)', dash:'5 3', anim:true },
  { s:'swissgrid', t:'amprion', color:'var(--fig-border)', dash:'', w:1.5 },
];

export default function CommandArchitectureGraph() {
  const [selId, setSelId] = useState(null);
  const toggle = (id) => setSelId(p => p === id ? null : id);
  const NODES = getNodes();
  const sel = NODES.find(n => n.id === selId);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}><Translate id="cmdarch.kicker">Arquitectura de mando</Translate></span>
        <h3 className={styles.title}><Translate id="cmdarch.title">Roles operativos durante el System Split ibérico</Translate></h3>
        <p className={styles.subtitle}>
          <Translate id="cmdarch.subtitle">Asignación de líderes de frecuencia, monitorización y resincronización bajo las SO GL de ENTSO-E. Pulsa cada nodo para ampliar.</Translate>
        </p>
      </header>
      <div className={styles.chartWrap}>
        <svg viewBox="0 0 760 500" className={styles.svg} role="img" aria-label={translate({id: 'cmdarch.aria', message: 'Grafo de arquitectura de mando continental'})}>
          <title>{translate({id: 'cmdarch.svgTitle', message: 'Roles operativos asignados durante el System Split del 28-A'})}</title>
          <text x="150" y="120" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--fig-muted)">{translate({id: 'cmdarch.island', message: 'Isla Ibérica'})}</text>
          <text x="610" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--fig-muted)">{translate({id: 'cmdarch.continental', message: 'Bloque Continental'})}</text>
          <text x="380" y="245" textAnchor="middle" fontSize="8.5" fill="var(--fig-muted)" fontStyle="italic">{translate({id: 'cmdarch.resynchLine', message: 'Frontera de resincronización'})}</text>

          {EDGES.map(e => {
            const s = NODES.find(n => n.id === e.s);
            const t = NODES.find(n => n.id === e.t);
            return (
              <line key={`${e.s}-${e.t}`}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={e.color} strokeWidth={e.w || 2}
                strokeDasharray={e.dash || 'none'}
                className={e.anim ? styles.animLine : ''}
                opacity="0.65" />
            );
          })}

          {NODES.map(n => {
            const isSel = n.id === selId;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.r} fill={n.color}
                  stroke={isSel ? 'var(--fig-text)' : 'var(--fig-bg)'} strokeWidth={isSel ? 2.5 : 1.5}
                  className={styles.node}
                  onClick={() => toggle(n.id)} tabIndex={0} role="button"
                  aria-label={`${n.label} — ${n.role}`}
                  onKeyDown={e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(n.id); }}} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.r < 20 ? 9 : 11}
                  fontWeight="700" fill="#fff" style={{pointerEvents:'none'}}>{n.label}</text>
                <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" fontSize="7.5"
                  fill="var(--fig-muted)" style={{pointerEvents:'none'}}>{n.shortLabel}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {sel && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${sel.label}`}>
          <h4 className={styles.detailTitle}>{sel.label} — {sel.country}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}><Translate id="cmdarch.detail.role">Rol asignado</Translate></span><span>{sel.role}</span>
            <span className={styles.detailLabel}><Translate id="cmdarch.detail.mandate">Mandato</Translate></span><span>{sel.mandate}</span>
            <span className={styles.detailLabel}><Translate id="cmdarch.detail.basis">Base normativa</Translate></span><span>{sel.basis}</span>
            <span className={styles.detailLabel}><Translate id="cmdarch.detail.evidence">Evidencia</Translate></span><span>{sel.evidence}</span>
          </div>
        </div>
      )}
    </div>
  );
}
