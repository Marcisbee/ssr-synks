const renderHTML = require('./render-html');

/**
 * @param {any} currentNode
 * @param {any} previousNode
 */
module.exports = async function createDiff(currentNode, previousNode) {
  if (currentNode === previousNode) {
    return;
  }

  if (typeof previousNode === 'undefined' || previousNode === null || previousNode === NaN) {
    return await renderHTML(currentNode);
  }

  if (currentNode instanceof Array) {
    const length = Math.max(currentNode.length, previousNode.length || 0);
    const output = {};

    for (let index = 0; index < length; index++) {
      output[index] = await createDiff(currentNode[index], previousNode[index]);
      // const value = await createDiff(currentNode[index], previousNode[index]);

      // if (typeof value === 'undefined') continue;

      // output[index] = value;
    }

    return output;
  }

  if (typeof currentNode === 'undefined' || currentNode === null || currentNode === NaN) {
    return null;
  }

  if (typeof currentNode !== 'object') {
    return currentNode;
  }

  if (typeof currentNode.instance !== 'undefined') {
    return await createDiff(currentNode.instance, previousNode.instance);
  }

  if (currentNode.type !== previousNode.type) {
    return await renderHTML(currentNode);
  }

  // @TODO: Handle this more nicely
  if (JSON.stringify(currentNode.children) === JSON.stringify(previousNode.children)
    && JSON.stringify(currentNode.props) === JSON.stringify(previousNode.props)) {
    return;
  }

  return {
    props: 'DIFF',
    children: await createDiff(currentNode.children, previousNode.children),
  };
}
