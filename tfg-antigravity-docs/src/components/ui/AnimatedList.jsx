import React, { useEffect, useRef, useState } from 'react';

const MAX_STAGGER_IDX = 10; // items beyond this index share the max delay

export default function AnimatedList({
  children,
  stagger = 50,
  initialDelay = 0,
  translateY = 12,
  duration = 420,
  resetKey,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.04 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [resetKey]);

  const items = React.Children.toArray(children);

  return (
    <div ref={ref}>
      {items.map((child, i) => {
        const itemDelay = initialDelay + Math.min(i, MAX_STAGGER_IDX) * stagger;
        return (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : `translateY(${translateY}px)`,
              transition: `opacity ${duration}ms ease ${itemDelay}ms, transform ${duration}ms ease ${itemDelay}ms`,
              willChange: 'opacity, transform',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
