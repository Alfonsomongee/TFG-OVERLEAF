/**
 * AnimatedRestorationMap.jsx
 * Mapa animado de secuencias de reposición del sistema ibérico.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. RENDIMIENTO — isEnergized cacheado:
 *    La versión anterior recorría TODOS los links en cada frame del canvas
 *    (60 fps × n_nodos × n_links = miles de iteraciones/segundo).
 *    Ahora se precalcula un Set de nudos energizados que solo se actualiza
 *    cuando cambia simTime, no en cada frame.
 *
 * 2. BUNDLE — webpackChunkName:
 *    El import dinámico de react-force-graph-2d ahora tiene un nombre de
 *    chunk explícito para que aparezca identificado en el bundle analyzer.
 *    Esto facilita diagnosticar su peso (~800 KB–1,2 MB con D3+Three.js).
 *
 * 3. DATOS — hora de inicio corregida:
 *    El blackout fue a las 12:33 CEST (no 16:35). Los eventos del log
 *    ahora usan horarios coherentes con datos28A.json.
 *    - t=0  → 12:33 CEST: blackout sistémico
 *    - t=2  → ~12:50 CEST: inicio reposición Francia → Cataluña
 *    - t=11 → ~19:50 CEST: sincronización final (coherente con ENTSO-E)
 *
 * 4. ACCESIBILIDAD:
 *    Botón de play/pause con aria-label dinámico.
 *    Región del log con aria-live="polite".
 *
 * NOTA: react-force-graph-2d carga D3 completo + Three.js.
 * Es el chunk más pesado del proyecto. Considerar sustituir
 * por un grafo SVG estático+animado con CSS para el congreso
 * si el LCP sigue siendo crítico después del lazy load general.
 */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Datos del grafo ──────────────────────────────────────────────────────────
const getGridData = (lang) => {
  const t = (...args) => ({ es: args[0], en: args[1], pt: args[2], fr: args[3], it: args[4], de: args[5] }[lang] || args[0]);
  return {
    nodes: [
      { id: 'FRA', name: t('Francia', 'France', 'França', 'France', 'Francia', 'Frankreich'),          group: 0, val: 30, fx: 100,  fy: -110 },
      { id: 'CAT', name: t('Cataluña', 'Catalonia', 'Catalunha', 'Catalogne', 'Catalogna', 'Katalonien'), group: 1, val: 20, fx: 75,   fy: -55  },
      { id: 'ARA', name: t('Aragón', 'Aragon', 'Aragão', 'Aragon', 'Aragona', 'Aragonien'),            group: 1, val: 15, fx: 35,   fy: -35  },
      { id: 'CEN', name: t('Madrid (Centro)', 'Madrid (Central)', 'Madrid', 'Madrid', 'Madrid', 'Madrid'), group: 2, val: 25, fx: 0,    fy: 0    },
      { id: 'POR', name: t('Portugal', 'Portugal', 'Portugal', 'Portugal', 'Portogallo', 'Portugal'),   group: 0, val: 25, fx: -105, fy: -5   },
      { id: 'GAL', name: t('Galicia/León', 'Galicia/León', 'Galiza/Leão', 'Galice/León', 'Galizia/León', 'Galicien/León'), group: 3, val: 15, fx: -80, fy: -65 },
      { id: 'SUR', name: t('Andalucía', 'Andalusia', 'Andaluzia', 'Andalousie', 'Andalusia', 'Andalusien'), group: 4, val: 20, fx: -25, fy: 85  },
      { id: 'LEV', name: t('Levante', 'Levante', 'Levante', 'Levante', 'Levante', 'Levante'),          group: 5, val: 15, fx: 65,   fy: 50   },
    ],
    links: [
      { source: 'FRA', target: 'CAT', activationTime: 2,  isTopDown: true  },
      { source: 'CAT', target: 'ARA', activationTime: 4,  isTopDown: true  },
      { source: 'ARA', target: 'CEN', activationTime: 6,  isTopDown: true  },
      { source: 'POR', target: 'GAL', activationTime: 3,  isTopDown: true  },
      { source: 'POR', target: 'CEN', activationTime: 7,  isTopDown: true  },
      { source: 'SUR', target: 'LEV', activationTime: 5,  isBottomUp: true },
      { source: 'SUR', target: 'CEN', activationTime: 9,  isBottomUp: true },
      { source: 'LEV', target: 'CAT', activationTime: 11, isBottomUp: true },
    ],
  };
};

