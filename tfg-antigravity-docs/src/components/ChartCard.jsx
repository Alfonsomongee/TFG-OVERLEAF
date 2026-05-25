import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import styles from './ChartCard.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

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
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'opacity, transform' }}
        >
          <header className={styles.header}>
            {fig && <span className={styles.fig}>FIG. {fig}</span>}
            <h3 className={styles.title}>{title}</h3>
            {dek && <p className={styles.dek}>{dek}</p>}
          </header>

          <div className={styles.canvas}>
            <motion.div
              className={styles.mask}
              initial={{ clipPath: 'inset(0 0 0% 0)' }}
              animate={inView ? { clipPath: 'inset(0 0 100% 0)' } : {}}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
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
              {source && <span className={styles.source}>Fuente: {source}</span>}
              {caption && <p className={styles.caption}>{caption}</p>}
            </footer>
          )}
        </motion.figure>
      )}
    </BrowserOnly>
  );
}
