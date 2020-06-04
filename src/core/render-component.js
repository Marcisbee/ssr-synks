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
    context.update(current, rendered);
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

  // @TODO: Figure out why child state is not saved!
  const rendered = await render(output, {
    ...context,
    previous: context.previous.instance,
  });

  current.instance = rendered;

  // Set current tree as previous tree
  Object.assign(context.previous, current);

  return current;
}
