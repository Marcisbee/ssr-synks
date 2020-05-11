let count = 0;

module.exports = function App() {
  return `<div>
  <h1 id="count">${count}</h1>
  <button id="increment">+</button>

  <p id="connection">idle</p>
</div>`
}