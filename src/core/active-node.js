let activeNode = {
  node: null,
  update: null,
  index: null,
};

function setActiveNode(node, update) {
  return activeNode = {
    node,
    update,
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
