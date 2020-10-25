import Resync from 'resync';

import routes from './routes';
import { CounterContext } from './counter';

function cc(value) {
  if (Array.isArray(value)) {
    return value
      .map(cc)
      .filter((a) => !!a);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => val && cc(key))
      .filter((a) => !!a);
  }

  if (!value) {
    return null;
  }

  return String(value);
}

function* App() {
  const router = yield Resync.Router;

  const aboutClass = {
    active: router.path === '/about',
  };

  function onClick(event) {
    console.log(event, 'runs on server');
  }

  onClick.client = function () {
    console.log(this, 'runs on client');
  }

  while (true) {
    const props = {}
    if (router.path === '/about') {
      props.class = 'cool-class';
    }
    yield (
      <header>
        <nav class="pagination">
          <a href="/">Home</a>
          <a href="/about" {...props}>About</a>
          <a href="/users/1">Tom</a>
          <a href="/users/2">Jane</a>
        </nav>
        <main id="maincontent">
          <CounterContext>
            <Resync.RouterOutlet routes={routes} />
          </CounterContext>
        </main>
      </header>
    );
  }
}

export default function Index() {
  return (
    <div id="app">
      <a class="skip-link" href="#maincontent">Skip to main</a>
      <App />
    </div>
  );
}

// export default function Index() {
//   return (
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Document</title>
//         <meta name="Description" content="Put your description here." />
//         {/* <script>
//           {"window.${config.session.name} = ${JSON.stringify(sessionId)};"}
//         </script> */}
//         {/* ${css || ''} */}
//         {/* <style>
//           * {
//             animation: 0.5s render forwards;
//           }

//           @keyframes render {
//             0% {
//               box-shadow: inset 0 0 0 500px yellow;
//             }
//             100% {
//               box-shadow: inset 0 0 0 500px transparent;
//             }
//           }

//           body.connected:before {
//             display: block;
//             content: 'Connected';
//             position: absolute;
//             bottom: 10px;
//             right: 10px;
//             padding: 5px 10px;
//             background-color: red;
//             color: #fff;
//             border-radius: 4px;
//           }
//           body:not(.connected):before {
//             display: block;
//             content: 'Offline';
//             position: absolute;
//             bottom: 10px;
//             right: 10px;
//             padding: 5px 10px;
//             background-color: gray;
//             color: #fff;
//             border-radius: 4px;
//           }
//         </style> */}
//         <script src="/client.js"></script>
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Primer/14.4.0/primer.css" />
//       </head>

//       <body>
//         <div id="app">
//           <a class="skip-link" href="#maincontent">Skip to main</a>
//           <App />
//         </div>
//         <script>ResyncConnect();</script>
//       </body>

//     </html>
//   );
// }
