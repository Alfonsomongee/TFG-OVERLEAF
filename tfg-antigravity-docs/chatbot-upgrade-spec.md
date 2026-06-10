# Especificación Técnica — Upgrade Definitivo del Chatbot TFG 28-A

**Destinatario:** Asistente de código (Antigravity)
**Contexto:** He leído íntegramente `chat.js` (1437 líneas), `build-index.js` (611 líneas), `ChatWidget.jsx` (557 líneas), `ChatFullscreen.jsx` (1752 líneas), `figure-context.js`, `galeriaforensedefinitiva.json`, `chunks.json` y `search-index.json`.

**Principio rector:** El sistema ya tiene una arquitectura excelente. `buildVisualArtifacts()` con scoring semántico, `buildFollowUps()` contextual, clasificación de intent, re-ranking MMR, panel lateral con tabs y `/api/figure-context`. NO hay que rediseñar nada. Hay que desbloquear lo que ya funciona y llenar los vacíos de contenido.

**NO hacer:** No añadir `response_format: { type: 'json_object' }`. No crear `figureMatcher`. No implementar `CustomEvent`. No hacer que el LLM genere `suggestedFigures`. Todo eso ya está resuelto programáticamente y funciona.

---

## FASE 1 — Desbloquear la calidad del LLM (archivo: `api/chat.js`)

### Cambio 1.1 — Eliminar el techo de tokens

El LLM genera respuestas truncadas. `maxTokens: 380` corta la respuesta antes de completar un argumento técnico.

**Archivo:** `api/chat.js`
**Líneas 1402-1407** — Buscar:

```javascript
      llmResult = await callLLM({
        prompt,
        systemPrompt,
        temperature: 0.18,
        maxTokens: 380,
      });
```

**Reemplazar por:**

```javascript
      llmResult = await callLLM({
        prompt,
        systemPrompt,
        temperature: 0.18,
        maxTokens: 1200,
      });
```

### Cambio 1.2 — Aumentar timeouts de los providers

Con respuestas más largas, los providers necesitan más tiempo.

**Archivo:** `api/chat.js`
**Línea 113** — En `callGroq`, cambiar timeout de `6000` a `12000`:

```javascript
    6000   // ← ANTES
    12000  // ← DESPUÉS
```

**Línea 153** — En `callDeepSeek`, cambiar timeout de `9000` a `18000`:

```javascript
    9000   // ← ANTES
    18000  // ← DESPUÉS
```

### Cambio 1.3 — Reescribir el prompt del usuario

**Archivo:** `api/chat.js`
**Líneas 1347-1389** — Reemplazar el prompt COMPLETO (desde `` const prompt = ` `` hasta `` RESPUESTA:`; ``).

**Bloque antiguo a buscar (inicio):**

```javascript
    const prompt = `INSTRUCCIÓN DE RESPUESTA:
${intentInstruction}

IDIOMA: Responde en ${langName}. Máximo 220 palabras. Sin LaTeX. Sin listas salvo que el usuario las pida explícitamente.
```

**Bloque antiguo a buscar (final):**

```
PREGUNTA:
${question}

RESPUESTA:`;
```

**Reemplazar TODO ese bloque por:**

```javascript
    const prompt = `INSTRUCCIÓN DE RESPUESTA:
${intentInstruction}

IDIOMA: Responde en ${langName}. Sin LaTeX. Sin listas salvo que el usuario las pida explícitamente.

EXTENSIÓN: Adapta la longitud a la complejidad de la pregunta.
- Pregunta factual simple (dato, cifra, definición): 3-5 frases, directo.
- Pregunta técnica o causal (mecanismo, por qué): desarrolla el argumento completo sin truncar. Prioriza completar la cadena causal sobre acortar.
- Pregunta comparativa (REE vs ICAI vs ENTSO-E): desarrolla cada posición con evidencia. No resumas las tres en un párrafo.

PROHIBIDO:
- Empezar con "Según el contexto", "Basado en", "Es importante destacar", "En resumen".
- Repetir literalmente frases del CONTEXTO.
- Inventar URLs o citas no presentes en el CONTEXTO.
- Usar notación matemática ($H$, \\frac, etc.).
- Truncar una explicación causal por límite de longitud.

