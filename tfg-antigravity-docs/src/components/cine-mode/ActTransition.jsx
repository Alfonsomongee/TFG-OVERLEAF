// src/components/cine-mode/ActTransition.jsx
// Overlay de fundido negro al cambiar de acto

import React, { useState, useEffect } from 'react';

const ACT_LABELS = {
  1: 'ACTO I',
  2: 'ACTO II',
  3: 'ACTO III',
  4: 'ACTO IV',
};

export default function ActTransition({ act, title, triggerKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return; // no mostrar en carga inicial
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible) return null;

  return (
    <div className="act-overlay">
      <div className="act-overlay-label">{ACT_LABELS[act] || `ACTO ${act}`}</div>
      {title && <div className="act-overlay-title">{title}</div>}
    </div>
  );
}
