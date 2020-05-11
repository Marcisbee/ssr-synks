import * as Ssr from 'ssr-synks';

export default function Index(props) {
  setTimeout(() => this.next(), 1000);

  return (
    <div>
      <p>Hello {new Date().toISOString()} | {props.sessionId}</p>
    </div>
  );
}
