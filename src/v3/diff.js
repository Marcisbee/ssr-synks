import { ComponentVnode } from './nodes/component.js';
import { ElementVnode } from './nodes/element.js';
import { PatchVnode } from './nodes/patch.js';
import { TextVnode } from './nodes/text.js';

const TEXT = 0;
const NODE = 1;
const PROPS = 2;
const INSERT = 3;
const REMOVE = 4;

export function diff(nodeBefore, nodeAfter) {
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

    return changes.concat(
      diff(nodeAfter.instance, nodeBefore.instance),
    );
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