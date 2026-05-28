// src/pages/datos-tiempo-real/sismografo.jsx
// Ruta: /datos-tiempo-real/sismografo

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Sismografo from '../../components/Sismografo';

export default function SismografoPage() {
  return (
    <Layout
      title="Sismógrafo de Frecuencia — Sistema Ibérico en Tiempo Real"
      description="Compara la frecuencia actual del sistema eléctrico ibérico con la caída registrada el 28 de abril de 2025"
    >
      <div style={styles.page}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/datos-tiempo-real" style={styles.breadcrumbLink}>📡 Datos en Tiempo Real</Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span>Sismógrafo de Frecuencia</span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLabel}>MONITORIZACIÓN EN VIVO · ENTSO-E A82</div>
          <h1 style={styles.headerTitle}>🌊 Sismógrafo de Frecuencia</h1>
          <p style={styles.headerDesc}>
            Comparación en tiempo real de la frecuencia del sistema eléctrico ibérico
            con la evolución registrada durante el colapso del <strong>28 de abril de 2025</strong>.
            Los datos de hoy se obtienen de ENTSO-E y se actualizan cada 30 segundos.
          </p>
        </div>

        {/* Componente principal */}
        <Sismografo />

        {/* Contexto técnico */}
        <div style={styles.contextGrid}>
          <ContextCard
            title="¿Qué muestra este gráfico?"
            text="La línea cian es la frecuencia actual del sistema ibérico. La línea roja discontinua reproduce la caída del 28-A, desde las primeras oscilaciones a las 12:03 h hasta el cero eléctrico a las 12:33:27 h."
          />
          <ContextCard
            title="Umbrales críticos"
            text="A 49.5 Hz se activa el primer escalón de UFLS (desconexión automática de carga). A 49.0 Hz el segundo. El 28-A la frecuencia llegó a colapso total (~0 Hz) en menos de 30 segundos."
          />
          <ContextCard
            title="Fuente de datos"
            text="Frecuencia en tiempo real: ENTSO-E Transparency Platform (doc. A82, área 10YES-REE------0). Histórico 28-A: datos telemétricos del informe oficial de REE/ENTSOE procesados para este TFG."
          />
        </div>
      </div>
    </Layout>
  );
}

function ContextCard({ title, text }) {
  return (
    <div style={styles.contextCard}>
      <h4 style={styles.contextTitle}>{title}</h4>
      <p style={styles.contextText}>{text}</p>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem 4rem',
    fontFamily: "'Inter', sans-serif",
  },
  breadcrumb: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem', letterSpacing: '0.04em',
    color: 'rgba(160,155,140,0.6)',
    marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
  },
  breadcrumbLink: { color: 'rgba(255,170,0,0.6)', textDecoration: 'none' },
  breadcrumbSep: { opacity: 0.4 },
  header: { marginBottom: '2rem' },
  headerLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.62rem', letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'rgba(255,170,0,0.55)',
    marginBottom: '0.5rem',
  },
  headerTitle: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
    fontWeight: 800, margin: '0 0 0.75rem',
    letterSpacing: '-0.02em',
  },
  headerDesc: {
    fontSize: '0.95rem', color: 'rgba(180,175,165,0.8)',
    maxWidth: '700px', lineHeight: 1.7, margin: 0,
  },
  contextGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    marginTop: '2rem',
  },
  contextCard: {
    background: 'rgba(13,16,24,0.5)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '1.25rem',
  },
  contextTitle: {
    fontSize: '0.82rem', fontWeight: 700,
    color: 'rgba(255,210,140,0.8)',
    margin: '0 0 0.5rem',
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  contextText: {
    fontSize: '0.82rem', color: 'rgba(160,155,140,0.75)',
    lineHeight: 1.6, margin: 0,
  },
};
