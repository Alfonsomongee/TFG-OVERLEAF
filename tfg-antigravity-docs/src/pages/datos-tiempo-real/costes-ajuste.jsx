import React from 'react';
import Layout from '@theme/Layout';
import ThermalAdjustmentCostMatrix from '../../components/ThermalAdjustmentCostMatrix';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';
import GlitchTitle from '@site/src/components/GlitchTitle';

export default function CostesAjustePage() {
  return (
    <Layout title="Costes de servicios de ajuste" description="Matriz termográfica">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/costes-ajuste" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <GlitchTitle as="h1" className="glitch-page-title">Costes de servicios de ajuste (semana del colapso)</GlitchTitle>
        <ThermalAdjustmentCostMatrix />
      </div>
    </Layout>
  );
}
