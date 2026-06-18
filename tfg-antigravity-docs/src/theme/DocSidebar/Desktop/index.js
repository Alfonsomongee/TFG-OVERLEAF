import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { useThemeConfig } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';

const MAGNIFY_DISTANCE = 90;   // px — radio de influencia vertical
const MAGNIFY_SCALE    = 1.07; // escala máxima al pasar el cursor encima
const MAGNIFY_EASE_IN  = { duration: 0.18, ease: 'power2.out', overwrite: 'auto' };
const MAGNIFY_EASE_OUT = { duration: 0.28, ease: 'power2.out', overwrite: 'auto' };

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }) {
  const {
    navbar: { hideOnScroll },
    docs: { sidebar: { hideable } },
  } = useThemeConfig();

  const sidebarRef = useRef(null);

  // ── Efecto Dock: magnificación vertical por proximidad del cursor ──
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const getItems = () => Array.from(el.querySelectorAll('.menu__link'));

    const onMouseMove = (e) => {
      const items = getItems();
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const dist = Math.abs(e.clientY - centerY);
        if (dist < MAGNIFY_DISTANCE) {
          const t = 1 - dist / MAGNIFY_DISTANCE;         // 0→1 según proximidad
          const scale = 1 + (MAGNIFY_SCALE - 1) * t;
          const x = (MAGNIFY_SCALE - 1) * t * 4;         // leve empuje horizontal
          gsap.to(item, { scale, x, ...MAGNIFY_EASE_IN });
        } else {
          gsap.to(item, { scale: 1, x: 0, ...MAGNIFY_EASE_OUT });
        }
      });
    };

    const onMouseLeave = () => {
      gsap.to(getItems(), { scale: 1, x: 0, ...MAGNIFY_EASE_OUT });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      gsap.to(getItems(), { scale: 1, x: 0, overwrite: 'auto' });
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarCollapsed,
      )}
      inert={isHidden ? '' : undefined}
      aria-hidden={isHidden}
    >
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
