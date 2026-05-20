import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './GlossaryLink.module.css';

/**
 * GlossaryLink — enlaza un término técnico al glosario.
 * Uso: <GlossaryLink term="SCR" /> o <GlossaryLink term="SCR">Short Circuit Ratio</GlossaryLink>
 */
export default function GlossaryLink({ term, children }) {
  const glossaryId = term
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()\/]/g, '')
    .replace(/á/g, 'a').replace(/é/g, 'e')
    .replace(/í/g, 'i').replace(/ó/g, 'o')
    .replace(/ú/g, 'u').replace(/ñ/g, 'n');

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
