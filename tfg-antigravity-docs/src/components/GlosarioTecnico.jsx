import React, { useState, useMemo } from 'react';
import styles from './GlosarioTecnico.module.css';

import { GLOSSARY_TERMS as esTerms } from '../data/glossary';
import { GLOSSARY_TERMS as enTerms } from '../data/glossary_en';

export default function GlosarioTecnico({ lang = 'es' }) {
  const GLOSSARY_TERMS = lang === 'en' ? enTerms : esTerms;
  
  const strings = {
    searchPlaceholder: lang === 'en' ? "Search term or definition..." : "Buscar término o definición...",
    all: lang === 'en' ? "All" : "Todas",
    showing: lang === 'en' ? "Showing" : "Mostrando",
    of: lang === 'en' ? "of" : "de",
    terms: lang === 'en' ? "terms" : "términos",
    noResults: lang === 'en' ? "No terms found matching your search." : "No se encontraron términos que coincidan con tu búsqueda.",
    reset: lang === 'en' ? "Reset search" : "Reiniciar búsqueda",
    footer: lang === 'en' 
      ? "Last updated: May 2026 — Alfonso Monge García, ETSI Universidad de Sevilla" 
      : "Última actualización: mayo 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
  };
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
          placeholder={strings.searchPlaceholder}
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
          {strings.all}
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
        {strings.showing} {filteredTerms.length} {strings.of} {GLOSSARY_TERMS.length} {strings.terms}
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
          <p>{strings.noResults}</p>
          <button
            className={styles.resetButton}
            onClick={() => {
              setSearchTerm('');
              setSelectedLetter(null);
            }}
          >
            {strings.reset}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.glossaryFooter}>
        <p>
          <em>
            {strings.footer}
          </em>
        </p>
      </div>
    </div>
  );
}
