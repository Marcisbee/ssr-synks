import { renderComponent } from './render-component';

jest.mock('./render');
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
    type: type,
  });
});
