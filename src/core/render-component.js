import { render } from "./render";
import { setActiveNode } from "./active-node";
import { destroyTree } from "./destroy-tree";

export async function renderComponent(current, context) {
  const props = {
    ...current.props,
    children: current.children,
  };
  // Component state update function
  const update = async (newState, index) => {
    if (current.destroyed) return;

    // Update state
    current.state[index] = newState;

    // Render new tree with new state
    const rendered = await render(current, context);

    // Send update to browser
    context.update(rendered, context.previous);
  };

  // Pass component state to next rendered tree
  if (context.previous && !current.instance && context.previous.type === current.type) {
    current.state = context.previous.state;
  }

  setActiveNode(current, update, context);

  // Execute component function
  const output = current.type(props);

  destroyTree(context.previous, context.methods);

  // Set previous tree as it's instance because we are rendering components instance
  const previous = { ...current };

  if (!context.previous) {
    context.previous = {};
  }

  current.instance = await render(output, {
    ...context,
    previous: context.previous.instance || {},
  });

  // Set current tree as previous tree
  if (context.previous) {
    Object.assign(context.previous, previous);
  }

  return current;
}
