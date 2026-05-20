import React, { useState, useMemo } from 'react';
import styles from './BiblioCard.module.css';

const BIBLIOGRAPHY_REFERENCES = [
  {
    id: 1,
    year: 2025,
    authors: 'Consejo de Seguridad Nacional & Red Eléctrica de España',
    title: 'Informe de evaluación del evento de estabilidad del 28 de abril de 2025 en el sistema eléctrico peninsular',
    type: 'Official Report',
    url: 'https://www.ree.es',
  },
  {
    id: 2,
    year: 2025,
    authors: 'Instituto de Investigación Tecnológica (IIT-ICAI) & Compass Lexecon',
    title: 'Technical assessment report on the April 28, 2025 Iberian Power System event',
    type: 'Technical Report',
    url: null,
  },
  {
    id: 3,
    year: 2025,
    authors: 'ENTSO-E (European Network of Transmission System Operators for Electricity)',
    title: 'Continental Europe Synchronous Area stability analysis and NC RfG 2.0 proposal',
    type: 'Technical Report',
    url: 'https://www.entsoe.eu',
  },
  {
    id: 4,
    year: 2023,
    authors: 'Kundur, P., Balu, N. J., & Laufenberg, M. J.',
    title: 'Power system stability and control',
    type: 'Textbook',
    url: null,
  },
  {
    id: 5,
    year: 2022,
    authors: 'Ulrich, S., Müller, S., & Larsson, M.',
    title: 'Advanced grid-forming inverter control for weak grids',
    type: 'Journal Article',
    url: 'https://doi.org/10.1109/TPWRD.2022.3181456',
  },
  {
    id: 6,
    year: 2024,
    authors: 'National Renewable Energy Laboratory (NREL)',
    title: 'Transient stability assessment of high IBR penetration systems using PMU data',
    type: 'Research Report',
    url: 'https://www.nrel.gov',
  },
  {
    id: 7,
    year: 2021,
    authors: 'Institute of Electrical and Electronics Engineers (IEEE)',
    title: 'IEEE 2000: Guide for the Design and Application of Synchronous Machines',
    type: 'Standard',
    url: null,
  },
  {
    id: 8,
    year: 2023,
    authors: 'European Union & ENTSO-E',
    title: 'Network Code on Requirements for Grid Connection (NC RfG) - 2.0 Revision',
    type: 'Regulation',
    url: 'https://www.entsoe.eu/network-codes',
  },
];

const TYPE_COLORS = {
  'Official Report': '#dc2626',
  'Technical Report': '#2563eb',
  'Journal Article': '#7c3aed',
  'Textbook': '#ea580c',
  'Research Report': '#0891b2',
  'Standard': '#059669',
  'Regulation': '#6366f1',
};

export default function BiblioCard() {
  const [filterType, setFilterType] = useState(null);
  const [sortBy, setSortBy] = useState('year-desc');

  // Get unique types
  const types = useMemo(
    () => [...new Set(BIBLIOGRAPHY_REFERENCES.map((ref) => ref.type))],
    []
  );

  // Filter and sort references
  const filteredReferences = useMemo(() => {
    let filtered = filterType
      ? BIBLIOGRAPHY_REFERENCES.filter((ref) => ref.type === filterType)
      : BIBLIOGRAPHY_REFERENCES;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'year-desc') {
        return b.year - a.year;
      } else if (sortBy === 'year-asc') {
        return a.year - b.year;
      } else if (sortBy === 'author-asc') {
        return a.authors.localeCompare(b.authors);
      }
      return 0;
    });

    return sorted;
  }, [filterType, sortBy]);

  return (
    <div className={styles.biblioContainer}>
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total referencias:</span>
          <span className={styles.statValue}>{BIBLIOGRAPHY_REFERENCES.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Mostrando:</span>
          <span className={styles.statValue}>{filteredReferences.length}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Filtrar por tipo:</label>
          <div className={styles.typeButtons}>
            <button
              className={`${styles.typeButton} ${
                filterType === null ? styles.active : ''
              }`}
              onClick={() => setFilterType(null)}
            >
              Todos ({BIBLIOGRAPHY_REFERENCES.length})
            </button>
            {types.map((type) => {
              const count = BIBLIOGRAPHY_REFERENCES.filter(
                (ref) => ref.type === type
              ).length;
              return (
                <button
                  key={type}
                  className={`${styles.typeButton} ${
                    filterType === type ? styles.active : ''
                  }`}
                  onClick={() => setFilterType(type)}
                  style={
                    filterType === type
                      ? {
                          backgroundColor: TYPE_COLORS[type] || '#000',
                          color: 'white',
                        }
                      : {}
                  }
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.sortSection}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="year-desc">Año (más reciente)</option>
            <option value="year-asc">Año (más antiguo)</option>
            <option value="author-asc">Autor (A-Z)</option>
          </select>
        </div>
      </div>

      <div className={styles.referencesList}>
        {filteredReferences.map((ref) => (
          <div
            key={ref.id}
            className={styles.referenceCard}
            style={{
              borderLeftColor: TYPE_COLORS[ref.type] || '#999',
            }}
          >
            <div
              className={styles.typeBadge}
              style={{
                backgroundColor: TYPE_COLORS[ref.type] || '#999',
              }}
            >
              {ref.type}
            </div>

            <div className={styles.refId}>[{ref.id}]</div>

            <div className={styles.authors}>{ref.authors}</div>

            <div className={styles.year}>({ref.year})</div>

            <div className={styles.title}>
              <strong>{ref.title}</strong>
            </div>

            {ref.url && (
              <div className={styles.urlLink}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Acceder al recurso →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay referencias que coincidan con los filtros seleccionados.</p>
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
