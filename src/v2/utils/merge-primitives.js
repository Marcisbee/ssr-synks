import { isNode } from './is-node.js';

function normalizePrimitive(primitive) {
  if (primitive === null) {
    return '';
  }

  return primitive;
}


export function mergePrimitives(output, currentRaw) {
  const currentArray = Array.prototype.concat.call([], currentRaw).flat(5);

  currentArray.forEach((current) => {
    if (output.length === 0) {
      output.push(
        normalizePrimitive(current),
      );
      return;
    }

    if (isNode(current)) {
      output.push(current);
      return;
    }

    const [previous] = output.slice(-1);

    if (previous !== null && typeof previous === 'object') {
      output.push(
        normalizePrimitive(current),
      );
      return;
    }

    output[output.length - 1] = `${String(previous)}${String(normalizePrimitive(current))}`;
  });
}
