import { renderHTML } from './render-html';

function diffProps(currentProps, previousProps) {
  const currentKeys = Object.keys(currentProps || {});
  const previousKeys = Object.keys(previousProps || {});
  const keys = [
    ...new Set([
      ...currentKeys,
      ...previousKeys,
    ]),
  ];

  return keys.reduce((acc, key) => {
    if (currentProps[key] === previousProps[key]) {
      return acc;
    }

    if (currentProps[key] === undefined) {
      return {
        ...acc,
        [key]: null,
      };
    }

    return {
      ...acc,
      [key]: currentProps[key],
    };
  }, {});
}

function flatNodes(nodes) {
  return nodes
    .flat(2)
    .reduce((acc, node, index) => {
      const previous = acc[index - 1];

      if (typeof previous === 'undefined') {
        return acc.concat(node);
      }

      if (typeof node === 'undefined' || node === null) {
        return acc;
      }

      if (typeof node !== 'object') {
        acc[index - 1] = `${previous}${node}`;
        return acc;
      }

      return acc.concat(node);
    }, []);
}

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
    const flatCurrentNode = flatNodes(currentNode);
    const flatPreviousNode = flatNodes([].concat(previousNode));
    const length = Math.max(flatCurrentNode.length, flatPreviousNode.length || 0);
    const output = {};

    for (let index = 0; index < length; index += 1) {
      output[index] = await createDiff(flatCurrentNode[index], flatPreviousNode[index]);
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
    props: diffProps(currentNode.props, previousNode.props),
    children: await createDiff(currentNode.children, previousNode.children),
  };
}
