const express = require('express');
const app = express();
/* const session = require('express-session'); */
const server = require('http').Server(app);
const path = require('path');

const io = require('socket.io')(server);

const fs = require('fs');

app.use(express.static(__dirname + '/www'));

app.use(express.json());

/* app.use(session({
  secret: 'user',
  resave: false,
  saveUninitialized: true
})); */

// Ruta para manejar el registro y la autenticación
app.post('/login', (req, res) => {
    const { email, password } = req.body;
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
            /* req.session.user = usuario;  // Guarda el usuario en la sesión
            res.cookie('sessionId', req.session.id); */
            res.send(usuario);
            /* res.status(200).send(usuario); */
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

// Ruta para manejar el registro y la autenticación
app.post('/registro', (req, res) => {
    const { email, password, nombre } = req.body;
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
                nombre: nombre,
                n_compras: 0,
                carrito: [],
                cupones: []
            };
            // Añadir cupón de bienvenida
            nuevoUsuario.cupones.push("bienvenida");
            usuarios.push(nuevoUsuario);

            /* req.session.user = nuevoUsuario;  // Guarda el usuario en la sesión
            res.cookie('sessionId', req.session.id); */
            fs.writeFile('registro.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log('Error escribiendo en el archivo de registro:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }
                res.send(nuevoUsuario);
            });
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

/* app.get('/getUser', (req, res) => {
  // Comprueba si el usuario ha iniciado sesión
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.status(401).send('No has iniciado sesión');
  }
}); */


//Código para acceder a un usuario, se puede usar en cualquier pagina
/* try {
  const response = await fetch('/getUser');
  if (!response.ok) {
    throw new Error('No has iniciado sesión');
  }
  const user = await response.json();
  document.title = `¡Bienvenido ${user.nombre}!`;
} catch (error) {
  console.error('Error:', error);
} */

/* Ruta para manejar la publicación de preguntas por el cliente */
/* app.post('/ask', (req, res) => {
  const { id, nombre, texto, respuesta } = req.body;
  const preguntas = JSON.parse(jsonString);
  fs.writeFile('preguntas.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('Error escribiendo en el archivo de registro:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
}) */



/* Ruta para manejar el inicio, registro y la autenticación del empleado */
app.post('/login-e', (req, res) => {
    const { number, password } = req.body;
    fs.readFile('empleados.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error leyendo el archivo de registro: 2', err);
            res.status(500).send('Error interno del servidor 2');
            return;
        }
        try {
            const empleados = JSON.parse(jsonString);
            const empleado = empleados.find(emp => emp.numberEmpleado === number);
            if (!empleado) {
                const nuevoEmpleado = {
                    numberEmpleado: number,
                    password: password
                };
                empleados.push(nuevoEmpleado);
                fs.writeFile('empleados.json', JSON.stringify(empleados, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.log('Error escribiendo en el archivo de registro: 3', err);
                        res.status(500).send('Error interno del servidor 3');
                        return;
                    }
                    else {
                        res.status(200).send('Registro exitoso');
                    }

                });
            }
            else if (empleado.password !== password) {
                res.status(401).send('Contraseña incorrecta');
                return;
            }
            else {
                res.status(200).send('Inicio de sesión exitoso');
            }
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            res.status(500).send('Error interno del servidor');
        }
    });
});


