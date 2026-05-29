import React, { useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';

export default function Layout(props) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = location.pathname.toLowerCase();
    const hideButtonsPaths = [
      '/datos-tiempo-real',
      '/glosario',
      '/referencias',
      'galeria',
      '/cronologia',
      '/sobre-el-autor'
    ];
    
    const shouldHideButtons = hideButtonsPaths.some(keyword => path.includes(keyword));

    if (shouldHideButtons) {
      document.body.classList.add('hide-floating-buttons');
    } else {
      document.body.classList.remove('hide-floating-buttons');
    }

    return () => {
      document.body.classList.remove('hide-floating-buttons');
    };
  }, [location.pathname]);

  return <OriginalLayout {...props} />;
}
