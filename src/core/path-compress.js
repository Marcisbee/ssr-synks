export function pathCompress(path) {
  return Buffer.from(path).toString('base64');
}
