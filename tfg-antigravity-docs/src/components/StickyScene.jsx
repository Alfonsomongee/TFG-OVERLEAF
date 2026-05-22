import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { motion } from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './StickyScene.module.css';

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
                    initial={{ opacity: 0.25, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.6 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
