import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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

const ENTITIES_STATIC = [
  { id: 'entsoe', acronym: 'ENTSO-E' },
  { id: 'gov', acronym: 'Gobierno / REE' },
  { id: 'icai', acronym: 'IIT-ICAI / AELEC' },
];

const TRANSLATIONS = {
  es: {
    title: 'Tres lecturas forenses del 28-A',
    subtitle: 'Narrativa central, causa raíz y atribución de responsabilidad según cada actor institucional',
    causaRaiz: 'Causa raíz',
    consensoTitle: 'Consenso técnico verificado entre los tres actores',
    figCaptionTitle: 'Figura A2.',
    figCaptionText: 'Tres narrativas institucionales sobre el apagón ibérico del 28-A.',
    figCaptionAuthor: 'Elaboración propia a partir de la comparación entre narrativas institucionales, sectoriales y evidencia técnica disponible.',
    entities: {
      entsoe: {
        sub: 'perspectiva europea',
        thesis: 'El sistema operó dentro de los parámetros reglamentarios vigentes. Dichos parámetros resultaron insuficientes ante la nueva realidad de una red dominada por IBR sin capacidad grid-forming obligatoria.',
        causa: 'Insuficiencia estructural del NC RfG y del marco de control de perfil de tensión',
        badge: 'Fallo normativo europeo',
      },
      gov: {
        sub: 'narrativa oficial',
        thesis: 'Las plantas IBR no absorbieron la reactiva capacitiva que exigía el P.O. 7.4 ante la perturbación de tensión, agotando el margen dinámico disponible en la zona sur peninsular.',
        causa: 'Incumplimiento del P.O. 7.4 por operadores de generación IBR',
        badge: 'Fallo de agentes privados',
      },
      icai: {
        sub: 'sector generador',
        thesis: 'La reconexión de 11 líneas de 400 kV entre las 12:03 y las 12:30 agotó la absorción reactiva. El efecto Tap-Lag ocultó la sobretensión en colectores al SCADA de REE, haciendo inevitable el colapso.',
        causa: 'Maniobra de mallado + inobservabilidad SCADA (efecto Tap-Lag)',
        badge: 'Decisión operativa TSO',
      }
    },
    consenso: [
      'Mecanismo físico: inestabilidad de tensión capacitiva, no déficit de inercia ni caída de frecuencia.',
      'Condición de contorno: 82% de generación IBR con SCR críticamente bajo en la zona sur ibérica.',
      'Marco normativo insuficiente: P.O. 7.4 y NC RfG vigentes en el 28-A no contemplaban red dominada por IBR.',
    ]
  },
  en: {
    title: 'Three Forensic Readings of April 28',
    subtitle: 'Central narrative, root cause, and attribution of responsibility according to each institutional actor',
    causaRaiz: 'Root cause',
    consensoTitle: 'Technical consensus verified among the three actors',
    figCaptionTitle: 'Figure A2.',
    figCaptionText: 'Three institutional narratives on the April 28 Iberian blackout.',
    figCaptionAuthor: 'Own elaboration based on the comparison of institutional, industry, and technical evidence available.',
    entities: {
      entsoe: {
        sub: 'European perspective',
        thesis: 'The system operated within the regulatory parameters in force. These parameters proved insufficient for the new reality of an IBR-dominated grid without mandatory grid-forming capability.',
        causa: 'Structural failure of the NC RfG and the voltage profile control framework',
        badge: 'European regulatory failure',
      },
      gov: {
        sub: 'official narrative',
        thesis: 'The IBR plants did not absorb the capacitive reactive power required by P.O. 7.4 during the voltage disturbance, exhausting the dynamic margin available in the southern peninsular zone.',
        causa: 'Non-compliance with P.O. 7.4 by IBR generation operators',
        badge: 'Private operators failure',
      },
      icai: {
        sub: 'generation sector',
        thesis: 'The reconnection of 11 400 kV lines between 12:03 and 12:30 exhausted the reactive absorption margin. The Tap-Lag effect hid the overvoltage in collectors from REE\'s SCADA, making the collapse inevitable.',
        causa: 'Meshing maneuver + SCADA inobservability (Tap-Lag effect)',
        badge: 'TSO operational decision',
      }
    },
    consenso: [
      'Physical mechanism: capacitive voltage instability, not inertia deficit or frequency drop.',
      'Boundary condition: 82% IBR generation with critically low SCR in the southern Iberian zone.',
      'Insufficient regulatory framework: P.O. 7.4 and NC RfG in force on April 28 did not contemplate an IBR-dominated grid.',
    ]
  },
  de: {
    title: 'Drei forensische Lesarten des 28-A',
    subtitle: 'Zentrale Erzählung, Hauptursache und Zuweisung der Verantwortung nach Ansicht der einzelnen institutionellen Akteure',
    causaRaiz: 'Hauptursache',
    consensoTitle: 'Technischer Konsens zwischen den drei Akteuren bestätigt',
    figCaptionTitle: 'Abbildung A2.',
    figCaptionText: 'Drei institutionelle Erzählungen zum iberischen Blackout vom 28. April.',
    figCaptionAuthor: 'Eigene Darstellung auf Grundlage des Vergleichs von institutionellen Berichten, Industrieanalysen und verfügbaren technischen Nachweisen.',
    entities: {
      entsoe: {
        sub: 'Europäische Perspektive',
        thesis: 'Das System arbeitete innerhalb der geltenden Vorschriften. Diese Vorschriften erwiesen sich als unzureichend für ein IBR-dominiertes Netz ohne verpflichtende Grid-Forming-Fähigkeit.',
        causa: 'Strukturelles Versagen des NC RfG und des Rahmens zur Steuerung des Spannungsprofils',
        badge: 'Europäisches Regulierungsversagen',
      },
      gov: {
        sub: 'Offizielle Erzählung',
        thesis: 'Die IBR-Anlagen absorbierten während der Spannungsstörung nicht den nach P.O. 7.4 erforderlichen kapazitiven Blindstrom, wodurch die dynamische Reserve in der Südzone aufgebraucht wurde.',
        causa: 'Nichtbeachtung der P.O. 7.4 durch die Betreiber von IBR-Anlagen',
        badge: 'Versagen privater Akteure',
      },
      icai: {
        sub: 'Erzeugungssektor',
        thesis: 'Die Zuschaltung von 11 Leitungen (400 kV) zwischen 12:03 und 12:30 Uhr erschöpfte den Blindleistungs-Absorptionsbereich. Der Tap-Lag-Effekt verbarg die Überspannung in Kollektoren vor dem SCADA der REE, was den Zusammenbruch unvermeidlich machte.',
        causa: 'Vermaschungsmanöver + SCADA-Inobservabilität (Tap-Lag-Effekt)',
        badge: 'Betriebliche Entscheidung des TSO',
      }
    },
    consenso: [
      'Physischer Mechanismus: Kapazitive Spannungsinstabilität, kein Trägheitsdefizit oder Frequenzabfall.',
      'Randbedingung: 82 % IBR-Erzeugung mit kritisch niedrigem SCR in der südlichen iberischen Zone.',
      'Ungenügender Regulierungsrahmen: Die am 28-A geltenden P.O. 7.4 und NC RfG sahen kein IBR-dominiertes Netz vor.',
    ]
  },
  'zh-Hans': {
    title: '针对 28-A 事件的三种调查叙事',
    subtitle: '三大核心机构的核心叙事、根本原因认定及责任划分对比',
    causaRaiz: '根本原因',
    consensoTitle: '三大机构达成一致的技术共识点',
    figCaptionTitle: '图 A2.',
    figCaptionText: '围绕伊比利亚4月28日停电事故的三种主要官方和行业报告立场。',
    figCaptionAuthor: '根据官方报告、行业声明和技术事实对比自主编制。',
    entities: {
      entsoe: {
        sub: '欧洲组织视角',
        thesis: '系统运行于当时的法律框架之内。然而，在以逆变器电源为主导且缺乏强制构网控制（Grid-Forming）的新电网常态下，旧有的法规框架已显得落后和不足。',
        causa: '欧洲网络规范 NC RfG 及电压控制机制存在结构性缺失',
        badge: '欧洲法规标准失效',
      },
      gov: {
        sub: '政府/系统运营商叙事',
        thesis: '在电压波动期间，新能源（IBR）电站未能按照 P.O. 7.4 的要求吸收系统过剩的容性无功功率，耗尽了南部局部电网原本充裕的动态调节裕度。',
        causa: '新能源发电商违反 P.O. 7.4 调度指令',
        badge: '私营运营主体责任',
      },
      icai: {
        sub: '发电行业/学界立场',
        thesis: '运营商在 12:03 至 12:30 期间回切 11 条 400 kV 联络线导致容性无功剧增。同时有载调压机械响应延迟（Tap-Lag）使运营商 SCADA 产生监控盲区，最终导致雪崩。',
        causa: '电网回切合环操作 + 有载调压响应滞后导致 SCADA 监视盲区',
        badge: '系统运营商 TSO 调度决策不当',
      }
    },
    consenso: [
      '停电物理机制：为电网高电压容性失稳，而非由于转动惯量缺失或系统频率崩溃导致。',
      '电网工况边界：非同步新能源发电比达 82%，且伊比利亚南部 SCR 处于极低水平。',
      '历史法规局限：事故发生时的 P.O. 7.4 和 NC RfG 政策没有针对纯逆变器主导电网的防御设计。',
    ]
  }
};

