import { isNode } from './utils/is-node.js';

export function unsubscribeTree(currentRaw) {
  [].concat(currentRaw).forEach((current) => {
    if (!isNode(current)) return;

    if (current.subscribed) {
      current.subscribed.forEach((unsubscribe) => unsubscribe());
    }

    const children = current.instance || current.children;

    if (!children) return;

    unsubscribeTree(children);
  });
}
