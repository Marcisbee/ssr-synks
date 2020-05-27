import { resolve } from 'path';
import * as sessionController from './sessionController';

import { h } from './core/h';
import { mount } from './core/mount';
import { renderHTML } from './core/render-html';
import { pathCompress } from './core/path-compress';
import { pathDecompress } from './core/path-decompress';

/**
 * @param {{ props?: Record<string, any> }} options
 */
export async function entry({
  props = {},
} = {}) {
  const Index = (await import(resolve('./dist/main.js'))).default;

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
