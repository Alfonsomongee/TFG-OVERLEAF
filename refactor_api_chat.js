const fs = require('fs');
const file = './tfg-antigravity-docs/api/chat.js';
let code = fs.readFileSync(file, 'utf8');

// CAMBIO 1
const pRegex = /    const prompt = `Eres el asistente pericial-documental oficial del TFG sobre el apagón ibérico del 28 de abril de 2025\.[\s\S]*?RESPUESTA DEL ASISTENTE:`;/;
const pMatch = code.match(pRegex);
if (pMatch) {
  const newPrompt = `    const prompt = \`Eres el asistente pericial-documental oficial del TFG sobre el apagón ibérico del 28 de abril de 2025.
Responde ÚNICAMENTE basándote en el CONTEXTO proporcionado.

REGLAS DE TONO Y ESTILO (OBLIGATORIAS):
1. Sé preciso, claro, técnico y natural. No seas pedante ni burocrático. No suenes robótico.
2. Evita las respuestas tipo lista, a menos que el usuario pida explícitamente comparar, listar cronología o cifras. Prefiere párrafos fluidos.
3. Usa conectores lógicos ("por tanto", "la clave física fue", "esto implica", "el mecanismo raíz es").
4. NUNCA empieces con frases como "Según el contexto", "Basado en la información". Tampoco uses "es importante destacar". Ve directo al grano.
5. Si no hay información suficiente en el contexto, dilo directamente.
6. Responde siempre en \${langName}. Máximo 280 palabras.

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
  code = code.replace(pMatch[0], newPrompt);
  console.log('CAMBIO 1 SUCCESS');
} else {
  console.log('CAMBIO 1 falló');
}

// CAMBIO 2
const scoreRegex = /  if \(intent === 'quantitative' && artifact\.type === 'table'\) score \*= 2\.0;\r?\n  if \(intent === 'comparison' && artifact\.type === 'table'\) score \*= 2\.0;\r?\n  if \(intent === 'visual' && artifact\.source === 'annex_d'\) score \*= 2\.4;\r?\n  if \(intent === 'visual' && artifact\.type === 'interactive'\) score \*= 1\.5;\r?\n  if \(intent === 'timeline' && artifact\.type === 'table'\) score \*= 1\.6;/;
const scoreMatch = code.match(scoreRegex);
if (scoreMatch) {
  const newScore = `  // ── Boosts por intent × tipo/source ───────────────────────────
  // annex_d = gráficas con datos reales ENTSO-E/ESIOS (máxima credibilidad)
  // annex_c = simuladores interactivos
  // annex_b = tablas forenses

  if (intent === 'quantitative') {
    if (artifact.type === 'table')            score *= 2.0;
    if (artifact.source === 'annex_d')        score *= 1.8;
    if (artifact.type === 'interactive')      score *= 1.3;
  }
  if (intent === 'comparison') {
    if (artifact.type === 'table')            score *= 2.0;
    if (artifact.source === 'annex_d')        score *= 1.6;
    if (artifact.type === 'interactive')      score *= 1.2;
  }
  if (intent === 'visual') {
    if (artifact.source === 'annex_d')        score *= 2.8;  // máximo peso: datos reales
    if (artifact.type === 'interactive')      score *= 1.8;
    if (artifact.type === 'table')            score *= 0.8;  // tablas menos relevantes en visual
  }
  if (intent === 'timeline') {
    if (artifact.source === 'annex_d')        score *= 2.2;  // gráficas temporales reales
    if (artifact.type === 'interactive')      score *= 2.0;
    if (artifact.type === 'table')            score *= 1.6;
  }
  if (intent === 'causal') {
    if (artifact.source === 'annex_d')        score *= 2.0;  // diagramas causales reales
    if (artifact.type === 'interactive')      score *= 1.6;
    if (artifact.type === 'table')            score *= 1.3;
  }
  if (intent === 'glossary') {
    if (artifact.type === 'interactive')      score *= 2.0;  // simular > ver tabla
    if (artifact.source === 'annex_d')        score *= 1.5;
    if (artifact.type === 'table')            score *= 1.1;
  }
  if (intent === 'general') {
    if (artifact.source === 'annex_d')        score *= 1.6;  // siempre preferir datos reales
    if (artifact.type === 'interactive')      score *= 1.3;
  }

  // Compensación por volumen: annex_c tiene solo 18 chunks vs 42 de annex_b
  if (artifact.source === 'annex_c')          score *= 1.35;

  // Boost adicional para annex_d con datos medidos directamente del 28-A
  // (identificados por IDs que contienen datos de WAMS, PMU o ENTSO-E)
  const ENTSOE_ESIOS_IDS = [
    'frequency_voltage_carmona', 'wams_oscilaciones_carmona',
    'entsoe_flow_deviation', 'heatmap_propagation', 'cascada_desconexiones',
    'tension_frecuencia_colapso', 'interconexion_francia_colapso',
    'asimetria_balance_reactiva_sur', 'fluctuaciones_tension_previas',
    'perdida_sincronismo_frontera', 'evolucion_carga_repuesta_francia',
    'recuperacion_demanda_peninsular', 'mapas_termicos_tension_ree',
    'aluvion_alertas_sobretension_sur', 'tap_lag_decoupling',
    'nunez_balboa_precursores', 'precursor_overvoltage_22april',
    'hvdc_control_transition', 'intercambio_marruecos_topdown',
    'evolucion_mix_reenergizacion', 'scr_iberia',
  ];
  if (ENTSOE_ESIOS_IDS.includes(artifact.id)) score *= 1.5;`;
  code = code.replace(scoreMatch[0], newScore);
  console.log('CAMBIO 2 SUCCESS');
} else {
  console.log('CAMBIO 2 falló');
}

fs.writeFileSync(file, code);
