import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const PALETTE = {
  light: {
    bg:         'var(--ifm-background-surface-color)',
    bgAlt:      'var(--ifm-background-color)',
    border:     'var(--ifm-color-emphasis-300)',
    divider:    'var(--ifm-color-emphasis-200)',
    text:       'var(--ifm-font-color-base)',
    muted:      'var(--ifm-color-emphasis-600)',
    solar:      '#C4980A',
    wind:       '#4E7432',
    ibrmid:     '#80A84A',
    nuke:       '#6868A0',
    hydro:      '#287868',
    gas:        '#A86018',
    ibrAccent:  '#4E7432',
    syncAccent: '#A86018',
    noteBg:     'rgba(78,116,50,.06)',
    noteBord:   '#4E7432',
  },
  dark: {
    bg:         'var(--ifm-background-surface-color)',
    bgAlt:      'var(--ifm-background-color)',
    border:     'var(--ifm-color-emphasis-300)',
    divider:    'var(--ifm-color-emphasis-200)',
    text:       'var(--ifm-font-color-base)',
    muted:      'var(--ifm-color-emphasis-600)',
    solar:      '#E8C42A',
    wind:       '#72BC54',
    ibrmid:     '#50A030',
    nuke:       '#9898C0',
    hydro:      '#38B8A0',
    gas:        '#D4A030',
    ibrAccent:  '#72BC54',
    syncAccent: '#D4A030',
    noteBg:     'rgba(114,188,84,.07)',
    noteBord:   '#72BC54',
  },
};

const MIX_2010 = [
  { label: 'Carbón y gas natural', pct: 42, colorKey: 'gas' },
  { label: 'Nuclear',               pct: 22, colorKey: 'nuke' },
  { label: 'Hidráulica',            pct: 15, colorKey: 'hydro' },
  { label: 'Eólica',                pct: 16, colorKey: 'wind' },
  { label: 'Solar + otros',         pct:  5, colorKey: 'solar' },
];

const MIX_28A = [
  { label: 'Solar FV',        pct: 53, colorKey: 'solar' },
  { label: 'Eólica',          pct: 11, colorKey: 'wind' },
  { label: 'IBR distribuido', pct: 18, colorKey: 'ibrmid' },
  { label: 'Nuclear',         pct: 10, colorKey: 'nuke' },
  { label: 'Hidro + bombeo',  pct:  5, colorKey: 'hydro' },
  { label: 'CCGT + otros',    pct:  3, colorKey: 'gas' },
];

function Bar({ segments, p }) {
  return (
    <div style={{ display:'flex', height:28, borderRadius:3, overflow:'hidden', border:`0.5px solid ${p.border}` }}>
      {segments.map((s, i) => (
        <div key={i} title={`${s.label}: ${s.pct}%`} style={{
          width:`${s.pct}%`, height:'100%', background:p[s.colorKey],
          borderRight: i < segments.length-1 ? '1.5px solid rgba(0,0,0,.07)' : 'none',
        }} />
      ))}
    </div>
  );
}

function Chip({ value, label, hi, p }) {
  return (
    <div style={{
      flex:1, padding:'9px 6px', textAlign:'center',
      background: p.bgAlt,
      border:`0.5px solid ${hi ? p.ibrAccent : p.border}`,
      borderRadius:6,
    }}>
      <div style={{ fontSize:18, fontWeight:500, lineHeight:1, color: hi ? p.ibrAccent : p.syncAccent }}>{value}</div>
      <div style={{ fontSize:10, color:p.muted, marginTop:3, lineHeight:1.3 }}>{label}</div>
    </div>
  );
}

export default function MetamorfosisIBR() {
  const { colorMode } = useColorMode();
  const p = PALETTE[colorMode === 'dark' ? 'dark' : 'light'];

  return (
    <figure style={{ margin:'1.5rem 0' }}>
      <div style={{
        background:p.bg, border:`0.5px solid ${p.border}`,
        borderRadius:10, overflow:'hidden',
      }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`0.5px solid ${p.divider}` }}>
        <p style={{ margin:0, fontSize:15, fontWeight:500, color:p.text }}>
          La metamorfosis del sistema ibérico
        </p>
        <p style={{ margin:'3px 0 0', fontSize:12, color:p.muted }}>
          Desplazamiento de las masas síncronas por generación conectada por inversores (IBR), 2010 → 28-A
        </p>
      </div>

      <div style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'stretch' }}>

          <div style={{ flex:1, paddingRight:14 }}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.syncAccent, marginBottom:8 }}>
              2010 — parque síncrono
            </div>
            <Bar segments={MIX_2010} p={p} />
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Chip value="~77%" label="Generación síncrona" hi={false} p={p} />
              <Chip value="~5–6 s" label="Inercia media H" hi={false} p={p} />
              <Chip value="Alta" label="Fortaleza red SCR" hi={false} p={p} />
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:64, flexShrink:0, gap:4, padding:'0 6px' }}>
            <span style={{ fontSize:10, color:p.muted, textAlign:'center', lineHeight:1.4, textTransform:'uppercase', letterSpacing:'.04em' }}>15 años</span>
            <span style={{ fontSize:22, color:p.ibrAccent, lineHeight:1 }}>→</span>
          </div>

          <div style={{ flex:1, paddingLeft:14 }}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.ibrAccent, marginBottom:8 }}>
              28-A 12:30 CEST — sistema IBR
            </div>
            <Bar segments={MIX_28A} p={p} />
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Chip value="82%" label="Generación IBR" hi={true} p={p} />
              <Chip value="2,3 s" label="H media (norte)" hi={true} p={p} />
              <Chip value="1,3 s" label="H zona sur ⚠" hi={true} p={p} />
            </div>
          </div>

        </div>

        <div style={{ marginTop:18, padding:'9px 13px', background:p.noteBg, borderLeft:`3px solid ${p.noteBord}`, fontSize:12.5, color:p.text, lineHeight:1.6 }}>
          <strong>Implicación operativa:</strong> A las 12:30 del 28-A el sistema operaba con 82% de generación
          no síncrona, una inercia media de 2,3 s —menos de la mitad que en 2010— y un SCR críticamente bajo
          en la zona sur. Esta condición estructural no causó el colapso, pero definió su posibilidad.
        </div>
      </div>
      </div>
      <figcaption style={{ fontSize: '0.85rem', color: p.muted, marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
        <strong>Figura A1.</strong> Metamorfosis electromecánica del sistema ibérico: de masa síncrona a control IBR.<br/>
        <em>Elaboración propia a partir de la literatura técnica sobre sistemas dominados por inversores.</em>
      </figcaption>
    </figure>
  );
}
