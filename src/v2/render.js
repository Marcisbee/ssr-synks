export function isContext(value) {
  return typeof value === 'function' && !Object.getOwnPropertyDescriptor(value, 'prototype').writable;
}

export function isGenerator(value) {
  return typeof value === 'function' && value.constructor.name === 'GeneratorFunction';
}

export function isComponent(value) {
  return typeof value === 'function';
}

function normalizePrimitive(primitive) {
  if (primitive === null) {
    return '';
  }

  return primitive;
}

function isNode(current) {
  if (current === null || typeof current !== 'object') {
    return false;
  }

  return typeof current.type !== 'undefined';
}

function mergePrimitives(output, currentRaw) {
  const currentArray = [].concat(currentRaw).flat(5);

  currentArray.forEach((current) => {
    if (output.length === 0) {
      output.push(
        normalizePrimitive(current),
      );
      return;
    }

    if (isNode(current)) {
      output.push(current);
      return;
    }

    const [previous] = output.slice(-1);

    if (previous !== null && typeof previous === 'object') {
      output.push(
        normalizePrimitive(current),
      );
      return;
    }

    output[output.length - 1]
      = `${String(previous)}${String(normalizePrimitive(current))}`;
  });
}

async function renderArray(currentArray, context) {
  const output = [];
  let length = context.index;

  for (const i in currentArray) {
    const newContext = {
      ...context,
      index: length,
    };
    const result = await render(currentArray[i], newContext);

    mergePrimitives(output, result);

    length = context.index + output.length;
  }

  return output;
}

function prepareProps(current) {
  return {
    ...current.props,
    children: current.children,
  };
}

function createProxy(target, onChange) {
  return new Proxy(target, {
    get(t, property) {
      const item = target[property];
      if (item && typeof item === 'object') return createProxy(item, onChange);

      return item;
    },
    set(t, property, newValue) {
      target[property] = newValue;
      onChange();

      return true;
    },
  })
}

async function renderContext(current, context) {
  const name = current.type.name;
  let subscribers = [];

  const contextInstance = new current.type(current.props);

  const proxyInstance = createProxy(contextInstance, async () => {
    for (const subscriber of subscribers) {
      await subscriber();
    }
  });

  const instance = [
    proxyInstance,

    // Subscribe
    (fn) => {
      subscribers.push(fn);

      // Unsubscribe
      return () => {
        subscribers = subscribers.filter((subscriber) => subscriber !== fn);
      };
    },
  ];

  current.children = await renderArray(current.children, {
    ...context,
    instances: {
      ...context.instances,
      [name]: instance,
    },
  });

  return current;
}

async function renderGenerator(current, context) {
  const props = prepareProps(current);
  const iterable = (await current.type(props));
  let rawInstance = iterable.next();

  if (!current.subscribed) {
    current.subscribed = [];
  }

  const update = async () => {
    console.log(current, 'component updated');
    rawInstance = await iterable.next();

    // @TODO: Unsubscribe from previous instance tree
    const previousInstance = current.instance;
    // current.subscribed.forEach(unsubscribe => unsubscribe());

    current.instance = await render(rawInstance && rawInstance.value, context);

    // @TODO: Call global update hook
    // console.log(current.path, current.instance, previousInstance);
  };

  while (isContext(rawInstance.value)) {
    const contestName = rawInstance.value.name;
    const [contextInstance, subscribe] = context.instances[contestName];

    current.subscribed.push(
      subscribe(update),
    );

    rawInstance = await iterable.next(contextInstance);
  };

  current.instance = await render(rawInstance && rawInstance.value, context);

  return current;
}

async function renderComponent(current, context) {
  const props = prepareProps(current);
  const rawInstance = await current.type(props);

  current.instance = await render(rawInstance, context);

  return current;
}

export async function render(current, context) {
  context = {
    ...context,
    path: context.path.slice(),
  };

  if (current instanceof Array) {
    return renderArray(current, context);
  }

  if (current === undefined || current === null || typeof current !== 'object') {
    return current;
  }

  current.path = context.path;

  if (isContext(current.type)) {
    return renderContext(current, context);
  }

  if (isGenerator(current.type)) {
    return renderGenerator(current, context);
  }

  if (isComponent(current.type)) {
    return renderComponent(current, context);
  }

  context.path.push(context.index);
  current.path = context.path;

  // updateProps(current, context);

  if (current.children && current.children.length > 0) {
    current.children = await renderArray(
      current.children,
      {
        ...context,
        index: 0,
      },
    );
  }

  return current;
}
