import React from 'react';

export default function KeyStat({ children, variant }) {
  const cls = variant ? `key-stat key-stat--${variant}` : 'key-stat';
  return <span className={cls}>{children}</span>;
}
