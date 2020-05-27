const { addHook } = require('sucrase/dist/register');

addHook('.ts', {
  transforms: ['imports', 'typescript'],
});

addHook('.tsx', {
  transforms: ['imports', 'typescript', 'jsx'],
  jsxPragma: 'SSR.h',
});
