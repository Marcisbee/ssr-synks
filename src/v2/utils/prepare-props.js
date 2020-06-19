export function prepareProps(current) {
  return {
    ...current.props,
    children: current.children,
  };
}
