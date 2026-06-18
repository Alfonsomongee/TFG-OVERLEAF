import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import styles from './SubtleReveal.module.css';

export default function SubtleReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Tag
      ref={ref}
      className={`${styles.base} ${inView ? styles.visible : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
