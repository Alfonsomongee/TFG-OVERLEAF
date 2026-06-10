/**
 * AnnexLayout.jsx
 *
 * Common wrapper for all conceptual annexes.
 * Provides: header, metadata chips, responsive layout, light/dark mode
 *
 * Props:
 *   kicker        (string) — small label above title
 *   title         (string) — main heading
 *   description   (string) — descriptive text
 *   children      (React node) — content
 *   meta          (array) — optional metadata chips
 *                 [{ label: 'Fuente', value: 'ESIOS' }, ...]
 */

import React from 'react';
import styles from './Annex.module.css';

export default function AnnexLayout({
  kicker,
  title,
  description,
  children,
  meta = [],
  wide = false,
}) {
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(true); // default true for mobile

  React.useEffect(() => {
    const checkSidebar = () => {
      if (typeof document === 'undefined') return;
      const btn = document.querySelector('[class*="expandButton"]');
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      
      if (btn || !sidebar || sidebar.offsetWidth < 100) {
        setIsSidebarHidden(true);
      } else {
        setIsSidebarHidden(false);
      }
    };

    checkSidebar();
    
    // Escuchar cambios de tamaño y clics para actualizar el estado instantáneamente
    window.addEventListener('resize', checkSidebar);
    document.addEventListener('click', () => setTimeout(checkSidebar, 50)); 
    
    return () => {
      window.removeEventListener('resize', checkSidebar);
      document.removeEventListener('click', checkSidebar);
    };
  }, []);

  const layoutClass = [
    styles.layout, 
    wide ? styles.layoutWide : '',
    wide && isSidebarHidden ? styles.isSidebarHidden : ''
  ].filter(Boolean).join(' ');

  return (
    <section className={layoutClass}>
      {/* Header with kicker, title, description */}
      <header className={styles.header}>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        {title && <h1 className={styles.title}>{title}</h1>}
        {description && <p className={styles.description}>{description}</p>}

        {/* Metadata chips */}
        {meta.length > 0 && (
          <div className={styles.metaContainer}>
            {meta.map((item, idx) => (
              <div key={idx} className={styles.metaChip}>
                <span className={styles.metaChipLabel}>{item.label}</span>
                <span className={styles.metaChipValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
