import * as Ssr from 'ssr-synks';

function Counter(props, count = 0, setCount) {
  return (
    <button onclick={setCount}>{count}</button>
  );
}

export default function Index(props, state = 0, setState) {
  setTimeout(setState, 1000, state + 1);

  return (
    <div>
      {state} |
      <Counter />
    </div>
  );
}
