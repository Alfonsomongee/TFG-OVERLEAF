export const GENERATION_DATA = [
  {
    id: 'solar',
    name: 'Solar fotovoltaica',
    mw: 19155,
    percentage: 65,
    color: '#EF9F27'
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    mw: 3870,
    percentage: 13,
    color: '#378ADD'
  },
  {
    id: 'wind',
    name: 'Eólica',
    mw: 3540,
    percentage: 12,
    color: '#5DCAA5'
  },
  {
    id: 'hydro',
    name: 'Hidráulica',
    mw: 2000,
    percentage: 7,
    color: '#888780'
  },
  {
    id: 'ccgt',
    name: 'CCGT (gas)',
    mw: 990,
    percentage: 3,
    color: '#D85A30'
  }
];

const total = GENERATION_DATA.reduce((sum, item) => sum + item.mw, 0);
if (Math.abs(total - 29555) > 10) {
  console.warn('GENERATION_DATA total mismatch: expected ~29555 MW, got', total);
}

export default GENERATION_DATA;
