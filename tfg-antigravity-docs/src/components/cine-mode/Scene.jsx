// src/components/cine-mode/Scene.jsx
// Wrapper de escena con IntersectionObserver

import React, { useEffect, useRef, Suspense } from 'react';
import { chartRegistry } from './chartRegistry';

function LoadingPlaceholder() {
  return (
    <div className="cine-scene-loading">
      ⟳ &nbsp;Cargando escena...
    </div>
  );
}

export default function Scene({ scene, isActive, onEnter }) {
  const wrapperRef = useRef(null);
  const Component = chartRegistry[scene.component];

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scene-visible');
          onEnter(scene.id);
        } else {
          el.classList.remove('scene-visible');
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scene.id, onEnter]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (isActive) {
      el.classList.add('scene-active');
    } else {
      el.classList.remove('scene-active');
    }
  }, [isActive]);

  const idx = ['kpi', 'mix', 'cascada', 'frecuencia', 'interconexiones', 'cronologia']
    .indexOf(scene.id);

  return (
    <div ref={wrapperRef} className="cine-scene-wrapper" id={`scene-${scene.id}`}>
      <div className="cine-scene-meta">
        <div className="cine-scene-number">
          Acto {scene.act} &nbsp;·&nbsp; Escena {idx + 1}
        </div>
        <h2 className="cine-scene-title">{scene.title}</h2>
        <p className="cine-scene-description">{scene.description}</p>
      </div>

      <Suspense fallback={<LoadingPlaceholder />}>
        {Component ? <Component /> : <LoadingPlaceholder />}
      </Suspense>
    </div>
  );
}
