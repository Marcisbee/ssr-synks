import esbuild from 'esbuild';
import { resolve } from 'path';

export async function buildApp() {
  const { default: packageJSON } = await import(resolve('./package.json'));
  const indexPath = resolve(packageJSON.main);

  return esbuild.build({
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
    .catch(() => process.exit(1));
}