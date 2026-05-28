// src/components/cine-mode/ParticleSystem.jsx
// Sistema de partículas en canvas – cambia visualmente por acto

import React, { useEffect, useRef } from 'react';

const CONFIGS = {
  1: { count: 90,  color: [239, 159, 39],  size: 1.4, speed: 0.25, shape: 'circle', opacity: 0.5 },  // ámbar solar
  2: { count: 70,  color: [211, 47,  47],  size: 3,   speed: 1.4,  shape: 'square', opacity: 0.55, glitch: true }, // rojo fallo
  3: { count: 100, color: [70,  72,  90],  size: 2,   speed: 0.7,  shape: 'circle', opacity: 0.4 }, // ceniza
  4: { count: 130, color: [29,  158, 117], size: 1,   speed: 1.0,  shape: 'line',   opacity: 0.3 }, // verde restauración
  5: { count: 80,  color: [33,  150, 243], size: 1,   speed: 0.4,  shape: 'circle', opacity: 0.25 }, // azul calma
};

function buildParticles(cfg, w, h) {
  const arr = [];
  for (let i = 0; i < cfg.count; i++) {
    arr.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: cfg.size * (0.6 + Math.random() * 0.8),
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed,
      g:  cfg.glitch ? Math.random() * 8 : 0,
    });
  }
  return arr;
}

export default function ParticleSystem({ act }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const stateRef  = useRef({ particles: [], w: 0, h: 0, cfg: CONFIGS[1] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const s = stateRef.current;
      s.w = canvas.width;
      s.h = canvas.height;
      s.particles = buildParticles(s.cfg, s.w, s.h);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Actualizar config cuando cambia el acto
  useEffect(() => {
    const s = stateRef.current;
    s.cfg = CONFIGS[act] || CONFIGS[1];
    s.particles = buildParticles(s.cfg, s.w || window.innerWidth, s.h || window.innerHeight);
  }, [act]);

  // Loop de animación
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const { particles, w, h, cfg } = stateRef.current;
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = cfg.color;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        let dx = p.x, dy = p.y;
        let alpha = cfg.opacity;
        if (p.g && Math.random() < 0.04) {
          dx += (Math.random() - 0.5) * p.g;
          dy += (Math.random() - 0.5) * p.g;
          alpha = Math.min(1, alpha * 1.5);
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = `rgb(${r},${g},${b})`;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;

        if (cfg.shape === 'square') {
          ctx.fillRect(dx - p.size / 2, dy - p.size / 2, p.size, p.size);
        } else if (cfg.shape === 'line') {
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(dx, dy);
          ctx.lineTo(dx + p.vx * 6, dy + p.vy * 6);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(dx, dy, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} className="cine-particle-canvas" />;
}
