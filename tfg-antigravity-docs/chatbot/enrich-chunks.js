#!/usr/bin/env node
// scripts/enrich-chunks.js
//
// Post-procesador de chunks.json:
// 1. Genera anchors sintéticos para chunks sin anchor (90 de 525)
// 2. Enriquece keywords de chunks 'normal' sin keywords
//
// Ejecutar: node scripts/enrich-chunks.js
// Input/Output: static/chunks.json (in-place)
//
// NOTA: Ejecutar DESPUÉS de build-index.js y ANTES de build-asset-registry.js

const fs = require('fs');
const path = require('path');

const CHUNKS_PATH = path.join(__dirname, '..', 'static', 'chunks.json');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, 'utf8'));
console.log(`[enrich-chunks] Loaded ${chunks.length} chunks.`);

let anchorsAdded = 0;
let keywordsAdded = 0;

for (const chunk of chunks) {
  // 1. Anchor sintético si está vacío
  if (!chunk.anchor && chunk.heading) {
    chunk.anchor = slugify(chunk.heading);
    anchorsAdded++;
  }

  // 2. Enriquecer keywords de chunks sin keywords
  if ((!chunk.keywords || chunk.keywords.length === 0) && chunk.heading) {
    const words = [chunk.heading, chunk.subheading]
      .filter(Boolean)
      .join(' ')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .map(w => w.replace(/[^a-záéíóúñü\w-]/gi, ''));
    chunk.keywords = [...new Set(words)].slice(0, 8);
    chunk.keywordsText = chunk.keywords.join(' ');
    keywordsAdded++;
  }
}

fs.writeFileSync(CHUNKS_PATH, JSON.stringify(chunks), 'utf8');

console.log(`[enrich-chunks] ✅ Anchors added: ${anchorsAdded}`);
console.log(`[enrich-chunks] ✅ Keywords enriched: ${keywordsAdded}`);
console.log(`[enrich-chunks] Written to ${CHUNKS_PATH}`);
