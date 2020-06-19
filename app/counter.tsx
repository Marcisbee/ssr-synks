import Resync from 'resync';

export class CounterContext {
  count = 0;
  increment = () => {
    this.count += 1;
  };
}

export function* Counter() {
  const counter = yield CounterContext;

  while (true) {
    yield (
      <div>
        <h1>{counter.count}</h1>
        <button onclick={counter.increment}>+</button>
      </div>
    );
  }
}
