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
    // console.log('received: %s', message);
  });

  // ws.send('something');
});

// const net = require('net');
require('./http')

// let count = 0;

// var server = net.createServer(function (socket) {
//   socket.on('readable', (data) => {
//     console.log('readable', data);
//   });

//   socket.on('open', function () {
//     console.info('Socket open');
//   });

//   socket.on('close', function () {
//     console.info('Socket close');
//   });

//   socket.on('error', function (err) {
//     console.error('Socket error: ' + err + ', count = ' + count);
//     console.error(new Error().stack);
//   });
// });

// server.listen(52275);