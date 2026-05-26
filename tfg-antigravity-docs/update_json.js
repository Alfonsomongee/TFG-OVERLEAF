const fs = require('fs');
const file = './static/data/tablasdefinitivas.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Inject summary and reflection into categories
const summaries = {
  'frequency-stability': {
    summary: [
      { label: 'Inercia H (s)', value: '2.3', status: '🔴 CRÍTICA' },
      { label: 'Frequency inicial (Hz)', value: '50.0', status: '✓ Normal' },
      { label: 'RoCoF máximo (Hz/s)', value: '-1.85', status: '🔴 CRÍTICO' },
      { label: 'Frequency nadir (Hz)', value: '47.79', status: '🔴 COLAPSO' },
      { label: 'Tiempo a blackout (min)', value: '3.0', status: '🔴 Muy rápido' }
    ],
    reflection: 'Con inercia < 2.5s, el sistema no puede tolerar perturbaciones de > 500 MW sin cascada. En 2015, sistemas de 30+ GW podían tolerar pérdidas de 1000 MW gracias a inercia > 4s.'
  },
  'voltage-violations': {
    summary: [
      { label: 'ICS Violados', value: '4', status: '🔴 CRÍTICO' },
      { label: 'Sobretensiones (>420kV)', value: '12+', status: '🔴 PELIGRO' },
      { label: 'Líneas perdidas ES-FR', value: '2', status: '🔴 AISLAMIENTO' }
    ],
    reflection: 'El hundimiento de la tensión provocado por la falta de reactiva desencadenó un transitorio capacitivo al abrir líneas, lo que rebotó en sobretensiones destructivas.'
  },
  'network-topology': {
    summary: [
      { label: 'Maniobras Topológicas', value: '30+', status: '🔴 EMERGENCIA' },
      { label: 'Efecto Tap-Lag', value: 'Sí', status: '🔴 COMPLICACIÓN' },
      { label: 'Líneas Abiertas Iniciales', value: '18%', status: '⚠️ ALTO' }
    ],
    reflection: 'El intento de los operadores de controlar la sobretensión mediante la apertura manual de líneas generó un efecto indeseado de carga capacitiva, empeorando el transitorio debido a la alta penetración de IBRs.'
  },
  'demand-load': {
    summary: [
      { label: 'Carga Desconectada', value: '> 30%', status: '🔴 COLAPSO' },
      { label: 'Escalones UFLS', value: '5/5', status: '🔴 AGOTADOS' },
      { label: 'Impacto Social', value: 'Masivo', status: '🔴 CRÍTICO' }
    ],
    reflection: 'El deslastre por subfrecuencia funcionó como última línea de defensa, sacrificando un tercio de la demanda ibérica para evitar el colapso sincrónico del núcleo europeo.'
  }
};

data.categories.forEach(cat => {
  if (summaries[cat.id]) {
    cat.summary = summaries[cat.id].summary;
    cat.reflection = summaries[cat.id].reflection;
  }

  // Add dummy styling flags to tables to make them look good
  cat.tables.forEach(t => {
    t.data.forEach((row, i) => {
      // randomly color some cells just for the aesthetic demo
      const keys = Object.keys(row);
      keys.forEach(k => {
        const val = String(row[k]);
        if (val.includes('Desconectado') || val.includes('Abierto') || val.includes('Off') || val.includes('Sí') || val.includes('Y')) {
          row[k + '_critical'] = true;
        } else if (val.includes('Alerta') || val.includes('Warning')) {
          row[k + '_warning'] = true;
        } else if (!isNaN(parseFloat(val)) && parseFloat(val) < 48.0) {
          row[k + '_critical'] = true;
        }
      });
    });
  });
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('JSON modificado exitosamente con metadata de Resumen y Tooltips');
