// src/components/cine-mode/ParticleSystem.jsx
// Canvas de partículas de fondo, cambia por acto

import React, { useEffect, useRef } from 'react';

const ACT_CONFIG = {
  1: { color: 'rgba(255,180,40,', count: 55, size: [1, 2.5], speed: 0.25, shape: 'circle' },
  2: { color: 'rgba(220,50,30,',  count: 40, size: [2, 5],   speed: 0.5,  shape: 'square' },
  3: { color: 'rgba(120,130,150,',count: 60, size: [1, 2],   speed: 0.15, shape: 'circle' },
  4: { color: 'rgba(40,200,120,', count: 45, size: [1, 2],   speed: 0.2,  shape: 'line'   },
};

function randBetween(a, b) { return a + Math.random() * (b - a); }

export default function ParticleSystem({ act }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ particles: [], cfg: null, raf: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cfg = ACT_CONFIG[act] || ACT_CONFIG[1];
    stateRef.current.cfg = cfg;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Crear partículas
    stateRef.current.particles = Array.from({ length: cfg.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: randBetween(cfg.size[0], cfg.size[1]),
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed - cfg.speed * 0.3,
      alpha: randBetween(0.2, 0.7),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { particles, cfg: c } = stateRef.current;
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = `${c.color}1)`;
        if (c.shape === 'square') {
          ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        } else if (c.shape === 'line') {
          ctx.strokeStyle = `${c.color}1)`;
          ctx.lineWidth   = p.r * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.r * 4, p.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      ctx.globalAlpha = 1;
      stateRef.current.raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('resize', resize);
    };
  }, [act]);

  return <canvas ref={canvasRef} className="cine-particles" />;
}
