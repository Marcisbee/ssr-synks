const { renderChildren } = require('./render-children');
const updateProps = require('./update-props');
const { destroyTree } = require('./destroy-tree');
const { setActiveNode } = require('./active-node');

function getNestedArrayLength(value) {
  if (!(value instanceof Array)) {
    return 1;
  }

  return value.reduce(
    (sum, item) => sum + getNestedArrayLength(item),
    0,
  );
}

async function renderArray(current, context) {
  const { previous, index } = context;
  const output = [];
  let length = index;

  for (const i in current) {
    const newContext = {
      ...context,
      previous: previous && previous[i],
      index: length,
    };
    const result = await render(current[i], newContext);

    length += getNestedArrayLength(result);
    output.push(result);
  }

  return output;
}

async function render(current, context) {
  context = {
    ...context,
    path: context.path.slice(),
  };

  if (current instanceof Array) {
    context.previous = context.previous || [];
    return renderArray(current, context);
  }

  if (current === undefined || current === null || typeof current !== 'object') {
    return current;
  }

  if (current.type instanceof Function) {
    current.path = context.path.concat(context.index);
    return renderComponent(current, context);
  }

  context.path.push(context.index);
  current.path = context.path;

  updateProps(current, context);

  if (current.children && current.children.length > 0) {
    await renderChildren(current, {
      ...context,
      index: 0,
    });
  }

  return current;
}

async function renderComponent(current, context) {
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
  context.previous = context.previous ? context.previous.instance : {};
  current.instance = await render(output, context);

  // Set current tree as previous tree
  if (context.previous) {
    Object.assign(context.previous, current);
  }

  return current;
}

module.exports = {
  render,
  renderArray,
};
