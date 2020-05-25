const { getActiveNode } = require('./active-node');

function useCookie() {
  const { context } = getActiveNode();

  return context.root[0].props.cookie;
}

module.exports = {
  useCookie,
};
