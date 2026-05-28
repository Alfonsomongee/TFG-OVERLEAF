// src/components/cine-mode/TimelineController.jsx
// Barra de control fija en la parte inferior

import React, { useState, useEffect, useRef } from 'react';
import { sceneMetadata } from './chartRegistry';

export default function TimelineController({
  currentSceneId,
  onSceneChange,
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onSkipIntro,
  speed,
  onSpeedChange,
  spotlightActive,
  onToggleSpotlight,
  kioskActive,
  onToggleKiosk,
}) {
  const currentIndex = sceneMetadata.findIndex(s => s.id === currentSceneId);
  const progress     = ((currentIndex + 1) / sceneMetadata.length) * 100;

  // Hover preview sobre el slider
  const [hoverScene,    setHoverScene]    = useState(null);
  const [hoverLeft,     setHoverLeft]     = useState(0);
  const sliderRef = useRef(null);

  const handleSliderChange = (e) => {
    const pct   = parseFloat(e.target.value) / 100;
    const idx   = Math.min(Math.round(pct * (sceneMetadata.length - 1)), sceneMetadata.length - 1);
    onSceneChange(sceneMetadata[idx].id);
  };

  const handleMouseMove = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect  = slider.getBoundingClientRect();
    const pct   = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const idx   = Math.min(Math.floor(pct * sceneMetadata.length), sceneMetadata.length - 1);
    setHoverScene(sceneMetadata[idx]);
    setHoverLeft(e.clientX - rect.left);
  };

  const handleMouseLeave = () => setHoverScene(null);

  return (
    <div className="cine-timeline" role="toolbar" aria-label="Controles del modo cine">
      {/* ── Botones ── */}
      <div className="cine-controls">
        <button className="cine-btn" onClick={onSkipIntro}   title="Saltar intro (Acto II)">⏭ Intro</button>
        <button className="cine-btn" onClick={onSkipBack}    title="Escena anterior" aria-label="Anterior">⏪</button>
        <button className="cine-btn play" onClick={onPlayPause} aria-label={isPlaying ? 'Pausa' : 'Reproducir'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="cine-btn" onClick={onSkipForward} title="Escena siguiente" aria-label="Siguiente">⏩</button>

        <select
          className="cine-speed"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          title="Velocidad"
          aria-label="Velocidad de reproducción"
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={1.5}>1.5×</option>
          <option value={2}>2×</option>
        </select>

        <button
          className={`cine-btn${spotlightActive ? ' active' : ''}`}
          onClick={onToggleSpotlight}
          title={spotlightActive ? 'Desactivar spotlight' : 'Modo spotlight'}
          aria-pressed={spotlightActive}
        >
          {spotlightActive ? '🌙' : '☀️'}
        </button>

        <button
          className={`cine-btn${kioskActive ? ' active' : ''}`}
          onClick={onToggleKiosk}
          title={kioskActive ? 'Salir de kiosco' : 'Modo kiosco (pantalla completa)'}
          aria-pressed={kioskActive}
        >
          🖥
        </button>
      </div>

      {/* ── Slider ── */}
      <div className="cine-slider-wrap">
        <input
          ref={sliderRef}
          type="range"
          className="cine-slider"
          min="0"
          max="100"
          step="1"
          value={progress}
          onChange={handleSliderChange}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label="Progreso de escenas"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={sceneMetadata.length}
        />

        {hoverScene && (
          <div className="cine-preview" style={{ left: hoverLeft }}>
            <div className="cine-preview-act">ACTO {hoverScene.act} · {hoverScene.actTitle}</div>
            <div className="cine-preview-title">{hoverScene.title}</div>
            <div className="cine-preview-desc">{hoverScene.description}</div>
          </div>
        )}
      </div>

      {/* ── Contador ── */}
      <div className="cine-counter" aria-live="polite">
        {currentIndex + 1}&thinsp;/&thinsp;{sceneMetadata.length}
      </div>
    </div>
  );
}
