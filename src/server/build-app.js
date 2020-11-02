import esbuild from 'esbuild';
import { resolve } from 'path';

export async function buildApp() {
  const { default: packageJSON } = await import(resolve('./package.json'));
  const indexPath = resolve(packageJSON.main);

  return esbuild.build({
    entryPoints: [indexPath],
    outfile: './dist/main.js',
    minify: false,
    bundle: true,
    jsxFactory: 'Resync.h',
    jsxFragment: 'Resync.f',
    target: 'esnext',
    format: 'esm',
    platform: 'node',
    external: ['resync'],
  })
    .catch(() => process.exit(1));
}
