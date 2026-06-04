const fs = require('fs');
const code = fs.readFileSync('./api/chat.js','utf8');

// Ver prompt completo
const p1 = code.indexOf('const prompt = `');
const p2 = code.indexOf('const systemPrompt', p1);
console.log('=== PROMPT ACTUAL ===');
console.log(code.substring(p1, p2));

// Ver scoreArtifactForQuestion completa
const s1 = code.indexOf('function scoreArtifactForQuestion');
const s2 = code.indexOf('function buildVisualArtifacts', s1);
console.log('=== SCORE ARTIFACT ===');
console.log(code.substring(s1, s2));
