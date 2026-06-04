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

  const prompt = `Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.

TAREA: Escribe UN párrafo de 40-60 palabras que explique al usuario
QUÉ debe buscar en esta figura concreta para entender mejor la respuesta,
y POR QUÉ esa figura es la evidencia más directa del fenómeno descrito.

DATOS:
- Pregunta del usuario: "${question}"
- Respuesta del asistente (extracto): "${answer.substring(0, 400)}"
- Título de la figura: "${figureTitle || caption}"
- Descripción técnica: "${caption}"

REGLAS ESTRICTAS:
1. Empieza con: "Fíjate en..." / "Observa cómo..." / "Esta figura muestra directamente..." / "El dato clave aquí es..."
2. Señala UN elemento concreto y visible de la figura (una curva, un timestamp, una zona coloreada, un valor numérico).
3. Explica qué significa ese elemento en el contexto de la respuesta.
4. PROHIBIDO: describir genéricamente la figura, repetir la descripción técnica, usar "esta figura es clave porque".
5. Máximo 60 palabras. Solo el párrafo, sin comillas ni encabezados.

Ejemplo perfecto (48 palabras):
"Fíjate en el instante 12:33:21 CEST: la curva de frecuencia cae en picado mientras la tensión ya lleva 24 segundos por encima de 1,10 p.u. Ese desfase temporal es la prueba forense de que el colapso fue capacitivo, no inercial — la tensión falló primero."

Escribe el párrafo ahora:`;

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
