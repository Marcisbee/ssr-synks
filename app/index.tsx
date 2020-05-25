import { useState } from 'ssr-synks';
import { atom, use } from './db';

let p = 0;

const countAtom = atom(0);

function Counter(props) {
  const [state, setState] = useState(0);
  const [count, setCount] = use(countAtom, setState);

  return (
    <button onclick={() => { setCount((c) => c + 1) }}>{count} : {props.p}</button>
  );
}

function Login(props) {
  const [isAuthorized, authorize] = useState(false);

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

function Time(props) {
  const [state, setState] = useState(0);
  setTimeout(setState, 1000, state + 1);
  return [new Date().toLocaleTimeString(), ' : ', state];
}

export default function Index(props) {
  const [state, setState] = useState(0);

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
