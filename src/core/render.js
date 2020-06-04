import { renderChildren } from './render-children';
import { updateProps } from './update-props';
import { renderArray } from './render-array';
import { renderComponent } from './render-component';

export async function render(current, context) {
  context = {
    ...context,
    path: context.path.slice(),
  };

  if (current instanceof Array) {
    context.previous = context.previous || [];
    return renderArray(current, context);
  }

  if (current === undefined || current === null || typeof current !== 'object') {
    return current;
  }

  if (current.type instanceof Function) {
    current.path = context.path.concat(context.index);
    if (!context.previous) {
      context.previous = {
        instance: {},
      };
    }
    return renderComponent(current, context);
  }

  context.path.push(context.index);
  current.path = context.path;

  updateProps(current, context);

  if (current.children && current.children.length > 0) {
    await renderChildren(current, {
      ...context,
      index: 0,
    });
  }

  return current;
}
