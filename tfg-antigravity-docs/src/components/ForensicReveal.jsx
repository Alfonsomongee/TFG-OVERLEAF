/**
 * ForensicReveal.jsx
 * Sistema de revelado progresivo L1/L2/L3 para contenido técnico denso.
 *
 * PRINCIPIO DE DISEÑO (basado en literatura HCI):
 *   L1 → Visible siempre. Afirmación en lenguaje llano, sin jerga.
 *        Para cualquier lector: periodista, ciudadano, político.
 *   L2 → Revelado con un clic. Mecanismo físico con terminología técnica.
 *        Para: ingenieros, estudiantes, técnicos del sector.
 *   L3 → Revelado con segundo clic. Dato numérico verificado con fuente primaria.
 *        Para: tribunal académico, expertos, investigadores.
 *
 * REFERENCIA:
 *   Zong et al. (2022) EuroVis — progressive disclosure para visualizaciones
 *   técnicas densas. https://vis.mit.edu/pubs/rich-screen-reader-vis-experiences
 *
 * USO EN MDX:
 *   import ForensicReveal from '@site/src/components/ForensicReveal';
 *
 *   <ForensicReveal
 *     l1="Las plantas solares se desconectaron antes de tiempo."
 *     l2="Los relés ANSI 59 (sobretensión) estaban ajustados por debajo
 *         del umbral LVRT de 435 kV definido en el P.O. 12.2 de REE.
 *         Al superar esa tensión, los inversores dispararon automáticamente."
 *     l3="REE identifica desconexiones a tensiones entre 425 y 440 kV en al
 *         menos 14 plantas FV, indicando desajuste de configuración respecto
 *         al P.O. vigente. Pérdida total: −1.635 MW (Granada 355 + Badajoz
 *         730 + Sevilla 550). (Comité de Análisis, p.38)"
 *     source="REE (2025) / Comité de Análisis del Gobierno"
 *   />
 *
 * VARIANTE COMPACTA (sin L3, para análisis rápido):
 *   <ForensicReveal l1="..." l2="..." />
 *
 * ACCESIBILIDAD:
 *   - aria-expanded en los botones de expansión
 *   - aria-live="polite" en el contenido revelado
 *   - prefers-reduced-motion: elimina la animación de expansión
 */
import React, { useState, useId } from 'react';

// ─── Botón de expansión ───────────────────────────────────────────────────────
function ExpandButton({ expanded, onClick, level, lang }) {
  const isEs = lang === 'es';
  const labels = {
    es: {
      2: { open: 'Ver mecanismo técnico ▾', close: 'Ocultar mecanismo ▴' },
      3: { open: 'Ver dato verificado ▾',   close: 'Ocultar dato ▴' },
    },
    en: {
      2: { open: 'Show technical mechanism ▾', close: 'Hide mechanism ▴' },
      3: { open: 'Show verified data ▾',        close: 'Hide data ▴' },
    },
  };
  const dict  = labels[lang] || labels.es;
  const label = expanded ? dict[level].close : dict[level].open;

  return (
    <button
      onClick={onClick}
      aria-expanded={expanded}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        marginTop: '0.4rem',
        padding: '0.2rem 0.6rem',
        background: 'transparent',
        border: `1px solid ${level === 2 ? 'rgba(0,217,255,0.3)' : 'rgba(245,158,11,0.35)'}`,
        borderRadius: 4,
        color:  level === 2 ? '#00d9ff' : '#f59e0b',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: 11,
        letterSpacing: '0.04em',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// ─── Panel revelado ───────────────────────────────────────────────────────────
function RevealPanel({ children, level, id }) {
  const colors = {
    2: { bg: 'rgba(0,217,255,0.04)',   border: 'rgba(0,217,255,0.2)',   left: '#00d9ff' },
    3: { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.25)', left: '#f59e0b' },
  };
  const c = colors[level];

  return (
    <div
      id={id}
      aria-live="polite"
      style={{
        marginTop: '0.6rem',
        padding: '0.75rem 1rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `3px solid ${c.left}`,
        borderRadius: '0 6px 6px 0',
        fontSize: '0.9rem',
        lineHeight: 1.7,
        color: '#e2e8f0',
        animation: 'forensicReveal 0.2s ease',
      }}
    >
      {children}
      <style>{`
        @keyframes forensicReveal {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes forensicReveal { from {} to {} }
        }
      `}</style>
    </div>
  );
}

// ─── Etiqueta de nivel ────────────────────────────────────────────────────────
function LevelBadge({ level, lang }) {
  const isEs = lang === 'es';
  const badges = {
    1: { label: isEs ? 'Síntesis'  : 'Summary',   color: '#94a3b8' },
    2: { label: isEs ? 'Técnico'   : 'Technical',  color: '#00d9ff' },
    3: { label: isEs ? 'Pericial'  : 'Expert',     color: '#f59e0b' },
  };
  const b = badges[level];
  return (
    <span style={{
      display: 'inline-block',
      marginRight: '0.4rem',
      padding: '1px 6px',
      borderRadius: 10,
      fontSize: 9,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: `${b.color}18`,
      color: b.color,
      border: `1px solid ${b.color}40`,
      verticalAlign: 'middle',
    }}>
      {b.label}
    </span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ForensicReveal({
  l1,
  l2,
  l3,
  source,
  lang = 'es',
}) {
  const [showL2, setShowL2] = useState(false);
  const [showL3, setShowL3] = useState(false);
  const id2 = useId();
  const id3 = useId();

  const hasL2 = Boolean(l2);
  const hasL3 = Boolean(l3);

  return (
    <div style={{
      margin: '1.25rem 0',
      padding: '1rem 1.25rem',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
    }}>

      {/* L1 — siempre visible */}
      <div>
        <LevelBadge level={1} lang={lang} />
        <span style={{ fontSize: '1rem', lineHeight: 1.65, color: '#f1f5f9' }}>
          {l1}
        </span>
      </div>

      {/* Botón L2 */}
      {hasL2 && (
        <ExpandButton
          expanded={showL2}
          onClick={() => setShowL2(v => !v)}
          level={2}
          lang={lang}
        />
      )}

      {/* L2 — mecanismo técnico */}
      {hasL2 && showL2 && (
        <RevealPanel level={2} id={id2}>
          <LevelBadge level={2} lang={lang} />
          {l2}

          {/* Botón L3 dentro del panel L2 */}
          {hasL3 && (
            <div style={{ marginTop: '0.75rem' }}>
              <ExpandButton
                expanded={showL3}
                onClick={() => setShowL3(v => !v)}
                level={3}
                lang={lang}
              />
            </div>
          )}

          {/* L3 — dato verificado */}
          {hasL3 && showL3 && (
            <RevealPanel level={3} id={id3}>
              <LevelBadge level={3} lang={lang} />
              {l3}
            </RevealPanel>
          )}
        </RevealPanel>
      )}

      {/* Fuente (si la hay) */}
      {source && (
        <div style={{
          marginTop: '0.6rem',
          fontSize: 10,
          color: '#475569',
          fontFamily: 'monospace',
          fontStyle: 'italic',
        }}>
          {lang === 'es' ? 'Fuente:' : 'Source:'} {source}
        </div>
      )}
    </div>
  );
}
