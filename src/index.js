import { startHTTP } from './http.js';
import { buildApp } from './server/build-app.js';
import { startSocket } from './socket.js';

buildApp()
  .then(() => {
    startHTTP();
    startSocket();
  });
