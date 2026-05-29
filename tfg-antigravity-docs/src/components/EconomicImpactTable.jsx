import React from 'react';
import { ForensicTable } from './ForensicUI/Primitives';
import { economicImpactData } from '@site/src/data/forensicData';

export default function EconomicImpactTable() {
  return (
    <ForensicTable
      title="TABLA 13 | VoLL ESTIMATES BY SECTOR"
      source="Elaboración propia (modelo VoLL)"
    >
      <table>
        <thead>
          <tr>
            <th>Sector Macroeconómico</th>
            <th>Rango VoLL Estimado (€/kWh)</th>
            <th>Sensibilidad Marginal a la Interrupción</th>
            <th>Impacto de Segundo Orden (<i>Ripple Effects</i>) en la Economía</th>
          </tr>
        </thead>
        <tbody>
          {economicImpactData.sectorBreakdown.map((row, i) => (
            <tr key={i}>
              <td><strong>{row.sector}</strong></td>
              <td>{row.rangoVoLL}</td>
              <td>{row.sensibilidad}</td>
              <td>{row.rippleEffects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ForensicTable>
  );
}
