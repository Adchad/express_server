const express = require('express')
const app = express()
const port = 8080
const WebSocket = require('ws');

    // Set up server
const wss = new WebSocket.Server({ port: 8081 });

var player_number=0



    // Wire up some logic for the connection event (when a client connects) 
wss.on('connection', function connection(ws) {

      // Wire up logic for the message event (when a client sends something)
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });


    });

      // Send a message
    ws.send('player-number:'+ player_number);
    player_number++;
});


app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
  console.log(__dirname +'/index.html');
})

app.use('/public', express.static(__dirname + '/public'));


app.listen(port, () => {
  console.log('Listening at http://localhost:'+port);

})