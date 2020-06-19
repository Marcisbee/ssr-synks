import { render } from '../render.js';
import { prepareProps } from '../utils/prepare-props.js';

export async function renderComponent(current, context) {
  const props = prepareProps(current);
  const rawInstance = await current.type(props);

  current.instance = await render(rawInstance, context);

  return current;
}
