module.exports = function pathDecompress(path) {
  return Buffer.from(path, 'base64').toString();
}
