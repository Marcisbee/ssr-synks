import { ComponentVnode } from './nodes/component.js';
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

  // contextInstance[CONTEXT_INSTANCE] = true;

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

  const newContext = {
    ...context,
    instances: {
      ...context.instances,
      [name]: instance,
    },
  };

  node.children = node.children.map(
    // eslint-disable-next-line no-use-before-define
    (child, index) => render(child, id.concat(index), newContext),
  );

  return node;
}

function renderArray(currentArray, id, context) {
  let output = [];
  const [originalLength] = id.slice(-1);
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

  if (nodeRaw === undefined || nodeRaw === null || typeof nodeRaw !== 'object') {
    return nodeRaw;
  }

  const node = transformPrimitives(nodeRaw);

  node.id = id;

  if (isContext(node.type)) {
    return renderContext(node, id, context);
  }

  // @TODO: Replace output functions with paths
  if (node instanceof GeneratorVnode) {
    // eslint-disable-next-line no-inner-declarations
    function selfRender() {
      node.children = node.children.map(
        (child, index) => render(child, id.concat(index), context),
      );

      function update() {
        // Tree is unsubscribed, no need to update this
        if (node.isUnsubscribed) {
          return;
        }

        const previousInstance = node.instance;

        if (previousInstance instanceof Array) {
          previousInstance.forEach((instance) => {
            if (!instance || !instance.unsubscribe) return;

            instance.unsubscribe();
          });
        } else if (previousInstance) {
          previousInstance.unsubscribe();
        }

        // Render component
        selfRender();

        debugger
        context.onUpdate(node.id, node.instance, previousInstance);
      }

      node.iterable = node.type({ ...node.props, children: node.children });
      // node.iterable = node.type.call(
      //   { update },
      //   { ...node.props, children: node.children },
      // );
      let instance = node.iterable.next();

      while (isContext(instance.value)) {
        const contextName = instance.value.name;
        const currentContext = context.instances[contextName];

        if (typeof currentContext === 'undefined') {
          throw new Error(`Trying to access "${contextName}" in <${node.type.name}> component, but it was not defined in parent tree`);
        }

        const [contextInstance, subscribe] = context.instances[contextName];

        // Do not subscribe to contexts again
        if (!node.instance) {
          node.subscribed.push(
            subscribe(update),
          );
        }

        instance = node.iterable.next(contextInstance);
      }

      // @TODO: Handle multiple contexts
      // while (isContext(rawInstance.value)) {
      //   const contestName = rawInstance.value.name;
      //   const currentContext = context.instances[contestName];

      //   if (typeof currentContext === 'undefined') {
      //     throw new Error(`Trying to access "${contestName}" in <${current.type.name}> component, but it was not defined in parent tree`);
      //   }

      //   const [contextInstance, subscribe] = context.instances[contestName];

      //   current.subscribed.push(
      //     subscribe(update),
      //   );

      //   rawInstance = await iterable.next(contextInstance);
      // }

      node.instance = render(
        instance.value,
        id.concat(0),
        context,
      );
    }

    // Render component
    selfRender();

    return node;
  }

  if (node instanceof ComponentVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index), context),
    );

    node.instance = render(
      node.type.call({}, { ...node.props, children: node.children }),
      id.concat(0),
      context,
    );

    return node;
  }

  if (node instanceof ElementVnode) {
    node.children = renderArray(node.children, id, context);

    parseProps(node, context);

    return node;
  }

  return node;
}
