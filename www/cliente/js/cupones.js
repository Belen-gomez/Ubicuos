// let usuario;
const socket = io();
window.onload = async () => {
    let usuario;
    try {
        const response = await fetch('/getUser');
        if (!response.ok) { 
            throw new Error('No has iniciado sesión');
        }
        const user = await response.json();
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
function loadCupones(cupones){
    const productos = document.querySelector('.productos');
    productos.innerHTML = '';
    cupones.forEach(element => {
        const div = document.createElement('div');
        div.className = 'cupon';

        const texto = document.createElement('div');
        texto.className = 'texto';

        // Crear un nuevo div para la descripción y la imagen
        const contenido = document.createElement('div');
        contenido.className = 'contenido';
        
        // Crear el elemento de texto
        const descripcion = document.createElement('h2');
        descripcion.textContent = 'Cupón ' + element;

        // Añadir la descripción al div
        contenido.appendChild(descripcion);
        div.appendChild(contenido);

        // Crear el elemento de imagen
        const imagen = document.createElement('img');
        let path = "images/cupon_"+element+".png";
        imagen.src = path;

        // Añadir la imagen al div
        div.appendChild(imagen);

        // Agregar el div al contenedor de productos en el HTML
        productos.appendChild(div);
        });
}

// Comprueba que tiene todos los cupones correctos
function comprobar_cupones(usuario){
    // Comprobar cupón de camiseta
    let camiseta = false;
    let cupon_deseado = false;
    usuario.carrito.forEach(element => {
        if (element.producto == "Camiseta" && camiseta == false){
            usuario.cupones.forEach(cupon => {
                if (cupon == "camiseta"){
                    cupon_deseado = true;
                }
            })
            camiseta = true;
        }
    })
    if (camiseta == true && cupon_deseado == false){
        usuario.cupones.push("camiseta");
    }
    // Comprobar número de pedidos
    cupon_deseado = false
    if (usuario.n_compras >= 1){
        usuario.cupones.forEach(cupon => {
            if (cupon == "mcqueen"){
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false){
            usuario.cupones.push("mcqueen");
        }
    }

    cupon_deseado = false
    if (usuario.n_compras >= 2){
        usuario.cupones.forEach(cupon => {
            if (cupon == "fnac"){
                cupon_deseado = true;
            }
        })
        if (cupon_deseado == false){
            usuario.cupones.push("fnac");
        }
    }
    // Añadir a la base de datos
    const email = usuario.email;
    const cupones = usuario.cupones;
    const data = {email, cupones};
    socket.emit('cupon', data);
}