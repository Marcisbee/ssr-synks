import { renderArray } from './render/array.js';
import { renderComponent } from './render/component.js';
import { renderContext } from './render/context.js';
import { renderGenerator } from './render/generator.js';
import { CONTEXT_INSTANCE } from './symbols.js';
import { isComponent } from './utils/is-component.js';
import { isContext } from './utils/is-context.js';
import { isGenerator } from './utils/is-generator.js';
import { parseProps } from './utils/parse-props.js';

export async function render(current, context) {
  context = {
    ...context,
    path: context.path.slice(),
  };

  if (current instanceof Array) {
    return renderArray(current, context);
  }

  if (current === undefined || current === null || typeof current !== 'object') {
    return current;
  }

  if (current[CONTEXT_INSTANCE]) {
    throw new Error(`Context "${current.constructor.name}" instance used in view layer`);
  }

  context.path.push(context.index);
  current.path = context.path;

  if (isContext(current.type)) {
    return renderContext(current, context);
  }

  if (isGenerator(current.type)) {
    return renderGenerator(current, context);
  }

  if (isComponent(current.type)) {
    return renderComponent(current, context);
  }

  parseProps(current, context);

  if (current.children && current.children.length > 0) {
    current.children = await renderArray(
      current.children,
      {
        ...context,
        index: 0,
      },
    );
  }

  return current;
}