export default function NarrativasInstitucionales() {
  const { colorMode } = useColorMode();
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;
  const p = PALETTE[colorMode === 'dark' ? 'dark' : 'light'];

  return (
    <figure style={{ margin:'1.5rem 0' }}>
      <div style={{ background:p.bg, border:`0.5px solid ${p.border}`, borderRadius:10, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`0.5px solid ${p.divider}` }}>
        <p style={{ margin:0, fontSize:15, fontWeight:500, color:p.text }}>
          {t.title}
        </p>
        <p style={{ margin:'3px 0 0', fontSize:12, color:p.muted }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ padding:20 }}>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          {ENTITIES_STATIC.map(e => {
            const col = p[e.id];
            const data = t.entities[e.id] || TRANSLATIONS.es.entities[e.id];
            return (
              <div key={e.id} style={{ flex:1, background:col.bg, border:`0.5px solid ${col.brd}`, borderTop:`3px solid ${col.accent}`, borderRadius:7, padding:14 }}>
                <div style={{ fontSize:13, fontWeight:500, color:col.txt, marginBottom:2 }}>{e.acronym}</div>
                <div style={{ fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', color:p.muted, marginBottom:10 }}>{data.sub}</div>
                <p style={{ margin:'0 0 10px', fontSize:12, color:p.text, lineHeight:1.65, borderLeft:`2px solid ${col.brd}`, paddingLeft:9 }}>
                  {data.thesis}
                </p>
                <div style={{ fontSize:9, letterSpacing:'.10em', textTransform:'uppercase', color:p.muted, marginBottom:3 }}>{t.causaRaiz}</div>
                <div style={{ fontSize:11.5, fontWeight:500, color:col.txt, marginBottom:9 }}>{data.causa}</div>
                <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:3, background:col.accent, color:'#fff', fontSize:10, fontWeight:500 }}>
                  {data.badge}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ background:p.conBg, border:`0.5px solid ${p.conBrd}`, borderRadius:7, padding:'13px 16px' }}>
          <div style={{ fontSize:10, fontWeight:500, letterSpacing:'.10em', textTransform:'uppercase', color:p.muted, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:p.ibr, display:'inline-block', flexShrink:0 }} />
            {t.consensoTitle}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {t.consenso.map((c, i) => (
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
        <strong>{t.figCaptionTitle}</strong> {t.figCaptionText}<br/>
        <em>{t.figCaptionAuthor}</em>
      </figcaption>
    </figure>
  );
}
