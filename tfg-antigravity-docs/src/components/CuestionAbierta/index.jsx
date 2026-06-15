import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const OPEN_QUESTION_COLORS = {
  light: {
    accent: '#8A6C2F',
    accentSoft: '#D1B98B',
    bg: '#F7EFE0',
    bgStrong: '#F3E7D0',
    border: 'rgba(138, 108, 47, 0.38)',
    text: '#33291E',
    muted: '#76664D',
    reference: '#6F5630',
    shadow: '0 16px 36px rgba(80, 57, 24, 0.16)',
  },
  dark: {
    accent: '#D8B96A',
    accentSoft: '#8F7640',
    bg: '#16263C',
    bgStrong: '#1A2F46',
    border: 'rgba(216, 185, 106, 0.42)',
    text: '#E8EDF4',
    muted: '#B8C3D1',
    reference: '#E6D29B',
    shadow: '0 18px 44px rgba(0, 0, 0, 0.42)',
  },
};

export default function CuestionAbierta({
  children,
  metricKey,
  note,
}) {
  const [open, setOpen]   = useState(false);
  const tooltipRef        = useRef(null);
  const triggerRef        = useRef(null);
  const { colorMode }     = useColorMode();
  const colors            = OPEN_QUESTION_COLORS[colorMode] || OPEN_QUESTION_COLORS.light;

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
          color:          colors.accent,
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
            background: colors.bg,
            border:     `1px solid ${colors.border}`,
            borderRadius: 8,
            fontSize:   12,
            fontFamily: 'monospace',
            color:      colors.text,
            lineHeight: 1.6,
            boxShadow:  colors.shadow,
            whiteSpace: 'normal',
            pointerEvents: 'auto',
          }}
        >
          <strong style={{
            color:        colors.accent,
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
              color:       colors.reference,
              fontStyle:   'italic',
              borderTop:   `1px solid ${colors.border}`,
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
