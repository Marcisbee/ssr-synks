import { renderHTML } from './render-html';

/**
 * @param {any} currentNode
 * @param {any} previousNode
 */
export async function createDiff(currentNode, previousNode) {
  if (currentNode === previousNode) {
    return undefined;
  }

  if (typeof previousNode === 'undefined' || previousNode === null) {
    return renderHTML(currentNode);
  }

  if (currentNode instanceof Array) {
    const length = Math.max(currentNode.length, previousNode.length || 0);
    const output = {};

    for (let index = 0; index < length; index += 1) {
      output[index] = await createDiff(currentNode[index], previousNode[index]);
    }

    return output;
  }

  if (typeof currentNode === 'undefined' || currentNode === null) {
    return null;
  }

  if (typeof currentNode !== 'object') {
    return currentNode;
  }

  if (typeof currentNode.instance !== 'undefined') {
    return createDiff(currentNode.instance, previousNode.instance);
  }

  if (currentNode.type !== previousNode.type) {
    return renderHTML(currentNode);
  }

  // @TODO: Handle this more nicely
  const childrenEqual = JSON.stringify(currentNode.children)
    === JSON.stringify(previousNode.children);
  const propsEqual = JSON.stringify(currentNode.props)
    === JSON.stringify(previousNode.props);
  if (childrenEqual && propsEqual) {
    return undefined;
  }

  return {
    props: 'DIFF',
    children: await createDiff(currentNode.children, previousNode.children),
  };
}
