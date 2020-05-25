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

function validateUsername(username) {
  if (!username) {
    return 'Username cannot be empty!';
  }

  if (username === 'restricted') {
    return `Username cannot be "${username}"!`;
  }
}

function Login(props) {
  const cookie = useCookie();
  const [user, setUser] = useState(DB[cookie]);
  const [error, setError] = useState(null);

  function signOut() {
    setUser(DB[cookie] = null);
  }

  function signIn(event) {
    const username = event.values.username;

    const invalid = validateUsername(username);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setUser(DB[cookie] = username);
  }

  if (user) {
    return (
      <div>
        <h1>Hello {user}!</h1>
        <button onclick={signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <form action="javascript:void(0);" onsubmit={signIn}>
      <input type="text" name="username" />
      <button type="submit">Sign in</button>
      {error && (
        <p>{error}</p>
      )}
    </form>
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
