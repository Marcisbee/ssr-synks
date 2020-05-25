import { useState, useCookie, useSession } from 'ssr-synks';
import { atom, use } from './db';

let p = 0;

const countAtom = atom(0);

const DB = {};

function Counter(props) {
  const [state, setState] = useState(0);
  const [count, setCount] = use(countAtom, setState);

  return (
    <button onclick={() => { setCount((c) => c + 1) }}>{count} : {props.p}</button>
  );
}

function Login(props) {
  const cookie = useCookie();
  const [isAuthorized, setIsAuthorized] = useState(DB[cookie]);

  function signOut() {
    setIsAuthorized(DB[cookie] = false);
  }

  function signIn() {
    setIsAuthorized(DB[cookie] = true);
  }

  if (isAuthorized) {
    return (
      <div>
        <h1>Hello Mike!</h1>
        <button onclick={signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <button onclick={signIn}>Sign in</button>
  );
}

function Time(props) {
  const [state, setState] = useState(0);
  setTimeout(setState, 1000, state + 1);
  return [new Date().toLocaleTimeString(), ' : ', state];
}

export default function Index(props) {
  const [state, setState] = useState(0);
  const session = useSession();
  const cookie = useCookie();

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
      <p>
        session: {session}
        <br />
        cookie: {cookie}
      </p>
    </div>
  );
}