${visualArtifacts && visualArtifacts.length > 0 ? `RECURSO VISUAL EN EL PANEL DERECHO:
"${visualArtifacts[0].title}" — ${(visualArtifacts[0].description || '').substring(0, 150)}
→ Haz referencia a este recurso DENTRO de tu explicación (no al final).
   Indica QUÉ elemento concreto debe buscar el usuario (curva, columna, valor, timestamp) y QUÉ confirma de tu argumento.
   Ejemplo: "En el panel derecho puedes ver cómo la tensión supera 1,10 p.u. 24 segundos antes de que la frecuencia caiga — esa asimetría temporal es la firma del colapso capacitivo."
` : ''}ENLACES:
1. Usa SOLO las URLs que aparecen como [URL interna a citar] en el CONTEXTO. Conserva el #anchor íntegro.
2. Máximo 2 enlaces por respuesta, integrados naturalmente en el texto.
3. PROHIBIDO inventar URLs. Si no hay URL apropiada en el contexto, no pongas ninguna.

CIERRE:
Termina con UNA frase que formule la pregunta técnica de continuación más natural, o con la implicación más importante del argumento. Sin fórmulas como "¿quieres saber más?".

CONTEXTO RECUPERADO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA:`;
```

### Cambio 1.4 — Reforzar el system prompt

**Archivo:** `api/chat.js`
**Líneas 1391-1398** — Reemplazar:

```javascript
    const systemPrompt = `Eres el asistente pericial del TFG "Análisis Forense del Apagón Ibérico del 28-A".
Respondes ÚNICAMENTE con información del CONTEXTO proporcionado.
Eres técnico, directo y preciso. No usas LaTeX. No inventas cifras.
Si el contexto no cubre la pregunta, lo dices explícitamente.
Cifras maestras verificadas (úsalas si el contexto no especifica):
  Inicio cascada: 12:32:56.993 CEST · Nadir: 47,79 Hz · RoCoF: ~1,5 Hz/s (100 ms)
  Pérdida generación: ~15.000 MW · H_eq ibérico: 2,21–2,71 s
  Separación Francia: 12:33:21,535 CEST · Coste Op. Reforzada: 666 M€/año`;
```

**Por:**

```javascript
    const systemPrompt = `Eres el asistente pericial del TFG "Análisis Forense del Apagón Ibérico del 28-A".

IDENTIDAD: Respondes como un ingeniero eléctrico forense que ha analizado los cuatro informes primarios (Gobierno/REE, ICAI/AELEC/Compass Lexecon, ENTSO-E, NREL). Tu voz es técnica, precisa y directa — sin rodeos, sin frases hechas, sin grandilocuencia.

FUENTES: Respondes ÚNICAMENTE con información del CONTEXTO proporcionado. Si el contexto no cubre la pregunta, dilo explícitamente: "Este aspecto no está cubierto en el TFG."

ESTILO:
- No uses LaTeX ni notación matemática.
- Usa unidades con rigor (MW, MVAr, Hz, kV, s, Hz/s, p.u.).
- Cita fuentes cuando el contexto las menciona (REE, ENTSO-E, ICAI, NREL).
- Si el panel derecho muestra un recurso visual relacionado, refiérelo de forma natural en tu explicación indicando qué buscar exactamente en él.
- Párrafos cortos con conectores causales. Evita listas salvo que el usuario las pida.

CIFRAS MAESTRAS VERIFICADAS (úsalas si el contexto no especifica):
- Inicio cascada: 12:32:56.993 CEST
- Nadir frecuencial: 47,79 Hz
- RoCoF máximo: ~1,5 Hz/s (ventana 100 ms)
- Pérdida de generación en cascada: ~15.000 MW en <30 s
- H_eq ibérico ponderado: 2,21–2,71 s (zonal sur: 1,3 s)
- Separación Francia: 12:33:21,535 CEST
- Cero de tensión: 12:33:29,741 CEST
- Demanda sin suministro: ~25.200 MW (ES) + ~5.800 MW (PT)
- Personas afectadas: ~57 millones
- Reposición 99%: ~18,5 horas
- Coste Operación Reforzada: >666 M€ (10 meses)`;
```

