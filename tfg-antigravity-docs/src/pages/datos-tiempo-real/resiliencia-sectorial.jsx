import React from 'react';
import Layout from '@theme/Layout';
import SectorialResilienceChart from '../../components/SectorialResilienceChart';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';
import GlitchTitle from '@site/src/components/GlitchTitle';

export default function ResilienciaSectorialPage() {
  return (
    <Layout title="Resiliencia sectorial" description="Recuperación de la demanda tras el apagón">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/resiliencia-sectorial" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <GlitchTitle as="h1" className="glitch-page-title">Resiliencia sectorial: Industria vs Servicios</GlitchTitle>
        <SectorialResilienceChart />
      </div>
    </Layout>
  );
}
