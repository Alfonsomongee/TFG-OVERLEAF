// src/pages/datos-tiempo-real/mix-generacion.jsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import GlitchTitle from '@site/src/components/GlitchTitle';
import MixGeneracion from '../../components/MixGeneracion';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';

export default function MixGeneracionPage() {
  return (
    <Layout
      title="Mix de Generación — Hoy vs 28-A"
      description="Compara la estructura de generación eléctrica hoy con el instante del colapso del 28 de abril de 2025"
    >
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/mix-generacion" />
      <div style={styles.page}>
        <div style={styles.breadcrumb}>
          <Link to="/datos-tiempo-real" style={styles.breadcrumbLink}>Datos en Tiempo Real</Link>
          <span style={styles.sep}>/</span>
          <span>Mix de Generación</span>
        </div>
        <div style={styles.header}>
          <div style={styles.label}>ESIOS · TIEMPO REAL · REFRESCO 5 MIN</div>
          <GlitchTitle as="h1" className="glitch-page-title">Mix de Generación</GlitchTitle>
          <p style={styles.desc}>
            Comparativa entre la estructura de generación eléctrica <strong>ahora mismo</strong> y el perfil
            del sistema en el instante del colapso del <strong>28 de abril de 2025</strong> (12:33 CEST).
            Especial atención a la penetración renovable, el factor clave del apagón.
          </p>
        </div>
        <MixGeneracion />
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
