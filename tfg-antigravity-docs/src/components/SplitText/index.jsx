/**
 * src/components/SplitText/index.jsx
 *
 * Animación letra a letra sobre cualquier etiqueta de encabezado.
 * Sin GSAP, sin dependencias nuevas.
 *
 * Técnica:
 *   - Divide el texto en spans por carácter (inline-block).
 *   - Cada char tiene un animation-delay creciente (stagger).
 *   - IntersectionObserver detecta cuándo el elemento entra en viewport
 *     y añade la clase CSS que activa animation-play-state: running.
 *   - SSR-safe: useEffect solo corre en cliente.
 *   - Accesible: aria-label en el wrapper, aria-hidden en cada char.
 *   - Respeta prefers-reduced-motion via @media en el CSS.
 */

import React, { useRef, useEffect } from 'react';
import styles from './SplitText.module.css';

export default function SplitText({
  text,
  id,
  className = '',
  tag: Tag = 'p',
  delay = 35,        // ms entre cada carácter (stagger)
  duration = 650,    // ms de duración de la animación por carácter
  ease = 'cubic-bezier(0.22, 1, 0.36, 1)', // equivalente a power3.out
  threshold = 0.1,
  rootMargin = '-40px',
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Fallback inmediato si IntersectionObserver no está soportado
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add(styles.visible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(styles.visible);
            observer.unobserve(el); // once: true
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Dividir por palabras primero para que el word-wrap siga funcionando
  const words = text.split(' ');
  let charIdx = 0;

  // Precomputar estructura: [{ chars: [{ char, idx }] }]
  const wordData = words.map((word) => ({
    chars: Array.from(word).map((char) => ({ char, idx: charIdx++ })),
  }));

  return (
    <Tag
      ref={wrapperRef}
      id={id}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={{
        '--split-duration': `${duration}ms`,
        '--split-ease': ease,
      }}
      // El aria-label en el wrapper hace que los lectores de pantalla
      // lean el texto completo y no cada <span> individual
      aria-label={text}
    >
      {wordData.map((word, wordIdx) => (
        <React.Fragment key={wordIdx}>
          {/* Espacio entre palabras (excepto antes de la primera) */}
          {wordIdx > 0 && (
            <span className={styles.space} aria-hidden="true">
              {' '}
            </span>
          )}
          {/* Palabra como contenedor inline-block para respetar word-wrap */}
          <span className={styles.word}>
            {word.chars.map(({ char, idx }) => (
              <span
                key={idx}
                className={styles.char}
                aria-hidden="true"
                style={{ animationDelay: `${idx * delay}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
}
