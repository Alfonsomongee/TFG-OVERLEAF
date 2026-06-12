import React, { useMemo } from 'react';
import styles from './AnnexEvidence.module.css';

// Data sources
import { imageGalleryData } from '../../data/imageGalleryData';
import forensicCategoriesEs from '../../../static/data/processed/forensic_categories.json';
import forensicCategoriesEn from '../../../static/data/processed/forensic_categories_en.json';
import forensicCategoriesDe from '../../../static/data/processed/forensic_categories_de.json';
import forensicCategoriesZh from '../../../static/data/processed/forensic_categories_zh-Hans.json';

import { graphicsData, getGraphicData } from '../InteractiveGraphicsGalleryBase';
import { CHARTS as chartsEs } from '../../data/forensicCharts';
import { CHARTS as chartsEn } from '../../data/forensicCharts_en';
import { CHARTS as chartsDe } from '../../data/forensicCharts_de';
import { CHARTS as chartsPt } from '../../data/forensicCharts_pt';
import { CHARTS as chartsFr } from '../../data/forensicCharts_fr';
import { CHARTS as chartsIt } from '../../data/forensicCharts_it';
import { useDocLang } from '@site/src/hooks/useDocLang';
import AnnexEvidenceViewer from './AnnexEvidenceViewer';

const getCharts = (lang) => {
  switch (lang) {
    case 'en': return chartsEn;
    case 'de': return chartsDe;
    case 'pt': return chartsPt;
    case 'fr': return chartsFr;
    case 'it': return chartsIt;
    case 'zh-Hans': return chartsEn;
    default: return chartsEs;
  }
};

const getForensicCategories = (lang) => {
  switch (lang) {
    case 'en': return forensicCategoriesEn;
    case 'de': return forensicCategoriesDe;
    case 'zh-Hans': return forensicCategoriesZh;
    default: return forensicCategoriesEs;
  }
};

export default function AnnexEvidence({ type, id, level = 2 }) {
  const lang = useDocLang();

  const getChips = (l) => {
    switch (l) {
      case 'en': return {
        1: { symbol: '●', label: 'Key evidence' },
        2: { symbol: '◆', label: 'Supporting evidence' },
      };
      case 'de': return {
        1: { symbol: '●', label: 'Hauptbeweis' },
        2: { symbol: '◆', label: 'Unterstützender Nachweis' },
      };
      case 'zh-Hans': return {
        1: { symbol: '●', label: '核心证据' },
        2: { symbol: '◆', label: '支持性证据' },
      };
      default: return {
        1: { symbol: '●', label: 'Evidencia nuclear' },
        2: { symbol: '◆', label: 'Evidencia de apoyo' },
      };
    }
  };

  const CHIPS = getChips(lang);

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
      return (getCharts(lang) || []).find((chart) => chart.id === id);
    }

    return null;
  }, [type, id, lang]);

  if (!item) {
    const getErrorMsg = (l, t, i) => {
      switch (l) {
        case 'en': return `[AnnexEvidence Error] No element of type "${t}" found with ID "${i}"`;
        case 'de': return `[AnnexEvidence Error] Kein Element vom Typ "${t}" mit der ID "${i}" gefunden`;
        case 'zh-Hans': return `[AnnexEvidence Error] 未找到 ID 为 "${i}" 的 "${t}" 类型元素`;
        default: return `[AnnexEvidence Error] No se encontró elemento de tipo "${t}" con ID "${i}"`;
      }
    };
    return (
      <div className={styles.error}>
        {getErrorMsg(lang, type, id)}
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
