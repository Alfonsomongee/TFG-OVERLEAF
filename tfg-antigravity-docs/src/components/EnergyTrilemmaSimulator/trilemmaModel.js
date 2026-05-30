/**
 * trilemmaModel.js — Funciones puras para el EnergyTrilemmaSimulator (Refactor Sprint 12)
 *
 * MODELO BARICÉNTRICO:
 * a (alpha) = Seguridad (vértice superior)
 * b (beta)  = Equidad (vértice inferior izquierdo)
 * c (gamma) = Sostenibilidad (vértice inferior derecho)
 * a + b + c = 1
 *
 * Centroide (1/3, 1/3, 1/3) = equilibrio óptimo.
 * Riesgo de blackout = distancia euclidiana al centroide.
 */

// Utilidad para asegurar que un valor esté entre min y max
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calcula la distancia euclidiana 3D al centroide (1/3, 1/3, 1/3)
 */
export function computeDistanceToCentroid(a, b, c) {
  const da = a - 1/3;
  const db = b - 1/3;
  const dc = c - 1/3;
  return Math.sqrt(da * da + db * db + dc * dc);
}

/**
 * Clasifica la zona de riesgo basándose exclusivamente en la distancia euclidiana.
 */
export function classifyZone(a, b, c) {
  const d = computeDistanceToCentroid(a, b, c);
  if (d < 0.15) return 'EQUILIBRIO';
  if (d < 0.35) return 'TENSIÓN';
  return 'COLAPSO';
}

/**
 * Métricas físicas derivadas del modelo de Heffron et al. y datos del 28-A.
 */
export function computeMetrics(a, b, c) {
  // Inercia equivalente (s)
  const H_eq = 2.0 + 6.0 * a;
  
  // Ratio de Cortocircuito (SCR mínimo)
  const SCR_min = 1.5 + 4.5 * a;
  
  // Precio medio (€/MWh)
  const precio = 35 + 70 * (1 - b);
  
  // Emisiones (g CO2/kWh)
  const emisiones = 50 + 350 * (1 - c);
  
  // Riesgo de Blackout normalizado [0, 1] (distancia max = sqrt(6)/3 ≈ 0.816)
  const d = computeDistanceToCentroid(a, b, c);
  const riesgo = clamp(d / 0.816496, 0, 1);
  
  return {
    H_total: H_eq.toFixed(1),
    SCR: SCR_min.toFixed(1),
    precio: Math.round(precio),
    emisiones: Math.round(emisiones),
    riesgo: Math.round(riesgo * 100),
    zone: classifyZone(a, b, c),
  };
}

/**
 * Proyecta coordenadas cartesianas SVG (x,y) a baricéntricas (a,b,c).
 */
export function cartesianToBarycentric(x, y, cx, cy, L, h) {
  // 1. Calcular alpha desde Y
  let a_raw = (1 / 3) - (y - cy) / h;
  
  // 2. Calcular diferencia c - b desde X
  const diff_cb = (2 * (x - cx)) / L;
  
  // 3. Obtener c y b
  let c_raw = (1 - a_raw + diff_cb) / 2;
  let b_raw = 1 - a_raw - c_raw;
  
  // 4. Clamping baricéntrico duro
  let a = a_raw, b = b_raw, c = c_raw;
  
  if (a < 0) {
    a = 0;
    const sum = b_raw + c_raw;
    if (sum === 0) { b = 0.5; c = 0.5; }
    else { b = clamp(b_raw / sum, 0, 1); c = 1 - b; }
  } else if (b < 0) {
    b = 0;
    const sum = a_raw + c_raw;
    if (sum === 0) { a = 0.5; c = 0.5; }
    else { a = clamp(a_raw / sum, 0, 1); c = 1 - a; }
  } else if (c < 0) {
    c = 0;
    const sum = a_raw + b_raw;
    if (sum === 0) { a = 0.5; b = 0.5; }
    else { a = clamp(a_raw / sum, 0, 1); b = 1 - a; }
  }
  
  const total = a + b + c;
  return { a: a/total, b: b/total, c: c/total };
}

/**
 * Proyecta coordenadas baricéntricas (a,b,c) a cartesianas SVG (x,y).
 */
export function barycentricToCartesian(a, b, c, cx, cy, L, h) {
  const x = cx + (L / 2) * (c - b);
  const y = cy + (h / 3) * (1 - 3 * a);
  return { x, y };
}
