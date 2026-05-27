import React from 'react';
import { useLocation } from '@docusaurus/router';
import { motion, AnimatePresence } from 'framer-motion';
import DocRoot from '@theme-original/DocRoot';
import styles from './styles.module.css';

/**
 * Variantes de transición de página optimizadas.
 *
 * Problema original: el exit usaba filter: blur(12px) + clipPath[] con 5 keyframes.
 * blur() sobre un elemento que cambia clipPath impide al navegador compositar
 * la animación en GPU → layout paint en cada frame → jank visible.
 *
 * Solución: exit usa SOLO opacity (100% compositable, GPU, sin layout recalc).
 * El resultado es más rápido (0.3s vs 0.8s) y más elegante — una disolución
 * limpia en lugar de un glitch de salida que competía con el contenido.
 */
const variants = {
  initial: {
    opacity: 0,
    filter: 'blur(4px)',       // entrada con blur suave (solo en initial, no en exit)
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart — entrada premium
    },
  },
  exit: {
    opacity: 0,
    // SIN blur, SIN clipPath — opacity pura = GPU compositable = 0 jank
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1], // easeIn rápida — salida snappy
    },
  },
};

export default function DocRootWrapper(props) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={styles.pageWrapper}
        // will-change: opacity prehint al browser sobre qué propiedad cambiará
        style={{ willChange: 'opacity' }}
      >
        <div className={styles.scanlinesOverlay} aria-hidden="true" />
        <DocRoot {...props} />
      </motion.div>
    </AnimatePresence>
  );
}
