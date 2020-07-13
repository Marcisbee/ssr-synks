export function parseProps(current, context) {
  if (!current.props || typeof current.props !== 'object') return;

  const { path } = current;

  Object.entries(current.props).forEach(([key, value]) => {
    if (typeof value !== 'function') return;

    context.addAction(path, key, value);
  });
}
