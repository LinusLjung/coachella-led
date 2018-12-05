const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const screens = {};

function actionGetScreens() {
  return {
    action: 'GET_SCREENS',
    screens,
  };
}

wss.on('connection', function (client) {
  console.log('connection');

  client.on('message', function (message) {
    parsed = JSON.parse(message);
    action = parsed.action;

    console.log(parsed);

    switch (action) {
      case 'REGISTER_SCREEN':
        client.id = parsed.id;

      case 'SET_SCREEN_STATE':
        screens[parsed.id] = parsed.screen;

        wss.clients.forEach(function (c) {
          if (c.id === client.id) {
            return;
          }

          try {
            c.send(message)
          } catch (e) {
            console.log('Tried to send message to client');
            console.log(e);
          }
        });

        break;
      case 'GET_SCREENS':
        client.send(JSON.stringify(actionGetScreens()));

        break;
    }

    return;

    switch (parsed.type) {
      case 'CLIENT_TYPE':
        parsed.value.client = client;

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

          client.send(JSON.stringify({
            type: 'CONNECTED'
          }));
        }

        break;
      case 'GET_DATA':
        host.client.send(message);

        break;
      case 'DATA':
        clients.forEach(({ client }) => client.send(message));

        break;

      default:
        host.client.send(message);
    }
  });

  client.on('close', function () {
    console.log('close', client.id);
    if (screens[client.id]) {
      delete screens[client.id];

      wss.clients.forEach(function (client) {
        client.send(JSON.stringify(actionGetScreens()));
      });
    }
  });
});
