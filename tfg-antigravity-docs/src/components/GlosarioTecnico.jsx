import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import MetricCountUp from '@site/src/components/ui/MetricCountUp';
import styles from './GlosarioTecnico.module.css';

import { GLOSSARY_TERMS as esTerms } from '../data/glossary';
import { GLOSSARY_TERMS as enTerms } from '../data/glossary_en';
import { GLOSSARY_TERMS as ptTerms } from '../data/glossary_pt';
import { GLOSSARY_TERMS as frTerms } from '../data/glossary_fr';
import { GLOSSARY_TERMS as itTerms } from '../data/glossary_it';
import { GLOSSARY_TERMS as deTerms } from '../data/glossary_de';
import { GLOSSARY_TERMS as zhTerms } from '../data/glossary_zh-Hans';

const LONG_THRESHOLD = 200;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

const groupVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease', display: 'block' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TermItem({ term }) {
  const [activo, setActivo] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const isLong = term.definition.length > LONG_THRESHOLD;

  useEffect(() => {
    if (location.hash === `#${term.id}`) {
      setActivo(true);
      setExpanded(true);
      const quitar = () => setActivo(false);
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

  const handleCopy = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${term.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [term.id]);

  return (
    <div
      id={term.id}
      className={`${styles.termItem} ${activo ? styles.termItemActive : ''}`}
    >
      <div className={styles.termHeader}>
        <h3 className={styles.termTitle}>
          <a href={`#${term.id}`}>{term.term}</a>
        </h3>
        <div className={styles.termActions}>
          <button
            className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
            onClick={handleCopy}
            aria-label="Copiar enlace"
            title={copied ? 'Copiado ✓' : 'Copiar enlace'}
          >
            {copied ? '✓' : <CopyIcon />}
          </button>
        </div>
      </div>

      {isLong ? (
        <>
          <motion.div
            animate={{ height: expanded ? 'auto' : '4.8rem' }}
            initial={false}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <p className={styles.termDefinition}>{term.definition}</p>
            {!expanded && <div className={styles.fadeGradient} />}
          </motion.div>
          <button
            className={styles.readMoreBtn}
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {expanded ? 'Ver menos' : 'Ver más'}
            <ChevronIcon expanded={expanded} />
          </button>
        </>
      ) : (
        <p className={styles.termDefinition}>{term.definition}</p>
      )}
    </div>
  );
}

export default function GlosarioTecnico() {
  const { i18n: { currentLocale: lang } } = useDocusaurusContext();
  const searchRef = useRef(null);

  let GLOSSARY_TERMS = esTerms;
  if (lang === 'en') GLOSSARY_TERMS = enTerms;
  if (lang === 'pt') GLOSSARY_TERMS = ptTerms;
  if (lang === 'fr') GLOSSARY_TERMS = frTerms;
  if (lang === 'it') GLOSSARY_TERMS = itTerms;
  if (lang === 'de') GLOSSARY_TERMS = deTerms;
  if (lang === 'zh-Hans') GLOSSARY_TERMS = zhTerms;

  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        searchPlaceholder: 'Search term or definition...',
        noResults: 'No terms found matching your search.',
        showing: 'Showing', of: 'of', terms: 'terms',
        all: 'All', reset: 'Reset search',
        footer: 'Last updated: May 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
      case 'pt': return {
        searchPlaceholder: 'Pesquisar termo ou definição...',
        noResults: 'Nenhum termo encontrado para sua busca.',
        showing: 'Mostrando', of: 'de', terms: 'termos',
        all: 'Todas', reset: 'Reiniciar pesquisa',
        footer: 'Última atualização: maio 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
      case 'fr': return {
        searchPlaceholder: 'Rechercher un terme ou une définition...',
        noResults: 'Aucun terme trouvé correspondant à votre recherche.',
        showing: 'Affichage', of: 'sur', terms: 'termes',
        all: 'Toutes', reset: 'Réinitialiser la recherche',
        footer: 'Dernière mise à jour : mai 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
      case 'it': return {
        searchPlaceholder: 'Cerca termine o definizione...',
        noResults: 'Nessun termine trovato per la ricerca.',
        showing: 'Mostrando', of: 'di', terms: 'termini',
        all: 'Tutte', reset: 'Ripristina ricerca',
        footer: 'Ultimo aggiornamento: maggio 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
      case 'de': return {
        searchPlaceholder: 'Begriff oder Definition suchen...',
        noResults: 'Keine Begriffe für Ihre Suche gefunden.',
        showing: 'Zeige', of: 'von', terms: 'Begriffe',
        all: 'Alle', reset: 'Suche zurücksetzen',
        footer: 'Letzte Aktualisierung: Mai 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
      case 'zh-Hans': return {
        searchPlaceholder: '搜索术语或定义...',
        noResults: '未找到匹配您搜索的术语。',
        showing: '显示', of: '共', terms: '个术语',
        all: '全部', reset: '重置搜索',
        footer: '最后更新：2026年5月 — Alfonso Monge Díaz-Ángel，塞维利亚大学ETSI',
      };
      default: return {
        searchPlaceholder: 'Buscar término o definición...',
        noResults: 'No se encontraron términos que coincidan con tu búsqueda.',
        showing: 'Mostrando', of: 'de', terms: 'términos',
        all: 'Todas', reset: 'Reiniciar búsqueda',
        footer: 'Última actualización: mayo 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla',
      };
    }
  };

  const strings = getStrings(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // '/' shortcut → focus search input
  useEffect(() => {
    const handler = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const letters = useMemo(
    () => [...new Set(GLOSSARY_TERMS.map((t) => t.letter))].sort(),
    []
  );

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || term.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter]);

  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.letter]) groups[term.letter] = [];
      groups[term.letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleLetterFilter = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  const filterKey = `${searchTerm}::${selectedLetter}`;

  return (
    <div className={styles.glosarioContainer}>

      {/* Search */}
      <div className={styles.searchSection}>
        <input
          ref={searchRef}
          type="text"
          placeholder={strings.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar en glosario"
        />
        {!searchTerm && (
          <span className={styles.kbdHint} aria-hidden="true">/</span>
        )}
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

      {/* Letter filter — sticky */}
      <div className={styles.letterFilter}>
        <button
          className={`${styles.letterButton} ${selectedLetter === null ? styles.active : ''}`}
          onClick={() => setSelectedLetter(null)}
        >
          {strings.all}
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`${styles.letterButton} ${selectedLetter === letter ? styles.active : ''}`}
            onClick={() => handleLetterFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results count with animated CountUp */}
      <div className={styles.resultsInfo}>
        {strings.showing}{' '}
        <MetricCountUp
          key={filterKey}
          endValue={filteredTerms.length}
          duration={500}
          locale={lang === 'zh-Hans' ? 'zh-CN' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-PT' : 'es-ES'}
        />{' '}
        {strings.of} {GLOSSARY_TERMS.length} {strings.terms}
      </div>

      {/* Terms display with stagger */}
      {Object.keys(groupedTerms).length > 0 ? (
        <motion.div
          key={filterKey}
          className={styles.termsContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => (
              <motion.div key={letter} variants={groupVariants} className={styles.letterGroup}>
                <h2 className={styles.letterHeader}>{letter}</h2>
                <div className={styles.termsList}>
                  {groupedTerms[letter].map((term) => (
                    <TermItem key={term.id} term={term} />
                  ))}
                </div>
              </motion.div>
            ))}
        </motion.div>
      ) : (
        <div className={styles.noResults}>
          <p>{strings.noResults}</p>
          <button
            className={styles.resetButton}
            onClick={() => { setSearchTerm(''); setSelectedLetter(null); }}
          >
            {strings.reset}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.glossaryFooter}>
        <p><em>{strings.footer}</em></p>
      </div>
    </div>
  );
}
