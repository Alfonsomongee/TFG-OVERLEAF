const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, 'docs');

const annexFiles = {
  'anexo-demanda-generacion-balance.mdx': {
    sections: [
      { id: 'condicion-previa', eyebrow: 'Sección 1', title: 'La condición previa: mix, unidades e inercia' },
      { id: 'previsiones-demanda', eyebrow: 'Sección 2', title: 'Previsiones de demanda: ausencia de señales de alarma' },
      { id: 'capacidad-indicadores', eyebrow: 'Sección 3', title: 'Capacidad, reservas e indicadores de medio plazo' },
      { id: 'transicion-reenergizacion', eyebrow: 'Sección 4', title: 'Transición energética y re-energización' },
    ]
  },
  'anexo-estabilidad-dinamica-tension.mdx': {
    sections: [
      { id: 'inestabilidad-tension', eyebrow: 'Sección 1', title: 'Inestabilidad de tensión y precursores' },
      { id: 'frecuencia-inercia', eyebrow: 'Sección 2', title: 'Dinámica de frecuencia e inercia' },
      { id: 'balance-reactiva', eyebrow: 'Sección 3', title: 'Balance de potencia reactiva' },
      { id: 'herramientas-estabilidad', eyebrow: 'Sección 4', title: 'Herramientas interactivas de análisis' },
    ]
  },
  'anexo-cascada-protecciones-desconexiones.mdx': {
    sections: [
      { id: 'propagacion-sobretensiones', eyebrow: 'Fase 1', title: 'Propagación de sobretensiones' },
      { id: 'cascada-ibr', eyebrow: 'Fase 2', title: 'Cascada de desconexiones IBR' },
      { id: 'deslastre-defensa', eyebrow: 'Fase 3', title: 'Deslastre y mecanismos de defensa' },
      { id: 'estado-final', eyebrow: 'Fase 4', title: 'Estado final y topología post-colapso' },
    ]
  },
  'anexo-interconexiones-flujos.mdx': {
    sections: [
      { id: 'perdida-sincronismo', eyebrow: 'Sección 1', title: 'Pérdida de sincronismo transfronterizo' },
      { id: 'hvdc-tecnologia', eyebrow: 'Sección 2', title: 'HVDC y tecnología de enlace' },
      { id: 'intercambios-previos', eyebrow: 'Sección 3', title: 'Programación e intercambios previos' },
      { id: 'reenergizacion-francia', eyebrow: 'Sección 4', title: 'Re-energización guiada desde Francia' },
    ]
  },
  'anexo-mercado-costes.mdx': {
    sections: [
      { id: 'senales-mercado', eyebrow: 'Sección 1', title: 'Señales de mercado el 28-A: precios e indicadores' },
      { id: 'balance-desvios', eyebrow: 'Sección 2', title: 'Balance y desvíos operativos' },
      { id: 'vulnerabilidad-mercado', eyebrow: 'Sección 3', title: 'La vulnerabilidad invisible del mercado' },
    ]
  },
  'anexo-reposicion-blackstart.mdx': {
    sections: [
      { id: 'estrategia-reposicion', eyebrow: 'Sección 1', title: 'Estrategia de reposición y arranque autónomo' },
      { id: 'recuperacion-demanda', eyebrow: 'Sección 2', title: 'Recuperación de demanda por regiones' },
      { id: 'estados-eas', eyebrow: 'Sección 3', title: 'Coordinación internacional y estados EAS' },
    ]
  },
  'anexo-impacto-resiliencia.mdx': {
    sections: [
      { id: 'cuantificacion', eyebrow: 'Sección 1', title: 'Cuantificación del impacto económico' },
      { id: 'comparacion-historica', eyebrow: 'Sección 2', title: 'Comparación con apagones históricos' },
      { id: 'resiliencia', eyebrow: 'Sección 3', title: 'Resiliencia sectorial de infraestructuras' },
      { id: 'regulatorio', eyebrow: 'Sección 4', title: 'Régimen regulatorio y sanciones' },
    ]
  },
  'anexo-comunicacion-fuentes.mdx': {
    sections: [
      { id: 'cobertura-mediatica', eyebrow: 'Sección 1', title: 'Cobertura mediática nacional e internacional' },
      { id: 'percepcion', eyebrow: 'Sección 2', title: 'Percepción pública y política' },
      { id: 'consenso-pericial', eyebrow: 'Sección 3', title: 'Consenso y discrepancias periciales' },
    ]
  },
  'anexo-metodologia-modelos-datos-vivos.mdx': {
    sections: [
      { id: 'metodologia', eyebrow: 'Sección 1', title: 'Metodología forense y contraste de fuentes' },
      { id: 'tecnologias', eyebrow: 'Sección 2', title: 'Tecnologías de soporte: inversores y sensores' },
      { id: 'modelos-didacticos', eyebrow: 'Sección 3', title: 'Modelos didácticos y simuladores' },
    ]
  },
  'anexo-ecuaciones-matematicas.mdx': {
    sections: [
      { id: 'red-tension', eyebrow: 'Dominio 1', title: 'Fortaleza de red y colapso de tensión' },
      { id: 'reactiva-transitorios', eyebrow: 'Dominio 2', title: 'Reactiva y transitorios electromagnéticos' },
      { id: 'control-frecuencia', eyebrow: 'Dominio 3', title: 'Control e inercia de frecuencia' },
      { id: 'mercado-coste', eyebrow: 'Dominio 4', title: 'Mercado y economía de red' },
      { id: 'sistemicos', eyebrow: 'Dominio 5', title: 'Modelos de dinámica de sistemas' },
    ]
  },
};

