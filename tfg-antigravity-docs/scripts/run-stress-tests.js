const fs = require('fs');

async function runTests() {
  const questions = [
    // ── Cruce de conceptos (el LLM tiene que sintetizar de varios chunks) ──
    "Si el sistema hubiera tenido inversores grid-forming el 28-A, ¿se habría evitado el Tap-Lag?",
    "¿Qué relación hay entre el SCR, la potencia de cortocircuito y la decisión de mallado de REE?",
    "Compara la velocidad del colapso del 28-A con el de South Australia 2016 y el de UK 2019",

    // ── Preguntas trampa (información que NO está en el TFG) ──
    "¿Cuál fue el papel de Iberdrola en el apagón?",
    "¿Qué dice el informe de la CNMC sobre las responsabilidades?",

    // ── Ambigüedad de intent (¿visual? ¿causal? ¿cuantitativo?) ──
    "¿Cuántos MVAr de reactiva capacitiva sobraban cuando se produjo el mallado?",
    "Enséñame los datos de tensión en Carmona durante la Fase 2",

    // ── Queries ultra-cortas (test de longitud mínima y acrónimos) ──
    "HVDC",
    "P.O. 7.4",
    "RoCoF",

    // ── Preguntas sobre los nuevos anexos (verifica Fase 3 en profundidad) ──
    "¿Qué figuras tiene el Anexo III sobre la cascada de protecciones?",
    "¿Qué muestra el Anexo VI sobre la estrategia de reposición?",

    // ── Preguntas largas y enrevesadas (test de robustez del parser) ──
    "Teniendo en cuenta que REE argumenta que los generadores incumplieron el P.O. 7.4 y que ICAI contraargumenta que el mallado fue la causa directa de la saturación capacitiva, ¿es posible que ambos tengan razón simultáneamente y que el TFG lo reconozca?",

    // ── Idioma diferente (test i18n) ──
    "What was the role of the HVDC link with France during the collapse?",

    // ── Pregunta existencial / fuera de scope ──
    "¿Podría un apagón como el del 28-A provocar una crisis política en España?"
  ];
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\n▶ Test ${i+1}/${questions.length}: ${q}`);
    
    const start = Date.now();
    try {
      const res = await fetch('http://127.0.0.1:3000/api/chat', {
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
    } catch (err) {
      console.log(`  ❌ ERROR: ${err.message}`);
    }
  }

  fs.writeFileSync('stress-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Resultados guardados en stress-test-results.json');

  // Generar informe legible
  let report = '';
  results.forEach((r, i) => {
    report += `\n${'═'.repeat(60)}\n`;
    report += `PREGUNTA ${i+1}/${questions.length}\n`;
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

  fs.writeFileSync('stress-test-report.txt', report);
  console.log('📄 Informe legible guardado en stress-test-report.txt');
}

runTests().catch(console.error);
