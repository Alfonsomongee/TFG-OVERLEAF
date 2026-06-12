import React, { useMemo } from 'react';
import styles from './AnnexThemeEvidence.module.css';

// Data sources
import { imageGalleryData } from '../../data/imageGalleryData';
import forensicCategoriesEs from '../../../static/data/processed/forensic_categories.json';
import forensicCategoriesEn from '../../../static/data/processed/forensic_categories_en.json';
import forensicCategoriesDe from '../../../static/data/processed/forensic_categories_de.json';
import forensicCategoriesZh from '../../../static/data/processed/forensic_categories_zh-Hans.json';

import { graphicsData, getGraphicData } from '../InteractiveGraphicsGalleryBase';
import { CHARTS } from '../../data/forensicCharts';
import { useDocLang } from '@site/src/hooks/useDocLang';
import AnnexEvidenceViewer from './AnnexEvidenceViewer';

// ─────────────────────────────────────────────────────────────────────────────
// Locale selector for table data
// ─────────────────────────────────────────────────────────────────────────────

const getForensicCategories = (lang) => {
  switch (lang) {
    case 'en': return forensicCategoriesEn;
    case 'de': return forensicCategoriesDe;
    case 'zh-Hans': return forensicCategoriesZh;
    default: return forensicCategoriesEs;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AnnexThemeEvidence
//
// Props:
//   theme    string — T1…T9 tag used to filter evidences
//   include  string[] — which types to show: 'figures' | 'tables' | 'interactives' | 'charts'
//   limit    number  — max items per type (optional)
//   variant  string  — reserved for future layout variants (currently unused)
// ─────────────────────────────────────────────────────────────────────────────

export default function AnnexThemeEvidence({
  theme,
  include = ['figures', 'tables', 'interactives', 'charts'],
  limit,
}) {
  const lang = useDocLang();

  if (!theme) return null;

  // ── All figures (computed once with useMemo) ──────────────────────────────
  const allFigures = useMemo(() => {
    if (!imageGalleryData) return [];
    if (imageGalleryData.chapters) {
      return imageGalleryData.chapters.flatMap((chap) => chap.images || []);
    }
    if (Array.isArray(imageGalleryData)) return imageGalleryData;
    return [];
  }, []);

  // ── All tables for current locale ─────────────────────────────────────────
  const allTables = useMemo(() => {
    const cats = getForensicCategories(lang);
    if (!cats || !cats.categories) return [];
    return cats.categories.flatMap((cat) => cat.tables || []);
  }, [lang]);

  // ── Filter by tema ─────────────────────────────────────────────────────────
  const isMatch = (item) => Array.isArray(item.tema) ? item.tema.includes(theme) : item.tema === theme;
  
  const figures     = allFigures.filter(isMatch);
  const tables      = allTables.filter(isMatch);
  const interactives = (graphicsData || []).filter(isMatch);
  const charts      = (CHARTS || []).filter(isMatch);

  // ── Enrich interactives with locale title/description ─────────────────────
  const enrichedInteractives = useMemo(
    () =>
      interactives.map((graphic) => {
        const data = getGraphicData(graphic.id, lang);
        return {
          ...graphic,
          title: data ? data.title : graphic.id,
          description: data ? data.desc : `Interactivo: ${graphic.id}`,
        };
      }),
    [interactives, lang]
  );

  // ── Slice if limit provided ────────────────────────────────────────────────
  const slice = (arr) => (limit ? arr.slice(0, limit) : arr);

  // ─────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────

  const getSummaryLabel = (l, type, count) => {
    switch (l) {
      case 'en':
        if (type === 'figures') return `Figures found: ${count}`;
        if (type === 'tables') return `Tables found: ${count}`;
        if (type === 'interactives') return `Interactives found: ${count}`;
        if (type === 'charts') return `Series found: ${count}`;
        return '';
      case 'de':
        if (type === 'figures') return `Gefundene Abbildungen: ${count}`;
        if (type === 'tables') return `Gefundene Tabellen: ${count}`;
        if (type === 'interactives') return `Gefundene interaktive Inhalte: ${count}`;
        if (type === 'charts') return `Gefundene Zeitreihen: ${count}`;
        return '';
      case 'zh-Hans':
        if (type === 'figures') return `找到的图: ${count}`;
        if (type === 'tables') return `找到的表: ${count}`;
        if (type === 'interactives') return `找到的互动模块: ${count}`;
        if (type === 'charts') return `找到的时间序列: ${count}`;
        return '';
      default:
        if (type === 'figures') return `Figuras encontradas: ${count}`;
        if (type === 'tables') return `Tablas encontradas: ${count}`;
        if (type === 'interactives') return `Interactivos encontrados: ${count}`;
        if (type === 'charts') return `Series encontradas: ${count}`;
        return '';
    }
  };

  const getEmptyState = (l) => {
    switch (l) {
      case 'en': return 'No evidence of this type associated with this topic.';
      case 'de': return 'Für dieses Thema sind keine Nachweise dieses Typs vorhanden.';
      case 'zh-Hans': return '没有与此主题相关的此类证据。';
      default: return 'No hay evidencias de este tipo asociadas a este tema.';
    }
  };

  const renderFigures = () => {
    if (!include.includes('figures')) return null;
    const items = slice(figures);
    return (
      <div className={styles.section}>
        <div className={styles.summary}>
          {getSummaryLabel(lang, 'figures', figures.length)}
        </div>
        {figures.length === 0 ? (
          <div className={styles.emptyState}>
            {getEmptyState(lang)}
          </div>
        ) : (
          <div className={styles.evidenceContainer}>
            {items.map((fig, idx) => (
              <AnnexEvidenceViewer
                key={idx}
                type="figure"
                item={fig}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTables = () => {
    if (!include.includes('tables')) return null;
    const items = slice(tables);
    return (
      <div className={styles.section}>
        <div className={styles.summary}>
          {getSummaryLabel(lang, 'tables', tables.length)}
        </div>
        {tables.length === 0 ? (
          <div className={styles.emptyState}>
            {getEmptyState(lang)}
          </div>
        ) : (
          <div className={styles.evidenceContainer}>
            {items.map((table, idx) => (
              <AnnexEvidenceViewer
                key={idx}
                type="table"
                item={table}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInteractives = () => {
    if (!include.includes('interactives')) return null;
    const items = slice(enrichedInteractives);
    return (
      <div className={styles.section}>
        <div className={styles.summary}>
          {getSummaryLabel(lang, 'interactives', interactives.length)}
        </div>
        {interactives.length === 0 ? (
          <div className={styles.emptyState}>
            {getEmptyState(lang)}
          </div>
        ) : (
          <div className={styles.evidenceContainer}>
            {items.map((graphic, idx) => (
              <AnnexEvidenceViewer
                key={idx}
                type="interactive"
                item={graphic}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCharts = () => {
    if (!include.includes('charts')) return null;
    const items = slice(charts);
    return (
      <div className={styles.section}>
        <div className={styles.summary}>
          {getSummaryLabel(lang, 'charts', charts.length)}
        </div>
        {charts.length === 0 ? (
          <div className={styles.emptyState}>
            {getEmptyState(lang)}
          </div>
        ) : (
          <div className={styles.evidenceContainer}>
            {items.map((chart, idx) => (
              <AnnexEvidenceViewer
                key={idx}
                type="chart"
                item={chart}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className={styles.annexThemeWrapper}>
      {renderFigures()}
      {renderTables()}
      {renderInteractives()}
      {renderCharts()}
    </div>
  );
}
