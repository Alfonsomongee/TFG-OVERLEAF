/**
 * HomeNarrativeMatrix.jsx
 *
 * Mapa de controversias — posición 5 de la homepage.
 * Matriz 4 actores × 3 ejes que muestra que el TFG compara
 * posiciones periciales, no construye un relato único.
 *
 * Diseño: tabla ligera con mucho aire. Sin borde pesado.
 * Chip de alineación por celda: ↑ acuerdo, ↕ debate, ↓ discrepancia.
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
    heading: 'Cuatro informes. Tres disputas.',
    sub: 'Los informes periciales coinciden en los hechos pero divergen en el peso causal, el papel de la inercia y las medidas regulatorias necesarias.',
    axes: ['Causa raíz', 'Papel de la inercia', 'Medidas propuestas'],
    actors: [
      {
        id: 'gobierno',
        name: 'Gobierno / Comité',
        positions: [
          { text: 'Cascada de protecciones sobre baja fortaleza síncrona', align: 'agree' },
          { text: 'Factor agravante, no causa primaria', align: 'debate' },
          { text: 'Servicios de inercia sintética obligatorios', align: 'agree' },
        ],
      },
      {
        id: 'iit',
        name: 'IIT-ICAI / Sector',
        positions: [
          { text: 'Decisiones operativas del TSO sobre despacho de generación síncrona', align: 'disagree' },
          { text: 'Causa directa del colapso', align: 'disagree' },
          { text: 'Responsabilidad operativa del TSO', align: 'disagree' },
        ],
      },
      {
        id: 'entsoe',
        name: 'ENTSO-E',
        positions: [
          { text: 'Inestabilidad de tensión por baja potencia de cortocircuito', align: 'agree' },
          { text: 'Determinante en la velocidad de propagación', align: 'agree' },
          { text: 'Revisión de ajustes de protección de inversores IBR', align: 'agree' },
        ],
      },
      {
        id: 'nrel',
        name: 'NREL / MIT / Brattle',
        positions: [
          { text: 'Primer colapso sistémico IBR por sobretensión, no subfrecuencia', align: 'agree' },
          { text: 'Insuficiente, pero necesario redefinir su medición', align: 'debate' },
          { text: 'Mercados de resiliencia dinámica y GFM obligatorios', align: 'agree' },
        ],
      },
    ],
    alignLabels: {
      agree: 'Acuerdo',
      debate: 'Debate',
      disagree: 'Discrepancia',
    },
    cta: 'Análisis completo en el Capítulo 5 →',
    ctaHref: '/analisis-informes',
    note: 'Fuentes: Comité de Análisis del Gobierno (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025), NREL / arXiv 2511.17433 (2025).',
  },
  en: {
    eyebrow: 'Controversy map',
    heading: 'Four reports. Three disputes.',
    sub: 'Expert reports agree on the facts but diverge on causal weight, the role of inertia, and the necessary regulatory measures.',
    axes: ['Root cause', 'Role of inertia', 'Proposed measures'],
    actors: [
      {
        id: 'gobierno',
        name: 'Government / Committee',
        positions: [
          { text: 'Protection cascade over low synchronous strength', align: 'agree' },
          { text: 'Aggravating factor, not primary cause', align: 'debate' },
          { text: 'Mandatory synthetic inertia services', align: 'agree' },
        ],
      },
      {
        id: 'iit',
        name: 'IIT-ICAI / Industry',
        positions: [
          { text: 'TSO dispatch decisions on synchronous generation commitment', align: 'disagree' },
          { text: 'Direct cause of the collapse', align: 'disagree' },
          { text: 'TSO operational liability', align: 'disagree' },
        ],
      },
      {
        id: 'entsoe',
        name: 'ENTSO-E',
        positions: [
          { text: 'Voltage instability due to low short-circuit power', align: 'agree' },
          { text: 'Determinant in propagation speed', align: 'agree' },
          { text: 'Revision of IBR inverter protection settings', align: 'agree' },
        ],
      },
      {
        id: 'nrel',
        name: 'NREL / MIT / Brattle',
        positions: [
          { text: 'First systemic IBR collapse by overvoltage, not underfrequency', align: 'agree' },
          { text: 'Insufficient, but its measurement must be redefined', align: 'debate' },
          { text: 'Dynamic resilience markets and mandatory GFM', align: 'agree' },
        ],
      },
    ],
    alignLabels: {
      agree: 'Agreement',
      debate: 'Debate',
      disagree: 'Dispute',
    },
    cta: 'Full analysis in Chapter 5 →',
    ctaHref: '/analisis-informes',
    note: 'Sources: Government Analysis Committee (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025), NREL / arXiv 2511.17433 (2025).',
  },
  de: {
    eyebrow: 'Kontroversenkarte',
    heading: 'Vier Berichte. Drei Streitpunkte.',
    sub: 'Die Gutachten stimmen in den Fakten überein, weichen jedoch bei der Kausalgewichtung, der Rolle der Trägheit und den erforderlichen Regulierungsmaßnahmen ab.',
    axes: ['Hauptursache', 'Rolle der Trägheit', 'Vorgeschlagene Maßnahmen'],
    actors: [
      {
        id: 'gobierno',
        name: 'Regierung / Ausschuss',
        positions: [
          { text: 'Schutzkaskade über geringe Synchronstärke', align: 'agree' },
          { text: 'Erschwerender Faktor, keine Primärursache', align: 'debate' },
          { text: 'Obligatorische synthetische Trägheitsdienste', align: 'agree' },
        ],
      },
      {
        id: 'iit',
        name: 'IIT-ICAI / Sektor',
        positions: [
          { text: 'Einsatzentscheidungen des ÜNB zur Synchrongeneratorverfügbarkeit', align: 'disagree' },
          { text: 'Unmittelbare Ursache des Zusammenbruchs', align: 'disagree' },
          { text: 'Betriebliche Haftung des ÜNB', align: 'disagree' },
        ],
      },
      {
        id: 'entsoe',
        name: 'ENTSO-E',
        positions: [
          { text: 'Spannungsinstabilität durch geringe Kurzschlussleistung', align: 'agree' },
          { text: 'Bestimmend für die Ausbreitungsgeschwindigkeit', align: 'agree' },
          { text: 'Überprüfung der Schutzeinstellungen von IBR-Wechselrichtern', align: 'agree' },
        ],
      },
      {
        id: 'nrel',
        name: 'NREL / MIT / Brattle',
        positions: [
          { text: 'Erster systemischer IBR-Kollaps durch Überspannung, nicht Unterfrequenz', align: 'agree' },
          { text: 'Unzureichend, aber Messung muss neu definiert werden', align: 'debate' },
          { text: 'Märkte für dynamische Resilienz und obligatorisches GFM', align: 'agree' },
        ],
      },
    ],
    alignLabels: {
      agree: 'Einigkeit',
      debate: 'Debatte',
      disagree: 'Disput',
    },
    cta: 'Vollständige Analyse in Kapitel 5 →',
    ctaHref: '/analisis-informes',
    note: 'Quellen: Regierungsanalysausschuss (2025), IIT-ICAI / Compass Lexecon (2025), ENTSO-E Factual Report (2025), NREL / arXiv 2511.17433 (2025).',
  },
  'zh-Hans': {
    eyebrow: '争议观点图谱',
    heading: '四份报告。三个分歧。',
    sub: '各方专家报告在事实上基本一致，但在因果权重、惯量作用以及所需监管措施方面存在明显分歧。',
    axes: ['根本原因', '惯量的作用', '建议措施'],
    actors: [
      {
        id: 'gobierno',
        name: '政府 / 分析委员会',
        positions: [
          { text: '在低同步强度背景下发生的保护级联动作', align: 'agree' },
          { text: '加剧因素，非主要原因', align: 'debate' },
          { text: '强制推行合成惯量服务', align: 'agree' },
        ],
      },
      {
        id: 'iit',
        name: 'IIT-ICAI / 行业方',
        positions: [
          { text: '输电系统运营商关于同步发电机组调度的运行决策', align: 'disagree' },
          { text: '停电的直接原因', align: 'disagree' },
          { text: '输电系统运营商的运行责任', align: 'disagree' },
        ],
      },
      {
        id: 'entsoe',
        name: 'ENTSO-E',
        positions: [
          { text: '短路容量不足导致的电压失稳', align: 'agree' },
          { text: '决定事故传播速度的关键因素', align: 'agree' },
          { text: '修订逆变器保护整定值', align: 'agree' },
        ],
      },
      {
        id: 'nrel',
        name: 'NREL / MIT / Brattle',
        positions: [
          { text: '首次因过电压（而非低频）引发的系统性IBR崩溃', align: 'agree' },
          { text: '不充分，但需要重新定义其测量方法', align: 'debate' },
          { text: '动态韧性市场与强制构网型逆变器部署', align: 'agree' },
        ],
      },
    ],
    alignLabels: {
      agree: '共识',
      debate: '争议',
      disagree: '分歧',
    },
    cta: '第5章完整分析 →',
    ctaHref: '/analisis-informes',
    note: '来源：西班牙政府分析委员会（2025）、IIT-ICAI / Compass Lexecon（2025）、ENTSO-E事实报告（2025）、NREL / arXiv 2511.17433（2025）。',
  },
};

const ALIGN_ICONS = {
  agree:    '↑',
  debate:   '↕',
  disagree: '↓',
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

        {/* Matriz */}
        <AnimatedContent distance={24} duration={600} delay={100} threshold={0.1}>
          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label={t.heading}>
              <thead>
                <tr>
                  <th className={styles.thActor} scope="col" />
                  {t.axes.map((axis) => (
                    <th key={axis} className={styles.thAxis} scope="col">
                      {axis}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.actors.map((actor) => (
                  <tr key={actor.id} className={styles.row}>
                    <td className={styles.tdActor} scope="row">
                      {actor.name}
                    </td>
                    {actor.positions.map((pos, i) => (
                      <td key={i} className={styles.tdCell}>
                        <span
                          className={`${styles.alignChip} ${styles[`alignChip--${pos.align}`]}`}
                          title={t.alignLabels[pos.align]}
                          aria-label={t.alignLabels[pos.align]}
                        >
                          {ALIGN_ICONS[pos.align]}
                        </span>
                        <span className={styles.cellText}>{pos.text}</span>
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
