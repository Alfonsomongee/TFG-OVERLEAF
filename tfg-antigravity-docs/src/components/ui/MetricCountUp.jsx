import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import styles from './MetricCountUp.module.css';

export default function MetricCountUp({
  endValue,
  startValue = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = 'es-ES',
  className = '',
  as: Tag = 'span',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(startValue);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!inView) return;
    
    if (prefersReducedMotion) {
      setValue(endValue);
      return;
    }

    let startTime = null;
    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;
      
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setValue(endValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [inView, startValue, endValue, duration, prefersReducedMotion]);

  const isSSR = typeof window === 'undefined';
  const displayValue = isSSR ? startValue : value;

  const formattedValue = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <Tag ref={ref} className={`${styles.metric} ${className}`}>
      {prefix}{formattedValue}{suffix}
    </Tag>
  );
}
