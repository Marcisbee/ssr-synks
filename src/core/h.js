module.exports = function h(type, props, ...children) {
  const key = props && props.key

  return {
    type,
    props,
    children,
    key: key === undefined ? null : key,
  };
}
