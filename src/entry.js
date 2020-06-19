import { resolve } from 'path';

// import { pathCompress } from './core/path-compress.js';
// import { pathDecompress } from './core/path-decompress.js';
import * as sessionController from './sessionController.js';
import { h } from './v2/h.js';
import { mount } from './v2/mount.js';
import { toHTML } from './v2/to-html.js';

/**
 * @param {{ props?: Record<string, any> }} options
 */
export async function entry({
  props = {},
} = {}) {
  const Index = (await import(resolve('./dist/main.js'))).default;

  const session = sessionController.get(props.sessionId);

  function update(rawPath, component, diff) {
    console.log('update tree', arguments);
    // const path = pathCompress(rawPath.join('.'));
    // sessionController.update(props.sessionId, path, diff);
  }

  const initialTree = h(Index, props);
  const {
    actions,
    tree,
  } = await mount(initialTree, update);

  async function message(rawPath, name, event) {
    const path = rawPath;
    // const path = pathDecompress(rawPath);
    const methodsInPath = actions[path];

    if (methodsInPath && methodsInPath[name]) {
      return methodsInPath[name](event);
    }

    return undefined;
  }

  const html = await toHTML(tree);

  return {
    events: session.events,
    tree,
    html,
    message,
  };
}
