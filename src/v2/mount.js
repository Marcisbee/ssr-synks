import { render } from './render.js';

export async function mount(rawTree, onUpdate) {
  const actions = {};
  function addAction(rawPath, name, action) {
    const path = rawPath.join('.');

    actions[path] = {
      ...actions[path],
      [name]: action,
    };
  }
  const context = {
    index: 0,
    path: [],
    instances: {},
    actions,
    addAction,
    onUpdate,
  };
  const tree = await render(rawTree, context);

  return {
    tree,
    actions,
  };
}
