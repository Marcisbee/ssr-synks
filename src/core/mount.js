import { render } from './render';
import { createDiff } from './create-diff';

export async function mount(current, previous, update) {
  if (!(current instanceof Array)) {
    current = [current];
  }

  let closed = false;
  const methods = {};
  const context = {
    path: [],
    index: 0,
    previous: previous || [],
    root: current,
    methods,
    async update(node, previousNode) {
      if (closed) {
        return;
      }

      const diff = await createDiff(node, previousNode);

      if (update) {
        try {
          update(node.path, node.type, diff);
        } catch (e) {
          // Session is cleared or other error happened
          closed = true;
        }
      }
    },
  };

  return {
    tree: await render(current, context),
    methods,
  };
}
