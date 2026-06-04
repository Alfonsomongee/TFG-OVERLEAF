export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { question, answer, caption, figureTitle, figureId } = req.body;
  if (!question || !answer || !caption) {
    return res.status(400).json({ error: 'Missing params' });
  }

  const prompt = `Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.

TAREA: Escribe UN párrafo de 40-55 palabras que explique al usuario
QUÉ debe buscar en esta figura para entender mejor la respuesta,
y QUÉ elemento concreto confirma o ilustra el fenómeno descrito.

DATOS:
- Pregunta del usuario: "${question}"
- Respuesta del asistente (extracto): "${answer.substring(0, 350)}"
- Título de la figura: "${figureTitle || caption}"
- Descripción técnica: "${caption.substring(0, 200)}"

REGLAS ABSOLUTAS:
1. Empieza con UNA de estas frases exactas (elige la más natural):
   "Fíjate en..." / "Observa cómo..." / "El dato clave aquí es..." /
   "Busca en esta figura..." / "Esta evidencia muestra directamente..."
2. Señala UN elemento concreto y visible: una curva, un timestamp,
   un valor numérico, una zona coloreada, un punto de inflexión.
3. Conecta ese elemento con un concepto específico de la respuesta.
4. PROHIBIDO: describir genéricamente "esta figura muestra", "en la imagen
   se puede ver", repetir el caption, mencionar "esta figura es clave".
5. Máximo 55 palabras. Solo el párrafo. Sin comillas ni encabezados.

Ejemplo de salida perfecta (47 palabras):
"Fíjate en el instante 12:33:21 CEST: la curva de frecuencia cae en
picado mientras la tensión lleva ya 24 segundos por encima de 1,10 p.u.
Ese desfase temporal es la prueba forense de que el colapso fue
capacitivo, no inercial — la tensión falló primero."

Escribe el párrafo ahora:`;

  const providers = [
    {
      key: 'GROQ_API_KEY',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
    },
    {
      key: 'DEEPSEEK_API_KEY',
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
    },
  ];

  for (const provider of providers) {
    const apiKey = process.env[provider.key];
    if (!apiKey) continue;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: 'system',
              content: 'Eres un comunicador técnico de sistemas eléctricos. Respuestas ultra-concisas, máximo 55 palabras.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.15,
          max_tokens: 130,
          ...(provider.key === 'DEEPSEEK_API_KEY' ? { stream: false } : {}),
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!response.ok) continue;

      const data = await response.json();
      const context = data.choices?.[0]?.message?.content?.trim();
      if (context && context.length > 20) {
        return res.status(200).json({ context });
      }
    } catch {
      continue;
    }
  }

  // Fallback: devolver el caption truncado
  return res.status(200).json({
    context: caption.length > 160 ? caption.substring(0, 157) + '...' : caption,
    fallback: true,
  });
}
