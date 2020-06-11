import { render } from './render.js';

export async function mount(tree) {
  const context = {
    index: 0,
    path: [],
    instances: {},
  };

  return render(tree, context);
}
