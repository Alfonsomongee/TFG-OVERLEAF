import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import CinePlayer from './CinePlayer';
import styles from './styles/CineModeLauncher.module.css';

export default function CineModeLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.floatingBtn}
        onClick={() => setIsOpen(true)}
        title="Modo Presentación — recorre el TFG con animaciones"
        aria-label="Abrir modo presentación"
      >
        <span className={styles.icon}>🎬</span>
        <span className={styles.text}>Modo Presentación</span>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className={styles.overlay}>
          <CinePlayer onClose={() => setIsOpen(false)} />
        </div>,
        document.body
      )}
    </>
  );
}
