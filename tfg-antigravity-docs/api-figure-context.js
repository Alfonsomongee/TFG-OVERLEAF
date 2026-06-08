// api/figure-context.js
// Genera el párrafo "¿Por qué esto es relevante?" para el panel derecho del chatbot
// MEJORAS v2:
//   - answer truncado a 600 chars (antes 350) para capturar el argumento central
//   - nuevo campo figureDescription con descripción técnica del índice
//   - nuevo campo keyElements con elementos visuales concretos de la figura
//   - prompt reescrito para usar keyElements cuando están disponibles

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const {
    question,
    answer,
    caption,
    figureTitle,
    figureId,
    figureDescription, // NUEVO: descripción técnica ampliada de la figura
    keyElements,       // NUEVO: array de strings con elementos visuales concretos
  } = req.body;

  if (!question || !answer || !caption) {
    return res.status(400).json({ error: 'Missing params' });
  }

  // Construir bloque de elementos visuales concretos si están disponibles
  const elementsBlock = keyElements && keyElements.length > 0
    ? `\nELEMENTOS VISUALES CONCRETOS EN ESTA FIGURA:\n${keyElements.map((e, i) => `${i + 1}. ${e}`).join('\n')}`
    : '';

  // Descripción técnica ampliada si está disponible
  const descBlock = figureDescription
    ? `\nDescripción técnica ampliada: "${figureDescription.substring(0, 280)}"`
    : '';

  const prompt = `Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.

TAREA: Escribe UN párrafo de 40-60 palabras que explique al usuario
QUÉ debe buscar en esta figura y QUÉ elemento concreto confirma el fenómeno descrito.

DATOS:
- Pregunta del usuario: "${question}"
- Respuesta del asistente (extracto): "${answer.substring(0, 600)}"
- Título de la figura: "${figureTitle || caption}"
- Descripción técnica: "${caption.substring(0, 220)}"${descBlock}${elementsBlock}

REGLAS ABSOLUTAS:
1. Empieza con UNA de estas frases (elige la más natural según el contenido):
   "Fíjate en..." / "Observa cómo..." / "El dato clave aquí es..." /
   "Busca en esta figura..." / "Esta evidencia muestra directamente..."
2. Si hay ELEMENTOS VISUALES CONCRETOS, menciona uno específico por nombre
   (ej. "la curva ámbar de 12:33:21", "la banda gris de deslastre", "el pico de 440 kV").
   Si no hay, infiere el elemento más probable del título y la descripción.
3. Conecta ese elemento con UN concepto concreto de la respuesta del asistente.
4. PROHIBIDO: descripciones genéricas ("esta figura muestra", "en la imagen se ve"),
   repetir literalmente el caption, usar "esta figura es clave/importante/relevante".
5. Máximo 60 palabras. Solo el párrafo. Sin comillas ni encabezados.

Ejemplo perfecto (52 palabras):
"Fíjate en el instante 12:33:21 CEST: la curva de frecuencia cae en picado
mientras la tensión lleva ya 24 segundos por encima de 1,10 p.u.
Ese desfase temporal es la prueba forense de que el colapso fue capacitivo,
no inercial — la tensión falló antes que la frecuencia."

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
      const timer = setTimeout(() => controller.abort(), 6000);

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
              content: 'Eres un comunicador técnico de sistemas eléctricos de potencia. Respuestas ultra-concisas, máximo 60 palabras. Sin introducciones ni cierres.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.12,
          max_tokens: 150,
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

  // Fallback: usar descripción técnica o caption
  const fallbackText = figureDescription
    ? (figureDescription.length > 180 ? figureDescription.substring(0, 177) + '...' : figureDescription)
    : (caption.length > 180 ? caption.substring(0, 177) + '...' : caption);

  return res.status(200).json({ context: fallbackText, fallback: true });
}
