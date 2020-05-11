const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 3000;

function htmlStructure({ css, app }) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  ${css || ''}
</head>

<body>
  ${app || ''}
  <script type="module" src="./index.js"></script>
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

  fs.exists(pathname, function (exist) {
    if (!exist || pathname === path.join(__dirname, '../public/')) {
      const app = require('../app')();
      const html = htmlStructure({ app });
      res.setHeader('Content-type', 'text/html');
      res.end(html);
      return;
    }

    // if is a directory search for index file matching the extension
    if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

    // read file from file system
    fs.readFile(pathname, function (err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);
