import { renderComponent } from './render-component';

jest.mock('./active-node');
jest.mock('./destroy-tree');

test('returns correct output', async () => {
  const type = () => { };
  const node = {
    type,
    state: {},
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
    previous: {
      instance: {},
    },
  };
  const output = await renderComponent(node, context);

  expect(output).toEqual({
    state: {},
    children: [
      1,
      2,
      3,
    ],
    props: null,
    type,
  });
});

test('returns correct output instance', async () => {
  const nested = () => [];
  const instance = [
    {
      type: 'div',
      props: null,
      children: [
        {
          type: nested,
          state: {},
          props: null,
          children: [],
        },
        'Hello World',
      ],
    },
  ];
  const previousInstance = [
    {
      type: 'div',
      props: null,
      children: [
        {
          type: nested,
          state: {
            0: 'bar',
          },
          props: null,
          children: [],
        },
        'Hello World',
      ],
    },
  ];
  const type = () => instance;
  const node = {
    type,
    state: {
      0: 'foo',
    },
    props: null,
    children: [],
  };
  const context = {
    index: 0,
    path: [],
    previous: {
      type,
      state: {
        0: 'foo',
      },
      props: null,
      children: [],
      instance: previousInstance,
    },
  };
  const output = await renderComponent(node, context);

  expect(output).toEqual({
    type,
    state: {
      0: 'foo',
    },
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
            state: {
              0: 'bar',
            },
            props: null,
            children: [],
            instance: [],
          },
          'Hello World',
        ],
      },
    ],
  });
});
