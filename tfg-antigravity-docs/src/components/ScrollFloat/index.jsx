/**
 * src/components/ScrollFloat/index.jsx
 *
 * Animación de heading letra a letra ligada al scroll del usuario.
 * Sin GSAP, sin dependencias nuevas.
 *
 * Técnica principal (Chrome/Edge 115+):
 *   CSS Scroll-Driven Animations: animation-timeline: view() con named timeline
 *   en el contenedor. Cada char recibe animation-range-start/end con offset de
 *   stagger calculado inline → equivalente exacto del scrub:true de GSAP ScrollTrigger.
 *
 * Fallback (Firefox / Safari / navegadores sin soporte):
 *   IntersectionObserver + animación temporal (similar a SplitText).
 *   Mantiene el mismo keyframe de escalado dramático (scaleY 2.3 → 1).
 *
 * Respeta prefers-reduced-motion en ambas rutas.
 */

import React, { useRef, useEffect, useState } from 'react';
import styles from './ScrollFloat.module.css';

// Detecta soporte de Scroll-Driven Animations en cliente
function supportsScrollTimeline() {
  if (typeof CSS === 'undefined') return false;
  return CSS.supports('animation-timeline', 'scroll()');
}

export default function ScrollFloat({
  children,
  tag: Tag = 'h2',
  className = '',
  stagger = 0.03,   // fracción de desplazamiento por char (0–1)
  rangeSpan = 0.55, // duración de la animación de cada char como fracción del rango total
}) {
  const containerRef = useRef(null);
  const [useScrollDriven, setUseScrollDriven] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const text = typeof children === 'string' ? children : '';

  // Dividir en palabras → chars (preserva word-wrap)
  const words = text.split(' ');
  let charIdx = 0;
  const wordData = words.map((word) => ({
    chars: Array.from(word).map((char) => ({ char, idx: charIdx++ })),
  }));
  const totalChars = charIdx;

  // Detección en cliente (SSR-safe)
  useEffect(() => {
    setIsMounted(true);
    setUseScrollDriven(supportsScrollTimeline());
  }, []);

  // Fallback: IntersectionObserver para Firefox/Safari
  useEffect(() => {
    if (!isMounted || useScrollDriven) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add(styles.visible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(styles.visible);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-40px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMounted, useScrollDriven]);

  /**
   * Calcula animation-range-start y animation-range-end para cada char.
   * El rango completo disponible es [0%, (1 - rangeSpan) * 100%].
   * Cada char empieza en stagger * idx * 100% y termina en start + rangeSpan * 100%.
   */
  const getCharRange = (idx) => {
    const maxStart = (1 - rangeSpan) * 100;
    const startPct = Math.min((stagger * idx * 100), maxStart);
    const endPct = startPct + rangeSpan * 100;
    return {
      animationRangeStart: `entry ${startPct.toFixed(1)}%`,
      animationRangeEnd:   `entry ${Math.min(endPct, 100).toFixed(1)}%`,
    };
  };

  const charStyle = (idx) => {
    if (!isMounted) return {};
    if (useScrollDriven) {
      return {
        ...getCharRange(idx),
        // Forzar un animation-delay: 0 para que no interfiera con el timeline
        animationDelay: '0s',
      };
    }
    // Fallback: stagger temporal
    return {
      animationDelay: `${idx * 45}ms`,
    };
  };

  return (
    <Tag
      ref={containerRef}
      className={[
        styles.container,
        useScrollDriven && isMounted ? styles.scrollDriven : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={text}
    >
      <span className={styles.inner}>
        {wordData.map((word, wordIdx) => (
          <React.Fragment key={wordIdx}>
            {wordIdx > 0 && (
              <span className={styles.space} aria-hidden="true">
                {' '}
              </span>
            )}
            <span className={styles.word}>
              {word.chars.map(({ char, idx }) => (
                <span
                  key={idx}
                  className={styles.char}
                  aria-hidden="true"
                  style={charStyle(idx)}
                >
                  {char}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}
