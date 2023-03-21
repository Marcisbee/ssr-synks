import Resync from 'resync';

export function DefaultLayout({ children }: { children?: any }) {
  return (
    <div id="app">
      <a class="skip-link" href="#maincontent">Skip to main</a>

      <nav class="pagination">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/users/1">Tom</a>
        <a href="/users/2">Jane</a>
        <a href="/error">error</a>
      </nav>

      <main id="maincontent">
        {children}
      </main>
    </div>
  );
}
