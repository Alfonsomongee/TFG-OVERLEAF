import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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
  { labelKey: 0, pct: 42, colorKey: 'gas' },
  { labelKey: 1, pct: 22, colorKey: 'nuke' },
  { labelKey: 2, pct: 15, colorKey: 'hydro' },
  { labelKey: 3, pct: 16, colorKey: 'wind' },
  { labelKey: 4, pct:  5, colorKey: 'solar' },
];

const MIX_28A = [
  { labelKey: 0, pct: 53, colorKey: 'solar' },
  { labelKey: 1, pct: 11, colorKey: 'wind' },
  { labelKey: 2, pct: 18, colorKey: 'ibrmid' },
  { labelKey: 3, pct: 10, colorKey: 'nuke' },
  { labelKey: 4, pct:  5, colorKey: 'hydro' },
  { labelKey: 5, pct:  3, colorKey: 'gas' },
];

const TRANSLATIONS = {
  es: {
    title: 'La metamorfosis del sistema ibérico',
    subtitle: 'Desplazamiento de las masas síncronas por generación conectada por inversores (IBR), 2010 → 28-A',
    years15: '15 años',
    park2010: '2010 — parque síncrono',
    park2025: '28-A 12:30 CEST — sistema IBR',
    genSync: 'Generación síncrona',
    inerciaMedia: 'Inercia media H',
    fortalezaScr: 'Fortaleza red SCR',
    genIbr: 'Generación IBR',
    inerciaMediaNorte: 'H media (norte)',
    inerciaSur: 'H zona sur ⚠',
    high: 'Alta',
    opImplication: 'Implicación operativa:',
    opImplicationText: 'A las 12:30 del 28-A el sistema operaba con 82% de generación no síncrona, una inercia media de 2,3 s —menos de la mitad que en 2010— y un SCR críticamente bajo en la zona sur. Esta condición estructural no causó el colapso, pero definió su posibilidad.',
    figCaptionTitle: 'Figura A1.',
    figCaptionText: 'Metamorfosis electromecánica del sistema ibérico: de masa síncrona a control IBR.',
    figCaptionAuthor: 'Elaboración propia a partir de la literatura técnica sobre sistemas dominados por inversores.',
    mix2010: [
      'Carbón y gas natural',
      'Nuclear',
      'Hidráulica',
      'Eólica',
      'Solar + otros'
    ],
    mix28a: [
      'Solar FV',
      'Eólica',
      'IBR distribuido',
      'Nuclear',
      'Hidro + bombeo',
      'CCGT + otros'
    ]
  },
  en: {
    title: 'The Metamorphosis of the Iberian System',
    subtitle: 'Displacement of synchronous masses by inverter-based resources (IBR), 2010 → 28-A',
    years15: '15 years',
    park2010: '2010 — synchronous fleet',
    park2025: '28-A 12:30 CEST — IBR system',
    genSync: 'Synchronous generation',
    inerciaMedia: 'Mean inertia H',
    fortalezaScr: 'Grid strength SCR',
    genIbr: 'IBR generation',
    inerciaMediaNorte: 'Mean H (north)',
    inerciaSur: 'H southern zone ⚠',
    high: 'High',
    opImplication: 'Operational implication:',
    opImplicationText: 'At 12:30 CEST on April 28, the system operated with 82% non-synchronous generation, a mean inertia of 2.3 s — less than half that of 2010 — and a critically low SCR in the southern zone. This structural condition did not cause the collapse, but defined its possibility.',
    figCaptionTitle: 'Figure A1.',
    figCaptionText: 'Electromechanical metamorphosis of the Iberian system: from synchronous mass to IBR control.',
    figCaptionAuthor: 'Own elaboration based on technical literature on inverter-dominated systems.',
    mix2010: [
      'Coal & natural gas',
      'Nuclear',
      'Hydro',
      'Wind',
      'Solar + others'
    ],
    mix28a: [
      'Solar PV',
      'Wind',
      'Distributed IBR',
      'Nuclear',
      'Hydro & pumping',
      'CCGT & others'
    ]
  },
  de: {
    title: 'Die Metamorphose des iberischen Systems',
    subtitle: 'Verdrängung synchroner Massen durch wechselrichterbasierte Erzeugung (IBR), 2010 → 28-A',
    years15: '15 Jahre',
    park2010: '2010 — synchroner Park',
    park2025: '28-A 12:30 CEST — IBR-System',
    genSync: 'Synchrone Erzeugung',
    inerciaMedia: 'Mittlere Trägheit H',
    fortalezaScr: 'Netzstärke SCR',
    genIbr: 'IBR-Erzeugung',
    inerciaMediaNorte: 'Mittlere H (Nord)',
    inerciaSur: 'H Südzone ⚠',
    high: 'Hoch',
    opImplication: 'Betriebliche Auswirkung:',
    opImplicationText: 'Um 12:30 Uhr am 28-A betrug der Anteil nicht-synchroner Erzeugung 82 %, die mittlere Trägheit lag bei 2,3 s — weniger als die Hälfte von 2010 — und der SCR in der Südzone war kritisch niedrig. Diese strukturelle Bedingung war nicht die Ursache des Zusammenbruchs, machte ihn jedoch erst möglich.',
    figCaptionTitle: 'Abbildung A1.',
    figCaptionText: 'Elektromechanische Metamorphose des iberischen Systems: Von synchroner Masse zu IBR-Regelung.',
    figCaptionAuthor: 'Eigene Darstellung auf Grundlage der Fachliteratur über wechselrichterdominierte Netze.',
    mix2010: [
      'Kohle & Erdgas',
      'Kernenergie',
      'Wasserkraft',
      'Windkraft',
      'Solar + Sonstige'
    ],
    mix28a: [
      'Solar-PV',
      'Windkraft',
      'Verteilte IBR',
      'Kernenergie',
      'Wasser & Pumpspeicher',
      'GuD & Sonstige'
    ]
  },
  'zh-Hans': {
    title: '伊比利亚电网的机电演变',
    subtitle: '逆变器电源 (IBR) 对传统同步旋转质量的替代，2010 → 28-A',
    years15: '15年间',
    park2010: '2010年 — 同步发电机组',
    park2025: '28-A 12:30 CEST — 逆变器系统',
    genSync: '同步发电占比',
    inerciaMedia: '平均转动惯量 H',
    fortalezaScr: '电网强度 SCR',
    genIbr: '逆变器发电占比',
    inerciaMediaNorte: '北部平均 H',
    inerciaSur: '南部区域 H ⚠',
    high: '高强度',
    opImplication: '运营影响:',
    opImplicationText: '在28-A事件当天的12:30 CEST，系统运行于82%的非同步发电状态，平均转动惯量仅为2.3秒（不及2010年的一半），且南部地区SCR处于临界低值。这种结构性脆弱性本身并未引发停电，但构成了系统性崩溃的边界条件。',
    figCaptionTitle: '图 A1.',
    figCaptionText: '伊比利亚系统的机电形态演变：从同步旋转质量到逆变器主导。',
    figCaptionAuthor: '根据逆变器主导电力系统相关技术文献自主编制。',
    mix2010: [
      '煤电与天然气气电',
      '核电',
      '水电',
      '风电',
      '光伏及其他'
    ],
    mix28a: [
      '光伏发电',
      '风电',
      '分布式逆变器电源',
      '核电',
      '常规水电及蓄能',
      '燃气轮机联合循环及其他'
    ]
  }
};

