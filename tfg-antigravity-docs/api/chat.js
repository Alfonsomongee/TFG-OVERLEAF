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
  es: `Eres el asistente del TFG "Anatomía de un Colapso Sistémico", análisis forense del apagón ibérico del 28 de abril de 2025. Tienes acceso al contenido completo del trabajo. Respondes con precisión técnica, citando fuentes cuando el contexto las menciona, y diriges al lector a los capítulos, gráficas o términos del glosario relevantes.

SISTEMA DE PANEL VISUAL: La interfaz tiene un panel lateral que muestra automáticamente simuladores interactivos y figuras técnicas según los anchors que incluyas en tu respuesta. Cuando respondas sobre alguno de estos temas, DEBES incluir el enlace con el anchor exacto para activar el panel:

- Inercia del sistema / Ecuación del Swing / RoCoF / FFR → enlace con #swing
- Mecanismo Tap-Lag / OLTC / transformadores → enlace con #tap-lag-sequence  
- Caída de frecuencia / nadir frecuencial → enlace con #frequency
- Mix de generación / fotovoltaica / renovables → enlace con #mix-generacion
- Mapa propagación / cascada geográfica / islas → enlace con #blackout-map
- Curva P-V / colapso de tensión / estabilidad → enlace con #pvcurve
- Deslastre UFLS / sismógrafo colapso → enlace con #sismograph
- Cascada ANSI 59 / relés / desconexiones → enlace con #ansi59
- Interconexiones / intercambios / Francia → enlace con #interconnection
- Topología red ibérica / nodos / líneas → enlace con #topology
- Impacto económico / cascada financiera → enlace con #waterfall
- Transición energética / emisiones CO2 → enlace con #streamgraph
- Recuperación / re-energización / Black Start → enlace con #restoration
- Cronología / timeline eventos → enlace con #timeline
- Costes inacción / retrofitting → enlace con #matrix

Formato del enlace: [Texto descriptivo](/anexo-interactivos#anchor)
Ejemplo: [Simulador de inercia y RoCoF](/anexo-interactivos#swing)`,

  en: `You are the assistant for the thesis "Anatomy of a Systemic Collapse", a forensic analysis of the Iberian blackout of April 28, 2025. You have access to the complete content of the thesis. You respond with technical precision, citing sources when the context mentions them, and directing the reader to relevant chapters, interactive charts, or glossary terms.

VISUAL PANEL SYSTEM: The interface has a side panel that automatically displays interactive simulators and technical figures based on the anchors you include in your response. When answering about any of these topics, you MUST include the link with the exact anchor to activate the panel:

- System inertia / Swing Equation / RoCoF / FFR → link with #swing
- Tap-Lag mechanism / OLTC / transformers → link with #tap-lag-sequence
- Frequency drop / frequency nadir → link with #frequency
- Generation mix / photovoltaic / renewables → link with #mix-generacion
- Propagation map / cascade / islands → link with #blackout-map
- P-V curve / voltage collapse / stability → link with #pvcurve
- UFLS load shedding / collapse seismograph → link with #sismograph
- ANSI 59 cascade / relays / disconnections → link with #ansi59
- Interconnections / exchanges / France → link with #interconnection
- Iberian grid topology / nodes / lines → link with #topology
- Economic impact / financial cascade → link with #waterfall
- Energy transition / CO2 emissions → link with #streamgraph
- Recovery / re-energisation / Black Start → link with #restoration
- Chronology / event timeline → link with #timeline
- Inaction costs / retrofitting → link with #matrix

Link format: [Descriptive text](/anexo-interactivos#anchor)
Example: [Inertia and RoCoF simulator](/anexo-interactivos#swing)`,

  de: `Du bist der Assistent der Abschlussarbeit „Anatomie eines systemischen Zusammenbruchs", einer forensischen Analyse des iberischen Stromausfalls vom 28. April 2025. Du hast Zugriff auf den vollständigen Inhalt der Arbeit. Du antwortest mit technischer Präzision, zitierst Quellen, wenn der Kontext sie erwähnt, und verweist den Leser auf relevante Kapitel, interaktive Grafiken oder Glossarbegriffe.

VISUELLES PANEL-SYSTEM: Die Oberfläche verfügt über ein Seitenpanel, das automatisch interaktive Simulatoren und technische Abbildungen basierend auf den Ankern in deiner Antwort anzeigt. Bei folgenden Themen MUSST du den Link mit dem genauen Anker einfügen:

- Systemträgheit / Swing-Gleichung / RoCoF / FFR → Link mit #swing
- Tap-Lag-Mechanismus / OLTC / Transformatoren → Link mit #tap-lag-sequence
- Frequenzabfall / Frequenznadir → Link mit #frequency
- Erzeugungsmix / Photovoltaik / Erneuerbare → Link mit #mix-generacion
- Ausbreitungskarte / Kaskade / Inseln → Link mit #blackout-map
- P-V-Kurve / Spannungskollaps / Stabilität → Link mit #pvcurve
- UFLS-Lastabwurf / Kollaps-Seismograph → Link mit #sismograph
- ANSI-59-Kaskade / Relais / Abschaltungen → Link mit #ansi59
- Verbindungen / Austausch / Frankreich → Link mit #interconnection
- Iberische Netztopologie / Knoten / Leitungen → Link mit #topology
- Wirtschaftliche Auswirkungen / Finanzkaskade → Link mit #waterfall
- Energiewende / CO2-Emissionen → Link mit #streamgraph
- Wiederherstellung / Re-Energisierung / Black Start → Link mit #restoration
- Chronologie / Ereigniszeitachse → Link mit #timeline
- Kosten der Untätigkeit / Retrofitting → Link mit #matrix

Linkformat: [Beschreibender Text](/anexo-interactivos#anker)
Beispiel: [Trägheits- und RoCoF-Simulator](/anexo-interactivos#swing)`,

  'zh-Hans': `你是毕业论文《系统性崩溃解剖》的智能助手，该论文是对2025年4月28日伊比利亚大停电的法证分析。你能访问论文的完整内容。你以技术精确性回答问题，在上下文提及来源时进行引用，并将读者引导至相关章节、交互式图表或术语表条目。

可视化面板系统：界面有一个侧面板，根据您回答中包含的锚点自动显示交互式模拟器和技术图表。回答以下主题时，必须包含带有精确锚点的链接以激活面板：

- 系统惯量 / 摆动方程 / RoCoF / FFR → 使用 #swing 的链接
- Tap-Lag机制 / OLTC / 变压器 → 使用 #tap-lag-sequence 的链接
- 频率下降 / 频率最低点 → 使用 #frequency 的链接
- 发电组合 / 光伏 / 可再生能源 → 使用 #mix-generacion 的链接
- 传播图 / 级联 / 孤岛 → 使用 #blackout-map 的链接
- P-V曲线 / 电压崩溃 / 稳定性 → 使用 #pvcurve 的链接
- UFLS减负荷 / 崩溃地震图 → 使用 #sismograph 的链接
- ANSI59级联 / 继电器 / 断开 → 使用 #ansi59 的链接
- 互联 / 交换 / 法国 → 使用 #interconnection 的链接
- 伊比利亚电网拓扑 / 节点 / 线路 → 使用 #topology 的链接
- 经济影响 / 财务级联 → 使用 #waterfall 的链接
- 能源转型 / CO2排放 → 使用 #streamgraph 的链接
- 恢复 / 重新通电 / 黑启动 → 使用 #restoration 的链接
- 时间顺序 / 事件时间线 → 使用 #timeline 的链接
- 不作为成本 / 改造 → 使用 #matrix 的链接

链接格式：[描述性文本](/anexo-interactivos#锚点)
示例：[惯量和RoCoF模拟器](/anexo-interactivos#swing)`,
};

