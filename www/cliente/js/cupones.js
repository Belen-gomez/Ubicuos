// let usuario;
const socket = io();
window.onload = async () => {
    let usuario;
    try {
        /* const response = await fetch('/getUser');
        if (!response.ok) { 
            throw new Error('No has iniciado sesión');
        }
        const user = await response.json(); */
        user = JSON.parse(localStorage.getItem('usuario'));
        document.title = `¡Bienvenido ${user.nombre}!`;
        usuario = user;
    } catch (error) {
        console.error('Error:', error);
    }
    // alert(usuario.nombre);
    // alert(usuario.email);
    // alert(usuario.n_compras);
    // alert(usuario.carrito.length);
    // usuario.carrito.forEach(element => {
    //     alert(element.producto);
    // });
    // usuario.cupones.forEach(element => {
    //     alert(element);
    // });
    // Make socket request to get carrito data
    // console.log(user.email);
    // socket.emit('getCarrito', user.email);
    comprobar_cupones(usuario);
    loadCupones(usuario.cupones);

};

// Generar los cupones
function loadCupones(cupones) {
    const productos = document.querySelector('.productos');
    productos.innerHTML = '';
    cupones.forEach(element => {
        const div = document.createElement('div');
        div.className = 'cupon';

        // Crear el elemento de texto
        const titulo = document.createElement('h2');
        titulo.textContent = 'Cupón ' + element;

        // Añadir la descripción al div
        productos.appendChild(titulo);

        // Crear el elemento de imagen
        const imagen = document.createElement('img');
        let path = "images/cupon_" + element + ".png";
        imagen.src = path;

        // Añadir la imagen al div
        div.appendChild(imagen);

        // Agregar el div al contenedor de productos en el HTML
        productos.appendChild(div);
    });
}

// Comprueba que tiene todos los cupones correctos
function comprobar_cupones(usuario) {
    // Comprobar cupón de camiseta
    let camiseta = false;
    let cupon_deseado = false;
    usuario.carrito.forEach(element => {
        if (element.producto == "Camiseta" && camiseta == false) {
            usuario.cupones.forEach(cupon => {
                if (cupon == "camiseta") {
                    cupon_deseado = true;
                }
            })
            camiseta = true;
        }
    })
    if (camiseta == true && cupon_deseado == false) {
        usuario.cupones.push("camiseta");
    }

    // Comprobar número de pedidos
    cupon_deseado = false
    if (usuario.n_compras >= 1) {
        usuario.cupones.forEach(cupon => {
            if (cupon == "mcqueen") {
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false) {
            usuario.cupones.push("mcqueen");
        }
    }

    cupon_deseado = false
    if (usuario.n_compras >= 2) {
        usuario.cupones.forEach(cupon => {
            if (cupon == "fnac") {
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false) {
            usuario.cupones.push("fnac");
        }
    }
    // Añadir a la base de datos
    const email = usuario.email;
    const cupones = usuario.cupones;
    const data = { email, cupones };
    localStorage.setItem('usuario', JSON.stringify(user));
    socket.emit('cupon', data);
}