export const TIMELINE_EVENTS = [
  {
    id: 'e1',
    timestamp: 0.0,
    timeISO: '12:32:57.120',
    color: '#EF9F27',
    title: 'G-1 · Disparo transformador 400/220 kV — Granada',
    detail: 'Primer disparo de la cascada. Transformador de evacuación de planta solar. Potencia perdida: −355 MW. Tensión en 400 kV previa: 417,9 kV (dentro de rango P.O. 1.1). Causa: probable error en taps del trafo de evacuación.',
    mwLost: 355,
    mwAccum: 355
  },
  {
    id: 'e2',
    timestamp: 19.34,
    timeISO: '12:33:16.460',
    color: '#E24B4A',
    title: 'G-2 · Desconexión Badajoz (CSP + FV)',
    detail: 'Central termosolar + parque fotovoltaico adyacente. Tensión en 400 kV: 432,4 kV (rozando límite P.O. 1.1 de 435 kV). Potencia perdida: −727 MW (582 MW CSP + 145 MW FV, 360 ms después). Disparo por sobretensión.',
    mwLost: 727,
    mwAccum: 1082
  },
  {
    id: 'e3',
    timestamp: 20.56,
    timeISO: '12:33:17.368–12:33:18.000',
    color: '#E24B4A',
    title: 'G-3 · Cascada Sevilla / Huelva / Cáceres / Segovia / Badajoz (2ª oleada)',
    detail: 'Ventana crítica: 650 ms. Desconexiones en cadena de eólica y FV en 5 provincias. Detalle: Segovia 23 MW + PV Badajoz 118 MW + Huelva 34 MW + colectora Sevilla 550 MW + Cáceres 37,5 MW + PV Badajoz 72 MW. Potencia estimada perdida: −~1.150 MW.',
    mwLost: 1150,
    mwAccum: 2232
  },
  {
    id: 'e4',
    timestamp: 23.53,
    timeISO: '12:33:21.535',
    color: '#378ADD',
    title: 'Aislamiento de Iberia — Trip AC Francia–España (ANSI 78)',
    detail: 'Las protecciones de pérdida de sincronismo (out-of-step) abren las líneas de interconexión AC con Francia. Frecuencia en ese instante: 48,46 Hz. La Península Ibérica queda como sistema-isla. Importación desde Francia durante cascada había alcanzado pico de 4.609 MW AC.',
    mwLost: 0,
    mwAccum: 2232
  },
  {
    id: 'e5',
    timestamp: 25.88,
    timeISO: '12:33:23.000',
    color: '#9F3EFF',
    title: 'Nadir de frecuencia — 47,79 Hz',
    detail: 'Mínimo de frecuencia registrado. Por debajo de 47,5 Hz (umbral protecciones UFLS finales). Disparo de nucleares por sobreexcitación (protección V/Hz). Trip del enlace HVDC INELFE (12:33:23.960). Iberia pierde la última conexión externa.',
    mwLost: 0,
    mwAccum: 2232
  },
  {
    id: 'e6',
    timestamp: 27.18,
    timeISO: '12:33:27.300',
    color: '#E24B4A',
    title: 'Cero eléctrico — Colapso total',
    detail: 'Tensión en 400 kV cae por debajo de 1 kV. Apagón total en España peninsular y Portugal continental. Potencia total interrumpida: ~31 GW. El mayor apagón del sistema europeo continental en más de 20 años. (ENTSO-E, 2026)',
    mwLost: 0,
    mwAccum: 31000
  }
];

export const TIMELINE_CONFIG = {
  totalDuration: 27,
  startTime: '12:32:57',
  endTime: '12:33:27',
  timezone: 'CEST'
};

export default { TIMELINE_EVENTS, TIMELINE_CONFIG };
