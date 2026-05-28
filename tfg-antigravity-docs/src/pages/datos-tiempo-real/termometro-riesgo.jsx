// src/pages/datos-tiempo-real/termometro-riesgo.jsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import GlitchTitle from '@site/src/components/GlitchTitle';
import TermometroRiesgo from '../../components/TermometroRiesgo';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';

export default function TermometroRiesgoPage() {
  return (
    <Layout
      title="Termómetro de Riesgo — Penetración Renovable e Inercia"
      description="Indicadores en tiempo real de penetración renovable e inercia estimada del sistema eléctrico ibérico"
    >
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/termometro-riesgo" />
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/datos-tiempo-real" style={styles.breadcrumbLink}>Datos en Tiempo Real</Link>
          <span style={styles.sep}>/</span>
          <span>Termómetro de Riesgo</span>
        </div>
        <div style={styles.header}>
          <div style={styles.label}>ESIOS · TIEMPO REAL · REFRESCO 5 MIN</div>
          <GlitchTitle as="h1" className="glitch-page-title">Termómetro de Riesgo</GlitchTitle>
          <p style={styles.desc}>
            Dos indicadores clave de vulnerabilidad sistémica: la <strong>penetración renovable</strong>
            (% de generación no síncrona) y la <strong>inercia estimada</strong> del sistema (GW·s).
            El 28-A, la combinación de 84.5% renovable y ~2.3 GW·s de inercia fue el caldo de cultivo del colapso.
          </p>
        </div>
        <TermometroRiesgo />
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
