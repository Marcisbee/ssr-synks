import Resync from 'resync';

export class CounterContext {
  count = 0;
  increment = () => {
    this.count += 1;
  };
}

export function* Counter() {
  const counter = yield CounterContext;

  function increment() {
    counter.count += 1;
  }

  function decrement() {
    counter.count -= 1;
  }

  while (true) {
    yield (
      <div>
        <h1>{counter.count}</h1>
        {counter.count % 2 && <b>boop</b>}
        <button class="btn mr-2" onclick={increment}>+</button>
        <button class="btn mr-2" onclick={decrement}>-</button>
        <br />
        <button class="btn btn-sm" onclick={counter.increment}>+</button>
      </div>
    );
  }
}
