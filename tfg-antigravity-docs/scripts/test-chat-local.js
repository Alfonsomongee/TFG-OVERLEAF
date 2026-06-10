const handler = require('../api/chat.js');

const req = {
  method: 'POST',
  headers: { 'x-forwarded-for': '127.0.0.1' },
  body: { question: '¿Cuánta demanda se perdió?', locale: 'es' }
};

const res = {
  status: function(code) { return this; },
  setHeader: function(name, value) { return this; },
  json: function(data) {
    console.log('visualArtifacts[0]:', JSON.stringify(data.visualArtifacts?.[0], null, 2));
    console.log('visualArtifacts[1]:', JSON.stringify(data.visualArtifacts?.[1], null, 2));
  }
};

handler(req, res).catch(console.error);
