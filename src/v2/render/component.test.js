import { renderComponent } from './component.js';

test('returns correct output', async () => {
  const type = () => { };
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
  const output = await renderComponent(node, context);

  expect(output).toEqual({
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
    props: null,
    children: [],
  };
  const context = {
    index: 0,
    path: [],
  };
  const output = await renderComponent(node, context);

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
          },
          'Hello World',
        ],
      },
    ],
  });
});
