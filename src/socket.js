const WebSocket = require('ws');
const nodeCookie = require('node-cookie');
const build = require('./build');
const config = require('./config');
const sessionController = require('./sessionController');

const wss = new WebSocket.Server({ port: config.socket.port });

wss.on('connection', function connection(ws) {
  let sessionId;
  let session;
  let handler = (newTree, oldTree) => {
    // console.log('tree updated', { newTree, oldTree });
    ws.send(JSON.stringify({
      t: 'u',
      p: newTree,
    }));
  };

  ws.on('close', () => {
    sessionController.unsubscribe(sessionId, handler);
  });

  ws.on('message', (message) => {
    const [type, value] = message.split(':');

    if (type === 's1') {
      if (session) return;

      sessionId = nodeCookie.get({
        headers: {
          cookie: `${config.cookie.name}=${value}`
        }
      }, config.cookie.name, config.cookie.secret, true);

      session = sessionController.get(sessionId);

      if (!session) {
        const app = build(sessionId);
        session = sessionController.get(sessionId);

        session.html = app.html;
        session.tree = app.tree;
      }

      sessionController.subscribe(sessionId, handler);

      return;
    }
  });
});