---

## FASE 2 — Limpieza del indexador BM25 (archivo: `scripts/build-index.js`)

### Cambio 2.1 — Mejorar la limpieza JSX en `extractChunks()`

**Archivo:** `scripts/build-index.js`
**Líneas 199-228** — Reemplazar el bloque `let cleanBody = body` COMPLETO.

**Buscar (inicio exacto):**

```javascript
  let cleanBody = body
    // 2. Eliminar imports y requires
    .replace(/^import\s+.*?;?\s*$/gm, '')
```

**Buscar (final exacto):**

```javascript
    .replace(/\n{3,}/g, '\n\n')
    .normalize('NFC')
    .trim();
```

**Reemplazar por:**

```javascript
  let cleanBody = body
    // ── PASO 1: Bloques estructurales grandes (eliminar ANTES de tags sueltos) ──
    // Imports y requires
    .replace(/^import\s+.*?;?\s*$/gm, '')
    .replace(/^const\s+\w+\s*=\s*require\(.*?\).*?;?\s*$/gm, '')
    // Bloques <BrowserOnly> enteros (multilínea, non-greedy)
    .replace(/<BrowserOnly[\s\S]*?<\/BrowserOnly>/g, '')
    // Bloques JSX multilínea con require interno:
    //   {() => { const X = require(...); return (...) }}
    .replace(/\{\s*\(\)\s*=>\s*\{[\s\S]*?return\s*\([\s\S]*?\)\s*;?\s*\}\s*\}/g, '')
    // Bloques JSX multilínea con expresión directa:
    //   {() => ( <Component /> )}
    .replace(/\{\s*\(\)\s*=>\s*\([\s\S]*?\)\s*\}/g, '')
    // Bloques JSX inline: {() => <Component />} o {() => <C .../>}
    .replace(/\{\s*\(\s*\)\s*=>\s*<[A-Z][A-Za-z0-9]*\s*[^>]*(?:\/>|>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>)\s*\}/g, '')
    // Export de componentes JSX en MDX
    .replace(/export\s+const\s+[A-Za-z0-9_]+\s*=\s*(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>\s*(?:\([\s\S]*?\)|\{[\s\S]*?\})\s*;/g, '')

    // ── PASO 2: Tags React individuales ──
    // <ThemedImage .../> con props multilínea
    .replace(/<ThemedImage[\s\S]*?\/>/g, '')
    // <div style={...}> ... </div> (estilos JSX inline)
    .replace(/<div\s+style=\{[\s\S]*?\}[^>]*>[\s\S]*?<\/div>/g, '')
    // <div style={...}> sueltos (sin cierre en el mismo bloque)
    .replace(/<div\s+style=\{[^}]*\}[^>]*>/g, '')
    .replace(/<\/div>/g, '')
    // <Details>/<summary> — conservar texto interior
    .replace(/<\/?Details[^>]*>/g, '')
    .replace(/<\/?summary[^>]*>/g, '')
    // <span> con id (anchors manuales) — conservar
    .replace(/<span\s+id="[^"]*"\s*\/?>/g, '')
    .replace(/<\/span>/g, '')
    // Tags React self-closing y con apertura/cierre (PascalCase)
    .replace(/<[A-Z][A-Za-z0-9.]*\s*[^>]*\/>/g, '')
    .replace(/<[A-Z][A-Za-z0-9.]*\s*[^>]*>/g, '')
    .replace(/<\/[A-Z][A-Za-z0-9.]*>/g, '')

    // ── PASO 3: Limpieza de formato ──
    // Frontmatter YAML
    .replace(/^---[\s\S]*?---/m, '')
    // Docusaurus directives (:::note, :::tip, etc.)
    .replace(/^:::[a-z]+.*$/gm, '')
    .replace(/^:::$/gm, '')
    // Require sueltos que sobrevivieron
    .replace(/require\([^)]+\)/g, '')
    // Líneas vacías excesivas
    .replace(/\n{3,}/g, '\n\n')
    .normalize('NFC')
    .trim();
```

