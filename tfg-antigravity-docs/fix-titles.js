const fs = require('fs');
const path = require('path');

const replacements = [
  { file: '05-analisis-informes.mdx', from: 'title: "Análisis de los Informes Oficiales"', to: 'title: "Analysis of Official Reports"' },
  { file: '06-impacto-comunicativo.mdx', from: 'title: "Impacto Comunicativo"', to: 'title: "Communicative Impact"' },
  { file: '02-contexto.mdx', from: 'title: "Contexto Técnico"', to: 'title: "Technical Context"' },
  { file: '07-resiliencia-futuro.mdx', from: 'title: "Resiliencia y Futuro"', to: 'title: "Resilience and Future"' },
  { file: '09-conclusiones.mdx', from: 'title: "Conclusiones"', to: 'title: "Conclusions"' },
  { file: '08-uso-ia.mdx', from: 'title: "Uso de Inteligencia Artificial"', to: 'title: "Use of Artificial Intelligence"' },
  { file: 'anexo-entsoe.mdx', from: 'title: "Anexo D — Base de Datos ENTSO-E / ESIOS"', to: 'title: "Annex E — ENTSO-E / ESIOS Database"' },
  { file: 'referencias.mdx', from: 'title: "Referencias"', to: 'title: "References"' }
];

const dir = './i18n/en/docusaurus-plugin-content-docs/current';

replacements.forEach(r => {
  const fp = path.join(dir, r.file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    content = content.replace(r.from, r.to);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed', r.file);
  }
});
