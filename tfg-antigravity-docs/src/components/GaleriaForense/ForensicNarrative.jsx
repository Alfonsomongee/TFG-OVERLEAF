import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './ForensicNarrative.module.css';

export default function ForensicNarrative() {
  const isBrowser = useIsBrowser();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isBrowser) return;
    fetch('/data/tablasdefinitivas.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Error loading forensic narrative:', err));
  }, [isBrowser]);

  if (!isBrowser || !data) {
    return <div className={styles.loader}>[ CARGANDO REGISTROS DEL OPERADOR... ]</div>;
  }

  // Helper to get raw HSL values for the glowing effect text
  const extractHSL = (hslString) => {
    const matches = hslString.match(/hsl\(([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\)/);
    if (matches) {
      return { h: matches[1], s: `${matches[2]}%`, l: `${matches[3]}%` };
    }
    const matches2 = hslString.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/);
    if (matches2) {
      return { h: matches2[1], s: `${matches2[2]}%`, l: `${matches2[3]}%` };
    }
    return { h: 190, s: '100%', l: '60%' }; // Fallback cyber-blue
  };

  // Helper to parse cell value and extract styling flag
  const parseCell = (rawValue) => {
    if (typeof rawValue !== 'string') return { value: rawValue, className: '' };
    if (rawValue.endsWith('_critical')) return { value: rawValue.replace('_critical', ''), className: styles['cell-critical'] };
    if (rawValue.endsWith('_warning')) return { value: rawValue.replace('_warning', ''), className: styles['cell-warning'] };
    if (rawValue.endsWith('_safe')) return { value: rawValue.replace('_safe', ''), className: styles['cell-safe'] };
    return { value: rawValue, className: '' };
  };

  return (
    <div className={styles.narrativeContainer}>
      {data.categories.map((cat, index) => {
        const catHSL = extractHSL(cat.color);
        const dynamicStyles = {
          '--active-h': catHSL.h,
          '--active-s': catHSL.s,
          '--active-l': catHSL.l,
        };

        return (
          <section 
            key={cat.id} 
            className={styles.narrativeSection} 
            style={dynamicStyles}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>{cat.icon}</span>
              <h2 className={styles.sectionTitle}>
                {index + 1}. {cat.name}
              </h2>
            </div>

            {cat.tables.map(table => {
              // Si la tabla es "grande" (>8 filas), la dividimos a la mitad
              const isLarge = table.data.length > 8;
              let chunks = [table.data];
              
              if (isLarge) {
                const mid = Math.ceil(table.data.length / 2);
                chunks = [
                  table.data.slice(0, mid),
                  table.data.slice(mid)
                ];
              }

              return (
                <div key={table.id} className={styles.tableBlock}>
                  <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>{table.name}</h3>
                    <p className={styles.tableSource}>FUENTE: {table.source}</p>
                  </div>

                  <div className={styles.tableGrid}>
                    {chunks.map((chunkData, chunkIdx) => (
                      <div key={chunkIdx} className={styles.tableWrapper}>
                        <table className={styles.forensicTable}>
                          <thead>
                            <tr>
                              {table.columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {chunkData.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {table.columns.map(col => {
                                  const cell = parseCell(row[col.key]);
                                  return (
                                    <td key={col.key} className={cell.className}>
                                      {cell.value}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                  {table.note && <div className={styles.note}>{table.note}</div>}
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
