import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import styles from './GlitchTitle.module.css';

export default function GlitchTitle({ children, as: Tag = 'h1', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <Tag ref={ref}
         className={`${styles.glitch} ${inView ? styles.run : ''} ${className}`}
         data-text={typeof children === 'string' ? children : ''}>
      {children}
    </Tag>
  );
}
