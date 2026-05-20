import React, { useState, useMemo } from 'react';
import styles from './GlosarioTecnico.module.css';

import { GLOSSARY_TERMS } from '../data/glossary';

export default function GlosarioTecnico() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Get unique letters
  const letters = useMemo(
    () => [...new Set(GLOSSARY_TERMS.map((t) => t.letter))].sort(),
    []
  );

  // Filter terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || term.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter]);

  // Group by letter
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.letter]) {
        groups[term.letter] = [];
      }
      groups[term.letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleLetterFilter = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  return (
    <div className={styles.glosarioContainer}>
      {/* Search Section */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Buscar término o definición..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar en glosario"
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Letter Filter */}
      <div className={styles.letterFilter}>
        <button
          className={`${styles.letterButton} ${
            selectedLetter === null ? styles.active : ''
          }`}
          onClick={() => setSelectedLetter(null)}
        >
          Todas
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`${styles.letterButton} ${
              selectedLetter === letter ? styles.active : ''
            }`}
            onClick={() => handleLetterFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        Mostrando {filteredTerms.length} de {GLOSSARY_TERMS.length} términos
      </div>

      {/* Terms Display */}
      {Object.keys(groupedTerms).length > 0 ? (
        <div className={styles.termsContainer}>
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => (
              <div key={letter} className={styles.letterGroup}>
                <h2 className={styles.letterHeader}>{letter}</h2>
                <div className={styles.termsList}>
                  {groupedTerms[letter].map((term) => (
                    <div key={term.id} id={term.id} className={styles.termItem}>
                      <h3 className={styles.termTitle}>
                        <a href={`#${term.id}`}>{term.term}</a>
                      </h3>
                      <p className={styles.termDefinition}>{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No se encontraron términos que coincidan con tu búsqueda.</p>
          <button
            className={styles.resetButton}
            onClick={() => {
              setSearchTerm('');
              setSelectedLetter(null);
            }}
          >
            Reiniciar búsqueda
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.glossaryFooter}>
        <p>
          <em>
            Última actualización: mayo 2026 — Alfonso Monge García, ETSI
            Universidad de Sevilla
          </em>
        </p>
      </div>
    </div>
  );
}
