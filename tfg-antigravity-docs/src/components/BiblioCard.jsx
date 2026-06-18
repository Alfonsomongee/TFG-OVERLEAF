import React, { useState, useMemo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './BiblioCard.module.css';
import { BIBLIOGRAPHY } from '../data/bibliography';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SpotlightCard from './ReactBits/SpotlightCard';
import MetricCountUp from '@site/src/components/ui/MetricCountUp';

const TYPE_LABELS = {
  informe: 'Informes oficiales',
  investigacion: 'Investigación',
  normativa: 'Normativa',
};

const TYPE_SPOTLIGHT = {
  informe: 'rgba(56, 189, 248, 0.13)',
  investigacion: 'rgba(74, 222, 128, 0.11)',
  normativa: 'rgba(251, 191, 36, 0.11)',
};

const TYPE_ACCENT = {
  informe: '#38bdf8',
  investigacion: '#4ade80',
  normativa: '#fbbf24',
};

function detectType(title) {
  const t = title.toLowerCase();
  if (
    t.includes('boe') ||
    t.includes('real decreto') ||
    t.includes('resolución de') ||
    t.includes('network code') ||
    t.includes('recommendation to the european commission') ||
    t.includes('acer,')
  ) return 'normativa';
  if (
    t.includes('entso-e') ||
    t.includes('red eléctrica') ||
    t.includes('redeia') ||
    t.includes('gobierno de españa') ||
    t.includes('ministerio') ||
    t.includes('cnmc') ||
    t.includes('futured') ||
    t.includes('presentación gubernamental') ||
    t.includes('consejo de seguridad nacional')
  ) return 'informe';
  return 'investigacion';
}

// Enrich bibliography with detected types once
const ENRICHED = BIBLIOGRAPHY.map(ref => ({ ...ref, type: detectType(ref.title) }));
const PDF_COUNT = BIBLIOGRAPHY.filter(r => r.pdf).length;

export default function BiblioCard() {
  const [selectedType, setSelectedType] = useState(null);
  const [searchBiblio, setSearchBiblio] = useState('');
  const listRef = useRef(null);

  const typeCounts = useMemo(() => {
    return ENRICHED.reduce((acc, ref) => {
      acc[ref.type] = (acc[ref.type] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const filteredBiblio = useMemo(() => {
    let list = ENRICHED;
    if (selectedType) list = list.filter(r => r.type === selectedType);
    if (searchBiblio.trim()) {
      const q = searchBiblio.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q));
    }
    return list;
  }, [selectedType, searchBiblio]);

  // GSAP scroll-reveal via IntersectionObserver
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('[data-ref-card]');
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(cards).indexOf(entry.target);
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 22 },
              {
                opacity: 1,
                y: 0,
                duration: 0.48,
                ease: 'power3.out',
                delay: Math.min(index % 6 * 0.07, 0.32),
                clearProps: 'transform,opacity',
              }
            );
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach(card => io.observe(card));
    return () => io.disconnect();
  }, [filteredBiblio]);

  return (
    <div className={styles.biblioContainer}>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statChip}>
          <span className={styles.statValue}>
            <MetricCountUp endValue={BIBLIOGRAPHY.length} duration={900} />
          </span>
          <span className={styles.statLabel}>fuentes</span>
        </div>
        <div className={styles.statChip}>
          <span className={styles.statValue}>
            <MetricCountUp endValue={PDF_COUNT} duration={900} />
          </span>
          <span className={styles.statLabel}>PDFs disponibles</span>
        </div>
        {Object.entries(typeCounts).map(([type, count]) => (
          <div key={type} className={styles.statChip} style={{ '--chip-accent': TYPE_ACCENT[type] }}>
            <span className={styles.statValue} style={{ color: TYPE_ACCENT[type] }}>
              <MetricCountUp endValue={count} duration={900} />
            </span>
            <span className={styles.statLabel}>{TYPE_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Buscar por autor, institución o título..."
            value={searchBiblio}
            onChange={e => setSearchBiblio(e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar referencias"
          />
          {searchBiblio && (
            <button className={styles.clearBtn} onClick={() => setSearchBiblio('')} aria-label="Limpiar">✕</button>
          )}
        </div>

        <div className={styles.filterRow}>
          <button
            className={`${styles.filterBtn} ${!selectedType ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedType(null)}
          >
            Todas
          </button>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              className={`${styles.filterBtn} ${selectedType === type ? styles.filterBtnActive : ''}`}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              style={selectedType === type ? { '--btn-accent': TYPE_ACCENT[type] } : {}}
            >
              {label}
              <span className={styles.filterCount}>{typeCounts[type] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* References list */}
      {filteredBiblio.length > 0 ? (
        <div className={styles.referencesList} ref={listRef}>
          {filteredBiblio.map((ref) => (
            <div key={ref.id} data-ref-card="true">
              <SpotlightCard
                className={styles.referenceCard}
                spotlightColor={TYPE_SPOTLIGHT[ref.type] ?? 'rgba(255,255,255,0.08)'}
              >
                <div className={styles.refMeta}>
                  <span
                    className={styles.refTypeDot}
                    style={{ background: TYPE_ACCENT[ref.type] }}
                    title={TYPE_LABELS[ref.type]}
                  />
                  <span className={styles.refId}>[{ref.id}]</span>
                </div>
                <div className={styles.title}>
                  {ref.title}
                  {ref.pdf && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <a
                        href={useBaseUrl(ref.pdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button--secondary button--sm"
                      >
                        Descargar Informe PDF
                      </a>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No se encontraron referencias para tu búsqueda.</p>
          <button
            className={styles.resetBtn}
            onClick={() => { setSearchBiblio(''); setSelectedType(null); }}
          >
            Ver todas las referencias
          </button>
        </div>
      )}

      <div className={styles.biblioFooter}>
        <p>
          <em>
            Compilación de referencias técnicas del análisis del colapso ibérico del
            28 de abril de 2025
          </em>
        </p>
      </div>
    </div>
  );
}
