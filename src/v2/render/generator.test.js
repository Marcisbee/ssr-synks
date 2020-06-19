import { renderGenerator } from './generator.js';

test('returns correct output', async () => {
  function* type() {
    yield null;
  }
  const node = {
    type,
    props: null,
    children: [
      1,
      2,
      3,
    ],
  };
  const context = {
    index: 0,
    path: [],
  };
  const output = await renderGenerator(node, context);

  expect(output).toEqual({
    children: [
      1,
      2,
      3,
    ],
    props: null,
    type,
    instance: null,
    subscribed: [],
  });
});

test('returns correct output instance', async () => {
  function* nested() {
    yield [];
  }
  const instance = [
    {
      type: 'div',
      props: null,
      children: [
        {
          type: nested,
          props: null,
          children: [],
        },
        'Hello World',
      ],
    },
  ];
  function* type() {
    yield instance;
  }
  const node = {
    type,
    props: null,
    children: [],
  };
  const context = {
    index: 0,
    path: [],
  };
  const output = await renderGenerator(node, context);

  expect(output).toEqual({
    type,
    props: null,
    children: [],
    instance: [
      {
        type: 'div',
        path: [0],
        props: null,
        children: [
          {
            type: nested,
            path: [0, 0],
            props: null,
            children: [],
            instance: [],
            subscribed: [],
          },
          'Hello World',
        ],
      },
    ],
    subscribed: [],
  });
});
