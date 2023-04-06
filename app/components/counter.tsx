import Resync from 'resync';

export class CounterContext {
  count = 0;

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

export function* Counter2() {
  const counter = yield CounterContext;

  while (true) {
    yield (
      <div>
        <h1>{counter.count}</h1>
        {counter.count % 2 ? <b>odd</b> : 'even'}
        <br />
        <button class="btn mr-2" onclick={counter.increment}>+</button>
        <button class="btn mr-2" onclick={counter.decrement}>-</button>
      </div>
    );
  }
}

export function Counter() {
  return (
    <CounterContext>
      <Counter2 />
    </CounterContext>
  );
}
