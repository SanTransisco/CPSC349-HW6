var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];
var hasTopic = false;

console.log('websockets server started');

ws.on('connection', function (socket) {
  console.log('client connection established');

  messages.forEach(function (msg) {
    socket.send(msg);
  });

  socket.on('message', function (data) {
    console.log('message received: ' + data);
    var topic_check = data.search("/topic")
    //If the topic command was found
    if(topic_check !== -1){
      var topic = data.substring(topic_check+7);
      ws.clients.forEach(function (clientSocket) {
        clientSocket.send("*** Topic has changed to '"+ topic + "' ***");
      });

      if(hasTopic){
        messages[0] ="Topic is '"+ topic + "'"
      } else{
        messages.unshift("Topic is '"+ topic + "'" );
      }
      hasTopic = true;
    }
    //If
    else{
      messages.push(data);
      ws.clients.forEach(function (clientSocket) {
        clientSocket.send(data)
      });
    }



   
  });
});