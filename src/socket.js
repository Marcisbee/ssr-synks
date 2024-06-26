import { WebSocketServer } from 'ws';

// import nodeCookie from 'node-cookie';
import { build } from './build.js';
import { socket } from './config.js';
import {
  get,
  message,
  remove,
  subscribe,
  unsubscribe,
} from './sessionController.js';

const wss = new WebSocketServer({ port: socket.port });

export function startSocket() {
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
        if (typeof data === 'undefined') {
          return;
        }

        if (data.length === 0) {
          ws.send(
            JSON.stringify(
              ['no-change'],
            ),
          );
          return;
        }

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
      // Collecting garbage manually
      global.gc();
    });

    ws.on('message', async (msg) => {
      const [type, ...data] = JSON.parse(msg.toString());

      if (type === 'navigate') {
        const [routerInstance] = session.instances.Router || [];
        const [url] = data;

        if (!routerInstance) {
          return;
        }

        routerInstance.navigate(url);
        return;
      }

      if (type === 'event' && data.length > 0) {
        const [path, name, event] = data;

        message(sessionId, path, name, event);
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
        action.init('Some key?');
      }
    });
  });
}
