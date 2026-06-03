// api/chat.js
const MiniSearch = require('minisearch');
const fs = require('fs');
const path = require('path');

let searchIndexData = null;
let chunks = null;
let miniSearch = null;

function getSearch() {
  if (!miniSearch) {
    try {
      searchIndexData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'static', 'search-index.json'), 'utf8')
      );
      chunks = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'static', 'chunks.json'), 'utf8')
      );
      miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndexData), {
        fields: ['title', 'heading', 'text'],
        storeFields: ['title', 'heading', 'text', 'slug', 'chapterOrder', 'isGlossary', 'isGraphic'],
      });
    } catch (err) {
      console.error('Error cargando archivos estáticos del índice:', err);
      throw new Error('IndexFilesMissing');
    }
  }
  return { searcher: miniSearch, allChunks: chunks };
}

// ── Prompts por idioma ─────────────────────────────────────────────────────────

const SYSTEM_PROMPTS = {
  es: `Eres el asistente del TFG "Anatomía de un Colapso Sistémico", análisis forense del apagón ibérico del 28 de abril de 2025. Tienes acceso al contenido completo del trabajo. Respondes con precisión técnica, citando fuentes cuando el contexto las menciona, y diriges al lector a los capítulos, gráficas o términos del glosario relevantes.`,
  en: `You are the assistant for the thesis "Anatomy of a Systemic Collapse", a forensic analysis of the Iberian blackout of April 28, 2025. You have access to the complete content of the thesis. You respond with technical precision, citing sources when the context mentions them, and directing the reader to relevant chapters, interactive charts, or glossary terms.`,
  de: `Du bist der Assistent der Abschlussarbeit „Anatomie eines systemischen Zusammenbruchs", einer forensischen Analyse des iberischen Stromausfalls vom 28. April 2025. Du hast Zugriff auf den vollständigen Inhalt der Arbeit. Du antwortest mit technischer Präzision, zitierst Quellen, wenn der Kontext sie erwähnt, und verweist den Leser auf relevante Kapitel, interaktive Grafiken oder Glossarbegriffe.`,
};

const USER_PROMPT_TEMPLATES = {
  es: (context, glossaryLinks, graphicLinks, question) => `INSTRUCCIONES:
- Responde directamente en español.
- No uses negritas ni asteriscos en el cuerpo del texto.
- Si la respuesta incluye cifras, cita la fuente entre paréntesis: (REE), (ENTSO-E), (ICAI), etc.
- Si el contexto incluye una Ruta de capítulo, añade al final UN enlace con ese slug exacto: "Más información: [Ver capítulo](SLUG_EXACTO)"
- NO inventes rutas ni construyas URLs. Usa únicamente los slugs que aparecen en el contexto bajo "Ruta:".
- Si hay términos en el bloque TÉRMINOS DEL GLOSARIO, añádelos al final usando exactamente los enlaces que aparecen en ese bloque, sin modificarlos.
- Si hay gráficas en el bloque GRÁFICAS INTERACTIVAS, añádelas al final usando exactamente los enlaces que aparecen en ese bloque, sin modificarlos.
- Si la información no está en el contexto, di: "Este detalle no aparece en el TFG. Consulta el glosario o los capítulos técnicos."
- Máximo 250 palabras.

${glossaryLinks}${graphicLinks}
CONTEXTO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA:`,

  en: (context, glossaryLinks, graphicLinks, question) => `INSTRUCTIONS:
- Answer directly in English.
- Do not use bold or asterisks in the body of the text.
- If the answer includes figures, cite the source in parentheses: (REE), (ENTSO-E), (ICAI), etc.
- If the context includes a chapter Route, add at the end ONE link using that exact slug: "More info: [See chapter](EXACT_SLUG)"
- DO NOT invent paths or construct URLs. Only use slugs that appear in the context under "Ruta:".
- If there are terms in the RELEVANT GLOSSARY TERMS block, add them at the end using exactly the links that appear in that block, without modifying them.
- If there are charts in the RELATED INTERACTIVE CHARTS block, add them at the end using exactly the links that appear in that block, without modifying them.
- If the information is not in the context, say: "This detail does not appear in the thesis. Check the glossary or the technical chapters."
- Maximum 250 words.

${glossaryLinks}${graphicLinks}
THESIS CONTEXT:
${context}

QUESTION:
${question}

ANSWER:`,

  de: (context, glossaryLinks, graphicLinks, question) => `ANWEISUNGEN:
- Antworte direkt auf Deutsch.
- Verwende keine Fettschrift oder Sternchen im Fließtext.
- Wenn die Antwort Zahlen enthält, zitiere die Quelle in Klammern: (REE), (ENTSO-E), (ICAI) usw.
- Wenn der Kontext eine Kapitel-Route enthält, füge am Ende EINEN Link mit dem exakten Slug hinzu: "Mehr Infos: [Kapitel ansehen](EXAKTER_SLUG)"
- ERFINDE KEINE Pfade und konstruiere KEINE URLs. Verwende nur Slugs, die im Kontext unter "Ruta:" erscheinen.
- Wenn Begriffe im Block RELEVANTE GLOSSARBEGRIFFE vorhanden sind, füge sie am Ende mit genau den Links ein, die in diesem Block erscheinen, ohne sie zu ändern.
- Wenn Grafiken im Block VERWANDTE INTERAKTIVE GRAFIKEN vorhanden sind, füge sie am Ende mit genau den Links ein, die in diesem Block erscheinen, ohne sie zu ändern.
- Wenn die Information nicht im Kontext vorhanden ist, sage: "Dieses Detail erscheint nicht in der Abschlussarbeit. Bitte Glossar oder technische Kapitel konsultieren."
- Maximal 250 Wörter.

${glossaryLinks}${graphicLinks}
KONTEXT DER ABSCHLUSSARBEIT:
${context}

FRAGE:
${question}

ANTWORT:`,
};

