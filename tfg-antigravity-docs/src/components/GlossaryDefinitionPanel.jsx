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
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const timeoutRef = useRef(null);

  const handleEnter = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;
    if (!el) return;
    
    // Si entramos en la palabra O en la propia tarjeta, cancelamos el cierre (Hover Bridge)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Solo cambiamos la palabra si estamos encima de un término (no de la tarjeta)
    if (el.classList.contains('glossary-term')) {
      const key = (el.dataset.term || '').toLowerCase();
      const entry = TERMS_MAP[key];
      if (entry) setActive(entry);
    }
  }, []);

  const handleLeave = useCallback((e) => {
    const el = e.target.closest
      ? e.target.closest('.glossary-term, .glossary-definition-panel')
      : null;
    
    // Si salimos de la palabra o de la tarjeta, iniciamos el temporizador de cierre
    if (el) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActive(null);
      }, 450); // 450ms de gracia
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
