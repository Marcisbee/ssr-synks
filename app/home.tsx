import Resync from 'resync';

import { atom, use } from './db';

let p = 0;

const countAtom = atom(0);

const DB = {};

function Counter(props) {
  const [state, setState] = Resync.useState(0);
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
  const cookie = Resync.useCookie();
  const [user, setUser] = Resync.useState(DB[cookie]);
  const [error, setError] = Resync.useState(null);

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
        123
        <button type="button" onclick={signOut}>Sign out</button>
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
  const [state, setState] = Resync.useState(0);
  setTimeout(setState, 1000, state + 1);
  return [new Date().toLocaleTimeString(), ' : ', state];
}

function ControlledInput() {
  const [state, setState] = Resync.useState('');

  return (
    <div>
      <strong>{state}</strong><br />
      <input
        type="text"
        oninput={({ value }) => {
          setState(value);
        }}
        value={state}
      />
    </div>
  );
}

export default function Home(props) {
  const [state, setState] = Resync.useState(0);
  const session = Resync.useSession();
  const cookie = Resync.useCookie();

  return (
    <div>
      {state} |
      {/* <div>
        <Time />
      </div> */}
      <Login />
      <ControlledInput />
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