io.on('connection', function (socket) {
    console.log("Nuevo cliente conectado");

    /* socket.on('login', function(data){
      const { email, password } = data;
      fs.readFile('registro.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error leyendo el archivo de registro:', err);
            socket.emit('loginResponse', {ok: false, message: 'Error interno del servidor'});
            return;
        }
        try {
            const usuarios = JSON.parse(jsonString);
            const usuario = usuarios.find(user => user.email === email);
            if (!usuario) {
                socket.emit('loginResponse', {ok: false, message: 'El correo no está registrado'});
                return;
            }
            if (usuario.password !== password) {
                socket.emit('loginResponse', {ok: false, message: 'Contraseña incorrecta'});
                return;
            }
            socket.emit('loginResponse', {ok: true, message: 'Inicio de sesión exitoso'});
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            socket.emit('loginResponse', {ok: false, message: 'Error interno del servidor'});
        }
      });
    }); */


    socket.on('carrito', function (data) {
        const { email, carrito, accion } = data;
        fs.readFile('registro.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de registro:', err);
                socket.emit('carritoResponse', { ok: false, message: 'Error interno del servidor', acc: accion },);
                return;
            }
            try {
                const usuarios = JSON.parse(jsonString);
                const usuario = usuarios.find(user => user.email === email);
                if (!usuario) {
                    socket.emit('carritoResponse', { ok: false, message: 'El usuario no está autentificado', acc: accion });
                    return;
                }

                usuario.carrito = carrito;
                fs.writeFile('registro.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.log('Error escribiendo en el archivo de registro:', err);
                        res.status(500).send('Error interno del servidor');
                        return;
                    }
                    socket.emit('carritoResponse', { ok: true, message: 'Carrito actualizado', acc: accion });
                });

            } catch (err) {
                console.log('Error analizando el archivo de registro:', err);
                socket.emit('carritoResponse', { ok: false, message: 'Error interno del servidor', acc: accion });
            }
        });
    });

    // Cupones
    socket.on('cupon', function (data) {
        const { email, cupones } = data;
        fs.readFile('registro.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de registro:', err);
                socket.emit('cuponResponse', { ok: false, message: 'Error interno del servidor' },);
                return;
            }
            try {
                const usuarios = JSON.parse(jsonString);
                const usuario = usuarios.find(user => user.email === email);
                if (!usuario) {
                    socket.emit('cuponResponse', { ok: false, message: 'El usuario no está autentificado' });
                    return;
                }

                usuario.cupones = cupones;
                fs.writeFile('registro.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.log('Error escribiendo en el archivo de registro:', err);
                        res.status(500).send('Error interno del servidor');
                        return;
                    }
                    socket.emit('cuponResponse', { ok: true, message: 'Cupon actualizado' });
                });

            } catch (err) {
                console.log('Error analizando el archivo de registro:', err);
                socket.emit('cuponResponse', { ok: false, message: 'Error interno del servidor' });
            }
        });
    });


    /* Preguntas */
    socket.on('getPreguntas', function (data) {
        fs.readFile('preguntas.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("Error leyendo el archivo de preguntas: ", err);
                io.emit('preguntasData', { ok: false, message: 'Error interno del servidor.' });
                return;
            }
            const preguntas = JSON.parse(jsonString);
            io.emit('preguntasData', { ok: true, preguntas });
            // Eliminar las preguntas que tengan respuesta
            /*
            const preguntasSinRespuesta = preguntas.filter(pregunta => !pregunta.respuesta);
            io.emit('preguntasData', { ok: true, preguntas: preguntasSinRespuesta });
            */
        });
    });


    /*socket.on('textMessage', (data) => {
      let questions = require('./preguntas.json');
      questions.push(data);
      fs.writeFileSync('preguntas.json', JSON.stringify(questions, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error escribiendo en el archivo de registro:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
        const preguntas = JSON.parse(questions);
        socket.emit('preguntasData', {ok: true, preguntas});
      });
    });*/

    socket.on('textMessage', (data) => {
        fs.readFile('preguntas.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de preguntas:', err);
                io.emit('preguntasData', { ok: false, message: 'Error interno del servidor.' });
                return;
            }
            let preguntas = JSON.parse(jsonString);
            preguntas.push(data);

            fs.writeFile('preguntas.json', JSON.stringify(preguntas, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log('Error leyendo el archivo de preguntas: ', err);
                    io.emit('preguntasData', { ok: false, message: 'Error interno del servidor.' });
                }
                else {
                    io.emit('preguntasData', { ok: true, preguntas });
                }
            })
        });
    });

    socket.on('resPregunta', (data) => {
        const { pregunta, respuesta } = data;
        fs.readFile('preguntas.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de preguntas:', err);
                io.emit('respuestaData', { ok: false, message: 'Error interno del servidor.' });
                return;
            }
            let preguntas = JSON.parse(jsonString);
            const preguntaIndex = preguntas.findIndex(p => p.texto === pregunta);
            preguntas[preguntaIndex].respuesta = respuesta;

            fs.writeFile('preguntas.json', JSON.stringify(preguntas, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log('Error leyendo el archivo de preguntas: ', err);
                    io.emit('respuestaData', { ok: false, message: 'Error interno del servidor.' });
                }
                else {
                    // io.emit('preguntasData', { ok: true, preguntas });
                    io.emit('respuestaData', { ok: true, pregunta, respuesta });
                }
            })
        });
    });



    socket.on("message_evt", function (message) {
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
}*/


// En el lado del servidor
/* const fs = require('fs');

io.on('connection', function(socket){
  console.log("Nuevo cliente conectado");

  socket.on('login', function(data){
    const { email, password } = data;
    fs.readFile('registro.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log('Error leyendo el archivo de registro:', err);
          socket.emit('loginResponse', {ok: false, message: 'Error interno del servidor'});
          return;
      }
      try {
          const usuarios = JSON.parse(jsonString);
          const usuario = usuarios.find(user => user.email === email);
          if (!usuario) {
              socket.emit('loginResponse', {ok: false, message: 'El correo no está registrado'});
              return;
          }
          if (usuario.password !== password) {
              socket.emit('loginResponse', {ok: false, message: 'Contraseña incorrecta'});
              return;
          }
          socket.emit('loginResponse', {ok: true, message: 'Inicio de sesión exitoso'});
      } catch (err) {
          console.log('Error analizando el archivo de registro:', err);
          socket.emit('loginResponse', {ok: false, message: 'Error interno del servidor'});
      }
    });
  });
}); */

// io.on('connection', (socket) => {
//   console.log('Empleado conectado');

//   socket.on('clientConnected', (client) => {
//     console.log(`Cliente ${client.id} está cerca`);

//     // Leer el archivo clientes.json
//     fs.readFile('clientes.json', 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error al leer el archivo:', err);
//         return;
//       }

//       // Parsear los datos JSON
//       let clientes = JSON.parse(data);

//       // Añadir el nuevo cliente a la lista
//       clientes.push({
//         email: client.email,
//         nombre: client.name,
//         carrito: client.shoppingList
//       });

//       // Escribir los datos actualizados de nuevo al archivo
//       fs.writeFile('empleado/clientes.json', JSON.stringify(clientes, null, 2), (err) => {
//         if (err) {
//           console.error('Error al escribir en el archivo:', err);
//         }
//       });
//     });
//   });
// });
