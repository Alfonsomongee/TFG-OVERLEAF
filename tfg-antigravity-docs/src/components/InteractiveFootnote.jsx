/**
 * InteractiveFootnote.jsx
 * Nota a pie interactiva con tooltip hover/tap.
 * Implementación pura React — sin @tippyjs/react ni dependencias externas.
 * (@tippyjs/react descartado: no soporta React 17 / SSR de Docusaurus)
 *
 * USO EN MDX:
 *   import InteractiveFootnote from '@site/src/components/InteractiveFootnote';
 *
 *   La teoría <InteractiveFootnote
 *     content="Coombs, W.T. (2012). Ongoing Crisis Communication."
 *     citation="Coombs, 2012, p. 45"
 *   >SCCT</InteractiveFootnote> explica que...
 */
import React, { useState, useRef, useEffect } from 'react';

export default function InteractiveFootnote({
  children,
  content,
  citation,
}) {
  const [open,       setOpen]    = useState(false);
  const [coords,     setCoords]  = useState({ top: 0, left: 0 });
  const triggerRef               = useRef(null);
  const tooltipRef               = useRef(null);

  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Calcular posición con getBoundingClientRect (evita clipping)
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 300;
    const vw = window.innerWidth;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 10) left = 10;
    if (left + tooltipWidth > vw - 10) left = vw - tooltipWidth - 10;
    const top = rect.top > 140 ? rect.top - 130 : rect.bottom + 8;
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

  // Cerrar al clic fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  // Escape
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        ref={triggerRef}
        onMouseEnter={() => { if (!isTouch) setOpen(true);  }}
        onMouseLeave={() => { if (!isTouch) setOpen(false); }}
        onClick={() => { if (isTouch) setOpen(o => !o); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        tabIndex={0}
        role="button"
        aria-describedby={open ? 'interactive-footnote' : undefined}
        style={{
          cursor:        'help',
          fontStyle:     'italic',
          color:         'var(--ifm-color-primary)',
          borderBottom:  '1px dashed var(--ifm-color-primary-light)',
          background:    'rgba(0,217,255,0.05)',
          padding:       '0 2px',
          borderRadius:  3,
        }}
      >
        {children}
      </span>

      {open && (
        <div
          id="interactive-footnote"
          ref={tooltipRef}
          role="tooltip"
          style={{
            position:       'fixed',
            top:            coords.top,
            left:           coords.left,
            zIndex:         10000,
            width:          300,
            padding:        '10px 14px',
            background:     'var(--ifm-background-surface-color)',
            border:         '1px solid var(--ifm-color-primary)',
            borderRadius:   8,
            fontSize:       '0.82rem',
            fontFamily:     'var(--ifm-font-family-base)',
            color:          'var(--ifm-font-color-base)',
            lineHeight:     1.55,
            boxShadow:      '0 8px 24px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(8px)',
            pointerEvents:  isTouch ? 'auto' : 'none',
          }}
        >
          {content}
          {citation && (
            <div style={{
              marginTop:   8,
              paddingTop:  6,
              borderTop:   '1px solid rgba(255,255,255,0.08)',
              fontSize:    '0.72rem',
              color:       'var(--text-1, #64748b)',
              fontFamily:  'monospace',
              fontStyle:   'italic',
            }}>
              {citation}
            </div>
          )}
          {isTouch && (
            <button
              onClick={() => setOpen(false)}
              style={{
                display: 'block', marginTop: 8, width: '100%',
                padding: '4px 0', background: 'rgba(0,0,0,0.05)',
                border: 'none', borderRadius: 4, cursor: 'pointer',
                fontSize: '0.72rem', color: 'var(--ifm-color-primary)',
              }}
            >✕ Cerrar</button>
          )}
        </div>
      )}
    </span>
  );
}
