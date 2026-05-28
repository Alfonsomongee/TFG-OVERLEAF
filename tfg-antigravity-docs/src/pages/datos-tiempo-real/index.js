// src/pages/datos-tiempo-real/index.js
// Hub page — sección "📡 DATOS EN TIEMPO REAL"
// Ruta: /datos-tiempo-real

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const FEATURES = [
  {
    emoji: '🌊',
    name: 'Sismógrafo de Frecuencia',
    path: '/datos-tiempo-real/sismografo',
    description: 'Frecuencia del sistema ibérico en tiempo real vs la caída del 28-A.',
    available: true,
  },
  {
    emoji: '⚠️',
    name: 'Detector de Patrones Pre-Colapso',
    path: '/datos-tiempo-real/detector-patrones',
    description: 'Similitud en tiempo real con la ventana crítica de las 2 horas previas al apagón.',
    available: false,
  },
  {
    emoji: '📊',
    name: 'Índice de Estrés del Sistema',
    path: '/datos-tiempo-real/indice-estres',
    description: 'Termómetro de vulnerabilidad sistémica basado en mix renovable, inercia y RoCoF.',
    available: false,
  },
  {
    emoji: '⚡',
    name: 'Monitor de Inercia',
    path: '/datos-tiempo-real/monitor-inercia',
    description: 'Inercia sintética y real del sistema peninsular, comparada con el 28-A.',
    available: false,
  },
  {
    emoji: '🗺️',
    name: 'Mapa de Flujos Transfronterizos',
    path: '/datos-tiempo-real/flujos-transfronterizos',
    description: 'Intercambios físicos en tiempo real España–Francia–Portugal.',
    available: false,
  },
  {
    emoji: '🌞',
    name: 'Mix de Generación en Vivo',
    path: '/datos-tiempo-real/mix-generacion',
    description: 'Desglose de generación por tecnología y comparación con mix del 28-A.',
    available: false,
  },
];

export default function DatosTiempoReal() {
  return (
    <Layout
      title="Datos en Tiempo Real — Sistema Eléctrico Ibérico"
      description="Monitorización avanzada del sistema eléctrico ibérico con datos de ESIOS y ENTSO-E"
    >
      <div style={styles.page}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLabel}>MONITORIZACIÓN EN VIVO</div>
          <h1 style={styles.heroTitle}>📡 DATOS EN TIEMPO REAL</h1>
          <p style={styles.heroSubtitle}>
            Herramientas de análisis del sistema eléctrico ibérico usando datos oficiales de
            ESIOS (REE) y ENTSO-E. Compara el estado actual con el colapso del 28 de abril de 2025.
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>● ESIOS API</span>
            <span style={{ ...styles.badge, borderColor: 'rgba(6,182,212,0.4)', color: '#06b6d4' }}>● ENTSO-E API</span>
            <span style={{ ...styles.badge, borderColor: 'rgba(255,170,0,0.3)', color: '#ffaa00' }}>↺ Refresco 30 s</span>
          </div>
        </div>

        {/* Grid de funcionalidades */}
        <div style={styles.grid}>
          {FEATURES.map(f => (
            f.available
              ? (
                <Link key={f.path} to={f.path} style={{ textDecoration: 'none' }}>
                  <FeatureCard {...f} />
                </Link>
              )
              : <FeatureCard key={f.path} {...f} />
          ))}
        </div>

        {/* Nota técnica */}
        <div style={styles.note}>
          <span style={{ color: 'rgba(255,170,0,0.6)' }}>ℹ</span>
          {' '}Los tokens de ESIOS y ENTSO-E se mantienen exclusivamente en el servidor (Vercel Serverless Functions).
          Nunca se exponen al navegador. Las llamadas del cliente se realizan a <code>/api/esios-proxy</code> y <code>/api/entsoe-frequency</code>.
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ emoji, name, description, available }) {
  return (
    <div style={{
      ...styles.card,
      opacity: available ? 1 : 0.45,
      cursor: available ? 'pointer' : 'default',
      borderColor: available ? 'rgba(255,170,0,0.15)' : 'rgba(255,255,255,0.05)',
    }}>
      <div style={styles.cardEmoji}>{emoji}</div>
      <h3 style={styles.cardTitle}>{name}</h3>
      <p style={styles.cardDesc}>{description}</p>
      {available
        ? <span style={styles.badgeLive}>▶ EN VIVO</span>
        : <span style={styles.badgeSoon}>PRÓXIMAMENTE</span>
      }
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem 4rem',
    fontFamily: "'Inter', sans-serif",
  },
  hero: { textAlign: 'center', marginBottom: '3rem' },
  heroLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: 'rgba(255,170,0,0.6)',
    marginBottom: '0.75rem',
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 800, margin: '0 0 1rem',
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: '1rem', color: 'rgba(180,175,165,0.85)',
    maxWidth: '640px', margin: '0 auto 1.5rem',
    lineHeight: 1.7,
  },
  badges: { display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  badge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem', letterSpacing: '0.06em',
    padding: '0.2rem 0.65rem',
    border: '1px solid', borderRadius: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  },
  card: {
    background: 'rgba(13,16,24,0.7)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  cardEmoji: { fontSize: '2rem', marginBottom: '0.75rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' },
  cardDesc: { fontSize: '0.85rem', color: 'rgba(160,155,140,0.75)', margin: '0 0 1rem', lineHeight: 1.5 },
  badgeLive: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', letterSpacing: '0.1em',
    padding: '0.2rem 0.6rem',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '20px', color: '#10b981',
  },
  badgeSoon: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', letterSpacing: '0.1em',
    padding: '0.2rem 0.6rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', color: 'rgba(160,155,140,0.5)',
  },
  note: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem', color: 'rgba(160,155,140,0.6)',
    background: 'rgba(255,170,0,0.04)',
    border: '1px solid rgba(255,170,0,0.08)',
    borderRadius: '8px', padding: '0.75rem 1rem',
    lineHeight: 1.6,
  },
};
