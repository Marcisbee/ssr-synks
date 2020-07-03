import { diffTree } from './diff-tree.js';

test('returns "" with input null, undefined', async () => {
  const output = await diffTree(null, undefined);

  expect(output).toEqual({ children: [''], type: null });
});

test('returns undefined with same input 1, 1', async () => {
  const output = await diffTree(1, 1);

  expect(output).toEqual(undefined);
});

test('returns undefined with same input 0, 0', async () => {
  const output = await diffTree(0, 0);

  expect(output).toEqual(undefined);
});

test('returns fully replaced html node', async () => {
  const output = await diffTree(
    { type: 'div', props: {}, path: [1] },
    { type: 'span', props: {}, path: [1] },
  );

  expect(output).toEqual({ type: null, children: ['<div ></div>'] });
});

test('returns component', async () => {
  const comp = () => { };
  const output = await diffTree(
    {
      type: comp,
      props: {},
      children: [
        {
          type: comp,
          props: {},
          children: [
            {
              type: 'strong',
              props: {},
              children: [
                1,
              ],
            },
          ],
        },
      ],
    },
    {
      type: comp,
      props: {},
      children: [
        {
          type: comp,
          props: {},
          children: [
            {
              type: 'strong',
              props: {},
              children: [
                2,
              ],
            },
          ],
        },
      ],
    },
  );

  expect(output).toEqual({
    0: {
      0: {
        props: {},
        children: {
          0: 1,
        },
      },
    },
  });
});

test('returns undefined for deeply equal node', async () => {
  const output = await diffTree(
    {
      type: 'div', props: {}, path: [1], children: [1],
    },
    {
      type: 'div', props: {}, path: [1], children: [1],
    },
  );

  expect(output).toEqual(undefined);
});

test('returns diff for equal node', async () => {
  const output = await diffTree(
    {
      type: 'div',
      props: {
        data: '1',
        class: 'foo',
        onclick() { },
      },
      children: [
        'Hello world',
        {
          type: 'p',
        },
        1,
      ],
      path: [1],
    },
    {
      type: 'div',
      props: {
        data: '1',
        class: 'foo4',
        id: 'bar',
      },
      children: [
        {
          type: 'span',
        },
        {
          type: 'p',
        },
        1,
        '0',
      ],
      path: [1],
    },
  );

  expect(output).toEqual({
    children: {
      0: 'Hello world',
      1: undefined,
      2: undefined,
      3: null,
    },
    props: {
      class: 'foo',
      id: null,
      onclick: expect.any(Function),
    },
  });
});
