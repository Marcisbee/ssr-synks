let p = 0;

function Counter(props, count = 0, setCount) {
  return (
    <button onclick={() => { setCount(count + 1) }}>{count} | {props.s} | {props.p} | {p++}</button>
  );
}

export default function Index(props, state = 0, setState) {
  // setTimeout(setState, 1000, state + 1);

  return (
    <div>
      {state} |
      <Counter p={p} s={state} />
      <button onclick={() => { setState(state + 1) }}>{p}</button>
    </div>
  );
}
