import { createProxy } from '../utils/create-proxy.js';
import { renderArray } from './array.js';

export async function renderContext(current, context) {
  const { name } = current.type;
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
