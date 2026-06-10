const fs = require('fs');

async function runTests() {
  const questions = [
    // ── Causal (mecanismo físico) ──
    "¿Qué es el Tap-Lag y cómo amplificó la sobretensión?",
    "¿Por qué el UFLS agravó el colapso en vez de frenarlo?",
    "¿Cuál fue la causa raíz del apagón del 28-A?",

    // ── Comparativo (tres visiones) ──
    "¿En qué discrepan REE e ICAI sobre la causa del apagón?",
    "¿Qué dice ENTSO-E que no dicen ni REE ni ICAI?",

    // ── Cuantitativo (cifras) ──
    "¿Cuánta demanda se perdió en España y Portugal?",
    "¿Cuánto cuesta la Operación Reforzada?",
    "¿Cuál era la inercia del sistema el día del apagón?",

    // ── Timeline (secuencia) ──
    "¿Qué pasó en los 27 segundos críticos del colapso?",
    "¿Cuál fue la secuencia de eventos desde el disparo raíz hasta el cero de tensión?",

    // ── Visual (simuladores/gráficas) ──
    "Muéstrame la caída de frecuencia durante el colapso",
    "¿Qué gráfica muestra la propagación de la cascada?",

    // ── Glosario (definiciones) ──
    "¿Qué es un inversor grid-forming?",
    "¿Qué significa SCR en el contexto del apagón?",

    // ── Interconexión y reposición ──
    "¿Qué papel jugó Francia durante el apagón y la reposición?",
    "¿Cómo funcionó el Black Start hidroeléctrico?",

    // ── Reformas y futuro ──
    "¿Qué reformas propone el TFG para evitar otro apagón?",
    "¿Por qué invertir en resiliencia es más barato que no hacer nada?",

    // ── Preguntas sobre los nuevos anexos (verifica Fase 3) ──
    "¿Qué muestran las figuras del Anexo II sobre la estabilidad dinámica?",
    "¿Qué datos tiene el Anexo IV sobre los flujos transfronterizos?"
  ];
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\n▶ Test ${i+1}/20: ${q}`);
    
    const start = Date.now();
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, locale: 'es' }),
    });
    const elapsed = Date.now() - start;
    const data = await res.json();

    results.push({
      question: q,
      elapsed_ms: elapsed,
      status: res.status,
      ...data
    });

    console.log(`  ✓ ${elapsed}ms | intent: ${data.intent} | confidence: ${data.confidence} | artifacts: ${(data.visualArtifacts||[]).length} | followUps: ${(data.followUps||[]).length}`);
  }

  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Resultados guardados en test-results.json');

  // Generar informe legible
  let report = '';
  results.forEach((r, i) => {
    report += `\n${'═'.repeat(60)}\n`;
    report += `PREGUNTA ${i+1}/20\n`;
    report += `Q: ${r.question}\n`;
    report += `INTENT: ${r.intent} | CONFIDENCE: ${r.confidence}\n`;
    report += `PROVIDER: ${r.provider || '?'} | MODEL: ${r.model || '?'} | TOKENS: ${r.tokens || '?'} | TIME: ${r.elapsed_ms}ms\n`;
    report += `\nANSWER:\n${r.answer || '[vacío]'}\n`;
    report += `\nSOURCES (${(r.sources||[]).length}):\n`;
    (r.sources||[]).slice(0,3).forEach((s,j) => {
      report += `  ${j+1}. ${s.title} → ${s.url} (rel: ${s.relevance}, type: ${s.chunkType})\n`;
    });
    report += `\nVISUAL ARTIFACTS (${(r.visualArtifacts||[]).length}):\n`;
    (r.visualArtifacts||[]).forEach((a,j) => {
      report += `  ${j+1}. [${a.type}] id: ${a.id} | "${a.title}" | source: ${a.source}\n`;
    });
    report += `\nSUGGESTED FIGURES: ${JSON.stringify(r.suggestedFigures||[])}\n`;
    report += `\nFOLLOW-UPS:\n`;
    (r.followUps||[]).forEach((f,j) => { report += `  ${j+1}. ${f}\n`; });
    report += `\nRELATED CHAPTERS: ${JSON.stringify(r.relatedChapters||[])}\n`;
  });

  fs.writeFileSync('test-report.txt', report);
  console.log('📄 Informe legible guardado en test-report.txt');
}

runTests().catch(console.error);
