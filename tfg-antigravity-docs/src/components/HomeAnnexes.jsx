import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeAnnexes.module.css';
import ScrollFloat from './ScrollFloat';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Sistema de evidencias',
    heading: 'Diez anexos',
    sub: '170 elementos documentales — figuras, tablas, series e interactivos — organizados por dominio técnico.',
    annexes: [
      { num: 'I', title: 'Demanda y balance', slug: '/anexo-demanda-generacion-balance', desc: 'Mix generación, previsiones, capacidad' },
      { num: 'II', title: 'Estabilidad dinámica', slug: '/anexo-estabilidad-dinamica-tension', desc: 'Tensión, frecuencia, inercia, PMU' },
      { num: 'III', title: 'Protecciones y cascada', slug: '/anexo-cascada-protecciones-desconexiones', desc: 'Tap-Lag, ANSI 59, deslastre UFLS' },
      { num: 'IV', title: 'Interconexiones', slug: '/anexo-interconexiones-flujos', desc: 'Flujos transfronterizos, HVDC, Francia' },
      { num: 'V', title: 'Mercado eléctrico', slug: '/anexo-mercado-costes', desc: 'Precios SPOT, desvíos, ERS' },
      { num: 'VI', title: 'Reposición', slug: '/anexo-reposicion-blackstart', desc: 'Black Start, islas, demanda restituida' },
      { num: 'VII', title: 'Impacto socioeconómico', slug: '/anexo-impacto-resiliencia', desc: 'VoLL, costes, comparativa histórica' },
      { num: 'VIII', title: 'Comunicación', slug: '/anexo-comunicacion-fuentes', desc: 'Prensa, relato público, consenso pericial' },
      { num: 'IX', title: 'Metodología', slug: '/anexo-metodologia-modelos-datos-vivos', desc: 'Fuentes, contraste pericial, modelos' },
      { num: 'X', title: 'Ecuaciones y simuladores', slug: '/anexo-ecuaciones-matematicas', desc: '28 simuladores interactivos' },
    ]
  },
  en: {
    eyebrow: 'Evidence system',
    heading: 'Ten annexes',
    sub: '170 documentary elements — figures, tables, series, and interactives — organized by technical domain.',
    annexes: [
      { num: 'I', title: 'Demand and balance', slug: '/anexo-demanda-generacion-balance', desc: 'Generation mix, forecasts, capacity' },
      { num: 'II', title: 'Dynamic stability', slug: '/anexo-estabilidad-dinamica-tension', desc: 'Voltage, frequency, inertia, PMU' },
      { num: 'III', title: 'Protections and cascade', slug: '/anexo-cascada-protecciones-desconexiones', desc: 'Tap-Lag, ANSI 59, UFLS shedding' },
      { num: 'IV', title: 'Interconnections', slug: '/anexo-interconexiones-flujos', desc: 'Cross-border flows, HVDC, France' },
      { num: 'V', title: 'Electricity market', slug: '/anexo-mercado-costes', desc: 'SPOT prices, deviations, ERS' },
      { num: 'VI', title: 'Restoration', slug: '/anexo-reposicion-blackstart', desc: 'Black Start, islands, restored demand' },
      { num: 'VII', title: 'Socioeconomic impact', slug: '/anexo-impacto-resiliencia', desc: 'VoLL, costs, historical comparison' },
      { num: 'VIII', title: 'Communication', slug: '/anexo-comunicacion-fuentes', desc: 'Press, public narrative, expert consensus' },
      { num: 'IX', title: 'Methodology', slug: '/anexo-metodologia-modelos-datos-vivos', desc: 'Sources, expert comparison, models' },
      { num: 'X', title: 'Equations and simulators', slug: '/anexo-ecuaciones-matematicas', desc: '28 interactive simulators' },
    ]
  },
  de: {
    eyebrow: 'Nachweissystem',
    heading: 'Zehn Anhänge',
    sub: '170 dokumentarische Elemente — Abbildungen, Tabellen, Reihen und interaktive Inhalte — geordnet nach Fachgebiet.',
    annexes: [
      { num: 'I', title: 'Nachfrage und Bilanz', slug: '/anexo-demanda-generacion-balance', desc: 'Erzeugungsmix, Prognosen, Kapazität' },
      { num: 'II', title: 'Dynamische Stabilität', slug: '/anexo-estabilidad-dinamica-tension', desc: 'Spannung, Frequenz, Trägheit, PMU' },
      { num: 'III', title: 'Schutzsysteme und Kaskade', slug: '/anexo-cascada-protecciones-desconexiones', desc: 'Tap-Lag, ANSI 59, UFLS-Lastabwurf' },
      { num: 'IV', title: 'Netzkuppelstellen', slug: '/anexo-interconexiones-flujos', desc: 'Grenzüberschreitende Flüsse, HGÜ, Frankreich' },
      { num: 'V', title: 'Strommarkt', slug: '/anexo-mercado-costes', desc: 'SPOT-Preise, Abweichungen, ERS' },
      { num: 'VI', title: 'Wiederversorgung', slug: '/anexo-reposicion-blackstart', desc: 'Black Start, Inselnetzbetrieb, wiederversorgte Last' },
      { num: 'VII', title: 'Sozioökonomische Folgen', slug: '/anexo-impacto-resiliencia', desc: 'VoLL, Kosten, historischer Vergleich' },
      { num: 'VIII', title: 'Kommunikation', slug: '/anexo-comunicacion-fuentes', desc: 'Presse, öffentliche Wahrnehmung, Gutachterkonsens' },
      { num: 'IX', title: 'Methodik', slug: '/anexo-metodologia-modelos-datos-vivos', desc: 'Quellen, Gutachtervergleich, Modelle' },
      { num: 'X', title: 'Gleichungen und Simulatoren', slug: '/anexo-ecuaciones-matematicas', desc: '28 interaktive Simulatoren' },
    ]
  },
  'zh-Hans': {
    eyebrow: '证据体系',
    heading: '十个附录',
    sub: '170项实证要素——包括图表、数据表、时间序列和交互模块——按工程技术领域组织。',
    annexes: [
      { num: 'I', title: '负荷需求与电力平衡', slug: '/anexo-demanda-generacion-balance', desc: '发电结构、负荷预测、系统容量' },
      { num: 'II', title: '动态稳定性', slug: '/anexo-estabilidad-dinamica-tension', desc: '电压、频率、转动惯量、相量测量单元' },
      { num: 'III', title: '继电保护与级联跳闸', slug: '/anexo-cascada-protecciones-desconexiones', desc: '有载调压延迟、ANSI 59、低频减载' },
      { num: 'IV', title: '联络线输电', slug: '/anexo-interconexiones-flujos', desc: '跨国联络潮流、高压直流、与法国通道' },
      { num: 'V', title: '电力市场', slug: '/anexo-mercado-costes', desc: '现货价格、偏差考核、辅助服务' },
      { num: 'VI', title: '电网黑启动与重建', slug: '/anexo-reposicion-blackstart', desc: '黑启动、孤网运行、负荷恢复进度' },
      { num: 'VII', title: '社会经济影响', slug: '/anexo-impacto-resiliencia', desc: '缺供电能价值、事故损失估算、历史对比' },
      { num: 'VIII', title: '公众沟通与舆情', slug: '/anexo-comunicacion-fuentes', desc: '新闻舆论、官方叙事、专家共识对比' },
      { num: 'IX', title: '研究方法', slug: '/anexo-metodologia-modelos-datos-vivos', desc: '数据来源、报告对比分析、系统模型' },
      { num: 'X', title: '数学方程与模拟器', slug: '/anexo-ecuaciones-matematicas', desc: '28个互动式物理模拟器' },
    ]
  }
};

export default function HomeAnnexes() {
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
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <ScrollFloat tag="h2" className={styles.heading}>{t.heading}</ScrollFloat>
          <p className={styles.sub}>{t.sub}</p>
        </div>
        <div className={styles.grid}>
          {t.annexes.map((a) => (
            <a
              key={a.num}
              href={getLocalizedUrl(a.slug)}
              className={styles.card}
              onClick={handleLinkClick}
            >
              <span className={styles.cardNum}>{a.num}</span>
              <span className={styles.cardTitle}>{a.title}</span>
              <span className={styles.cardDesc}>{a.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
