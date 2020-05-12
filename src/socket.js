const WebSocket = require('ws');
const nodeCookie = require('node-cookie');
const build = require('./build');
const config = require('./config');
const sessionController = require('./sessionController');

const wss = new WebSocket.Server({ port: config.socket.port });

wss.on('connection', function connection(ws) {
  const action = {
    update(data) {
      ws.send(
        JSON.stringify(
          ['update', data]
        )
      );
    },
  };

  let sessionId;
  let session;
  let handler = (newTree, oldTree) => {
    // console.log('tree updated', { newTree, oldTree });
    action.update(newTree);
  };

  ws.on('close', () => {
    sessionController.unsubscribe(sessionId, handler);
  });

  ws.on('message', (message) => {
    const [type, value] = JSON.parse(message);

    if (type === 'join') {
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

        action.update(app.html);
      }

      sessionController.subscribe(sessionId, handler);

      return;
    }
  });
});
