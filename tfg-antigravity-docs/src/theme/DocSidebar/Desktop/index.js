import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { useThemeConfig } from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }) {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();

  const sidebarRef = useRef(null);
  const prevHiddenRef = useRef(isHidden);
  const entranceTlRef = useRef(null);

  useEffect(() => {
    const wasHidden = prevHiddenRef.current;
    prevHiddenRef.current = isHidden;

    if (!sidebarRef.current) return;

    // Apertura: animar items con stagger tras dejar que el contenedor expanda
    if (wasHidden && !isHidden) {
      entranceTlRef.current?.kill();
      const items = sidebarRef.current.querySelectorAll(
        '.menu__link, .menu__list-item-collapsible'
      );
      if (items.length) {
        entranceTlRef.current = gsap.from(items, {
          x: -8,
          opacity: 0,
          duration: 0.38,
          ease: 'power3.out',
          stagger: { each: 0.016, from: 'start' },
          delay: 0.18,
          clearProps: 'x,opacity',
        });
      }
    }

    // Cierre: cancelar cualquier animación de entrada en curso
    if (!wasHidden && isHidden) {
      entranceTlRef.current?.kill();
    }
  }, [isHidden]);

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
