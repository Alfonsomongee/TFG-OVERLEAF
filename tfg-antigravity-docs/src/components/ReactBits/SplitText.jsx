/**
 * SplitText.jsx
 * src/components/ReactBits/SplitText.jsx
 *
 * Animacion de entrada caracter a caracter con stagger.
 * Inspirado en React Bits SplitText, reimplementado con
 * CSS puro + IntersectionObserver. Sin GSAP. Sin Framer Motion.
 *
 * Props:
 *   text       (string)  -- texto a animar
 *   className  (string)  -- clase adicional para el wrapper
 *   delay      (number)  -- delay entre unidades en ms (default: 30)
 *   duration   (number)  -- duracion de cada unidad en ms (default: 500)
 *   threshold  (number)  -- IntersectionObserver threshold (default: 0.2)
 *   once       (boolean) -- animar solo la primera vez (default: true)
 *   tag        (string)  -- elemento HTML contenedor (default: 'span')
 *   splitBy    (string)  -- 'chars' | 'words' (default: 'chars')
 */

import React, { useRef, useEffect } from 'react';
import styles from './SplitText.module.css';

export default function SplitText({
  text = '',
  className = '',
  delay = 30,
  duration = 500,
  threshold = 0.2,
  once = true,
  tag: Tag = 'span',
  splitBy = 'chars',
}) {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  const units =
    splitBy === 'words'
      ? text.split(' ').filter(Boolean)
      : text.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll('[data-split-unit]');

    const trigger = () => {
      if (once && hasAnimated.current) return;
      hasAnimated.current = true;
      spans.forEach((span, i) => {
        span.style.transitionDelay = i * delay + 'ms';
        span.style.transitionDuration = duration + 'ms';
        span.classList.add(styles.visible);
      });
    };

    const reset = () => {
      if (once) return;
      hasAnimated.current = false;
      spans.forEach((span) => {
        span.style.transitionDelay = '0ms';
        span.classList.remove(styles.visible);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) trigger();
        else reset();
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [delay, duration, threshold, once]);

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <React.Fragment key={i}>
          <span
            data-split-unit
            className={styles.unit}
            aria-hidden="true"
          >
            {unit}
          </span>
          {splitBy === 'words' && i < units.length - 1 ? '\u00a0' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}
