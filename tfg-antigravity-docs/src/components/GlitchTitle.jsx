import React from 'react';
import SplitText from './SplitText';

/**
 * GlitchTitle — ahora delega en SplitText para una animación
 * académica letra a letra con fade + translateY.
 *
 * API preservada: <GlitchTitle as="h1" className="">Texto</GlitchTitle>
 * Compatible al 100% con todos los MDX existentes.
 */
export default function GlitchTitle({ children, as: Tag = 'h1', className = '' }) {
  // Si children no es string (JSX anidado), renderizamos el Tag directamente
  if (typeof children !== 'string') {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <SplitText
      text={children}
      tag={Tag}
      className={className}
      delay={38}
      duration={680}
    />
  );
}

