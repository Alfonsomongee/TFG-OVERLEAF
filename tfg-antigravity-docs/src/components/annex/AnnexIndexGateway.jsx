import React, { useState, useMemo } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './AnnexIndexGateway.module.css';

const ANNEXES = [
  {
    num: 'I',
    href: '/anexo-demanda-generacion-balance',
    category: 'tecnico',
    title: {
      es: 'Demanda, generación y balance',
      en: 'Demand, generation, and balance',
      de: 'Nachfrage, Erzeugung und Bilanz',
      'zh-Hans': '负荷、发电与平衡',
    },
    focus: {
      es: 'Mix eléctrico, previsiones, capacidad instalada y equilibrio operativo.',
      en: 'Power mix, forecasts, installed capacity, and operational balance.',
      de: 'Strommix, Prognosen, installierte Leistung und Betriebsbilanz.',
      'zh-Hans': '电力结构、预测、装机容量和运行平衡。',
    },
    tags: ['ESIOS', 'ENTSO-E', 'series'],
  },
  {
    num: 'II',
    href: '/anexo-estabilidad-dinamica-tension',
    category: 'tecnico',
    title: {
      es: 'Estabilidad dinámica y tensión',
      en: 'Dynamic stability and voltage',
      de: 'Dynamische Stabilität und Spannung',
      'zh-Hans': '动态稳定与电压',
    },
    focus: {
      es: 'Frecuencia, RoCoF, tensiones, oscilaciones e inercia equivalente.',
      en: 'Frequency, RoCoF, voltages, oscillations, and equivalent inertia.',
      de: 'Frequenz, RoCoF, Spannungen, Schwingungen und äquivalente Trägheit.',
      'zh-Hans': '频率、RoCoF、电压、振荡和等效惯量。',
    },
    tags: ['PMU', 'Q-V', 'inercia'],
  },
  {
    num: 'III',
    href: '/anexo-cascada-protecciones-desconexiones',
    category: 'tecnico',
    title: {
      es: 'Protecciones, cascada y desconexiones',
      en: 'Protections, cascade, and disconnections',
      de: 'Schutzsysteme, Kaskade und Abschaltungen',
      'zh-Hans': '保护、级联与断开',
    },
    focus: {
      es: 'Tap-Lag, ANSI 59, UFLS, disparos y propagación de la cascada.',
      en: 'Tap-Lag, ANSI 59, UFLS, trips, and cascade propagation.',
      de: 'Tap-Lag, ANSI 59, UFLS, Auslösungen und Kaskadenausbreitung.',
      'zh-Hans': 'Tap-Lag、ANSI 59、UFLS、跳闸和级联传播。',
    },
    tags: ['ANSI 59', 'UFLS', 'Tap-Lag'],
  },
  {
    num: 'IV',
    href: '/anexo-interconexiones-flujos',
    category: 'tecnico',
    title: {
      es: 'Interconexiones y flujos',
      en: 'Interconnections and flows',
      de: 'Interkonnektoren und Flüsse',
      'zh-Hans': '互联线路与潮流',
    },
    focus: {
      es: 'Fronteras ES-FR, ES-PT, HVDC, flujos físicos y apoyo exterior.',
      en: 'ES-FR and ES-PT borders, HVDC, physical flows, and external support.',
      de: 'Grenzen ES-FR und ES-PT, HGÜ, physische Flüsse und externe Unterstützung.',
      'zh-Hans': 'ES-FR、ES-PT边界、HVDC、实际潮流和外部支援。',
    },
    tags: ['HVDC', 'frontera', 'flujos'],
  },
  {
    num: 'V',
    href: '/anexo-mercado-costes',
    category: 'economico',
    title: {
      es: 'Mercado eléctrico y costes',
      en: 'Electricity market and costs',
      de: 'Strommarkt und Kosten',
      'zh-Hans': '电力市场与成本',
    },
    focus: {
      es: 'Precios, desvíos, congestiones, servicios de ajuste y señales económicas.',
      en: 'Prices, imbalances, congestion, balancing services, and economic signals.',
      de: 'Preise, Abweichungen, Engpässe, Ausgleichsdienste und Marktsignale.',
      'zh-Hans': '价格、偏差、拥塞、平衡服务和经济信号。',
    },
    tags: ['OMIE', 'desvíos', 'ERS'],
  },
  {
    num: 'VI',
    href: '/anexo-reposicion-blackstart',
    category: 'tecnico',
    title: {
      es: 'Reposición y Black Start',
      en: 'Restoration and Black Start',
      de: 'Wiederaufbau und Black Start',
      'zh-Hans': '恢复与黑启动',
    },
    focus: {
      es: 'Islas eléctricas, arranque autónomo, demanda recuperada y apoyo top-down.',
      en: 'Electrical islands, autonomous start-up, restored demand, and top-down support.',
      de: 'Netzinseln, autonomer Start, wiederhergestellte Last und Top-down-Unterstützung.',
      'zh-Hans': '电气孤岛、自启动、负荷恢复和自上而下支援。',
    },
    tags: ['Black Start', 'islas', 'restauración'],
  },
  {
    num: 'VII',
    href: '/anexo-impacto-resiliencia',
    category: 'economico',
    title: {
      es: 'Impacto socioeconómico y resiliencia',
      en: 'Socioeconomic impact and resilience',
      de: 'Sozioökonomische Folgen und Resilienz',
      'zh-Hans': '社会经济影响与韧性',
    },
    focus: {
      es: 'Costes, VoLL, comparación histórica, sectores críticos y recuperación.',
      en: 'Costs, VoLL, historical comparison, critical sectors, and recovery.',
      de: 'Kosten, VoLL, historischer Vergleich, kritische Sektoren und Erholung.',
      'zh-Hans': '成本、VoLL、历史比较、关键部门和恢复。',
    },
    tags: ['VoLL', 'costes', 'resiliencia'],
  },
  {
    num: 'VIII',
    href: '/anexo-comunicacion-fuentes',
    category: 'comunicacion',
    title: {
      es: 'Comunicación y fuentes',
      en: 'Communication and sources',
      de: 'Kommunikation und Quellen',
      'zh-Hans': '传播与来源',
    },
    focus: {
      es: 'Cobertura pública, narrativa institucional, prensa y contraste de fuentes.',
      en: 'Public coverage, institutional narrative, press, and source comparison.',
      de: 'Öffentliche Berichterstattung, institutionelle Darstellung, Presse und Quellenabgleich.',
      'zh-Hans': '公众报道、机构叙事、媒体和来源对比。',
    },
    tags: ['prensa', 'fuentes', 'relato'],
  },
  {
    num: 'IX',
    href: '/anexo-metodologia-modelos-datos-vivos',
    category: 'metodologia',
    title: {
      es: 'Metodología, modelos y datos vivos',
      en: 'Methodology, models, and live data',
      de: 'Methodik, Modelle und Live-Daten',
      'zh-Hans': '方法、模型与实时数据',
    },
    focus: {
      es: 'Comparadores, modelos didácticos, límites de interpretación y datos actualizables.',
      en: 'Comparators, educational models, interpretation limits, and updatable data.',
      de: 'Vergleiche, didaktische Modelle, Interpretationsgrenzen und aktualisierbare Daten.',
      'zh-Hans': '比较器、教学模型、解释边界和可更新数据。',
    },
    tags: ['modelos', 'datos vivos', 'límites'],
  },
  {
    num: 'X',
    href: '/anexo-ecuaciones-matematicas',
    category: 'metodologia',
    title: {
      es: 'Ecuaciones y simuladores',
      en: 'Equations and simulators',
      de: 'Gleichungen und Simulatoren',
      'zh-Hans': '方程与模拟器',
    },
    focus: {
      es: 'Formulación matemática, simuladores físicos y herramientas interpretativas.',
      en: 'Mathematical formulation, physical simulators, and interpretive tools.',
      de: 'Mathematische Formulierung, physikalische Simulatoren und Deutungswerkzeuge.',
      'zh-Hans': '数学公式、物理模拟器和解释工具。',
    },
    tags: ['simuladores', 'ecuaciones', 'modelos'],
  },
];

