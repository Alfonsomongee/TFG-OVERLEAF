// %% AGENT_INSTRUCTION: Insertar donde corresponda el grafo de arquitectura de mando continental durante el System Split ibérico del 28-A.
// %% LEGEND_PROPOSAL: "Roles operativos asignados durante el System Split ibérico bajo las SO GL de ENTSO-E. Rojo: isla ibérica (líder de frecuencia). Azul: frontera de resincronización. Ámbar: bloque continental (SAM)."

import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './CommandArchitectureGraph.module.css';

const NODES = [
  { id: 'ree', label: 'REE', country: 'España', role: 'Líder de Frecuencia del Bloque Ibérico Aislado', shortLabel: 'Líder frecuencia ibérico', mandate: 'Dirección única de la regulación de frecuencia-potencia y del plan de restauración (control local) en la isla peninsular. Coordinación directa con REN.', basis: 'Planes de Restauración Nacionales bajo régimen de operación en isla síncrona del NC ER.', evidence: 'Explícita en Factual Report', x: 150, y: 210, color: 'crisis' },
  { id: 'ren', label: 'REN', country: 'Portugal', role: 'Operador de red de Portugal', shortLabel: 'Operador PT', mandate: 'Coordinación local de restauración y balance en Portugal bajo la dirección del líder de frecuencia ibérico (REE).', basis: 'Planes de restauración nacional y acuerdos bilaterales REE-REN.', evidence: 'Implícita en reportes operativos', x: 150, y: 350, color: 'crisis', minor: true },
  { id: 'rte', label: 'RTE', country: 'Francia', role: 'Líder de Resincronización Continental', shortLabel: 'Líder resincronización', mandate: 'Autoridad exclusiva para autorizar, programar y coordinar el acoplamiento síncrono físico entre el bloque ibérico aislado y el bloque continental remanente.', basis: 'Red de Emergencia y Restauración de ENTSO-E (NC ER - Reglamento UE 2017/2196).', evidence: 'Explícita en Factual Report', x: 380, y: 280, color: 'resynch' },
  { id: 'swissgrid', label: 'Swissgrid', country: 'Suiza', role: 'SAM (CC South) y Líder de Frecuencia Continental', shortLabel: 'SAM South · líder continental', mandate: 'Monitorización global de frecuencia de Europa Continental remanente. Coordinación de las desviaciones de potencia de balance del sur síncrono.', basis: 'Artículos 141 y 143 del reglamento System Operation Guidelines (SO GL).', evidence: 'Explícita en Factual Report', x: 610, y: 160, color: 'continental' },
  { id: 'amprion', label: 'Amprion', country: 'Alemania', role: 'SAM (CC North) y Coordinador de Alertas EAS', shortLabel: 'SAM North · alertas EAS', mandate: 'Monitorización del bloque norte continental. Emisión de alertas oficiales de system split y coordinación de seguridad de flujos comerciales interzonales.', basis: 'Procedimientos de Separación de Sistemas del bloque síncrono de Europa Continental (RG CE).', evidence: 'Explícita en Factual Report', x: 610, y: 400, color: 'continental' },
];

const EDGES = [
  { source: 'ree', target: 'ren', type: 'hierarchy' },
  { source: 'ree', target: 'rte', type: 'split', dashed: true },
  { source: 'swissgrid', target: 'rte', type: 'coordination', animated: true },
  { source: 'amprion', target: 'rte', type: 'coordination', animated: true },
  { source: 'swissgrid', target: 'amprion', type: 'light' },
];

function GraphInner() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((p) => (p === id ? null : id));
  const sel = NODES.find((n) => n.id === selectedId);

  const palette = {
    crisis: isDark ? '#d45a54' : '#a83832',
    resynch: isDark ? '#5a90c8' : '#2a5080',
    continental: isDark ? '#c49a4a' : '#9a6b2f',
  };

  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const surfaceFill = isDark ? '#13263f' : '#fffdf7';

  const edgeColor = (type) => {
    if (type === 'split') return palette.crisis;
    if (type === 'coordination') return palette.continental;
    if (type === 'light') return isDark ? '#2a3a4a' : '#ccc';
    return isDark ? '#4a5a6a' : '#aab4be';
  };

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Arquitectura de mando</span>
        <h3 className={styles.title}>Roles operativos durante el System Split ibérico</h3>
        <p className={styles.subtitle}>
          Asignación de líderes de frecuencia, monitorización y
          resincronización bajo las SO GL de ENTSO-E.
        </p>
      </header>

      <div className={styles.chartWrap}>
        <svg viewBox="0 0 760 500" className={styles.svg} role="img" aria-label="Grafo de arquitectura de mando continental">
          <title>Roles operativos asignados durante el System Split del 28-A</title>

          {/* Region labels */}
          <text x="150" y="120" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>Isla Ibérica</text>
          <text x="610" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>Bloque Continental</text>
          <text x="380" y="245" textAnchor="middle" fontSize="8.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} fontStyle="italic">Frontera de resincronización</text>

          {/* Edges */}
          {EDGES.map((e) => {
            const s = NODES.find((n) => n.id === e.source);
            const t = NODES.find((n) => n.id === e.target);
            if (!s || !t) return null;
            return (
              <line key={`${e.source}-${e.target}`}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={edgeColor(e.type)}
                strokeWidth={e.type === 'light' ? 1.5 : 2}
                strokeDasharray={e.dashed ? '6 3' : e.animated ? '5 3' : 'none'}
                className={e.animated ? styles.animLine : ''}
                opacity={0.75} />
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => {
            const isSel = n.id === selectedId;
            const r = n.minor ? 18 : 24;
            const fill = palette[n.color] || palette.resynch;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={r} fill={fill}
                  stroke={isSel ? textColor : surfaceFill} strokeWidth={isSel ? 2.5 : 1.5}
                  className={styles.node}
                  onClick={() => toggle(n.id)} tabIndex={0} role="button"
                  aria-label={`${n.label} — ${n.role}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(n.id); } }} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.minor ? 9 : 11} fontWeight="700" fontFamily="Inter,system-ui,sans-serif" fill="#fff" style={{ pointerEvents: 'none' }}>{n.label}</text>
                <text x={n.x} y={n.y + r + 14} textAnchor="middle" fontSize="7.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} style={{ pointerEvents: 'none' }}>{n.shortLabel}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {sel && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${sel.label}`}>
          <h4 className={styles.detailTitle}>{sel.label} — {sel.country}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Rol asignado</span><span>{sel.role}</span>
            <span className={styles.detailLabel}>Mandato</span><span>{sel.mandate}</span>
            <span className={styles.detailLabel}>Base normativa</span><span>{sel.basis}</span>
            <span className={styles.detailLabel}>Evidencia</span><span>{sel.evidence}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommandArchitectureGraph() {
  return (
    <BrowserOnly fallback={<div style={{ textAlign: 'center', padding: '2rem', opacity: 0.6 }}>Cargando grafo…</div>}>
      {() => <GraphInner />}
    </BrowserOnly>
  );
}
