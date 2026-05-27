import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import styles from './ChartCard.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * ChartCard — Figura periodística con reveal animation.
 *
 * Cambio en la máscara de reveal:
 *
 * ANTES: scaleY con transformOrigin dinámico
 *   → scaleY en un div con height: 100% puede provocar layout recalculations
 *     en algunos navegadores (especialmente cuando el hijo tiene height relativo).
 *     transformOrigin: 'top' funciona pero no garantiza compositing puro.
 *
 * DESPUÉS: clipPath: inset()
 *   → clipPath es 100% compositable en GPU en todos los browsers modernos.
 *   → inset(0 0 100% 0) → inset(0 0 0% 0) revela el contenido de arriba abajo.
 *   → Sin layout recalculation, sin repaint — pura GPU compositing.
 */
export default function ChartCard({
  fig, title, dek, source, caption, fullBleed = false, children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <BrowserOnly fallback={<div className={styles.skeleton}>Cargando figura...</div>}>
      {() => (
        <motion.figure
          ref={ref}
          className={clsx(styles.card, fullBleed && styles.fullBleed, 'chart-card')}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1], // easeOutExpo — entrada premium
          }}
          style={{ willChange: 'opacity, transform' }}
        >
          <header className={styles.header}>
            {fig && <span className={styles.fig}>FIG. {fig}</span>}
            <h3 className={styles.title}>{title}</h3>
            {dek && <p className={styles.dek}>{dek}</p>}
          </header>

          <div className={styles.canvas}>
            {/*
              Máscara de reveal con clipPath — cortina que se eleva dejando ver el chart.
              clipPath: inset() es la propiedad compositable por excelencia:
              - No provoca layout (no afecta al box model)
              - No provoca repaint (el browser la aplica en la capa de compositing)
              - Funciona en todos los browsers modernos (Chrome 55+, Firefox 54+, Safari 13.1+)
            */}
            <motion.div
              className={styles.mask}
              initial={{ clipPath: 'inset(0 0 0% 0)' }}
              animate={inView ? { clipPath: 'inset(0 0 100% 0)' } : {}}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1], // easeOutExpo sincronizada con el card
                delay: 0.08,
              }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--bg-1, hsl(220 40% 7%))',
                pointerEvents: 'none',
                zIndex: 2,
                willChange: 'clip-path',
              }}
            />
            {children}
          </div>

          {(source || caption) && (
            <footer className={styles.footer}>
              {source && (
                <span className={styles.source}>
                  Fuente: {source}
                </span>
              )}
              {caption && (
                <p className={styles.caption}>{caption}</p>
              )}
            </footer>
          )}
        </motion.figure>
      )}
    </BrowserOnly>
  );
}