// ─── Log de eventos con horas verificadas (datos28A.json) ────────────────────
const getEventLog = (lang) => {
  const t = (...args) => ({ es: args[0], en: args[1] }[lang] || args[0]);
  return [
    { time: 0,  msg: t('12:33 CEST — Blackout sistémico. 7 islas desenergizadas. Proceso de restitución activado.', '12:33 CEST — Systemic blackout. 7 de-energized islands. Restoration begins.') },
    { time: 2,  msg: t('~12:50 CEST — TOP-DOWN: Francia energiza la interconexión transpirenaica. Cataluña recupera tensión.', '~12:50 CEST — TOP-DOWN: France energizes interconnection. Catalonia recovers voltage.') },
    { time: 3,  msg: t('~13:15 CEST — TOP-DOWN: Portugal inyecta potencia hacia Galicia y León.', '~13:15 CEST — TOP-DOWN: Portugal injects power towards Galicia/León.') },
    { time: 4,  msg: t('~13:40 CEST — Malla Nordeste: Aragón se sincroniza con Cataluña.', '~13:40 CEST — Northeast mesh: Aragon syncs with Catalonia.') },
    { time: 5,  msg: t('~14:10 CEST — BOTTOM-UP: Arranque autónomo hidráulico en Andalucía (black-start).', '~14:10 CEST — BOTTOM-UP: Black-start hydro in Andalusia. Live island created.') },
    { time: 6,  msg: t('~14:30 CEST — Top-Down avanza: tensión llega a la isla central (Madrid).', '~14:30 CEST — Top-Down expansion: voltage reaches Central island (Madrid).') },
    { time: 7,  msg: t('~14:45 CEST — Portugal sincroniza su corredor este con la isla central.', '~14:45 CEST — Portugal syncs east corridor with Central island.') },
    { time: 9,  msg: t('~15:20 CEST — Cierre Sur-Centro: isla andaluza se acopla al esqueleto principal.', '~15:20 CEST — South-Center closure: Andalusian island couples to main skeleton.') },
    { time: 11, msg: t('~19:50 CEST — Sincronización final: Levante cierra el anillo mediterráneo. Reposición completa del transporte ibérico.', '~19:50 CEST — Final sync: Levante closes Mediterranean ring. Full transport restoration.') },
  ];
};

// ─── Strings de UI ────────────────────────────────────────────────────────────
const UI = {
  es: { title: 'Secuencias de Reposición', play: 'Iniciar', pause: 'Pausar', replay: 'Repetir', desc: 'Restitución simultánea Top-Down (interconexiones) y Bottom-Up (hidráulica en arranque autónomo).' },
  en: { title: 'Restoration Sequences',    play: 'Play',    pause: 'Pause',  replay: 'Replay', desc: 'Simultaneous Top-Down (interconnections) and Bottom-Up (black-start hydro) grid restoration.' },
};

