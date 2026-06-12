const http = require('http');
const fs = require('fs');

const questions = [
  // ── CAUSAL (20) ────────────────────────────────────────────────────────
  { id:'C01', q:'¿Por qué el Tap-Lag impidió que el SCADA de REE viese la sobretensión?' },
  { id:'C02', q:'¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?' },
  { id:'C03', q:'¿Cómo se conectan la baja potencia de cortocircuito y los disparos ANSI 59?' },
  { id:'C04', q:'¿Por qué la interconexión con Francia aceleró el colapso en vez de estabilizarlo?' },
  { id:'C05', q:'¿Por qué el mercado eléctrico no valoraba la inercia el 28-A?' },
  { id:'C06', q:'¿Por qué REE decidió mallar la red a pesar de la baja potencia de cortocircuito?' },
  { id:'C07', q:'¿Cómo amplificó el efecto Ferranti la sobretensión en la red colectora?' },
  { id:'C08', q:'¿Por qué los inversores GFL son intrínsecamente inestables con SCR bajo?' },
  { id:'C09', q:'¿Cuál fue el mecanismo exacto que hizo invisible la sobretensión al despacho nacional?' },
  { id:'C10', q:'¿Por qué el HVDC INELFE-1 extrajo potencia del sistema ibérico durante la cascada?' },
  { id:'C11', q:'¿Por qué las protecciones ANSI 59 no fueron el fallo sino la consecuencia?' },
  { id:'C12', q:'¿Qué relación hay entre el mallado de líneas en vacío y la reactiva capacitiva?' },
  { id:'C13', q:'¿Por qué la baja inercia aceleró la caída de frecuencia pero no fue la causa raíz?' },
  { id:'C14', q:'¿Cómo contribuyó la oscilación de 0,63 Hz detectada antes del colapso?' },
  { id:'C15', q:'¿Por qué Portugal colapsó aunque no tuvo problemas propios de generación?' },
  { id:'C16', q:'¿Cómo se retroalimentó la cascada: cada desconexión IBR provocaba más desconexiones?' },
  { id:'C17', q:'¿Por qué el sistema pasó de estado Normal a Blackout sin pasar por Alerta?' },
  { id:'C18', q:'¿Qué papel jugó la exportación masiva a Francia y Portugal en la fragilidad del sistema?' },
  { id:'C19', q:'¿Por qué el colapso del 28-A fue un evento de tensión y no de frecuencia?' },
  { id:'C20', q:'¿Cómo afectó la banda muerta del P.O. 7.4 a la respuesta de los inversores ante sobretensiones?' },

  // ── CUANTITATIVA (20) ──────────────────────────────────────────────────
  { id:'Q01', q:'¿Cuántos MW se perdieron en la cascada de desconexiones IBR?' },
  { id:'Q02', q:'¿Cuál fue el RoCoF máximo registrado durante el colapso del 28-A?' },
  { id:'Q03', q:'¿Cuánto costó la Operación Reforzada de REE?' },
  { id:'Q04', q:'¿Cuánta potencia reactiva capacitiva se inyectaba en el sur peninsular a las 12:30 CEST?' },
  { id:'Q05', q:'¿Cuántas unidades síncronas convencionales estaban acopladas a las 12:30 CEST?' },
  { id:'Q06', q:'¿Cuántas personas se quedaron sin electricidad el 28-A?' },
  { id:'Q07', q:'¿Cuánto tiempo tardó en recuperarse el 99% de la demanda peninsular?' },
  { id:'Q08', q:'¿Cuál fue la frecuencia mínima registrada durante el colapso?' },
  { id:'Q09', q:'¿Cuántos MW exportaba España a Francia y Portugal en el momento del colapso?' },
  { id:'Q10', q:'¿Cuánto es la inercia equivalente del sistema ibérico el 28-A en segundos?' },
  { id:'Q11', q:'¿Cuál fue el SCR en los nudos del sur peninsular el 28-A?' },
  { id:'Q12', q:'¿Qué porcentaje del mix era generación IBR a las 12:30 CEST?' },
  { id:'Q13', q:'¿Cuántos MW fue el disparo raíz inicial en Granada?' },
  { id:'Q14', q:'¿Cuál es el impacto económico estimado total del apagón del 28-A?' },
  { id:'Q15', q:'¿Cuántos MVAr intentó importar el sistema ibérico de Francia en el momento crítico?' },
  { id:'Q16', q:'¿Cuántos escalones UFLS se activaron y en qué intervalo de frecuencia?' },
  { id:'Q17', q:'¿En cuántos segundos se perdieron los 15.000 MW de la cascada?' },
  { id:'Q18', q:'¿Cuánto es la energía cinética total del sistema ibérico en el momento del colapso?' },
  { id:'Q19', q:'¿Qué porcentaje de la capacidad instalada tenía España en interconexiones transfronterizas?' },
  { id:'Q20', q:'¿Cuántas centrales de Black Start había disponibles para la reposición?' },

  // ── COMPARATIVA / DISCREPANCIAS (10) ───────────────────────────────────
  { id:'K01', q:'¿En qué discrepan REE, el Comité del Gobierno y el informe ICAI sobre la causa raíz del apagón?' },
  { id:'K02', q:'¿Qué dice Compass Lexecon sobre la indisponibilidad de generación convencional que no dice REE?' },
  { id:'K03', q:'¿Cómo difiere la recuperación de demanda española de la portuguesa tras el colapso?' },
  { id:'K04', q:'¿Qué diferencia fundamental hay entre el 28-A y el apagón de South Australia de 2016?' },
  { id:'K05', q:'¿Cómo se compara el tiempo de reposición del 28-A con el apagón del noreste de EE.UU. de 2003?' },
  { id:'K06', q:'¿En qué difieren REE y el Comité sobre la cantidad de potencia síncrona indisponible el 28-A?' },
  { id:'K07', q:'¿Cómo interpretan de forma distinta la oscilación de 0,63 Hz REE y el informe de ICAI?' },
  { id:'K08', q:'¿Qué posición tiene ENTSO-E sobre la decisión de mallado de REE que difiere de la española?' },
  { id:'K09', q:'¿Qué dice el informe de NREL que no mencionan los informes europeos?' },
  { id:'K10', q:'¿Cómo difiere el análisis del HVDC entre el informe del Comité y el de Compass Lexecon?' },

  // ── CRONOLÓGICA / TIMELINE (10) ────────────────────────────────────────
  { id:'T01', q:'¿Qué pasó en los 27 segundos entre el disparo raíz y el colapso total del sistema ibérico?' },
  { id:'T02', q:'Dame la cronología de los eventos del 28-A desde las 12:30 hasta las 12:35 CEST' },
  { id:'T03', q:'¿Cuándo se separó la interconexión con Francia exactamente?' },
  { id:'T04', q:'¿Cuándo empezó realmente la vulnerabilidad del sistema, días antes del 28-A?' },
  { id:'T05', q:'¿Qué ocurrió el 22 de abril de 2025 que fue un precursor del apagón?' },
  { id:'T06', q:'¿En qué orden se dispararon las protecciones durante la cascada del 28-A?' },
  { id:'T07', q:'¿Cuándo se restableció el suministro en Madrid, Barcelona y Lisboa?' },
  { id:'T08', q:'¿Qué hizo REE entre las 12:33 y las 14:00 CEST para intentar restablecer el sistema?' },
  { id:'T09', q:'¿Cuándo se activó el modo PMODE1 del HVDC INELFE-1 y por qué?' },
  { id:'T10', q:'¿Cuál fue la secuencia exacta de disparos en el suroeste peninsular en los primeros 20 segundos?' },

  // ── GLOSARIO / DEFINICIONES (10) ───────────────────────────────────────
  { id:'G01', q:'¿Qué es el SCR y por qué era crítico en el sur peninsular el 28-A?' },
  { id:'G02', q:'¿Qué diferencia hay entre un inversor GFL y un GFM?' },
  { id:'G03', q:'¿Qué es el efecto Ferranti y cómo contribuyó al apagón?' },
  { id:'G04', q:'¿Qué es la inercia sintética de un BESS-GFM?' },
  { id:'G05', q:'¿Qué es el MRSCR y en qué mejora al SCR clásico?' },
  { id:'G06', q:'¿Qué es el Black Start y qué centrales lo ejecutaron el 28-A?' },
  { id:'G07', q:'¿Qué son los servicios ERS y por qué no existían el 28-A?' },
  { id:'G08', q:'¿Qué es la potencia de cortocircuito y por qué es esencial para la estabilidad de tensión?' },
  { id:'G09', q:'¿Qué es el EAS de ENTSO-E y por qué falló en alertar del 28-A?' },
  { id:'G10', q:'¿Qué es el VoLL y cómo se aplica para calcular el impacto económico del 28-A?' },

  // ── VISUAL — simuladores, gráficas, figuras (15) ────────────────────────
  { id:'V01', q:'Muéstrame el simulador del efecto Ferranti en el Anexo X' },
  { id:'V02', q:'¿Dónde puedo ver la caída de frecuencia durante los segundos críticos del 28-A?' },
  { id:'V03', q:'Quiero ver el mapa animado de propagación de la cascada de desconexiones' },
  { id:'V04', q:'Muéstrame la curva P-V del colapso de tensión' },
  { id:'V05', q:'¿Hay alguna gráfica que muestre los precios SPOT negativos el día del apagón?' },
  { id:'V06', q:'Quiero ver el sismógrafo del colapso con los 27 segundos críticos' },
  { id:'V07', q:'¿Dónde está el simulador de la ecuación del swing?' },
  { id:'V08', q:'Muéstrame el radar de vulnerabilidad sistémica del 28-A' },
  { id:'V09', q:'¿Hay alguna figura que muestre el mecanismo del Tap-Lag visualmente?' },
  { id:'V10', q:'Quiero ver la evolución de los flujos en la frontera con Francia durante el colapso' },
  { id:'V11', q:'¿Dónde puedo ver la curva de recuperación de la demanda peninsular?' },
  { id:'V12', q:'Muéstrame el comparador del 28-A con jornadas estables' },
  { id:'V13', q:'¿Hay una gráfica que muestre la indisponibilidad sobrevenida por nudo?' },
  { id:'V14', q:'Quiero ver la cascada financiera del coste del apagón' },
  { id:'V15', q:'Muéstrame la gráfica de tensión y frecuencia en Carmona durante el colapso' },

  // ── GENERAL / RESUMEN (10) ─────────────────────────────────────────────
  { id:'A01', q:'¿Cuál fue la causa real del apagón del 28-A de forma resumida?' },
  { id:'A02', q:'¿Qué reformas se han implementado tras el apagón?' },
  { id:'A03', q:'¿Cómo reaccionaron los medios de comunicación ante el apagón?' },
  { id:'A04', q:'¿Qué papel tuvo la transición energética en hacer posible el apagón del 28-A?' },
  { id:'A05', q:'¿Cómo funcionó la reposición del sistema tras el colapso total?' },
  { id:'A06', q:'¿Qué lecciones regulatorias se extraen del 28-A para el resto de Europa?' },
  { id:'A07', q:'¿Qué fue la Operación Reforzada y por qué se implantó?' },
  { id:'A08', q:'¿Cómo afectó el apagón a los hospitales, trenes y sistemas de emergencia?' },
  { id:'A09', q:'¿Por qué el sistema ibérico es más vulnerable que otros europeos a este tipo de colapso?' },
  { id:'A10', q:'¿Qué dice el TFG sobre la responsabilidad institucional del apagón?' },

  // ── RESILIENCIA / FUTURO (5) ───────────────────────────────────────────
  { id:'R01', q:'¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?' },
  { id:'R02', q:'¿Por qué la Operación Reforzada es más cara que invertir en BESS-GFM?' },
  { id:'R03', q:'¿Qué debería incluir un mercado de servicios ERS para remunerar la inercia?' },
  { id:'R04', q:'¿Cómo debería reformarse el P.O. 7.4 para evitar otro 28-A?' },
  { id:'R05', q:'¿Qué papel tendrían los compensadores síncronos en un sistema con 100% renovable?' },

  // ── FUERA DE ÁMBITO (5) ────────────────────────────────────────────────
  { id:'N01', q:'¿Cuál es el precio actual de la electricidad en España?' },
  { id:'N02', q:'¿Quién ganó las últimas elecciones generales en España?' },
  { id:'N03', q:'¿Cuál es la capital de Francia?' },
  { id:'N04', q:'¿Qué tiempo va a hacer mañana en Madrid?' },
  { id:'N05', q:'¿Cuánto cuesta instalar placas solares en una vivienda en 2026?' },

  // ── SIMPLE / DIVULGATIVA (5) ───────────────────────────────────────────
  { id:'S01', q:'Explícame el apagón del 28-A como si tuviera 15 años' },
  { id:'S02', q:'¿Por qué se fue la luz en España el 28 de abril? Explícamelo fácil' },
  { id:'S03', q:'¿Qué es eso del Tap-Lag que mencionan todos los informes? En palabras sencillas' },
  { id:'S04', q:'¿Por qué tener muchas placas solares puede hacer la red eléctrica más frágil?' },
  { id:'S05', q:'¿Por qué tardaron tanto en volver a dar luz si España tiene tanta energía instalada?' },
];

