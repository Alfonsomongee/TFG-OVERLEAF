import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './MRSCRComparator.module.css';

const getSubs = () => [
  { id:'hernani', name:'Hernani 400 kV (ES)', short:'Hernani', sac:5500, ibr:1500, miif:0.42, scr:3.67, mrscr:1.88, cls:translate({id: 'mrscr.cls.critical', message: 'Red Débil (Riesgo Crítico)'}) },
  { id:'vic', name:'Vic 400 kV (ES)', short:'Vic', sac:6100, ibr:1800, miif:0.38, scr:3.39, mrscr:1.95, cls:translate({id: 'mrscr.cls.critical', message: 'Red Débil (Riesgo Crítico)'}) },
  { id:'arkale', name:'Arkale 220 kV (ES)', short:'Arkale', sac:2800, ibr:900, miif:0.51, scr:3.11, mrscr:1.48, cls:translate({id: 'mrscr.cls.pll', message: 'Red Muy Débil (Fallo de PLL)'}) },
  { id:'baixas', name:'Baixas 400 kV (FR)', short:'Baixas', sac:14000, ibr:2500, miif:0.18, scr:5.60, mrscr:3.82, cls:translate({id: 'mrscr.cls.strong', message: 'Red Fuerte (Estabilidad Dinámica)'}) },
  { id:'argia', name:'Argia 400 kV (FR)', short:'Argia', sac:4200, ibr:1100, miif:0.48, scr:3.82, mrscr:1.92, cls:translate({id: 'mrscr.cls.critical', message: 'Red Débil (Riesgo Crítico)'}) },
  { id:'lagoaca', name:'Lagoaça 400 kV (PT)', short:'Lagoaça', sac:3900, ibr:1200, miif:0.35, scr:3.25, mrscr:1.83, cls:translate({id: 'mrscr.cls.critical', message: 'Red Débil (Riesgo Crítico)'}) },
];

const TH = 2.0, MAX = 6.0;

export default function MRSCRComparator() {
  const [selId, setSelId] = useState(null);
  const toggle = (id) => setSelId(p => p === id ? null : id);
  const SUBS = getSubs();
  const sel = SUBS.find(s => s.id === selId);

  const w=680, h=250;
  const m = { top:18, right:20, bottom:44, left:38 };
  const cw = w-m.left-m.right, ch = h-m.top-m.bottom;
  const yS = (v) => m.top + ch - (v/MAX)*ch;
  const gw = cw / SUBS.length;
  const bw = Math.min(18, gw*0.28);
  const bg = 3;
  const bx = (gi, bi) => m.left + gi*gw + gw/2 - bw - bg/2 + bi*(bw+bg);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}><Translate id="mrscr.kicker2">Fortaleza de red</Translate></span>
        <h3 className={styles.title}><Translate id="mrscr.title2">MRSCR vs SCR en subestaciones de interconexión</Translate></h3>
        <p className={styles.subtitle}>
          <Translate id="mrscr.subtitle2">MRSCR ≤ 2,0 indica red débil con riesgo de inestabilidad dinámica. Pulsa cada par de barras para ampliar.</Translate>
        </p>
      </header>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{backgroundColor:'var(--scrColor)'}} />SCR
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{backgroundColor:'var(--mrscrColor)'}} />MRSCR
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} style={{borderColor:'var(--thresholdColor)'}} /><Translate id="mrscr.legend.threshold">Umbral 2,0</Translate>
        </span>
      </div>
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg} role="img" aria-label={translate({id: 'mrscr.title2', message: 'MRSCR vs SCR'})}>
          <title>{translate({id: 'mrscr.title2', message: 'MRSCR vs SCR'})}</title>
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top+ch} stroke="var(--axisColor)" strokeWidth="1" />
          <line x1={m.left} y1={m.top+ch} x2={m.left+cw} y2={m.top+ch} stroke="var(--axisColor)" strokeWidth="1" />
          {[0,1,2,3,4,5,6].map(v => (
            <g key={v}>
              {v>0 && <line x1={m.left} y1={yS(v)} x2={m.left+cw} y2={yS(v)} stroke="var(--gridColor)" strokeWidth="1" />}
              <text x={m.left-6} y={yS(v)+3.5} textAnchor="end" fontSize="8.5" fill="var(--fig-muted)">{v}</text>
            </g>
          ))}
          <line x1={m.left} y1={yS(TH)} x2={m.left+cw} y2={yS(TH)} stroke="var(--thresholdColor)" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={m.left+cw-2} y={yS(TH)-4} textAnchor="end" fontSize="7.5" fill="var(--thresholdColor)">MRSCR = 2,0</text>

          {SUBS.map((s, i) => (
            <g key={s.id}>
              <rect x={bx(i,0)} y={yS(s.scr)} width={bw} height={ch-(yS(s.scr)-m.top)}
                fill="var(--scrColor)" rx="2" className={styles.bar}
                onClick={() => toggle(s.id)} tabIndex={0} role="button"
                aria-label={`${s.short} SCR: ${s.scr}`}
                onKeyDown={e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(s.id);}}} />
              <rect x={bx(i,1)} y={yS(s.mrscr)} width={bw} height={ch-(yS(s.mrscr)-m.top)}
                fill="var(--mrscrColor)" rx="2" className={styles.bar}
                onClick={() => toggle(s.id)} tabIndex={0} role="button"
                aria-label={`${s.short} MRSCR: ${s.mrscr}`}
                onKeyDown={e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(s.id);}}} />
              <text x={m.left+i*gw+gw/2} y={m.top+ch+14} textAnchor="middle" fontSize="8.5" fill="var(--fig-muted)">{s.short}</text>
            </g>
          ))}
        </svg>
      </div>
      {sel && (
        <div className={styles.detail} role="region">
          <h4 className={styles.detailTitle}>{sel.name}</h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.scr">SCR</Translate></span><span>{sel.scr}</span>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.mrscr">MRSCR</Translate></span><span>{sel.mrscr}</span>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.sac">Sac (MVA)</Translate></span><span>{sel.sac.toLocaleString()}</span>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.ibr">IBR (MW)</Translate></span><span>{sel.ibr}</span>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.miif">MIIF prom.</Translate></span><span>{sel.miif}</span>
            <span className={styles.detailLabel}><Translate id="mrscr.detail.cls">Clasificación</Translate></span><span className={styles.classNote}>{sel.cls}</span>
          </div>
        </div>
      )}
    </div>
  );
}
