import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './TextToSpeech.module.css';

export default function TextToSpeech() {
  const { pathname } = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [showButton, setShowButton] = useState(false);
  
  // Modo inmersivo
  const [isImmersive, setIsImmersive] = useState(false);
  const [rawText, setRawText] = useState("");
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  
  const currentUtteranceRef = useRef(null);
  const contentRef = useRef(null);
  const activeWordRef = useRef(null);

  // Mostrar botón solo en docs
  useEffect(() => {
    if (pathname.includes('/docs/') && !pathname.includes('galeria') && !pathname.includes('documentos') && !pathname.includes('sobre-el-autor')) {
      setShowButton(true);
    } else {
      setShowButton(false);
      handleStop();
    }
  }, [pathname]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getReadText = () => {
    const article = document.querySelector('article');
    if (!article) return '';
    const clone = article.cloneNode(true);
    const toRemove = clone.querySelectorAll('pre, code, table, button, .table-of-contents, .hash-link, .margin-right--sm, img, figure, svg, iframe');
    toRemove.forEach(el => el.remove());
    // Evitar múltiples espacios en blanco y saltos de línea extremos
    return clone.innerText.replace(/\n\s*\n/g, '\n\n').trim();
  };

  // Pre-procesar texto en palabras para el teleprompter
  const wordsArray = useMemo(() => {
    if (!rawText) return [];
    const words = [];
    // Usamos una expresión regular para separar por espacios o saltos de línea conservándolos
    const regex = /(\s+)/g;
    let lastIndex = 0;
    let match;
    
    // Ejecutar RegExp
    while ((match = regex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        words.push({
          text: rawText.substring(lastIndex, match.index),
          start: lastIndex,
          end: match.index,
          isSpace: false
        });
      }
      words.push({
        text: match[0],
        start: match.index,
        end: regex.lastIndex,
        isSpace: true
      });
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < rawText.length) {
      words.push({
        text: rawText.substring(lastIndex),
        start: lastIndex,
        end: rawText.length,
        isSpace: false
      });
    }
    return words;
  }, [rawText]);

  const handlePlayPause = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      const text = getReadText();
      if (!text) return;
      
      setRawText(text);
      setActiveCharIndex(0);
      setIsImmersive(true);
      document.body.style.overflow = 'hidden'; // Bloquear scroll de la web de fondo

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const documentLang = document.documentElement.lang || 'es';
      let selectedVoice = voices.find(v => v.lang.startsWith(documentLang));
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(documentLang.split('-')[0]));
      }
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.rate = rate;
      utterance.pitch = 1;

      // Sincronización mágica
      utterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === 'sentence') {
          setActiveCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        handleStop();
      };

      utterance.onerror = (e) => {
        console.error("Speech error", e);
        handleStop();
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPlaying, isPaused, rate]);

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsImmersive(false);
    document.body.style.overflow = 'auto';
  };

  const handleRateChange = () => {
    const newRate = rate === 1 ? 1.5 : (rate === 1.5 ? 2 : 1);
    setRate(newRate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setTimeout(() => {
        document.getElementById('tts-play-btn').click();
      }, 50);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (activeWordRef.current && isImmersive) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeCharIndex, isImmersive]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  if (!showButton) return null;

  return (
    <>
      {/* Botón Flotante Normal */}
      {!isImmersive && (
        <div className={styles.ttsWidget}>
          <button 
            id="tts-play-btn"
            className={styles.playButton} 
            onClick={handlePlayPause}
            title="Escuchar capítulo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      )}

      {/* Overlay Inmersivo */}
      {isImmersive && (
        <div className={styles.immersiveOverlay}>
          <div className={styles.immersiveHeader}>
            <div className={styles.controls}>
              <button 
                id="tts-play-btn"
                className={styles.playButton} 
                onClick={handlePlayPause}
              >
                {isPaused ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                )}
              </button>
              
              <button className={styles.rateButton} onClick={handleRateChange}>
                {rate}x
              </button>
            </div>
            
            <button className={styles.closeButton} onClick={handleStop} title="Salir">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.fadeTop}></div>

          <div className={styles.immersiveContent} ref={contentRef}>
            <div className={styles.textBlock}>
              {wordsArray.map((w, i) => {
                // Lógica de iluminación
                // Consideramos la palabra "activa" si el activeCharIndex cae dentro de su rango
                // Ojo: onboundary a veces no da en el blanco exacto, así que encendemos si coincide
                const isActive = !w.isSpace && activeCharIndex >= w.start && activeCharIndex < w.end;
                const isPast = activeCharIndex >= w.end;
                
                let className = styles.futureWord;
                if (isActive) className = styles.activeWord;
                else if (isPast) className = styles.pastWord;

                if (w.isSpace) {
                  return <span key={i}>{w.text}</span>;
                }

                return (
                  <span 
                    key={i} 
                    className={className}
                    ref={isActive ? activeWordRef : null}
                  >
                    {w.text}
                  </span>
                );
              })}
            </div>
          </div>

          <div className={styles.fadeBottom}></div>
        </div>
      )}
    </>
  );
}
