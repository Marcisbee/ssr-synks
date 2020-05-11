const socket = new WebSocket("ws://localhost:52275");

const events = {};

Object.keys(window).forEach(key => {
  if (/^on/.test(key)) {
    window.addEventListener(key.slice(2), event => {
      if (!(events[key] instanceof Array)) return;

      events[key].forEach(([el, fn]) => {
        if (el !== event.target) return;

        fn(event);
      });
    });
  }
});

socket.onopen = function (e) {
  connection.innerHTML = 'open';
  console.log("[open] Connection established");
  console.log("Sending to server");

  events.onclick = [
    [increment, (e) => {
      console.log(e, e.target, e.target.id);
      socket.send(`fn:${e.target.id}`);
    }]
  ];

  // socket.send("My name is John");
};

socket.onmessage = function (event) {
  const update = JSON.parse(event.data);

  Object.keys(update).forEach((key) => {
    document.getElementById(key).innerHTML = update[key];
  });

  connection.innerHTML = `data: ${event.data}`;
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function (event) {
  connection.innerHTML = 'close';
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function (error) {
  connection.innerHTML = `error: ${error.message}`;
  console.error(error);
  console.error(`[error] ${error.message}`);
};