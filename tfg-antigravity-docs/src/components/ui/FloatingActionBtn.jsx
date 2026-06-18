/**
 * src/components/ui/FloatingActionBtn.jsx
 *
 * Botón FAB (Floating Action Button) reutilizable para los controles
 * flotantes de la interfaz: sidebar open/close y TOC toggle.
 *
 * Comparte el DNA visual del chat-fab:
 *   - Círculo de fondo sólido con token de color
 *   - Anillo de pulso suave (1 solo, más discreto que el chatbot)
 *   - Icono SVG inline pasado como children
 *   - Estado `active` para el TOC (anillo en ámbar)
 *
 * Diferencias intencionadas (jerarquía visual):
 *   - 40 px de diámetro (vs 56 px del chat-fab)
 *   - 1 anillo (vs 2 del chat)
 *   - Sin chispas (el chat las tiene para captar atención primaria)
 *   - Sin flotación vertical continua
 */

import React from 'react';
import styles from './FloatingActionBtn.module.css';

/**
 * @param {Object}  props
 * @param {string}  props.variant   'sidebar-open' | 'sidebar-close' | 'toc'
 * @param {boolean} [props.active]  Estado activo (sólo relevante para 'toc')
 * @param {Function} props.onClick
 * @param {string}  props.ariaLabel
 * @param {string}  [props.title]
 * @param {React.ReactNode} props.children  Icono SVG
 * @param {string}  [props.className]       Clases adicionales (para posicionamiento legacy)
 */
export default function FloatingActionBtn({
  variant,
  active = false,
  onClick,
  ariaLabel,
  title,
  children,
  className = '',
}) {
  const variantClass = styles[`variant-${variant}`] ?? '';

  return (
    <button
      className={[
        styles.fab,
        variantClass,
        active ? styles.active : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      type="button"
    >
      {/* Anillo de pulso — aria-hidden porque es puramente decorativo */}
      <span className={styles.ring} aria-hidden="true" />

      {/* Icono (SVG pasado como children) */}
      <span className={styles.icon} aria-hidden="true">
        {children}
      </span>
    </button>
  );
}
