import React from 'react';
import Layout from '@theme/Layout';
import EmissionsVsRenewablesChart from '../../components/EmissionsVsRenewablesChart';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';
import GlitchTitle from '@site/src/components/GlitchTitle';

export default function EmisionesRenovablePage() {
  return (
    <Layout title="Emisiones vs Penetración renovable" description="Comparativa durante la semana del apagón">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/emisiones-renovable" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <GlitchTitle as="h1" className="glitch-page-title">Emisiones de CO₂ vs Penetración renovable</GlitchTitle>
        <EmissionsVsRenewablesChart />
      </div>
    </Layout>
  );
}
