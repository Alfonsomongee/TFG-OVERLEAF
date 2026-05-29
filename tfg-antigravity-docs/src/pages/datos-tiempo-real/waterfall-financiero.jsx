import React from 'react';
import Layout from '@theme/Layout';
import FinancialWaterfallChart from '../../components/FinancialWaterfallChart';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';
import GlitchTitle from '@site/src/components/GlitchTitle';

export default function WaterfallFinancieroPage() {
  return (
    <Layout title="Impacto económico" description="Cascada financiera del impacto económico">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/waterfall-financiero" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <GlitchTitle as="h1" className="glitch-page-title">Impacto económico del apagón del 28 de abril</GlitchTitle>
        <FinancialWaterfallChart />
      </div>
    </Layout>
  );
}
