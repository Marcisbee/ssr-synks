import { getActiveNode } from './active-node';

export function useSession() {
  const { context } = getActiveNode();

  return context.root[0].props.sessionId;
}