### Cambio 2.2 — Después de aplicar el cambio 2.1

**Acción:** Regenerar el índice ejecutando `node scripts/build-index.js`.

**Verificación obligatoria:** Comparar el chunk ID 3 (o cualquier chunk que contenía `<BrowserOnly>` o `{() => <MetamorfosisIBR />}`) antes y después. El texto debe conservar la narrativa técnica y haber eliminado todo el código React/JSX.

Si la comparación muestra que se ha perdido texto narrativo legítimo, ajustar las regex del PASO 1. Las regex del PASO 2 son seguras (solo eliminan tags PascalCase).

---

## FASE 3 — Indexar las 149 figuras faltantes de los nuevos anexos

### Cambio 3.1 — Crear el archivo de metadatos

**Acción:** Crear un script `scripts/extract-annex-figures.js` que recorra los 9 archivos de anexo (`docs/anexo-*.mdx`) y extraiga todos los elementos visuales (imágenes Markdown `![]()`, componentes `<ThemedImage>`, `<ImageGallery>`, `<AnnexThemeEvidence>`, y cualquier otro componente que renderice figuras).

**Formato de salida:** Un archivo JSON en `static/data/annex-figures-metadata.json` con esta estructura exacta:

```json
[
  {
    "id": "annex-ii-precursor-22abril",
    "title": "Episodio precursor de sobretensión del 22 de abril",
    "description": "Oscilograma del pico >430 kV que activó protecciones y desconectó plantas IBR días antes del 28-A",
    "source_file": "anexo-estabilidad-dinamica-tension.mdx",
    "annex": "anexo-ii",
    "annex_name": "Estabilidad, frecuencia y tensión",
    "type": "image",
    "url": "/anexo-estabilidad-dinamica-tension#precursor-22abril",
    "path": "/figuras/precursor_overvoltage_22april.png",
    "keywords": ["sobretensión", "precursor", "22 abril", "protecciones", "IBR"]
  }
]
```

**Reglas para generar cada entrada:**
- `id`: slug del caption o del alt text (minúsculas, guiones, sin espacios)
- `title`: el caption completo de la figura o el alt text de la imagen
- `description`: si hay texto descriptivo adyacente al componente, usar eso; si no, usar el caption
- `type`: `"image"` para `<ThemedImage>` e imágenes Markdown, `"interactive"` para componentes React con datos dinámicos, `"table"` para tablas
- `keywords`: extraer automáticamente con la función `extractKeywords()` existente
- Verificar que ningún `id` colisione con los 42 IDs existentes en `galeriaforensedefinitiva.json` ni con los IDs de `imageGalleryData.js`, `forensicCharts.js`, o `graphics-metadata.json`

**Mapa de anexos para la categoría:**

```
anexo-demanda-generacion-balance.mdx         → annex-i
anexo-estabilidad-dinamica-tension.mdx        → annex-ii
anexo-cascada-protecciones-desconexiones.mdx  → annex-iii
anexo-interconexiones-flujos.mdx              → annex-iv
anexo-mercado-costes.mdx                      → annex-v
anexo-reposicion-blackstart.mdx               → annex-vi
anexo-impacto-resiliencia.mdx                 → annex-vii
anexo-comunicacion-fuentes.mdx                → annex-viii
anexo-metodologia-modelos-datos-vivos.mdx     → annex-ix
```

### Cambio 3.2 — Inyectar las figuras en el índice BM25

**Archivo:** `scripts/build-index.js`

**Añadir esta función ANTES de `function buildIndex()` (antes de la línea 587):**

