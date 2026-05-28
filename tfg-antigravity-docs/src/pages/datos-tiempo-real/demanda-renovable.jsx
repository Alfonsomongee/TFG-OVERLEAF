// src/pages/datos-tiempo-real/demanda-renovable.jsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import DemandaRenovableTrend from '../../components/DemandaRenovableTrend';

export default function DemandaRenovablePage() {
  return (
    <Layout
      title="Demanda y Renovable — Hoy vs 28-A"
      description="Evolución comparada de demanda eléctrica y generación renovable respecto al colapso del 28-A"
    >
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/datos-tiempo-real" style={styles.breadcrumbLink}>📡 Datos en Tiempo Real</Link>
          <span style={styles.sep}>/</span>
          <span>Demanda y Renovable</span>
        </div>
        <div style={styles.header}>
          <div style={styles.label}>ESIOS · TIEMPO REAL · REFRESCO 5 MIN</div>
          <h1 style={styles.title}>📈 Demanda y Generación Renovable</h1>
          <p style={styles.desc}>
            Comparativa de demanda total y generación por tecnología entre el estado actual del sistema
            y el perfil en el instante del colapso del <strong>28 de abril de 2025</strong>.
            Valores negativos en hidráulica indican bombeo (consumo neto).
          </p>
        </div>
        <DemandaRenovableTrend />
      </div>
    </Layout>
  );
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem', fontFamily: "'Inter', sans-serif" },
  breadcrumb: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.04em', color: 'rgba(160,155,140,0.6)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  breadcrumbLink: { color: 'rgba(255,170,0,0.6)', textDecoration: 'none' },
  sep: { opacity: 0.4 },
  header: { marginBottom: '2rem' },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,170,0,0.55)', marginBottom: '0.5rem' },
  title: { fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em' },
  desc: { fontSize: '0.95rem', color: 'rgba(180,175,165,0.8)', maxWidth: '700px', lineHeight: 1.7, margin: 0 },
};
