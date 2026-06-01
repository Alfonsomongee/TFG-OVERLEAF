import React from 'react';

export default function Collapsible({ label, children }) {
  return (
    <details className="collapsible">
      <summary><span>▶ {label}</span></summary>
      <div className="collapsibleBody">{children}</div>
    </details>
  );
}
