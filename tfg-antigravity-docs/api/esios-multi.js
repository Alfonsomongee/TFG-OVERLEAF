// api/esios-multi.js
// Proxy serverless que obtiene todos los indicadores ESIOS de una sola vez (Promise.all)
// Ruta: /api/esios-multi

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const token = process.env.ESIOS_TOKEN || '59f41cbd500501a872390d7e3d838b29ea20b2e55b3fa96153adf270840b11f5';

  const INDICATORS = {
    demanda:          1293,
    solar:            2044,
    eolica:           2038,
    nuclear:          2039,
    hidro:            2042,
    gas:              2041,
    renovable_total:  10351,
    no_renovable:     10352,
    intercambio_neto: 2043,
    export_francia:   2071,
    export_portugal:  2070,
    import_francia:   2076,
    import_portugal:  2075,
    precio_spot:      600,
  };

  const fetchIndicator = async (id) => {
    const url = `https://api.esios.ree.es/indicators/${id}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'x-api-key': token },
    });
    const data = await response.json();
    const values = data?.indicator?.values ?? [];
    if (values.length === 0) return null;
    const last = values[values.length - 1];
    return { value: last.value, datetime: last.datetime };
  };

  try {
    const entries = Object.entries(INDICATORS);
    const results = await Promise.all(entries.map(([, id]) => fetchIndicator(id).catch(() => null)));

    const payload = {};
    entries.forEach(([key], i) => {
      payload[key] = results[i]?.value ?? null;
    });

    // Métricas derivadas
    const { renovable_total, no_renovable } = payload;
    if (renovable_total !== null && no_renovable !== null && (renovable_total + no_renovable) > 0) {
      payload.penetracion_renovable = (renovable_total / (renovable_total + no_renovable)) * 100;
    } else {
      payload.penetracion_renovable = null;
    }

    // Inercia estimada simplificada (GW·s): nuclear×6 + hidro×3 (si >0) + gas×4
    const { nuclear, hidro, gas } = payload;
    if (nuclear !== null) {
      payload.inercia_estimada =
        ((nuclear ?? 0) * 6 + (hidro > 0 ? hidro * 3 : 0) + (gas ?? 0) * 4) / 1000;
    } else {
      payload.inercia_estimada = null;
    }

    payload.timestamp = new Date().toISOString();

    res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching ESIOS data', detail: err.message });
  }
}
