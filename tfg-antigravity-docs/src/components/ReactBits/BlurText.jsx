import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function BlurText({
  text,
  delay = 50,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Split text by words
  const words = typeof text === 'string' ? text.split(' ') : [];

  if (typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span
            style={{
              display: 'inline-block',
              transition: 'filter 600ms ease, opacity 600ms ease, transform 600ms ease',
              transitionDelay: `${index * delay}ms`,
              filter: inView ? 'blur(0px)' : 'blur(8px)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
}
