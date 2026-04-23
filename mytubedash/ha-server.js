const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const distPath = path.join(__dirname, 'dist', 'app', 'browser');

function sendIndex(req, res) {
    const indexPath = path.join(distPath, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading index.html');
        }
        
        // Home Assistant Ingress va atașa acest header request-ului
        // Reprezintă exact acea adresă ascunsă lungă /api/hassio_ingress/...
        let basePath = req.headers['x-ingress-path'] || '/';
        
        // E vital să se termine cu '/' ca fișierele să fie vizibile ca și "copii"
        if (!basePath.endsWith('/')) {
            basePath += '/';
        }
        
        // Înlocuim tag-ul dinamic base de pe server, înainte să ajungă la browser
        // Asta evită orice blocare de CSP (Content Security Policy) pe JavaScript.
        const finalHtml = html.replace(/<base\s+href="[^"]*"\s*\/?>/i, `<base href="${basePath}" />`);
        res.send(finalHtml);
    });
}

// 1. Când Angular cere pagini principale
app.get('/', sendIndex);

// 2. Livrăm fișiere statice (JS/CSS/Imagini) din folderul de build (dist)
app.use(express.static(distPath));

// 3. Orice rută necunoscută este redirecționată către Index (Single Page App ruleser)
app.get('*', sendIndex);

// Pornire efectivă
app.listen(port, '0.0.0.0', () => {
    console.log(`HA Add-on Server Ingress a pornit local pe portul ${port}...`);
});
