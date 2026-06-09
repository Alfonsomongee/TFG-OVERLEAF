/**
 * AnnexSection.jsx
 *
 * Represents a single section within an annex
 * Can be collapsible via native <details> or always open
 * Supports anchors via id prop
 *
 * Props:
 *   id              (string) — unique anchor id for deep linking
 *   eyebrow         (string) — small label above title
 *   title           (string) — section heading
 *   description     (string) — optional descriptive text
 *   children        (React node) — section content
 *   defaultOpen     (boolean) — whether to open by default (default: true)
 */

import React from 'react';
import styles from './Annex.module.css';

export default function AnnexSection({
  id,
  eyebrow,
  title,
  description,
  children,
  defaultOpen = true,
}) {
  return (
    <section id={id} className={styles.section}>
      {/* Using native <details> for accessibility and simplicity */}
      <details className={styles.sectionDetails} open={defaultOpen}>
        <summary className={styles.sectionSummary}>
          {eyebrow && <span className={styles.sectionEyebrow}>{eyebrow}</span>}
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        </summary>

        {/* Expanded content */}
        <div style={{ paddingTop: '1rem' }}>
          {description && (
            <p className={styles.sectionDescription}>{description}</p>
          )}
          {children && (
            <div className={styles.sectionContent}>{children}</div>
          )}
        </div>
      </details>
    </section>
  );
}
