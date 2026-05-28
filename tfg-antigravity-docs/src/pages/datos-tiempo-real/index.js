// src/pages/datos-tiempo-real/index.js
// Hub page — sección "DATOS EN TIEMPO REAL"
// Ruta: /datos-tiempo-real

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const FEATURES = [
  {
    name: 'Mix de Generación',
    path: '/datos-tiempo-real/mix-generacion',
    description: 'Donuts comparativos de generación por tecnología: ahora vs el instante del colapso (84.5% renovable).',
    source: 'ESIOS · 5 min',
  },
  {
    name: 'Demanda y Renovable',
    path: '/datos-tiempo-real/demanda-renovable',
    description: 'Barras comparativas de demanda, eólica, solar, nuclear, hidráulica y ciclo combinado vs 28-A.',
    source: 'ESIOS · 5 min',
  },
  {
    name: 'Termómetro de Riesgo',
    path: '/datos-tiempo-real/termometro-riesgo',
    description: 'Gauges de penetración renovable e inercia estimada del sistema. Umbral crítico marcado en 84.5% / 2.3 GW·s.',
    source: 'ESIOS · 5 min',
  },
  {
    name: 'Balance de Intercambios',
    path: '/datos-tiempo-real/balance-intercambios',
    description: 'Flujos de exportación e importación con Francia y Portugal en tiempo real vs el 28-A.',
    source: 'ESIOS · 5 min',
  },
  {
    name: 'Precio SPOT vs Demanda',
    path: '/datos-tiempo-real/precio-spot',
    description: 'Relación precio mayorista–demanda ahora vs trayectoria del 28-A, donde el precio cayó a −2.5 €/MWh.',
    source: 'ESIOS · 5 min',
  },
  {
    name: 'Radar de Vulnerabilidad',
    path: '/datos-tiempo-real/radar-vulnerabilidad',
    description: 'Análisis multidimensional (5 ejes) de similitud con el perfil de colapso del 28-A. Índice 0–100.',
    source: 'ESIOS · 5 min',
  },
];

export default function DatosTiempoReal() {
  return (
    <Layout
      title="Datos en Tiempo Real — Sistema Eléctrico Ibérico"
      description="6 herramientas de monitorización avanzada del sistema eléctrico ibérico con datos de ESIOS (REE)"
    >
      <div style={styles.page}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLabel}>MONITORIZACIÓN EN VIVO</div>
          <h1 style={styles.heroTitle}>DATOS EN TIEMPO REAL</h1>
          <p style={styles.heroSubtitle}>
            6 herramientas de análisis del sistema eléctrico ibérico usando datos oficiales de
            ESIOS (REE), actualizados cada 5 minutos. Compara el estado actual con el colapso del 28 de abril de 2025.
          </p>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>● ESIOS API</span>
            <span style={{ ...styles.badge, borderColor: 'rgba(255,170,0,0.3)', color: '#ffaa00' }}>↺ Refresco 5 min</span>
            <span style={{ ...styles.badge, borderColor: 'rgba(6,182,212,0.4)', color: '#06b6d4' }}>6 herramientas activas</span>
          </div>
        </div>

        {/* Grid de funcionalidades */}
        <div style={styles.grid}>
          {FEATURES.map(f => (
            <Link key={f.path} to={f.path} style={{ textDecoration: 'none' }}>
              <FeatureCard {...f} />
            </Link>
          ))}
        </div>

        {/* Nota técnica */}
        <div style={styles.note}>
          <span style={{ color: 'rgba(255,170,0,0.6)' }}>i</span>
          {' '}El token de ESIOS se mantiene exclusivamente en el servidor (Vercel Serverless Functions).
          Nunca se expone al navegador. Las llamadas del cliente se realizan a{' '}
          <code>/api/esios-multi</code> que agrega todos los indicadores en una sola petición.
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ name, description, source }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{name}</h3>
      <p style={styles.cardDesc}>{description}</p>
      <div style={styles.cardFooter}>
        <span style={styles.badgeLive}>EN VIVO</span>
        <span style={styles.sourceTag}>{source}</span>
      </div>
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
    border: '1px solid rgba(255,170,0,0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    cursor: 'pointer',
    height: '100%',
    boxSizing: 'border-box',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' },
  cardDesc: { fontSize: '0.85rem', color: 'rgba(160,155,140,0.75)', margin: '0 0 1rem', lineHeight: 1.5 },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  badgeLive: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', letterSpacing: '0.1em',
    padding: '0.2rem 0.6rem',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '20px', color: '#10b981',
  },
  sourceTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.58rem', letterSpacing: '0.05em',
    color: 'rgba(255,170,0,0.5)',
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
