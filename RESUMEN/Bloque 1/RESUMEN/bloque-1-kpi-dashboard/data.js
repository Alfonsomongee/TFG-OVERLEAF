export const KPI_DATA = [
  {
    id: 'duration',
    label: 'DURACIÓN DEL COLAPSO',
    value: '27 s',
    context: '12:32:57 → 12:33:24 CEST',
    source: 'ENTSO-E Final Report, 20/03/2026',
    color: 'red'
  },
  {
    id: 'load',
    label: 'CARGA INTERRUMPIDA',
    value: '~31 GW',
    context: 'Sistema ibérico completo',
    source: 'ENTSO-E Final Report, 20/03/2026',
    color: 'red'
  },
  {
    id: 'population',
    label: 'POBLACIÓN AFECTADA',
    value: '~55 M',
    context: 'España peninsular + Portugal continental',
    source: 'Censos España + Portugal',
    color: 'amber'
  },
  {
    id: 'deaths',
    label: 'FALLECIDOS CONFIRMADOS',
    value: '8',
    context: '7 España · 1 Portugal',
    source: 'El País / RTP, 28–29/04/2025',
    color: 'red'
  },
  {
    id: 'recovery',
    label: 'REPOSICIÓN COMPLETA',
    value: '~18 h',
    context: '99,95% a las 07:00 del 29 abr',
    source: 'REE Operación, 29/04/2025',
    color: 'green'
  },
  {
    id: 'losses',
    label: 'PÉRDIDAS ECONÓMICAS',
    value: '1.600 M€',
    context: 'Est. CEOE · 0,1% del PIB español',
    source: 'CEOE, declaración Antonio Garamendi, 29/04/2025',
    color: 'amber'
  }
];

if (KPI_DATA.length !== 6) {
  console.error('KPI_DATA validation failed: esperaba 6 métricas, got', KPI_DATA.length);
}

export default KPI_DATA;
