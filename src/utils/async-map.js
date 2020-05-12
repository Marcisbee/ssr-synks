module.exports = async function asyncMap(value, fn) {
  const output = [];

  for (const i in value) {
    output.push(await fn(value[i], parseInt(i, 10)));
  }

  return output;
}
