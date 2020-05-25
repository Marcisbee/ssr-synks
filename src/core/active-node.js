let activeNode = {
  node: null,
  context: null,
  update: null,
  index: null,
};

function setActiveNode(node, update, context) {
  return activeNode = {
    node,
    update,
    context,
    index: 0,
  };
}

function getActiveNode() {
  const node = {
    ...activeNode,
  };

  activeNode.index += 1;

  return node;
}

module.exports = {
  setActiveNode,
  getActiveNode,
};
