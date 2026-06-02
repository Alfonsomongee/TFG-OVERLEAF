/**
 * GlossaryLink.jsx
 * Enlace académico con definición expandible del glosario técnico.
 *
 * COMPORTAMIENTO:
 *   - Click / Enter / Space: abre o cierra la definición
 *   - La tarjeta NO se cierra al mover el ratón (solo clic fuera o Escape)
 *   - Posicionamiento absoluto — no necesita cálculos de viewport
 *   - Altura automática — muestra siempre la definición completa
 *
 * USO EN MDX:
 *   <GlossaryLink term="IBR">generación inversora</GlossaryLink>
 *   <GlossaryLink term="SCR" compact>SCR</GlossaryLink>
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useRef, useEffect } from 'react';
import { GLOSSARY_TERMS } from '@site/src/data/glossary';

export default function GlossaryLink({
  term, 
  definition, 
  children, 
  compact = false}) {
  const lang = useDocLang();
  const [open, setOpen] = useState(false);
  const wrapRef         = useRef(null);
  const isEs            = lang === 'es';

  // Auto-lookup: exacto → case-insensitive → prefijo en term → prefijo en clave
  const tLow = (term || '').toLowerCase();
  const entry = GLOSSARY_TERMS
    ? GLOSSARY_TERMS.find(t => t.term === term)                              ||
      GLOSSARY_TERMS.find(t => t.term.toLowerCase() === tLow)               ||
      GLOSSARY_TERMS.find(t => tLow.startsWith(t.term.toLowerCase()))       ||
      GLOSSARY_TERMS.find(t => t.term.toLowerCase().startsWith(tLow))
    : null;

  const resolvedDef = definition || entry?.definition || null;

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown',  handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown',  handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <span
      ref={wrapRef}
      style={{ position: 'relative', display: 'inline' }}
    >
      {/* ── Palabra del glosario — clase para override CSS por tema ── */}
      <button
        className="glossary-link-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        title={open ? undefined : `Ver definición: ${term}`}
        style={{
          background:     'none',
          border:         'none',
          padding:        '0 1px',
          paddingBottom:  compact ? 0 : '1px',
          cursor:         'help',
          fontFamily:     'inherit',
          fontSize:       'inherit',
          fontWeight:     'inherit',
          lineHeight:     'inherit',
          borderBottom:   compact ? 'none' : '1px dotted currentColor',
          textDecoration: 'none',
        }}
      >
        {children}
      </button>

      {/* ── Tarjeta de definición ── */}
      {open && (
        <span
          id={`gl-${term}`}
          role="tooltip"
          className="glossary-tooltip"
          style={{
            position:      'absolute',
            top:           'calc(100% + 6px)',
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:        10000,
            display:       'block',
            width:         290,
            padding:       '10px 14px',
            borderRadius:  6,
            fontSize:      12,
            fontFamily:    'var(--ifm-font-family-base)',
            lineHeight:    1.65,
            whiteSpace:    'normal',
            textAlign:     'left',
            pointerEvents: 'auto',
            boxShadow:     '0 4px 20px rgba(0,0,0,0.18)',
          }}
        >
          <strong className="glossary-tooltip__term" style={{
            display:       'block',
            marginBottom:  6,
            paddingBottom: 5,
            fontSize:      13,
            fontWeight:    600,
            fontFamily:    'var(--ifm-font-family-base)',
          }}>
            {term}
          </strong>

          <span className="glossary-tooltip__def" style={{
            display:    'block',
            fontSize:   12,
            lineHeight: 1.65,
          }}>
            {resolvedDef || (
              isEs
                ? 'Ver definición completa en el Glosario Técnico.'
                : 'See full definition in the Technical Glossary.'
            )}
          </span>

          <button
            className="glossary-tooltip__close"
            onClick={() => setOpen(false)}
            style={{
              display:      'block',
              marginTop:    8,
              width:        '100%',
              padding:      '4px 0',
              borderRadius: 4,
              cursor:       'pointer',
              fontFamily:   'var(--ifm-font-family-base)',
              fontSize:     11,
            }}
          >
            ✕ {isEs ? 'Cerrar' : 'Close'}
          </button>
        </span>
      )}
    </span>
  );
}
