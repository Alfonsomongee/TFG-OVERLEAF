/**
 * GlossaryDefinitionPanel.jsx
 *
 * Panel flotante lateral derecho que aparece al pasar el cursor sobre
 * cualquier elemento con clase `glossary-term` (generados por el plugin
 * remark-auto-glossary-links en build time).
 *
 * Características:
 *   - Montado globalmente en Root.js → activo en todos los capítulos
 *   - Event delegation sobre `document` → sin re-renders al navegar
 *   - Posición fija a la derecha (sin tapar el texto principal)
 *   - Solo visible en desktop (≥ 997 px). En móvil: oculto por CSS
 *   - BrowserOnly: seguro para SSR de Docusaurus
 *
 * Datos: src/data/glossary-terms.json  →  [{ term, definition }]
 */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { useDocLang } from '@site/src/hooks/useDocLang';
import { GLOSSARY_TERMS as GLOSSARY_ES } from '@site/src/data/glossary';
import { GLOSSARY_TERMS as GLOSSARY_EN } from '@site/src/data/glossary_en';
import { GLOSSARY_TERMS as GLOSSARY_DE } from '@site/src/data/glossary_de';
import { GLOSSARY_TERMS as GLOSSARY_ZH } from '@site/src/data/glossary_zh-Hans';

// ── Componente interno (solo cliente) ────────────────────────────────────────
function PanelInner() {
  const [active, setActive] = useState(null); // { term, definition } | null
  const [phase, setPhase] = useState('visible'); // 'opening' | 'visible' | 'closing'
  const timeoutRef = useRef(null);
  const fadeOutRef = useRef(null);
  const openTimeoutRef = useRef(null);
  const { i18n: { currentLocale: lang } } = useDocusaurusContext();

  const termsMap = useMemo(() => {
    const glossaryTerms = lang === 'en' ? GLOSSARY_EN
    : lang === 'de' ? GLOSSARY_DE
    : lang === 'zh-Hans' ? GLOSSARY_ZH
    : GLOSSARY_ES;
    const map = {};
    for (const entry of glossaryTerms) {
      const key = entry.term.toLowerCase();
      if (!map[key]) map[key] = entry;
    }
    return map;
  }, [lang]);

  const resolveEntry = useCallback((termRaw) => {
    const key = termRaw.toLowerCase();
    const entries = Object.values(termsMap);

    return termsMap[key] || entries.find((entry) => {
      const term = entry.term.toLowerCase();
      const parentheticalAliases = [...entry.term.matchAll(/\(([^)]+)\)/g)]
        .map((match) => match[1].toLowerCase());

      return (
        entry.term === termRaw ||
        term === key ||
        term.startsWith(key) ||
        parentheticalAliases.some((alias) => alias === key)
      );
    });
  }, [termsMap]);

  // Cancelación centralizada de todos los timers pendientes
  const cancelAll = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (fadeOutRef.current) { clearTimeout(fadeOutRef.current); fadeOutRef.current = null; }
    if (openTimeoutRef.current) { clearTimeout(openTimeoutRef.current); openTimeoutRef.current = null; }
  }, []);

  const handleEnter = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;
    if (!el) return;

    // Hover bridge: cancelar cualquier cierre o apertura pendiente
    cancelAll();
    setPhase('visible');

    if (el.classList.contains('glossary-term')) {
      const termRaw = el.dataset.term || '';
      const entry = resolveEntry(termRaw);

      if (entry) {
        openTimeoutRef.current = setTimeout(() => {
          setPhase('opening');
          setActive(entry);
          // Transición opening → visible tras la animación de entrada (200ms)
          openTimeoutRef.current = setTimeout(() => setPhase('visible'), 200);
        }, 220); // delay de apertura: 220ms
      }
    }
  }, [cancelAll, resolveEntry]);

  const handleLeave = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;

    // Cancelar apertura pendiente si el usuario se fue antes del delay
    if (openTimeoutRef.current) { clearTimeout(openTimeoutRef.current); openTimeoutRef.current = null; }

    if (el) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setPhase('closing');
        fadeOutRef.current = setTimeout(() => {
          setActive(null);
          setPhase('visible');
        }, 300); // duración del fade-out: 300ms
      }, 500); // gracia antes de iniciar cierre: 500ms (tiempo para cruzar al panel)
    }
  }, []);

  useEffect(() => {
    document.addEventListener('pointerenter', handleEnter, true);
    document.addEventListener('pointerleave', handleLeave, true);
    return () => {
      document.removeEventListener('pointerenter', handleEnter, true);
      document.removeEventListener('pointerleave', handleLeave, true);
      cancelAll();
    };
  }, [handleEnter, handleLeave, cancelAll]);

  if (!active) return null;

  // Primera frase como definición breve (para el header)
  const getFirstSentence = (text) => {
    if (!text) return '';
    const m = text.match(/^.+?[.!?。]/);
    return m ? m[0].trim() : text.split(' ').slice(0, 12).join(' ');
  };

  // Resumen expandido (1-2 frases según longitud)
  const getSummary = (text, l) => {
    if (!text) return '';
    const sentences = text.split(/(?<=[.!?。])\s*(?=[A-ZÁÉÍÓÚÜÑ一-龥])/);
    if (sentences.length > 0) {
      let sum = sentences[0].trim();
      let idx = 1;
      const threshold = l === 'zh-Hans' ? 35 : 80;
      while (sum.length < threshold && idx < sentences.length) {
        sum += ' ' + sentences[idx].trim();
        idx++;
      }
      return sum;
    }
    return text;
  };

  const getLinkLabel = (l) => {
    switch (l) {
      case 'en': return 'Full definition ↗';
      case 'de': return 'Vollständig ↗';
      case 'zh-Hans': return '完整定义 ↗';
      default: return 'Definición completa ↗';
    }
  };

  const getCategoryLabel = (l) => {
    switch (l) {
      case 'en': return 'Technical Glossary';
      case 'de': return 'Technisches Glossar';
      case 'zh-Hans': return '技术词汇表';
      default: return 'Glosario Técnico';
    }
  };

  const brief = getFirstSentence(active.definition);
  const summary = getSummary(active.definition, lang);
  const showBrief = brief && brief !== summary && brief.length < 90;
  const linkLabel = getLinkLabel(lang);
  const glossaryLink = `${lang === 'es' ? '' : '/' + lang}/glosario#${active.id}`;

  return (
    <aside
      className={`glossary-definition-panel ${phase}`}
      aria-live="polite"
      aria-label={`Definición: ${active.term}`}
    >
      <div className="glossary-panel-header">
        <span className="glossary-panel-label">{getCategoryLabel(lang)}</span>
        <strong className="glossary-panel-term">{active.term}</strong>
        {showBrief && (
          <span className="glossary-panel-brief">{brief}</span>
        )}
      </div>
      <hr className="glossary-panel-divider" />
      <div className="glossary-panel-body" style={{ scrollbarWidth: 'none' }}>
        <p style={{ margin: 0 }}>{summary}</p>
      </div>
      <div className="glossary-panel-footer">
        <Link to={glossaryLink} className="glossary-panel-link">
          {linkLabel}
        </Link>
      </div>
    </aside>
  );
}

// ── Export con BrowserOnly (safe SSR) ───────────────────────────────────────
export default function GlossaryDefinitionPanel() {
  return (
    <BrowserOnly fallback={null}>
      {() => <PanelInner />}
    </BrowserOnly>
  );
}
