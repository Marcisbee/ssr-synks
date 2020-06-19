import { render } from '../render.js';
import { mergePrimitives } from '../utils/merge-primitives.js';

export async function renderArray(currentArray, context) {
  const output = [];
  let length = context.index;

  for (const i in currentArray) {
    const newContext = {
      ...context,
      index: length,
    };
    const result = await render(currentArray[i], newContext);

    mergePrimitives(output, result);

    length = context.index + output.length;
  }

  return output;
}
