const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const io = require('socket.io')(server);

app.use(express.static(__dirname + '/www'));

let clientSocket;

io.on('connection', function(socket){
  console.log("Nuevo cliente conectado");

  socket.on("message_evt", function(message){
    console.log(socket.id, message);
    socket.broadcast.emit("message_evt", message);
  });
});

server.listen(8080, () => {
  console.log("Server listening...");
});

/* const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fs = require('fs');

app.use(express.static('www'));

io.on("connection", function(socket){
  console.log("nuevo cliente");

  // Leer el archivo clientes.json
  fs.readFile('/www/empleado/clientes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }

    // Emitir los datos a través de socket.io
    socket.emit('load_clients', JSON.parse(data));
  });

  socket.on("message_evt", function(message){
    console.log(socket.id, message);
    socket.broadcast.emit("message_evt", message);
  });
});

server.listen(8080, () => console.log('server started'));
 */