// CategoryGrid.jsx
import React from 'react';
import { getCategoryById, getChartsByCategory } from '@site/src/data/forensicCharts';
import styles from './ForensicGallery2.module.css';

function StarsDisplay({ count }) {
  return (
    <span className={styles.gridCardStars}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default function CategoryGrid({ categoryId, onSelectChart, locale }) {
  const cat = getCategoryById(categoryId);
  const charts = getChartsByCategory(categoryId);
  if (!cat) return null;

  const labels = {
    es: { whatShows: 'Qué muestra', forRelevance: 'Relevancia forense' },
    en: { whatShows: 'What it shows', forRelevance: 'Forensic relevance' },
    pt: { whatShows: 'O que mostra', forRelevance: 'Relevância forense' },
    fr: { whatShows: 'Ce que montre', forRelevance: 'Pertinence judiciaire' },
    it: { whatShows: 'Cosa mostra', forRelevance: 'Rilevanza forense' },
    de: { whatShows: 'Was es zeigt', forRelevance: 'Forensische Relevanz' },
  };
  const l = labels[locale] || labels.es;

  return (
    <div className={styles.categoryGridView}>
      <div className={styles.categoryGridTitle} style={{ color: cat.color }}>
        {cat.icon} {cat.name}
      </div>
      <div className={styles.categoryQuestion}>{cat.question}</div>
      <div className={styles.gridCards}>
        {charts.map((chart, idx) => (
          <div
            key={chart.id}
            className={styles.gridCard}
            style={{ '--cat-color': cat.color }}
            onClick={() => onSelectChart(chart.id)}
          >
            <div className={styles.gridCardNum}>#{idx + 1}</div>
            <div className={styles.gridCardTitle}>{chart.title}</div>
            <div className={styles.gridCardFooter}>
              <span
                className={`${styles.sourceBadge} ${chart.sourceBadge === 'ESIOS' ? styles.esios : styles.entsoe}`}
              >
                {chart.sourceBadge}
              </span>
              <StarsDisplay count={chart.stars} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
