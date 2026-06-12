import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './MacroEconomicDamageFlowFigure.module.css';

const TRANSLATIONS = {
  es: {
    kicker: 'Capítulo 7b · Consecuencias financieras',
    title: 'Del cero de tensión a la factura macroeconómica',
    subtitle: 'Cadena causal que transforma el colapso eléctrico en energía no suministrada, pérdida de conectividad y daño económico agregado.',
    amplifierLabel: 'amplificador',
    warning: 'Las estimaciones CEOE y ATA representan perímetros económicos distintos y no son magnitudes acumulables. El VoLL no equivale al precio de mercado de la energía.',
    figCaption: 'Figura 35. Del cero de tensión a la factura macroeconómica. Cadena causal que transforma el colapso eléctrico en energía no suministrada, pérdida de conectividad y daño económico agregado. Las estimaciones CEOE y ATA se muestran como perímetros de impacto distintos, no como magnitudes aditivas. Elaboración propia a partir de Funcas, CEOE, ATA, Cloudflare Radar, Ookla y referencias ACER/CEER sobre VoLL.',
    nodes: [
      {
        id: 'origen',
        label: 'Cero de tensión',
        sub: '12:33 CEST · 28 abr 2025',
        metric: '15.000 MW',
        metricLabel: 'pérdida instantánea',
        detail: 'Desconexión en cascada de 15.000 MW en menos de 5 segundos. Sistema ibérico aislado del continente a las 12:33:29 CEST.',
      },
      {
        id: 'ens',
        label: 'Energía no suministrada',
        sub: '~150–180 GWh · 18 h de interrupción',
        metric: '~150 GWh',
        metricLabel: 'estimación académica',
        detail: 'Integral de la curva de demanda no cubierta desde las 12:33 del 28-A hasta la restitución al 99,95 % a las 07:05 del 29-A. Fuente: Funcas / análisis académico.',
      },
      {
        id: 'voll',
        label: 'Valor de la energía\nno suministrada',
        sub: 'VoLL · metodología ACER/CEER',
        metric: '4.000–45.000 €/MWh',
        metricLabel: 'rango europeo según sector',
        detail: 'El VoLL varía por sector: residencial 5–45 €/kWh, servicios 15–90 €/kWh, industria manufacturera 50–250 €/kWh. El rango amplio refleja la heterogeneidad del tejido productivo afectado.',
      },
      {
        id: 'factura',
        label: 'Factura económica',
        sub: 'estimaciones patronales · no aditivas',
        metric: '1.300–1.600 M€',
        metricLabel: 'CEOE + ATA (perímetros distintos)',
        detail: 'CEOE cifra el daño empresarial agregado en 1.600 M€ (tejido corporativo nacional). ATA estima 1.300 M€ en autónomos, hostelería y comercio. Son perímetros distintos, no magnitudes acumulables.',
      },
    ],
    amplifier: {
      label: 'Colapso digital',
      items: [
        { geo: 'España · internet', value: '−80 %', note: 'caída máxima de tráfico' },
        { geo: 'Portugal · internet', value: '−90 %', note: 'caída hasta el 10 % del baseline' },
        { geo: 'España · red móvil', value: '−73 %', note: 'velocidad mediana de descarga' },
      ],
      detail: 'La caída de conectividad convirtió el apagón en parálisis comercial: TPV, cajeros, coordinación logística y canales de emergencia quedados degradados simultáneamente. Fuente: Cloudflare Radar / Ookla.',
    }
  },
  en: {
    kicker: 'Chapter 7b · Financial consequences',
    title: 'From voltage zero to the macroeconomic bill',
    subtitle: 'Causal chain that transforms the electrical collapse into energy not supplied, loss of connectivity, and aggregate economic damage.',
    amplifierLabel: 'amplifier',
    warning: 'CEOE and ATA estimates represent different economic perimeters and are not cumulative magnitudes. VoLL does not equal the market price of energy.',
    figCaption: 'Figure 35. From voltage zero to the macroeconomic bill. Causal chain that transforms the electrical collapse into energy not supplied, loss of connectivity, and aggregate economic damage. CEOE and ATA estimates are shown as distinct impact perimeters, not as additive magnitudes. Own elaboration based on Funcas, CEOE, ATA, Cloudflare Radar, Ookla, and ACER/CEER references on VoLL.',
    nodes: [
      {
        id: 'origen',
        label: 'Voltage zero',
        sub: '12:33 CEST · April 28, 2025',
        metric: '15,000 MW',
        metricLabel: 'instantaneous loss',
        detail: 'Cascading disconnection of 15,000 MW in less than 5 seconds. Iberian system isolated from the continent at 12:33:29 CEST.',
      },
      {
        id: 'ens',
        label: 'Energy not supplied',
        sub: '~150–180 GWh · 18 h interruption',
        metric: '~150 GWh',
        metricLabel: 'academic estimate',
        detail: 'Integral of the uncovered demand curve from 12:33 CEST on April 28 to 99.95% restoration at 07:05 CEST on April 29. Source: Funcas / academic analysis.',
      },
      {
        id: 'voll',
        label: 'Value of lost load\n(VoLL)',
        sub: 'VoLL · ACER/CEER methodology',
        metric: '4,000–45,000 €/MWh',
        metricLabel: 'European range by sector',
        detail: 'VoLL varies by sector: residential €5–45/kWh, services €15–90/kWh, manufacturing industry €50–250/kWh. The wide range reflects the heterogeneity of the affected productive fabric.',
      },
      {
        id: 'factura',
        label: 'Economic damage',
        sub: 'employer estimates · non-additive',
        metric: '€1,300–1,600 M',
        metricLabel: 'CEOE + ATA (different perimeters)',
        detail: 'CEOE estimates aggregate business damage at €1,600 M (national corporate fabric). ATA estimates €1,300 M for self-employed, hospitality, and commerce. These are different perimeters, not cumulative magnitudes.',
      },
    ],
    amplifier: {
      label: 'Digital collapse',
      items: [
        { geo: 'Spain · internet', value: '−80 %', note: 'peak traffic drop' },
        { geo: 'Portugal · internet', value: '−90 %', note: 'drop to 10% of baseline' },
        { geo: 'Spain · mobile network', value: '−73 %', note: 'median download speed' },
      ],
      detail: 'The connectivity drop turned the blackout into commercial paralysis: POS terminals, ATMs, logistical coordination, and emergency channels were degraded simultaneously. Source: Cloudflare Radar / Ookla.',
    }
  },
  de: {
    kicker: 'Kapitel 7b · Finanzielle Folgen',
    title: 'Vom Spannungsnullpunkt zur makroökonomischen Rechnung',
    subtitle: 'Kausalkette, die den elektrischen Zusammenbruch in nicht gelieferte Energie, Konnektivitätsverlust und aggregierten wirtschaftlichen Schaden transformiert.',
    amplifierLabel: 'Verstärker',
    warning: 'CEOE- und ATA-Schätzungen stellen unterschiedliche wirtschaftliche Perimeter dar und sind keine kumulativen Größen. Der VoLL entspricht nicht dem Marktpreis für Strom.',
    figCaption: 'Abbildung 35. Vom Spannungsnullpunkt zur makroökonomischen Rechnung. Kausalkette, die den elektrischen Zusammenbruch in nicht gelieferte Energie, Konnektivitätsverlust und aggregierten wirtschaftlichen Schaden transformiert. Die Schätzungen von CEOE und ATA werden als unterschiedliche Auswirkungsbereiche dargestellt, nicht als additive Größen. Eigene Erstellung auf Grundlage von Funcas, CEOE, ATA, Cloudflare Radar, Ookla und ACER/CEER-Referenzen zum VoLL.',
    nodes: [
      {
        id: 'origen',
        label: 'Spannungsnullpunkt',
        sub: '12:33 CEST · 28. Apr. 2025',
        metric: '15.000 MW',
        metricLabel: 'Sofortiger Verlust',
        detail: 'Kaskadenartige Abschaltung von 15.000 MW in weniger als 5 Sekunden. Das iberische System wurde um 12:33:29 CEST vom Festland isoliert.',
      },
      {
        id: 'ens',
        label: 'Nicht gelieferte Energie',
        sub: '~150–180 GWh · 18 h Unterbrechung',
        metric: '~150 GWh',
        metricLabel: 'Akademische Schätzung',
        detail: 'Integral der ungedeckten Lastkurve von 12:33 Uhr am 28-A bis zur 99,95-prozentigen Wiederversorgung um 07:05 Uhr am 29-A. Quelle: Funcas / akademische Analyse.',
      },
      {
        id: 'voll',
        label: 'Wert der nicht gelieferten\nEnergie (VoLL)',
        sub: 'VoLL · ACER/CEER-Methodik',
        metric: '4.000–45.000 €/MWh',
        metricLabel: 'Europäische Bandbreite nach Sektor',
        detail: 'Der VoLL variiert je nach Sektor: Haushalte 5–45 €/kWh, Dienstleistungen 15–90 €/kWh, verarbeitendes Gewerbe 50–250 €/kWh. Die breite Spanne spiegelt die Heterogenität des betroffenen Produktionsgefüges wider.',
      },
      {
        id: 'factura',
        label: 'Wirtschaftlicher Schaden',
        sub: 'Arbeitgeberverbandschätzungen · nicht additiv',
        metric: '1.300–1.600 Mio. €',
        metricLabel: 'CEOE + ATA (unterschiedliche Bereiche)',
        detail: 'Die CEOE beziffert den aggregierten Unternehmensschaden auf 1.600 Mio. € (nationaler Unternehmenssektor). ATA schätzt 1.300 Mio. € für Selbstständige, Gastgewerbe und Handel. Dies sind unterschiedliche Bereiche, keine addierbaren Größen.',
      },
    ],
    amplifier: {
      label: 'Digitaler Kollaps',
      items: [
        { geo: 'Spanien · Internet', value: '−80 %', note: 'Maximaler Verkehrsabfall' },
        { geo: 'Portugal · Internet', value: '−90 %', note: 'Abfall auf 10 % des Baselines' },
        { geo: 'Spanien · Mobilfunk', value: '−73 %', note: 'Mittlere Downloadgeschwindigkeit' },
      ],
      detail: 'Der Ausfall der Konnektivität führte zu einer kommerziellen Lähmung: POS-Terminals, Geldautomaten, logistische Koordination und Notfallkanäle wurden gleichzeitig beeinträchtigt. Quelle: Cloudflare Radar / Ookla.',
    }
  },
  'zh-Hans': {
    kicker: '第 7b 章 · 经济影响',
    title: '从电压崩溃到宏观经济损失',
    subtitle: '将电力系统瓦解转换为缺供电能、数字网络中断以及累计经济损失的链条。',
    amplifierLabel: '放大因素',
    warning: 'CEOE 与 ATA 的估算口径不同，不能直接相加。VoLL（缺供电能价值）不等于电力市场出清价格。',
    figCaption: '图 35. 从电压零值到宏观经济账单。将电力崩溃转化为缺供电能、网络瘫痪和累计经济损失的因果链。CEOE和ATA的估算代表不同的受灾边界，而非直接累加值。根据Funcas、CEOE、ATA、Cloudflare Radar、Ookla及ACER/CEER关于VoLL的文献编制。',
    nodes: [
      {
        id: 'origen',
        label: '电网电压归零',
        sub: '12:33 CEST · 2025年4月28日',
        metric: '15,000 MW',
        metricLabel: '瞬时损失负荷',
        detail: '在不到5秒的时间内，系统发生15,000兆瓦发电机组级联跳闸。伊比利亚半岛电网于12:33:29 CEST与欧洲主网断连解列。',
      },
      {
        id: 'ens',
        label: '缺供电能 (ENS)',
        sub: '约150–180吉瓦时 · 停电持续18小时',
        metric: '约150 GWh',
        metricLabel: '学术估算值',
        detail: '自4月28日12:33分电网瘫痪开始，至29日07:05分恢复99.95%负荷期间，未满足负荷曲线的积分值。来源：Funcas / 学术分析。',
      },
      {
        id: 'voll',
        label: '缺供电能价值\n(VoLL)',
        sub: 'VoLL · ACER/CEER 评估体系',
        metric: '4,000–45,000 欧元/MWh',
        metricLabel: '按行业划分的欧洲标准区间',
        detail: 'VoLL因行业而异：居民用电5–45欧元/千瓦时，服务业15–90欧元/千瓦时，制造业50–250欧元/千瓦时。宽幅区间反映了受影响社会生产部门的异质性。',
      },
      {
        id: 'factura',
        label: '宏观经济损失',
        sub: '行业协会估算 · 非累加性',
        metric: '13亿-16亿欧元',
        metricLabel: 'CEOE + ATA (统计口径不同)',
        detail: '西班牙企业联合会 (CEOE) 评估的企业累计损失为16.0亿欧元。个体户协会 (ATA) 评估的个体商户、餐饮及零售业损失为13.0亿欧元。二者统计范围重叠，不可直接相加。',
      },
    ],
    amplifier: {
      label: '数字化停摆',
      items: [
        { geo: '西班牙 · 互联网', value: '−80 %', note: '网络流量最大跌幅' },
        { geo: '葡萄牙 · 互联网', value: '−90 %', note: '网络流量降至基线的10%' },
        { geo: '西班牙 · 移动网络', value: '−73 %', note: '移动下载速率中位数跌幅' },
      ],
      detail: '通信网络中断使大范围停电演变为商业活动瘫痪：POS机、ATM机、物流协调及紧急求助通道同时退化。来源：Cloudflare Radar / Ookla。',
    }
  }
};

