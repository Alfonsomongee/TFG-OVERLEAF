// api/chat.js
// Endpoint para el chatbot RAG del TFG
// Usa MiniSearch (BM25) + Gemini 1.5 Flash (gratuito)

import MiniSearch from 'minisearch';
import fs from 'fs';
import path from 'path';

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
          storeFields: ['title', 'heading', 'text', 'slug']
        }
      );
    } catch (err) {
      console.error('Error cargando los archivos estáticos del índice:', err);
      throw new Error('IndexFilesMissing');
    }
  }
  return miniSearch;
}

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

    // ── Query expansion — sinónimos y términos relacionados ──
    const SYNONYMS = {
      // Prensa y medios
      'prensa': ['medios', 'comunicación', 'periodistas', 'noticias', 'cobertura', 'encuadre'],
      'medios': ['prensa', 'periódicos', 'televisión', 'radio', 'comunicación'],
      'internacional': ['europa', 'extranjero', 'global', 'mundial', 'europeo'],
      'periodistas': ['prensa', 'medios', 'periodismo', 'noticias'],
      'noticias': ['prensa', 'medios', 'información', 'comunicación'],
      // Técnicos
      'inercia': ['inertia', 'H', 'masa', 'rotacional', 'síncrona'],
      'inertia': ['inercia', 'H', 'rotational', 'synchronous'],
      'frecuencia': ['frequency', 'Hz', 'nadir', 'RoCoF', 'oscilación'],
      'frequency': ['frecuencia', 'Hz', 'nadir', 'RoCoF'],
      'colapso': ['collapse', 'apagón', 'blackout', 'fallo', 'caída'],
      'collapse': ['colapso', 'blackout', 'failure', 'apagón'],
      'apagón': ['blackout', 'colapso', 'corte', 'fallo', '28-A', '28A'],
      'blackout': ['apagón', 'colapso', 'corte', 'fallo', '28-A'],
      'renovable': ['solar', 'eólica', 'fotovoltaica', 'IBR', 'inversor'],
      'renewable': ['solar', 'wind', 'photovoltaic', 'IBR', 'inverter'],
      'tensión': ['voltaje', 'voltage', 'kV', 'sobretensión', 'Q-V'],
      'voltage': ['tensión', 'voltaje', 'kV', 'overvoltage'],
      'reactiva': ['reactive', 'MVAr', 'Q', 'capacitiva', 'inductiva'],
      'reactive': ['reactiva', 'MVAr', 'Q', 'capacitive'],
      'interconexión': ['interconnection', 'Francia', 'frontera', 'importación'],
      'interconnection': ['interconexión', 'France', 'border', 'import'],
      'recuperación': ['recovery', 'reposición', 'black start', 're-energización'],
      'recovery': ['recuperación', 'restoration', 'black start', 're-energization'],
      'prensa internacional': ['medios internacionales', 'cobertura internacional', 'periodismo extranjero'],
      // Redes sociales
      'redes sociales': ['twitter', 'X', 'social media', 'viral', 'desinformación'],
      'social media': ['redes sociales', 'twitter', 'X', 'viral'],
      'desinformación': ['fake news', 'bulos', 'información falsa', 'vacuum filling'],
      // Económico
      'económico': ['economic', 'coste', 'cost', 'pérdidas', 'impacto'],
      'economic': ['económico', 'cost', 'coste', 'losses', 'impact'],
    };

    // Expandir la query con sinónimos
    const baseQuery = question.trim();
    const queryWords = baseQuery.toLowerCase().split(/\s+/);
    const expandedTerms = new Set([baseQuery]);
    
    queryWords.forEach(word => {
      if (SYNONYMS[word]) {
        SYNONYMS[word].forEach(syn => expandedTerms.add(syn));
      }
    });
    
    // También buscar frases de dos palabras
    for (let i = 0; i < queryWords.length - 1; i++) {
      const phrase = queryWords[i] + ' ' + queryWords[i+1];
      if (SYNONYMS[phrase]) {
        SYNONYMS[phrase].forEach(syn => expandedTerms.add(syn));
      }
    }

    // Buscar con query original primero, luego con expansión
    const results = searcher.search(baseQuery, {
      prefix: true,
      // Fuzzy dinámico: permite 1 error en palabras largas, exacto en cortas
      fuzzy: term => term.length > 4 ? 1 : 0, 
      boost: { heading: 2.5, title: 1.5, text: 1 } // Prioridad a los títulos y encabezados
    });

    // Si hay pocos resultados, buscar con términos expandidos
    if (results.length < 3 && expandedTerms.size > 1) {
      const expandedQuery = [...expandedTerms].join(' ');
      const expandedResults = searcher.search(expandedQuery, {
        prefix: true,
        fuzzy: term => term.length > 5 ? 2 : 1, // Más permisivo en la segunda batida
        boost: { heading: 2, title: 1.5, text: 1 }
      });
      // Añadir resultados expandidos que no estén ya en results
      const existingIds = new Set(results.map(r => r.id));
      expandedResults.forEach(r => {
        if (!existingIds.has(r.id)) {
          results.push({ ...r, score: r.score * 0.8 }); // penalizar ligeramente
        }
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        answer: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
      });
    }

    const topChunks = results.slice(0, 10).map(r => chunks[r.id]);
    const context = topChunks
      .map(c => `## ${c.title} – ${c.heading} (Enlace: ${c.slug})\n${c.text}`)
      .join('\n\n');

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'API Key de Groq no configurada.' });
    }

    const prompt = `Eres un asistente especializado en el análisis del apagón ibérico del 28 de abril de 2025. Responde ÚNICAMENTE con la información contenida en el CONTEXTO proporcionado a continuación. Si la información no está en el contexto, di: "Este detalle no aparece en el TFG; te recomiendo consultar el glosario o los capítulos técnicos."

Reglas críticas:
- NO empieces NUNCA la frase con "Según el contexto proporcionado", "Basado en el contexto", ni nada similar. Responde directamente de forma natural y conversacional.
- NO uses formato Markdown para negritas (no uses asteriscos * ni **). Usa texto plano y limpio.
- Si la pregunta está relacionada con datos, gráficas o tablas, SIEMPRE debes añadir un enlace al final de tu respuesta apuntando a la URL proporcionada en el contexto. Ejemplo: "Puedes ver la gráfica detallada aquí: [Ver gráfica interactiva](/docs/ruta-al-capitulo)". 
- OBLIGATORIO: Los enlaces que generes DEBEN usar la sintaxis Markdown de enlaces: [Texto](/ruta).
- Sé preciso con las cifras y cita las magnitudes correctamente (MW, Hz, kV, s, etc.).
- Si el contexto menciona fuentes (REE, ENTSO-E, ICAI, CNMC), indícalas.
- Responde en español, en un máximo de 250 palabras.
- No inventes datos.

CONTEXTO:
${context}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA NATURAL Y DIRECTA:`;

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
        max_tokens: 500
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
