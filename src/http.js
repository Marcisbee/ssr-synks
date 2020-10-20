import { exists, readFile, statSync } from 'fs';
import { createServer } from 'http';
import nodeCookie from 'node-cookie';
import path from 'path';
import url from 'url';

import { build } from './build.js';
import { connect } from './client.js';
import * as config from './config.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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
  const name = JSON.stringify(config.cookie.name);
  const { port } = config.socket;

  return `(${clientJs})(
    window,
    document,
    ${helpers},
    ${name},
    ${port},
    ${JSON.stringify(config.session.name)}
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
    window.${config.session.name} = ${JSON.stringify(sessionId)};
  </script>
  ${css || ''}
  <style>
    * {
      animation: 0.5s render forwards;
    }

    @keyframes render {
      0% {
        box-shadow: inset 0 0 0 500px yellow;
      }
      100% {
        box-shadow: inset 0 0 0 500px transparent;
      }
    }

    body.connected:before {
      display: block;
      content: 'Connected';
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 5px 10px;
      background-color: red;
      color: #fff;
      border-radius: 4px;
    }
    body:not(.connected):before {
      display: block;
      content: 'Offline';
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 5px 10px;
      background-color: gray;
      color: #fff;
      border-radius: 4px;
    }
  </style>
  <script src="./client.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Primer/14.4.0/primer.css" />
</head>

<body>${app || ''}<script>ResyncConnect();</script></body>

</html>`;
}

const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = path.join(__dirname, `../public/${parsedUrl.pathname}`);
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const { ext } = path.parse(pathname);
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

  // @TODO: Fix deprecation:
  exists(pathname, async (exist) => {
    if ((!exist && ext === '') || pathname === path.join(__dirname, '../public/')) {
      let cookie = nodeCookie.get(req, config.cookie.name);
      const sessionIdRaw = String(Math.random());
      const sessionId = nodeCookie.packValue(sessionIdRaw, config.cookie.secret, true);

      if (!cookie) {
        const cookieRaw = String(Math.random());
        cookie = nodeCookie.create(
          res,
          config.cookie.name,
          cookieRaw,
          {},
          config.cookie.secret,
          true,
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

export function startHTTP() {
  server.listen(config.http.port);
  console.log(`Server listening on port ${config.http.port}`);
}
