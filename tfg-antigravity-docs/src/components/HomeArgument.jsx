import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeArgument.module.css';
import ScrollFloat from './ScrollFloat';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Sobre esta web',
    heading: 'Un análisis forense en diez anexos',
    p1: 'Esta web no sustituye al TFG escrito: lo amplía mediante figuras interactivas, series temporales de ESIOS y ENTSO-E, simuladores físicos y evidencias técnicas organizadas por tema. Cada anexo reúne un tipo de evidencia — datos operativos, análisis de estabilidad, flujos transfronterizos, mercado, reposición, impacto socioeconómico, comunicación, metodología y ecuaciones — y los conecta con el argumento central del capítulo correspondiente.',
    p2: 'La tesis es única: el apagón del 28-A no fue un accidente de frecuencia ni un fallo de generación. Fue un colapso de tensión capacitivo en una red con baja potencia de cortocircuito, provocado por una cascada de 15.000 MW en 30 segundos que el sistema de control no pudo ver ni contener. Las evidencias sostienen esa distinción.',
    p3: 'Los anexos se pueden explorar en cualquier orden. El índice conceptual ofrece una entrada transversal por término técnico, figura o tabla.'
  },
  en: {
    eyebrow: 'About this site',
    heading: 'A forensic analysis in ten annexes',
    p1: 'This website does not replace the written thesis: it expands it through interactive figures, ESIOS and ENTSO-E time series, physical simulators, and technical evidence organized by topic. Each annex gathers a type of evidence — operational data, stability analysis, cross-border flows, market, restoration, socioeconomic impact, communication, methodology, and equations — and connects them with the central argument of the corresponding chapter.',
    p2: 'The thesis is clear: the 28-A blackout was neither a frequency accident nor a generation failure. It was a capacitive voltage collapse in a grid with low short-circuit power, triggered by a cascade of 15,000 MW in 30 seconds that the control system could neither see nor contain. The evidence supports this distinction.',
    p3: 'The annexes can be explored in any order. The conceptual index offers a cross-referenced entry by technical term, figure, or table.'
  },
  de: {
    eyebrow: 'Über diese Website',
    heading: 'Eine forensische Analyse in zehn Anhängen',
    p1: 'Diese Website ersetzt nicht die schriftliche Abschlussarbeit (TFG): Sie erweitert sie durch interaktive Abbildungen, ESIOS- und ENTSO-E-Zeitreihen, physikalische Simulatoren und nach Themen gegliederte technische Nachweise. Jeder Anhang bündelt eine Art von Nachweis — Betriebsdaten, Stabilitätsanalyse, grenzüberschreitende Flüsse, Markt, Wiederversorgung, sozioökonomische Auswirkungen, Kommunikation, Methodik und Gleichungen — und verknüpft sie mit dem Kernargument des entsprechenden Kapitels.',
    p2: 'Die These ist eindeutig: Der Blackout vom 28-A war weder ein Frequenzunfall noch ein Erzeugungsausfall. Es war ein kapazitiver Spannungskollaps in einem Netz mit geringer Kurzschlussleistung, ausgelöst durch eine Kaskade von 15.000 MW in 30 Sekunden, die das Leitsystem weder sehen noch eindämmen konnte. Die Nachweise belegen diese Unterscheidung.',
    p3: 'Die Anhänge können in beliebiger Reihenfolge erkundet werden. Das begriffliche Verzeichnis bietet einen übergreifenden Einstieg nach Fachbegriffen, Abbildungen oder Tabellen.'
  },
  'zh-Hans': {
    eyebrow: '关于本网站',
    heading: '十个附录中的法医分析',
    p1: '本网站并非旨在取代书面毕业论文，而是通过互动图表、ESIOS和ENTSO-E时间序列、物理模拟器以及按主题组织的工程技术证据来对其进行扩展。每个附录都汇集了一类证据——运行数据、稳定性分析、跨国潮流、电力市场、黑启动恢复、社会经济影响、媒体与公共沟通、研究方法以及数学方程——并将其与相应章节的核心论点相连结。',
    p2: '论文的核心论点十分明确：28-A大停电既不是由于电网频率失衡引起的责任事故，也不是由于发电侧容量不足导致的电力缺口。而是在极低短路容量（低系统强健度）的背景下，因电网容性无功过剩导致的电压崩溃，由30秒内损失15000 MW的级联跳闸所触发，这超出了控制系统的感知与调控极限。各项实证证据都充分支持这一论断。',
    p3: '您可以按任意顺序浏览这些附录。概念索引提供了按技术词汇、图表或数据表进行的多维度检索入口。'
  }
};

export default function HomeArgument() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <ScrollFloat tag="h2" className={styles.heading}>
            {t.heading}
          </ScrollFloat>
        </div>
        <div className={styles.right}>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
        </div>
      </div>
    </section>
  );
}
