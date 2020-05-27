import { renderArray } from './render-array';

export async function renderChildren(current, context) {
  const newContext = {
    ...context,
    previous: (context.previous && context.previous.children) || [],
  };
  current.children = await renderArray(current.children, newContext);
}
