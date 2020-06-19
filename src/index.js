import esbuild from 'esbuild';
import { resolve } from 'path';

import { startHTTP } from './http.js';
import { buildApp } from './server/build-app.js';
import socket from './socket.js';

buildApp(() => {
  startHTTP();
  socket();
});
