const http = require('http');

const questions = [
  // INTENCIÓN CAUSAL
  { id: 'C1', q: '¿Por qué el Tap-Lag impidió que el SCADA de REE viese la sobretensión?' },
  { id: 'C2', q: '¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?' },
  { id: 'C3', q: '¿Cómo se conectan la baja potencia de cortocircuito y los disparos ANSI 59?' },
  { id: 'C4', q: '¿Por qué la interconexión con Francia aceleró el colapso en vez de estabilizarlo?' },
  { id: 'C5', q: '¿Por qué el mercado eléctrico no valoraba la inercia el 28-A?' },

  // INTENCIÓN CUANTITATIVA
  { id: 'Q1', q: '¿Cuántos MW se perdieron en la cascada de desconexiones IBR?' },
  { id: 'Q2', q: '¿Cuál fue el RoCoF máximo registrado durante el colapso del 28-A?' },
  { id: 'Q3', q: '¿Cuánto costó la Operación Reforzada de REE?' },
  { id: 'Q4', q: '¿Cuánta potencia reactiva capacitiva se inyectaba en el sur peninsular a las 12:30 CEST?' },
  { id: 'Q5', q: '¿Cuántas unidades síncronas convencionales estaban acopladas a las 12:30 CEST?' },

  // INTENCIÓN COMPARATIVA
  { id: 'K1', q: '¿En qué discrepan REE, el Comité del Gobierno y el informe ICAI sobre la causa raíz del apagón?' },
  { id: 'K2', q: '¿Qué dice Compass Lexecon sobre la indisponibilidad de generación convencional que no dice REE?' },
  { id: 'K3', q: '¿Cómo difiere la recuperación de demanda española de la portuguesa tras el colapso?' },

  // INTENCIÓN CRONOLÓGICA / TIMELINE
  { id: 'T1', q: '¿Qué pasó en los 27 segundos entre el disparo raíz y el colapso total del sistema ibérico?' },
  { id: 'T2', q: 'Dame la cronología de los eventos del 28-A desde las 12:30 hasta las 12:35 CEST' },
  { id: 'T3', q: '¿Cuándo se separó la interconexión con Francia exactamente?' },

  // INTENCIÓN GLOSARIO
  { id: 'G1', q: '¿Qué es el SCR y por qué era crítico en el sur peninsular el 28-A?' },
  { id: 'G2', q: '¿Qué diferencia hay entre un inversor GFL y un GFM?' },
  { id: 'G3', q: '¿Qué es el efecto Ferranti y cómo contribuyó al apagón?' },
  { id: 'G4', q: '¿Qué es la inercia sintética de un BESS-GFM?' },

  // INTENCIÓN VISUAL — simuladores e interactivos
  { id: 'V1', q: 'Muéstrame el simulador del efecto Ferranti en el Anexo X' },
  { id: 'V2', q: '¿Dónde puedo ver la caída de frecuencia durante los segundos críticos del 28-A?' },
  { id: 'V3', q: 'Quiero ver el mapa de propagación de la cascada de desconexiones' },
  { id: 'V4', q: 'Muéstrame la curva P-V del colapso de tensión' },
  { id: 'V5', q: '¿Hay alguna gráfica que muestre los precios SPOT el día del apagón?' },

  // PREGUNTAS AMPLIAS / GENERALES
  { id: 'A1', q: '¿Cuál fue la causa real del apagón del 28-A de forma resumida?' },
  { id: 'A2', q: '¿Qué reformas se han implementado tras el apagón?' },
  { id: 'A3', q: '¿Cómo reaccionaron los medios de comunicación ante el apagón?' },

  // PREGUNTA QUE DEBERÍA NO ENCONTRAR NADA
  { id: 'N1', q: '¿Cuál es el precio actual de la electricidad en España?' },

  // PREGUNTA SIMPLE (modo simplificado)
  { id: 'S1', q: 'Explícame el apagón del 28-A como si tuviera 15 años' },
];

async function ask(question) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ question, locale: 'es' });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ error: 'parse error', raw: data.slice(0, 200) }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.write(body);
    req.end();
  });
}

const fs = require('fs');

async function run() {
  const lines = [];
  function log(msg = '') {
    console.log(msg);
    lines.push(msg);
  }

  for (const { id, q } of questions) {
    log('\n' + '='.repeat(70));
    log(`ID: ${id}`);
    log(`PREGUNTA: ${q}`);
    const r = await ask(q);
    log(`INTENT: ${r.intent || 'n/a'}`);
    log(`CONFIDENCE: ${r.confidence || 'n/a'}`);
    log(`RESPUESTA: ${r.answer || r.error || ''}`);
    log('FUENTES:');
    (r.sources || []).forEach(s => log(`  - ${s.url || s.slug} | ${s.heading || ''}`));
    log('VISUAL_ARTIFACTS:');
    (r.visualArtifacts || []).forEach(a => log(`  - ${a.type} | ${a.id} | ${a.title || ''} | relevance: ${a.relevance}`));
    log('FOLLOW_UPS:');
    (r.followUps || []).forEach(f => log(`  - ${f}`));
  }
  log('\n' + '='.repeat(70));
  log('DONE');

  fs.writeFileSync('chatbot-test-results.txt', lines.join('\n'), 'utf8');
  console.log('Saved to chatbot-test-results.txt');
}

run().catch(console.error);
