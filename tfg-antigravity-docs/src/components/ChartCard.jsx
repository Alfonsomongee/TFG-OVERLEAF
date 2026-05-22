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
    <BrowserOnly fallback={<div>Cargando figura periodística...</div>}>
      {() => (
        <motion.figure
          ref={ref}
          className={clsx(styles.card, fullBleed && styles.fullBleed, 'chart-card')}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className={styles.header}>
            {fig && <span className={styles.fig}>FIG. {fig}</span>}
            <h3 className={styles.title}>{title}</h3>
            {dek && <p className={styles.dek}>{dek}</p>}
          </header>

          <div className={styles.canvas}>
            {/* Reveal mask — cortina que desciende dejando ver el chart */}
            <motion.div
              className={styles.mask}
              initial={{ scaleY: 1, transformOrigin: 'top' }}
              animate={inView ? { scaleY: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            />
            {children}
          </div>

          {(caption || source) && (
            <footer className={styles.footer}>
              {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
              {source && <cite className={styles.source}>Fuente: {source}</cite>}
            </footer>
          )}
        </motion.figure>
      )}
    </BrowserOnly>
  );
}