```javascript
function injectAnnexFigures() {
  const annexPath = path.join(OUTPUT_DIR, 'data', 'annex-figures-metadata.json');
  if (!fs.existsSync(annexPath)) {
    console.warn('  ⚠ No se encontró annex-figures-metadata.json');
    return;
  }

  const figures = JSON.parse(fs.readFileSync(annexPath, 'utf8'));
  let count = 0;

  figures.forEach(fig => {
    const rawText = [
      `Anexo — Figura de ${fig.annex_name}`,
      `ID: ${fig.id}`,
      `Título: ${fig.title}`,
      `Descripción: ${fig.description || fig.title}`,
      `Anexo: ${fig.annex_name}`,
      fig.path ? `Ruta: ${fig.path}` : '',
    ].filter(Boolean).join('\n').normalize('NFC');

    createChunk({
      title: `Anexo — ${fig.annex_name}`,
      heading: fig.title,
      subheading: fig.annex_name,
      rawText,
      slug: fig.url ? fig.url.split('#')[0] : `/${fig.annex}`,
      anchor: fig.url ? fig.url.split('#')[1] || fig.id : fig.id,
      chunkType: fig.type === 'table' ? 'table' : 'data_figure',
      keywords: fig.keywords || extractKeywords(rawText),
      chapterOrder: 93,
      sourceFile: fig.source_file || 'annex-figures-metadata.json',
      artifact: {
        id: fig.id,
        type: fig.type || 'image',
        source: 'annex_figures',
        title: fig.title,
        description: fig.description || fig.title,
        path: fig.path || '',
        url: fig.url || `/${fig.annex}#${fig.id}`,
        keywords: fig.keywords || [],
      }
    });
    count++;
  });
  console.log(`  → ${count} figuras de anexos indexadas.`);
}
```

**Archivo:** `scripts/build-index.js`
**Línea 595** — Añadir la llamada a `injectAnnexFigures()` en `buildIndex()`, después de `injectEntsoeCharts();`:

```javascript
function buildIndex() {
  console.log('🔍 Construyendo índice jerárquico de búsqueda para el chatbot...');
  walkDir(DOCS_DIR);
  injectMasterData();
  injectForensicTables();
  injectImageGalleryData();
  injectGlossary();
  injectGraphics();
  injectEntsoeCharts();
  injectAnnexFigures();    // ← AÑADIR AQUÍ

  miniSearch.addAll(allChunks);
  // ...
}
```

### Cambio 3.3 — Añadir boost para `annex_figures` en el scoring de artifacts

**Archivo:** `api/chat.js`
**Dentro de `scoreArtifactForQuestion()`**, los bloques de boost por intent (líneas 770-807) no cubren `source: 'annex_figures'`. Añadir después del bloque de `intent === 'general'` (después de la línea 807):

```javascript
  // Boost base para figuras de anexo — prioridad media
  if (artifact.source === 'annex_figures') {
    if (intent === 'visual')       score *= 1.8;
    if (intent === 'quantitative') score *= 1.5;
    if (intent === 'causal')       score *= 1.4;
    if (intent === 'timeline')     score *= 1.6;
    if (intent === 'comparison')   score *= 1.3;
    if (intent === 'general')      score *= 1.2;
  }
```

### Cambio 3.4 — Después de aplicar 3.1, 3.2 y 3.3

**Acción:** Regenerar el índice: `node scripts/build-index.js`

**Verificación:** El log debe mostrar un nuevo mensaje tipo `→ 149 figuras de anexos indexadas.` El número total de fragmentos indexados debe haber crecido en ~149.

---

## FASE 4 — Ajustes menores en el frontend (archivos: `ChatWidget.jsx` y `ChatFullscreen.jsx`)

### Cambio 4.1 — Mostrar followUps en el widget mini (NO solo en fullscreen)

**Archivo:** `ChatWidget.jsx`

`ChatFullscreen.jsx` ya renderiza los `followUps` como botones clicables. Pero `ChatWidget.jsx` (el widget pequeño) NO los renderiza. Los `followUps` ya llegan al estado del mensaje (línea 105), pero no se pintan.

**Verificación:** Los `followUps` YA se renderizan en el widget mini. Confirmado en las líneas 397-429 de `ChatWidget.jsx`. **No hay cambio necesario aquí.**

### Cambio 4.2 — Mejorar renderText para manejar negritas y párrafos

**Archivo:** `ChatWidget.jsx`
**Líneas 169-191** — La función `renderText` solo parsea links Markdown `[text](url)`. Con respuestas más largas del LLM, es probable que aparezcan párrafos separados por `\n\n`.

**Buscar:**

```javascript
  const renderText = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      parts.push(
        <a
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'underline' }}
          key={match.index}
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length > 0 ? parts : text;
  };
