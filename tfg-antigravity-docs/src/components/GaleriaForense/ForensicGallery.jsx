import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, { translate } from '@docusaurus/Translate';
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
        
        // Handle hash navigation
        if (window.location.hash) {
          const hashId = window.location.hash.substring(1);
          const category = data.categories.find(c => c.tables.some(t => t.id === hashId));
          if (category) {
            setActiveCategory(category.id);
            setTimeout(() => {
              const el = document.getElementById(hashId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 300); // Give time for render and expansion
          }
        }
      })
      .catch(err => {
        console.error('Error loading forensic categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>{translate({id: 'forensic.loading', message: 'Descargando registros de incidencias...'})}</div>;
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryWrap}>
            <button
              className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              <div className={styles.catTitle}>
                {translate({id: `forensic.category.${category.id}`, message: category.name})}
              </div>
            </button>
            
            {activeCategory === category.id && (
              <div className={styles.tableList}>
                {category.tables.map((table) => (
                  <div key={table.id} id={table.id} className={styles.tableItem} style={{ '--cat-color': category.color }}>
                    <div className={styles.tableHeader}>
                      <span className={styles.tableTitle}>{translate({id: `forensic.table.${table.id}`, message: table.name})}</span>
                      <span className={styles.tableSource}>{table.source}</span>
                    </div>
                    {table.note && <div className={styles.tableNote}>{translate({id: `forensic.note.${table.id}`, message: table.note})}</div>}
                    
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            {table.columns.map((col, idx) => (
                              <th key={idx}>{translate({id: `forensic.col.${col.key}`, message: col.label})}</th>
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
    <BrowserOnly fallback={<div className={styles.loading}>{translate({id: 'forensic.init', message: 'Iniciando enlace de datos...'})}</div>}>
      {() => <ForensicGalleryInner />}
    </BrowserOnly>
  );
}
