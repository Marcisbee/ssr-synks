import { resolve } from 'path';

import { diffTree } from './core/diff-tree.js';
import { h } from './core/h.js';
import { mount } from './core/mount.js';
import { toHTML } from './core/to-html.js';
// import { pathCompress } from './core/path-compress.js';
// import { pathDecompress } from './core/path-decompress.js';
import * as sessionController from './sessionController.js';

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
    const diff = await diffTree(next, previous);
    sessionController.update(props.sessionId, path, diff);
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
