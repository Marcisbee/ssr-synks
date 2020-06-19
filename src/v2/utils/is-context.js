export function isContext(value) {
  return typeof value === 'function' && !Object.getOwnPropertyDescriptor(value, 'prototype').writable;
}
