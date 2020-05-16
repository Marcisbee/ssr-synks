import { atom, use } from './db';

let p = 0;

const countAtom = atom(0);

function Counter(props, state, setState) {
  const [count, setCount] = use(countAtom, setState);

  return (
    <button onclick={() => { setCount((c) => c + 1) }}>{count} : {props.p}</button>
  );
}

export default function Index(props, state = 0, setState) {
  // setTimeout(setState, 1000, state + 1);

  return (
    <div>
      {state} |
      <Counter p={p} s={state} />
      <Counter p={p + 1} s={state} />
      <button onclick={() => { setState(state + 1) }}>{p}</button>
    </div>
  );
}
