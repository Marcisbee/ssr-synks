/* eslint-disable no-underscore-dangle */
function h(type, props = null, ...children) {
  if (props) {
    delete props.__self;
    delete props.__source;
  }

  return {
    type,
    props,
    children,
    state: {},
  };
}

module.exports = {
  h,
};
