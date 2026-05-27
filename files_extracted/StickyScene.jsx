import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { motion } from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './StickyScene.module.css';

/**
 * StickyScene — Scrollytelling con gráfico sticky.
 *
 * Cambio en la animación de los steps:
 *
 * ANTES: { opacity: 0.25, y: 24 } → { opacity: 1, y: 0 }, once: false
 *   Problema: la animación de `y` (transform: translateY) con `once: false`
 *   hace que Framer Motion evalúe la posición Y en CADA paso de scroll,
 *   tanto hacia abajo como hacia arriba. Con múltiples StickyScenes activas
 *   simultáneamente, esto multiplica la carga de IntersectionObserver +
 *   layout recalculations por el `y` cambiante.
 *
 * DESPUÉS: solo opacidad, once: false mantenido
 *   - `once: false` se mantiene para que el step vuelva a su estado dim
 *     cuando el usuario sube (feedback visual correcto del scrollytelling).
 *   - Eliminar `y` evita layout recalculations — opacity es 100% GPU.
 *   - Transición más suave con spring para responder orgánicamente al scroll.
 */
export default function StickyScene({ children, graphic: Graphic, steps }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  return (
    <BrowserOnly fallback={<div>Cargando escena interactiva...</div>}>
      {() => (
        <section className={styles.scene} data-act={active}>
          <div className={styles.sticky}>
            {Graphic && <Graphic activeStep={active} progress={progress} />}
          </div>
          <div className={styles.steps}>
            <Scrollama
              offset={0.6}
              onStepEnter={({ data }) => setActive(data)}
              onStepProgress={({ progress }) => setProgress(progress)}
              progress
            >
              {steps.map((s, i) => (
                <Step data={i} key={i}>
                  <motion.div
                    className={styles.step}
                    // ── ANIMACIÓN OPTIMIZADA ──────────────────────────────
                    // Solo opacity: compositable en GPU, sin layout recalc.
                    // once: false mantenido para bidireccionalidad de scroll.
                    initial={{ opacity: 0.2 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      // Spring orgánica: responde al ritmo del scroll del usuario
                      // en lugar de una curva fija que se siente mecánica.
                      type: 'spring',
                      stiffness: 80,
                      damping: 18,
                      mass: 0.8,
                    }}
                  >
                    {s}
                  </motion.div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </section>
      )}
    </BrowserOnly>
  );
}
