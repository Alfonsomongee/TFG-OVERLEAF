import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@docusaurus/router';
import styles from './BlackoutTransition.module.css';

export default function BlackoutTransition({ children }) {
  const { pathname } = useLocation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <motion.div
          className={styles.veil}
          initial={{ scaleY: 1, transformOrigin: 'top' }}
          animate={{ scaleY: 0, transformOrigin: 'bottom' }}
          exit={{ scaleY: 1, transformOrigin: 'top' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className={styles.flicker}
          animate={{ opacity: [0, 0.9, 0, 0.6, 0] }}
          transition={{ duration: 0.18, times: [0, 0.2, 0.4, 0.7, 1] }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
