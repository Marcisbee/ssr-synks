import { resolve } from 'path';

// import { pathCompress } from './core/path-compress.js';
// import { pathDecompress } from './core/path-decompress.js';
import * as sessionController from './sessionController.js';
import { diff } from './v3/diff.js';
import { h } from './v3/h.js';
import { mount } from './v3/mount.js';
import { toHTML } from './v3/to-html.js';

/**
 * @param {{ props?: Record<string, any> }} options
 */
export async function entry({
  props = {},
} = {}) {
  const Index = (await import(resolve('./dist/main.js'))).default;

  const session = sessionController.get(props.sessionId);

  async function update(rawPath, next, previous) {
    const path = rawPath.join('.');
    // const path = pathCompress(rawPath.join('.'));
    const diffOutput = await diff(next, previous);
    sessionController.update(props.sessionId, path, diffOutput);
  }

  const initialTree = h(Index, props);
  const {
    actions,
    tree,
  } = await mount(initialTree, update);

  async function message(rawPath, rawName, event) {
    const path = rawPath;
    // const path = pathDecompress(rawPath);
    const name = `on${rawName}`;
    const actionsInPath = actions[path];

    if (actionsInPath && actionsInPath[name]) {
      return actionsInPath[name](event);
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
