const fs = require('fs');
const chunks = JSON.parse(fs.readFileSync('static/chunks.json', 'utf8'));
const OLD = ['anexo-tablas','anexo-figuras','anexo-interactivos','anexo-entsoe'];
const broken = Object.values(chunks).filter(c => 
  OLD.some(o => (c.slug||'').includes(o) || (c.artifact?.url||'').includes(o))
);
console.log('Chunks con rutas viejas:', broken.length);
const bySlug = {};
broken.forEach(c => { const k = c.slug||'sin-slug'; bySlug[k]=(bySlug[k]||0)+1; });
Object.entries(bySlug).forEach(([k,v]) => console.log(' ',v,'chunks →',k));