async function ask(question) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ question, locale: 'es' });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ error: 'parse error', raw: data.slice(0, 200) }); }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.setTimeout(30000, () => { req.destroy(); resolve({ error: 'timeout' }); });
    req.write(body);
    req.end();
  });
}

async function run() {
  const results = [];
  const logLines = [];

  function log(msg = '') {
    console.log(msg);
    logLines.push(msg);
  }

  for (const { id, q } of questions) {
    console.log('Testing ' + id + '... ');
    const r = await ask(q);
    results.push({ id, q, r });
    console.log(r.error ? 'ERROR' : 'OK');
    await new Promise(res => setTimeout(res, 300));
  }

  for (const { id, q, r } of results) {
    log('\n' + '='.repeat(72));
    log(`ID: ${id}`);
    log(`PREGUNTA: ${q}`);
    if (r.error) {
      log(`ERROR: ${r.error}`);
      continue;
    }
    log(`INTENT: ${r.intent || 'n/a'}`);
    log(`CONFIDENCE: ${r.confidence || 'n/a'}`);
    log(`RESPUESTA: ${r.answer || ''}`);
    log('FUENTES:');
    (r.sources || []).slice(0, 3).forEach(s =>
      log(`  - ${s.url || s.slug || ''} | ${s.heading || ''}`)
    );
    log('VISUAL_ARTIFACTS:');
    (r.visualArtifacts || []).forEach(a =>
      log(`  - ${a.type}:${a.id} | rel: ${a.relevance} | ${a.title || ''}`)
    );
    log('FOLLOW_UPS:');
    (r.followUps || []).forEach(f => log(`  - ${f}`));
  }
  log('\n' + '='.repeat(72));
  log(`TOTAL: ${results.length} | Errors: ${results.filter(x => x.r.error).length}`);

  fs.writeFileSync('chatbot-100-results.txt', logLines.join('\n'), 'utf8');
  console.log('Saved 100 questions to chatbot-100-results.txt');
}

run().catch(console.error);
