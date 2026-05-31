/**
 * GlossaryLink.jsx
 * Enlace con tooltip de glosario técnico.
 *
 * Implementación pura React — sin dependencias externas (@floating-ui eliminado).
 *
 * COMPORTAMIENTO:
 *   - Desktop: tooltip al hover
 *   - Móvil:   tooltip al tap (toggle)
 *   - Teclado: tooltip al focus
 *   - Escape:  cierra el tooltip
 *   - Click fuera: cierra el tooltip
 *
 * ACCESIBILIDAD:
 *   - role="tooltip" en el panel flotante
 *   - aria-describedby vinculando el término con su definición
 *   - El botón trigger es un <button> nativo (no div)
 *
 * USO EN MDX:
 *   import GlossaryLink from '@site/src/components/GlossaryLink';
 *
 *   <GlossaryLink
 *     term="IBR"
 *     definition="Inverter-Based Resource: recurso conectado vía inversor
 *                 (FV, eólica tipo 3/4, BESS, STATCOM). IEEE 2800-2022."
 *   >
 *     generación inversora
 *   </GlossaryLink>
 *
 * MODO COMPACTO (sin subrayado, para uso en encabezados):
 *   <GlossaryLink term="SCR" definition="..." compact>SCR</GlossaryLink>
 */
import React, { useState, useRef, useEffect } from 'react';

export default function GlossaryLink({
  term,
  definition,
  children,
  compact = false,
  lang = 'es',
}) {
  const [open,     setOpen]    = useState(false);
  const triggerRef             = useRef(null);
  const tooltipRef             = useRef(null);
  const isEs = lang === 'es';

  // Detect touch device
  const isTouch = typeof window !== 'undefined' &&
    'ontouchstart' in window;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleMouseEnter = () => { if (!isTouch) setOpen(true);  };
  const handleMouseLeave = () => { if (!isTouch) setOpen(false); };
  const handleClick      = ()  => { if (isTouch)  setOpen(o => !o); };
  const handleFocus      = ()  => setOpen(true);
  const handleBlur       = ()  => setTimeout(() => setOpen(false), 150);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <button
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={open ? `gl-${term}` : undefined}
        style={{
          background:     'none',
          border:         'none',
          padding:        '0 1px',
          cursor:         'help',
          fontFamily:     'inherit',
          fontSize:       'inherit',
          fontWeight:     'inherit',
          color:          'rgba(203,213,225,0.85)',
          borderBottom:   compact ? 'none' : '1px dotted rgba(148,163,184,0.5)',
          paddingBottom:  compact ? 0 : '1px',
          textDecoration: 'none',
          lineHeight:     'inherit',
        }}
      >
        {children}
      </button>

      {open && (
        <span
          id={`gl-${term}`}
          ref={tooltipRef}
          role="tooltip"
          style={{
            position:      'absolute',
            bottom:        'calc(100% + 8px)',
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:        10000,
            width:         300,
            padding:       '10px 14px',
            background:    'rgba(10,15,30,0.98)',
            border:        '1px solid rgba(0,217,255,0.35)',
            borderRadius:  8,
            fontSize:      12,
            fontFamily:    'monospace',
            color:         '#e2e8f0',
            lineHeight:    1.6,
            boxShadow:     '0 8px 24px rgba(0,0,0,0.6)',
            whiteSpace:    'normal',
            pointerEvents: isTouch ? 'auto' : 'none',
          }}
        >
          <strong style={{
            color:         '#00d9ff',
            display:       'block',
            marginBottom:  5,
            fontSize:      13,
            borderBottom:  '1px solid rgba(0,217,255,0.15)',
            paddingBottom: 5,
          }}>
            {term}
          </strong>
          {definition || (
            isEs
              ? 'Ver definición completa en el Glosario Técnico.'
              : 'See full definition in the Technical Glossary.'
          )}
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
        </span>
      )}
    </span>
  );
}