const TEXT = {
  es: {
    label: 'Mapa de anexos',
    title: 'Diez repositorios, una lectura transversal',
    description:
      'Cada anexo conserva su ruta documental original. Este mapa los ordena como una mesa de trabajo: primero el dominio, después el tipo de evidencia y finalmente el acceso directo.',
    evidence: 'evidencia',
    open: 'Abrir anexo',
    searchPlaceholder: 'Buscar por término o tag...',
    filters: {
      all:          'Todos',
      tecnico:      'Técnico',
      economico:    'Económico',
      comunicacion: 'Comunicación',
      metodologia:  'Metodología',
    },
    noResults: 'Ningún anexo coincide con la búsqueda.',
  },
  en: {
    label: 'Annex map',
    title: 'Ten repositories, one cross-reading',
    description:
      'Each annex keeps its original documentary route. This map organizes them as a workbench: domain first, evidence type second, direct access last.',
    evidence: 'evidence',
    open: 'Open annex',
    searchPlaceholder: 'Search by term or tag...',
    filters: {
      all:          'All',
      tecnico:      'Technical',
      economico:    'Economic',
      comunicacion: 'Communication',
      metodologia:  'Methodology',
    },
    noResults: 'No annexes match the search.',
  },
  de: {
    label: 'Anhangskarte',
    title: 'Zehn Repositorien, eine Quersicht',
    description:
      'Jeder Anhang behält seine ursprüngliche Dokumentationsroute. Diese Karte ordnet sie als Arbeitstisch: zuerst der Bereich, dann die Evidenzart, zuletzt der direkte Zugang.',
    evidence: 'Nachweis',
    open: 'Anhang öffnen',
    searchPlaceholder: 'Nach Begriff oder Tag suchen...',
    filters: {
      all:          'Alle',
      tecnico:      'Technisch',
      economico:    'Wirtschaftlich',
      comunicacion: 'Kommunikation',
      metodologia:  'Methodik',
    },
    noResults: 'Keine Anhänge entsprechen der Suche.',
  },
  'zh-Hans': {
    label: '附录地图',
    title: '十个资料库，一条横向阅读线',
    description:
      '每个附录保留其原始文档路径。该地图将其组织为工作台：先看领域，再看证据类型，最后直接进入。',
    evidence: '证据',
    open: '打开附录',
    searchPlaceholder: '按术语或标签搜索...',
    filters: {
      all:          '全部',
      tecnico:      '技术',
      economico:    '经济',
      comunicacion: '传播',
      metodologia:  '方法',
    },
    noResults: '没有附录符合搜索条件。',
  },
};

