import { toHTML } from './to-html.js';

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

/**
 * @param {any} next
 * @param {any} previous
 */
export async function diffTree(next, previous) {
  if (next === previous) {
    return undefined;
  }

  if (typeof previous === 'undefined' || previous === null) {
    return {
      type: 1,
      children: await toHTML(next),
    };
  }

  if (next instanceof Array) {
    const previousList = [].concat(previous);
    const length = Math.max(next.length, previousList.length || 0);
    const output = {};

    for (let index = 0; index < length; index += 1) {
      output[index] = await diffTree(next[index], previousList[index]);
    }

    return output;
  }

  if (typeof next === 'undefined' || next === null) {
    return undefined;
  }

  if (typeof next !== 'object') {
    return next;
  }

  if (typeof next.instance !== 'undefined') {
    const out = await diffTree(next.instance, previous.instance);

    if (typeof out === 'undefined') {
      return undefined;
    }

    if (out && out.props && out.children) {
      const propValues = Object.values(out.props).filter((key) => typeof key !== 'undefined');
      const childrenValues = Object.values(out.children).filter((key) => typeof key !== 'undefined');

      if (propValues.length === 0 && childrenValues.length === 0) {
        return undefined;
      }
    }

    return {
      type: 2,
      children: [].concat(out),
    };
  }

  if (next.type !== previous.type) {
    return {
      type: 1,
      children: await toHTML(next),
    };
  }

  // @TODO: Handle this more nicely
  const childrenEqual = JSON.stringify(next.children)
    === JSON.stringify(previous.children);
  const propsEqual = JSON.stringify(next.props)
    === JSON.stringify(previous.props);
  if (childrenEqual && propsEqual) {
    return undefined;
  }

  if (typeof next.type === 'function') {
    const out = await diffTree(next.children, previous.children);

    if (typeof out === 'undefined') {
      return undefined;
    }

    if (out && typeof out === 'object') {
      const objectValues = Object.values(out).filter((key) => typeof key !== 'undefined');

      if (objectValues.length === 0) {
        return undefined;
      }
    }

    return {
      type: 2,
      children: [].concat(out),
    };
  }

  return {
    props: diffProps(next.props, previous.props),
    children: await diffTree(next.children, previous.children),
  };
}
