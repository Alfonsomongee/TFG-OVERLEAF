const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function loadEnv(file) {
  const p = path.join(__dirname, '..', file);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    content.split('\n').forEach(line => {
      const parts = line.trim().split('=');
      if (parts.length >= 2 && !line.trim().startsWith('#')) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnv('.env');
loadEnv('.env.local');

const chatHandler = require('../api/chat.js');
const figureContextHandler = require('../api/figure-context.js').default;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'POST' && (parsedUrl.pathname === '/api/chat' || parsedUrl.pathname === '/api/figure-context')) {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      // Mock request body
      try {
        req.body = JSON.parse(bodyData);
      } catch (e) {
        req.body = {};
      }

      // Mock response helper methods
      res.status = function(code) {
        this.statusCode = code;
        return this;
      };
      res.json = function(data) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(data));
        return this;
      };

      const handler = parsedUrl.pathname === '/api/chat' ? chatHandler : figureContextHandler;
      
      try {
        await handler(req, res);
      } catch (err) {
        console.error('Error in handler:', err);
        if (!res.writableEnded) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
        }
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Local API server listening on http://localhost:3000');
});
