import { render } from '../render.js';
import { unsubscribeTree } from '../unsubscribe-tree.js';
import { isContext } from '../utils/is-context.js';
import { prepareProps } from '../utils/prepare-props.js';

export async function renderGenerator(current, context) {
  const props = prepareProps(current);
  const iterable = (await current.type(props));
  let rawInstance = iterable.next();

  if (!current.subscribed) {
    current.subscribed = [];
  }

  const update = async () => {
    const previousInstance = current.instance;

    // Tree is unsubscribed, no need to update this
    if (current.isUnsubscribed) {
      return;
    }

    current.instance = null;
    unsubscribeTree(previousInstance);

    rawInstance = await iterable.next();

    // @TODO: Clear context actions for this tree before render
    current.instance = await render(rawInstance && rawInstance.value, context);

    // @TODO: Figure out how to get correct path
    context.onUpdate(current.instance.path, current.instance, previousInstance);
  };

  while (isContext(rawInstance.value)) {
    const contestName = rawInstance.value.name;
    const currentContext = context.instances[contestName];

    if (typeof currentContext === 'undefined') {
      throw new Error(`Trying to access "${contestName}" in <${current.type.name}> component, but it was not defined in parent tree`);
    }

    const [contextInstance, subscribe] = context.instances[contestName];

    current.subscribed.push(
      subscribe(update),
    );

    rawInstance = await iterable.next(contextInstance);
  }

  current.instance = await render(rawInstance && rawInstance.value, context);

  return current;
}
