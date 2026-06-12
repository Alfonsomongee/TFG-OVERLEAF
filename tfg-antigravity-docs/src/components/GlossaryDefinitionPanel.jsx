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
import { useDocLang } from '@site/src/hooks/useDocLang';
import { GLOSSARY_TERMS as GLOSSARY_ES } from '@site/src/data/glossary';
import { GLOSSARY_TERMS as GLOSSARY_EN } from '@site/src/data/glossary_en';
import { GLOSSARY_TERMS as GLOSSARY_DE } from '@site/src/data/glossary_de';
import { GLOSSARY_TERMS as GLOSSARY_ZH } from '@site/src/data/glossary_zh-Hans';

// ── Componente interno (solo cliente) ────────────────────────────────────────
function PanelInner() {
  const [active, setActive] = useState(null); // { term, definition } | null
  const [isClosing, setIsClosing] = useState(false);
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

  const handleEnter = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;
    if (!el) return;
    
    // Si entramos en la palabra O en la propia tarjeta, cancelamos el cierre (Hover Bridge)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fadeOutRef.current) clearTimeout(fadeOutRef.current);
    setIsClosing(false);

    // Si es un término de glosario, iniciamos un temporizador de 500ms para abrirlo
    if (el.classList.contains('glossary-term')) {
      const termRaw = el.dataset.term || '';
      const key = termRaw.toLowerCase();
      const entry = termsMap[key] || Object.values(termsMap).find(t => t.term === termRaw || t.term.toLowerCase().startsWith(key));
      
      if (entry) {
        // Cancelar cualquier temporizador de apertura anterior para evitar duplicaciones
        if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
        
        openTimeoutRef.current = setTimeout(() => {
          setActive(entry);
        }, 500); // 0.5 segundos de retraso
      }
    }
  }, [termsMap]);

  const handleLeave = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;
    
    // Si salimos de la palabra o de la tarjeta, cancelamos cualquier apertura pendiente
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Si salimos de la palabra o de la tarjeta, iniciamos el temporizador de cierre
    if (el) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsClosing(true);
        fadeOutRef.current = setTimeout(() => {
          setActive(null);
          setIsClosing(false);
        }, 2000); // 2 segundos de fade-out
      }, 450); // 450ms de gracia antes de iniciar fade
    }
  }, []);

  useEffect(() => {
    // Delegación de eventos: un único listener en document para todos los spans
    document.addEventListener('mouseenter', handleEnter, true);
    document.addEventListener('mouseleave', handleLeave, true);
    return () => {
      document.removeEventListener('mouseenter', handleEnter, true);
      document.removeEventListener('mouseleave', handleLeave, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeOutRef.current) clearTimeout(fadeOutRef.current);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    };
  }, [handleEnter, handleLeave]);

  if (!active) return null;

  return (
    <aside
      className={`glossary-definition-panel ${isClosing ? 'closing' : ''}`}
      aria-live="polite"
      aria-label={`Definición: ${active.term}`}
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="glossary-panel-header">
        <span className="glossary-panel-label">{lang === 'es' ? 'Glosario Técnico' : lang === 'de' ? 'Technisches Glossar' : 'Technical Glossary'}</span>
        <strong className="glossary-panel-term">{active.term}</strong>
      </div>
      <div className="glossary-panel-body" style={{
        // Quitamos las barras de scroll fijas, el CSS se encargará de que crezca automáticamente
        scrollbarWidth: 'none',
      }}>
        {active.definition}
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
