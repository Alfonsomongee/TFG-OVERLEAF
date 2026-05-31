/**
 * GlossaryLink.jsx
 * Enlace académico con tooltip de glosario técnico.
 *
 * ESTILO: gris punteado sobrio (no cian/primary) — tono académico.
 * COMPORTAMIENTO:
 *   - Desktop: tooltip al hover Y al click (toggle)
 *   - Móvil:   tooltip al tap (toggle)
 *   - Teclado: tooltip al focus
 *   - Escape:  cierra el tooltip
 *   - Click fuera: cierra el tooltip
 * DEFINICIÓN: auto-lookup desde GLOSSARY_TERMS (glossary.js).
 *   Si se pasa prop `definition` explícita, tiene prioridad.
 *
 * USO EN MDX:
 *   <GlossaryLink term="IBR">generación inversora</GlossaryLink>
 *   <GlossaryLink term="IBR" definition="Texto propio">IBR</GlossaryLink>
 *   <GlossaryLink term="SCR" compact>SCR</GlossaryLink>
 */
import React, { useState, useRef, useEffect } from 'react';
import { GLOSSARY_TERMS } from '@site/src/data/glossary';

export default function GlossaryLink({
  term,
  definition,
  children,
  compact = false,
  lang = 'es',
}) {
  const [open,   setOpen]   = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef          = useRef(null);
  const tooltipRef          = useRef(null);
  const isEs                = lang === 'es';

  // Auto-lookup en 4 pasos: exacto → case-insensitive → el term del MDX empieza
  // por la clave del glosario → la clave empieza por el term del MDX.
  // Esto resuelve casos como "OLTC (On-Load Tap Changer)" → "OLTC",
  // "GFM (Grid-Forming)" → "GFM", etc.
  const tLow = (term || '').toLowerCase();
  const entry = GLOSSARY_TERMS
    ? GLOSSARY_TERMS.find(t => t.term === term) ||
      GLOSSARY_TERMS.find(t => t.term.toLowerCase() === tLow) ||
      GLOSSARY_TERMS.find(t => tLow.startsWith(t.term.toLowerCase())) ||
      GLOSSARY_TERMS.find(t => t.term.toLowerCase().startsWith(tLow))
    : null;

  const resolvedDef = definition || entry?.definition || null;

  // Calcular posición fixed (evita clipping por overflow:hidden / transform)
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const W = 300;
    const vw = window.innerWidth;
    let left = rect.left + rect.width / 2 - W / 2;
    if (left < 10)          left = 10;
    if (left + W > vw - 10) left = vw - W - 10;
    const top = rect.top > 140 ? rect.top - 148 : rect.bottom + 8;
    setCoords({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize',  updatePosition);
    window.addEventListener('scroll',  updatePosition, true);
    return () => {
      window.removeEventListener('resize',  updatePosition);
      window.removeEventListener('scroll',  updatePosition, true);
    };
  }, [open]);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('touchstart', h);
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('touchstart', h);
    };
  }, [open]);

  // Escape
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <button
        ref={triggerRef}
        onMouseEnter={() => { if (!isTouch) setOpen(true);  }}
        onMouseLeave={() => { if (!isTouch) setOpen(false); }}
        onClick={() => setOpen(o => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-describedby={open ? `gl-${term}` : undefined}
        style={{
          background:     'none',
          border:         'none',
          padding:        '0 1px',
          cursor:         'help',
          fontFamily:     'inherit',
          fontSize:       'inherit',
          fontWeight:     'inherit',
          lineHeight:     'inherit',
          textDecoration: 'none',
          // ── estilo académico gris sobrio ──
          color:          'rgba(203, 213, 225, 0.85)',
          borderBottom:   compact ? 'none' : '1px dotted rgba(148, 163, 184, 0.5)',
          paddingBottom:  compact ? 0 : '1px',
        }}
      >
        {children}
      </button>

      {open && (
        <div
          id={`gl-${term}`}
          ref={tooltipRef}
          role="tooltip"
          style={{
            position:       'fixed',
            top:            coords.top,
            left:           coords.left,
            zIndex:         10000,
            width:          300,
            padding:        '10px 14px',
            background:     'rgba(10,15,30,0.98)',
            border:         '1px solid rgba(0,217,255,0.35)',
            borderRadius:   8,
            fontSize:       12,
            fontFamily:     'monospace',
            color:          '#e2e8f0',
            lineHeight:     1.6,
            boxShadow:      '0 8px 24px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            whiteSpace:     'normal',
            pointerEvents:  isTouch ? 'auto' : 'none',
            textAlign:      'left',
          }}
        >
          <strong style={{
            color:         '#00d9ff',
            display:       'block',
            marginBottom:  5,
            fontSize:      13,
            borderBottom:  '1px solid rgba(0,217,255,0.15)',
            paddingBottom: 5,
            fontFamily:    'monospace',
          }}>
            {term}
          </strong>
          <span style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>
            {resolvedDef || (
              isEs
                ? 'Ver definición completa en el Glosario Técnico.'
                : 'See full definition in the Technical Glossary.'
            )}
          </span>
          {isTouch && (
            <button
              onClick={() => setOpen(false)}
              style={{
                display:      'block',
                marginTop:    8,
                width:        '100%',
                padding:      '4px 0',
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                color:        '#94a3b8',
                cursor:       'pointer',
                fontFamily:   'monospace',
                fontSize:     11,
              }}
            >
              ✕ {isEs ? 'Cerrar' : 'Close'}
            </button>
          )}
        </div>
      )}
    </span>
  );
}
