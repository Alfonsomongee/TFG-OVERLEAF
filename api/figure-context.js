// api/figure-context.js
// Endpoint para generar el contexto dinámico de las figuras mediante IA

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { question, answer, caption, figureId } = req.body;
  if (!question || !answer || !caption) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const prompt = `La siguiente pregunta del usuario: "${question}"
Respuesta del asistente (resumida): "${answer.substring(0, 400)}"
Figura técnica mostrada: "${caption}"
Escribe un breve párrafo (2-3 líneas, máximo 80 palabras) que explique por qué esta figura es relevante para responder la pregunta, conectando la figura con la respuesta del asistente. Usa un tono divulgativo pero técnico. Responde SOLO con el párrafo, nada más.`;

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API Key de Groq no configurada.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Eres un asistente técnico especializado en sistemas eléctricos de potencia.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text());
      return res.status(502).json({ error: 'Error del servicio de IA' });
    }

    const data = await response.json();
    const context = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ context: context.trim() });
  } catch (error) {
    console.error('Error en figure-context:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
