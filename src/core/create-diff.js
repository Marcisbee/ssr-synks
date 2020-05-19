const renderHTML = require('./render-html');

/**
 * @param {any} currentNode
 * @param {any} previousNode
 */
module.exports = function createDiff(currentNode, previousNode) {
  if (!previousNode) {
    return renderHTML(currentNode);
  }
}
