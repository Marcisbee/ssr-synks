const { render } = require('./render');

function getNestedArrayLength(value) {
  if (!(value instanceof Array)) {
    return 1;
  }

  return value.reduce(
    (sum, item) => sum + getNestedArrayLength(item),
    0,
  );
}

module.exports = async function renderArray(current, context) {
  const { previous, index } = context;
  const output = [];
  let length = index;

  for (const i in current) {
    const newContext = {
      ...context,
      previous: previous && previous[i],
      index: length,
    };
    const result = await render(current[i], newContext);

    length += getNestedArrayLength(result);
    output.push(result);
  }

  return output;
};
