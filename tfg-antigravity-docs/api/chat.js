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
- Responde directamente en español sin frases como "Según el contexto" o "Basado en el contexto".
- No uses negritas ni asteriscos en el cuerpo del texto.
- Si la respuesta incluye cifras, cita la fuente entre paréntesis: (REE), (ENTSO-E), (ICAI), etc.
- Si el contexto incluye un slug de capítulo, añade al final: "Más información: [Ver capítulo](/ruta)"
- Si hay términos técnicos relevantes en el glosario, añádelos al final como: "Ver en el glosario: [TÉRMINO](/glosario#término)"
- Si hay gráficas interactivas relacionadas, añádelas al final como: "Gráfica interactiva: [TÍTULO](/ruta#anchor)"
- Si la información no está en el contexto, di exactamente: "Este detalle no aparece en el TFG. Consulta el glosario o los capítulos técnicos."
- Máximo 250 palabras.

${glossaryLinks}${graphicLinks}
CONTEXTO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA:`,

  en: (context, glossaryLinks, graphicLinks, question) => `INSTRUCTIONS:
- Answer directly in English without phrases like "According to the context" or "Based on the context".
- Do not use bold or asterisks in the body of the text.
- If the answer includes figures, cite the source in parentheses: (REE), (ENTSO-E), (ICAI), etc.
- If the context includes a chapter slug, add at the end: "More info: [See chapter](/path)"
- If there are relevant technical terms in the glossary, add them at the end as: "See in glossary: [TERM](/glossary#term)"
- If there are related interactive charts, add them at the end as: "Interactive chart: [TITLE](/path#anchor)"
- If the information is not in the context, say exactly: "This detail does not appear in the thesis. Check the glossary or the technical chapters."
- Maximum 250 words.

${glossaryLinks}${graphicLinks}
THESIS CONTEXT:
${context}

QUESTION:
${question}

ANSWER:`,

  de: (context, glossaryLinks, graphicLinks, question) => `ANWEISUNGEN:
- Antworte direkt auf Deutsch ohne Phrasen wie „Laut Kontext" oder „Basierend auf dem Kontext".
- Verwende keine Fettschrift oder Sternchen im Fließtext.
- Wenn die Antwort Zahlen enthält, zitiere die Quelle in Klammern: (REE), (ENTSO-E), (ICAI) usw.
- Wenn der Kontext einen Kapitel-Slug enthält, füge am Ende hinzu: „Mehr Infos: [Kapitel ansehen](/pfad)"
- Wenn relevante Fachbegriffe im Glossar vorhanden sind, füge sie am Ende hinzu: „Im Glossar: [BEGRIFF](/glossar#begriff)"
- Wenn verwandte interaktive Grafiken vorhanden sind, füge sie am Ende hinzu: „Interaktive Grafik: [TITEL](/pfad#anker)"
- Wenn die Information nicht im Kontext vorhanden ist, sage genau: „Dieses Detail erscheint nicht in der Abschlussarbeit. Bitte Glossar oder technische Kapitel konsultieren."
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
    const top = results.slice(0, 10).map(r => allChunks[r.id]);
    const contentChunks = top.filter(c => !c.isGlossary && !c.isGraphic).slice(0, 5);
    const glossaryChunks = top.filter(c => c.isGlossary).slice(0, 3);
    const graphicChunks = top.filter(c => c.isGraphic).slice(0, 2);

    // ── Construir contexto de contenido ──
    const context = contentChunks
      .map(c => `## ${c.title} – ${c.heading}\nRuta: ${c.slug}\n${c.text}`)
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
          { role: 'user', content: USER_PROMPT_TEMPLATES[locale](context, glossaryLinks, graphicLinks, question.trim()) },
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
