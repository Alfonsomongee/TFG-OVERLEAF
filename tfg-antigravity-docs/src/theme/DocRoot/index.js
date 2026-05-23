import React from 'react';
import { useLocation } from '@docusaurus/router';
import { AnimatePresence, motion } from 'framer-motion';
import DocRoot from '@theme-original/DocRoot';
import styles from './styles.module.css';

const variants = {
  initial: {
    opacity: 0,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    filter: 'blur(12px)',
    clipPath: [
      'inset(0 0 0 0)',
      'inset(15% 0 70% 0)',
      'inset(35% 0 45% 0)',
      'inset(5% 0 80% 0)',
      'inset(0 0 100% 0)',
    ],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      times: [0, 0.2, 0.4, 0.6, 1],
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
      >
        <div className={styles.scanlinesOverlay} />
        <DocRoot {...props} />
      </motion.div>
    </AnimatePresence>
  );
}
