import { render } from './render.js';
import { setActiveNode } from './active-node.js';
import { destroyTree } from './destroy-tree.js';

export async function renderComponent(current, context) {
  const props = {
    ...current.props,
    children: current.children,
  };
  // Component state update function
  const update = async (newState, index) => {
    if (current.destroyed) return;

    context.previous = { ...current };

    // Update state
    current.state[index] = newState;

    console.log({
      current: JSON.stringify(current),
      previous: JSON.stringify(context.previous),
    });

    // Render new tree with new state
    const rendered = await render(current, context);

    // console.log(JSON.stringify(rendered, null, ' '))

    // Send update to browser
    context.update(current, rendered);
    // current.instance = rendered;
    // Object.assign(context.previous, current);
    // Object.assign(current, rendered);
  };

  // Pass component state to next rendered tree
  if (context.previous && context.previous.type === current.type) {
    current.state = context.previous.state;
  }

  setActiveNode(current, update, context);

  // Execute component function
  const output = current.type(props);

  destroyTree(context.previous, context.methods);

  // Set previous tree as it's instance because we are rendering components instance
  // const previous = { ...current };

  // @TODO: Figure out why child state is not saved!
  const rendered = await render(output, {
    ...context,
    previous: context.previous.instance,
  });

  // Set current tree as previous tree
  // Object.assign(context.previous, current);

  current.instance = rendered;

  context.previous = { ...current };

  // Object.assign(current, rendered);

  return {
    ...current
  };
}
