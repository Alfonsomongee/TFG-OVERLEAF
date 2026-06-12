import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeHero.module.css';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Análisis forense · Apagón ibérico del 28 de abril de 2025',
    titlePrefix: 'El colapso del',
    titleAccent: 'sistema eléctrico',
    titleSuffix: 'peninsular',
    subtitle: 'Reconstrucción técnica, económica y social de la mayor perturbación del área síncrona continental europea en dos décadas. Ciento setenta evidencias, diez anexos, veintiocho simuladores.',
    readIntro: 'Leer la introducción',
    techAnalysis: 'Análisis técnico',
    glossary: 'Glosario técnico',
    ariaLabelChain: 'Cadena causal del colapso',
    chain: [
      {
        label: 'Condición previa',
        time: '12:30 CEST',
        detail: '82% IBR · 11 unidades síncronas · H = 2,3 s',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        label: 'Disparo raíz',
        time: '12:32:56,993 CEST',
        detail: '355 MW — Granada · Tap-Lag · sobretensión invisible',
        href: '/analisis-incidente#fase-1',
      },
      {
        label: 'Cascada IBR',
        time: '12:33:07 CEST',
        detail: '4.500 MW en 11 s · protecciones ANSI 59',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'Separación Francia',
        time: '12:33:21,535 CEST',
        detail: '48,46 Hz · 15.000 MW perdidos',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'Cero de tensión',
        time: '12:33:29,741 CEST',
        detail: '57 millones sin suministro · área ibérica aislada',
        href: '/resumen-de-cifras#cifras-maestras',
      },
    ],
    numbers: [
      { value: '57 M', label: 'personas afectadas' },
      { value: '15.000', label: 'MW perdidos' },
      { value: '33 s', label: 'de colapso total' },
      { value: '18,5 h', label: 'de reposición' },
      { value: '>666 M€', label: 'coste Op. Reforzada' },
    ],
  },
  en: {
    eyebrow: 'Forensic analysis · Iberian blackout of April 28, 2025',
    titlePrefix: 'The collapse of the',
    titleAccent: 'peninsular power system',
    titleSuffix: '',
    subtitle: 'Technical, economic, and social reconstruction of the largest disturbance in the European continental synchronous area in two decades. One hundred and seventy evidences, ten annexes, twenty-eight simulators.',
    readIntro: 'Read the introduction',
    techAnalysis: 'Technical analysis',
    glossary: 'Technical glossary',
    ariaLabelChain: 'Causal chain of the collapse',
    chain: [
      {
        label: 'Prior condition',
        time: '12:30 CEST',
        detail: '82% IBR · 11 synchronous units · H = 2.3 s',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        label: 'Root trip',
        time: '12:32:56.993 CEST',
        detail: '355 MW — Granada · Tap-Lag · invisible overvoltage',
        href: '/analisis-incidente#fase-1',
      },
      {
        label: 'IBR cascade',
        time: '12:33:07 CEST',
        detail: '4,500 MW in 11 s · ANSI 59 protections',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'French separation',
        time: '12:33:21.535 CEST',
        detail: '48.46 Hz · 15,000 MW lost',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'Voltage blackout',
        time: '12:33:29.741 CEST',
        detail: '57 million without supply · Iberian area isolated',
        href: '/resumen-de-cifras#cifras-maestras',
      },
    ],
    numbers: [
      { value: '57 M', label: 'people affected' },
      { value: '15,000', label: 'MW lost' },
      { value: '33 s', label: 'of total collapse' },
      { value: '18.5 h', label: 'of restoration' },
      { value: '>666 M€', label: 'Reinforced Op. cost' },
    ],
  },
  de: {
    eyebrow: 'Forensische Analyse · Iberischer Blackout vom 28. April 2025',
    titlePrefix: 'Der Zusammenbruch des',
    titleAccent: 'halbinsularen Stromsystems',
    titleSuffix: '',
    subtitle: 'Technische, wirtschaftliche und soziale Rekonstruktion der größten Störung im europäischen kontinentalen Synchrongebiet seit zwei Jahrzehnten. Einhundertsiebzig Nachweise, zehn Anhänge, achtundzwanzig Simulatoren.',
    readIntro: 'Einleitung lesen',
    techAnalysis: 'Technische Analyse',
    glossary: 'Technisches Glossar',
    ariaLabelChain: 'Kausalkette des Zusammenbruchs',
    chain: [
      {
        label: 'Vorbedingung',
        time: '12:30 CEST',
        detail: '82% IBR · 11 Synchronmaschinen · H = 2,3 s',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        label: 'Ursprungsauslösung',
        time: '12:32:56,993 CEST',
        detail: '355 MW — Granada · Tap-Lag · unsichtbare Überspannung',
        href: '/analisis-incidente#fase-1',
      },
      {
        label: 'IBR-Kaskade',
        time: '12:33:07 CEST',
        detail: '4.500 MW in 11 s · ANSI 59-Schutz',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'Trennung Frankreich',
        time: '12:33:21,535 CEST',
        detail: '48,46 Hz · 15.000 MW verloren',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: 'Spannungsnull',
        time: '12:33:29,741 CEST',
        detail: '57 Millionen ohne Versorgung · iberisches Gebiet isoliert',
        href: '/resumen-de-cifras#cifras-maestras',
      },
    ],
    numbers: [
      { value: '57 M', label: 'betroffene Personen' },
      { value: '15.000', label: 'verlorene MW' },
      { value: '33 s', label: 'bis zum Gesamtzusammenbruch' },
      { value: '18,5 h', label: 'Wiederversorgungszeit' },
      { value: '>666 M€', label: 'Kosten verstärkter Betrieb' },
    ],
  },
  'zh-Hans': {
    eyebrow: '法医分析 · 2025年4月28日伊比利亚大停电',
    titlePrefix: '半岛电力系统的',
    titleAccent: '全面崩溃',
    titleSuffix: '的分析',
    subtitle: '对二十年来欧洲大陆同步电网最大一次扰动进行的技术、经济和社交重构。包含170项证据、10个附录、28个模拟器。',
    readIntro: '阅读引言',
    techAnalysis: '技术分析',
    glossary: '技术词汇表',
    ariaLabelChain: '崩溃因果链',
    chain: [
      {
        label: '前提条件',
        time: '12:30 CEST',
        detail: '82% IBR · 11个同步单元 · H = 2.3 s',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        label: '根源跳闸',
        time: '12:32:56.993 CEST',
        detail: '355 MW — 格拉纳达 · 分接头延迟 · 隐形过电压',
        href: '/analisis-incidente#fase-1',
      },
      {
        label: 'IBR级联',
        time: '12:33:07 CEST',
        detail: '11秒内损失4500 MW · ANSI 59保护',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: '与法国解列',
        time: '12:33:21.535 CEST',
        detail: '48.46 Hz · 损失15000 MW',
        href: '/analisis-incidente#fase-3',
      },
      {
        label: '电压归零',
        time: '12:33:29.741 CEST',
        detail: '5700万人无电力供应 · 伊比利亚区域孤网运行',
        href: '/resumen-de-cifras#cifras-maestras',
      },
    ],
    numbers: [
      { value: '57 M', label: '受影响人数' },
      { value: '15,000', label: '损失兆瓦' },
      { value: '33 秒', label: '全网崩溃时间' },
      { value: '18.5 小时', label: '恢复供电耗时' },
      { value: '>6.66 亿€', label: '强化运维成本' },
    ],
  }
};

