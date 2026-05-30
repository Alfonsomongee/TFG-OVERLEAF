/**
 * InteractiveCTA.jsx
 * Contenedor expandible para simuladores interactivos.
 *
 * CORRECCIONES respecto a la versión anterior:
 * 1. div[role="button"] → <button> nativo: accesibilidad de teclado completa
 *    sin necesidad de onKeyDown manual. El navegador gestiona Enter y Space.
 * 2. useState movido dentro del componente real (no afecta al BrowserOnly
 *    exterior, que solo existe en los MDX que lo envuelven desde fuera).
 * 3. aria-expanded en el botón para lectores de pantalla.
 * 4. aria-controls apuntando al panel expandible.
 */
import React, { useState, useId } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InteractiveCTA.module.css';

export default function InteractiveCTA({
  title       = 'LABORATORIO INTERACTIVO',
  description,
  children,
  icon        = '⚡',
}) {
  const [expanded, setExpanded] = useState(false);
  // useId genera un ID único por instancia, necesario si hay varios CTAs en la misma página
  const panelId = useId();

  return (
    <div className={`${styles.ctaContainer} ${expanded ? styles.expanded : ''}`}>
      {/* Botón nativo: Enter y Space funcionan sin onKeyDown adicional */}
      <button
        className={styles.ctaHeader}
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
        aria-controls={panelId}
        type="button"
      >
        <span className={styles.ctaIcon} aria-hidden="true">{icon}</span>
        <span className={styles.ctaText}>
          <span className={styles.ctaTitle}>{title}</span>
          {description && (
            <span className={styles.ctaDescription}>{description}</span>
          )}
          <span className={styles.ctaButtonLabel}>
            {expanded ? 'Cerrar ↑' : 'Ejecutar simulación →'}
          </span>
        </span>
      </button>

      {/* Panel expandible */}
      <div
        id={panelId}
        className={styles.ctaContent}
        hidden={!expanded}
        aria-live="polite"
      >
        {expanded && (
          <BrowserOnly
            fallback={
              <div className={styles.loadingFallback}>
                Inicializando simulador…
              </div>
            }
          >
            {() => children}
          </BrowserOnly>
        )}
      </div>
    </div>
  );
}
