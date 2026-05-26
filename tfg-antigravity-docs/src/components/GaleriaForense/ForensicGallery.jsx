import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './ForensicGallery.module.css';

function ForensicGalleryInner() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/processed/forensic_categories.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading forensic categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>Descargando registros de incidencias...</div>;
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryWrap}>
            <button
              className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
              style={{ '--cat-color': category.color }}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              <div className={styles.catIcon}>{category.icon}</div>
              <div className={styles.catTitle}>{category.name}</div>
            </button>
            
            {activeCategory === category.id && (
              <div className={styles.tableList}>
                {category.tables.map((table) => (
                  <div key={table.id} className={styles.tableItem} style={{ '--cat-color': category.color }}>
                    <div className={styles.tableHeader}>
                      <span className={styles.tableTitle}>{table.name}</span>
                      <span className={styles.tableSource}>{table.source}</span>
                    </div>
                    {table.note && <div className={styles.tableNote}>{table.note}</div>}
                    
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            {table.columns.map((col, idx) => (
                              <th key={idx}>{col.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.data.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {table.columns.map((col, colIdx) => (
                                <td key={colIdx}>{row[col.key]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForensicGallery() {
  return (
    <BrowserOnly fallback={<div className={styles.loading}>Iniciando enlace de datos...</div>}>
      {() => <ForensicGalleryInner />}
    </BrowserOnly>
  );
}
