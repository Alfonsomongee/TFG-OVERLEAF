/**
 * GlossaryLink.jsx
 * Enlace académico con definición expandible del glosario técnico.
 *
 * COMPORTAMIENTO:
 *   - Click / Enter / Space: abre o cierra la definición
 *   - La tarjeta NO se cierra al mover el ratón (solo clic fuera o Escape)
 *   - Posicionamiento absoluto — no necesita cálculos de viewport
 *   - Altura automática — muestra siempre la definición completa
 *
 * USO EN MDX:
 *   <GlossaryLink term="IBR">generación inversora</GlossaryLink>
 *   <GlossaryLink term="SCR" compact>SCR</GlossaryLink>
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React from 'react';

export default function GlossaryLink({
  term, 
  definition, 
  children, 
  compact = false}) {
  const lang = useDocLang();
  return (
    <span
      className="glossary-term"
      data-term={term}
      style={{
        cursor: 'help',
        borderBottom: compact ? 'none' : '1px dotted currentColor',
        textDecoration: 'none',
        display: 'inline'
      }}
    >
      {children}
    </span>
  );
}
