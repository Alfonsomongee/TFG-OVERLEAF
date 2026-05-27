// src/components/CineMode/CinePlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles/CinePlayer.module.css';
import Slide11 from './slides/Slide11';
import Slide12 from './slides/Slide12';
import Slide13 from './slides/Slide13';
import Slide21 from './slides/Slide21';
import Slide22 from './slides/Slide22';
import Slide23 from './slides/Slide23';
import Slide31 from './slides/Slide31';
import Slide32 from './slides/Slide32';
import Slide33 from './slides/Slide33';
import Slide34 from './slides/Slide34';
import Slide35 from './slides/Slide35';

const slides = [Slide11, Slide12, Slide13, Slide21, Slide22, Slide23, Slide31, Slide32, Slide33, Slide34, Slide35];
const SLIDE_DURATION = 15; // segundos

export default function CinePlayer({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SLIDE_DURATION);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const accumulatedRef = useRef(0);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPlaying) return;
    const now = Date.now();
    const elapsedTotal = accumulatedRef.current + (now - startTimeRef.current) / 1000;
    const remaining = Math.max(0, SLIDE_DURATION - elapsedTotal);
    setTimeLeft(remaining);
    if (remaining <= 0) {
      goToNext();
      return;
    }
    startTimeRef.current = now;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newRemaining = Math.max(0, SLIDE_DURATION - (accumulatedRef.current + elapsed));
      setTimeLeft(newRemaining);
      if (newRemaining <= 0) {
        clearInterval(timerRef.current);
        goToNext();
      }
    }, 100);
  }, [isPlaying, currentIndex]);

  const pause = () => {
    if (!isPlaying) return;
    const now = Date.now();
    accumulatedRef.current += (now - startTimeRef.current) / 1000;
    clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const play = () => {
    if (isPlaying) return;
    startTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // bucle
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Reiniciar al cambiar de slide
  useEffect(() => {
    accumulatedRef.current = 0;
    setTimeLeft(SLIDE_DURATION);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, SLIDE_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        goToNext();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const progress = ((SLIDE_DURATION - timeLeft) / SLIDE_DURATION) * 100;
  const CurrentSlide = slides[currentIndex];

  return (
    <div className={styles.cinePlayer}>
      <div className={styles.timelineBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>

      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar Modo Cine">
          ✕
        </button>
      )}

      <div className={styles.slideContainer}>
        <CurrentSlide slideProgress={1 - timeLeft / SLIDE_DURATION} />
      </div>
      <div className={styles.controls}>
        <button onClick={goToPrev} disabled={currentIndex === 0} className={styles.navButton}>
          ◀ Anterior
        </button>
        <button onClick={isPlaying ? pause : play} className={styles.playButton}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className={styles.timer}>{Math.ceil(timeLeft)}s</span>
        <button onClick={goToNext} className={styles.navButton}>
          Siguiente ▶
        </button>
      </div>
      <div className={styles.slideCounter}>
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
