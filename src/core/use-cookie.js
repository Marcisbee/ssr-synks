import { getActiveNode } from './active-node';

export function useCookie() {
  const { context } = getActiveNode();

  return context.root[0].props.cookie;
}
