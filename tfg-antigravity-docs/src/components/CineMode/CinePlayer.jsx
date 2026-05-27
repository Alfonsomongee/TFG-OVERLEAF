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
import Slide41 from './slides/Slide41';
import Slide42 from './slides/Slide42';
import Slide43 from './slides/Slide43';
import Slide44 from './slides/Slide44';
import Slide61 from './slides/Slide61';
import Slide62 from './slides/Slide62';
import Slide63 from './slides/Slide63';
import Slide64 from './slides/Slide64';
import Slide71 from './slides/Slide71';
import Slide72 from './slides/Slide72';
import Slide73 from './slides/Slide73';
import Slide74 from './slides/Slide74';
import Slide75 from './slides/Slide75';
import Slide76 from './slides/Slide76';
import Slide77 from './slides/Slide77';
import Slide78 from './slides/Slide78';
import Slide79 from './slides/Slide79';
import Slide80 from './slides/Slide80';
import Slide81 from './slides/Slide81';
import Slide82 from './slides/Slide82';
import Slide83 from './slides/Slide83';
import Slide84 from './slides/Slide84';
import Slide85 from './slides/Slide85';
import Slide86 from './slides/Slide86';
import Slide87 from './slides/Slide87';
import Slide91 from './slides/Slide91';
import Slide92 from './slides/Slide92';
import Slide93 from './slides/Slide93';
import Slide94 from './slides/Slide94';
import Slide95 from './slides/Slide95';
import Slide96 from './slides/Slide96';
import Slide97 from './slides/Slide97';
import Slide98 from './slides/Slide98';
import Slide99 from './slides/Slide99';

const slides = [Slide11, Slide12, Slide13, Slide21, Slide22, Slide23, Slide31, Slide32, Slide33, Slide34, Slide35, Slide41, Slide42, Slide43, Slide44, Slide61, Slide62, Slide63, Slide64, Slide71, Slide72, Slide73, Slide74, Slide75, Slide76, Slide77, Slide78, Slide79, Slide80, Slide81, Slide82, Slide83, Slide84, Slide85, Slide86, Slide87, Slide91, Slide92, Slide93, Slide94, Slide95, Slide96, Slide97, Slide98, Slide99];
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
