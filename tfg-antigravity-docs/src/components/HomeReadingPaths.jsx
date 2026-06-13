import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeReadingPaths.module.css';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Tres formas de recorrer la investigación',
    paths: [
      {
        id: '01',
        label: 'Ruta rápida',
        time: '10–15 min',
        description: 'Los hechos esenciales, la causa raíz y el coste del colapso sin entrar en detalle técnico.',
        links: [
          { to: '/resumen-de-cifras', text: 'Resumen de cifras' },
          { to: '/analisis-incidente', text: 'Análisis del incidente' },
          { to: '/07b-consecuencias-financieras', text: 'Consecuencias financieras' },
        ],
      },
      {
        id: '02',
        label: 'Ruta técnica',
        time: '45–60 min',
        description: 'La secuencia eléctrica completa: condición previa, mecanismos de colapso, protecciones, interconexiones y reposición.',
        links: [
          { to: '/contexto', text: 'Contexto técnico' },
          { to: '/analisis-incidente', text: 'Análisis del incidente' },
          { to: '/analisis-informes', text: 'Contraste de informes' },
          { to: '/resiliencia-futuro', text: 'Resiliencia y futuro' },
        ],
      },
      {
        id: '03',
        label: 'Ruta documental',
        time: 'A demanda',
        description: 'Consulta directa de evidencias, datos, modelos y figuras organizadas por tema en los diez anexos.',
        links: [
          { to: '/anexo-indice-conceptual', text: 'Índice conceptual' },
          { to: '/glosario', text: 'Glosario técnico' },
          { to: '/anexo-metodologia-modelos-datos-vivos', text: 'Metodología y fuentes' },
        ],
      },
    ]
  },
  en: {
    eyebrow: 'Three ways to navigate the investigation',
    paths: [
      {
        id: '01',
        label: 'Quick path',
        time: '10–15 min',
        description: 'The essential facts, the root cause, and the cost of the collapse without going into technical details.',
        links: [
          { to: '/resumen-de-cifras', text: 'Summary of figures' },
          { to: '/analisis-incidente', text: 'Incident analysis' },
          { to: '/07b-consecuencias-financieras', text: 'Financial consequences' },
        ],
      },
      {
        id: '02',
        label: 'Technical path',
        time: '45–60 min',
        description: 'The complete electrical sequence: pre-condition, collapse mechanisms, protections, interconnections, and restoration.',
        links: [
          { to: '/contexto', text: 'Technical context' },
          { to: '/analisis-incidente', text: 'Incident analysis' },
          { to: '/analisis-informes', text: 'Reports comparison' },
          { to: '/resiliencia-futuro', text: 'Resilience and future' },
        ],
      },
      {
        id: '03',
        label: 'Documentary path',
        time: 'On demand',
        description: 'Direct query of evidence, data, models, and figures organized by topic in the ten annexes.',
        links: [
          { to: '/anexo-indice-conceptual', text: 'Conceptual index' },
          { to: '/glosario', text: 'Technical glossary' },
          { to: '/anexo-metodologia-modelos-datos-vivos', text: 'Methodology and sources' },
        ],
      },
    ]
  },
  de: {
    eyebrow: 'Drei Wege zur Erkundung der Untersuchung',
    paths: [
      {
        id: '01',
        label: 'Schnellkurs',
        time: '10–15 Min.',
        description: 'Die wesentlichen Fakten, die Hauptursache und die Kosten des Zusammenbruchs ohne technische Details.',
        links: [
          { to: '/resumen-de-cifras', text: 'Zahlen im Überblick' },
          { to: '/analisis-incidente', text: 'Analyse des Vorfalls' },
          { to: '/07b-consecuencias-financieras', text: 'Finanzielle Folgen' },
        ],
      },
      {
        id: '02',
        label: 'Technische Route',
        time: '45–60 Min.',
        description: 'Der vollständige elektrische Ablauf: Vorbedingung, Kollapsmechanismen, Schutzsysteme, Netzkuppelstellen und Wiederversorgung.',
        links: [
          { to: '/contexto', text: 'Technischer Kontext' },
          { to: '/analisis-incidente', text: 'Analyse des Vorfalls' },
          { to: '/analisis-informes', text: 'Berichtvergleich' },
          { to: '/resiliencia-futuro', text: 'Resilienz und Zukunft' },
        ],
      },
      {
        id: '03',
        label: 'Dokumentarische Route',
        time: 'Nach Bedarf',
        description: 'Direkte Einsicht in Nachweise, Daten, Modelle und Abbildungen, die nach Themen in den zehn Anhängen geordnet sind.',
        links: [
          { to: '/anexo-indice-conceptual', text: 'Begriffliches Verzeichnis' },
          { to: '/glosario', text: 'Technisches Glossar' },
          { to: '/anexo-metodologia-modelos-datos-vivos', text: 'Methodik und Quellen' },
        ],
      },
    ]
  },
  'zh-Hans': {
    eyebrow: '三种浏览本研究的方式',
    paths: [
      {
        id: '01',
        label: '快速通道',
        time: '10–15 分钟',
        description: '基本事实、停电根本原因以及崩溃造成的经济损失，无需深究复杂的工程细节。',
        links: [
          { to: '/resumen-de-cifras', text: '核心数据摘要' },
          { to: '/analisis-incidente', text: '事故过程分析' },
          { to: '/07b-consecuencias-financieras', text: '财务与经济后果' },
        ],
      },
      {
        id: '02',
        label: '专业技术路线',
        time: '45–60 分钟',
        description: '完整的电力故障 & 演变过程：前置运行工况、崩溃物理机制、继电保护动作、跨国联络线以及电网黑启动重建。',
        links: [
          { to: '/contexto', text: '系统技术背景' },
          { to: '/analisis-incidente', text: '事故过程分析' },
          { to: '/analisis-informes', text: '各方报告对比' },
          { to: '/resiliencia-futuro', text: '系统韧性与未来展望' },
        ],
      },
      {
        id: '03',
        label: '文献与证据路线',
        time: '按需检索',
        description: '直接检索和查阅分布在十个附录中、按专业领域组织的工程证据、实时数据、系统模型及图表。',
        links: [
          { to: '/anexo-indice-conceptual', text: '概念索引' },
          { to: '/glosario', text: '技术词汇表' },
          { to: '/anexo-metodologia-modelos-datos-vivos', text: '研究方法与数据源' },
        ],
      },
    ]
  }
};

export default function HomeReadingPaths() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  const getLocalizedUrl = (url) => {
    const prefix = currentLocale === 'es' ? '' : `/${currentLocale}`;
    const path = `${prefix}${url}`.replace(/\/+/g, '/');
    return useBaseUrl(path);
  };

  const handleLinkClick = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zen-mode', 'true');
      } catch (err) {
        console.error('Error setting zen-mode:', err);
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <div className={styles.grid}>
          {t.paths.map((path) => (
            <div key={path.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardId}>{path.id}</span>
                <div>
                  <h3 className={styles.cardLabel}>{path.label}</h3>
                  <span className={styles.cardTime}>{path.time}</span>
                </div>
              </div>
              <p className={styles.cardDesc}>{path.description}</p>
              <ul className={styles.cardLinks}>
                {path.links.map((link) => (
                  <li key={link.to}>
                    <a href={getLocalizedUrl(link.to)} className={styles.cardLink} onClick={handleLinkClick}>
                      {link.text} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