export default function MacroEconomicDamageFlowFigure() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  const [activeNode, setActiveNode] = useState(null);
  const [ampActive, setAmpActive] = useState(false);

  return (
    <figure className={styles.figure}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker}>{t.kicker}</span>
        <h3 className={styles.title}>{t.title}</h3>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      {/* Flow */}
      <div className={styles.flowWrapper}>
        {/* Main chain */}
        <div className={styles.chain}>
          {t.nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <button
                className={`${styles.node} ${activeNode === node.id ? styles.nodeActive : ''}`}
                onClick={() => {
                  setAmpActive(false);
                  setActiveNode(activeNode === node.id ? null : node.id);
                }}
                aria-expanded={activeNode === node.id}
              >
                <span className={styles.nodeIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.nodeLabel}>{node.label}</span>
                <span className={styles.nodeSub}>{node.sub}</span>
                <span className={styles.nodeMetric}>{node.metric}</span>
                <span className={styles.nodeMetricLabel}>{node.metricLabel}</span>
              </button>

              {i < t.nodes.length - 1 && (
                <div className={styles.arrow} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Amplifier block */}
        <div className={styles.amplifierRow}>
          <div className={styles.amplifierConnector} aria-hidden="true">
            <span className={styles.amplifierConnectorLine} />
            <span className={styles.amplifierConnectorLabel}>{t.amplifierLabel}</span>
          </div>
          <button
            className={`${styles.amplifier} ${ampActive ? styles.amplifierActive : ''}`}
            onClick={() => {
              setActiveNode(null);
              setAmpActive(!ampActive);
            }}
            aria-expanded={ampActive}
          >
            <span className={styles.amplifierTitle}>{t.amplifier.label}</span>
            <div className={styles.amplifierItems}>
              {t.amplifier.items.map((item) => (
                <div key={item.geo} className={styles.amplifierItem}>
                  <span className={styles.amplifierGeo}>{item.geo}</span>
                  <span className={styles.amplifierValue}>{item.value}</span>
                  <span className={styles.amplifierNote}>{item.note}</span>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Detail panel */}
      {(activeNode || ampActive) && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p className={styles.detailText}>
            {activeNode
              ? t.nodes.find(n => n.id === activeNode)?.detail
              : t.amplifier.detail}
          </p>
        </div>
      )}

      {/* Methodological note */}
      <div className={styles.methodNote}>
        <span className={styles.methodNoteIcon} aria-hidden="true">⚠</span>
        {t.warning}
      </div>

      <figcaption className={styles.caption}>
        {t.figCaption}
      </figcaption>
    </figure>
  );
}
