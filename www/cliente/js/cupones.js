let usuario;
const socket = io();
window.onload = async () => {
    try {
        user = JSON.parse(localStorage.getItem('usuario'));
        document.title = `¡Bienvenido ${user.nombre}!`;
        usuario = user;
    } catch (error) {
        console.error('Error:', error);
    }
    comprobar_cupones(usuario);
    loadCupones(usuario.cupones);
};

// Generar los cupones
function loadCupones(cupones) {
    const productos = document.querySelector('.productos');
    productos.innerHTML = '';
    let nuevos_cupones = [];
    cupones.forEach(cupon => {
        if (!cupon.usado){

            const div = document.createElement('div');
            div.className = 'cupon';

            // Crear el elemento de texto
            const titulo = document.createElement('h2');

            // Añadir la descripción al div
            productos.appendChild(titulo);

            // Crear el elemento de imagen
            const imagen = document.createElement('img');

            // Comprobar si está abierto
            let path;
            if (!cupon.abierto){
                path = "images/regalo.gif";
                titulo.textContent = "¡Agita para canjear!"
                // Añade el agitado
                function handleMotion(event) {
                    const acceleration = event.accelerationIncludingGravity;
                    const agitacion = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);

                    if (agitacion > 100) {
                        titulo.textContent = 'Cupón ' + cupon.nombre;
                        path = "images/cupon_" + cupon.nombre + ".png";
                        imagen.src = path;
                        window.removeEventListener('devicemotion', handleMotion);
                    }
                }

                window.addEventListener('devicemotion', handleMotion);
            }
            else {
                titulo.textContent = 'Cupón ' + cupon.nombre;
                path = "images/cupon_" + cupon.nombre + ".png";
            }
            imagen.src = path;

            // Añadir la imagen al div
            div.appendChild(imagen);

            // Agregar el div al contenedor de productos en el HTML
            productos.appendChild(div);


            cupon.abierto = true;
            nuevos_cupones.push(cupon);
        }
    });
    const email = usuario.email;
    const lista = [email, usuario.cupones];
    localStorage.setItem('usuario', JSON.stringify(user));
    socket.emit('cupon', lista);
}

// Comprueba que tiene todos los cupones correctos
function comprobar_cupones(usuario) {
    // Comprobar cupón de camiseta
    let camiseta = false;
    let cupon_deseado = false;
    usuario.carrito.forEach(element => {
        if (element.producto == "Camiseta" && camiseta == false) {
            usuario.cupones.forEach(cupon => {
                if (cupon.nombre == "camiseta") {
                    cupon_deseado = true;
                }
            })
            camiseta = true;
        }
    })
    if (camiseta == true && cupon_deseado == false) {
        usuario.cupones.push({  nombre: "camiseta",
                                abierto: false,
                                usado: false});
    }

    // Comprobar número de pedidos
    cupon_deseado = false
    if (usuario.n_compras >= 2) {
        usuario.cupones.forEach(cupon => {
            if (cupon.nombre == "mcqueen") {
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false) {
            usuario.cupones.push({  nombre: "mcqueen",
                                    abierto: false,
                                    usado: false});
        }
    }

    cupon_deseado = false
    if (usuario.n_compras >= 1) {
        usuario.cupones.forEach(cupon => {
            if (cupon.nombre == "fnac") {
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false) {
            usuario.cupones.push({  nombre: "fnac",
                                    abierto: false,
                                    usado: false});
        }
    }
    // Añadir a la base de datos
    const email = usuario.email;
    // const cupones = usuario.cupones;
    const lista = [usuario.email, usuario.cupones];
    // const data = { email, cupones };
    localStorage.setItem('usuario', JSON.stringify(user));
    socket.emit('cupon', lista);
}