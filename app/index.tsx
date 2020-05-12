import * as Ssr from 'ssr-synks';

export default function Index(props, state = 0, setState) {
  setTimeout(setState, 1000, state + 1);

  return (
    <div>
      <p>Hello {state} | {props.sessionId}</p>
    </div>
  );
}
