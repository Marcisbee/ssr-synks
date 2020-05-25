function h(type, props = null, ...children) {
  if (props) {
    delete props.__self;
    delete props.__source;
  }

  return {
    type,
    props,
    children,
  };
}

module.exports = {
  h,
};
