import esbuild from 'esbuild';
import { resolve } from 'path';

export async function buildApp() {
  const { default: packageJSON } = await import(resolve('./package.json'), { assert: { type: "json" } });
  const indexPath = resolve(packageJSON.main);

  const context = await esbuild.context({
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
  });

  return context.watch()
    .catch((e) => { console.log({ e }); process.exit(1) });
}