export default function HomeHero() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.leftCol}>
          {/* Eyebrow */}
          <p className={styles.eyebrow}>
            {t.eyebrow}
          </p>

          {/* Título */}
          <h1 className={styles.title}>
            {t.titlePrefix}<br />
            <span className={styles.titleAccent}>{t.titleAccent}</span><br />
            {t.titleSuffix}
          </h1>

          <p className={styles.subtitle}>
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className={styles.ctas}>
            <Link to="/introduccion" className={styles.ctaPrimary}>
              {t.readIntro}
            </Link>
            <Link to="/contexto" className={styles.ctaSecondary}>
              {t.techAnalysis}
            </Link>
            <Link to="/glosario" className={styles.ctaTertiary}>
              {t.glossary}
            </Link>
          </div>
        </div>

        <div className={styles.rightCol}>
          {/* Cadena causal */}
          <div className={styles.chain} aria-label={t.ariaLabelChain}>
            {t.chain.map((step, i) => (
              <React.Fragment key={step.label}>
                <Link to={step.href} className={styles.node} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
                  <span className={styles.nodeTime}>{step.time}</span>
                  <span className={styles.nodeLabel}>{step.label}</span>
                  <span className={styles.nodeDetail}>{step.detail}</span>
                </Link>
                {i < t.chain.length - 1 && (
                  <div className={styles.arrow} aria-hidden="true">
                    <div className={styles.arrowLine} />
                    <div className={styles.arrowHead}>▼</div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Franja de cifras */}
      <div className={styles.strip}>
        {t.numbers.map((n) => (
          <div key={n.label} className={styles.stripItem}>
            <span className={styles.stripValue}>{n.value}</span>
            <span className={styles.stripLabel}>{n.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
