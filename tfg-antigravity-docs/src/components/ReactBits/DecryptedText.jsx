import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}[]|:;<>,.?/~';

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 15,
  className = '',
  as: Tag = 'span',
}) {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  // framer-motion useInView
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (inView && !hasAnimated.current && typeof text === 'string') {
      hasAnimated.current = true;

      if (prefersReduced) {
        setDisplayText(text);
        return;
      }

      let iteration = 0;
      let interval = null;

      const animate = () => {
        setDisplayText(
          text.split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < Math.floor(iteration)) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += text.length / maxIterations;
      };

      interval = setInterval(animate, speed);

      return () => clearInterval(interval);
    }
  }, [inView, text, speed, maxIterations]);

  // Si no es string o no ha cargado, renderizamos el texto original invisiblemente
  // o esperamos a inView. Inicialmente en blanco si es string hasta inView.
  if (typeof text !== 'string') {
    return <Tag className={className} ref={ref}>{text}</Tag>;
  }

  const finalDisplay = hasAnimated.current ? displayText : text.replace(/./g, ' ');

  return (
    <Tag className={className} ref={ref} data-text={finalDisplay}>
      {finalDisplay}
    </Tag>
  );
}
