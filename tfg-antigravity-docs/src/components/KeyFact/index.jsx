import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const urlMap = {
  'inercia-28a': '/contexto#inercia-28a',
  'granada-disparo': '/analisis-incidente#granada-disparo',
  'fase-2-taplag': '/analisis-incidente#fase-2-taplag',
  'mallado-ferranti': '/analisis-incidente#mallado-ferranti',
  'paradoja-ufls': '/analisis-incidente#paradoja-ufls'
};

export default function KeyFact({ id, mode = 'full', anchor, children }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        setIsActive(window.location.hash === `#${id}`);
      };
      
      handleHashChange(); // check on mount

      window.addEventListener('hashchange', handleHashChange);
      // Fallback para clicks en Next/Docusaurus que no disparan hashchange nativo
      const interval = setInterval(handleHashChange, 500); 
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        clearInterval(interval);
      };
    }
  }, [id]);

  if (mode === 'full') {
    return (
      <div id={id} className={`${styles.keyfact} ${isActive ? styles.active : ''}`}>
        {children}
      </div>
    );
  }

  // mode === 'callback'
  const targetHref = urlMap[id] || `#${id}`;
  return (
    <sup className={styles.callback}>
      [→ <Link to={targetHref}>{children || 'ver contexto completo'}</Link>]
    </sup>
  );
}
