const fs = require('fs');

function extractTerms(fileStr) {
  const terms = [];
  const regex = /term:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(fileStr)) !== null) {
    terms.push(match[1]);
  }
  return terms;
}

const es = fs.readFileSync('src/data/glossary.js', 'utf8');
const en = fs.readFileSync('src/data/glossary_en.js', 'utf8');
const de = fs.readFileSync('src/data/glossary_de.js', 'utf8');

let allTerms = [
  ...extractTerms(es),
  ...extractTerms(en),
  ...extractTerms(de)
];

// Deduplicate
allTerms = [...new Set(allTerms)];
console.log('Total unique terms:', allTerms.length);

const pluginCode = `"use strict";

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const RAW_TERMS = ${JSON.stringify(allTerms, null, 2)};

// Sort by length descending
const TERMS = RAW_TERMS.slice().sort((a, b) => b.length - a.length);

function makeSpan(term, isFirst = false) {
  return '<span class="glossary-term' + (isFirst ? ' glossary-term-first' : '') + '" data-term="' + escHtml(term) + '" data-first="' + isFirst + '">' + escHtml(term) + '</span>';
}

function transformText(text, terms, seenTerms) {
  let earliest = null;
  let earliestIdx = Infinity;

  for (const term of terms) {
    const idx = text.indexOf(term);
    if (idx !== -1 && idx < earliestIdx) {
      const prev = idx > 0 ? text[idx - 1] : ' ';
      const next = idx + term.length < text.length ? text[idx + term.length] : ' ';
      if (/^[a-zA-Z0-9]+$/.test(term)) {
        if (/[a-zA-Z0-9]/.test(prev) || /[a-zA-Z0-9]/.test(next)) continue;
      }
      earliest = term;
      earliestIdx = idx;
    }
  }

  if (!earliest) return [{ type: 'text', value: text }];

  const before = text.slice(0, earliestIdx);
  const after  = text.slice(earliestIdx + earliest.length);

  const isFirstOccurrence = !seenTerms.has(earliest);
  if (isFirstOccurrence) {
    seenTerms.add(earliest);
  }

  const nodes = [];
  if (before) nodes.push({ type: 'text', value: before });

  if (isFirstOccurrence) {
    nodes.push({ type: 'html', value: makeSpan(earliest, true) });
  } else {
    nodes.push({ type: 'text', value: earliest });
  }

  if (after) nodes.push(...transformText(after, terms, seenTerms));
  return nodes;
}

const SKIP_TYPES = new Set([
  'code', 'inlineCode',
  'link',
  'image',
  'html',
  'mdxjsEsm',
  'mdxFlowExpression', 'mdxTextExpression',
  'mdxJsxFlowElement', 'mdxJsxTextElement',
  'math', 'inlineMath',
]);

function walkNode(node, seenTerms) {
  if (SKIP_TYPES.has(node.type)) return node;

  if (node.type === 'text') {
    const newNodes = transformText(node.value, TERMS, seenTerms);
    if (newNodes.length === 1 && newNodes[0].type === 'text' && newNodes[0].value === node.value) {
      return node;
    }
    return newNodes;
  }

  if (node.children && node.children.length > 0) {
    let changed = false;
    const newChildren = [];
    for (const child of node.children) {
      const result = walkNode(child, seenTerms);
      if (Array.isArray(result)) {
        newChildren.push(...result);
        changed = true;
      } else {
        newChildren.push(result);
        if (result !== child) changed = true;
      }
    }
    if (!changed) return node;
    return { ...node, children: newChildren };
  }

  return node;
}

function remarkAutoGlossaryLinks() {
  return function transformer(tree) {
    if (!tree.children) return;
    const seenTerms = new Set();
    let changed = false;
    const newChildren = [];
    for (const child of tree.children) {
      const result = walkNode(child, seenTerms);
      if (Array.isArray(result)) {
        newChildren.push(...result);
        changed = true;
      } else {
        newChildren.push(result);
        if (result !== child) changed = true;
      }
    }
    if (changed) tree.children = newChildren;
  };
}

module.exports = remarkAutoGlossaryLinks;
`;

fs.writeFileSync('plugins/remark-auto-glossary-links.js', pluginCode);
console.log('Successfully wrote plugin!');
