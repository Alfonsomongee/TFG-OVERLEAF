const http = require('http');

const questions = [
  // Causas y mecanismos técnicos
  { q: '¿Qué es el efecto Ferranti y cómo contribuyó al apagón?', locale: 'es' },
  { q: '¿Por qué el UFLS empeoró el colapso en vez de frenarlo?', locale: 'es' },
  { q: '¿Qué es el margen Q-V y por qué se agotó el 28-A?', locale: 'es' },
  { q: '¿Cómo afectó el HVDC Santa Llogaia al colapso?', locale: 'es' },
  { q: '¿Qué oscilación forzada se detectó antes del colapso y de dónde venía?', locale: 'es' },

  // Cifras y datos
  { q: '¿Cuántos MW se perdieron en la cascada de desconexiones IBR?', locale: 'es' },
  { q: '¿Cuánta carga se desconectó en España y en Portugal?', locale: 'es' },
  { q: '¿Cuál era la capacidad de interconexión con Francia y cuánto se usó?', locale: 'es' },
  { q: '¿Cuántas unidades síncronas convencionales había acopladas el 28-A?', locale: 'es' },
  { q: '¿Cuánto costó la Operación Reforzada y qué es exactamente?', locale: 'es' },

  // Comparativas institucionales
  { q: '¿Qué dice el informe ENTSO-E sobre la pérdida de sincronismo con Francia?', locale: 'es' },
  { q: '¿En qué consiste exactamente la discrepancia entre REE e ICAI sobre el P.O. 7.4?', locale: 'es' },
  { q: '¿Qué concluye Compass Lexecon sobre la responsabilidad del operador?', locale: 'es' },

  // Glosario y conceptos
  { q: '¿Qué es el RoCoF y cuál fue su valor máximo durante el colapso?', locale: 'es' },
  { q: '¿Qué diferencia hay entre un colapso de frecuencia y uno de tensión?', locale: 'es' },
  { q: '¿Qué es el Black Start y qué centrales lo intentaron el 28-A?', locale: 'es' },

  // Recuperación y futuro
  { q: '¿Por qué fallaron los primeros intentos de arranque hidroeléctrico?', locale: 'es' },
  { q: '¿Qué reformas regulatorias propone el TFG para evitar otro apagón?', locale: 'es' },

  // Preguntas en inglés (test multiidioma)
  { q: 'What was the sequence of events during the 27 critical seconds?', locale: 'en' },
  { q: 'Show me a chart of the reactive power imbalance before the blackout', locale: 'en' },
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
  for (let i = 0; i < questions.length; i++) {
    const { q, locale } = questions[i];
    console.log('═'.repeat(70));
    console.log('P' + (i+1) + ' [' + locale + ']: ' + q);
    console.log('─'.repeat(70));
    try {
      const res = await ask(q, locale);
      console.log('INTENT: ' + res.intent + ' | CONFIDENCE: ' + res.confidence);
      console.log('ANSWER: ' + (res.answer||'SIN RESPUESTA').substring(0,300));

      console.log('ARTIFACTS (' + (res.visualArtifacts||[]).length + '):');
      (res.visualArtifacts||[]).forEach((a,j) => {
        const flag = (a.source === 'annex_entsoe') ? ' ★ENTSOE' :
                     (a.source === 'annex_d') ? ' ◆PNG' :
                     (a.source === 'annex_c') ? ' ●SIM' :
                     (a.source === 'annex_b') ? ' ■TAB' : '';
        console.log('  [' + j + ']' + flag + ' ' + a.type + ':' + a.id +
          ' rel=' + a.relevance + ' | ' + (a.title||'').substring(0,55));
      });

      console.log('SOURCES TOP3:');
      (res.sources||[]).slice(0,3).forEach((s,j) => {
        console.log('  [' + j + '] ' + s.slug + '#' + s.anchor +
          ' (' + s.chunkType + ') rel=' + s.relevance);
      });
    } catch(e) {
      console.log('ERROR: ' + e.message);
    }
    console.log('');
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log('TEST COMPLETADO');
}

runTests();
