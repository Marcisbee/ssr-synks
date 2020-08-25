/* eslint-disable max-classes-per-file */
class Vnode { }

class TextVnode extends Vnode {
  constructor(value) {
    super();

    this.value = value;
  }
}

class ElementVnode extends Vnode {
  constructor(type, props, children) {
    super();

    this.type = type;
    this.props = props;
    this.children = children;
  }
}

class ComponentVnode extends Vnode {
  constructor(type, props, children) {
    super();

    this.type = type;
    this.props = props;
    this.children = children;
    this.instance = null;
  }
}

function isPrimitive(value) {
  return value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function transformPrimitives(child) {
  if (isPrimitive(child)) {
    return new TextVnode(child);
  }

  return child;
}

function mergePrimitives(acc, value) {
  if (acc.length === 0) {
    return [value];
  }

  const lastValue = acc[acc.length - 1];

  if (isPrimitive(lastValue) && isPrimitive(value)) {
    return acc.slice(0, -1).concat(`${lastValue}${value}`);
  }

  return acc.concat(value);
}

function h(type, props = null, ...childrenRaw) {
  const children = childrenRaw
    .flat()
    .reduce(mergePrimitives, [])
    .map(transformPrimitives);

  if (typeof type === 'function') {
    return new ComponentVnode(
      type,
      props,
      children,
    );
  }

  return new ElementVnode(
    type,
    props,
    children,
  );
}

function render(nodeRaw, id = [0]) {
  const node = transformPrimitives(nodeRaw);

  node.id = id;

  if (node instanceof ComponentVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index)),
    );

    node.instance = node.type.call({}, { ...node.props, children: node.children });

    return node;
  }

  if (node instanceof ElementVnode) {
    node.children = node.children.map(
      (child, index) => render(child, id.concat(index)),
    );

    return node;
  }

  return node;
}

const TEXT = 0;
const NODE = 1;
const PROPS = 2;
const INSERT = 3;
const REMOVE = 4;

class PatchVnode {
  constructor(type, vnode, value = null) {
    this.type = type;
    this.vnode = vnode;
    this.id = vnode.id.join('.');
    this.diff = value;
  }
}

function diff(nodeBefore, nodeAfter) {
  const changes = [];

  changes.vnode = nodeAfter;

  if (nodeBefore instanceof TextVnode && nodeAfter instanceof TextVnode) {
    if (nodeBefore.value !== nodeAfter.value) {
      return changes.concat(
        new PatchVnode(TEXT, nodeAfter, nodeAfter.value),
      );
    }

    return changes;
  }

  if (nodeBefore instanceof ComponentVnode && nodeAfter instanceof ComponentVnode) {
    if (nodeBefore.type !== nodeAfter.type) {
      return changes.concat(
        new PatchVnode(REMOVE, nodeBefore),
        new PatchVnode(INSERT, nodeAfter, nodeAfter),
      );
    }

    // @TODO: Render component here

    return changes;
  }

  if (nodeBefore instanceof ElementVnode && nodeAfter instanceof ElementVnode) {
    if (nodeBefore.type !== nodeAfter.type) {
      return changes.concat(
        new PatchVnode(REMOVE, nodeBefore),
        new PatchVnode(INSERT, nodeAfter, nodeAfter),
      );
    }

    // Iterate children
    const childLength = Math.max(
      nodeBefore.children.length,
      nodeAfter.children.length,
    );
    let childIndex = 0;
    while (childIndex < childLength) {
      changes.push(
        ...diff(
          nodeBefore.children[childIndex],
          nodeAfter.children[childIndex],
        ),
      );
      childIndex += 1;
    }

    // Iterate props
    const propsKeys = Array.from(
      new Set(
        Object.keys(nodeBefore.props)
          .concat(Object.keys(nodeAfter.props)),
      ),
    );
    const propsDiff = propsKeys.reduce(
      (acc, key) => {
        const propBefore = (nodeBefore.props || {})[key];
        const propAfter = (nodeAfter.props || {})[key];

        if (propAfter === undefined) {
          return {
            ...acc,
            [key]: null,
          };
        }

        if (propBefore !== propAfter) {
          return {
            ...acc,
            [key]: propAfter,
          };
        }

        return acc;
      },
      null,
    );
    if (propsDiff) {
      return changes.concat(
        new PatchVnode(PROPS, nodeAfter, propsDiff),
      );
    }

    return changes;
  }

  if (nodeBefore !== undefined && nodeAfter === undefined) {
    return changes.concat(
      new PatchVnode(REMOVE, nodeBefore),
    );
  }

  if (nodeBefore.constructor.name !== nodeAfter.constructor.name) {
    return changes.concat(
      new PatchVnode(REMOVE, nodeBefore),
      new PatchVnode(INSERT, nodeAfter, nodeAfter),
    );
  }

  return changes;
}

export {
  h,
  render,
  diff,
};


// --- usage

// function Component() {
//   return h('span', { disabled: true }, 1, 2, 3);
// }

// const tree1 = h('div', { class: 'foo', id: 'pop' }, 'Hello world', h(Component));

// const tree2 = h('div', { class: 'bar', id: 'pop' }, 'Hello moon', h('span', {}, 1, 2, 4));

// console.log(diff(render(tree1), render(tree2)));

// console.log(diff(render(1), render(2)));

// console.log(diff(render(1), render(1)));
