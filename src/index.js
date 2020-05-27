import { resolve } from 'path';
import esbuild from 'esbuild';

import http from './http';
import socket from './socket';

const indexPath = resolve('./index.tsx');

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

