import SSR from 'ssr-synks';

export class Counter {
  count = 0;
  increment = () => {
    this.count += 1;
  };
}

export function* Test() {
  const counter = yield Counter;

  while (true) {
    yield (
      <div>
        <h1>{counter.count}</h1>
        <button onclick={counter.increment}>+</button>
      </div>
    );
  }
}
