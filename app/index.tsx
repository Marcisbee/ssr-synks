import { atom, use } from './db';

let p = 0;

const countAtom = atom(0);

function Counter(props, state, setState) {
  const [count, setCount] = use(countAtom, setState);

  return (
    <button onclick={() => { setCount((c) => c + 1) }}>{count} : {props.p}</button>
  );
}

function Login(props, isAuthorized, authorize) {
  if (isAuthorized) {
    return (
      <div>
        <h1>Hello Mike!</h1>
        <button onclick={() => authorize(false)}>Sign out</button>
      </div>
    );
  }

  return (
    <button onclick={() => { authorize(true) }}>Sign in</button>
  );
}

function Time(props, state = 0, update) {
  setTimeout(update, 1000, state + 1)
  return new Date().toLocaleTimeString();
}

export default function Index(props, state = 0, setState) {
  // setTimeout(setState, 1000, state + 1);

  return (
    <div>
      {state} |
      <div>
        <Time />
      </div>
      <Login />
      <Counter p={p} s={state} />
      <Counter p={p + 1} s={state} />
      <button onclick={() => { setState(state + 1) }}>{p}</button>
    </div>
  );
}
