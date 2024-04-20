let user;
let email;
let cupones;
let carrito = [];
const socket = io();
// Espera a que la página se cargue completamente
window.onload = async function () {
    try {
        user = JSON.parse(localStorage.getItem('usuario'));
        // Al cargar la página primero se obtiene el carrito que tiene el usuario guardado

        carrito = user.carrito;
        email = user.email;
        if (carrito.length === 0) { 
            alert("Antes de pagar tiene que añadir productos a tu carrito"); 
            window.location.href = 'carrito.html';
        }
        console.log(email);

        socket.on(email, function (data) {
            if (data.ok) {
                NFC();
            }
            else {
                alert("Error en el pago")
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }

};

// Verifica si el navegador soporta la API Web NFC
async function NFC() {
    if ('NDEFReader' in window) {
        const ndef = new NDEFReader();
        const pagar = document.getElementById('pagar');
        pagar.style.display = 'block';

        pagar.onclick = async () => {
            gif = document.querySelector('.gif_nfc');
            gif.style.display = 'block';
            try {

                // Solicita permiso para leer etiquetas NFC
                await ndef.scan();

                console.log("Escaneo iniciado exitosamente.");
                //this.preventDefault();
                // Define qué hacer cuando se lee una nueva etiqueta NFC
                ndef.onreading = function ({ message, serialNumber }) {
                    console.log(`Etiqueta NFC leída con número de serie: ${serialNumber}`);
                    //if(serialNumber === "ff:0f:99:f9:01:00:00"){
                    //ff:0f:99:f9:01:00:00
                    
                    alert("Compra realizada con éxito. ¡Vuelva pronto!");
                    user.n_compras += 1;
                    user.carrito = [];
                    socket.emit("pago_realizado", { email: email });
                    localStorage.setItem('usuario', JSON.stringify(user));
                    window.location.href = 'carrito.html';
                    //}

                };
            } catch (error) {
                console.log(`Error al iniciar el escaneo: ${error}.`);
                // Manejar el error de escaneo NFC aquí
            }
        }
    } else {
        console.log("Tu navegador no soporta la API Web NFC.");
        // Mostrar mensaje de error o realizar otra acción
    }
}

function loadProductos(carrito) {
    // Mostrar todos los productos del carrito en la pantalla
    let total = 0;
    const texto2 = document.getElementById('texto2');
    texto2.style.display = 'block';
    const listaProductos = document.querySelector('.productos');
    carrito.forEach(producto => {
        console.log(carrito);
        const elemento = document.createElement('li');

        let precio = Number(producto.precio.slice(0, -1));
        if (producto.cantidad > 1) {
            let precio_total = producto.cantidad * precio;
            elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${precio_total}€`;
            total += precio_total;
        }
        else {
            elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${producto.precio}`;
            total += precio;
        }

        //elemento.appendChild(document.createElement('p')).textContent = producto.;
        listaProductos.appendChild(elemento);
    });
    cupones = user.cupones;
    let nuevos_cupones = [];
    cupones.forEach(cupon => {
        // alert("Hola "+cupon.nombre);
        let res = false;
        if (cupon.nombre==='bienvenida' && !cupon.usado){
            res = confirm("Tienes un cupón de bienvenida. ¿Quieres usarlo y ahorrar 5€ en tu compra? ");
            if(res){
                total = total - 5;
                if (total < 0){
                    total = 0;
                }
            }
        }
        else if (cupon.nombre === 'camiseta' && !cupon.usado){
            let numero = 0;
            if (carrito.forEach(producto => {
                if (producto.nombre === 'Camiseta'){
                    numero += 1;
                }
            }) >= 3){
                res = confirm("Tienes un cupón de camiseta. ¿Quieres usarlo? ");
                if(res){
                    total = total - 15;
                }
            }
        }
        else if (cupon.nombre==='fnac' && !cupon.usado){
            let electronica = false;
            carrito.forEach(producto => {
                if (producto.nombre === 'ordenador'){
                    electronica = true;
                }
            })
            if (electronica){
                res = confirm("Tienes un cupón en electrónica. ¿Quieres usarlo y ahorrar 10% en tu compra? ");
                if(res){
                    total = total*0.9;
                }
            }
        }
        if (res == true){
            cupon.usado = true;
            nuevos_cupones.push(cupon);
        }
        if (res == false){
            //confirm(cupon.nombre);
            nuevos_cupones.push(cupon);
        }
    });
    // Añadir a la base de datos
    const email = user.email;
    const cupones_actualizados = nuevos_cupones;
    
    // const data = { email, cupones_actualizados };
    const data = [email, cupones_actualizados];
    localStorage.setItem('usuario', JSON.stringify(user));
    socket.emit('cupon', data);

    total = parseFloat(total.toFixed(2));
    const totalElement = document.createElement('p');
    totalElement.textContent = 'Total: ' + total + '€';
    listaProductos.appendChild(totalElement);
}

//al darle al boton de seleccionar caja se pide el bluetooth
const boton = document.getElementById('selCaja');
boton.addEventListener('click', async () => {
    // Solicita al usuario que seleccione un dispositivo Bluetooth
    const dispositivo = await navigator.bluetooth.requestDevice({
         filters: [{ services: ['heart_rate'] }] 
    });

    // Conecta al dispositivo seleccionado
    const servidor = await dispositivo.gatt.connect();

    // Aquí puedes realizar operaciones con el dispositivo Bluetooth conectado
    loadProductos(carrito);
    console.log('Conexión establecida con éxito:', dispositivo.name);
    boton.style.display = 'none';
    const texto = document.getElementById('texto');
    texto.style.display = 'none';

    let data = { user };
    socket.emit('pago', data);

});
