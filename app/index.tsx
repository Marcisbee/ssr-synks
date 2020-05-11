function h() {
  return 'hey';
}

export default function Index(props, [state = new Date(), update]) {
  setTimeout(update, 1000, new Date());

  return (
    <div>
      <h1>Hello {state}</h1>
    </div>
  );
}

console.log(Index(null, [undefined, () => {}]));
