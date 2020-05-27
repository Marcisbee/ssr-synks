function pathCompress(path) {
  return Buffer.from(path).toString('base64');
}

module.exports = {
  pathCompress,
};
