let activeNode = {
  node: null,
  context: null,
  update: null,
  index: null,
};

export function setActiveNode(node, update, context) {
  return activeNode = {
    node,
    update,
    context,
    index: 0,
  };
}

export function getActiveNode() {
  const node = {
    ...activeNode,
  };

  activeNode.index += 1;

  return node;
}
