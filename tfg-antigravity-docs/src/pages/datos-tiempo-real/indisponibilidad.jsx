import React from 'react';
import Layout from '@theme/Layout';
import GridUnavailabilityGauge from '../../components/GridUnavailabilityGauge';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';

export default function IndisponibilidadPage() {
  return (
    <Layout title="Indisponibilidad de la red" description="Porcentaje de red de 400 kV fuera de servicio durante el apagón">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/indisponibilidad" />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1>Indisponibilidad de la red de transporte</h1>
        <GridUnavailabilityGauge />
      </div>
    </Layout>
  );
}
