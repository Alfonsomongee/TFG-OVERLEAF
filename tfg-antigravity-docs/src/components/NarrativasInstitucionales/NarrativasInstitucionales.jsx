import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const PALETTE = {
  light: {
    bg:      'var(--ifm-background-surface-color)',
    bgAlt:   'var(--ifm-background-color)',
    border:  'var(--ifm-color-emphasis-300)',
    divider: 'var(--ifm-color-emphasis-200)',
    text:    'var(--ifm-font-color-base)',
    muted:   'var(--ifm-color-emphasis-600)',
    ibr:     '#4E7432',
    entsoe:  { accent:'#1E4080', bg:'rgba(180,210,255,.20)', brd:'rgba(60,100,180,.30)', txt:'#1E3870' },
    gov:     { accent:'#1A5830', bg:'rgba(180,240,200,.20)', brd:'rgba(50,130,80,.30)',  txt:'#1A4828' },
    icai:    { accent:'#782810', bg:'rgba(255,200,180,.20)', brd:'rgba(180,80,48,.30)',  txt:'#622010' },
    conBg:   'rgba(240,228,196,.50)',
    conBrd:  'rgba(140,116,56,.35)',
  },
  dark: {
    bg:      'var(--ifm-background-surface-color)',
    bgAlt:   'var(--ifm-background-color)',
    border:  'var(--ifm-color-emphasis-300)',
    divider: 'var(--ifm-color-emphasis-200)',
    text:    'var(--ifm-font-color-base)',
    muted:   'var(--ifm-color-emphasis-600)',
    ibr:     '#72BC54',
    entsoe:  { accent:'#4878C8', bg:'rgba(32,64,128,.20)', brd:'rgba(72,120,200,.35)', txt:'#A0C4F0' },
    gov:     { accent:'#38AA58', bg:'rgba(28,100,56,.20)', brd:'rgba(56,160,88,.35)',  txt:'#78D0A0' },
    icai:    { accent:'#D05838', bg:'rgba(120,42,22,.20)', brd:'rgba(200,80,48,.35)',  txt:'#F0A080' },
    conBg:   'rgba(24,56,100,.20)',
    conBrd:  'rgba(60,100,160,.30)',
  },
};

const ENTITIES = [
  {
    id:      'entsoe',
    acronym: 'ENTSO-E',
    sub:     'perspectiva europea',
    thesis:  'El sistema operó dentro de los parámetros reglamentarios vigentes. Dichos parámetros resultaron insuficientes ante la nueva realidad de una red dominada por IBR sin capacidad grid-forming obligatoria.',
    causa:   'Insuficiencia estructural del NC RfG y del marco de control de perfil de tensión',
    badge:   'Fallo normativo europeo',
  },
  {
    id:      'gov',
    acronym: 'Gobierno / REE',
    sub:     'narrativa oficial',
    thesis:  'Las plantas IBR no absorbieron la reactiva capacitiva que exigía el P.O. 7.4 ante la perturbación de tensión, agotando el margen dinámico disponible en la zona sur peninsular.',
    causa:   'Incumplimiento del P.O. 7.4 por operadores de generación IBR',
    badge:   'Fallo de agentes privados',
  },
  {
    id:      'icai',
    acronym: 'IIT-ICAI / AELEC',
    sub:     'sector generador',
    thesis:  'La reconexión de 11 líneas de 400 kV entre las 12:03 y las 12:30 agotó la absorción reactiva. El efecto Tap-Lag ocultó la sobretensión en colectores al SCADA de REE, haciendo inevitable el colapso.',
    causa:   'Maniobra de mallado + inobservabilidad SCADA (efecto Tap-Lag)',
    badge:   'Decisión operativa TSO',
  },
];

const CONSENSO = [
  'Mecanismo físico: inestabilidad de tensión capacitiva, no déficit de inercia ni caída de frecuencia.',
  'Condición de contorno: 82% de generación IBR con SCR críticamente bajo en la zona sur ibérica.',
  'Marco normativo insuficiente: P.O. 7.4 y NC RfG vigentes en el 28-A no contemplaban red dominada por IBR.',
];

export default function NarrativasInstitucionales() {
  const { colorMode } = useColorMode();
  const p = PALETTE[colorMode === 'dark' ? 'dark' : 'light'];

  return (
    <figure style={{ margin:'1.5rem 0' }}>
      <div style={{ background:p.bg, border:`0.5px solid ${p.border}`, borderRadius:10, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`0.5px solid ${p.divider}` }}>
        <p style={{ margin:0, fontSize:15, fontWeight:500, color:p.text }}>
          Tres lecturas forenses del 28-A
        </p>
        <p style={{ margin:'3px 0 0', fontSize:12, color:p.muted }}>
          Narrativa central, causa raíz y atribución de responsabilidad según cada actor institucional
        </p>
      </div>

      <div style={{ padding:20 }}>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          {ENTITIES.map(e => {
            const col = p[e.id];
            return (
              <div key={e.id} style={{ flex:1, background:col.bg, border:`0.5px solid ${col.brd}`, borderTop:`3px solid ${col.accent}`, borderRadius:7, padding:14 }}>
                <div style={{ fontSize:13, fontWeight:500, color:col.txt, marginBottom:2 }}>{e.acronym}</div>
                <div style={{ fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:p.muted, marginBottom:10 }}>{e.sub}</div>
                <p style={{ margin:'0 0 10px', fontSize:12, color:p.text, lineHeight:1.65, borderLeft:`2px solid ${col.brd}`, paddingLeft:9 }}>
                  {e.thesis}
                </p>
                <div style={{ fontSize:9, letterSpacing:'.10em', textTransform:'uppercase', color:p.muted, marginBottom:3 }}>Causa raíz</div>
                <div style={{ fontSize:11.5, fontWeight:500, color:col.txt, marginBottom:9 }}>{e.causa}</div>
                <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:3, background:col.accent, color:'#fff', fontSize:10, fontWeight:500 }}>
                  {e.badge}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ background:p.conBg, border:`0.5px solid ${p.conBrd}`, borderRadius:7, padding:'13px 16px' }}>
          <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.muted, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:p.ibr, display:'inline-block', flexShrink:0 }} />
            Consenso técnico verificado entre los tres actores
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {CONSENSO.map((c, i) => (
              <div key={i} style={{ flex:1, display:'flex', gap:7, alignItems:'flex-start', fontSize:12, color:p.text, lineHeight:1.55 }}>
                <span style={{ color:p.ibr, fontWeight:500, flexShrink:0, marginTop:1 }}>✓</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <figcaption style={{ fontSize: '0.85rem', color: p.muted, marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
        <strong>Figura A2.</strong> Tres narrativas institucionales sobre el apagón ibérico del 28-A.<br/>
        <em>Elaboración propia a partir de la comparación entre narrativas institucionales, sectoriales y evidencia técnica disponible.</em>
      </figcaption>
    </figure>
  );
}
