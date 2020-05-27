import { getActiveNode } from './active-node';

export function useState(initialState) {
  const {
    node,
    index,
    update,
  } = getActiveNode();

  let state = (typeof node.state[index] === 'undefined')
    ? initialState
    : node.state[index];

  node.state[index] = state;

  async function setState(newState) {
    state = typeof newState === 'function'
      ? newState(state)
      : newState;

    await update(state, index);

    return state;
  }

  return [
    state,
    setState,
  ];
}
