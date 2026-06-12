import React, { useMemo } from 'react';
import styles from './AnnexEvidence.module.css';

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

const getForensicCategories = (lang) => {
  switch (lang) {
    case 'en': return forensicCategoriesEn;
    case 'de': return forensicCategoriesDe;
    case 'zh-Hans': return forensicCategoriesZh;
    default: return forensicCategoriesEs;
  }
};

export default function AnnexEvidence({ type, id, level = 2 }) {
  const CHIPS = {
    1: { symbol: '●', label: 'Evidencia nuclear' },
    2: { symbol: '◆', label: 'Evidencia de apoyo' },
  };
  const lang = useDocLang();

  // Find item based on type and id
  const item = useMemo(() => {
    if (!id) return null;

    if (type === 'figure') {
      const allFigures = imageGalleryData?.chapters
        ? imageGalleryData.chapters.flatMap((chap) => chap.images || [])
        : (Array.isArray(imageGalleryData) ? imageGalleryData : []);
      
      // Match by substring in src or by id directly if available
      return allFigures.find(
        (fig) =>
          fig.id === id || 
          (fig.src && fig.src.toLowerCase().includes(id.toLowerCase()))
      );
    }

    if (type === 'table') {
      const cats = getForensicCategories(lang);
      if (!cats || !cats.categories) return null;
      const allTables = cats.categories.flatMap((cat) => cat.tables || []);
      return allTables.find((table) => table.id === id);
    }

    if (type === 'interactive') {
      const graphic = (graphicsData || []).find((g) => g.id === id);
      if (!graphic) return null;
      const data = getGraphicData(graphic.id, lang);
      return {
        ...graphic,
        title: data ? data.title : graphic.id,
        description: data ? data.desc : `Interactivo: ${graphic.id}`,
      };
    }

    if (type === 'chart') {
      return (CHARTS || []).find((chart) => chart.id === id);
    }

    return null;
  }, [type, id, lang]);

  if (!item) {
    return (
      <div className={styles.error}>
        [AnnexEvidence Error] No se encontró elemento de tipo "{type}" con ID "{id}"
      </div>
    );
  }

  // Determine container class based on level
  const containerClass = [
    styles.container,
    level === 1 ? styles.level1 : '',
    level === 2 ? styles.level2 : '',
    level === 3 ? styles.level3 : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {level <= 2 && CHIPS[level] && (
        <div className={styles[`chip${level}`]}>
          <span className={styles.chipSymbol} aria-hidden="true">{CHIPS[level].symbol}</span>
          <span className={styles.chipLabel}>{CHIPS[level].label}</span>
        </div>
      )}
      <AnnexEvidenceViewer type={type} item={item} lang={lang} />
    </div>
  );
}
