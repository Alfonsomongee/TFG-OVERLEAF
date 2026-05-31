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
import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import glossaryTerms from '@site/src/data/glossary-terms.json';

// ── Construir mapa term.toLowerCase() → { term, definition } ──────────────
// "First wins": las entradas principales (más detalladas) van primero en el JSON
const TERMS_MAP = {};
for (const entry of glossaryTerms) {
  const key = entry.term.toLowerCase();
  if (!TERMS_MAP[key]) TERMS_MAP[key] = entry;
}

// ── Componente interno (solo cliente) ────────────────────────────────────────
function PanelInner() {
  const [active, setActive] = useState(null); // { term, definition } | null
  const [seenTerms, setSeenTerms] = useState(new Set());

  const handleEnter = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term')
      : null;
    if (!el) return;
    const key = (el.dataset.term || '').toLowerCase();
    const entry = TERMS_MAP[key];

    // Solo mostrar si no ha sido visto
    if (entry && !seenTerms.has(key)) {
      setActive(entry);
      // Marcar como visto
      setSeenTerms(prev => new Set([...prev, key]));
      // Guardar en localStorage para persistencia
      const stored = JSON.parse(localStorage.getItem('glossarySeenTerms') || '[]');
      if (!stored.includes(key)) {
        localStorage.setItem('glossarySeenTerms', JSON.stringify([...stored, key]));
      }
    }
  }, [seenTerms]);

  const handleLeave = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term')
      : null;
    if (el) setActive(null);
  }, []);

  // Cargar términos vistos del localStorage al montar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('glossarySeenTerms') || '[]');
    setSeenTerms(new Set(stored));
  }, []);

  useEffect(() => {
    // Delegación de eventos: un único listener en document para todos los spans
    document.addEventListener('mouseenter', handleEnter, true);
    document.addEventListener('mouseleave', handleLeave, true);
    return () => {
      document.removeEventListener('mouseenter', handleEnter, true);
      document.removeEventListener('mouseleave', handleLeave, true);
    };
  }, [handleEnter, handleLeave]);

  if (!active) return null;

  return (
    <aside
      className="glossary-definition-panel"
      aria-live="polite"
      aria-label={`Definición: ${active.term}`}
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="glossary-panel-header">
        <span className="glossary-panel-label">Glosario Técnico</span>
        <strong className="glossary-panel-term">{active.term}</strong>
      </div>
      <div className="glossary-panel-body" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(100, 180, 255, 0.3) transparent',
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