```

**Reemplazar por:**

```javascript
  const renderText = (text) => {
    if (!text) return text;
    // Separar párrafos por doble salto de línea
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length <= 1) return parseInline(text);
    return paragraphs.map((p, pIdx) => (
      <span key={pIdx}>
        {pIdx > 0 && <><br/><br/></>}
        {parseInline(p)}
      </span>
    ));
  };

  const parseInline = (text) => {
    // Parsear links Markdown: [texto](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      parts.push(
        <a
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'underline' }}
          key={`link-${match.index}`}
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length > 0 ? parts : text;
  };
```

**IMPORTANTE:** `ChatFullscreen.jsx` recibe `renderText` como prop (línea 552 de `ChatWidget.jsx`). Este cambio se propaga automáticamente al modo fullscreen.

---

## FASE 5 — Verificación final

### Tests manuales obligatorios

Ejecutar estas 6 preguntas en el chatbot y verificar que cada una cumple los criterios:

| # | Pregunta | Verificar |
|---|----------|-----------|
| 1 | `¿Qué es el Tap-Lag?` | Respuesta completa (no truncada), panel derecho muestra simulador `tap-lag-sequence`, enlaces al capítulo 3 |
| 2 | `¿En qué discrepan REE e ICAI sobre la causa del apagón?` | Respuesta que desarrolla ambas posiciones, no un resumen de 3 frases. followUps relevantes |
| 3 | `¿Cuánta demanda se perdió?` | Cifras exactas (25.200 MW ES + 5.800 MW PT), panel muestra tablas `demand-shedding-es` o `load-shedding-es-pt` |
| 4 | `Muéstrame la caída de frecuencia` | Panel muestra `FrequencyChart`, respuesta indica qué buscar en la gráfica (nadir, timestamps) |
| 5 | `¿Por qué el UFLS agravó el colapso?` | Explica la paradoja completa (desconectar carga inductiva → libera reactiva capacitiva → sube tensión → más disparos IBR) |
| 6 | `¿Qué reformas propone el TFG?` | Panel muestra `ThermalAdjustmentCostMatrix` o `RadarVulnerabilidad`, respuesta cubre GFM, BESS, mercado ERS |

### Criterios de éxito

- Ninguna respuesta truncada a mitad de argumento
- El panel derecho muestra contenido relevante en al menos 5 de 6 preguntas
- Los `followUps` son técnicamente específicos, no genéricos
- Los enlaces apuntan a URLs reales del TFG (no inventados)
- El log muestra el nuevo conteo total de chunks indexados (anterior + ~149 nuevos)

---

## Resumen de archivos modificados

| Archivo | Cambios | Fase |
|---------|---------|------|
| `api/chat.js` | maxTokens, timeouts, prompt, systemPrompt, boost annex_figures | 1, 3 |
| `scripts/build-index.js` | Regex limpieza JSX, función `injectAnnexFigures()` | 2, 3 |
| `static/data/annex-figures-metadata.json` | Archivo NUEVO (generado por script) | 3 |
| `scripts/extract-annex-figures.js` | Script NUEVO para extraer figuras de anexos | 3 |
| `src/components/ChatWidget.jsx` | `renderText` mejorado con párrafos | 4 |

## Archivos que NO se tocan

- `ChatFullscreen.jsx` — ya funciona perfectamente
- `figure-context.js` — ya funciona perfectamente
- `galeriaforensedefinitiva.json` — no se modifica (las nuevas figuras van en archivo separado)
- `imageGalleryData.js` — no se modifica
- `forensicCharts.js` — no se modifica
- `graphics-metadata.json` — no se modifica

---

**Ejecutar las fases en orden estricto: 1 → 2 → 3 → 4 → 5. No saltar fases. No combinar cambios de distintas fases en un solo commit.**
