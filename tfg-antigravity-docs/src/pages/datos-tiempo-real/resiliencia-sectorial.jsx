import React from 'react';
import Layout from '@theme/Layout';
import SectorialResilienceChart from '../../components/SectorialResilienceChart';

export default function ResilienciaSectorialPage() {
  return (
    <Layout title="Resiliencia sectorial" description="Recuperación de la demanda tras el apagón">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>📈 Resiliencia sectorial: Industria vs Servicios</h1>
        <SectorialResilienceChart />
      </div>
    </Layout>
  );
}
