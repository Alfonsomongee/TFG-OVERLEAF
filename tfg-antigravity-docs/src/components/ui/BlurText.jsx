import React, { useEffect, useRef, useState } from 'react';

export default function BlurText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  style = {},
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : (prefersReduced ? 'none' : 'blur(8px)'),
        transform: visible ? 'translateY(0)' : (prefersReduced ? 'none' : 'translateY(5px)'),
        transition: prefersReduced ? 'none' : `opacity 0.55s ease ${delay}ms, filter 0.55s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
        willChange: prefersReduced ? 'auto' : 'opacity, filter, transform',
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}
