import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import CinePlayer from './CinePlayer';
import styles from './styles/CineModeLauncher.module.css';

export default function CineModeLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.launcherContainer}>
        <button className={styles.launcherButton} onClick={() => setIsOpen(true)}>
          <span className={styles.icon}>🎬</span>
          <span className={styles.text}>Modo Presentación</span>
        </button>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className={styles.overlay}>
          <CinePlayer onClose={() => setIsOpen(false)} />
        </div>,
        document.body
      )}
    </>
  );
}
