// %% AGENT_INSTRUCTION: Insertar en el capítulo donde se analiza el fallo del EAS (ENTSO-E Awareness System), mostrando la discrepancia entre estado físico de la red y las notificaciones oficiales.
// %% LEGEND_PROPOSAL: "Comparación entre la evolución física de la red ibérica (línea azul, eje izquierdo) y las declaraciones del ENTSO-E Awareness System (escalonado, eje derecho). El salto directo de Normal a Blackout evidencia la omisión de los estados intermedios de Alerta y Emergencia."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './EASStateTransition.module.css';

const EAS_EVENTS = [
  { time: '12:32', tso: 'REE', physical: 95, easState: 'Normal', label: 'Estable. Inicio de oscilaciones locales subsíncronas controladas.', evidence: 'Tensiones de 400 kV por debajo de los límites admisibles de 420 kV.' },
  { time: '12:33:21', tso: 'REE', physical: 30, easState: 'Normal', label: 'Disparo físico de interconexiones por pérdida de sincronismo.' },
  { time: '12:40', tso: 'REE', physical: 0, easState: 'Blackout', label: 'Transición abrupta. Omisión absoluta de los estados de Alerta y Emergencia.', evidence: 'Colapso. Desconexión de 2.500 MW de generación e interconexiones Pirenaicas.' },
  { time: '12:40', tso: 'REN', physical: 0, easState: 'Blackout', label: 'Caída instantánea del bloque síncrono portugués.' },
  { time: '12:49', tso: 'Swissgrid', physical: 0, easState: 'Emergency', label: 'Activación del protocolo de control de frecuencia en modo dividido.', evidence: 'Operando en modo síncrono dividido respecto a Iberia.' },
  { time: '12:49', tso: 'Amprion', physical: 0, easState: 'Emergency', label: 'Coordinación de seguridad del bloque síncrono continental.' },
  { time: '12:50', tso: 'RTE', physical: 0, easState: 'Emergency', label: 'Desconexión física de interconexiones y aislamiento seguro del sistema francés.', evidence: 'Fluctuaciones de tensión transitorias mitigadas en subestaciones limítrofes.' },
  { time: '14:35', tso: 'RTE', physical: 30, easState: 'Alert', label: 'Normalización de tensiones en el sur de Francia.' },
  { time: '17:05', tso: 'REN', physical: 50, easState: 'Restoration', label: 'Inicio del plan de restauración física del sistema portugués.', evidence: 'Construcción de islas de levantamiento locales con unidades black-start.' },
  { time: '22:50', tso: 'RTE', physical: 70, easState: 'Restoration', label: 'Reporte de operatividad del LFC de REE. Rampa de intercambio de 0 a 1.400 MW.' },
  { time: '00:11', tso: 'RTE', physical: 90, easState: 'Normal', label: 'Cierre de lazo y estabilización del AGC de REE.', evidence: 'El sistema español recupera el control automático y la compensación de desvíos.' },
];

const STATE_VALUES = { Normal: 4, Alert: 3, Emergency: 2, Blackout: 1, Restoration: 2.5 };
const STATE_LABELS_ES = { Normal: 'Normal', Alert: 'Alerta', Emergency: 'Emergencia', Blackout: 'Blackout', Restoration: 'Restauración' };