const FILTER_KEYS = ['all', 'tecnico', 'economico', 'comunicacion', 'metodologia'];

export default function AnnexIndexGateway() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const lang = TEXT[currentLocale] ? currentLocale : 'es';
  const t = TEXT[lang];

  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  const getLocalizedUrl = (url) => {
    const prefix = currentLocale === 'es' ? '' : `/${currentLocale}`;
    const path = `${prefix}${url}`.replace(/\/+/g, '/');
    return useBaseUrl(path);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ANNEXES.filter((annex) => {
      const matchesCategory =
        activeFilter === 'all' || annex.category === activeFilter;
      if (!matchesCategory) return false;
      if (!q) return true;
      const title = (annex.title[lang] || annex.title.es).toLowerCase();
      const focus = (annex.focus[lang] || annex.focus.es).toLowerCase();
      const tagsStr = annex.tags.join(' ').toLowerCase();
      return title.includes(q) || focus.includes(q) || tagsStr.includes(q);
    });
  }, [activeFilter, query, lang]);

  return (
    <div className={styles.gateway}>
      <div className={styles.lead}>
        <span className={styles.kicker}>{t.label}</span>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.description}>{t.description}</p>
      </div>

      {/* Barra de búsqueda */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">⌕</span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchPlaceholder}
        />
        {query && (
          <button
            className={styles.searchClear}
            onClick={() => setQuery('')}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className={styles.filters} role="group" aria-label="Filtrar por dominio">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            className={`${styles.filterBtn} ${activeFilter === key ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(key)}
            aria-pressed={activeFilter === key}
          >
            {t.filters[key]}
          </button>
        ))}
      </div>

      {/* Grid de tarjetas */}
      {filtered.length === 0 ? (
        <p className={styles.noResults}>{t.noResults}</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((annex) => (
            <a
              key={annex.num}
              className={styles.card}
              href={getLocalizedUrl(annex.href)}
              aria-label={`${t.open}: ${annex.title[lang] || annex.title.es}`}
            >
              <span className={styles.number}>{annex.num}</span>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{annex.title[lang] || annex.title.es}</span>
                <span className={styles.cardFocus}>{annex.focus[lang] || annex.focus.es}</span>
                <span className={styles.tags}>
                  {annex.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </span>
              </span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
