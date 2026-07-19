/**
 * HomeNarrativeMatrix.jsx
 *
 * Mapa de controversias — posición 5 de la homepage.
 * Matriz 5 ejes de disputa × 3 narrativas institucionales.
 * Muestra que el TFG compara posiciones periciales,
 * no construye un relato único.
 *
 * Diseño: tabla ligera con mucho aire. Sin borde pesado.
 * CTA al pie hacia capítulo 5 y conclusiones.
 */

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeNarrativeMatrix.module.css';
import AnimatedContent from '@site/src/components/ReactBits/AnimatedContent';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Mapa de controversias',
    heading: 'Tres narrativas. Cinco disputas.',
    sub: 'Los informes periciales parten de accesos distintos a los datos y coinciden en la física del evento, pero divergen en cinco ejes: el origen de la saturación capacitiva, el mecanismo de la primera oscilación, la legitimidad de los disparos IBR, el despacho de la zona sur y la imputación de responsabilidad.',
    narratives: ['Gobierno / REE', 'IIT-ICAI / AELEC', 'ENTSO-E'],
    axes: [
      {
        id: 'saturation',
        label: 'Origen saturación capacitiva',
        positions: [
          'Generadores no absorbieron la Q requerida',
          'Mallado inyectó hasta 2,4 GVAr (Ferranti) → causa raíz',
          'Restricción regulatoria IBR',
        ],
      },
      {
        id: 'oscillation',
        label: 'Mecanismo oscilación 0,6 Hz',
        positions: [
          'Forzada por PV, bajo SCR local',
          'Modo inter-área amplificado · PSS ausentes',
          'Requiere análisis adicional · no asigna causa única',
        ],
      },
      {
        id: 'ibr-trips',
        label: 'Legitimidad disparos IBR',
        positions: [
          '«Inadecuados» (417,9 kV en 400 kV, en rango)',
          'No se pronuncia sobre el disparo de Granada',
          '242 kV en 220 kV · ajuste sin retardo, no revisado por el TSO',
        ],
      },
      {
        id: 'dispatch',
        label: 'Despacho zona sur',
        positions: [
          'Justificado por niveles de tensión',
          '0,2 GVAr absorción vs >0,7 GVAr inyección → insalvable',
          'Baja Ssc en Andalucía · factor estructural',
        ],
      },
      {
        id: 'responsibility',
        label: 'Responsabilidad principal',
        positions: [
          'Generadores (P.O. 7.4)',
          'Operador del sistema',
          'Marco regulatorio europeo',
        ],
      },
    ],
    cta: 'Análisis completo en el Capítulo 5 →',
    ctaHref: '/analisis-informes',
    note: 'Fuentes: Comité de Análisis del Gobierno (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025). Contraste académico: NREL, MIT CEEPR.',
  },
  en: {
    eyebrow: 'Controversy map',
    heading: 'Three narratives. Five disputes.',
    sub: 'The expert reports draw on different data access and agree on the physics of the event, but diverge on five axes: the origin of capacitive saturation, the mechanism of the first oscillation, the legitimacy of IBR trips, southern zone dispatch, and the attribution of responsibility.',
    narratives: ['Government / REE', 'IIT-ICAI / AELEC', 'ENTSO-E'],
    axes: [
      {
        id: 'saturation',
        label: 'Capacitive saturation origin',
        positions: [
          'Generators did not absorb the required Q',
          'Grid injected up to 2.4 GVAr (Ferranti) → root cause',
          'IBR regulatory restriction',
        ],
      },
      {
        id: 'oscillation',
        label: '0.6 Hz oscillation mechanism',
        positions: [
          'Forced by PV, low local SCR',
          'Inter-area mode amplified · PSS absent',
          'Requires further analysis · no single cause assigned',
        ],
      },
      {
        id: 'ibr-trips',
        label: 'Legitimacy of IBR trips',
        positions: [
          '"Inadequate" (417.9 kV on 400 kV, within range)',
          'Does not comment on the Granada trip',
          '242 kV on 220 kV · setting without delay, not reviewed by TSO',
        ],
      },
      {
        id: 'dispatch',
        label: 'Southern zone dispatch',
        positions: [
          'Justified by voltage levels',
          '0.2 GVAr absorption vs >0.7 GVAr injection → unsalvageable',
          'Low Ssc in Andalusia · structural factor',
        ],
      },
      {
        id: 'responsibility',
        label: 'Primary responsibility',
        positions: [
          'Generators (P.O. 7.4)',
          'System operator',
          'European regulatory framework',
        ],
      },
    ],
    cta: 'Full analysis in Chapter 5 →',
    ctaHref: '/analisis-informes',
    note: 'Sources: Government Analysis Committee (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025). Academic contrast: NREL, MIT CEEPR.',
  },
  de: {
    eyebrow: 'Kontroversenkarte',
    heading: 'Drei Narrative. Fünf Streitpunkte.',
    sub: 'Die Gutachten stützen sich auf unterschiedliche Datenzugänge und stimmen in der Physik des Ereignisses überein, weichen jedoch in fünf Achsen ab: dem Ursprung der kapazitiven Sättigung, dem Mechanismus der ersten Oszillation, der Legitimität der IBR-Auslösungen, dem Dispatch der Südzone und der Verantwortungszuweisung.',
    narratives: ['Regierung / REE', 'IIT-ICAI / AELEC', 'ENTSO-E'],
    axes: [
      {
        id: 'saturation',
        label: 'Ursprung kapazitive Sättigung',
        positions: [
          'Generatoren absorbierten die erforderliche Q nicht',
          'Netz injizierte bis 2,4 GVAr (Ferranti) → Hauptursache',
          'Regulatorische Einschränkung für IBR',
        ],
      },
      {
        id: 'oscillation',
        label: 'Mechanismus 0,6-Hz-Oszillation',
        positions: [
          'Durch PV erzwungen, niedriger lokaler SCR',
          'Inter-Area-Modus verstärkt · PSS fehlend',
          'Erfordert weitere Analyse · keine einzelne Ursache zugewiesen',
        ],
      },
      {
        id: 'ibr-trips',
        label: 'Legitimität der IBR-Auslösungen',
        positions: [
          '„Unangemessen" (417,9 kV bei 400 kV, im Bereich)',
          'Keine Stellungnahme zur Granada-Auslösung',
          '242 kV bei 220 kV · Einstellung ohne Verzögerung, nicht vom ÜNB geprüft',
        ],
      },
      {
        id: 'dispatch',
        label: 'Dispatch Südzone',
        positions: [
          'Durch Spannungsniveaus gerechtfertigt',
          '0,2 GVAr Absorption vs. >0,7 GVAr Einspeisung → nicht zu retten',
          'Niedrige Ssc in Andalusien · struktureller Faktor',
        ],
      },
      {
        id: 'responsibility',
        label: 'Hauptverantwortung',
        positions: [
          'Erzeuger (P.O. 7.4)',
          'Systemoperator',
          'Europäischer Regulierungsrahmen',
        ],
      },
    ],
    cta: 'Vollständige Analyse in Kapitel 5 →',
    ctaHref: '/analisis-informes',
    note: 'Quellen: Regierungsanalysausschuss (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025). Akademischer Kontrast: NREL, MIT CEEPR.',
  },
  'zh-Hans': {
    eyebrow: '争议观点图谱',
    heading: '三种叙事。五项争议。',
    sub: '各方专家报告基于不同的数据访问权限，在事件物理机制上基本一致，但在五个维度上存在分歧：容性饱和的成因、首次振荡的机制、IBR跳闸的合理性、南部区域调度以及责任归属。',
    narratives: ['政府 / REE', 'IIT-ICAI / AELEC', 'ENTSO-E'],
    axes: [
      {
        id: 'saturation',
        label: '容性饱和成因',
        positions: [
          '发电机组未吸收所需无功',
          '电网注入高达2.4 GVAr（费兰蒂效应）→ 根本原因',
          'IBR监管限制',
        ],
      },
      {
        id: 'oscillation',
        label: '0.6 Hz振荡机制',
        positions: [
          '由光伏驱动，当地SCR较低',
          '区间模式放大 · PSS缺失',
          '需进一步分析 · 未归因于单一原因',
        ],
      },
      {
        id: 'ibr-trips',
        label: 'IBR跳闸合理性',
        positions: [
          '"不当"（400 kV系统417.9 kV，在范围内）',
          '未就格拉纳达跳闸发表意见',
          '220 kV系统242 kV · 无延时整定，未经TSO审核',
        ],
      },
      {
        id: 'dispatch',
        label: '南部区域调度',
        positions: [
          '以电压水平为依据',
          '0.2 GVAr吸收 vs >0.7 GVAr注入 → 无法挽救',
          '安达卢西亚短路容量低 · 结构性因素',
        ],
      },
      {
        id: 'responsibility',
        label: '主要责任',
        positions: [
          '发电企业（P.O. 7.4）',
          '系统运营商',
          '欧洲监管框架',
        ],
      },
    ],
    cta: '第5章完整分析 →',
    ctaHref: '/analisis-informes',
    note: '来源：西班牙政府分析委员会（2025）、IIT-ICAI / Compass Lexecon（2025）、ENTSO-E事实报告（2025）。学术对照：NREL、MIT CEEPR。',
  },
};

