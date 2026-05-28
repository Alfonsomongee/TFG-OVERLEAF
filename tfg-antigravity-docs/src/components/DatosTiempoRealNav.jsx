// src/components/DatosTiempoRealNav.jsx
// Barra de navegación lateral para las páginas de Datos en Tiempo Real.
// Estas páginas viven en src/pages/ (no en docs), por lo que Docusaurus no
// les monta la sidebar automáticamente. Este componente la suple.

import React, { useState } from 'react';
import Link from '@docusaurus/Link';

const DOC_LINKS = [
  { label: 'Introducción',                href: '/introduccion' },
  { label: 'Contexto Técnico',            href: '/contexto' },
  { label: '— Análisis del Incidente',    href: '/analisis-incidente' },
  { label: '— Reacción y Reposición',     href: '/reaccion-reposicion' },
  { label: '— Impacto Comunicativo',      href: '/impacto-comunicativo' },
  { label: '— Informes Oficiales',        href: '/analisis-informes' },
  { label: '— Resiliencia y Futuro',      href: '/resiliencia-futuro' },
  { label: '— Consecuencias Financieras', href: '/07b-consecuencias-financieras' },
  { label: 'Resumen de Cifras',           href: '/resumen-de-cifras' },
  { label: 'Conclusiones',               href: '/conclusiones' },
  { label: 'Glosario',                   href: '/glosario' },
];

const DATA_LINKS = [
  { label: 'Hub — Datos en Tiempo Real',  href: '/datos-tiempo-real' },
  { label: 'Mix de Generación',           href: '/datos-tiempo-real/mix-generacion' },
  { label: 'Demanda y Renovable',         href: '/datos-tiempo-real/demanda-renovable' },
  { label: 'Termómetro de Riesgo',        href: '/datos-tiempo-real/termometro-riesgo' },
  { label: 'Balance de Intercambios',     href: '/datos-tiempo-real/balance-intercambios' },
  { label: 'Precio SPOT',                 href: '/datos-tiempo-real/precio-spot' },
  { label: 'Radar de Vulnerabilidad',     href: '/datos-tiempo-real/radar-vulnerabilidad' },
];

export default function DatosTiempoRealNav({ currentPath = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante visible en móvil y también en desktop */}
      <button
        onClick={() => setOpen(o => !o)}
        style={S.fab}
        aria-label="Abrir navegación"
        title="Navegación"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Overlay oscuro al abrir en móvil */}
      {open && <div style={S.overlay} onClick={() => setOpen(false)} />}

      {/* Panel lateral deslizante */}
      <div style={{ ...S.panel, transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
        <div style={S.panelHeader}>
          <span style={S.panelTitle}>NAVEGACIÓN</span>
          <button onClick={() => setOpen(false)} style={S.closeBtn}>✕</button>
        </div>

        {/* Sección docs principales */}
        <div style={S.section}>
          <div style={S.sectionLabel}>DOCUMENTACIÓN</div>
          {DOC_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              style={{
                ...S.navLink,
                ...(l.label.startsWith('—') ? S.navLinkSub : {}),
              }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Separador */}
        <div style={S.divider} />

        {/* Sección datos en tiempo real */}
        <div style={S.section}>
          <div style={S.sectionLabel}>DATOS EN TIEMPO REAL</div>
          {DATA_LINKS.map(l => (
            <Link
              key={l.href}
              to={l.href}
              style={{
                ...S.navLink,
                ...(currentPath === l.href ? S.navLinkActive : {}),
              }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

const S = {
  fab: {
    position: 'fixed',
    top: '4.5rem',        // justo debajo del navbar
    left: '1rem',
    zIndex: 900,
    width: '2.4rem',
    height: '2.4rem',
    borderRadius: '8px',
    background: 'rgba(13,16,24,0.92)',
    border: '1px solid rgba(255,170,0,0.25)',
    color: 'rgba(255,170,0,0.85)',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    transition: 'border-color 0.2s, background 0.2s',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 910,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    zIndex: 920,
    background: 'rgba(8,11,20,0.98)',
    borderRight: '1px solid rgba(255,170,0,0.12)',
    backdropFilter: 'blur(12px)',
    overflowY: 'auto',
    padding: '0 0 2rem',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem 1.25rem 0.9rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    background: 'rgba(8,11,20,0.98)',
    zIndex: 1,
  },
  panelTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: 'rgba(255,170,0,0.6)',
    textTransform: 'uppercase',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(160,155,140,0.5)',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.2rem 0.4rem',
    lineHeight: 1,
  },
  section: {
    padding: '1rem 0 0.5rem',
  },
  sectionLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.18em',
    color: 'rgba(255,170,0,0.4)',
    textTransform: 'uppercase',
    padding: '0 1.25rem 0.5rem',
  },
  navLink: {
    display: 'block',
    padding: '0.42rem 1.25rem',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem',
    color: 'rgba(200,195,185,0.8)',
    textDecoration: 'none',
    borderLeft: '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  },
  navLinkSub: {
    fontSize: '0.77rem',
    color: 'rgba(160,155,140,0.65)',
    paddingLeft: '1.75rem',
  },
  navLinkActive: {
    color: 'rgba(255,170,0,0.9)',
    borderLeftColor: 'rgba(255,170,0,0.6)',
    background: 'rgba(255,170,0,0.05)',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    margin: '0.5rem 1.25rem',
  },
};
