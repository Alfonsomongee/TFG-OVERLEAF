export default async function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Obtener la URL completa de REData desde el query parameter 'url'
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing "url" parameter' });
  }

  // Validar que la URL pertenece a REData (seguridad básica)
  if (!url.startsWith('https://apidatos.ree.es/')) {
    return res.status(403).json({ error: 'Forbidden domain' });
  }

  try {
    // Llamar a la API pública de REData
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TFG-Dashboard/1.0'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `REData API error: ${response.statusText}` });
    }

    const data = await response.json();

    // Establecer caché en el CDN (los datos históricos no cambian)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
