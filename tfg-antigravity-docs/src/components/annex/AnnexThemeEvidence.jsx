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
  const figures     = allFigures.filter((item) => item.tema === theme);
  const tables      = allTables.filter((item) => item.tema === theme);
  const interactives = (graphicsData || []).filter((item) => item.tema === theme);
  const charts      = (CHARTS || []).filter((item) => item.tema === theme);

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

  const renderFigures = () => {
    if (!include.includes('figures')) return null;
    const items = slice(figures);
    return (
      <div className={styles.section}>
        <div className={styles.summary}>
          Figuras encontradas: {figures.length}
        </div>
        {figures.length === 0 ? (
          <div className={styles.emptyState}>
            No hay evidencias de este tipo asociadas a este tema.
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
          Tablas encontradas: {tables.length}
        </div>
        {tables.length === 0 ? (
          <div className={styles.emptyState}>
            No hay evidencias de este tipo asociadas a este tema.
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
          Interactivos encontrados: {interactives.length}
        </div>
        {interactives.length === 0 ? (
          <div className={styles.emptyState}>
            No hay evidencias de este tipo asociadas a este tema.
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
          Series encontradas: {charts.length}
        </div>
        {charts.length === 0 ? (
          <div className={styles.emptyState}>
            No hay evidencias de este tipo asociadas a este tema.
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
