import esbuild from 'esbuild';
import { resolve } from 'path';

import http from './http.js';
import socket from './socket.js';

(async () => {
  const { default: packageJSON } = await import(resolve('./package.json'));
  const indexPath = resolve(packageJSON.main);

  esbuild.build({
    stdio: 'inherit',
    entryPoints: [indexPath],
    outfile: './dist/main.js',
    minify: false,
    bundle: true,
    jsxFactory: 'SSR.h',
    target: 'esnext',
    format: 'esm',
    platform: 'node',
    external: ['ssr-synks'],
  })
    .then(() => {
      http();
      socket();
    })
    .catch(() => process.exit(1));
})();
