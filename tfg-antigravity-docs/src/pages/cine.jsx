// src/pages/cine.jsx
// Página dedicada al Modo Cine – ruta /cine

import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function CineModePlayerLazy() {
  const [Player, setPlayer] = React.useState(null);

  useEffect(() => {
    import('../components/cine-mode/CineModePlayer')
      .then((m) => setPlayer(() => m.default))
      .catch(console.error);
  }, []);

  if (!Player) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#07090f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8rem',
        color: '#5a5a70',
        letterSpacing: '0.1em',
      }}>
        ⟳ &nbsp;Iniciando Modo Cine...
      </div>
    );
  }

  return <Player />;
}

export default function CineModePage() {
  useEffect(() => {
    document.body.classList.add('cine-mode-active');
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.body.classList.remove('cine-mode-active');
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <Layout
      title="Modo Cine — Anatomía del Apagón Ibérico 28-A"
      description="Experiencia cinematográfica interactiva del colapso eléctrico del 28 de abril de 2025"
      noFooter
      wrapperClassName="cine-layout"
    >
      <BrowserOnly fallback={<div style={{ minHeight: '100vh', background: '#07090f' }} />}>
        {() => <CineModePlayerLazy />}
      </BrowserOnly>
    </Layout>
  );
}
