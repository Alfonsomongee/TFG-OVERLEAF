import React, { useRef, useState, useEffect } from 'react';
import { useInView, motion } from 'framer-motion';
import styles from './styles.module.css';

// Forensic characters (more professional/documentary style)
const CHARSET = '█▓▒░0123456789X';

const getRandomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

export default function ForensicReveal({ children, className }) {
  // Safely extract string from children
  const text = React.Children.toArray(children).join('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isInView || started || !text) return;

    setStarted(true);
    const finalChars = text.split('');
    const revealed = new Array(finalChars.length).fill(false);
    let revealIndex = 0;
    const REVEAL_STAGGER = 30; // Faster reveal
    const SCRAMBLE_TICK = 50;

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        finalChars
          .map((char, i) => {
            if (revealed[i]) return char;
            return char === ' ' ? ' ' : getRandomChar();
          })
          .join('')
      );
    }, SCRAMBLE_TICK);

    const revealNext = () => {
      if (revealIndex < finalChars.length) {
        revealed[revealIndex] = true;
        revealIndex++;
        // Reveal up to 3 chars at once to speed up long texts
        if (revealIndex < finalChars.length) {
          revealed[revealIndex] = true;
          revealIndex++;
        }
        setTimeout(revealNext, REVEAL_STAGGER);
      } else {
        clearInterval(scrambleInterval);
        setDisplayText(text);
        setIsFinished(true);
      }
    };

    const firstTimer = setTimeout(revealNext, 200); // Small initial delay

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(firstTimer);
    };
  }, [isInView, started, text]);

  // Initial render state
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
      className={`${styles.forensicText} ${isFinished ? styles.finished : ''} ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {displayText}
    </motion.span>
  );
}
