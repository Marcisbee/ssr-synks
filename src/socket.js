const WebSocket = require('ws');
const nodeCookie = require('node-cookie');
const { build } = require('./build');
const config = require('./config');
const sessionController = require('./sessionController');

const wss = new WebSocket.Server({ port: config.socket.port });

wss.on('connection', (ws) => {
  const action = {
    init(data) {
      ws.send(
        JSON.stringify(
          ['init', data],
        ),
      );
    },
    update(path, data) {
      ws.send(
        JSON.stringify(
          ['update', path, data],
        ),
      );
    },
  };

  let cookie;
  let sessionId;
  let session;
  const handler = (path, tree) => {
    action.update(path, tree);
  };

  ws.on('close', () => {
    sessionController.unsubscribe(sessionId, handler);
    sessionController.remove(sessionId);
  });

  ws.on('message', async (message) => {
    const [type, ...data] = JSON.parse(message.toString());

    if (type === 'event' && data.length > 0) {
      const [path, name, event] = data;

      sessionController.message(sessionId, path, name, event);
      return;
    }

    if (type === 'join' && data.length > 0) {
      if (session) return;
      const [value, cookieValue] = data;

      cookie = cookieValue;
      sessionId = value;

      if (!sessionId) {
        console.log('Session is not valid');
        return;
      }

      session = sessionController.get(sessionId);

      if (!session) {
        await build(sessionId, cookie);
        session = sessionController.get(sessionId);
      }

      sessionController.subscribe(sessionId, handler);
      action.update(0, session.html);
    }
  });
});
