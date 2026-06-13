import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './MarketDistortionPvpcFigure.module.css';

/* ─── Translations ──────────────────────────────────────────────────────────── */

const TRANSLATIONS = {
  es: {
    kicker: 'Capítulo 7b · Mercado eléctrico',
    title: 'Precio barato, sistema caro',
    subtitle: 'El mercado diario reflejó energía barata; la red necesitó estabilidad física. Las restricciones técnicas trasladaron el coste a los consumidores PVPC.',
    panelMarketTag: 'Señal de mercado',
    panelMarketNote: 'precio OMIE · €/MWh',
    panelMarketFootnote: '⚠ OMIE y PVPC no son magnitudes equivalentes — el PVPC incluye peajes, cargos y liquidación de servicios de ajuste.',
    panelSystemTag: 'Coste del sistema',
    panelSystemNote: 'restricciones técnicas · €/MWh',
    panelSystemFootnote: 'Fuente: REE / auditoría PwC. Coste promedio mensual de resolución de restricciones técnicas.',
    impactLabel: 'Impacto en el consumidor PVPC',
    figCaption: 'Figura 36. Distorsión OMIE/PVPC: el precio del mercado diario cayó hasta 5,79 €/MWh el día posterior al apagón, mientras el coste de las restricciones técnicas crecía un 125 % para los consumidores PVPC. Elaboración propia a partir de OMIE, ESIOS/REE, PwC/ConsumES y NERA.',
    marketRows: [
      {
        id: 'omie-28',
        label: 'OMIE · 28 abril',
        value: 18.50,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'Precio medio del mercado diario la mañana del apagón. Muy deprimido por sobreoferta renovable con coste marginal tendente a cero.',
      },
      {
        id: 'omie-29',
        label: 'OMIE · 29 abril',
        value: 5.79,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'El día después del colapso el precio mayorista cayó aún más. Señal equivocada: la red estaba al límite pero el mercado reflejaba abundancia.',
      },
      {
        id: 'pvpc',
        label: 'PVPC · media estimada',
        value: 114.50,
        max: 120,
        unit: '€/MWh',
        color: 'amber',
        detail: 'Tarifa regulada media del 28-A. Incluye peajes, cargos del sistema y la liquidación de servicios de ajuste. No comparable directamente con el precio OMIE.',
      },
    ],
    systemRows: [
      {
        id: 'rest-base',
        label: 'Restricciones · dic 2024',
        value: 11.30,
        max: 16,
        unit: '€/MWh',
        color: 'main',
        detail: 'Coste unitario promedio de las restricciones técnicas antes del apagón. Componente históricamente marginal en la liquidación del sistema.',
      },
      {
        id: 'rest-post',
        label: 'Restricciones · dic 2025',
        value: 14.20,
        max: 16,
        unit: '€/MWh',
        color: 'red',
        detail: 'Coste unitario tras instaurar la Operación Reforzada. El despacho permanente de 25–30 ciclos combinados para proveer inercia dispara el componente de restricciones.',
      },
    ],
    impactItems: [
      { label: 'Variación componente restricciones PVPC', value: '+125 %', color: 'red', detail: 'Incremento del componente de restricciones en la tarifa PVPC entre mayo y noviembre de 2025. Fuente: auditorías PwC / ConsumES.' },
      { label: 'Recargo medio por hogar', value: '+36 €/año', color: 'amber', detail: 'Equivale a un recargo del 16 % sobre el valor estricto de la energía consumida anualmente.' },
      { label: 'Sobrecoste sistémico anual', value: '>1.000 M€', color: 'red', detail: 'Sobrecoste macroeconómico respecto al ejercicio 2024, según auditorías de PwC y NERA.' },
    ]
  },
  en: {
    kicker: 'Chapter 7b · Electricity market',
    title: 'Cheap price, expensive system',
    subtitle: 'The day-ahead market reflected cheap energy; the grid required physical stability. Technical constraints transferred the cost to PVPC consumers.',
    panelMarketTag: 'Market signal',
    panelMarketNote: 'OMIE price · €/MWh',
    panelMarketFootnote: '⚠ OMIE and PVPC are not equivalent magnitudes — PVPC includes tolls, charges, and settlement of adjustment services.',
    panelSystemTag: 'System cost',
    panelSystemNote: 'technical constraints · €/MWh',
    panelSystemFootnote: 'Source: REE / PwC audit. Monthly average cost of resolving technical constraints.',
    impactLabel: 'Impact on the PVPC consumer',
    figCaption: 'Figure 36. OMIE/PVPC distortion: the day-ahead market price fell to €5.79/MWh the day after the blackout, while the cost of technical constraints rose by 125% for PVPC consumers. Prepared by the author based on OMIE, ESIOS/REE, PwC/ConsumES, and NERA.',
    marketRows: [
      {
        id: 'omie-28',
        label: 'OMIE · April 28',
        value: 18.50,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'Average day-ahead market price on the morning of the blackout. Heavily depressed by renewable oversupply with a marginal cost tending to zero.',
      },
      {
        id: 'omie-29',
        label: 'OMIE · April 29',
        value: 5.79,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'The day after the collapse, the wholesale price fell even further. Wrong signal: the grid was at its limit, but the market reflected abundance.',
      },
      {
        id: 'pvpc',
        label: 'PVPC · estimated average',
        value: 114.50,
        max: 120,
        unit: '€/MWh',
        color: 'amber',
        detail: 'Average regulated tariff on April 28. Includes tolls, system charges, and adjustment services settlement. Not directly comparable with the OMIE price.',
      },
    ],
    systemRows: [
      {
        id: 'rest-base',
        label: 'Constraints · Dec 2024',
        value: 11.30,
        max: 16,
        unit: '€/MWh',
        color: 'main',
        detail: 'Average unit cost of technical constraints before the blackout. Historically a marginal component in system settlement.',
      },
      {
        id: 'rest-post',
        label: 'Constraints · Dec 2025',
        value: 14.20,
        max: 16,
        unit: '€/MWh',
        color: 'red',
        detail: 'Unit cost after establishing the Reinforced Operation. Permanent dispatch of 25–30 combined cycle plants to provide inertia spikes the constraints component.',
      },
    ],
    impactItems: [
      { label: 'PVPC constraints component variation', value: '+125 %', color: 'red', detail: 'Increase in the constraints component within the PVPC tariff between May and November 2025. Source: PwC / ConsumES audits.' },
      { label: 'Average surcharge per household', value: '+36 €/year', color: 'amber', detail: 'Equivalent to a 16% surcharge on the net value of energy consumed annually.' },
      { label: 'Annual systemic overcost', value: '>€1,000 M', color: 'red', detail: 'Macroeconomic overcost compared to fiscal year 2024, according to PwC and NERA audits.' },
    ]
  },
  de: {
    kicker: 'Kapitel 7b · Strommarkt',
    title: 'Günstiger Preis, teures System',
    subtitle: 'Der Spotmarkt spiegelte günstige Energie wider; das Netz benötigte physische Stabilität. Technische Restriktionen verlagerten die Kosten auf die PVPC-Verbraucher.',
    panelMarketTag: 'Marktsignal',
    panelMarketNote: 'OMIE-Preis · €/MWh',
    panelMarketFootnote: '⚠ OMIE und PVPC sind keine äquivalenten Größen — der PVPC enthält Netzentgelte, Umlagen und die Abrechnung von Ausgleichsdiensten.',
    panelSystemTag: 'Systemkosten',
    panelSystemNote: 'technische Restriktionen · €/MWh',
    panelSystemFootnote: 'Quelle: REE / PwC-Prüfung. Monatliche Durchschnittskosten zur Behebung technischer Restriktionen.',
    impactLabel: 'Auswirkung auf den PVPC-Verbraucher',
    figCaption: 'Abbildung 36. OMIE/PVPC-Verzerrung: Der Spotmarktpreis fiel am Tag nach dem Stromausfall auf 5,79 €/MWh, während die Kosten für technische Restriktionen für PVPC-Verbraucher um 125 % stiegen. Eigene Darstellung basierend auf OMIE, ESIOS/REE, PwC/ConsumES und NERA.',
    marketRows: [
      {
        id: 'omie-28',
        label: 'OMIE · 28. April',
        value: 18.50,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'Mittlerer Spotmarktpreis am Morgen des Stromausfalls. Stark gedrückt durch erneuerbares Überangebot mit Grenzkosten gegen Null.',
      },
      {
        id: 'omie-29',
        label: 'OMIE · 29. April',
        value: 5.79,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: 'Am Tag nach dem Zusammenbruch fiel der Großhandelspreis noch weiter. Falsches Signal: Das Netz war am Limit, aber der Markt spiegelte Überfluss wider.',
      },
      {
        id: 'pvpc',
        label: 'PVPC · geschätzter Durchschnitt',
        value: 114.50,
        max: 120,
        unit: '€/MWh',
        color: 'amber',
        detail: 'Durchschnittlicher regulierter Tarif am 28. April. Enthält Netzentgelte, Umlagen und die Abrechnung von Ausgleichsdiensten. Nicht direkt mit dem OMIE-Preis vergleichbar.',
      },
    ],
    systemRows: [
      {
        id: 'rest-base',
        label: 'Restriktionen · Dez 2024',
        value: 11.30,
        max: 16,
        unit: '€/MWh',
        color: 'main',
        detail: 'Durchschnittliche Stückkosten technischer Restriktionen vor dem Stromausfall. Historisch eine marginale Komponente in der Abrechnung des Systems.',
      },
      {
        id: 'rest-post',
        label: 'Restriktionen · Dez 2025',
        value: 14.20,
        max: 16,
        unit: '€/MWh',
        color: 'red',
        detail: 'Stückkosten nach Einführung des verstärkten Betriebs. Der dauerhafte Abruf von 25–30 GuD-Kraftwerken zur Bereitstellung von Trägheit treibt die Restriktionskomponente in die Höhe.',
      },
    ],
    impactItems: [
      { label: 'Veränderung der PVPC-Restriktionskomponente', value: '+125 %', color: 'red', detail: 'Erhöhung der Restriktionskomponente im PVPC-Tarif zwischen Mai und November 2025. Quelle: PwC- / ConsumES-Prüfungen.' },
      { label: 'Mittlerer Aufschlag pro Haushalt', value: '+36 €/Jahr', color: 'amber', detail: 'Entspricht einem Aufschlag von 16 % auf den reinen Wert der jährlich verbrauchten Energie.' },
      { label: 'Jährliche systemische Mehrkosten', value: '>1.000 Mio. €', color: 'red', detail: 'Makroökonomische Mehrkosten im Vergleich zum Geschäftsjahr 2024 gemäß Prüfungen von PwC und NERA.' },
    ]
  },
  'zh-Hans': {
    kicker: '第7b章 · 电力市场',
    title: '便宜的电价，昂贵的系统',
    subtitle: '日前市场反映了廉价的电能；电网则需要物理稳定性。技术限制将成本转嫁给了PVPC（管制电价）消费者。',
    panelMarketTag: '市场信号',
    panelMarketNote: 'OMIE价格 · 欧元/兆瓦时',
    panelMarketFootnote: '⚠ OMIE与PVPC不是等效的量度——PVPC包含过网费、系统税费及调整服务结算。',
    panelSystemTag: '系统成本',
    panelSystemNote: '技术限制 · 欧元/兆瓦时',
    panelSystemFootnote: '来源：REE / 普华永道审计。解决技术限制的月平均成本。',
    impactLabel: '对PVPC消费者的影响',
    figCaption: '图 36. OMIE/PVPC背离：停电后次日日前市场价格降至5.79欧元/兆瓦时，而PVPC消费者的技术限制成本增加了125%。根据OMIE、ESIOS/REE、普华永道/ConsumES及NERA的数据自行编制。',
    marketRows: [
      {
        id: 'omie-28',
        label: 'OMIE · 4月28日',
        value: 18.50,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: '停电当日早晨的日前市场平均价格。因边际成本趋近于零的可再生能源过度供应而极度低迷。',
      },
      {
        id: 'omie-29',
        label: 'OMIE · 4月29日',
        value: 5.79,
        max: 120,
        unit: '€/MWh',
        color: 'main',
        detail: '崩溃发生后次日，批发价格进一步下跌。错误的信号：电网已达极限，但市场却反映出充沛。',
      },
      {
        id: 'pvpc',
        label: 'PVPC · 预估平均值',
        value: 114.50,
        max: 120,
        unit: '€/MWh',
        color: 'amber',
        detail: '4月28日的平均管制电价。包含过网费、系统税费和调整服务结算。无法与OMIE价格直接对比。',
      },
    ],
    systemRows: [
      {
        id: 'rest-base',
        label: '限制性成本 · 2024年12月',
        value: 11.30,
        max: 16,
        unit: '€/MWh',
        color: 'main',
        detail: '停电前技术限制的平均单位成本。历史上在系统结算中属于边缘部分。',
      },
      {
        id: 'rest-post',
        label: '限制性成本 · 2025年12月',
        value: 14.20,
        max: 16,
        unit: '€/MWh',
        color: 'red',
        detail: '实施“强化运行”后的单位成本。为了提供系统惯性而永久调度25-30台联合循环机组，导致技术限制性成本飙升。',
      },
    ],
    impactItems: [
      { label: 'PVPC限制性成本变动', value: '+125 %', color: 'red', detail: '2025年5月至11月期间PVPC电价中限制性成本的增幅。来源：普华永道 / ConsumES审计。' },
      { label: '户均平均加价', value: '+36 欧元/年', color: 'amber', detail: '相当于每年实际消耗电能净值的16%附加费。' },
      { label: '年度系统性超额成本', value: '>10 亿欧元', color: 'red', detail: '相较于2024财年的宏观经济超额成本，根据普华永道和NERA的审计。' },
    ]
  }
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Bar({ row, activeId, onToggle, currentLocale }) {
  const pct = Math.min((row.value / row.max) * 100, 100);
  const isActive = activeId === row.id;

  return (
    <button
      className={`${styles.barRow} ${isActive ? styles.barRowActive : ''}`}
      onClick={() => onToggle(row.id)}
      aria-expanded={isActive}
    >
      <div className={styles.barLabel}>{row.label}</div>
      <div className={styles.barTrack}>
        <div
          className={`${styles.barFill} ${styles[`barFill_${row.color}`]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className={`${styles.barValue} ${styles[`barValue_${row.color}`]}`}>
        {row.value.toLocaleString(currentLocale === 'zh-Hans' ? 'zh-CN' : currentLocale, { minimumFractionDigits: 2 })} {row.unit}
      </div>
    </button>
  );
}

function ImpactBadge({ item, activeId, onToggle }) {
  const isActive = activeId === item.label;
  return (
    <button
      className={`${styles.badge} ${styles[`badge_${item.color}`]} ${isActive ? styles.badgeActive : ''}`}
      onClick={() => onToggle(item.label)}
      aria-expanded={isActive}
    >
      <span className={styles.badgeValue}>{item.value}</span>
      <span className={styles.badgeLabel}>{item.label}</span>
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

export default function MarketDistortionPvpcFigure() {
  const [activeId, setActiveId] = useState(null);
  const toggle = (id) => setActiveId(prev => prev === id ? null : id);

  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  const allItems = [...t.marketRows, ...t.systemRows, ...t.impactItems];
  const activeDetail =
    allItems.find(i => (i.id ?? i.label) === activeId)?.detail ?? null;

  return (
    <figure className={styles.figure}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker}>{t.kicker}</span>
        <h3 className={styles.title}>{t.title}</h3>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      {/* Two-column grid */}
      <div className={styles.grid}>
        {/* Left: market signal */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>{t.panelMarketTag}</span>
            <span className={styles.panelNote}>{t.panelMarketNote}</span>
          </div>
          <div className={styles.panelBars}>
            {t.marketRows.map(row => (
              <Bar key={row.id} row={row} activeId={activeId} onToggle={toggle} currentLocale={currentLocale} />
            ))}
          </div>
          <div className={styles.panelFootnote}>
            {t.panelMarketFootnote}
          </div>
        </div>

        {/* Right: system cost */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>{t.panelSystemTag}</span>
            <span className={styles.panelNote}>{t.panelSystemNote}</span>
          </div>
          <div className={styles.panelBars}>
            {t.systemRows.map(row => (
              <Bar key={row.id} row={row} activeId={activeId} onToggle={toggle} currentLocale={currentLocale} />
            ))}
          </div>
          <div className={styles.panelFootnote}>
            {t.panelSystemFootnote}
          </div>
        </div>
      </div>

      {/* Impact row */}
      <div className={styles.impactRow}>
        <span className={styles.impactLabel}>{t.impactLabel}</span>
        <div className={styles.badges}>
          {t.impactItems.map(item => (
            <ImpactBadge key={item.label} item={item} activeId={activeId} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {activeDetail && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p className={styles.detailText}>{activeDetail}</p>
        </div>
      )}
    </figure>
  );
}
