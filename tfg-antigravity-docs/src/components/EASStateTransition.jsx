import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './EASStateTransition.module.css';

const getEvents = () => [
  { time:'12:32', tso:'REE', physical:95, eas:'Normal', label: translate({id: 'eas.evt1.label', message: 'Estable. Inicio de oscilaciones locales subsíncronas controladas.'}), evidence: translate({id: 'eas.evt1.evidence', message: 'Tensiones de 400 kV por debajo de los límites admisibles de 420 kV.'}) },
  { time:'12:33:21', tso:'REE', physical:30, eas:'Normal', label: translate({id: 'eas.evt2.label', message: 'Disparo físico de interconexiones por pérdida de sincronismo.'}) },
  { time:'12:40', tso:'REE', physical:0, eas:'Blackout', label: translate({id: 'eas.evt3.label', message: 'Transición abrupta. Omisión absoluta de los estados de Alerta y Emergencia.'}), evidence: translate({id: 'eas.evt3.evidence', message: 'Colapso total. Desconexión de 2.500 MW de generación e interconexiones pirenaicas.'}) },
  { time:'12:40', tso:'REN', physical:0, eas:'Blackout', label: translate({id: 'eas.evt4.label', message: 'Caída instantánea del bloque síncrono portugués.'}) },
  { time:'12:49', tso:'Swissgrid', physical:0, eas:'Emergency', label: translate({id: 'eas.evt5.label', message: 'Activación del protocolo de control de frecuencia en modo dividido.'}), evidence: translate({id: 'eas.evt5.evidence', message: 'Operando en modo síncrono dividido respecto a Iberia.'}) },
  { time:'12:49', tso:'Amprion', physical:0, eas:'Emergency', label: translate({id: 'eas.evt6.label', message: 'Coordinación de seguridad del bloque síncrono continental.'}) },
  { time:'12:50', tso:'RTE', physical:0, eas:'Emergency', label: translate({id: 'eas.evt7.label', message: 'Desconexión física de interconexiones y aislamiento seguro del sistema francés.'}), evidence: translate({id: 'eas.evt7.evidence', message: 'Fluctuaciones de tensión transitorias mitigadas en subestaciones limítrofes.'}) },
  { time:'14:35', tso:'RTE', physical:30, eas:'Alert', label: translate({id: 'eas.evt8.label', message: 'Normalización de tensiones en el sur de Francia.'}) },
  { time:'17:05', tso:'REN', physical:50, eas:'Restoration', label: translate({id: 'eas.evt9.label', message: 'Inicio del plan de restauración física del sistema portugués.'}), evidence: translate({id: 'eas.evt9.evidence', message: 'Construcción de islas de levantamiento locales con unidades black-start.'}) },
  { time:'22:50', tso:'RTE', physical:70, eas:'Restoration', label: translate({id: 'eas.evt10.label', message: 'Reporte de operatividad del LFC de REE. Rampa de intercambio de 0 a 1.400 MW.'}) },
  { time:'00:11', tso:'RTE', physical:90, eas:'Normal', label: translate({id: 'eas.evt11.label', message: 'Cierre de lazo y estabilización del AGC de REE.'}), evidence: translate({id: 'eas.evt11.evidence', message: 'El sistema español recupera el control automático y la compensación de desvíos.'}) },
];

const SV = { Normal:4, Alert:3, Emergency:2, Blackout:1, Restoration:2.5 };
const SC = { Normal:'var(--st-normal)', Alert:'var(--st-alert)', Emergency:'var(--st-emergency)', Blackout:'var(--st-blackout)', Restoration:'var(--st-restoration)' };

