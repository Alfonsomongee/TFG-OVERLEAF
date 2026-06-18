import React from 'react';

export default function ShinyText({
  children,
  className = '',
  speed = 3,
  shinyColor = 'rgba(255, 255, 255, 0.9)',
  baseColor = 'currentColor',
}) {
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        color: baseColor,
        background: prefersReduced
          ? 'none'
          : `linear-gradient(120deg, ${baseColor} 40%, ${shinyColor} 50%, ${baseColor} 60%)`,
        backgroundSize: '200% auto',
        color: prefersReduced ? baseColor : 'transparent',
        WebkitBackgroundClip: prefersReduced ? 'unset' : 'text',
        backgroundClip: prefersReduced ? 'unset' : 'text',
        animation: prefersReduced ? 'none' : `shiny-text ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes shiny-text {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
      {children}
    </span>
  );
}
