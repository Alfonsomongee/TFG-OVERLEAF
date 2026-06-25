const handler = require('../api/chat.js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    // remove surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
} catch (e) {
  console.warn('Could not load .env.local file:', e.message);
}

const req = {
  method: 'POST',
  headers: { 'x-forwarded-for': '127.0.0.1' },
  body: { question: 'Papel Inercia 28A', locale: 'es' }
};

const res = {
  status: function(code) { 
    this.code = code; 
    return this; 
  },
  setHeader: function(k, v) { return this; },
  json: function(data) { 
    console.log('STATUS CODE:', this.code);
    console.log('ANSWER:\n', data.answer);
    console.log('SOURCES COUNT:', data.sources?.length);
    console.log('VISUAL ARTIFACTS:', JSON.stringify(data.visualArtifacts, null, 2));
    process.exit(0); 
  }
};

(async () => {
  try {
    const fn = handler.default || handler;
    await fn(req, res);
  } catch (err) {
    console.error('Error running handler:', err);
    process.exit(1);
  }
})();
