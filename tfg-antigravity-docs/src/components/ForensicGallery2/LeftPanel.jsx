// LeftPanel.jsx
import React, { useState } from 'react';
import { CATEGORIES, getChartsByCategory } from '@site/src/data/forensicCharts';
import MiniTimeline from './MiniTimeline';
import styles from './ForensicGallery2.module.css';



export default function LeftPanel({ activeChartId, activeCategoryId, onSelectChart, onSelectCategory }) {
  const [openCategories, setOpenCategories] = useState({ [activeCategoryId]: true });
  const [highlightedCharts, setHighlightedCharts] = useState([]);

  function toggleCategory(catId) {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  }

  function handleCategoryHeaderClick(cat) {
    toggleCategory(cat.id);
    onSelectCategory(cat.id);
  }

  return (
    <div className={styles.leftPanel}>
      <MiniTimeline
        highlightedCharts={highlightedCharts}
        onHover={setHighlightedCharts}
      />
      <div className={styles.categoriesList}>
        {CATEGORIES.map((cat, catIndex) => {
          const charts = getChartsByCategory(cat.id);
          const isOpen = !!openCategories[cat.id];
          const isActiveCategory = activeCategoryId === cat.id;

          return (
            <div key={cat.id} className={styles.categoryItem}>
              <div
                className={styles.categoryHeader}
                onClick={() => handleCategoryHeaderClick(cat)}
                style={isActiveCategory ? { background: cat.colorLight } : {}}
              >
                <div
                  className={styles.categoryColorBar}
                  style={{ background: cat.color }}
                />
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span
                  className={styles.categoryName}
                  style={isActiveCategory ? { color: cat.color } : {}}
                >
                  {cat.name}
                </span>
                <span className={`${styles.categoryChevron} ${isOpen ? styles.open : ''}`}>
                  ▶
                </span>
              </div>

              {isOpen && (
                <div className={styles.chartsList}>
                  {charts.map((chart, idx) => {
                    const isActive = chart.id === activeChartId;
                    const isHighlighted = highlightedCharts.includes(chart.id);
                    const globalNum = CATEGORIES.slice(0, catIndex).reduce(
                      (acc, c) => acc + getChartsByCategory(c.id).length, 0
                    ) + idx + 1;

                    return (
                      <div
                        key={chart.id}
                        className={`${styles.chartListItem} ${isActive ? styles.active : ''}`}
                        style={
                          isActive
                            ? { borderLeftColor: cat.color, background: cat.colorLight }
                            : isHighlighted
                            ? { background: 'rgba(255,200,0,0.08)' }
                            : {}
                        }
                        onClick={() => onSelectChart(chart.id)}
                      >
                        <span className={styles.chartListItemNumber}>{globalNum}</span>
                        {chart.title}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
