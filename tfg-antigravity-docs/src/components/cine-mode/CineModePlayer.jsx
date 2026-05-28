// src/components/cine-mode/CineModePlayer.jsx
// Orquestador principal del Modo Cine 2.0

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { useHistory } from '@docusaurus/router';
import Scene from './Scene';
import TimelineController from './TimelineController';
import ActTransition from './ActTransition';
import ParticleSystem from './ParticleSystem';
import { sceneMetadata } from './chartRegistry';
import './cine-mode.css';

export default function CineModePlayer() {
  const [currentSceneId, setCurrentSceneId] = useState(sceneMetadata[0]?.id || '');
  const [currentAct,     setCurrentAct]     = useState(sceneMetadata[0]?.act || 1);
  const [actTransKey,    setActTransKey]     = useState(0); // fuerza re-mount de ActTransition
  const [isPlaying,      setIsPlaying]       = useState(false);
  const [speed,          setSpeed]           = useState(1);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [kioskActive,     setKioskActive]     = useState(false);

  const history    = useHistory();
  const sceneRefs  = useRef({});   // { [sceneId]: DOM element }
  const intervalRef = useRef(null);
  const lastActRef  = useRef(sceneMetadata[0]?.act || 1);

  // ── Actualizar escena activa al hacer scroll ─────────────
  const handleSceneEnter = useCallback((sceneId) => {
    setCurrentSceneId(sceneId);
    const scene = sceneMetadata.find(s => s.id === sceneId);
    if (!scene) return;
    if (scene.act !== lastActRef.current) {
      lastActRef.current = scene.act;
      setCurrentAct(scene.act);
      setActTransKey(k => k + 1); // dispara ActTransition
    }
  }, []);

  // ── Scroll a una escena ──────────────────────────────────
  const scrollTo = useCallback((sceneId) => {
    const el = sceneRefs.current[sceneId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrentSceneId(sceneId);
  }, []);

  // ── Reproducción automática ──────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSceneId(prevId => {
        const idx = sceneMetadata.findIndex(s => s.id === prevId);
        if (idx < sceneMetadata.length - 1) {
          const next = sceneMetadata[idx + 1];
          const el   = sceneRefs.current[next.id];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return next.id;
        } else {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prevId;
        }
      });
    }, (8000 / speed));
  }, [speed]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startAutoPlay();
    }
  }, [isPlaying, startAutoPlay]);

  // Reinicia el intervalo cuando cambia la velocidad mientras está reproduciendo
  useEffect(() => {
    if (isPlaying) startAutoPlay();
  }, [speed]); // eslint-disable-line

  // Limpieza al desmontar
  useEffect(() => () => clearInterval(intervalRef.current), []);

  // ── Navegación manual ────────────────────────────────────
  const handleSkipBack = () => {
    const idx = sceneMetadata.findIndex(s => s.id === currentSceneId);
    if (idx > 0) scrollTo(sceneMetadata[idx - 1].id);
  };

  const handleSkipForward = () => {
    const idx = sceneMetadata.findIndex(s => s.id === currentSceneId);
    if (idx < sceneMetadata.length - 1) scrollTo(sceneMetadata[idx + 1].id);
  };

  const handleSkipIntro = () => {
    const act2 = sceneMetadata.find(s => s.act === 2);
    if (act2) scrollTo(act2.id);
  };

  // ── Spotlight ────────────────────────────────────────────
  const handleToggleSpotlight = () => {
    const next = !spotlightActive;
    setSpotlightActive(next);
    document.body.classList.toggle('cine-spotlight', next);
  };

  // ── Kiosco ───────────────────────────────────────────────
  const handleToggleKiosk = () => {
    const next = !kioskActive;
    setKioskActive(next);
    document.body.classList.toggle('cine-kiosk', next);
    if (next) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.();
    }
  };

  // Limpiar clases globales al desmontar
  useEffect(() => {
    return () => {
      document.body.classList.remove('cine-spotlight', 'cine-kiosk');
    };
  }, []);

  const currentScene = sceneMetadata.find(s => s.id === currentSceneId);

  return (
    <div className="cine-root">
      {/* Partículas de fondo */}
      <ParticleSystem act={currentAct} />

      {/* Transición de acto (fundido a negro) */}
      <ActTransition
        key={actTransKey}
        act={currentAct}
        title={currentScene?.actTitle}
        triggerKey={actTransKey}
      />

      {/* Cabecera fija */}
      <header className="cine-header">
        <span className="cine-header-title">🎬 MODO CINE</span>
        <span className="cine-header-sep">|</span>
        <span>Anatomía del colapso eléctrico ibérico · 28 de abril de 2025</span>
        <button
          className="cine-close-btn"
          onClick={() => history.push('/introduccion')}
          title="Volver a la documentación"
        >
          ✕ Cerrar
        </button>
      </header>

      {/* Escenas */}
      <div className="cine-scenes-container">
        {sceneMetadata.map((scene) => (
          <div
            key={scene.id}
            ref={(el) => { sceneRefs.current[scene.id] = el; }}
          >
            <Scene
              scene={scene}
              isActive={scene.id === currentSceneId}
              onEnter={handleSceneEnter}
            />
          </div>
        ))}
      </div>

      {/* Barra de control */}
      <TimelineController
        currentSceneId={currentSceneId}
        onSceneChange={scrollTo}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onSkipIntro={handleSkipIntro}
        speed={speed}
        onSpeedChange={setSpeed}
        spotlightActive={spotlightActive}
        onToggleSpotlight={handleToggleSpotlight}
        kioskActive={kioskActive}
        onToggleKiosk={handleToggleKiosk}
      />
    </div>
  );
}
