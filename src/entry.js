import { resolve } from 'path';

import { diff } from './core/diff.js';
import { h } from './core/h.js';
import { mount } from './core/mount.js';
import { Router, RouterOutlet } from './core/router.js';
import { Session } from './core/session.js';
import { toHTML } from './core/to-html.js';
import * as sessionController from './sessionController.js';

/**
 * @param {{ props?: Record<string, any> }} options
 */
export async function entry({
  props = {},
} = {}) {
  const { initialPath } = props;
  const routes = (await import(`${resolve('./dist/main.js')}?hmr=${Date.now()}`)).default;

  const session = sessionController.get(props.sessionId);

  async function update(path, next, previous) {
    const diffOutput = await diff(previous, next).map((patch) => {
      patch.id = patch.id.slice(path.length);

      return patch;
    });

    sessionController.update(props.sessionId, path, diffOutput);
  }

  const initialTree = h(
    Session,
    { id: props.sessionId },
    h(
      Router,
      { routes, initialPath },
      h(RouterOutlet, props),
    ),
  );
  const {
    actions,
    tree,
    instances,
  } = await mount(initialTree, update);

  async function message(rawPath, rawName, event) {
    const path = rawPath;
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
    instances,
  };
}
