import { ComponentVnode } from './nodes/component.js';
import { ContextVnode } from './nodes/context.js';
import { ElementVnode } from './nodes/element.js';
import { GeneratorVnode } from './nodes/generator.js';
import { createProxy } from './utils/create-proxy.js';
import { isContext } from './utils/is-context.js';
import { mergePrimitives } from './utils/merge-primitives.js';
import { parseProps } from './utils/parse-props.js';
import { transformPrimitives } from './utils/transform-primitives.js';

function renderContext(node, id, context) {
  const { name } = node.type;
  let subscribers = [];

  const contextInstance = new node.type(node.props);

  const proxyInstance = createProxy(contextInstance, async () => {
    const solvedSubscribers = [];

    for (const subscriber of subscribers) {
      const isSolved = solvedSubscribers
        .findIndex((subscriberId) => (
          new RegExp(`^${subscriberId}\\.`).test(subscriber.id.join('.'))
        )) !== -1;

      // eslint-disable-next-line no-continue
      if (isSolved) continue;

      solvedSubscribers.push(subscriber.id.join('.'));
      await subscriber();
    }
  });

  const instance = [
    proxyInstance,

    // Subscribe
    (update) => {
      const updateId = update.id.join('.');

      // Remove duplicate subscribers
      subscribers = subscribers
        .filter((subscriber) => subscriber.id.join('.') !== updateId);

      subscribers.push(update);
    },
  ];

  context.instances[name] = instance;

  node.children = node.children.map(
    // eslint-disable-next-line no-use-before-define
    (child, index) => render(child, id.concat(index), context),
  );

  return node;
}

// @TODO: Fix multi child trees
function renderArray(currentArray, id, context) {
  let output = [];
  const originalLength = 0;
  let length = originalLength;

  for (const i in currentArray) {
    const newContext = {
      ...context,
      index: length,
    };
    // eslint-disable-next-line no-use-before-define
    const result = render(currentArray[i], id.concat(length), newContext);

    output = mergePrimitives(output, result);

    length = originalLength + output.length;
  }

  return output;
}

export function render(nodeRaw, id = [0], context) {
  if (nodeRaw instanceof Array) {
    return renderArray(nodeRaw, id, context);
  }

  if (nodeRaw === undefined || nodeRaw === null || (typeof nodeRaw !== 'object' && !nodeRaw)) {
    return nodeRaw;
  }

  const node = transformPrimitives(nodeRaw);

  node.id = id.slice();

  if (node instanceof ContextVnode) {
    return renderContext(node, id, context);
  }

  // @TODO: Replace output functions with paths
  if (node instanceof GeneratorVnode) {
    // eslint-disable-next-line no-inner-declarations
    function update() {
      const previousInstance = node.instance;

      // Render component
      // eslint-disable-next-line no-use-before-define
      selfRender();

      context.onUpdate(node.id, node.instance, previousInstance);
    }

    update.id = node.id;

    // eslint-disable-next-line no-inner-declarations
    function selfRender() {
      if (!node.iterable) {
        node.iterable = node.type({ ...node.props, children: node.children });
      }
      let instance = node.iterable.next();

      while (isContext(instance.value)) {
        const contextName = instance.value.name;
        const currentContext = context.instances[contextName];

        if (typeof currentContext === 'undefined') {
          throw new Error(`Trying to access "${contextName}" in <${node.type.name}> component, but it was not defined in parent tree`);
        }

        const [contextInstance, subscribe] = context.instances[contextName];

        subscribe(update);

        instance = node.iterable.next(contextInstance);
      }

      node.instance = render(
        instance.value,
        node.id.concat(0),
        context,
      );
    }

    // Render component
    selfRender();

    return node;
  }

  if (node instanceof ComponentVnode) {
    node.children = renderArray(node.children, node.id, context);

    node.instance = render(
      node.type.call({}, { ...node.props, children: node.children }),
      node.id.concat(0),
      context,
    );

    return node;
  }

  if (node instanceof ElementVnode) {
    node.children = renderArray(node.children, node.id, context);

    parseProps(node, context);

    return node;
  }

  return node;
}
