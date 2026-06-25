/**
 * AnnexSection.jsx
 *
 * Sección temática dentro de un anexo conceptual.
 * Renderizado directo, sin wrapper <details>/<summary>:
 * un informe académico no colapsa sus secciones argumentales.
 *
 * Props:
 *   id           (string)     — anchor id para deep-linking y scroll
 *   eyebrow      (string)     — label pequeño sobre el título ("Sección 1")
 *   title        (string)     — título de la sección
 *   description  (string)     — texto introductorio opcional
 *   children     (ReactNode)  — contenido de la sección
 */

import React from 'react';
import styles from './Annex.module.css';

export default function AnnexSection({
  id,
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section id={id} className={styles.section}>

      {/* Cabecera de sección */}
      <header className={styles.sectionHeader}>
        {eyebrow && (
          <span className={styles.sectionEyebrow}>{eyebrow}</span>
        )}
        {title && (
          <h2 className={styles.sectionTitle}>{title}</h2>
        )}
      </header>

      {/* Descripción introductoria opcional */}
      {description && (
        <p className={styles.sectionDescription}>{description}</p>
      )}

      {/* Contenido */}
      {children && (
        <div className={styles.sectionContent}>{children}</div>
      )}

    </section>
  );
}
