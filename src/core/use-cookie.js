import { getActiveNode } from './active-node.js';

export function useCookie() {
  const { context } = getActiveNode();

  return context.root[0].props.cookie;
}
