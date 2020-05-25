const { getActiveNode } = require('./active-node');

function useSession() {
  const { context } = getActiveNode();

  return context.root[0].props.sessionId;
}

module.exports = {
  useSession,
};
