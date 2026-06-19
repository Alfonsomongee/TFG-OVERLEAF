import React, { useState, useEffect } from 'react';

const STYLE = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  zIndex: 900,
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(10, 17, 40, 0.85)',
  backdropFilter: 'blur(8px)',
  color: 'var(--forensic-amber-primary, #ffaa00)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.25s ease, transform 0.25s ease',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
};

const STYLE_LIGHT = {
  background: 'rgba(244, 241, 234, 0.9)',
  border: '1px solid rgba(139, 38, 53, 0.15)',
  color: '#8B2635',
};

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark';

  const merged = {
    ...STYLE,
    ...(isDark ? {} : STYLE_LIGHT),
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
  };

  return (
    <button
      style={merged}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
      type="button"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
