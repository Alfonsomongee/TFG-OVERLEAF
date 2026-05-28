// src/components/cine-mode/ActTransition.jsx
// Fundido a negro con título del acto al cambiar de acto

import React, { useEffect, useState } from 'react';

export default function ActTransition({ act, title, triggerKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!act) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(timer);
  }, [triggerKey]); // dispara de nuevo si triggerKey cambia (aunque sea el mismo acto)

  if (!visible) return null;

  return (
    <div className="act-overlay" key={triggerKey}>
      <div className="act-overlay-content">
        <div className="act-overlay-label">ACTO {act}</div>
        <div className="act-overlay-title">{title || ''}</div>
      </div>
    </div>
  );
}
