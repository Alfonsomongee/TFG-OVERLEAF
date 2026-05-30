/**
 * computePVCurve.js
 * Modelo de 2 nudos (SLACK — Z_eq — carga) para curva P-V (nariz).
 *
 * Ecuación canónica (Kundur 1994, cap. 6; Van Cutsem & Vournas 1998):
 *   V⁴ - V²·(E² - 2PR - 2QX) + (P²+Q²)(R²+X²) = 0
 *
 * Sustituyendo u = V²:
 *   u = b/2 ± √(b²/4 - c)
 *   donde b = E² - 2PR - 2QX
 *         c = (P²+Q²)(R²+X²)
 *
 * El nose point es el punto donde discriminante = 0 → V_plus = V_minus.
 * Más allá del nose point no existe solución real: colapso de tensión.
 *
 * El SCR escala la impedancia equivalente vista desde el nudo IBR:
 *   Xeq = X_base / SCR
 *   Req = R_base / SCR
 *
 * NOTA sobre el preset 28-A:
 *   SCR=1.8, cosPhi=0.95, P_op=0.91 → margen ≈ -0.02...-0.04 p.u. (negativo)
 *   El punto de operación supera el nose point → zona roja, colapso inminente.
 */
export function computePVCurve({
  E       = 1.0,    // tensión fuente (p.u.)
  X_base  = 0.5,    // reactancia base (p.u.)
  R_base  = 0.05,   // resistencia base (p.u.)
  cosPhi  = 0.95,   // factor de potencia de la carga
  SCR     = 3.0,    // Short Circuit Ratio (adimensional)
  P_op    = 0.82,   // potencia de operación actual (p.u.)
  step    = 0.002   // resolución del barrido de P
}) {
  const tanPhi = Math.tan(Math.acos(Math.min(1, Math.max(0, cosPhi))));
  const Xeq = X_base / Math.max(SCR, 0.01); // evitar división por cero
  const Req = R_base / Math.max(SCR, 0.01);

  const upper = [];
  const lower = [];

  // Tracking del nose point real: el último punto donde disc >= 0
  let lastValidP = 0;
  let lastVplus  = 1.0;
  let lastVminus = 1.0;

  // Barrido de P desde 0 hasta que el discriminante sea negativo
  for (let P = 0; P <= 5; P += step) {
    const Q    = P * tanPhi;
    const b    = E * E - 2 * P * Req - 2 * Q * Xeq;
    const c    = (P * P + Q * Q) * (Req * Req + Xeq * Xeq);
    const disc = (b * b) / 4 - c;

    if (disc < 0) break; // pasamos el nose point

    const sqrtDisc = Math.sqrt(disc);
    const uPlus    = b / 2 + sqrtDisc;
    const uMinus   = b / 2 - sqrtDisc;

    // uPlus y uMinus son V²; pueden ser negativos si la red es muy débil
    if (uPlus < 0) break;

    const Vplus  = Math.sqrt(uPlus);
    const Vminus = uMinus >= 0 ? Math.sqrt(uMinus) : 0;

    upper.push({ P: parseFloat(P.toFixed(3)), V: parseFloat(Vplus.toFixed(4))  });
    lower.unshift({ P: parseFloat(P.toFixed(3)), V: parseFloat(Vminus.toFixed(4)) });

    lastValidP  = P;
    lastVplus   = Vplus;
    lastVminus  = Vminus;
  }

  // El nose point real es el ÚLTIMO punto válido del barrido.
  // noseV = promedio de Vplus y Vminus EN ESE PUNTO (donde disc ≈ 0).
  // En el nose point exacto Vplus = Vminus, así que el promedio converge.
  const noseP = parseFloat(lastValidP.toFixed(3));
  const noseV = parseFloat(((lastVplus + lastVminus) / 2).toFixed(4));

  // Margen al colapso: diferencia entre el nose point y el punto de operación.
  // Negativo → el sistema ya está más allá del colapso (no existe solución estable).
  const margin = parseFloat((noseP - P_op).toFixed(4));

  // Tensión en el punto de operación sobre la rama estable (superior).
  // Si P_op > noseP, el sistema está colapsado → devolvemos noseV como cota.
  let opV = noseV;
  if (P_op <= noseP && upper.length > 0) {
    // Búsqueda binaria aproximada del punto más cercano a P_op
    let bestDiff = Infinity;
    for (let i = 0; i < upper.length; i++) {
      const diff = Math.abs(upper[i].P - P_op);
      if (diff < bestDiff) {
        bestDiff = diff;
        opV = upper[i].V;
      }
      // Los datos están ordenados; si ya nos alejamos, parar
      if (upper[i].P > P_op + step) break;
    }
  }

  return { upper, lower, noseP, noseV, margin, opV };
}
