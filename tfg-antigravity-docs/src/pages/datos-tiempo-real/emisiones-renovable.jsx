import React from 'react';
import Layout from '@theme/Layout';
import EmissionsVsRenewablesChart from '../../components/EmissionsVsRenewablesChart';

export default function EmisionesRenovablePage() {
  return (
    <Layout title="Emisiones vs Penetración renovable" description="Comparativa durante la semana del apagón">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>🌍 Emisiones de CO₂ vs Penetración renovable</h1>
        <EmissionsVsRenewablesChart />
      </div>
    </Layout>
  );
}
