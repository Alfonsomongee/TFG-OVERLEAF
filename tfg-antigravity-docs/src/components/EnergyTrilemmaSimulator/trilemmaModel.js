/**
 * trilemmaModel.js — Funciones puras para el EnergyTrilemmaSimulator
 *
 * MODELO DE CALIBRACIÓN:
 * El punto 28-A (IBR=82, GFM=0, ERS=0) ancla en el CENTRO del triángulo
 * por definición: es el punto de máxima tensión simultánea en los tres ejes.
 * Las desviaciones desde ese ancla mueven el punto hacia los vértices.
 *
 * Métricas calibradas con datos reales del TFG (09-conclusiones.mdx):
 *   H_total(28-A) = 2.3 GWs (global), 1.3 GWs (zona sur)
 *   precio(28-A)  = 18.50 €/MWh (precio medio diario real)
 *   SCR(28-A)     ≈ 1.8 (zona sur: 1.3, ambos próximos al umbral crítico 1.5)
 */

// Punto de anclaje: el estado del 28-A es el centro del trilema
const ANCHOR = { penetration: 82, gfm: 0, ersPrice: 0 };

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Mapea los valores de los sliders a coordenadas baricéntricas (a, b, c) con a+b+c=1.
 *
 * Vértices:
 *   a = Descarbonización (arriba)    — mayor IBR mueve hacia aquí
 *   b = Estabilidad dinámica (izq.)  — mayor GFM + ERS mueve hacia aquí
 *   c = Asequibilidad (dcha.)        — menor ERS mueve hacia aquí
 *
 * El estado 28-A (82, 0, 0) = anchor → desviaciones = 0 → punto = (1/3, 1/3, 1/3)
 */
export function computeCoords(penetration, gfm, ersPrice) {
  // Desviaciones normalizadas respecto al ancla 28-A
  const dP = (penetration - ANCHOR.penetration) / 100;  // -0.82 a +0.18
  const dG = (gfm - ANCHOR.gfm) / 100;                 //  0.00 a +1.00
  const dE = (ersPrice - ANCHOR.ersPrice) / 50;         //  0.00 a +1.00

  // Cada desviación contribuye al desplazamiento hacia un vértice:
  // Más IBR (dP > 0) → tensión Desc↔Est → hacia Descarbonización
  // Más GFM + ERS (dG, dE > 0) → relaja inestabilidad → hacia Estabilidad
  // Más ERS (dE > 0) encarece → se aleja de Asequibilidad
  const toDesc = clamp(dP * 1.8, -0.9, 0.9);
  const toStab = clamp(dG * 1.2 + dE * 0.3 - dP * 0.3, -0.9, 0.9);
  const toAse  = clamp(-dE * 1.5 - dG * 0.3, -0.9, 0.9);

  // Partimos del centro y aplicamos desplazamientos
  const SPREAD = 0.27;
  const a_raw = 1 / 3 + toDesc * SPREAD;
  const b_raw = 1 / 3 + toStab * SPREAD;
  const c_raw = 1 / 3 + toAse  * SPREAD;

  // Clamp y normalizar
  const a = clamp(a_raw, 0.02, 0.96);
  const b = clamp(b_raw, 0.02, 0.96);
  const c = clamp(c_raw, 0.02, 0.96);
  const sum = a + b + c;

  return { a: a / sum, b: b / sum, c: c / sum };
}

/**
 * Métricas físicas derivadas calibradas con datos reales del TFG.
 */
export function computeMetrics(penetration, gfm, ersPrice) {
  const p = penetration / 100;
  const g = gfm / 100;
  const e = ersPrice / 50;

  // Inercia H (GWs): decrece con IBR, crece con síncronas equivalentes (proxy: GFM)
  // Calibración: H(0.82, 0) = 2.3 GWs (dato real conclusiones.mdx línea 27)
  const H_total = clamp(6.5 - 5.1 * p + 2.8 * g, 0.8, 7.0);

  // SCR promedio nodal: crítico cuando < 1.5 (umbral MRSCR del TFG Tabla 2)
  // Calibración: SCR(0.82, 0) ≈ 1.8 (zona media entre global 2.3 y sur 1.3)
  const SCR = clamp(4.2 - 2.9 * p + 1.8 * g, 0.5, 5.0);

  // Precio medio electricidad (€/MWh)
  // Calibración: precio(0.82, 0, 0) ≈ 18.50 €/MWh (dato real conclusiones.mdx línea 66)
  const precio = clamp(20 + ersPrice * 1.8 - (1 - p) * 8, 5, 95);

  // Clasificación de zona de riesgo
  const zone = classifyZone(penetration, gfm, ersPrice);

  return {
    H_total: H_total.toFixed(1),
    SCR: SCR.toFixed(1),
    precio: Math.round(precio),
    zone,
  };
}

function classifyZone(penetration, gfm, ersPrice) {
  // COLAPSO: alta penetración IBR + sin GFM + sin mercado ERS → réplica del 28-A
  if (penetration > 72 && gfm < 15 && ersPrice < 8) return 'COLAPSO';

  // TENSIÓN: condiciones comprometidas en al menos un eje
  const ibr_sin_gfm = penetration > 65 && gfm < 25;
  const gfm_sin_mercado = gfm > 35 && ersPrice < 5;
  const coste_prohibitivo = ersPrice > 40 && gfm < 35;
  if (ibr_sin_gfm || gfm_sin_mercado || coste_prohibitivo) return 'TENSIÓN';

  return 'EQUILIBRIO';
}
