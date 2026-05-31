/**
 * GlossaryLink.jsx
 * Enlace con tooltip de glosario técnico.
 *
 * Implementación pura React — sin dependencias externas.
 * Usa position:fixed + getBoundingClientRect para evitar clipping
 * por contenedores con overflow:hidden o transform.
 *
 * COMPORTAMIENTO:
 *   - Desktop: tooltip al hover
 *   - Móvil:   tooltip al tap (toggle)
 *   - Teclado: tooltip al focus
 *   - Escape:  cierra el tooltip
 *   - Click fuera: cierra el tooltip
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
 * MODO COMPACTO (sin subrayado):
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
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const isEs = lang === 'es';
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Calcular posición relativa al viewport para evitar clipping
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 300;
    const viewportWidth = window.innerWidth;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) left = viewportWidth - tooltipWidth - 10;

    const tooltipHeight = 120;
    const spaceAbove = rect.top;
    let top;
    if (spaceAbove > tooltipHeight) {
      top = rect.top - tooltipHeight - 8;
    } else {
      top = rect.bottom + 8;
    }
    setCoords({ top, left });
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [open]);

  // Cerrar al hacer clic fuera
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

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
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
        aria-describedby={open ? `glossary-tooltip-${term}` : undefined}
        style={{
          background:     'none',
          border:         'none',
          padding:        '0 2px',
          cursor:         'help',
          fontFamily:     'inherit',
          fontSize:       'inherit',
          fontWeight:     'inherit',
          color:          'var(--ifm-color-primary)',
          borderBottom:   compact ? 'none' : '1px dotted var(--ifm-color-primary-light)',
          textDecoration: 'none',
          lineHeight:     'inherit',
        }}
      >
        {children}
      </button>

      {open && (
        <div
          id={`glossary-tooltip-${term}`}
          ref={tooltipRef}
          role="tooltip"
          style={{
            position:       'fixed',
            top:            coords.top,
            left:           coords.left,
            zIndex:         10000,
            width:          '300px',
            padding:        '12px 16px',
            background:     'var(--ifm-background-surface-color)',
            border:         '1px solid var(--ifm-color-primary)',
            borderRadius:   '8px',
            fontSize:       '0.85rem',
            fontFamily:     'var(--ifm-font-family-base)',
            color:          'var(--ifm-font-color-base)',
            boxShadow:      '0 8px 24px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(8px)',
            textAlign:      'left',
            pointerEvents:  isTouch ? 'auto' : 'none',
            lineHeight:     1.5,
          }}
        >
          <strong style={{
            display:       'block',
            marginBottom:  6,
            color:         'var(--ifm-color-primary)',
            fontSize:      '0.9rem',
            borderBottom:  '1px solid var(--ifm-color-emphasis-200)',
            paddingBottom: 4,
          }}>
            {term}
          </strong>
          <div style={{ lineHeight: 1.5 }}>
            {definition || (
              isEs
                ? 'Ver definición completa en el Glosario Técnico.'
                : 'See full definition in the Technical Glossary.'
            )}
          </div>
          {isTouch && (
            <button
              onClick={() => setOpen(false)}
              style={{
                display:      'block',
                marginTop:    10,
                width:        '100%',
                padding:      '6px 0',
                background:   'rgba(0,0,0,0.05)',
                border:       'none',
                borderRadius: 4,
                color:        'var(--ifm-color-primary)',
                cursor:       'pointer',
                fontSize:     '0.75rem',
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
