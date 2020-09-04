import { render } from './render.js';

export function mount(rawTree, onUpdate) {
  const actions = {};
  function addAction(rawPath, name, action) {
    const path = rawPath.join('.');

    actions[path] = {
      ...actions[path],
      [name]: action,
    };
  }
  const context = {
    instances: {},
    actions,
    addAction,
    onUpdate,
  };
  const tree = render(rawTree, [0], context);

  return {
    tree,
    actions,
  };
}
