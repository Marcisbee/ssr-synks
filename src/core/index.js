import { h } from './h.js';
import { render } from './render.js';

export default {
  h,
  render,
};

// --- usage

// function Component() {
//   return h('span', { disabled: true }, 1, 2, 3);
// }

// const tree1 = h('div', { class: 'foo', id: 'pop' }, 'Hello world', h(Component));

// const tree2 = h('div', { class: 'bar', id: 'pop' }, 'Hello moon', h('span', {}, 1, 2, 4));

// console.log(diff(render(tree1), render(tree2)));

// console.log(diff(render(1), render(2)));

// console.log(diff(render(1), render(1)));
