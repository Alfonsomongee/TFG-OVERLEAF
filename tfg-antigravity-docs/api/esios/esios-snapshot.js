/**
 * api/esios/snapshot.js
 * Vercel Edge Function — proxy de ESIOS con caché edge.
 *
 * ESTRATEGIA DE CACHÉ:
 *   s-maxage=300              → CDN Vercel sirve sin ir a ESIOS durante 5 min
 *   stale-while-revalidate=600 → CDN sirve caché stale mientras refresca en bg
 *   stale-if-error=3600       → si ESIOS falla, sirve caché hasta 1h
 *
 * Con esta configuración, ESIOS recibe como máximo 1 petición cada 5 min
 * independientemente del número de usuarios simultáneos. Protege contra
 * rate limiting durante la presentación en Milán.
 *
 * RESPUESTA:
 *   {
 *     timestamp: string (ISO 8601),
 *     H_eq:      number (s)   — inercia equivalente estimada
 *     ibr_pct:   number (%)   — penetración IBR (no-síncrona)
 *     scr_est:   number       — SCR estimado zona crítica
 *     solar:     number (MW)
 *     eolica:    number (MW)
 *     nuclear:   number (MW)
 *     gas:       number (MW)
 *     hidro:     number (MW)
 *     total:     number (MW)
 *   }
 *
 * CÁLCULO DE H_eq (estimación desde mix de generación):
 *   H_eq = Σ(P_i × H_típico_i) / P_total_síncrona
 *   H_típico: nuclear=6s, gas=5s, carbón=4s, hidro=3s, eólica=0s, FV=0s
 *   Fuente del método: ENTSO-E IGD on Inertia Assessment
 *
 * FALLBACK:
 *   Si ESIOS devuelve error, el endpoint devuelve HTTP 502 con JSON de error
 *   para que el cliente SWR lo trate como error y muestre el fallback del 28-A.
 */
export const config = { runtime: 'edge' };

const ESIOS_BASE = 'https://apidatos.ree.es/es/datos';
const ESIOS_TOKEN = process.env.ESIOS_TOKEN || '';

// H típica por tecnología [s] — Kundur 1994 / ENTSO-E IGD
const H_TIPICO = {
  nuclear: 6.0,
  carbon:  4.0,
  gas:     5.0,
  hidro:   3.0,
  eolica:  0.0,
  solar:   0.0,
  otros:   2.0,
};

// Indicadores ESIOS relevantes (tiempo real)
// 10010 = Demanda real · 1293 = Generación estructura actual
const INDICATORS = {
  generacion: 'generacion/estructura-generacion',
};

async function fetchEsios(endpoint, signal) {
  const now   = new Date();
  const start = new Date(now - 10 * 60 * 1000); // últimos 10 min
  const fmt   = (d) => d.toISOString().slice(0, 16);

  const url = `${ESIOS_BASE}/${endpoint}?start_date=${fmt(start)}&end_date=${fmt(now)}&time_trunc=ten_minutes&geo_trunc=electric_system&geo_limit=peninsular&geo_ids=8741`;

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(ESIOS_TOKEN ? { 'x-api-key': ESIOS_TOKEN } : {}),
  };

  const res = await fetch(url, { headers, signal });
  if (!res.ok) throw new Error(`ESIOS ${res.status}`);
  return res.json();
}

function parseGeneracion(json) {
  if (!json?.included?.length) return null;

  const result = { solar: 0, eolica: 0, nuclear: 0, gas: 0, hidro: 0, otros: 0 };
  const timestamp = new Date().toISOString();

  json.included.forEach(ind => {
    const title  = (ind.attributes?.title || '').toLowerCase();
    const values = ind.attributes?.values || [];
    const last   = values[values.length - 1];
    if (!last || last.value == null) return;
    const mw = parseFloat(last.value);

    if (title.includes('solar') || title.includes('fotovolt'))       result.solar  += mw;
    else if (title.includes('eólica') || title.includes('eolica'))   result.eolica += mw;
    else if (title.includes('nuclear'))                               result.nuclear += mw;
    else if (title.includes('ciclo') || title.includes('gas'))       result.gas    += mw;
    else if (title.includes('hidráu') || title.includes('hidraul'))  result.hidro  += mw;
    else                                                              result.otros  += mw;
  });

  const total_sync = result.nuclear + result.gas + result.hidro + result.otros;
  const total_all  = total_sync + result.solar + result.eolica;

  // H_eq = Σ(P_i × H_i) / P_total_síncrona
  const H_eq = total_sync > 0
    ? (result.nuclear * H_TIPICO.nuclear
      + result.gas    * H_TIPICO.gas
      + result.hidro  * H_TIPICO.hidro
      + result.otros  * H_TIPICO.otros) / total_sync
    : 0;

  // IBR%: eólica (tipo 3/4) + FV (tipo 4) — ambas son IBR
  const ibr_mw  = result.solar + result.eolica;
  const ibr_pct = total_all > 0 ? (ibr_mw / total_all) * 100 : 0;

  // SCR estimado: decrece linealmente con IBR%
  // A IBR=0% → SCR≈5; a IBR=100% → SCR≈1 (simplificación pedagógica)
  const scr_est = Math.max(1.0, 5.0 - (ibr_pct / 100) * 4.0);

  return {
    timestamp,
    H_eq:    parseFloat(H_eq.toFixed(2)),
    ibr_pct: parseFloat(ibr_pct.toFixed(1)),
    scr_est: parseFloat(scr_est.toFixed(2)),
    solar:   Math.round(result.solar),
    eolica:  Math.round(result.eolica),
    nuclear: Math.round(result.nuclear),
    gas:     Math.round(result.gas),
    hidro:   Math.round(result.hidro),
    total:   Math.round(total_all),
  };
}

export default async function handler(request) {
  const { signal } = new AbortController();

  try {
    const [genJson] = await Promise.all([
      fetchEsios(INDICATORS.generacion, signal),
    ]);

    const snapshot = parseGeneracion(genJson);

    if (!snapshot) {
      return new Response(
        JSON.stringify({ error: 'No data from ESIOS', code: 'NO_DATA' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Caché agresiva: CDN sirve sin tocar ESIOS durante 5 min
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600, stale-if-error=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, code: 'UPSTREAM_ERROR' }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          // En caso de error, permitir que Vercel sirva caché vieja hasta 1h
          'Cache-Control': 'stale-if-error=3600',
        },
      },
    );
  }
}
