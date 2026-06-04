const fs = require('fs');

// --- CAMBIO 1 y 2 en api/chat.js ---
let chatJs = fs.readFileSync('./api/chat.js', 'utf8');

// Cambio 1
const chatPromptRegex = /    const prompt = \`Eres el asistente pericial-documental oficial del TFG sobre el apagón ibérico del 28 de abril de 2025\.[\s\S]*?RESPUESTA DEL ASISTENTE:\`;/;
const chatPromptMatch = chatJs.match(chatPromptRegex);
if (chatPromptMatch) {
  const newPrompt = `    const prompt = \`Eres el asistente pericial-documental oficial del TFG sobre el apagón ibérico del 28 de abril de 2025.
Responde ÚNICAMENTE basándote en el CONTEXTO proporcionado.

REGLAS DE TONO Y ESTILO (OBLIGATORIAS):
1. Sé preciso, claro, técnico y natural. No seas pedante ni burocrático. No suenes robótico.
2. PROHIBIDO usar notación LaTeX o matemática ($H$, $f$, \\frac, etc.). Escribe las magnitudes en texto plano: "H = 2,3 s", "ΔP/Δt", "50 Hz". El chat no renderiza LaTeX.
3. Evita las respuestas tipo lista, a menos que el usuario pida explícitamente comparar, listar cronología o cifras. Prefiere párrafos fluidos.
4. Usa conectores lógicos ("por tanto", "la clave física fue", "esto implica", "el mecanismo raíz es").
5. NUNCA empieces con frases como "Según el contexto", "Basado en la información". Tampoco uses "es importante destacar". Ve directo al grano.
6. Si no hay información suficiente en el contexto, dilo directamente.
7. Responde siempre en \${langName}. Máximo 280 palabras.

INSTRUCCIÓN ESPECÍFICA SEGÚN LA INTENCIÓN DEL USUARIO:
\${intentInstruction}

ENLACES CONTEXTUALES EN EL CUERPO (OBLIGATORIO):
Cuando menciones un concepto técnico clave (Tap-Lag, RoCoF, UFLS, inercia, Q-V, OLTC, IBR, GFM, BESS, etc.)
que aparezca en el contexto con una URL interna, enlázalo de forma natural en la frase:
- CORRECTO: "el mecanismo [Tap-Lag](analisis-incidente#tap-lag) amplificó la sobretensión porque..."
- INCORRECTO: "el mecanismo Tap-Lag amplificó la sobretensión (ver: analisis-incidente#tap-lag)"
El enlace debe estar integrado en la frase, no al final como nota a pie.

CIERRE Y ANCLAJE DOCUMENTAL:
Cierra con una frase que:
1. Enlace a la sección más relevante del TFG con una justificación explícita de por qué ir ahí ayuda a entender mejor la respuesta. Ejemplo: "Para ver cómo evolucionó la tensión segundo a segundo durante la cascada, la [sección de análisis del incidente](analisis-incidente#cascada-ibr) reconstruye los 27 segundos con datos del WAMS."
2. Termine con una pregunta proactiva de continuación lógica.

No uses fórmulas genéricas como "¿quieres preguntar otra cosa?" ni "espero haberte ayudado".

RECURSOS VISUALES DISPONIBLES (usa esta información para orientar al usuario):
\${visualArtifacts && visualArtifacts.length > 0 ? visualArtifacts.map(a =>
  \`- [\${a.type.toUpperCase()}] "\${a.title}" — \${(a.description||'').substring(0,100)}\`
).join('\\n') : 'Ninguno disponible'}

Si hay recursos visuales listados arriba, menciona en la respuesta UNO (el más relevante)
con una frase que explique qué debe buscar el usuario en ese recurso para entender mejor
la respuesta. Ejemplo: "En el simulador de frecuencia puedes ver cómo el RoCoF superó
1,5 Hz/s en los primeros 8 segundos — observa el punto exacto donde la curva se acelera."

SUGERENCIAS CONTEXTUALES POSIBLES (elige una para el cierre):
\${followUps.map(q => \`- \${q}\`).join('\\n')}

CONTEXTO RECUPERADO:
\${context}

PREGUNTA DEL USUARIO:
\${question}

RESPUESTA DEL ASISTENTE:\`;`;
  chatJs = chatJs.replace(chatPromptMatch[0], newPrompt);
  console.log('CAMBIO 1 SUCCESS');
} else {
  console.log('CAMBIO 1 falló');
}

// Cambio 2
const boostRegex = /    if \(!chunk\.text \|\| chunk\.text\.length < 100\) score \*= 0\.7;/;
if (chatJs.match(boostRegex)) {
  chatJs = chatJs.replace(boostRegex, `    // Boost al glosario cuando la pregunta contiene términos técnicos definidos\n    if (ct === 'glossary') score *= 1.4;\n\n    if (!chunk.text || chunk.text.length < 100) score *= 0.7;`);
  console.log('CAMBIO 2 SUCCESS');
} else {
  console.log('CAMBIO 2 falló');
}

