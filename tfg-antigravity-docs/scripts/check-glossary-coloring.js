#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const CSS_FILE = path.join(ROOT, "src", "css", "custom.css");
const GLOSSARY_FILE = path.join(ROOT, "src", "data", "glossary.js");
const CONFIG_FILE = path.join(ROOT, "docusaurus.config.js");
const REMARK_PLUGIN = path.join(ROOT, "plugins", "remark-auto-glossary-links.js");
const EXPECTED_GREEN = (process.env.GLOSSARY_GREEN || "#636E4F").toLowerCase();

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function decodeJsString(raw) {
  try {
    return JSON.parse(`"${raw.replace(/"/g, '\\"')}"`);
  } catch {
    return raw;
  }
}

function loadGlossaryTerms() {
  const source = read(GLOSSARY_FILE);
  const terms = [];
  const seen = new Set();
  const re = /\bterm:\s*"([^"]+)"/g;
  let match;

  while ((match = re.exec(source))) {
    const term = decodeJsString(match[1]).trim();
    const key = term.toLowerCase();
    if (term && !seen.has(key)) {
      seen.add(key);
      terms.push(term);
    }
  }

  return terms.sort((a, b) => b.length - a.length);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termRegex(term) {
  const escaped = escapeRegExp(term);
  if (/^[A-Za-z0-9]+$/.test(term)) {
    return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, "g");
  }
  return new RegExp(escaped, "g");
}

function stripNonNarrativeMdx(source) {
  let text = source;

  text = text.replace(/^---[\s\S]*?---\s*/m, " ");
  text = text.replace(/^import\s+.*?;?\s*$/gm, " ");
  text = text.replace(/^export\s+.*?;?\s*$/gm, " ");
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`[^`\n]*`/g, " ");
  text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");
  text = text.replace(/\$[^$\n]*\$/g, " ");
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, "$1");
  text = text.replace(/<[^>]+>/g, " ");

  return text;
}

function lineForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function findTermOccurrences(source, terms) {
  const text = stripNonNarrativeMdx(source);
  const occurrences = new Map();

  for (const term of terms) {
    const matches = [...text.matchAll(termRegex(term))];
    if (matches.length > 0) {
      occurrences.set(term, matches.length);
    }
  }

  return occurrences;
}

function findManualColoredOccurrences(source) {
  const colored = new Map();
  const patterns = [
    /<span\b[^>]*className=["'][^"']*\bglossary-term\b[^"']*["'][^>]*data-term=["']([^"']+)["'][^>]*>/g,
    /<span\b[^>]*class=["'][^"']*\bglossary-term\b[^"']*["'][^>]*data-term=["']([^"']+)["'][^>]*>/g,
    /<GlossaryLink\b[^>]*term=["']([^"']+)["'][^>]*>/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      const term = match[1].trim();
      const key = term.toLowerCase();
      if (!colored.has(key)) colored.set(key, []);
      colored.get(key).push({ term, line: lineForIndex(source, match.index) });
    }
  }

  return colored;
}

function checkCssColor() {
  const css = read(CSS_FILE);
  const variableMatch = css.match(/--glossary-term-light:\s*([^;]+);/);
  const variableValue = variableMatch ? variableMatch[1].trim().toLowerCase() : null;

  const selectorUsesVariable = /html\[data-theme=['"]light['"]\][\s\S]*?\.glossary-term[\s\S]*?color:\s*var\(--glossary-term-light\)\s*!important/.test(css);

  const problems = [];
  if (variableValue !== EXPECTED_GREEN) {
    problems.push(`--glossary-term-light es ${variableValue || "NO DEFINIDA"}, esperado ${EXPECTED_GREEN}`);
  }
  if (!selectorUsesVariable) {
    problems.push("La regla light mode de .glossary-term no usa var(--glossary-term-light) !important");
  }

  return problems;
}

function checkRemarkPipeline() {
  const config = read(CONFIG_FILE);
  const plugin = read(REMARK_PLUGIN);
  const problems = [];

  if (!config.includes("remark-auto-glossary-links")) {
    problems.push("docusaurus.config.js no registra plugins/remark-auto-glossary-links.js");
  }
  if (!plugin.includes("seenTerms") || !plugin.includes("glossary-term-first")) {
    problems.push("remark-auto-glossary-links.js no parece limitar el coloreado a una vez por término y capítulo");
  }
  if (!plugin.includes('class="glossary-term')) {
    problems.push("remark-auto-glossary-links.js no genera spans .glossary-term");
  }

  return problems;
}

function main() {
  const terms = loadGlossaryTerms();
  const files = walk(DOCS_DIR);
  const failures = [];
  const warnings = [];
  let chaptersWithTerms = 0;
  let totalDetectedTerms = 0;
  let totalExpectedColored = 0;

  for (const problem of checkCssColor()) failures.push(`CSS: ${problem}`);
  for (const problem of checkRemarkPipeline()) failures.push(`Pipeline: ${problem}`);

  for (const file of files) {
    const source = read(file);
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const occurrences = findTermOccurrences(source, terms);
    const manualColored = findManualColoredOccurrences(source);

    if (occurrences.size > 0) {
      chaptersWithTerms += 1;
      totalDetectedTerms += occurrences.size;
      totalExpectedColored += occurrences.size;
    }

    for (const [key, marks] of manualColored) {
      if (marks.length > 1) {
        failures.push(`${rel}: "${marks[0].term}" aparece coloreado manualmente ${marks.length} veces (líneas ${marks.map((m) => m.line).join(", ")}). Debe ser una sola vez por capítulo.`);
      }
      if (![...occurrences.keys()].some((term) => term.toLowerCase() === key)) {
        warnings.push(`${rel}: "${marks[0].term}" está marcado como glosario, pero no se detectó como término narrativo tras limpiar MDX.`);
      }
    }
  }

  console.log("Glosario técnico - comprobación de coloreado");
  console.log(`Verde esperado: ${EXPECTED_GREEN}`);
  console.log(`Términos cargados: ${terms.length}`);
  console.log(`MDX revisados: ${files.length}`);
  console.log(`Capítulos con términos detectados: ${chaptersWithTerms}`);
  console.log(`Términos/capítulo que deberían colorearse una vez: ${totalExpectedColored}`);

  if (warnings.length > 0) {
    console.log("\nAvisos:");
    for (const warning of warnings) console.log(`  - ${warning}`);
  }

  if (failures.length > 0) {
    console.error("\nFallos:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log("\nOK: el verde del glosario coincide y la lógica limita el coloreado a una vez por término y capítulo.");
}

main();
