/**
 * HomeThesisPanel.jsx
 *
 * Bloque de tesis en posición 2 de la homepage.
 * Comunica la distinción central del TFG en el primer scroll:
 * colapso Q-V capacitivo, no déficit de frecuencia primaria.
 *
 * Diseño: 2 columnas — izquierda: tesis larga en prosa;
 * derecha: 3 chips verticales con la distinción sintetizada.
 * Sin efectos decorativos. Editorial puro.
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeThesisPanel.module.css';
import AnimatedContent from '@site/src/components/ReactBits/AnimatedContent';

const TRANSLATIONS = {
  es: {
    eyebrow: 'La tesis central',
    thesis:
      'El 28-A no fue un accidente de frecuencia ni un fallo de generación convencional. Fue una inestabilidad de tensión en régimen capacitivo, desencadenada en un sistema con baja potencia de cortocircuito, escasa absorción dinámica de reactiva y un marco operativo diseñado para una red que ya no existe.',
    detail:
      'Las previsiones de demanda eran correctas. Los precios de mercado no anticipaban ningún riesgo. La frecuencia permaneció en banda hasta los últimos segundos. La vulnerabilidad era invisible para las herramientas convencionales porque residía en las propiedades dinámicas del mix, no en la cantidad de potencia disponible.',
    chips: [
      {
        type: 'not',
        label: 'No fue',
        text: 'Déficit de generación ni colapso clásico de frecuencia primaria',
      },
      {
        type: 'yes',
        label: 'Sí fue',
        text: 'Inestabilidad de tensión multifactorial: baja fortaleza síncrona, pérdida de control reactivo y desconexiones en cascada',
      },
      {
        type: 'lesson',
        label: 'Lección',
        text: 'Rediseñar la estabilidad dinámica en sistemas dominados por inversores IBR',
      },
    ],
  },
  en: {
    eyebrow: 'The central thesis',
    thesis:
      'The 28-A was neither a frequency accident nor a conventional generation failure. It was a capacitive voltage instability triggered in a system with low short-circuit power, scarce dynamic reactive absorption, and an operational framework designed for a grid that no longer exists.',
    detail:
      'Demand forecasts were accurate. Market prices anticipated no risk. Frequency remained within band until the last seconds. The vulnerability was invisible to conventional tools because it resided in the dynamic properties of the mix, not in the amount of available power.',
    chips: [
      {
        type: 'not',
        label: 'Was not',
        text: 'Generation deficit or classic primary frequency collapse',
      },
      {
        type: 'yes',
        label: 'Was',
        text: 'Multifactorial voltage instability: low synchronous strength, loss of reactive control, and cascading disconnections',
      },
      {
        type: 'lesson',
        label: 'Lesson',
        text: 'Redesign dynamic stability in inverter-based resource (IBR) dominated systems',
      },
    ],
  },
  de: {
    eyebrow: 'Die zentrale These',
    thesis:
      'Der 28-A war weder ein Frequenzunfall noch ein konventioneller Erzeugungsausfall. Es war eine kapazitive Spannungsinstabilität, ausgelöst in einem System mit geringer Kurzschlussleistung, unzureichender dynamischer Blindleistungsabsorption und einem Betriebsrahmen, der für ein Netz konzipiert wurde, das nicht mehr existiert.',
    detail:
      'Die Lastprognosen waren korrekt. Die Marktpreise signalisierten kein Risiko. Die Frequenz blieb bis zu den letzten Sekunden im Normalbereich. Die Schwachstelle war für konventionelle Werkzeuge unsichtbar, da sie in den dynamischen Eigenschaften des Erzeugungsmix lag, nicht in der verfügbaren Leistungsmenge.',
    chips: [
      {
        type: 'not',
        label: 'War nicht',
        text: 'Erzeugungsdefizit oder klassischer primärer Frequenzeinbruch',
      },
      {
        type: 'yes',
        label: 'War',
        text: 'Multifaktorielle Spannungsinstabilität: geringe Synchronstärke, Verlust der Blindleistungsregelung und Kaskaden-Abschaltungen',
      },
      {
        type: 'lesson',
        label: 'Lehre',
        text: 'Dynamische Stabilität in IBR-dominierten Systemen neu gestalten',
      },
    ],
  },
  'zh-Hans': {
    eyebrow: '核心论点',
    thesis:
      '28-A大停电既不是频率事故，也不是传统发电侧的容量不足。它是一次容性电压失稳事件，发生在短路容量低、动态无功吸收能力不足、运行框架未能适应当前电网实际的系统之中。',
    detail:
      '负荷预测是准确的。市场价格没有预示任何风险。频率直到最后几秒钟才偏离正常范围。这一脆弱性对传统监控工具而言是不可见的，因为它根植于电源结构的动态特性，而非可用功率的总量。',
    chips: [
      {
        type: 'not',
        label: '不是',
        text: '发电容量不足或经典的一次调频崩溃',
      },
      {
        type: 'yes',
        label: '而是',
        text: '多因素电压失稳：低同步强度、无功控制失效与级联断路',
      },
      {
        type: 'lesson',
        label: '启示',
        text: '在逆变器主导（IBR）的电力系统中重新设计动态稳定机制',
      },
    ],
  },
};

export default function HomeThesisPanel() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Columna izquierda — tesis en prosa */}
        <AnimatedContent distance={32} duration={700} delay={0} threshold={0.15}>
          <div className={styles.left}>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            <p className={styles.thesis}>{t.thesis}</p>
            <p className={styles.detail}>{t.detail}</p>
          </div>
        </AnimatedContent>

        {/* Columna derecha — 3 chips de síntesis */}
        <AnimatedContent distance={32} duration={700} delay={150} threshold={0.15}>
          <div className={styles.right}>
            {t.chips.map((chip) => (
              <div key={chip.type} className={`${styles.chip} ${styles[`chip--${chip.type}`]}`}>
                <span className={styles.chipLabel}>{chip.label}</span>
                <p className={styles.chipText}>{chip.text}</p>
              </div>
            ))}
          </div>
        </AnimatedContent>

      </div>
    </section>
  );
}
