// src/components/cine-mode/TimelineController.jsx
// Barra de control fija en la parte inferior

import React, { useState, useRef } from 'react';
import { sceneMetadata } from './chartRegistry';

const SPEED_CYCLE = [0.5, 1, 1.5, 2];

export default function TimelineController({
  currentSceneId, onSceneChange,
  isPlaying, onPlayPause,
  onSkipBack, onSkipForward, onSkipIntro,
  speed, onSpeedChange,
  spotlightActive, onToggleSpotlight,
  kioskActive, onToggleKiosk,
}) {
  const [preview, setPreview] = useState(null); // { scene, x }
  const sliderRef = useRef(null);

  const currentIdx = sceneMetadata.findIndex(s => s.id === currentSceneId);
  const total = sceneMetadata.length;

  const handleSliderChange = (e) => {
    const idx = Number(e.target.value);
    onSceneChange(sceneMetadata[idx].id);
  };

  const handleSliderMouseMove = (e) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (total - 1));
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setPreview({ scene: sceneMetadata[clamped], x: e.clientX - rect.left });
  };

  const cycleSpeed = () => {
    const next = SPEED_CYCLE[(SPEED_CYCLE.indexOf(speed) + 1) % SPEED_CYCLE.length];
    onSpeedChange(next);
  };

  return (
    <div className="cine-timeline">
      {/* Skip intro */}
      <button className="cine-ctrl-btn" onClick={onSkipIntro} title="Saltar al Acto II">
        ⏭
      </button>

      {/* Prev */}
      <button className="cine-ctrl-btn" onClick={onSkipBack} title="Escena anterior">
        ◀◀
      </button>

      {/* Play/Pause */}
      <button className="cine-play-btn" onClick={onPlayPause} title={isPlaying ? 'Pausar' : 'Reproducir'}>
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Next */}
      <button className="cine-ctrl-btn" onClick={onSkipForward} title="Escena siguiente">
        ▶▶
      </button>

      {/* Slider */}
      <div
        className="cine-slider-wrap"
        onMouseMove={handleSliderMouseMove}
        onMouseLeave={() => setPreview(null)}
      >
        <input
          ref={sliderRef}
          className="cine-slider"
          type="range"
          min={0}
          max={total - 1}
          value={currentIdx === -1 ? 0 : currentIdx}
          onChange={handleSliderChange}
        />
        {preview && (
          <div className="cine-preview" style={{ left: preview.x }}>
            <div className="cine-preview-act">Acto {preview.scene.act}</div>
            <div className="cine-preview-title">{preview.scene.title}</div>
          </div>
        )}
      </div>

      {/* Escena actual */}
      <span style={{ color: 'rgba(255,170,0,0.55)', whiteSpace: 'nowrap', fontSize: '0.62rem' }}>
        {currentIdx + 1}/{total}
      </span>

      {/* Velocidad */}
      <button className="cine-speed-btn" onClick={cycleSpeed} title="Cambiar velocidad de reproducción">
        {speed}×
      </button>

      {/* Spotlight */}
      <button
        className={`cine-ctrl-btn${spotlightActive ? ' active' : ''}`}
        onClick={onToggleSpotlight}
        title="Modo Spotlight"
      >
        🔦
      </button>

      {/* Kiosco */}
      <button
        className={`cine-ctrl-btn${kioskActive ? ' active' : ''}`}
        onClick={onToggleKiosk}
        title="Modo Kiosco (pantalla completa)"
      >
        {kioskActive ? '⊡' : '⛶'}
      </button>
    </div>
  );
}
