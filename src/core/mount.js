const createHTML = require('./create-html');
const destroyTree = require('./destroy-tree');

module.exports = async function mount(current, previous, update) {
  if (!(current instanceof Array)) {
    current = [current];
  }

  let closed = false;
  let root;
  const methods = {};
  const context = {
    path: [],
    index: 0,
    previous: previous || [],
    root: current,
    methods,
    async update(node, previous) {
      if (closed) {
        return;
      }

      // @TODO: Remove previous methods
      const diff = await createHTML(node, previous);

      if (update) {
        try {
          update(node.path, node.type, diff, root, context);
        } catch (e) {
          // Session is cleared or other error happened
          closed = true;
        }
      }
    },
  };

  // @TODO:
  // context.root.updateId = 0;

  return root = {
    tree: await render(current, context),
    methods,
  };
}

function getNestedArrayLength(value) {
  if (!(value instanceof Array)) {
    return 1;
  }

  return value.reduce(
    (sum, item) => sum + getNestedArrayLength(item),
    0
  );
};

async function renderArray(current, context) {
  let length = context.index;
  const output = [];
  const { previous, index } = context;

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

async function renderComponent(current, context) {
  const props = {
    ...current.props,
    children: current.children,
  };
  // Component state update function
  const update = async (newState) => {
    if (current.destroyed) return;
    // Update state
    current.state = newState instanceof Function
      ? newState(current.state)
      : newState;

    // Render new tree with new state
    const rendered = await render(current, context);

    // Send update to browser
    context.update(rendered, context.previous);
  };

  // Pass component state to next rendered tree
  if (context.previous && !current.instance && context.previous.type === current.type) {
    current.state = context.previous.state;
  }

  // Execute component function
  const output = current.type(props, current.state, update);

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

async function renderChildren(current, context) {
  const newContext = {
    ...context,
    previous: (context.previous && context.previous.children) || [],
  };
  current.children = await renderArray(current.children, newContext);
}

function updateProps(current, context) {
  const currentProps = Object.entries(current.props || {});
  const previousProps = Object.entries(context.props || {});
  const path = (current.path || []).join('.');

  currentProps.forEach(([rawKey, value]) => {
    if (value instanceof Function) {
      const key = rawKey.replace(/^on/, '');
      if (typeof context.methods[path] === 'undefined') {
        context.methods[path] = {};
      }

      context.methods[path][key] = value;
    }
  });
}

async function render(current, context) {
  context = {
    ...context,
    path: context.path.slice(),
  };

  if (current instanceof Array) {
    context.previous = context.previous || [];
    return await renderArray(current, context);
  }

  if (current === undefined || current === null || typeof current !== 'object') {
    return current;
  }

  if (current.type instanceof Function) {
    current.path = context.path.concat(context.index);
    return await renderComponent(current, context);
  }

  context.path.push(context.index);
  current.path = context.path;

  updateProps(current, context);

  if (current.children.length > 0) {
    await renderChildren(current, {
      ...context,
      index: 0,
    });
  }

  return current;
}