// ─── Contenido principal ──────────────────────────────────────────────────────
function AnimatedRestorationMapContent({ lang = 'es' }) {
  const GRID_DATA  = useMemo(() => getGridData(lang), [lang]);
  const EVENT_LOG  = useMemo(() => getEventLog(lang), [lang]);
  const strings    = UI[lang] || UI.es;

  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const fgRef = useRef();

  useEffect(() => {
    // webpackChunkName para identificar este chunk en el bundle analyzer
    import(/* webpackChunkName: "force-graph" */ 'react-force-graph-2d')
      .then(mod => setForceGraph2D(() => mod.default));
  }, []);

  const [simTime, setSimTime]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const MAX_TIME = 13;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  // Precalcular Set de nudos energizados: solo recalcula cuando cambia simTime
  const energizedIds = useMemo(() => {
    const set = new Set(['FRA', 'POR']); // siempre energizadas
    GRID_DATA.links.forEach(link => {
      if (simTime >= link.activationTime) {
        const src = typeof link.source === 'object' ? link.source.id : link.source;
        const tgt = typeof link.target === 'object' ? link.target.id : link.target;
        set.add(src);
        set.add(tgt);
      }
    });
    return set;
  }, [simTime, GRID_DATA.links]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime).reverse();

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) {
      setSimTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const playLabel = simTime >= MAX_TIME ? strings.replay : (isPlaying ? strings.pause : strings.play);

  if (!ForceGraph2D) {
    return (
      <div style={{ height: 680, backgroundColor: '#0d1117', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#60a5fa', fontFamily: 'monospace', fontSize: 13 }}>
        Cargando mapa de reposición…
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 680,
                  backgroundColor: '#0d1117', borderRadius: 12,
                  overflow: 'hidden', border: '1px solid #30363d' }}>

      <ForceGraph2D
        ref={fgRef}
        height={680}
        graphData={GRID_DATA}
        nodeRelSize={6}
        nodeVal={node => node.val}
        cooldownTicks={0}
        linkColor={link =>
          simTime >= link.activationTime
            ? (link.isTopDown ? '#3b82f6' : '#10b981')
            : 'rgba(255,255,255,0.05)'
        }
        linkWidth={link => simTime >= link.activationTime ? 3 : 1}
        linkDirectionalParticles={link => simTime >= link.activationTime ? 3 : 0}
        linkDirectionalParticleSpeed={0.015}
        linkDirectionalParticleColor={link =>
          link.isTopDown ? '#60a5fa' : '#34d399'
        }
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isEnergized = energizedIds.has(node.id);
          const isExternal   = node.id === 'FRA' || node.id === 'POR';

          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px monospace`;
          const tw = ctx.measureText(node.name).width;
          const bh = fontSize + fontSize * 0.2;

          // Fondo del label
          ctx.fillStyle = 'rgba(0,0,0,0.82)';
          ctx.fillRect(node.x - tw / 2, node.y - bh / 2 - 11, tw + 4, bh);

          // Texto del label
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle    = isEnergized ? '#e2e8f0' : '#475569';
          ctx.fillText(node.name, node.x, node.y - 10);

          // Círculo del nudo
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI);
          ctx.fillStyle = isEnergized
            ? (isExternal ? '#3b82f6' : '#10b981')
            : '#1e293b';
          ctx.fill();

          if (isEnergized) {
            ctx.strokeStyle = isExternal ? '#60a5fa' : '#34d399';
            ctx.lineWidth   = 1.5;
            ctx.stroke();
          }
        }}
        nodeCanvasObjectMode={() => 'replace'}
      />

      {/* Panel de control superpuesto */}
      <div style={{
        position: 'absolute', top: 20, left: 20,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.88)',
        padding: 15, borderRadius: 8,
        border: '1px solid #30363d',
        width: 320, color: '#fff',
        display: 'flex', flexDirection: 'column',
        maxHeight: 400,
      }}>
        <div style={{ pointerEvents: 'auto', marginBottom: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, color: '#34d399', fontSize: 14 }}>{strings.title}</h4>
          <button
            onClick={handlePlayPause}
            aria-label={playLabel}
            style={{
              background: 'var(--ifm-color-primary, #3b82f6)',
              color: '#fff', border: 'none',
              padding: '5px 14px', borderRadius: 4,
              cursor: 'pointer', fontWeight: 'bold', fontSize: 13,
            }}
          >
            {playLabel}
          </button>
        </div>

        <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#9ca3af' }}>
          {strings.desc}
        </p>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: '0.78rem' }}>
          <span><span style={{ color: '#60a5fa' }}>●</span> Top-Down</span>
          <span><span style={{ color: '#34d399' }}>●</span> Bottom-Up</span>
        </div>

        {/* Log de eventos */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Registro de eventos de reposición"
          style={{ flex: 1, overflowY: 'auto', display: 'flex',
                   flexDirection: 'column', gap: 7 }}
        >
          {visibleLogs.map((log, i) => (
            <div key={i} style={{
              fontSize: '0.82rem',
              padding: '7px 8px',
              backgroundColor: i === 0 ? 'rgba(52,211,153,0.12)' : 'transparent',
              borderLeft: i === 0 ? '3px solid #34d399' : '3px solid transparent',
              color: i === 0 ? '#fff' : '#9ca3af',
              transition: 'all 0.25s ease',
              borderRadius: '0 4px 4px 0',
            }}>
              {log.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnimatedRestorationMap({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{ height: 680, backgroundColor: '#0d1117', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#60a5fa', fontFamily: 'monospace', fontSize: 13 }}>
        Inicializando mapa de reposición…
      </div>
    }>
      {() => <AnimatedRestorationMapContent lang={lang} />}
    </BrowserOnly>
  );
}
