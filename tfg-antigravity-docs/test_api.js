const http = require('http');

const questions = [
  { q: '¿Cuál fue la causa raíz del apagón del 28-A?', locale: 'es' },
  { q: '¿Qué papel jugó el efecto Tap-Lag en el colapso?', locale: 'es' },
  { q: '¿Cuánto valía la frecuencia en el nadir y en cuántos segundos cayó?', locale: 'es' },
  { q: 'Muéstrame una gráfica de la caída de frecuencia', locale: 'es' },
  { q: '¿Cuál era el mix de generación a las 12:30 del 28-A?', locale: 'es' },
  { q: '¿En qué discrepan REE, ICAI y ENTSO-E sobre la causa del apagón?', locale: 'es' },
  { q: '¿Qué es un inversor grid-forming y por qué habría ayudado?', locale: 'es' },
  { q: '¿Cómo fue la recuperación del suministro en España y Portugal?', locale: 'es' },
  { q: '¿Cuál fue el impacto económico del apagón?', locale: 'es' },
  { q: '¿Qué pasó con los precios de la electricidad el día del apagón?', locale: 'es' },
];

function ask(question, locale) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ question, locale, mode: 'normal' });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ error: 'parse error', raw: data.substring(0,200) }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  // Arrancar servidor local primero
  console.log('Asegúrate de que el servidor local está corriendo con: npx vercel dev');
  console.log('Esperando 2s...\n');
  await new Promise(r => setTimeout(r, 2000));

  for (let i = 0; i < questions.length; i++) {
    const { q, locale } = questions[i];
    console.log('═'.repeat(70));
    console.log('PREGUNTA ' + (i+1) + ': ' + q);
    console.log('═'.repeat(70));
    try {
      const res = await ask(q, locale);
      console.log('RESPUESTA:');
      console.log(res.answer || 'SIN RESPUESTA');
      console.log('\nINTENT: ' + res.intent);
      console.log('CONFIDENCE: ' + res.confidence);
      console.log('PROVIDER: ' + (res.provider || 'unknown'));
      console.log('\nVISUAL ARTIFACTS (' + (res.visualArtifacts||[]).length + '):');
      (res.visualArtifacts||[]).forEach((a,j) => {
        console.log('  [' + j + '] type=' + a.type + ' source=' + a.source +
          ' id=' + a.id + ' relevance=' + a.relevance);
        console.log('      title: ' + (a.title||'').substring(0,70));
      });
      console.log('\nSOURCES (' + (res.sources||[]).length + '):');
      (res.sources||[]).forEach((s,j) => {
        console.log('  [' + j + '] ' + s.slug + '#' + s.anchor +
          ' (' + s.chunkType + ') relevance=' + s.relevance);
      });
      if (res.followUps?.length) {
        console.log('\nFOLLOW-UPS:');
        res.followUps.forEach(f => console.log('  - ' + f));
      }
    } catch(e) {
      console.log('ERROR: ' + e.message);
    }
    console.log('');
    await new Promise(r => setTimeout(r, 1500));
  }
}

runTests();
