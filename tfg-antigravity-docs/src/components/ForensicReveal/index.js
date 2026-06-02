import React, { useRef, useState, useEffect } from 'react';
import { useInView, motion } from 'framer-motion';
import styles from './styles.module.css';

const CHARSET = '█▓▒░0123456789X';
const getRandomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

export default function ForensicReveal({ children, className }) {
  const text = React.Children.toArray(children).join('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [displayText, setDisplayText] = useState(
    prefersReduced ? text : ''
  );
  const [started, setStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(prefersReduced);

  useEffect(() => {
    if (!isInView || started || !text || prefersReduced) return;
    setStarted(true);

    const finalChars = text.split('');
    const revealed = new Array(finalChars.length).fill(false);
    let revealIndex = 0;
    let mounted = true;
    const pendingTimers = new Set();

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        pendingTimers.delete(id);
        fn();
      }, delay);
      pendingTimers.add(id);
      return id;
    };

    const scrambleInterval = setInterval(() => {
      if (!mounted) return;
      setDisplayText(
        finalChars
          .map((char, i) => {
            if (revealed[i]) return char;
            return char === ' ' ? ' ' : getRandomChar();
          })
          .join('')
      );
    }, 50);

    const revealNext = () => {
      if (!mounted) return;
      if (revealIndex < finalChars.length) {
        revealed[revealIndex] = true;
        revealIndex++;
        if (revealIndex < finalChars.length) {
          revealed[revealIndex] = true;
          revealIndex++;
        }
        safeTimeout(revealNext, 30);
      } else {
        clearInterval(scrambleInterval);
        if (mounted) {
          setDisplayText(text);
          setIsFinished(true);
        }
      }
    };

    safeTimeout(revealNext, 200);

    return () => {
      mounted = false;
      clearInterval(scrambleInterval);
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
    };
  }, [isInView, started, text]);

  if (!started && !isFinished) {
    return (
      <span ref={ref} className={`${styles.forensicText} ${styles.redacted} ${className || ''}`}>
        {text.replace(/[^\s]/g, '█')}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      aria-label={text}
      className={`${styles.forensicText} ${isFinished ? styles.finished : styles.scrambling} ${className || ''}`}
      animate={isFinished ? { opacity: 1 } : {}}
    >
      {displayText}
    </motion.span>
  );
}