export default function EASStateTransition() {
  const [sel, setSel] = useState(null);
  const toggle = (i) => setSel(p => p === i ? null : i);

  const EVENTS = getEvents();

  const SL = { 
    Normal: translate({id: 'eas.state.normal', message: 'Normal'}), 
    Alert: translate({id: 'eas.state.alert', message: 'Alerta'}), 
    Emergency: translate({id: 'eas.state.emergency', message: 'Emergencia'}), 
    Blackout: translate({id: 'eas.state.blackout', message: 'Blackout'}), 
    Restoration: translate({id: 'eas.state.restoration', message: 'Restauración'}) 
  };

  const w=760, h=340;
  const m = { top:30, right:90, bottom:40, left:50 };
  const cw = w-m.left-m.right, ch = h-m.top-m.bottom;
  const xS = (i) => m.left + (i/(EVENTS.length-1))*cw;
  const yP = (v) => m.top + (1-v/100)*(ch*0.45);
  const yE = (s) => m.top + ch*0.55 + ((4-(SV[s]||2))/3)*(ch*0.4);
  const physPath = EVENTS.map((e,i) => `${i===0?'M':'L'}${xS(i)},${yP(e.physical)}`).join(' ');

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}><Translate id="eas.kicker">Monitorización paneuropea</Translate></span>
        <h3 className={styles.title}><Translate id="eas.title">Fallo del EAS: del estado Normal al Blackout</Translate></h3>
        <p className={styles.subtitle}>
          <Translate id="eas.subtitle">Evolución física de la red ibérica frente a las declaraciones del ENTSO-E Awareness System. El salto Normal → Blackout omite Alerta y Emergencia.</Translate>
        </p>
      </header>
      <div className={styles.legend}>
        {['Normal','Alert','Emergency','Blackout','Restoration'].map(s => (
          <span key={s} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{backgroundColor:SC[s]}} />{SL[s]}
          </span>
        ))}
      </div>
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label={translate({id: 'eas.aria', message: 'Estabilidad física vs notificaciones EAS'})}>
          <title>{translate({id: 'eas.svgTitle', message: 'Discrepancia entre estado físico y declaraciones EAS durante el 28-A'})}</title>
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top+ch} stroke="var(--axisColor)" strokeWidth="1" />
          <line x1={m.left} y1={m.top+ch} x2={m.left+cw} y2={m.top+ch} stroke="var(--axisColor)" strokeWidth="1" />
          <line x1={m.left+cw} y1={m.top} x2={m.left+cw} y2={m.top+ch} stroke="var(--axisColor)" strokeWidth="1" />

          {[100,75,50,25,0].map(v => (
            <g key={v}>
              <line x1={m.left} y1={yP(v)} x2={m.left+cw} y2={yP(v)} stroke="var(--gridColor)" strokeWidth="1" />
              <text x={m.left-8} y={yP(v)+3.5} textAnchor="end" fontSize="8" fill="var(--fig-muted)">{v}%</text>
            </g>
          ))}
          <text x={m.left-36} y={m.top+ch*0.225} textAnchor="middle" fontSize="8" fill="var(--fig-muted)" transform={`rotate(-90,${m.left-36},${m.top+ch*0.225})`}>{translate({id: 'eas.axis.physical', message: 'Estabilidad física'})}</text>

          {Object.keys(SV).map(s => (
            <text key={s} x={m.left+cw+8} y={yE(s)+3.5} textAnchor="start" fontSize="8" fill={SC[s]}>{SL[s]}</text>
          ))}
          <text x={m.left + cw + 60} y={m.top + ch * 0.775} textAnchor="middle" fontSize="8" fill="var(--fig-muted)" transform={`rotate(-90,${m.left + cw + 60},${m.top + ch * 0.775})`}>{translate({id: 'eas.axis.state', message: 'Estado EAS'})}</text>

          <path d={physPath} fill="none" stroke="var(--physLine)" strokeWidth="2.5" strokeLinejoin="round" />
          {EVENTS.map((e,i) => (
            <circle key={`p${i}`} cx={xS(i)} cy={yP(e.physical)} r={sel===i?5.5:3.5}
              fill="var(--physLine)" stroke="var(--fig-bg)" strokeWidth="1"
              className={styles.point} onClick={() => toggle(i)} tabIndex={0} role="button"
              aria-label={`${e.time}: ${e.label}`}
              onKeyDown={ev => {if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();toggle(i);}}} />
          ))}

          {EVENTS.map((e,i) => {
            if (i===0) return null;
            const prev = EVENTS[i-1];
            return (
              <g key={`e${i}`}>
                <line x1={xS(i-1)} y1={yE(prev.eas)} x2={xS(i)} y2={yE(prev.eas)} stroke={SC[prev.eas]} strokeWidth="2.5" />
                <line x1={xS(i)} y1={yE(prev.eas)} x2={xS(i)} y2={yE(e.eas)} stroke={SC[e.eas]} strokeWidth="2.5" strokeDasharray="2 2" />
              </g>
            );
          })}
          {EVENTS.map((e,i) => (
            <circle key={`s${i}`} cx={xS(i)} cy={yE(e.eas)} r={sel===i?5.5:4}
              fill={SC[e.eas]} stroke="var(--fig-bg)" strokeWidth="1"
              className={styles.point} onClick={() => toggle(i)} tabIndex={0} role="button"
              aria-label={`EAS: ${SL[e.eas]} a las ${e.time}`}
              onKeyDown={ev => {if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();toggle(i);}}} />
          ))}

          <text x={xS(2)} y={yP(0)-10} textAnchor="middle" fontSize="7.5" fill="var(--fig-muted)" fontStyle="italic">{translate({id: 'eas.jumpAnnotation', message: 'Salto Normal → Blackout'})}</text>
          <line x1={xS(2)} y1={yP(0) - 3} x2={xS(2)} y2={yP(0)} stroke="var(--fig-muted)" strokeWidth=".5" strokeDasharray="2 2" />
        </svg>
      </div>
      {sel !== null && (
        <div className={styles.detail} role="region" aria-label={`Detail: ${EVENTS[sel].time}`}>
          <h4 className={styles.detailTitle}>{EVENTS[sel].tso} — {EVENTS[sel].time}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}><Translate id="eas.detail.physical">Estado físico</Translate></span><span>{EVENTS[sel].physical} %</span>
            <span className={styles.detailLabel}><Translate id="eas.detail.eas">Estado EAS</Translate></span><span>{SL[EVENTS[sel].eas]}</span>
          </div>
          <p className={styles.detailDesc}>{EVENTS[sel].label}</p>
          {EVENTS[sel].evidence && <p className={styles.detailEvidence}>{EVENTS[sel].evidence}</p>}
        </div>
      )}
    </div>
  );
}
