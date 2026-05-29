import React from 'react';
import Layout from '@theme/Layout';
import ThermalAdjustmentCostMatrix from '../../components/ThermalAdjustmentCostMatrix';
import DatosTiempoRealNav from '../../components/DatosTiempoRealNav';

export default function CostesAjustePage() {
  return (
    <Layout title="Costes de servicios de ajuste" description="Matriz termográfica">
      <DatosTiempoRealNav currentPath="/datos-tiempo-real/costes-ajuste" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>Costes de servicios de ajuste (semana del colapso)</h1>
        <ThermalAdjustmentCostMatrix />
      </div>
    </Layout>
  );
}
