const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');

const io = require('socket.io')(server);

const fs = require('fs');
const e = require('express');

app.use(express.static(__dirname + '/www'));

app.use(express.json());

//La parte de iniciar sesión y registro no está hecho con sockets. 
//Hemos considerado que el cliente se conecta al servidor una vez que ya haya iniciado sesion. A partir de ahi ya se hace toda la comunicación con sockets
//Hay dos bases de datos para almacenar la información de los usuarios de forma que se puedan conectar varios distintos usuarios a la vez.
//El usuario inicia sesión con su cuenta y se guarda ese usuario en LocalStorage para que se pueda usar durante toda su sesión. 

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    fs.readFile('registro.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error leyendo el archivo de registro:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const usuarios = JSON.parse(jsonString);
            const usuario = usuarios.find(user => user.email === email);
            if (!usuario) {
                res.status(401).json({ error: 'Correo no registrado' });
                return;
            }
            if (usuario.password !== password) {
                res.status(401).json({ error: 'Contraseña incorrecta' });
                return;
            }
            res.json(usuario);
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

// Ruta para manejar el registro y la autenticación
//Cuando se registra un nuevo usuario se guarda en el json de registro
app.post('/registro', (req, res) => {
    const { email, password, nombre } = req.body;
    fs.readFile('registro.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error leyendo el archivo de registro:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const usuarios = JSON.parse(jsonString);
            const usuario = usuarios.find(user => user.email === email);
            if (usuario) {
                res.status(401).json({ error: 'El correo ya está registrado. Inicie sesión con este correo' });
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
            nuevoUsuario.cupones.push({ nombre: "bienvenida",
                                        abierto: false,
                                        usado: false});
            usuarios.push(nuevoUsuario);
            fs.writeFile('registro.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log('Error escribiendo en el archivo de registro:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                res.json(nuevoUsuario);
            });
        } catch (err) {
            console.log('Error analizando el archivo de registro:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

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

//Todo el resto de la comunicación se hace a través de sockets
io.on('connection', function (socket) {

    //Todas las acciones que se hacen sobre el carrito llegan aqui. Se actualiza el carrito del usuario en la base de datos y se envía el mensaje correspondiente al usuario
    //Gracias a esa base de datos también evitamos que el usuario pierda todo us carrito si por ejemplo apaga el movil o sale de la aplicación por error.
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


    //Pago
    socket.on('pago', function (data) {
        const user = data.user;
        try{
            io.emit('pagoEmpleado', { ok: true, user});
        }
        catch (err) {
            io.emit('pagoEmpleado', { ok: false, message: 'Error interno del servidor' });
        }
    });
    //Cobrar
    socket.on('cobrar', function (data) {
        console.log('entra');
        const email = data.email;
        console.log(email);
        try{
            io.emit(email, { ok: true});
        }
        catch (err) {
            io.emit(email, { ok: false, message: 'Error interno del servidor' });
        }
    });
    
    // Cupones
    socket.on('cupon', function (data) {
        // const { email, new_cupones } = data;
        fs.readFile('registro.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de registro:', err);
                socket.emit('cuponResponse', { ok: false, message: 'Error interno del servidor' },);
                return;
            }
            try {
                const usuarios = JSON.parse(jsonString);
                const usuario = usuarios.find(user => user.email === data[0]);
                if (!usuario) {
                    socket.emit('cuponResponse', { ok: false, message: 'El usuario no está autentificado' });
                    return;
                }

                usuario.cupones = data[1];
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

    //Se obtienen todas las preguntas de la base de datos. 
    //Al empleado le salen todas preguntas de la base de datos.
    //El usuario filtra y solo le aparecen las preguntas con su correo.
    //De esta forma se guardan todas las preguntas que los usuarios van haciendo
    socket.on('getPreguntas', function (data) {
        fs.readFile('preguntas.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("Error leyendo el archivo de preguntas: ", err);
                io.emit('preguntasData', { ok: false, message: 'Error interno del servidor.' });
                return;
            }
            const preguntas = JSON.parse(jsonString);
            io.emit('preguntasData', { ok: true, preguntas });
        });
    });

    //Se añade la pregunta del usuario a la base de datos y se envía al empleado
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

    //Se añade la respuesta del empleado a la base de datos y se envía al usuario
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
                    // Eliminar las preguntas que tengan respuesta
                    io.emit('respuestaData', { ok: true, pregunta, respuesta });
                }
            })
        });
    });
    socket.on('pago_realizado', function (data) {
        const {email} = data;
        fs.readFile('registro.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log('Error leyendo el archivo de registro:', err);
                socket.emit('pagoResponse', { ok: false, message: 'Error interno del servidor', acc: accion },);
                return;
            }
            try {
                const usuarios = JSON.parse(jsonString);
                const usuario = usuarios.find(user => user.email === email);
                if (!usuario) {
                    socket.emit('pagoResponse', { ok: false, message: 'El usuario no está autentificado', acc: accion });
                    return;
                }

                usuario.carrito = [];
                usuario.n_compras += 1;
                fs.writeFile('registro.json', JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.log('Error escribiendo en el archivo de registro:', err);
                        res.status(500).send('Error interno del servidor');
                        return;
                    }
                    io.emit('pagoResponse', { ok: true, message: 'Pago realizado', email: email});
                });

            } catch (err) {
                console.log('Error analizando el archivo de registro:', err);
                socket.emit('carritoResponse', { ok: false, message: 'Error interno del servidor', acc: accion });
            }
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