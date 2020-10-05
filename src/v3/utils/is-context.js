export function isContext(value) {
  if (typeof value !== 'function') return false;

  const prototype = Object.getOwnPropertyDescriptor(value, 'prototype');

  return prototype && !prototype.writable;
}
