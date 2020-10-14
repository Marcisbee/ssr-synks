export function parseProps(current, context) {
  if (!current.props || typeof current.props !== 'object') return;

  const { id } = current;

  Object.entries(current.props).forEach(([key, value]) => {
    if (typeof value !== 'function') return;

    context.addAction(id, key, value);
  });
}
