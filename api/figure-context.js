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

  const { question, answer, caption, figureTitle, figureId } = req.body;
  if (!question || !answer || !caption) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const prompt = `Eres un divulgador técnico experto en sistemas eléctricos. Tu tarea es explicar por qué una figura específica es relevante para responder la pregunta de un usuario, basándote en la respuesta que ya ha dado el asistente.

Pregunta del usuario: "${question}"
Respuesta del asistente (resumida): "${answer.substring(0, 500)}"
Título de la figura: "${figureTitle || caption}"
Descripción de la figura: "${caption}"

Genera un párrafo corto (máximo 70 palabras) que:
1. Conecte directamente la figura con la pregunta del usuario.
2. Explique qué aspecto de la respuesta ilustra la figura.
3. Use un tono claro y divulgativo, pero manteniendo precisión técnica.
4. No repitas información obvia (como "esta figura muestra...").
Responde SOLO con el párrafo, sin introducciones ni despedidas.`;

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
