// api/esios-analysis.js
// Genera un párrafo analítico que compara los valores actuales de ESIOS
// con los registrados durante el colapso del 28-A.
// Llamado desde useEsiosAnalysis.js cada vez que se actualiza el snapshot ESIOS.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { current, reference28A, metric, locale = 'es' } = req.body;
  if (!current || !reference28A || !metric) {
    return res.status(400).json({ error: 'Missing params: current, reference28A, metric' });
  }

  // ── Valores de referencia del 28-A ──────────────────────────────────────
  // Se usan para construir el prompt con contexto específico por métrica
  const METRIC_CONTEXT = {
    penetracion_renovable: {
      label28A: '82 % de penetración IBR',
      umbral_critico: 75,
      mensaje_critico: 'La penetración IBR supera el 75%: el sistema opera en una zona de inercia reducida similar a la previa al 28-A.',
      mensaje_normal: 'La penetración renovable actual está por debajo del nivel crítico registrado el 28-A (82%).',
      unidad: '%',
      campo_28A: reference28A.mix_generacion?.renovable_total_porcentaje ?? 82,
    },
    inercia_estimada: {
      label28A: 'H estimado 2,21–2,71 s',
      umbral_critico: 3.0,
      mensaje_critico: 'La inercia estimada está cerca o por debajo del mínimo registrado el 28-A (2,21–2,71 s): margen de estabilidad reducido.',
      mensaje_normal: 'La inercia estimada es superior a la del 28-A, lo que indica mayor capacidad de amortiguación ante perturbaciones.',
      unidad: 's',
      campo_28A: '2,21–2,71',
    },
    solar: {
      label28A: '~13.400 MW (53,3% del mix)',
      umbral_critico: null,
      mensaje_critico: null,
      mensaje_normal: null,
      unidad: 'MW',
      campo_28A: reference28A.mix_generacion ? Math.round(0.533 * reference28A.demanda?.peninsular_MW) : 13400,
    },
    intercambio_neto: {
      label28A: '+870 MW neto a Francia (exportador)',
      umbral_critico: null,
      mensaje_critico: null,
      mensaje_normal: null,
      unidad: 'MW',
      campo_28A: reference28A.intercambios_internacionales?.exportacion_francia_MW ?? 870,
    },
    precio_spot: {
      label28A: '18,50 €/MWh (mercado diario)',
      umbral_critico: null,
      mensaje_critico: null,
      mensaje_normal: null,
      unidad: '€/MWh',
      campo_28A: 18.50,
    },
  };

  const ctx = METRIC_CONTEXT[metric] || {
    label28A: 'valor registrado el 28-A',
    unidad: '',
    campo_28A: null,
  };

  const val28A = ctx.campo_28A;
  const valNow = current.value;
  const timestamp = current.timestamp || new Date().toISOString();

  // Delta calculado para pasar al modelo
  let deltaText = '';
  if (typeof valNow === 'number' && typeof val28A === 'number') {
    const diff = valNow - val28A;
    const pct  = val28A !== 0 ? ((diff / Math.abs(val28A)) * 100).toFixed(1) : null;
    deltaText = `Valor actual: ${valNow.toFixed(1)} ${ctx.unidad}. Valor 28-A: ${val28A} ${ctx.unidad}. Diferencia: ${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${ctx.unidad}${pct ? ` (${pct}%)` : ''}.`;
  } else {
    deltaText = `Valor actual: ${valNow} ${ctx.unidad}. Referencia 28-A: ${val28A ?? ctx.label28A}.`;
  }

  const langInstructions = {
    es: 'Responde en español.',
    en: 'Respond in English.',
    de: 'Antworte auf Deutsch.',
    'zh-Hans': '用中文回答。',
  };

  const prompt = `Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.
${langInstructions[locale] || langInstructions.es}

MÉTRICA: ${metric}
${deltaText}

CONTEXTO CRÍTICO DEL 28-A: ${ctx.label28A}
${ctx.umbral_critico ? `UMBRAL DE RIESGO: ${ctx.umbral_critico} ${ctx.unidad}` : ''}
${ctx.mensaje_critico && typeof valNow === 'number' && valNow >= ctx.umbral_critico
  ? `SITUACIÓN: ${ctx.mensaje_critico}`
  : ctx.mensaje_normal
    ? `SITUACIÓN: ${ctx.mensaje_normal}`
    : ''}

TAREA: Escribe DOS frases (45-65 palabras total) que:
1. Comparen el valor actual con el registrado el 28-A de forma concreta y técnica.
2. Evalúen qué implica esa diferencia para la seguridad y resiliencia del sistema
   en este momento, con referencia explícita al mecanismo físico del 28-A.

REGLAS:
- Menciona el valor numérico actual y el del 28-A.
- Si el valor actual es más crítico que el 28-A, indícalo con claridad pero sin alarmismo.
- Si es menos crítico, explica qué margen de seguridad adicional existe.
- PROHIBIDO: frases genéricas, referencias vagas, uso de "es importante".
- Solo las dos frases. Sin título, sin encabezado.`;

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
              content: 'Analista técnico de sistemas eléctricos de potencia. Respuestas breves, concretas y verificables.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.10,
          max_tokens: 120,
          ...(provider.key === 'DEEPSEEK_API_KEY' ? { stream: false } : {}),
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!response.ok) continue;

      const data = await response.json();
      const analysis = data.choices?.[0]?.message?.content?.trim();
      if (analysis && analysis.length > 20) {
        return res.status(200).json({
          analysis,
          metric,
          current: valNow,
          reference28A: val28A,
          timestamp,
        });
      }
    } catch {
      continue;
    }
  }

  // Fallback: análisis estático
  const fallback = `Valor actual: ${valNow} ${ctx.unidad} frente a ${val28A ?? ctx.label28A} registrado el 28-A. ${ctx.mensaje_normal || ''}`;
  return res.status(200).json({
    analysis: fallback,
    metric,
    current: valNow,
    reference28A: val28A,
    timestamp,
    fallback: true,
  });
}
