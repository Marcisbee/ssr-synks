const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const nodeCookie = require('node-cookie');
const { build } = require('./build');
const config = require('./config');

function getCookie(cookie, name) {
  if (!cookie) return;

  return (
    cookie.match(
      new RegExp(`${name}=([^; |$]+)`)
    ) || []
  )[1];
}

function createClientJs() {
  const clientJs = require('./client').toString();
  const helpers = `{ getCookie: ${getCookie.toString()} }`;
  const name = JSON.stringify(config.cookie.name);
  const port = config.socket.port;

  return `(${clientJs})(window, document, ${helpers}, ${name}, ${port}, ${config.session.name})`;
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
</head>

<body>
  ${app || ''}
  <script type="module" src="./client.js"></script>
</body>

</html>`;
}

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = path.join(__dirname, `../public/${parsedUrl.pathname}`);
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext;
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
    '.doc': 'application/msword'
  };

  if (parsedUrl.pathname === '/client.js') {
    res.setHeader('Content-type', map[ext]);
    res.end(createClientJs());
    return;
  }

  fs.exists(pathname, async function (exist) {
    if ((!exist && ext === '') || pathname === path.join(__dirname, '../public/')) {
      // @TODO: figure out sessions
      // const cookie = nodeCookie.get(req, config.cookie.name, config.cookie.secret, true);
      const cookie = null;
      let sessionId = cookie;
      let sessionIdRaw = getCookie(req.headers.cookie, config.cookie.name);

      if (!cookie) {
        sessionId = Math.random();
        nodeCookie.create(res, config.cookie.name, sessionId, {}, config.cookie.secret, true);
      }

      const app = await build(sessionId);
      const html = htmlStructure({ css: '', app: app.html, sessionId: sessionIdRaw });

      res.setHeader('Content-type', 'text/html');
      res.end(html);
      return;
    }

    if (!exist) {
      res.statusCode = 404;
      res.end(`File not found`);
      return;
    }

    // if is a directory search for index file matching the extension
    if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(pathname, function (err, data) {
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
}).listen(config.http.port);

console.log(`Server listening on port ${config.http.port}`);