function Bar({ segments, p, labels }) {
  return (
    <div style={{ display:'flex', height:28, borderRadius:3, overflow:'hidden', border:`0.5px solid ${p.border}` }}>
      {segments.map((s, i) => (
        <div key={i} title={`${labels[s.labelKey]}: ${s.pct}%`} style={{
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
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;
  const p = PALETTE[colorMode === 'dark' ? 'dark' : 'light'];

  return (
    <figure style={{ margin:'1.5rem 0' }}>
      <div style={{
        background:p.bg, border:`0.5px solid ${p.border}`,
        borderRadius:10, overflow:'hidden',
      }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`0.5px solid ${p.divider}` }}>
        <p style={{ margin:0, fontSize:15, fontWeight:500, color:p.text }}>
          {t.title}
        </p>
        <p style={{ margin:'3px 0 0', fontSize:12, color:p.muted }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'stretch' }}>

          <div style={{ flex:1, paddingRight:14 }}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.syncAccent, marginBottom:8 }}>
              {t.park2010}
            </div>
            <Bar segments={MIX_2010} p={p} labels={t.mix2010} />
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Chip value="~77%" label={t.genSync} hi={false} p={p} />
              <Chip value="~5–6 s" label={t.inerciaMedia} hi={false} p={p} />
              <Chip value={t.high} label={t.fortalezaScr} hi={false} p={p} />
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:64, flexShrink:0, gap:4, padding:'0 6px' }}>
            <span style={{ fontSize:10, color:p.muted, textAlign:'center', lineHeight:1.4, textTransform:'uppercase', letterSpacing:'.04em' }}>{t.years15}</span>
            <span style={{ fontSize:22, color:p.ibrAccent, lineHeight:1 }}>→</span>
          </div>

          <div style={{ flex:1, paddingLeft:14 }}>
            <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.ibrAccent, marginBottom:8 }}>
              {t.park2025}
            </div>
            <Bar segments={MIX_28A} p={p} labels={t.mix28a} />
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Chip value="82%" label={t.genIbr} hi={true} p={p} />
              <Chip value="2,3 s" label={t.inerciaMediaNorte} hi={true} p={p} />
              <Chip value="1,3 s" label={t.inerciaSur} hi={true} p={p} />
            </div>
          </div>

        </div>

        <div style={{ marginTop:18, padding:'9px 13px', background:p.noteBg, borderLeft:`3px solid ${p.noteBord}`, fontSize:12.5, color:p.text, lineHeight:1.6 }}>
          <strong>{t.opImplication}</strong> {t.opImplicationText}
        </div>
      </div>
      </div>
      <figcaption style={{ fontSize: '0.85rem', color: p.muted, marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
        <strong>{t.figCaptionTitle}</strong> {t.figCaptionText}<br/>
        <em>{t.figCaptionAuthor}</em>
      </figcaption>
    </figure>
  );
}
