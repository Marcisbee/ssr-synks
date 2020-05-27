export function destroyTree(tree, methods) {
  if (tree instanceof Array) {
    tree.forEach((node) => destroyTree(node, methods));
    return;
  }

  if (!tree || typeof tree !== 'object') {
    return;
  }

  if (methods && tree.path) {
    const rootRegExp = new RegExp(`^${tree.path.join('.')}`);
    Object.keys(methods)
      .filter((key) => rootRegExp.test(key))
      .forEach((key) => {
        delete methods[key];
      });
  }

  if (tree.type instanceof Function) {
    tree.destroyed = true;
    destroyTree(tree.instance);
  }

  destroyTree(tree.children);
}
