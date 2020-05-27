const { resolve } = require('path');
const sessionController = require('./sessionController');

const { h } = require('./core/h');
const { mount } = require('./core/mount');
const { renderHTML } = require('./core/render-html');
const { pathCompress } = require('./core/path-compress');
const { pathDecompress } = require('./core/path-decompress');

/**
 * @param {{ props?: Record<string, any> }} options
 */
async function entry({
  props = {},
} = {}) {
  const indexPath = resolve('./index.tsx');
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const Index = require(indexPath).default;

  const session = sessionController.get(props.sessionId);

  function update(rawPath, component, diff) {
    const path = pathCompress(rawPath.join('.'));
    sessionController.update(props.sessionId, path, diff);
  }

  const initialTree = h(Index, props);
  const {
    methods,
    tree,
  } = await mount(initialTree, undefined, update);

  async function message(rawPath, name, event) {
    const path = pathDecompress(rawPath);
    const methodsInPath = methods[path];

    if (methodsInPath && methodsInPath[name]) {
      return methodsInPath[name](event);
    }

    return undefined;
  }

  const html = await renderHTML(tree);

  return {
    events: session.events,
    tree,
    html,
    message,
  };
}

module.exports = {
  entry,
};