function injectSections(filename, sections) {
  const filePath = path.join(docsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find the AnnexEvidenceNav closing "/>" line
  let navCloseIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '/>' && i > 10) {
      // Check if 5-15 lines before have "target:" (part of EvidenceNav items)
      const prevLines = lines.slice(Math.max(0, i-15), i).join('\n');
      if (prevLines.includes('target:')) {
        navCloseIdx = i;
        break;
      }
    }
  }

  if (navCloseIdx < 0) {
    console.log(`  WARNING: Could not find EvidenceNav in ${filename}, using line 55`);
    navCloseIdx = 55;
  }

  // Find the start of the section summary / cross links
  let summaryStartIdx = lines.length;
  for (let i = navCloseIdx + 1; i < lines.length; i++) {
    if (lines[i].includes('<AnnexCrossLinks') || lines[i].includes('<AnnexSectionSummary')) {
      summaryStartIdx = i;
      // Walk back to find the last blank line before it
      for (let j = i - 1; j > navCloseIdx; j--) {
        if (lines[j].trim() === '') {
          summaryStartIdx = j;
          break;
        }
      }
      break;
    }
  }

  // Extract content lines between navClose and summaryStart
  const contentLines = lines.slice(navCloseIdx + 1, summaryStartIdx);
  const contentStr = contentLines.join('\n');

  // Split into blocks on 2+ consecutive blank lines
  const rawBlocks = contentStr.split(/\n(?:\s*\n){2,}/);
  
  // Filter out empty/whitespace-only blocks to get only content blocks
  const contentBlocks = rawBlocks.filter(b => b.trim().length > 0);

  console.log(`${filename}: found ${contentBlocks.length} content blocks for ${sections.length} sections`);

  if (contentBlocks.length !== sections.length) {
    console.log(`  WARNING: Block count mismatch! Expected ${sections.length}, got ${contentBlocks.length}`);
    contentBlocks.forEach((b, i) => console.log(`  Block[${i}]: ${b.trim().slice(0, 60)}`));
  }

  // Build new section content
  const newSections = sections.map((section, idx) => {
    const block = contentBlocks[idx] || '';
    // Ensure block content starts without leading blank lines
    const cleanBlock = block.replace(/^\n+/, '').replace(/\n+$/, '');
    return `\n  <AnnexSection id="${section.id}" eyebrow="${section.eyebrow}" title="${section.title}">\n${cleanBlock}\n  </AnnexSection>\n`;
  }).join('\n');

  const prefix = lines.slice(0, navCloseIdx + 1).join('\n');
  const suffix = '\n' + lines.slice(summaryStartIdx).join('\n');

  const newContent = prefix + '\n' + newSections + suffix;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  ✓ Restored ${filename}`);
}

for (const [filename, config] of Object.entries(annexFiles)) {
  try {
    injectSections(filename, config.sections);
  } catch(e) {
    console.error(`ERROR in ${filename}:`, e.message);
    console.error(e.stack);
  }
}

console.log('\nAll files processed!');
