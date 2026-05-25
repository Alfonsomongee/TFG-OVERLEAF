import React, { useState, useMemo, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import styles from './GlosarioTecnico.module.css';

import { GLOSSARY_TERMS as esTerms } from '../data/glossary';
import { GLOSSARY_TERMS as enTerms } from '../data/glossary_en';
import { GLOSSARY_TERMS as ptTerms } from '../data/glossary_pt';
import { GLOSSARY_TERMS as frTerms } from '../data/glossary_fr';
import { GLOSSARY_TERMS as itTerms } from '../data/glossary_it';
import { GLOSSARY_TERMS as deTerms } from '../data/glossary_de';

function TermItem({ term }) {
  const [activo, setActivo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === `#${term.id}`) {
      setActivo(true);
      const quitar = () => setActivo(false);
      // Esperar un poco antes de añadir los listeners para evitar que el click actual lo borre
      const timer = setTimeout(() => {
        window.addEventListener('scroll', quitar, { once: true, passive: true });
        window.addEventListener('click', quitar, { once: true });
      }, 500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', quitar);
        window.removeEventListener('click', quitar);
      };
    } else {
      setActivo(false);
    }
  }, [location.hash, term.id]);

  return (
    <div 
      id={term.id} 
      className={`${styles.termItem} ${activo ? styles.termItemActive : ''}`}
    >
      <h3 className={styles.termTitle}>
        <a href={`#${term.id}`}>{term.term}</a>
      </h3>
      <p className={styles.termDefinition}>{term.definition}</p>
    </div>
  );
}

export default function GlosarioTecnico({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const lang = propLang || i18n.currentLocale || 'es';
  
  let GLOSSARY_TERMS = esTerms;
  if (lang === 'en') GLOSSARY_TERMS = enTerms;
  if (lang === 'pt') GLOSSARY_TERMS = ptTerms;
  if (lang === 'fr') GLOSSARY_TERMS = frTerms;
  if (lang === 'it') GLOSSARY_TERMS = itTerms;
  if (lang === 'de') GLOSSARY_TERMS = deTerms;
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        searchPlaceholder: "Search term or definition...",
        noResults: "No terms found matching your search.",
        showing: "Showing",
        of: "of",
        terms: "terms",
        all: "All",
        reset: "Reset search",
        footer: "Last updated: May 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
      case 'pt': return {
        searchPlaceholder: "Pesquisar termo ou definição...",
        noResults: "Nenhum termo encontrado para sua busca.",
        showing: "Mostrando",
        of: "de",
        terms: "termos",
        all: "Todas",
        reset: "Reiniciar pesquisa",
        footer: "Última atualização: maio 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
      case 'fr': return {
        searchPlaceholder: "Rechercher un terme ou une définition...",
        noResults: "Aucun terme trouvé correspondant à votre recherche.",
        showing: "Affichage",
        of: "sur",
        terms: "termes",
        all: "Toutes",
        reset: "Réinitialiser la recherche",
        footer: "Dernière mise à jour : mai 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
      case 'it': return {
        searchPlaceholder: "Cerca termine o definizione...",
        noResults: "Nessun termine trovato per la ricerca.",
        showing: "Mostrando",
        of: "di",
        terms: "termini",
        all: "Tutte",
        reset: "Ripristina ricerca",
        footer: "Ultimo aggiornamento: maggio 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
      case 'de': return {
        searchPlaceholder: "Begriff oder Definition suchen...",
        noResults: "Keine Begriffe für Ihre Suche gefunden.",
        showing: "Zeige",
        of: "von",
        terms: "Begriffe",
        all: "Alle",
        reset: "Suche zurücksetzen",
        footer: "Letzte Aktualisierung: Mai 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
      default: return {
        searchPlaceholder: "Buscar término o definición...",
        noResults: "No se encontraron términos que coincidan con tu búsqueda.",
        showing: "Mostrando",
        of: "de",
        terms: "términos",
        all: "Todas",
        reset: "Reiniciar búsqueda",
        footer: "Última actualización: mayo 2026 — Alfonso Monge García, ETSI Universidad de Sevilla"
      };
    }
  };
  const strings = getStrings(lang);
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
                    <TermItem key={term.id} term={term} />
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
