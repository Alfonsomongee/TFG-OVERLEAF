const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../static/data/annex-figures-metadata.json');
let data = JSON.parse(fs.readFileSync(p, 'utf8'));

const replacements = {
  "Figura A3.1.": "Figura N4 — Calendario de implementación del P.O. 7.4. Fuentes: CNMC, BOE.",
  "Figura A3.2.": "Figura N2 — Cronología del Overvoltage-Driven Blackout del 28‑A. Fuentes: ENTSO‑E, REE, IIT‑ICAI.",
  "Figura A8.1.": "Figura B5 — Sismógrafo del colapso: transición de normalidad operativa a pérdida total del sistema. Fuente: ENTSO‑E.",
  "Figura A8.2.": "Figura M1 — Matriz de consenso y discrepancia entre informes periciales.",
  "Figura A1.1.": "Figura L1 — Horas anuales de LOLE por zona de oferta según la Decisión 06/2026 de ACER. Fuente: ACER.",
  "Figura A1.2.": "Figura N5 — El Boom del Almacenamiento Ibérico (Q1 2024 – mayo 2026). Fuentes: APPA, REE, MITECO.",
  "Figura A2.1.": "Figura L3 — Fortaleza de red: SCR tradicional frente a MRSCR real en subestaciones ibéricas. Fuente: ENTSO‑E.",
  "Figura A2.2.": "Figura M2 — Del modelo de seguridad clásico a métricas dinámicas.",
  "Figura A2.3.": "Figura N1 — Sistema Ahora vs 28A: Comparación de métricas de vulnerabilidad. Fuentes: REE, ENTSO‑E, ESIOS.",
  "Figura A7.1.": "Figura M3 — Trilema estructural del sistema ibérico el 28-A.",
  "Figura A7.2.": "Figura N3 — Expedientes sancionadores incoados por la CNMC tras el 28A. Fuente: CNMC / BOE.",
  "Figura A4.1.": "Figura K1 — Cronología EAS/SAM: de la separación al mando unificado. Fuente: ENTSO‑E.",
  "Figura A4.2.": "Figura K2 — Arquitectura de mando continental tras la separación ibérica. Fuente: ENTSO‑E.",
  "Figura A5.1.": "Figura L2 — Incidentes de precios en PICASSO e impacto de la demanda elástica. Fuente: ACER.",
  "Figura A9.2.": "Figura M4 — Tres planos de resolución.",
  "Figura A9.3.": "Figura M5 — Agenda de investigación futura."
};

data = data.map(item => {
  for (const [key, newVal] of Object.entries(replacements)) {
    if (item.title.startsWith(key)) {
      item.title = newVal;
      item.description = newVal;
      break;
    }
  }
  return item;
});

fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
console.log('Done mapping JSON');
