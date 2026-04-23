const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 3000;
const distPath = path.join(__dirname, 'dist', 'app', 'browser');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    let filePath = path.join(distPath, reqUrl);

    // Fallback to index.html for SPA routing
    if (!fs.existsSync(filePath)) {
      filePath = path.join(distPath, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file: ' + err.code);
        return;
      }

      if (filePath.endsWith('index.html')) {
        let htmlStr = content.toString('utf8');
        let basePath = req.headers['x-ingress-path'] || '/';
        if (!basePath.endsWith('/')) basePath += '/';

        htmlStr = htmlStr.replace(/<base\s+href="[^"]*"\s*\/?>/i, `<base href="${basePath}" />`);
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlStr, 'utf8');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } catch (error) {
    console.error("Server exception:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`HA Addon Native Server running on 0.0.0.0:${port}...`);
});
