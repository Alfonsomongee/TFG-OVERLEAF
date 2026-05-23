import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const coords = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  // Actualiza las posiciones usando requestAnimationFrame para 60fps constantes
  const updatePosition = () => {
    const { x, y } = coords.current;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    rafId.current = null;
  };

  const handleMouseMove = (e) => {
    coords.current = { x: e.clientX, y: e.clientY };
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  };

  // Detecta si el mouse está sobre un elemento interactivo
  const handleMouseOver = (e) => {
    const target = e.target;
    if (
      target.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')
    ) {
      ringRef.current?.classList.add(styles.hover);
      document.body.style.cursor = 'none';
    }
  };

  const handleMouseOut = (e) => {
    const target = e.target;
    if (
      target.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')
    ) {
      // Solo restaura si el nuevo elemento no es interactivo
      if (!e.relatedTarget?.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')) {
        ringRef.current?.classList.remove(styles.hover);
        document.body.style.cursor = '';
      }
    }
  };

  useEffect(() => {
    // Oculta el cursor nativo mientras el componente está montado
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={ringRef} className={styles.cursorRing} />
    </>
  );
}
