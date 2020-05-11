const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 52275 });

let count = 0;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const [type, value] = message.split(':');
    if (type === 'fn') {

      if (value === 'increment') {
        count++;
        ws.send(
          JSON.stringify({
            count,
          })
        );
      }
    }
  });
});