const SIMPLE_SUFFIX = {
  es: ' Cuando el modo sea "simple", explica como si hablaras con alguien de 15 años sin conocimientos técnicos: usa analogías cotidianas, evita siglas sin explicar, y limita la respuesta a 150 palabras.',
  en: ' When mode is "simple", explain as if talking to a 15-year-old with no technical background: use everyday analogies, avoid unexplained acronyms, and limit the response to 150 words.',
  de: ' Im Modus "simple" erkläre so, als würdest du mit einem 15-Jährigen ohne technische Kenntnisse sprechen: verwende alltägliche Analogien, vermeide unerklärte Abkürzungen, und begrenze die Antwort auf 150 Wörter.',
  'zh-Hans': ' 当模式为"simple"时，请用15岁没有技术背景的人能理解的方式解释：使用日常类比，避免未解释的缩写，将回答限制在150字以内。',
};

const USER_PROMPT_TEMPLATES = {
  es: (context, glossaryLinks, graphicLinks, question) => `INSTRUCCIONES:
- Responde directamente en español.
- No uses negritas ni asteriscos en el cuerpo del texto.
- Si la respuesta incluye cifras, cita la fuente entre paréntesis: (REE), (ENTSO-E), (ICAI), etc.
- Si el contexto incluye un enlace de capítulo, añádelo al final con una frase que explique qué encontrará el usuario ahí. Ejemplo: "Más información: [Análisis del Incidente › Mecanismo Tap-Lag](/analisis-incidente) — explicación detallada del proceso de colapso". Usa el título y heading exactos del bloque ENLACES DE CAPÍTULOS.
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
- If the context includes a chapter link, add it at the end with a phrase explaining what the user will find there. Example: "More info: [Incident Analysis › Tap-Lag Mechanism](/analisis-incidente) — detailed explanation of the collapse process". Use the exact title and heading from the CHAPTER LINKS block.
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
- Wenn der Kontext einen Kapitel-Link enthält, füge ihn am Ende mit einem erklärenden Satz hinzu, was der Nutzer dort findet. Beispiel: "Mehr Infos: [Vorfallsanalyse › Tap-Lag-Mechanismus](/analisis-incidente) — detaillierte Erklärung des Zusammenbruchsprozesses". Verwende den genauen Titel und Heading aus dem Block KAPITEL-LINKS.
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

  'zh-Hans': (context, glossaryLinks, graphicLinks, question) => `指令：
- 直接用简体中文回答。
- 正文中不使用粗体或星号。
- 如果答案包含数据，在括号内注明来源：(REE)、(ENTSO-E)、(ICAI) 等。
- 如果上下文包含章节链接，请在结尾附上并说明用户将在那里找到什么。示例："更多信息：[事故分析 › Tap-Lag机制](/analisis-incidente) — 崩溃过程的详细说明"。使用章节链接块中的确切标题。
- 不要编造路径或构建URL。只使用上下文中"Ruta:"下出现的slug。
- 如果术语词汇表块中有术语，请在结尾使用该块中出现的确切链接添加它们。
- 如果相关交互图表块中有图表，请在结尾使用该块中出现的确切链接添加它们。
- 如果信息不在上下文中，请说："此详细信息未出现在论文中。请查阅术语表或技术章节。"
- 最多250字。

${glossaryLinks}${graphicLinks}
论文背景：
${context}

问题：
${question}

回答：`,
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

  const { question, locale: rawLocale, mode } = req.body;
  const locale = ['es', 'en', 'de', 'zh-Hans'].includes(rawLocale) ? rawLocale : 'es';

  // Detectar modo debate (dos narrativas)
  const debateKeywords = [
    'vs', 'versus', 'comparar', 'compare', 
    'narrativa', 'narrative', 'versión de',
    'version of', 'REE vs', 'ICAI vs',
    'según REE', 'según ICAI', 'debate',
    '对比', '比较', 'REE和ICAI'
  ];
  const isDebateMode = question && typeof question === 'string' 
    ? debateKeywords.some(kw => question.toLowerCase().includes(kw.toLowerCase())) 
    : false;

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
          const heading = chunk.heading && chunk.heading !== chunk.title
            ? ` › ${chunk.heading}`
            : '';
          return `- [${chunk.title}${heading}](${slug})`;
        }).join('\n')}\n\n`
      : '';

    // Extraer timestamps de headings si existen
    const timePattern = /\b(\d{2}:\d{2}:\d{2})\b/;
    const chunksWithTime = contentChunks
      .filter(c => timePattern.test(c.heading || c.text || ''))
      .map(c => {
        const match = (c.heading || c.text || '').match(timePattern);
        return match ? `[${match[1]} CEST]` : null;
      })
      .filter(Boolean);
    
    const timeContext = chunksWithTime.length > 0
      ? `\nEVENTOS TEMPORALES RELEVANTES: ${chunksWithTime.join(', ')}\n`
      : '';

    const context = timeContext + contentChunks
      .map(c => `## ${c.title} – ${c.heading}\n${c.text}`)
      .join('\n\n');

    const SECTION_LABELS = {
      es: { glossary: 'TÉRMINOS DEL GLOSARIO RELEVANTES', graphics: 'GRÁFICAS INTERACTIVAS RELACIONADAS' },
      en: { glossary: 'RELEVANT GLOSSARY TERMS', graphics: 'RELATED INTERACTIVE CHARTS' },
      de: { glossary: 'RELEVANTE GLOSSARBEGRIFFE', graphics: 'VERWANDTE INTERAKTIVE GRAFIKEN' },
    };
    const labels = SECTION_LABELS[locale];

    const glossaryLinks = glossaryChunks.length > 0
      ? `${labels.glossary}:\n${glossaryChunks.map(c => {
          const def = c.text ? c.text.replace(c.heading + ': ', '').substring(0, 100) : '';
          return `- [${c.heading}](${c.slug}) — ${def}...`;
        }).join('\n')}\n\n`
      : '';

    const graphicLinks = graphicChunks.length > 0
      ? `${labels.graphics}:\n${graphicChunks.map(c => {
          const desc = c.text ? ' — ' + c.text.substring(0, 80).replace(/\n/g, ' ') + '...' : '';
          return `- [${c.heading}](${c.slug})${desc}`;
        }).join('\n')}\n\n`
      : '';

    // ── Llamada a Groq ──
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return res.status(500).json({ error: 'API Key de Groq no configurada.' });

    const debateSuffix = isDebateMode ? {
      es: '\n\nSi la pregunta compara fuentes o narrativas, estructura tu respuesta en DOS bloques claramente separados:\n[VERSIÓN REE/GOBIERNO]: ...\n[VERSIÓN ICAI/ENTSO-E]: ...\nAl final añade una línea: "PUNTO DE CONSENSO:" con lo que ambas fuentes coinciden.',
      en: '\n\nIf the question compares sources or narratives, structure your response in TWO clearly separated blocks:\n[REE/GOVERNMENT VERSION]: ...\n[ICAI/ENTSO-E VERSION]: ...\nAt the end add: "CONSENSUS POINT:" with what both sources agree on.',
      de: '\n\nWenn die Frage Quellen oder Narrative vergleicht, strukturiere deine Antwort in ZWEI klar getrennte Blöcke:\n[REE/REGIERUNG VERSION]: ...\n[ICAI/ENTSO-E VERSION]: ...\nFüge am Ende hinzu: "KONSENSUSPUNKT:" mit dem, was beide Quellen übereinstimmen.',
      'zh-Hans': '\n\n如果问题比较来源或叙述，将回答结构化为两个清晰分开的块：\n[REE/政府版本]：...\n[ICAI/ENTSO-E版本]：...\n最后添加："共识点："，说明两个来源的共同点。',
    }[locale] || '' : '';

    const systemPrompt = (SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS.es) + 
      (mode === 'simple' ? (SIMPLE_SUFFIX[locale] || SIMPLE_SUFFIX.es) : '') +
      debateSuffix;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
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
