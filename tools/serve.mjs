/*
 * Lokalni server koji se ponaša kao Cloudflare za ovu stranicu:
 * servira public/, primjenjuje pravila iz public/_headers (CSP, keširanje)
 * i kompresuje tekst (brotli ili gzip).
 *
 *   node tools/serve.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};
const COMPRESS = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;

/* _headers: putanja (može sa *), pa uvučeni redovi "Ime: vrijednost" */
function parseHeaders() {
  const rules = [];
  let cur = null;
  for (const line of fs.readFileSync(path.join(PUB, '_headers'), 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      const re = new RegExp('^' + line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      cur = { re, headers: [] };
      rules.push(cur);
    } else if (cur) {
      const i = line.indexOf(':');
      cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(PUB, url);
  if (!file.startsWith(PUB)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  let status = 200;
  if (!fs.existsSync(file) || path.basename(file) === '_headers') { file = path.join(PUB, '404.html'); status = 404; }

  const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', Vary: 'Accept-Encoding' };
  for (const rule of parseHeaders()) {
    if (rule.re.test(url)) for (const [k, v] of rule.headers) headers[k] = v;
  }

  let body = fs.readFileSync(file);
  const enc = req.headers['accept-encoding'] || '';
  if (COMPRESS.test(headers['Content-Type'])) {
    if (/\bbr\b/.test(enc)) { body = zlib.brotliCompressSync(body); headers['Content-Encoding'] = 'br'; }
    else if (/\bgzip\b/.test(enc)) { body = zlib.gzipSync(body, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
  }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
