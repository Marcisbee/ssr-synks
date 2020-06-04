export function h(type, props = null, ...children) {
  return {
    type,
    props,
    children,
    state: {},
  };
}