export default function EASStateTransition() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedIndex, setSelectedIndex] = useState(null);

  const stateColors = {
    Normal: isDark ? '#6aad52' : '#4a7c3a',
    Alert: isDark ? '#c49a4a' : '#9a6b2f',
    Emergency: isDark ? '#d45a54' : '#a83832',
    Blackout: isDark ? '#8a99ab' : '#3a4a5a',
    Restoration: isDark ? '#5a90c8' : '#2a5080',
  };

  const physLine = isDark ? '#5a90c8' : '#2a5080';
  const textColor = isDark ? '#e5edf5' : '#1f2933';
  const mutedColor = isDark ? '#a9b6c7' : '#64707d';
  const axisColor = isDark ? '#3a5570' : '#9aa5af';
  const gridColor = isDark ? 'rgba(180,198,220,0.08)' : 'rgba(31,41,51,0.06)';

  const w = 760, h = 340;
  const m = { top: 30, right: 90, bottom: 40, left: 50 };
  const cw = w - m.left - m.right, ch = h - m.top - m.bottom;

  const xScale = (i) => m.left + (i / (EAS_EVENTS.length - 1)) * cw;
  const yPhys = (val) => m.top + (1 - val / 100) * (ch * 0.45);
  const yState = (state) => {
    const v = STATE_VALUES[state] || 2;
    return m.top + ch * 0.55 + ((4 - v) / 3) * (ch * 0.4);
  };

  const physPath = EAS_EVENTS.map((e, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yPhys(e.physical)}`).join(' ');

  const toggle = (i) => setSelectedIndex((p) => (p === i ? null : i));

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Monitorización paneuropea</span>
        <h3 className={styles.title}>Fallo del EAS: del estado Normal al Blackout</h3>
        <p className={styles.subtitle}>
          Evolución física de la red ibérica frente a las declaraciones del
          ENTSO-E Awareness System. El salto Normal → Blackout omite Alerta y Emergencia.
        </p>
      </header>

      <div className={styles.legend}>
        {['Normal', 'Alert', 'Emergency', 'Blackout', 'Restoration'].map((s) => (
          <span key={s} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: stateColors[s] }} aria-hidden="true" />
            {STATE_LABELS_ES[s]}
          </span>
        ))}
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label="Estabilidad física vs notificaciones EAS">
          <title>Discrepancia entre estado físico y declaraciones EAS durante el 28-A</title>

          {/* Axes */}
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />
          <line x1={m.left + cw} y1={m.top} x2={m.left + cw} y2={m.top + ch} stroke={axisColor} strokeWidth="1" />

          {/* Y-axis left: physical */}
          {[100, 75, 50, 25, 0].map((val) => (
            <g key={`yp-${val}`}>
              <line x1={m.left} y1={yPhys(val)} x2={m.left + cw} y2={yPhys(val)} stroke={gridColor} strokeWidth="1" />
              <text x={m.left - 8} y={yPhys(val) + 3.5} textAnchor="end" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor}>{val}%</text>
            </g>
          ))}
          <text x={m.left - 36} y={m.top + ch * 0.225} textAnchor="middle" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} transform={`rotate(-90,${m.left - 36},${m.top + ch * 0.225})`}>Estabilidad física</text>

          {/* Y-axis right: EAS states */}
          {Object.entries(STATE_VALUES).map(([state]) => (
            <text key={state} x={m.left + cw + 8} y={yState(state) + 3.5} textAnchor="start" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={stateColors[state]}>{STATE_LABELS_ES[state]}</text>
          ))}
          <text x={m.left + cw + 60} y={m.top + ch * 0.775} textAnchor="middle" fontSize="8" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} transform={`rotate(-90,${m.left + cw + 60},${m.top + ch * 0.775})`}>Estado EAS</text>

          {/* Physical line */}
          <path d={physPath} fill="none" stroke={physLine} strokeWidth="2.5" strokeLinejoin="round" />
          {EAS_EVENTS.map((evt, i) => (
            <circle key={`ph-${i}`} cx={xScale(i)} cy={yPhys(evt.physical)} r={selectedIndex === i ? 5.5 : 3.5} fill={physLine}
              stroke={isDark ? '#13263f' : '#fffdf7'} strokeWidth="1" className={styles.point}
              onClick={() => toggle(i)} tabIndex={0} role="button"
              aria-label={`${evt.time}: ${evt.label}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }} />
          ))}

          {/* EAS state step line */}
          {EAS_EVENTS.map((evt, i) => {
            if (i === 0) return null;
            const prev = EAS_EVENTS[i - 1];
            return (
              <g key={`eas-${i}`}>
                <line x1={xScale(i - 1)} y1={yState(prev.easState)} x2={xScale(i)} y2={yState(prev.easState)} stroke={stateColors[prev.easState]} strokeWidth="2.5" />
                <line x1={xScale(i)} y1={yState(prev.easState)} x2={xScale(i)} y2={yState(evt.easState)} stroke={stateColors[evt.easState]} strokeWidth="2.5" strokeDasharray="2 2" />
              </g>
            );
          })}
          {EAS_EVENTS.map((evt, i) => (
            <circle key={`eas-pt-${i}`} cx={xScale(i)} cy={yState(evt.easState)} r={selectedIndex === i ? 5.5 : 4} fill={stateColors[evt.easState]}
              stroke={isDark ? '#13263f' : '#fffdf7'} strokeWidth="1" className={styles.point}
              onClick={() => toggle(i)} tabIndex={0} role="button"
              aria-label={`EAS: ${STATE_LABELS_ES[evt.easState]} a las ${evt.time}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }} />
          ))}

          {/* Annotation */}
          <text x={xScale(2)} y={yPhys(0) - 10} textAnchor="middle" fontSize="7.5" fontFamily="Inter,system-ui,sans-serif" fill={mutedColor} fontStyle="italic">Salto Normal → Blackout</text>
          <line x1={xScale(2)} y1={yPhys(0) - 3} x2={xScale(2)} y2={yPhys(0)} stroke={mutedColor} strokeWidth=".5" strokeDasharray="2 2" />
        </svg>
      </div>

      {selectedIndex !== null && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${EAS_EVENTS[selectedIndex].time}`}>
          <h4 className={styles.detailTitle}>{EAS_EVENTS[selectedIndex].tso} — {EAS_EVENTS[selectedIndex].time}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Estado físico</span><span>{EAS_EVENTS[selectedIndex].physical} %</span>
            <span className={styles.detailLabel}>Estado EAS</span><span>{STATE_LABELS_ES[EAS_EVENTS[selectedIndex].easState]}</span>
          </div>
          <p className={styles.detailDesc}>{EAS_EVENTS[selectedIndex].label}</p>
          {EAS_EVENTS[selectedIndex].evidence && (
            <p className={styles.detailEvidence}>{EAS_EVENTS[selectedIndex].evidence}</p>
          )}
        </div>
      )}
    </div>
  );
}
