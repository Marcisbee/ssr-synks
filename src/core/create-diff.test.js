const createDiff = require('./create-diff');

test('returns "" with input null, undefined', async () => {
  const output = await createDiff(null, undefined);

  expect(output).toEqual('');
});

test('returns undefined with same input 1, 1', async () => {
  const output = await createDiff(1, 1);

  expect(output).toEqual(undefined);
});

test('returns fully replaced html node', async () => {
  const output = await createDiff(
    { type: 'div', props: {}, path: [1] },
    { type: 'span', props: {}, path: [1] }
  );

  expect(output).toEqual('<div data-sx=\"MQ==\"></div>');
});

test('returns diff for equal node', async () => {
  const output = await createDiff(
    {
      type: 'div',
      props: {},
      children: [
        'Hello world',
        {
          type: 'p'
        },
        1
      ],
      path: [1]
    },
    {
      type: 'div',
      props: {},
      children: [
        {
          type: 'span'
        },
        {
          type: 'p'
        },
        1,
        "0"
      ],
      path: [1]
    }
  );

  expect(output).toEqual({
    children: {
      0: 'Hello world',
      1: undefined,
      2: undefined,
      3: null,
    },
    props: 'DIFF'
  });
});