export default function HomeNarrativeMatrix() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  const getLocalizedUrl = (url) => {
    const prefix = currentLocale === 'es' ? '' : `/${currentLocale}`;
    const path = `${prefix}${url}`.replace(/\/+/g, '/');
    return useBaseUrl(path);
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Cabecera */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h2 className={styles.heading}>{t.heading}</h2>
          <p className={styles.sub}>{t.sub}</p>
        </div>

        {/* Matriz: ejes (filas) × narrativas (columnas) */}
        <AnimatedContent distance={24} duration={600} delay={100} threshold={0.1}>
          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label={t.heading}>
              <thead>
                <tr>
                  <th className={styles.thActor} scope="col" />
                  {t.narratives.map((narrative) => (
                    <th key={narrative} className={styles.thAxis} scope="col">
                      {narrative}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.axes.map((axis) => (
                  <tr key={axis.id} className={styles.row}>
                    <td className={styles.tdActor} scope="row">
                      {axis.label}
                    </td>
                    {axis.positions.map((pos, i) => (
                      <td key={i} className={styles.tdCell}>
                        <span className={styles.cellText}>{pos}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedContent>

        {/* Pie: CTA + nota de fuentes */}
        <div className={styles.footer}>
          <a href={getLocalizedUrl(t.ctaHref)} className={styles.cta}>
            {t.cta}
          </a>
          <p className={styles.note}>{t.note}</p>
        </div>

      </div>
    </section>
  );
}
