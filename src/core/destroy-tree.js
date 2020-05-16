module.exports = function destroyTree(tree) {
  if (tree instanceof Array) {
    tree.forEach(destroyTree);
    return;
  }

  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (tree.type instanceof Function) {
    tree.destroyed = true;
    destroyTree(tree.instance);
  }

  destroyTree(tree.children);
}
