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

  const prompt = `Eres un experto en comunicación técnica de sistemas eléctricos de potencia.

TAREA OBLIGATORIA: Genera EXACTAMENTE un párrafo de máximo 50 palabras que explique **por qué esta figura concreta ayuda al usuario a entender MEJOR la respuesta del asistente**.

DATOS DE ENTRADA:
- Pregunta del usuario: "${question}"
- Respuesta del asistente: "${answer.substring(0, 520)}"
- Figura (título + descripción): "${figureTitle || caption}"

REGLAS ESTRICTAS (debes cumplirlas todas):
1. Longitud máxima: 50 palabras.
2. La primera frase DEBE empezar con una de estas estructuras exactas:
   • "Esta figura es clave porque..."
   • "Ilustra perfectamente cómo..."
   • "Es especialmente relevante porque..."
3. Conecta con un elemento concreto de la pregunta o de la respuesta (ej: exportaciones netas a Francia, Tap-Lag en 220 kV, nadir de 47,79 Hz, RoCoF >1 Hz/s, etc.).
4. PROHIBIDO ABSOLUTAMENTE:
   - Decir "esta figura muestra", "en la imagen se ve", "la gráfica representa", "se observa".
   - Describir visualmente la figura.
   - Dar información que ya está en la respuesta del asistente.
5. Tono: claro, preciso, para lector técnico intermedio. Usa magnitudes correctas.
6. Salida: SOLO el párrafo. Nada más. Sin comillas, sin encabezados, sin "Aquí tienes el texto:".

Ejemplo de salida perfecta (52 palabras):
"Esta figura es clave porque muestra el flujo neto exportado a Francia en el momento del colapso, lo que explica directamente por qué las reservas de potencia reactiva del sur eran insuficientes para absorber la sobretensión generada por los IBR."

Genera el párrafo ahora:`;

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
