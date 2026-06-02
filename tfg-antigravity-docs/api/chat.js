// api/chat.js
// Endpoint para el chatbot RAG del TFG
// Usa MiniSearch (BM25) + Gemini 1.5 Flash (gratuito)

const MiniSearch = require('minisearch');
const fs = require('fs');
const path = require('path');

// Variables para cache en memoria
let searchIndexData = null;
let chunks = null;
let miniSearch = null;

function getSearch() {
  if (!miniSearch) {
    try {
      searchIndexData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'search-index.json'), 'utf8'));
      chunks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'chunks.json'), 'utf8'));
      miniSearch = MiniSearch.loadJSON(
        JSON.stringify(searchIndexData),
        {
          fields: ['title', 'heading', 'text'],
          storeFields: ['title', 'heading', 'text', 'slug', 'chapterOrder', 'isGlossary', 'isGraphic']
        }
      );
    } catch (err) {
      console.error('Error cargando los archivos estáticos del índice:', err);
      throw new Error('IndexFilesMissing');
    }
  }
  return miniSearch;
}

module.exports = async function handler(req, res) {
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

  const { question } = req.body;
  if (!question || typeof question !== 'string' || question.trim().length < 3) {
    return res.status(400).json({ error: 'La pregunta debe tener al menos 3 caracteres.' });
  }

  try {
    let searcher;
    try {
      searcher = getSearch();
    } catch (e) {
      if (e.message === 'IndexFilesMissing') {
        return res.status(500).json({ error: 'Falta el archivo de índice. Ejecuta el comando de build o revisa vercel.json.' });
      }
      throw e;
    }

    const results = searcher.search(question.trim(), {
      prefix: true,
      fuzzy: 0.2,
    });

    results.sort((a, b) => {
      const aChunk = chunks[a.id];
      const bChunk = chunks[b.id];
      if (!aChunk || !bChunk) return 0;
      const aGloss = aChunk.isGlossary ? 1 : 0;
      const bGloss = bChunk.isGlossary ? 1 : 0;
      return (bGloss - aGloss) ||
             ((aChunk.chapterOrder || 999) - 
              (bChunk.chapterOrder || 999));
    });

    if (results.length === 0) {
      return res.status(200).json({
        answer: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
      });
    }

    const topChunks = results.slice(0, 7).map(r => chunks[r.id]);
    const context = topChunks
      .map(c => `## ${c.title} – ${c.heading} (Enlace: ${c.slug})\n${c.text}`)
      .join('\n\n');

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'API Key de Groq no configurada.' });
    }

    const prompt = `Eres el asistente del TFG "Anatomía de un Colapso Sistémico", análisis forense del apagón ibérico del 28 de abril de 2025.

INSTRUCCIONES:
- Responde directamente en español sin frases como "Según el contexto" o "Basado en el contexto".
- No uses negritas ni asteriscos en el cuerpo del texto.
- Si la respuesta incluye cifras, cita la fuente entre paréntesis: (REE), (ENTSO-E), (ICAI), etc.
- Si el contexto incluye un slug, añade al final una línea: "Más información: [Ver capítulo](/ruta)"
- Si la información no está en el contexto, di: "Este detalle no aparece en el TFG. Consulta el glosario o los capítulos técnicos."
- Máximo 250 palabras.

CONTEXTO:
${context}

PREGUNTA:
${question}

RESPUESTA:`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Eres el asistente del TFG "Anatomía de un Colapso Sistémico", un análisis forense del apagón ibérico del 28 de abril de 2025. Tienes acceso al contenido completo del trabajo. Respondes con precisión técnica, citando fuentes cuando el contexto las menciona, y diriges al lector a los capítulos o gráficas relevantes.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, await response.text());
      return res.status(502).json({ answer: 'El servicio de IA no está disponible en este momento. Inténtalo de nuevo en unos segundos.' });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No pude generar una respuesta. ¿Puedes reformular la pregunta?';

    return res.status(200).json({ answer });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res.status(500).json({ answer: 'Error interno del servidor. Por favor, inténtalo más tarde.' });
  }
}
