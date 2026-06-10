const handler = require('../api/chat.js');

const req = {
  method: 'POST',
  headers: { 'x-forwarded-for': '127.0.0.1' },
  body: { question: '¿Qué es el Tap-Lag?', locale: 'es' }
};

const res = {
  status: function(code) { 
    this.code = code; 
    return this; 
  },
  setHeader: function(k, v) { return this; },
  json: function(data) { 
    console.log('STATUS:', this.code);
    console.log('ANSWER:\n', data.answer); 
    process.exit(0); 
  }
};

(async () => {
  try {
    const fn = handler.default || handler;
    await fn(req, res);
  } catch (err) {
    console.error(err);
  }
})();
