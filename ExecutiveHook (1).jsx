import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ExecutiveHook = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem('splash_seen');
    if (!seen) setShowSplash(true);
  }, []);

  useEffect(() => {
    if (!showSplash) return;

    // Start fade out at 5.2s
    const fadeTimer = setTimeout(() => setFadingOut(true), 5200);

    // Unmount after fade (5.2s + 0.8s fade = 6s)
    const unmountTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splash_seen', '1');
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <motion.div
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000000',
        background: `radial-gradient(ellipse at center,
          rgba(0,0,0,0) 40%,
          rgba(0,0,0,0.85) 100%),
          #000000`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        style={{
          fontFamily: '"Alfa Slab One", cursive',
          fontSize: 'clamp(64px, 10vw, 140px)',
          fontWeight: 900,
          color: '#FFAA00',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          lineHeight: 0.88,
          margin: 0,
          textShadow: `
            2px 2px 0px #CC2200,
            4px 4px 0px #AA1100,
            6px 6px 0px #880000,
            8px 8px 0px rgba(0,0,0,0.5)
          `,
          WebkitTextStroke: '1px rgba(0,0,0,0.4)',
          textAlign: 'center',
        }}
      >
        IBERIAN
        <br />
        BLACKOUT
        <br />
        2025
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 1.5 }}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(16px, 2.5vw, 28px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.25em',
          margin: '20px 0 0 0',
          textAlign: 'center',
          maxWidth: '90%',
        }}
      >
        Forensic Analysis of Systemic Collapse
      </motion.p>

      {/* Author */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 2.8 }}
        style={{
          fontFamily: '"Alfa Slab One", cursive',
          fontSize: 'clamp(18px, 2.5vw, 32px)',
          color: 'rgba(255,170,51,0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.4em',
          margin: '12px 0 0 0',
          textAlign: 'center',
        }}
      >
        Alfonso Monge
      </motion.p>
    </motion.div>
  );
};

export default ExecutiveHook;
