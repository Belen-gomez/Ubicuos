const express = require('express');
const app = express();
const session = require('express-session');
const server = require('http').Server(app);
const path = require('path');

const io = require('socket.io')(server);

const fs = require('fs');

app.use(express.static(__dirname + '/www'));

app.use(express.json());
app.use(session({
  secret: 'tu secreto',
  resave: false,
  saveUninitialized: true
}));

// Ruta para manejar el registro y la autenticación
app.post('/login', (req, res) => {
  fs.readFile('registro.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log('Error leyendo el archivo de registro:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(200).send(jsonString);
  });
});
/* app.post('/login', (req, res) => {
  let body = '';
  req.on('data', chunk => {
      console.log("hola");
      body += chunk.toString();
  });
  req.on('end', () => {
      const data = JSON.parse(body);
      const { email, password } = data;
      fs.readFile('registro.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log('Error leyendo el archivo de registro:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      try {
          const usuarios = JSON.parse(jsonString);
          const usuario = usuarios.find(user => user.email === email);
          if (!usuario) {
              res.status(401).send('El correo no está registrado');
              return;
          }
          if (usuario.password !== password) {
              res.status(401).send('Contraseña incorrecta');
              return;
          }
          res.status(200).send('Inicio de sesión exitoso');
      } catch (err) {
          console.log('Error analizando el archivo de registro:', err);
          res.status(500).send('Error interno del servidor');
      }
  });
  });
}); */
// Ruta para manejar el registro y la autenticación
app.post('/registro', (req, res) => {
  const { email, password, conf_password, nombre } = req.body;
      fs.readFile('registro.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log('Error leyendo el archivo de registro:', err);
          res.status(500).send('Error interno del servidor');
          return;
      }
      try {
          const usuarios = JSON.parse(jsonString);
          const usuario = usuarios.find(user => user.email === email);
          if (usuario) {
              res.status(401).send('El correo ya está registrado. Inicie sesión con este correo');
              return;
          }
          const nuevoUsuario = {
            email: email,
            password: password,
            nombre: nombre
          };
          usuarios.push(nuevoUsuario);
          fs.writeFile('registro.json', JSON.stringify(usuarios), 'utf8', (err) => {
            if (err) {
              console.log('Error escribiendo en el archivo de registro:', err);
              res.status(500).send('Error interno del servidor');
              return;
            }
            res.status(200).send('Registro exitoso');
          });
      } catch (err) {
          console.log('Error analizando el archivo de registro:', err);
          res.status(500).send('Error interno del servidor');
      }
    });
  });

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