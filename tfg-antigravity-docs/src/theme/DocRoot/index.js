import React from 'react';
import { motion } from 'framer-motion';
import DocRoot from '@theme-original/DocRoot';
import styles from './styles.module.css';

const variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    // Solo opacidad – sin blur, sin clipPath – para GPU puro y evitar repaints
    transition: { duration: 0.25, ease: 'easeIn' }
  },
};

export default function DocRootWrapper(props) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className={styles.pageWrapper}
    >
      <div className={styles.scanlinesOverlay} />
      <DocRoot {...props} />
    </motion.div>
  );
}
