// src/components/cine-mode/Scene.jsx
// Envoltorio de cada escena con IntersectionObserver y lazy loading

import React, { Suspense, useEffect, useRef } from 'react';
import { chartRegistry } from './chartRegistry';

function LoadingPlaceholder() {
  return (
    <div className="cine-loading">
      <span>⟳ &nbsp;Cargando visualización forense...</span>
    </div>
  );
}

export default function Scene({ scene, isActive, onEnter }) {
  const wrapRef   = useRef(null);
  const Component = chartRegistry[scene.component];

  // IntersectionObserver – notifica al player qué escena está en pantalla
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('scene-visible');
            onEnter?.(scene.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-60px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scene.id, onEnter]);

  // Clase activa para spotlight / estilos de borde
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.classList.toggle('scene-active', isActive);
  }, [isActive]);

  return (
    <div
      ref={wrapRef}
      className="cine-scene-wrapper"
      data-scene-id={scene.id}
    >
      <div className="cine-scene-header">
        <span className="cine-scene-act-label">ACTO {scene.act}</span>
        <h2 className="cine-scene-title">{scene.title}</h2>
      </div>

      <Suspense fallback={<LoadingPlaceholder />}>
        {Component ? <Component /> : <LoadingPlaceholder />}
      </Suspense>
    </div>
  );
}
