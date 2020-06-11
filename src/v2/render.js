export function isContext(value) {
  return typeof value === 'function' && !Object.getOwnPropertyDescriptor(value, 'prototype').writable;
}

export function isGenerator(value) {
  return value.constructor.name === 'GeneratorFunction';
}

export function isComponent(value) {
  return typeof value === 'function';
}

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
  const output = [];
  let length = context.index;

  for (const i in current) {
    const newContext = {
      ...context,
      index: length,
    };
    const result = await render(current[i], newContext);

    length += getNestedArrayLength(result);
    output.push(result);
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
  const props = prepareProps(current);
  const name = current.type.name;
  let subscribers = [];

  const contextInstance = new current.type(props);

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

  current.instance = await renderArray(current.children, {
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

  while (isContext(rawInstance.value)) {
    const contestName = rawInstance.value.name;
    const [contextInstance, subscribe] = context.instances[contestName];

    rawInstance = await iterable.next(contextInstance);
    debugger
  };

  current.instance = await render(rawInstance && rawInstance.value, context);

  return current;
}

async function renderComponent(current, context) {
  const props = prepareProps(current);

  if (isGenerator(current.type)) {
    return renderGenerator(current, context);
  }

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

  if (isContext(current.type)) {
    return renderContext(current, context);
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
