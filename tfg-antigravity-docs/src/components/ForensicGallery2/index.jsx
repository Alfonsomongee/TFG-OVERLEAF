// index.jsx — ForensicGallery2 main component
import React, { useState, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useForensicData } from '@site/src/data/forensicChartsI18n';
import LeftPanel from './LeftPanel';
import ChartViewer from './ChartViewer';
import CategoryGrid from './CategoryGrid';
import styles from './ForensicGallery2.module.css';

const MOBILE_UI = {
  es: { selectCategory: 'Seleccionar categoría', selectChart: 'Seleccionar gráfica' },
  en: { selectCategory: 'Select category', selectChart: 'Select chart' },
  pt: { selectCategory: 'Selecionar categoria', selectChart: 'Selecionar gráfico' },
  fr: { selectCategory: 'Sélectionner une catégorie', selectChart: 'Sélectionner un graphique' },
  it: { selectCategory: 'Seleziona categoria', selectChart: 'Seleziona grafico' },
  de: { selectCategory: 'Kategorie auswählen', selectChart: 'Grafik auswählen' },
};

export default function ForensicGallery2() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale || 'es';
  const lm = MOBILE_UI[locale] || MOBILE_UI.es;

  const { CHARTS, CATEGORIES, getChartsByCategory, getCategoryById } = useForensicData();

  // Default: first chart of cat1
  const defaultChart = getChartsByCategory('cat1')[0];

  const [activeChartId, setActiveChartId] = useState(defaultChart?.id || null);
  const [activeCategoryId, setActiveCategoryId] = useState('cat1');
  const [categoryGridMode, setCategoryGridMode] = useState(false);

  // Mobile state
  const [mobileCatId, setMobileCatId] = useState('cat1');

  const handleSelectChart = useCallback((chartId) => {
    const chart = CHARTS.find(c => c.id === chartId);
    if (chart) {
      setActiveChartId(chartId);
      setActiveCategoryId(chart.categoryId);
      setCategoryGridMode(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectCategory = useCallback((catId) => {
    setActiveCategoryId(catId);
    // If clicking a category header (not a chart), show the grid view
    setCategoryGridMode(true);
    setActiveChartId(null);
  }, []);

  return (
    <div className={styles.gallery}>
      {/* ── LEFT PANEL (desktop) ── */}
      <LeftPanel
        activeChartId={activeChartId}
        activeCategoryId={activeCategoryId}
        onSelectChart={handleSelectChart}
        onSelectCategory={handleSelectCategory}
      />

      {/* ── MOBILE MENU ── */}
      <div className={styles.mobileMenuBar}>
        <select
          className={styles.mobileSelect}
          value={mobileCatId}
          onChange={e => {
            setMobileCatId(e.target.value);
            handleSelectCategory(e.target.value);
          }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        {categoryGridMode === false && (
          <select
            className={styles.mobileSelect}
            style={{ marginTop: '0.5rem' }}
            value={activeChartId || ''}
            onChange={e => handleSelectChart(e.target.value)}
          >
            {getChartsByCategory(mobileCatId).map((chart, idx) => (
              <option key={chart.id} value={chart.id}>
                {idx + 1}. {chart.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── RIGHT AREA ── */}
      {categoryGridMode ? (
        <div className={styles.chartArea}>
          <CategoryGrid
            categoryId={activeCategoryId}
            onSelectChart={handleSelectChart}
            locale={locale}
          />
        </div>
      ) : activeChartId ? (
        <ChartViewer
          chartId={activeChartId}
          locale={locale}
          onSelectChart={handleSelectChart}
        />
      ) : null}
    </div>
  );
}
