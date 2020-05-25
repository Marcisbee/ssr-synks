function pathDecompress(path) {
  return Buffer.from(path, 'base64').toString();
}

module.exports = {
  pathDecompress,
};
