/**
 * AnimatedContent.jsx
 * src/components/ReactBits/AnimatedContent.jsx
 *
 * Fade-in + translateY al entrar en viewport.
 * Inspirado en React Bits AnimatedContent, reimplementado con
 * CSS + IntersectionObserver. Sin GSAP. Sin Framer Motion.
 *
 * Props:
 *   children    (ReactNode) -- contenido a animar
 *   className   (string)    -- clase adicional para el wrapper
 *   distance    (number)    -- distancia Y de inicio en px (default: 40)
 *   duration    (number)    -- duracion en ms (default: 600)
 *   delay       (number)    -- delay antes de animar en ms (default: 0)
 *   threshold   (number)    -- IntersectionObserver threshold (default: 0.15)
 *   once        (boolean)   -- animar solo la primera vez (default: true)
 *   as          (string)    -- elemento HTML wrapper (default: 'div')
 */

import React, { useRef, useEffect } from 'react';
import styles from './AnimatedContent.module.css';

export default function AnimatedContent({
  children,
  className = '',
  distance = 40,
  duration = 600,
  delay = 0,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty('--ac-distance', distance + 'px');
    el.style.setProperty('--ac-duration', duration + 'ms');
    el.style.setProperty('--ac-delay', delay + 'ms');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return;
          hasAnimated.current = true;
          el.classList.add(styles.visible);
        } else if (!once) {
          hasAnimated.current = false;
          el.classList.remove(styles.visible);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [distance, duration, delay, threshold, once]);

  return (
    <Tag
      ref={ref}
      className={[styles.base, className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}
