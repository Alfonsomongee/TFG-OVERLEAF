import React, { useRef, useState, useEffect } from 'react';
import { useInView, motion } from 'framer-motion';
import styles from './styles.module.css';

const CHARSET = '▀▄▌▐░▒▓█▓▒░▀▄▌▐ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

const getRandomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

export default function ForensicReveal({ children, className }) {
  const text = typeof children === 'string' ? children : '';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayText, setDisplayText] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;

    // 1. Mostramos inmediatamente una versión completamente ilegible
    setDisplayText(text.split('').map(() => getRandomChar()).join(''));
    setStarted(true);

    const finalChars = text.split('');
    const revealed = new Array(finalChars.length).fill(false);
    let revealIndex = 0;
    const REVEAL_STAGGER = 50;    // retraso entre cada carácter que se fija
    const SCRAMBLE_TICK = 60;     // velocidad de refresco de los símbolos aleatorios

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        finalChars
          .map((char, i) => (revealed[i] ? char : getRandomChar()))
          .join('')
      );
    }, SCRAMBLE_TICK);

    const revealNext = () => {
      if (revealIndex < finalChars.length) {
        revealed[revealIndex] = true;
        revealIndex++;
        setTimeout(revealNext, REVEAL_STAGGER);
      } else {
        clearInterval(scrambleInterval);
        setDisplayText(text); // asegura el texto final exacto
      }
    };

    const firstTimer = setTimeout(revealNext, REVEAL_STAGGER);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(firstTimer);
    };
  }, [isInView, started, text]);

  return (
    <motion.span
      ref={ref}
      className={`${styles.forensicText} ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
    >
      {displayText}
    </motion.span>
  );
}
