/**
 * GlossaryLink.jsx
 * Enlace con tooltip de glosario técnico.
 *
 * MIGRACIÓN: Tippy.js (en mantenimiento desde abr 2026) → @floating-ui/react
 *
 * COMPORTAMIENTO:
 *   - Desktop: tooltip al hover (delay 150 ms apertura, 80 ms cierre)
 *   - Móvil:   tooltip al tap (toggle)
 *   - Teclado: tooltip al focus (Enter/Space para toggle en móvil)
 *   - Escape:  cierra el tooltip
 *   - Click fuera: cierra el tooltip
 *
 * ACCESIBILIDAD:
 *   - role="tooltip" en el panel flotante
 *   - aria-describedby vinculando el término con su definición
 *   - El botón trigger es un <button> nativo (no div)
 *
 * INSTALACIÓN:
 *   npm install @floating-ui/react
 *   (~6 kB gzip, MIT, SSR-safe con guards de window)
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
import React, { useState, useRef } from 'react';

// Polyfill useId para React 17 (useId solo existe en React 18+)
let _idCounter = 0;
function useId() {
  const ref = useRef(null);
  if (ref.current === null) ref.current = `:r${++_idCounter}:`;
  return ref.current;
}
import {
  useFloating,
  useHover,
  useFocus,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';

export default function GlossaryLink({
  term,
  definition,
  children,
  compact = false,
  lang   = 'es',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  // Detectar touch device (para usar click en lugar de hover)
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift({ padding: 12 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Desktop: hover. Móvil: click/tap
  const hover = useHover(context, {
    enabled: !isTouch,
    delay: { open: 150, close: 80 },
  });
  const click   = useClick(context, { enabled: isTouch });
  const focus   = useFocus(context);
  const dismiss = useDismiss(context);
  const role    = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, click, focus, dismiss, role,
  ]);

  const isEs = lang === 'es';

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        aria-describedby={isOpen ? tooltipId : undefined}
        style={{
          display: 'inline',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'help',
          fontFamily: 'inherit',
          fontSize:   'inherit',
          fontWeight: 'inherit',
          color:      'rgba(203, 213, 225, 0.85)',
          textDecoration: 'none',
          borderBottom: compact ? 'none' : '1px dotted rgba(148, 163, 184, 0.5)',
          paddingBottom: compact ? 0 : '1px',
          borderRadius: 2,
        }}
        title={isTouch ? undefined : term} // title solo en desktop (ya tiene tooltip)
      >
        {children}
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            id={tooltipId}
            role="tooltip"
            {...getFloatingProps()}
            style={{
              ...floatingStyles,
              zIndex: 9999,
              maxWidth: 300,
              padding: '10px 14px',
              background: 'rgba(10,15,30,0.98)',
              border: '1px solid rgba(0,217,255,0.3)',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: 1.6,
              color: '#e2e8f0',
              pointerEvents: isTouch ? 'auto' : 'none',
            }}
          >
            {/* Nombre del término */}
            <p style={{
              margin: '0 0 6px',
              fontWeight: 'bold',
              color: '#00d9ff',
              fontSize: 13,
              borderBottom: '1px solid rgba(0,217,255,0.15)',
              paddingBottom: 6,
            }}>
              {term}
            </p>

            {/* Definición */}
            <p style={{ margin: 0, color: '#cbd5e1' }}>
              {definition}
            </p>

            {/* Cierre en móvil */}
            {isTouch && (
              <button
                onClick={() => setIsOpen(false)}
                aria-label={isEs ? 'Cerrar definición' : 'Close definition'}
                style={{
                  display: 'block',
                  marginTop: 8,
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 4,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  width: '100%',
                }}
              >
                ✕ {isEs ? 'Cerrar' : 'Close'}
              </button>
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
