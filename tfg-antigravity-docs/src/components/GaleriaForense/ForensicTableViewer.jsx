import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useDocLang } from '@site/src/hooks/useDocLang';
import styles from './ForensicTableViewer.module.css';

// Extract HSL values from strings like "var(--chart-cyan)" to raw numbers "190, 100%, 60%" for use in hsla()
const extractHSL = (hslString) => {
  if (!hslString) return { h: 190, s: '100%', l: '60%' }; // Default cyan
  const matches = hslString.match(/hsl\(([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\)/);
  if (matches) {
    return { h: matches[1], s: `${matches[2]}%`, l: `${matches[3]}%` };
  }
  // Try format without commas
  const matches2 = hslString.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/);
  if (matches2) {
    return { h: matches2[1], s: `${matches2[2]}%`, l: `${matches2[3]}%` };
  }
  return { h: 190, s: '100%', l: '60%' }; 
};

export default function ForensicTableViewer() {
  const isBrowser = useIsBrowser();
  const lang = useDocLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTableId, setActiveTableId] = useState(null);

  useEffect(() => {
    if (!isBrowser) return;
    const jsonFile = lang === 'en'
      ? '/data/tablasdefinitivas_en.json'
      : lang === 'de'
      ? '/data/tablasdefinitivas_de.json'
      : '/data/tablasdefinitivas.json';
    
    fetch(jsonFile)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        // Set the first table of the first category as active by default
        if (json.categories && json.categories.length > 0) {
          const firstCategory = json.categories[0];
          if (firstCategory.tables && firstCategory.tables.length > 0) {
            setActiveTableId(firstCategory.tables[0].id);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading table data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [isBrowser]);

  if (!isBrowser) return <div className={styles.loader}>[ INITIALIZING TERMINAL... ]</div>;
  if (loading) return <div className={styles.loader}>[ LOADING DATA... ]</div>;
  if (error) return <div className={styles.loader}>[ ERROR: {error} ]</div>;
  if (!data || !data.categories) return <div className={styles.loader}>[ NO DATA ]</div>;

  // Find the active table and its category
  let activeTable = null;
  let activeCategoryColor = "var(--chart-cyan)";
  let activeHSL = { h: 190, s: '100%', l: '60%' };

  for (const cat of data.categories) {
    const table = cat.tables?.find(t => t.id === activeTableId);
    if (table) {
      activeTable = table;
      activeCategoryColor = cat.color;
      activeHSL = extractHSL(cat.color);
      break;
    }
  }

  // Set CSS variables for the dynamic neon color
  const dynamicStyles = {
    '--active-h': activeHSL.h,
    '--active-s': activeHSL.s,
    '--active-l': activeHSL.l,
  };

  return (
    <div className={styles.container} style={dynamicStyles}>
      {/* LEFT PANE: NAVIGATION */}
      <div className={styles.sidebar}>
        {data.categories.map(cat => {
          const catHSL = extractHSL(cat.color);
          return (
            <div key={cat.id} className={styles.category}>
              <div 
                className={styles.categoryHeader} 
                style={{ color: cat.color }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              {cat.tables?.map(table => (
                <button
                  key={table.id}
                  className={`${styles.tableButton} ${activeTableId === table.id ? styles.tableButtonActive : ''}`}
                  onClick={() => setActiveTableId(table.id)}
                  style={activeTableId === table.id ? {
                    '--active-h': catHSL.h,
                    '--active-s': catHSL.s,
                    '--active-l': catHSL.l,
                  } : {}}
                >
                  {table.name}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* RIGHT PANE: TABLE VIEWER */}
      <div className={styles.mainArea}>
        {activeTable ? (
          <>
            <div className={styles.header}>
              <h3 className={styles.title}>{activeTable.name}</h3>
              <p className={styles.source}>SOURCE: {activeTable.source}</p>
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.forensicTable}>
                <thead>
                  <tr>
                    {activeTable.columns?.map(col => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTable.data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {activeTable.columns?.map(col => (
                        <td key={col.key}>{row[col.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeTable.note && (
              <div className={styles.note}>
                {activeTable.note}
              </div>
            )}
          </>
        ) : (
          <div className={styles.loader}>[ SELECT A TABLE MODULE ]</div>
        )}
      </div>
    </div>
  );
}
