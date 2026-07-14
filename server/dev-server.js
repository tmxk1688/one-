/**
 * 本地开发服：静态资源 + 百言辰月 MCP/Gradio 反向代理
 * 用法：npm start（勿用 http-server，否则 POST 会 405）
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.join(__dirname, '..');
const BAINMOON_ORIGIN = 'https://zsz1314520-bainmoon-chat.ms.show';

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, x-gradio-user',
};

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
};

function sendJson(res, status, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...CORS });
    res.end(body);
}

function proxyBainmoon(req, res, targetPath) {
    const targetUrl = new URL(BAINMOON_ORIGIN + targetPath);
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;
    delete headers.connection;

    const transport = targetUrl.protocol === 'https:' ? https : http;
    const upstreamReq = transport.request({
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method: req.method,
        headers,
    }, (upstreamRes) => {
        const outHeaders = { ...CORS };
        const pass = ['content-type', 'content-length', 'cache-control', 'mcp-session-id'];
        for (const key of pass) {
            const val = upstreamRes.headers[key];
            if (val) outHeaders[key] = val;
        }
        res.writeHead(upstreamRes.statusCode || 502, outHeaders);
        upstreamRes.pipe(res);
    });

    upstreamReq.on('error', (err) => {
        if (!res.headersSent) {
            sendJson(res, 502, { error: 'Bainmoon proxy error', message: err.message });
        } else {
            res.end();
        }
    });

    req.pipe(upstreamReq);
}

function serveStatic(req, res, urlObj) {
    let pathname = decodeURIComponent(urlObj.pathname);
    if (pathname === '/') pathname = '/index.html';
    const filePath = path.normalize(path.join(ROOT, pathname));
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, CORS);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, CORS);
            res.end('Not Found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
            ...CORS,
        });
        fs.createReadStream(filePath).pipe(res);
    });
}

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, CORS);
        res.end();
        return;
    }

    if (urlObj.pathname.startsWith('/proxy/bainmoon')) {
        const targetPath = urlObj.pathname.replace(/^\/proxy\/bainmoon/, '') + urlObj.search;
        proxyBainmoon(req, res, targetPath);
        return;
    }

    serveStatic(req, res, urlObj);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('========================================');
    console.log('  TMXK Dev Server (static + Bainmoon proxy)');
    console.log('  请勿使用 http-server，否则 POST 会 405');
    console.log('========================================');
    console.log(`  Site:   http://127.0.0.1:${PORT}/script-writing.html`);
    console.log(`  Proxy:  http://127.0.0.1:${PORT}/proxy/bainmoon/gradio_api/queue/join`);
    console.log('');
});
