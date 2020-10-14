import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { diff } from './diff.js';
import Resync from './index.js';

const { h, render } = Resync;

const test = suite('Diff');

function Component() {
  return h('span', { disabled: true }, 1, 2, 3);
}

const tree1 = h('div', { class: 'foo', id: 'pop' }, 'Hello world', h(Component));

const tree2 = h('div', { class: 'bar', id: 'pop' }, 'Hello moon', h('span', {}, 1, 2, 4));

test('first', () => {
  const diffValues = diff(render(tree1), render(tree2));

  // assert.equal(
  //   diffValues[0],
  //   {
  //     type: 0,
  //     vnode: { value: 'Hello moon', id: [0, 0] },
  //     id: '0.0',
  //     diff: 'Hello moon',
  //   },
  // );

  // assert.equal(
  //   diffValues[1],
  //   {
  //     type: 4,
  //     vnode: {
  //       type: Component,
  //       props: null,
  //       children: [],
  //       instance: {
  //         type: 'span',
  //         props: {
  //           disabled: true,
  //         },
  //         children: [
  //           {
  //             value: '123',
  //           },
  //         ],
  //       },
  //       id: [0, 1],
  //     },
  //     id: '0.1',
  //     diff: null,
  //   },
  // );

  assert.equal(
    diffValues[2],
    {
      type: 3,
      vnode: {
        type: 'span',
        props: {},
        children: [
          {
            value: '124',
            id: [0, 1, 1],
          },
        ],
        id: [0, 1],
      },
      id: '0.1',
      diff: '<span>124</span>',
    },
  );

  assert.equal(
    diffValues[3],
    {
      type: 2,
      vnode: {
        type: 'div',
        props: { class: 'bar', id: 'pop' },
        children: [
          {
            value: 'Hello moon',
            id: [0, 0],
          },
          {
            type: 'span',
            props: {},
            children: [
              {
                value: '124',
                id: [0, 1, 1],
              },
            ],
            id: [0, 1],
          },
        ],
        id: [0],
      },
      id: '0',
      diff: { class: 'bar' },
    },
  );
});

test.run();
