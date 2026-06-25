/**
 * AnnexEvidenceNav.jsx
 *
 * Navegación interna de un anexo conceptual.
 * Muestra 4 botones (Figuras · Tablas · Interactivos · Series) que hacen
 * scroll suave a la sección correspondiente dentro del mismo anexo.
 *
 * No navega a rutas externas. No abre anexos legacy.
 * Usa scrollIntoView — funciona solo en el cliente (SSR-safe).
 *
 * Props:
 *   items   { label: string, target: string }[]
 *           label  — texto del botón ('Figuras', 'Tablas', …)
 *           target — id del elemento DOM al que hace scroll
 *
 * Ejemplo:
 *   <AnnexEvidenceNav
 *     items={[
 *       { label: 'Figuras',       target: 'figuras-t1' },
 *       { label: 'Tablas',        target: 'tablas-t1'  },
 *       { label: 'Interactivos',  target: 'interactivos-t1' },
 *       { label: 'Series',        target: 'series-t1'  },
 *     ]}
 *   />
 */

import React, { useState, useEffect } from 'react';
import { useDocLang } from '@site/src/hooks/useDocLang';
import styles from './AnnexEvidenceNav.module.css';

const TYPE_ICONS = {
  Figuras: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Tablas: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="9" x2="9" y2="21" />
      <line x1="15" y1="9" x2="15" y2="21" />
    </svg>
  ),
  Interactivos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="21" />
    </svg>
  ),
  Series: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

function scrollToSection(targetId) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function AnnexEvidenceNav({ items = [] }) {
  const lang = useDocLang();
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !items.length) return;
    const ids = items.map(i => i.target);
    const observers = [];
    const ratios = {};

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[id] = entry.intersectionRatio;
          const best = ids.reduce((a, b) => ((ratios[b] || 0) > (ratios[a] || 0) ? b : a), ids[0]);
          if (ratios[best] > 0) setActiveId(best);
        },
        { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-10% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [items]);

  if (!items.length) return null;

  const getNavLabel = (l) => {
    switch (l) {
      case 'en': return 'Sections';
      case 'de': return 'Abschnitte';
      case 'zh-Hans': return '章节';
      default: return 'Secciones';
    }
  };

  const getAriaLabel = (l, label) => {
    switch (l) {
      case 'en': return `Go to section ${label}`;
      case 'de': return `Gehe zu Bereich ${label}`;
      case 'zh-Hans': return `前往 ${label} 部分`;
      default: return `Ir a sección de ${label}`;
    }
  };

  const getNavAriaLabel = (l) => {
    switch (l) {
      case 'en': return 'Annex section navigation';
      case 'de': return 'Navigation der Anhangsabschnitte';
      case 'zh-Hans': return '附录章节导航';
      default: return 'Navegación de secciones del anexo';
    }
  };

  return (
    <nav className={styles.navWrapper} aria-label={getNavAriaLabel(lang)}>
      <span className={styles.navLabel}>{getNavLabel(lang)}</span>
      <div className={styles.navButtons}>
        {items.map(({ label, target }) => {
          const icon = TYPE_ICONS[label] || null;
          return (
            <button
              key={target}
              type="button"
              className={`${styles.navBtn} ${activeId === target ? styles.navBtnActive : ''}`}
              aria-label={getAriaLabel(lang, label)}
              aria-current={activeId === target ? 'true' : undefined}
              onClick={() => scrollToSection(target)}
            >
              <span className={styles.navBtnIcon} aria-hidden="true">{icon}</span>
              <span className={styles.navBtnLabel}>{label}</span>
              {activeId === target && <span className={styles.navBtnDot} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
