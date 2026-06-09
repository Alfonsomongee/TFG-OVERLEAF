import React from 'react';
import Link from '@docusaurus/Link';
import styles from './EvidencePointer.module.css';

export default function EvidencePointer({ label = "Evidencia complementaria", href, children }) {
  return (
    <aside className={styles.pointerWrapper}>
      <span className={styles.pointerHeader}>{label}</span>
      <p className={styles.pointerContent}>
        {href ? <Link href={href}>{children}</Link> : children}
      </p>
    </aside>
  );
}
