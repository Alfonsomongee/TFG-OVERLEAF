import React, { useState, useRef, useEffect } from 'react';

export default function CuestionAbierta({
  children,
  metricKey,
  note,
}) {
  const [open, setOpen]   = useState(false);
  const tooltipRef        = useRef(null);
  const triggerRef        = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
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

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Dato no verificado en fuente primaria — pulsa para más información"
        style={{
          background:     'none',
          border:         'none',
          padding:        '0 1px',
          cursor:         'help',
          fontFamily:     'inherit',
          fontSize:       'inherit',
          fontWeight:     'inherit',
          color:          '#f59e0b',
          borderBottom:   'none',
          textDecoration: 'none',
          lineHeight:     'inherit',
        }}
      >
        {children}
      </button>

      {open && (
        <span
          ref={tooltipRef}
          role="tooltip"
          style={{
            position:   'absolute',
            bottom:     'calc(100% + 8px)',
            left:       '50%',
            transform:  'translateX(-50%)',
            zIndex:     10000,
            width:      270,
            padding:    '10px 14px',
            background: 'rgba(10,15,30,0.98)',
            border:     '1px solid rgba(245,158,11,0.5)',
            borderRadius: 8,
            fontSize:   12,
            fontFamily: 'monospace',
            color:      '#fde68a',
            lineHeight: 1.6,
            boxShadow:  '0 8px 24px rgba(0,0,0,0.6)',
            whiteSpace: 'normal',
            pointerEvents: 'auto',
          }}
        >
          <strong style={{
            color:        '#f59e0b',
            display:      'block',
            marginBottom: 5,
            fontSize:     11,
            letterSpacing:'0.06em',
            textTransform:'uppercase',
          }}>
            ⚠ Cuestión abierta
          </strong>
          <span>
            {note ||
              'Este dato no está verificado en fuente primaria disponible ' +
              '(ENTSO-E Factual, BOE, REE). Se mantiene como estimación.'}
          </span>
          {metricKey && (
            <span style={{
              display:     'block',
              marginTop:   6,
              fontSize:    10,
              color:       '#92400e',
              fontStyle:   'italic',
              borderTop:   '1px solid rgba(245,158,11,0.15)',
              paddingTop:  5,
            }}>
              ref: {metricKey}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
