import React from 'react';
import styles from './GlossaryLink.module.css';
import { slugify } from '../data/glossary';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * GlossaryLink — enlaza un término técnico al glosario con scroll exacto.
 * Uso: <GlossaryLink term="SCR" /> o <GlossaryLink term="SCR">Short Circuit Ratio</GlossaryLink>
 *
 * El atributo `term` debe coincidir exactamente con el campo `term` en GLOSSARY_TERMS.
 * Si el término tiene paréntesis u otros caracteres, asegúrate de que el slug coincide.
 */
export default function GlossaryLink({ term, children }) {
  const glossaryId = slugify(term);

  const baseUrl = useBaseUrl('/glosario');
  const targetUrl = `${baseUrl}#${glossaryId}`;

  // Usamos <a> nativo en lugar del Link de Docusaurus para garantizar
  // que el hash navigation funcione correctamente en SPA con scroll al ancla.
  const handleClick = (e) => {
    e.preventDefault();
    // Navegar a /glosario y luego hacer scroll al elemento
    const target = document.getElementById(glossaryId);
    if (target) {
      // Ya estamos en la página del glosario: solo scrollear
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Estamos en otra página: navegar al glosario con el hash
      window.location.href = targetUrl;
    }
  };

  return (
    <a
      href={targetUrl}
      className={styles.glossaryLink}
      title={`Click to view definition of: ${term}`}
      onClick={handleClick}
    >{children || term}</a>
  );
}
