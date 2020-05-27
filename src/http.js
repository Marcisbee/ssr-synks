import { createServer } from 'http';
import { parse, fileURLToPath } from 'url';
import { exists, statSync, readFile } from 'fs';
import { join, parse as _parse, dirname } from 'path';
import nodeCookie from 'node-cookie';
import { build } from './build';
import {
  // @TODO:
  cookie as _cookie,
  socket,
  session,
  // @TODO:
  http as _http,
} from './config';
import { connect } from './client';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

// @TODO:
function getCookie(cookie, name) {
  if (!cookie) return null;

  return (
    cookie.match(
      new RegExp(`${name}=([^; |$]+)`),
    ) || []
  )[1];
}

const helpers = `{ getCookie: ${getCookie.toString()} }`;

function createClientJs() {
  const clientJs = connect.toString();
  const name = JSON.stringify(_cookie.name);
  const { port } = socket;

  return `(${clientJs})(
    window,
    document,
    ${helpers},
    ${name},
    ${port},
    ${JSON.stringify(session.name)}
  )`;
}

function htmlStructure({ css, app, sessionId }) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script>
    window.${session.name} = ${JSON.stringify(sessionId)};
  </script>
  ${css || ''}
</head>

<body>
  ${app || ''}
  <script type="module" src="./client.js"></script>
</body>

</html>`;
}

const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = parse(req.url);
  // extract URL path
  let pathname = join(__dirname, `../public/${parsedUrl.pathname}`);
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const { ext } = _parse(pathname);
  // maps file extension to MIME type
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
  };

  if (parsedUrl.pathname === '/client.js') {
    res.setHeader('Content-type', map[ext]);
    res.end(createClientJs());
    return;
  }

  exists(pathname, async (exist) => {
    if ((!exist && ext === '') || pathname === join(__dirname, '../public/')) {
      let cookie = nodeCookie.get(req, _cookie.name);
      const sessionIdRaw = String(Math.random());
      const sessionId = nodeCookie.packValue(sessionIdRaw, _cookie.secret, true);

      if (!cookie) {
        const cookieRaw = String(Math.random());
        cookie = nodeCookie.create(
          res, _cookie.name, cookieRaw, {}, _cookie.secret, true,
        );
      }

      const app = await build(sessionId, cookie);
      const html = htmlStructure({ css: '', app: app.html, sessionId });

      res.setHeader('Content-type', 'text/html');
      res.end(html);
      return;
    }

    if (!exist) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    // if is a directory search for index file matching the extension
    if (statSync(pathname).isDirectory()) {
      pathname += `/index${ext}`;
    }

    // read file from file system
    readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-type', 'text/plain');
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
});

export default () => {
  server.listen(_http.port);
  console.log(`Server listening on port ${_http.port}`);
}
