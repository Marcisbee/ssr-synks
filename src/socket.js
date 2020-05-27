import WebSocket from 'ws';
// import nodeCookie from 'node-cookie';
import { build } from './build';
import { socket } from './config';
import {
  unsubscribe,
  remove,
  message as _message,
  get,
  subscribe,
} from './sessionController';

const wss = new WebSocket.Server({ port: socket.port });

export default () => {
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
      unsubscribe(sessionId, handler);
      remove(sessionId);
    });

    ws.on('message', async (message) => {
      const [type, ...data] = JSON.parse(message.toString());

      if (type === 'event' && data.length > 0) {
        const [path, name, event] = data;

        _message(sessionId, path, name, event);
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

        session = get(sessionId);

        if (!session) {
          await build(sessionId, cookie);
          session = get(sessionId);
        }

        subscribe(sessionId, handler);
        action.update(0, session.html);
      }
    });
  });
}
