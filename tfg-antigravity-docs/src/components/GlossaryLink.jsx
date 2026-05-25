import React from 'react';
import styles from './GlossaryLink.module.css';
import { slugify } from '../data/glossary';
import Link from '@docusaurus/Link';

/**
 * GlossaryLink — enlaza un término técnico al glosario con scroll exacto.
 * Uso: <GlossaryLink term="SCR" /> o <GlossaryLink term="SCR">Short Circuit Ratio</GlossaryLink>
 */
export default function GlossaryLink({ term, children }) {
  const glossaryId = slugify(term);
  const targetUrl = `/glosario#${glossaryId}`;

  return (
    <Link
      to={targetUrl}
      className={styles.glossaryLink}
      title={`Ver definición de: ${term}`}
    >
      {children || term}
    </Link>
  );
}

