// api/entsoe.js — Vercel Edge Function
// Proxy seguro para ENTSO-E Transparency Platform API
// El token NUNCA sale del servidor; el browser solo llama a /api/entsoe?type=generation&area=ES
//
// Variables de entorno requeridas en Vercel:
//   ENTSOE_API_KEY = token de https://web-api.tp.entsoe.eu/api
//
// Parámetros:
//   type=generation|demand|load  — tipo de dato
//   area=ES|PT                   — área geográfica (España o Portugal)
//   hours=24|48|7                — horas históricas (default: 24)

export const config = { runtime: 'edge' };

// Dominios ENTSO-E para el sistema ibérico
const DOMAINS = {
  ES: '10YES-REE------0',
  PT: '10YPT-REN------W',
};

// Tipos de documentos válidos
const DOCUMENT_TYPES = {
  generation: 'A65',   // Actual Generation per Production Type
  demand:     'A71',   // Total Load - Day Ahead / Actual
  load:       'A73',   // Total Load - Actual Aggregated
};

// Caché en memoria para reducir llamadas a ENTSO-E (desarrollo local)
const memCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minuto

export default async function handler(request) {
  // CORS — origen propio solamente
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://tfg-overleaf.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405, corsOrigin);
  }

  const url = new URL(request.url);
  const type  = url.searchParams.get('type') || 'generation';
  const area  = (url.searchParams.get('area') || 'ES').toUpperCase();
  const hours = parseInt(url.searchParams.get('hours')) || 24;

  // Validaciones
  if (!DOCUMENT_TYPES[type]) {
    return json({ error: `Invalid type. Allowed: ${Object.keys(DOCUMENT_TYPES).join(',')}` }, 400, corsOrigin);
  }
  if (!DOMAINS[area]) {
    return json({ error: `Invalid area. Allowed: ${Object.keys(DOMAINS).join(',')}` }, 400, corsOrigin);
  }

  const apiKey = process.env.ENTSOE_API_KEY;
  if (!apiKey) {
    console.error('[entsoe] ENTSOE_API_KEY not set in environment variables');
    return json({ error: 'Server configuration error' }, 500, corsOrigin);
  }

  // Construir timestamps (UTC)
  const now       = new Date();
  const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
  const endTime   = now;

  const periodStart = formatENTSOEDate(startTime);
  const periodEnd   = formatENTSOEDate(endTime);

  const cacheKey = `${type}-${area}-${periodStart}-${periodEnd}`;

  // Revisar caché en memoria (desarrollo local + posibles Durable Objects)
  if (memCache.has(cacheKey)) {
    const cached = memCache.get(cacheKey);
    if (Date.now() - cached.time < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Cache': 'HIT',
        },
      });
    }
  }

  // Construir URL de ENTSO-E
  const entsoeUrl = new URL('https://web-api.tp.entsoe.eu/api');
  entsoeUrl.searchParams.set('securityToken', apiKey);
  entsoeUrl.searchParams.set('documentType', DOCUMENT_TYPES[type]);
  entsoeUrl.searchParams.set('in_Domain',    DOMAINS[area]);
  entsoeUrl.searchParams.set('out_Domain',   DOMAINS[area]);
  entsoeUrl.searchParams.set('periodStart',  periodStart);
  entsoeUrl.searchParams.set('periodEnd',    periodEnd);

  try {
    const entsoeResponse = await fetch(entsoeUrl.toString(), {
      headers: {
        'Accept': 'application/xml',
        'User-Agent': 'TFG-ESIOS-Dashboard/1.0',
      },
    });

    if (!entsoeResponse.ok) {
      const errorText = await entsoeResponse.text();
      console.error(`[entsoe] ENTSO-E API error ${entsoeResponse.status}:`, errorText.substring(0, 200));
      return json(
        { error: `ENTSO-E API returned ${entsoeResponse.status}`, detail: errorText.substring(0, 500) },
        entsoeResponse.status, corsOrigin
      );
    }

    const xmlText = await entsoeResponse.text();
    
    // Parsear XML — ENTSO-E devuelve XML GL (ISO 14909)
    // Estructura: <GL_TimeSeries><Period><TimeInterval><Pos><Qty>
    const data = parseENTSOEXML(xmlText, type);

    // Guardar en caché
    memCache.set(cacheKey, { data, time: Date.now() });
    if (memCache.size > 100) {
      const firstKey = memCache.keys().next().value;
      memCache.delete(firstKey);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'MISS',
      },
    });
  } catch (err) {
    console.error('[entsoe] Fetch error:', err);
    return json({ error: 'Failed to fetch from ENTSO-E', detail: err.message }, 502, corsOrigin);
  }
}

/**
 * Formatear fecha al estándar ENTSO-E: YYYYMMDDHHmmZ
 */
function formatENTSOEDate(date) {
  const year   = date.getUTCFullYear();
  const month  = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day    = String(date.getUTCDate()).padStart(2, '0');
  const hours  = String(date.getUTCHours()).padStart(2, '0');
  const mins   = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}${month}${day}${hours}${mins}Z`;
}

/**
 * Parsear XML GL de ENTSO-E y extraer valores
 * Estructura aproximada:
 * <GL_MarketDocument>
 *   <TimeSeries>
 *     <Period>
 *       <timeInterval><start>...</start><end>...</end></timeInterval>
 *       <Point><position>1</position><quantity>1234.5</quantity></Point>
 */
function parseENTSOEXML(xml, type) {
  const timeseries = [];

  // Regex simple para extraer <Period> bloques
  const periodRegex = /<Period>([\s\S]*?)<\/Period>/g;
  let periodMatch;

  while ((periodMatch = periodRegex.exec(xml)) !== null) {
    const periodBlock = periodMatch[1];

    // Extraer timeInterval
    const timeIntervalMatch = /<timeInterval>([\s\S]*?)<\/timeInterval>/.exec(periodBlock);
    if (!timeIntervalMatch) continue;

    const intervalBlock = timeIntervalMatch[1];
    const startMatch    = /<start>([^<]+)<\/start>/.exec(intervalBlock);
    const endMatch      = /<end>([^<]+)<\/end>/.exec(intervalBlock);

    if (!startMatch || !endMatch) continue;

    const periodStart = new Date(startMatch[1]);

    // Extraer todos los <Point>s en este período
    const pointRegex = /<Point>([\s\S]*?)<\/Point>/g;
    let pointMatch;
    let posCounter = 0;

    while ((pointMatch = pointRegex.exec(periodBlock)) !== null) {
      posCounter++;
      const pointBlock  = pointMatch[1];
      const qtyMatch    = /<quantity>([^<]+)<\/quantity>/.exec(pointBlock);

      if (!qtyMatch) continue;

      const value = parseFloat(qtyMatch[1]);
      const datetime = new Date(periodStart.getTime() + (posCounter - 1) * 60 * 60 * 1000); // ENTSO-E usa intervalos horarios

      timeseries.push({
        datetime: datetime.toISOString(),
        value:    isNaN(value) ? null : value,
        position: posCounter,
      });
    }
  }

  return {
    type,
    area,
    unit: type === 'generation' ? 'MW' : type === 'demand' ? 'MW' : 'MW',
    timeseries,
    fetched_at: new Date().toISOString(),
    count: timeseries.length,
  };
}

function json(body, status, corsOrigin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin || '*',
    },
  });
}
