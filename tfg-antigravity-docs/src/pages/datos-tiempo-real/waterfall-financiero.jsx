import React from 'react';
import Layout from '@theme/Layout';
import FinancialWaterfallChart from '../../components/FinancialWaterfallChart';

export default function WaterfallFinancieroPage() {
  return (
    <Layout title="Impacto económico" description="Cascada financiera del impacto económico">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>💸 Impacto económico del apagón del 28 de abril</h1>
        <FinancialWaterfallChart />
      </div>
    </Layout>
  );
}
