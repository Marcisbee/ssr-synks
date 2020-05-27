Object.defineProperty(exports, '__esModule', { value: true }); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } const newObj = {}; if (obj != null) { for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; }// @ts-ignore: no types available.
// eslint-disable-next-line import/no-extraneous-dependencies
const _pirates = require('pirates');

const pirates = _interopRequireWildcard(_pirates);

const _index = require('sucrase');

function addHook(extension, options) {
  pirates.addHook(
    (code, filePath) => {
      // eslint-disable-next-line no-void
      const { code: transformedCode, sourceMap } = _index.transform.call(void 0, code, {
        ...options,
        sourceMapOptions: { compiledFilename: filePath },
        filePath,
      });
      const mapBase64 = Buffer.from(JSON.stringify(sourceMap)).toString('base64');
      const suffix = `const { h } = require('ssr-synks');//# sourceMappingURL=data:application/json;charset=utf-8;base64,${mapBase64}`;
      return `${transformedCode}\n${suffix}`;
    },
    { exts: [extension] },
  );
}

addHook('.ts', {
  transforms: ['imports', 'typescript'],
});

addHook('.tsx', {
  transforms: ['imports', 'typescript', 'jsx'],
  jsxPragma: 'h',
});
