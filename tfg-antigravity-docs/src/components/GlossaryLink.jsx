import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './GlossaryLink.module.css';
import { slugify } from '../data/glossary';

/**
 * GlossaryLink — enlaza un término técnico al glosario.
 * Uso: <GlossaryLink term="SCR" /> o <GlossaryLink term="SCR">Short Circuit Ratio</GlossaryLink>
 */
export default function GlossaryLink({ term, children }) {
  const glossaryId = slugify(term);

  const glossaryUrl = useBaseUrl(`/glosario#${glossaryId}`);

  return (
    <Link
      to={glossaryUrl}
      className={styles.glossaryLink}
      title={`Clic para ver: ${term}`}
    >
      {children || term}
      <span className={styles.superscript}>?</span>
    </Link>
  );
}