fs.writeFileSync('./api/chat.js', chatJs);


// --- CAMBIO 3 en ChatFullscreen.jsx ---
let cfJs = fs.readFileSync('./src/components/ChatFullscreen.jsx', 'utf8');
const pCaptionRegex = /          \{\/\* Leyenda \/ Fuente \*\/\}\r?\n          <p style=\{\{\r?\n            marginTop: 12,\r?\n            fontSize: 12,\r?\n            color: 'var\(--chart-text-2, #94a3b8\)',\r?\n            textAlign: 'center',\r?\n            fontStyle: 'italic',\r?\n            lineHeight: 1\.5,\r?\n            padding: '0 16px',\r?\n          \}\}>\r?\n            \{caption\}\r?\n          <\/p>/;
const pCaptionMatch = cfJs.match(pCaptionRegex);
if (pCaptionMatch) {
  const newCaption = `          {/* Leyenda / Fuente */}
          {caption && figureContexts[activeTab] !== caption && (
            <p style={{
              marginTop: 12,
              fontSize: 11,
              color: 'var(--chart-text-3, #64748b)',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.5,
              padding: '0 16px',
            }}>
              {caption}
            </p>
          )}`;
  cfJs = cfJs.replace(pCaptionMatch[0], newCaption);
  console.log('CAMBIO 3 SUCCESS');
} else {
  console.log('CAMBIO 3 falló (intentando segunda versión sin {/* Leyenda / Fuente */})');
  // Puede que el comentario no estuviera o estuviera un poco distinto. Probamos sin él
  const pCaptionRegex2 = /          <p style=\{\{\r?\n            marginTop: 12,\r?\n            fontSize: 12,\r?\n            color: 'var\(--chart-text-2, #94a3b8\)',\r?\n            textAlign: 'center',\r?\n            fontStyle: 'italic',\r?\n            lineHeight: 1\.5,\r?\n            padding: '0 16px',\r?\n          \}\}>\r?\n            \{caption\}\r?\n          <\/p>/;
  const match2 = cfJs.match(pCaptionRegex2);
  if (match2) {
    const newCaption2 = `          {caption && figureContexts[activeTab] !== caption && (
            <p style={{
              marginTop: 12,
              fontSize: 11,
              color: 'var(--chart-text-3, #64748b)',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.5,
              padding: '0 16px',
            }}>
              {caption}
            </p>
          )}`;
    cfJs = cfJs.replace(match2[0], newCaption2);
    console.log('CAMBIO 3 SUCCESS (fallback)');
  } else {
    console.log('CAMBIO 3 falló también en el fallback');
  }
}
fs.writeFileSync('./src/components/ChatFullscreen.jsx', cfJs);


// --- CAMBIO 4 en api/figure-context.js ---
if (fs.existsSync('./api/figure-context.js')) {
  let fcJs = fs.readFileSync('./api/figure-context.js', 'utf8');
  const fcPromptRegex = /  const prompt = \`Eres un experto[\s\S]*?Escribe el párrafo ahora:\`;/;
  const fcPromptMatch = fcJs.match(fcPromptRegex);
  if (fcPromptMatch) {
    const newFcPrompt = `  const prompt = \`Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.

TAREA: Escribe UN párrafo de 40-60 palabras que explique al usuario
QUÉ debe buscar en esta figura concreta para entender mejor la respuesta,
y POR QUÉ esa figura es la evidencia más directa del fenómeno descrito.

DATOS:
- Pregunta del usuario: "\${question}"
- Respuesta del asistente (extracto): "\${answer.substring(0, 400)}"
- Título de la figura: "\${figureTitle || caption}"
- Descripción técnica: "\${caption}"

REGLAS ESTRICTAS:
1. Empieza con: "Fíjate en..." / "Observa cómo..." / "Esta figura muestra directamente..." / "El dato clave aquí es..."
2. Señala UN elemento concreto y visible de la figura (una curva, un timestamp, una zona coloreada, un valor numérico).
3. Explica qué significa ese elemento en el contexto de la respuesta.
4. PROHIBIDO: describir genéricamente la figura, repetir la descripción técnica, usar "esta figura es clave porque".
5. Máximo 60 palabras. Solo el párrafo, sin comillas ni encabezados.

Ejemplo perfecto (48 palabras):
"Fíjate en el instante 12:33:21 CEST: la curva de frecuencia cae en picado mientras la tensión ya lleva 24 segundos por encima de 1,10 p.u. Ese desfase temporal es la prueba forense de que el colapso fue capacitivo, no inercial — la tensión falló primero."

Escribe el párrafo ahora:\`;`;
    fcJs = fcJs.replace(fcPromptMatch[0], newFcPrompt);
    console.log('CAMBIO 4 SUCCESS');
  } else {
    console.log('CAMBIO 4 falló');
  }
  fs.writeFileSync('./api/figure-context.js', fcJs);
} else {
  console.log('api/figure-context.js no existe');
}
