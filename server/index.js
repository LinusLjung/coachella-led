const WebSocket = require('ws');
const os = require('os');

const wss = new WebSocket.Server({ port: 8080 });

function getIPAddresses() {
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
}

let host;
const clients = [];

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    parsed = JSON.parse(message);

    console.log(parsed);

    switch (parsed.type) {
      case 'CLIENT_TYPE':
        parsed.value.ws = ws;

        if (parsed.value.type === 'host') {
          host = parsed.value;
        } else {
          const index = clients.findIndex(client => client.id === parsed.value.id);

          if (index > -1) {
            clients[index] = parsed.value;
          } else {
            clients.push(parsed.value);
          }

          console.log(clients);

          ws.send(JSON.stringify({
            type: 'CONNECTED'
          }));
        }

        break;
      case 'GET_DATA':
        host.ws.send(message);

        break;
      case 'DATA':
        clients.forEach(({ ws }) => ws.send(message));

        break;

      default:
        host.ws.send(message);
    }
  });

  console.log('New connection');
});