// ── Handler principal ──────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido. Usa POST.' });

  const { question, locale: rawLocale } = req.body;
  const locale = ['es', 'en', 'de'].includes(rawLocale) ? rawLocale : 'es';

  if (!question || typeof question !== 'string' || question.trim().length < 3) {
    return res.status(400).json({ error: 'La pregunta debe tener al menos 3 caracteres.' });
  }

  try {
    let searcher, allChunks;
    try {
      ({ searcher, allChunks } = getSearch());
    } catch (e) {
      if (e.message === 'IndexFilesMissing') {
        return res.status(500).json({ error: 'Falta el archivo de índice. Ejecuta el build.' });
      }
      throw e;
    }

    // ── Búsqueda BM25 ──
    const results = searcher.search(question.trim(), { prefix: true, fuzzy: 0.2 });

    results.sort((a, b) => {
      const aC = allChunks[a.id];
      const bC = allChunks[b.id];
      if (!aC || !bC) return 0;
      const aBoost = (aC.isGlossary || aC.isGraphic) ? 0.5 : 0;
      const bBoost = (bC.isGlossary || bC.isGraphic) ? 0.5 : 0;
      return (b.score + bBoost) - (a.score + aBoost);
    });

    if (results.length === 0) {
      const noResultMsg = {
        es: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
        en: 'No relevant information was found in the thesis to answer your question. Try rephrasing it or check the glossary.',
        de: 'Keine relevanten Informationen in der Abschlussarbeit gefunden. Bitte die Frage umformulieren oder das Glossar konsultieren.',
      };
      return res.status(200).json({ answer: noResultMsg[locale] });
    }

    // ── Separar chunks por tipo ──
    const allResults = results.map(r => allChunks[r.id]);
    const contentChunks = allResults
      .filter(c => !c.isGlossary && !c.isGraphic)
      .slice(0, 5);
    const glossaryChunks = allResults
      .filter(c => c.isGlossary)
      .slice(0, 3);
    const graphicChunks = allResults
      .filter(c => c.isGraphic)
      .slice(0, 2);

    // ── Construir contexto de contenido ──
    const chapterLinks = contentChunks.length > 0
      ? `${locale === 'en' ? 'CHAPTER LINKS' : locale === 'de' ? 'KAPITEL-LINKS' : 'ENLACES DE CAPÍTULOS'}:\n${[...new Set(contentChunks.map(c => c.slug))].map(slug => {
          const chunk = contentChunks.find(c => c.slug === slug);
          return `- [${chunk.title}](${slug})`;
        }).join('\n')}\n\n`
      : '';

    const context = contentChunks
      .map(c => `## ${c.title} – ${c.heading}\n${c.text}`)
      .join('\n\n');

    const SECTION_LABELS = {
      es: { glossary: 'TÉRMINOS DEL GLOSARIO RELEVANTES', graphics: 'GRÁFICAS INTERACTIVAS RELACIONADAS' },
      en: { glossary: 'RELEVANT GLOSSARY TERMS', graphics: 'RELATED INTERACTIVE CHARTS' },
      de: { glossary: 'RELEVANTE GLOSSARBEGRIFFE', graphics: 'VERWANDTE INTERAKTIVE GRAFIKEN' },
    };
    const labels = SECTION_LABELS[locale];

    const glossaryLinks = glossaryChunks.length > 0
      ? `${labels.glossary}:\n${glossaryChunks.map(c =>
          `- [${c.heading}](${c.slug}): ${c.text.substring(0, 120)}...`
        ).join('\n')}\n\n`
      : '';

    const graphicLinks = graphicChunks.length > 0
      ? `${labels.graphics}:\n${graphicChunks.map(c =>
          `- [${c.heading}](${c.slug})`
        ).join('\n')}\n\n`
      : '';

    // ── Llamada a Groq ──
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return res.status(500).json({ error: 'API Key de Groq no configurada.' });


    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[locale] },
          { role: 'user', content: USER_PROMPT_TEMPLATES[locale](context, chapterLinks + glossaryLinks, graphicLinks, question.trim()) },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text());
      return res.status(502).json({ answer: 'El servicio de IA no está disponible. Inténtalo de nuevo.' });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No pude generar una respuesta. ¿Puedes reformular la pregunta?';
    return res.status(200).json({ answer });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res.status(500).json({ answer: 'Error interno del servidor. Por favor, inténtalo más tarde.' });
  }
};
