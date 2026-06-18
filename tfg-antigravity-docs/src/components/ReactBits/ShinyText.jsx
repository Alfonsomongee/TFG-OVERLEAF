import React from 'react';

export default function ShinyText({
  children,
  className = '',
  speed = 3,
  shinyColor = 'rgba(255, 255, 255, 0.9)',
  baseColor = 'currentColor',
}) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        color: baseColor,
        background: `linear-gradient(120deg, ${baseColor} 40%, ${shinyColor} 50%, ${baseColor} 60%)`,
        backgroundSize: '200% auto',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: `shiny-text ${speed}s linear infinite`,
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
