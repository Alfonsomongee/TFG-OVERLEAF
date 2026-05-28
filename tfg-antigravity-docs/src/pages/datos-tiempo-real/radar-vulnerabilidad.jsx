// src/pages/datos-tiempo-real/radar-vulnerabilidad.jsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import GlitchTitle from '@site/src/components/GlitchTitle';
import RadarVulnerabilidad from '../../components/RadarVulnerabilidad';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';

export default function RadarVulnerabilidadPage() {
  return (
    <Layout
      title="Radar de Vulnerabilidad — Hoy vs 28-A"
      description="Análisis multidimensional de vulnerabilidad sistémica comparado con el perfil del colapso del 28-A"
    >
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/radar-vulnerabilidad" />
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/datos-tiempo-real" style={styles.breadcrumbLink}>Datos en Tiempo Real</Link>
          <span style={styles.sep}>/</span>
          <span>Radar de Vulnerabilidad</span>
        </div>
        <div style={styles.header}>
          <div style={styles.label}>ESIOS · TIEMPO REAL · REFRESCO 5 MIN</div>
          <GlitchTitle as="h1" className="glitch-page-title">Radar de Vulnerabilidad</GlitchTitle>
          <p style={styles.desc}>
            Comparativa multidimensional del estado actual del sistema eléctrico ibérico
            con el perfil de vulnerabilidad del <strong>28 de abril de 2025</strong>.
            Cinco dimensiones: penetración renovable, inercia, exportación neta, precio y demanda relativa.
          </p>
        </div>
        <RadarVulnerabilidad />
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
  desc: { fontSize: '0.95rem', color: 'rgba(180,175,165,0.8)', maxWidth: '700px', lineHeight: 1.7, margin: '0.75rem 0 0' },
};
