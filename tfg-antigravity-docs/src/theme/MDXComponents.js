import React from 'react';
// Import original MDX components
import MDXComponents from '@theme-original/MDXComponents';
import ChartCard from '@site/src/components/ChartCard';
import GlitchTitle from '@site/src/components/GlitchTitle';
import ForensicReveal from '@site/src/components/ForensicReveal';
import GlossaryLink from '@site/src/components/GlossaryLink';
import ForensicNarrative from '@site/src/components/GaleriaForense/ForensicNarrative';
import { ForensicTable } from '@site/src/components/ForensicUI/Primitives';
import Collapsible from '@site/src/components/Collapsible';
import KeyFact from '@site/src/components/KeyFact';
import NavigationGuide from '@site/src/components/NavigationGuide';
import SplitText from '@site/src/components/SplitText';

/**
 * Override de h1: anima los títulos principales de capítulo letra a letra.
 * Fallback limpio cuando children no es un string puro
 * (p.ej. h1 con negritas, código inline, u otros nodos React).
 */
function AnimatedH1({ children, id, className, ...rest }) {
  const text = typeof children === 'string' ? children : null;
  if (!text) {
    // Fallback: rendering normal sin animación
    return (
      <h1 id={id} className={className} {...rest}>
        {children}
      </h1>
    );
  }
  return (
    <SplitText
      tag="h1"
      id={id}
      className={className || ''}
      text={text}
      delay={38}
      duration={680}
    />
  );
}

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Add our custom components globally so we don't have to import them in every .mdx
  ChartCard,
  GlitchTitle,
  ForensicReveal,
  GlossaryLink,
  ForensicNarrative,
  ForensicTable,
  Collapsible,
  KeyFact,
  NavigationGuide,
  // Override h1: animación SplitText letra a letra en títulos de capítulo
  h1: AnimatedH1,
};
